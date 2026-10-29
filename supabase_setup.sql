-- CINÉFIA — Autenticação, perfis, comentários/avaliações compartilhados e favoritos na nuvem
-- Execute TODO este arquivo no Supabase Dashboard > SQL Editor > New query > Run.
-- A senha nunca é armazenada nestas tabelas: permanece sob controle do Supabase Auth.

-- Funções auxiliares ficam em um schema interno, fora do Data API público.
create schema if not exists cinefia_internal;
revoke all on schema cinefia_internal from public, anon, authenticated;

-- 1) Perfil privado: cada usuário só consegue consultar seu próprio registro.
create table if not exists public.cinefia_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null default 'Usuário Cinéfia'
        check (char_length(display_name) between 1 and 40),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table public.cinefia_profiles enable row level security;
alter table public.cinefia_profiles force row level security;
revoke all on table public.cinefia_profiles from anon, authenticated;
grant select, insert, update on table public.cinefia_profiles to authenticated;
drop policy if exists "Cinéfia: usuário lê apenas o próprio perfil" on public.cinefia_profiles;
create policy "Cinéfia: usuário lê apenas o próprio perfil" on public.cinefia_profiles
    for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário cria apenas o próprio perfil" on public.cinefia_profiles;
create policy "Cinéfia: usuário cria apenas o próprio perfil" on public.cinefia_profiles
    for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário atualiza apenas o próprio perfil" on public.cinefia_profiles;
create policy "Cinéfia: usuário atualiza apenas o próprio perfil" on public.cinefia_profiles
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- 2) Nome público separado: sem e-mail; usado para identificar autores de comentários.
create table if not exists public.cinefia_public_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null check (char_length(display_name) between 3 and 32),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create unique index if not exists cinefia_public_profiles_display_name_lower_uidx
    on public.cinefia_public_profiles (lower(display_name));
alter table public.cinefia_public_profiles enable row level security;
revoke all on table public.cinefia_public_profiles from anon, authenticated;
grant select on table public.cinefia_public_profiles to anon, authenticated;
grant insert, update on table public.cinefia_public_profiles to authenticated;
drop policy if exists "Cinéfia: nomes públicos podem ser lidos" on public.cinefia_public_profiles;
create policy "Cinéfia: nomes públicos podem ser lidos" on public.cinefia_public_profiles
    for select to anon, authenticated using (true);
drop policy if exists "Cinéfia: cada usuário cria seu nome público" on public.cinefia_public_profiles;
create policy "Cinéfia: cada usuário cria seu nome público" on public.cinefia_public_profiles
    for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: cada usuário atualiza seu nome público" on public.cinefia_public_profiles;
create policy "Cinéfia: cada usuário atualiza seu nome público" on public.cinefia_public_profiles
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- Cria automaticamente um nome público não identificável para novas contas.
create or replace function cinefia_internal.cinefia_create_public_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.cinefia_public_profiles (user_id, display_name)
    values (new.id, 'Cinefia-' || lower(substr(replace(new.id::text, '-', ''), 1, 8)))
    on conflict (user_id) do nothing;
    return new;
end;
$$;
revoke all on function cinefia_internal.cinefia_create_public_profile_for_user() from public, anon, authenticated;
drop trigger if exists cinefia_auth_user_created_public_profile on auth.users;
create trigger cinefia_auth_user_created_public_profile
    after insert on auth.users
    for each row execute function cinefia_internal.cinefia_create_public_profile_for_user();
-- Preenche contas já existentes sem copiar e-mail ou outros dados pessoais.
insert into public.cinefia_public_profiles (user_id, display_name)
select u.id, 'Cinefia-' || lower(substr(replace(u.id::text, '-', ''), 1, 8))
from auth.users u
on conflict (user_id) do nothing;

-- 3) Comentários e notas comunitárias, públicos para leitura e escritos apenas pelo autor.
-- Uma conta tem uma avaliação por filme/série e pode atualizar a própria nota/opinião.
create table if not exists public.cinefia_comments (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    media_type text not null check (media_type in ('movie', 'tv')),
    tmdb_id bigint not null check (tmdb_id > 0),
    body text not null default '' check (char_length(body) <= 2000),
    rating numeric(3,1) not null check (rating >= 0 and rating <= 10),
    display_name text not null default 'Usuário Cinéfia',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, media_type, tmdb_id)
);
create index if not exists cinefia_comments_title_created_idx
    on public.cinefia_comments (media_type, tmdb_id, created_at desc);
