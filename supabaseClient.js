/*
 * Cliente Supabase usado pelo site estático do Cinéfia.
 * A chave publishable pode aparecer no navegador; nunca substitua por uma chave secret/service_role.
 * Para este arquivo, use a URL-base do projeto, sem /rest/v1/.
 */
window.cinefiaSupabaseReady = import('https://esm.sh/@supabase/supabase-js@2')
    .then(({ createClient }) => {
        const supabaseUrl = 'https://lwizmrqmtbxnxivnjhpa.supabase.co';
        const supabaseKey = 'sb_publishable_qXbC8hMXisdaoidhWkAoRw_BoOo55Ne';
        const client = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        window.cinefiaSupabase = client;
        return client;
    })
    .catch((error) => {
        console.error('Não foi possível carregar @supabase/supabase-js:', error);
        window.cinefiaSupabaseError = error;
        return null;
    });