create index if not exists cinefia_comments_user_id_idx on public.cinefia_comments (user_id);
alter table public.cinefia_comments enable row level security;
revoke all on table public.cinefia_comments from anon, authenticated;
grant select on table public.cinefia_comments to anon, authenticated;
grant insert, update, delete on table public.cinefia_comments to authenticated;
grant usage, select on sequence public.cinefia_comments_id_seq to authenticated;
drop policy if exists "Cinéfia: comentários publicados podem ser lidos" on public.cinefia_comments;
create policy "Cinéfia: comentários publicados podem ser lidos" on public.cinefia_comments
    for select to anon, authenticated using (true);
drop policy if exists "Cinéfia: usuário publica apenas sua avaliação" on public.cinefia_comments;
create policy "Cinéfia: usuário publica apenas sua avaliação" on public.cinefia_comments
    for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário atualiza apenas sua avaliação" on public.cinefia_comments;
create policy "Cinéfia: usuário atualiza apenas sua avaliação" on public.cinefia_comments
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário apaga apenas sua avaliação" on public.cinefia_comments;
create policy "Cinéfia: usuário apaga apenas sua avaliação" on public.cinefia_comments
    for delete to authenticated using ((select auth.uid()) = user_id);

-- O display_name é definido pelo banco; o navegador não pode fingir ser outra pessoa.
create or replace function cinefia_internal.cinefia_set_comment_display_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    author_name text;
begin
    select p.display_name into author_name
    from public.cinefia_public_profiles p
    where p.user_id = new.user_id;
    new.display_name := coalesce(author_name, 'Usuário Cinéfia');
    new.updated_at := now();
    return new;
end;
$$;
revoke all on function cinefia_internal.cinefia_set_comment_display_name() from public, anon, authenticated;
drop trigger if exists cinefia_comments_set_display_name on public.cinefia_comments;
create trigger cinefia_comments_set_display_name
    before insert or update on public.cinefia_comments
    for each row execute function cinefia_internal.cinefia_set_comment_display_name();

-- 4) Favoritos particulares por conta. Não são visíveis a visitantes nem a outros usuários.
create table if not exists public.cinefia_favorites (
    user_id uuid not null references auth.users(id) on delete cascade,
    media_type text not null check (media_type in ('movie', 'tv')),
    tmdb_id bigint not null check (tmdb_id > 0),
    title text not null check (char_length(title) between 1 and 300),
    created_at timestamptz not null default now(),
    primary key (user_id, media_type, tmdb_id)
);
create index if not exists cinefia_favorites_user_created_idx
    on public.cinefia_favorites (user_id, created_at desc);
alter table public.cinefia_favorites enable row level security;
revoke all on table public.cinefia_favorites from anon, authenticated;
grant select, insert, update, delete on table public.cinefia_favorites to authenticated;
drop policy if exists "Cinéfia: usuário lê apenas seus favoritos" on public.cinefia_favorites;
create policy "Cinéfia: usuário lê apenas seus favoritos" on public.cinefia_favorites
    for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário insere apenas seus favoritos" on public.cinefia_favorites;
create policy "Cinéfia: usuário insere apenas seus favoritos" on public.cinefia_favorites
    for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário atualiza apenas seus favoritos" on public.cinefia_favorites;
create policy "Cinéfia: usuário atualiza apenas seus favoritos" on public.cinefia_favorites
    for update to authenticated using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
drop policy if exists "Cinéfia: usuário remove apenas seus favoritos" on public.cinefia_favorites;
create policy "Cinéfia: usuário remove apenas seus favoritos" on public.cinefia_favorites
    for delete to authenticated using ((select auth.uid()) = user_id);

-- RESUMO DE PERMISSÕES:
-- * Visitantes podem somente ler comentários/avaliações públicas.
-- * Para publicar, atualizar ou apagar uma avaliação, a conta precisa estar autenticada,
--   e a política RLS restringe a operação ao registro do próprio user_id.
-- * Favoritos e perfis privados são isolados por conta.
-- * Nunca coloque uma chave service_role/sb_secret no frontend.
