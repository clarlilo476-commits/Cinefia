// CHAVES DE API EMBUTIDAS DIRETAMENTE NO CÓDIGO
        let TMDB_API_KEY = localStorage.getItem('tmdb_api_key') || '23072480c9c99e9f8c5f652f3c3de734';
        const OMDB_API_KEY = '61e993b7';

        const BASE_URL = 'https://api.themoviedb.org/3';
        const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

        let currentMode = 'home';
        let currentSearchQuery = '';
        let currentCategory = 'all';
        let currentPage = 1;
        let totalPages = 1;
        const TITLES_PER_PAGE = 32;
        const TMDB_PAGE_SIZE = 20;
        const TMDB_PAGE_LIMIT = 500;
        const catalogCache = new Map();
        let catalogRequest = 0;
        let currentGenreSearch = null; // Guarda a configuração da pesquisa inteligente por gênero (ex.: "anime", "dorama", "terror", "ação").

        let searchTimeout;
        const searchInput = document.getElementById('searchInput');

        // LÓGICA DO CARROSSEL
        let heroSlides = [];
        let currentHeroSlide = 0;
        let heroInterval;

        // --- PESQUISA INTELIGENTE POR GÊNERO ---
        // Permite que termos como "anime", "dorama", "terror" ou "ação" tragam direto os
        // filmes/séries mais bem avaliados daquele gênero, em vez de uma busca textual comum.
        const GENRE_SEARCH_MAP = {
            // Gêneros disponíveis no Cinéfia (mesmos do filtro avançado), com sinônimos comuns.
            'acao': { movieGenre: 28, tvGenre: 10759, label: 'Ação' },
            'ação': { movieGenre: 28, tvGenre: 10759, label: 'Ação' },
            'acoes': { movieGenre: 28, tvGenre: 10759, label: 'Ação' },
            'ações': { movieGenre: 28, tvGenre: 10759, label: 'Ação' },
            'aventura': { movieGenre: 12, tvGenre: 10759, label: 'Aventura' },
            'aventuras': { movieGenre: 12, tvGenre: 10759, label: 'Aventura' },
            'comedia': { movieGenre: 35, tvGenre: 35, label: 'Comédia' },
            'comédia': { movieGenre: 35, tvGenre: 35, label: 'Comédia' },
            'comedias': { movieGenre: 35, tvGenre: 35, label: 'Comédia' },
            'drama': { movieGenre: 18, tvGenre: 18, label: 'Drama' },
            'dramas': { movieGenre: 18, tvGenre: 18, label: 'Drama' },
            'terror': { movieGenre: 27, label: 'Terror' },
            'horror': { movieGenre: 27, label: 'Terror' },
            'medo': { movieGenre: 27, label: 'Terror' },
            'assustador': { movieGenre: 27, label: 'Terror' },
            'assombrado': { movieGenre: 27, label: 'Terror' },
            'romance': { movieGenre: 10749, label: 'Romance' },
            'romances': { movieGenre: 10749, label: 'Romance' },
            'ficcao cientifica': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'ficção científica': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'ficcao': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'ficção': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'sci-fi': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'scifi': { movieGenre: 878, tvGenre: 10765, label: 'Ficção Científica' },
            'fantasia': { movieGenre: 14, tvGenre: 10765, label: 'Fantasia' },
            'animacao': { movieGenre: 16, tvGenre: 16, label: 'Animação' },
            'animação': { movieGenre: 16, tvGenre: 16, label: 'Animação' },
            'animado': { movieGenre: 16, tvGenre: 16, label: 'Animação' },
            'anime': { movieGenre: 16, tvGenre: 16, originLanguage: 'ja', label: 'Anime' },
            'animes': { movieGenre: 16, tvGenre: 16, originLanguage: 'ja', label: 'Anime' },
            'dorama': { tvGenre: 18, originLanguage: 'ko', label: 'Doramas' },
            'doramas': { tvGenre: 18, originLanguage: 'ko', label: 'Doramas' },
            'kdrama': { tvGenre: 18, originLanguage: 'ko', label: 'Doramas' },
            'k-drama': { tvGenre: 18, originLanguage: 'ko', label: 'Doramas' },
            'novela coreana': { tvGenre: 18, originLanguage: 'ko', label: 'Doramas' },
            'crime': { movieGenre: 80, tvGenre: 80, label: 'Crime' },
            'policial': { movieGenre: 80, tvGenre: 80, label: 'Crime' },
            'policiais': { movieGenre: 80, tvGenre: 80, label: 'Crime' },
            'documentario': { movieGenre: 99, tvGenre: 99, label: 'Documentário' },
            'documentário': { movieGenre: 99, tvGenre: 99, label: 'Documentário' },
            'documentarios': { movieGenre: 99, tvGenre: 99, label: 'Documentário' },
            'mistério': { movieGenre: 9648, tvGenre: 9648, label: 'Mistério' },
            'misterio': { movieGenre: 9648, tvGenre: 9648, label: 'Mistério' },
            'suspense': { movieGenre: 9648, tvGenre: 9648, label: 'Mistério' },
            'thriller': { movieGenre: 9648, tvGenre: 9648, label: 'Mistério' },
            'faroeste': { movieGenre: 37, tvGenre: 37, label: 'Faroeste' },
            'western': { movieGenre: 37, tvGenre: 37, label: 'Faroeste' },
            'familia': { movieGenre: 10751, tvGenre: 10751, label: 'Família' },
            'família': { movieGenre: 10751, tvGenre: 10751, label: 'Família' },
            // Categorias extras pedidas: Infantil, Halloween e Natal/Natalino.
            'infantil': { movieGenre: 10751, tvGenre: 10762, label: 'Infantil' },
            'infantis': { movieGenre: 10751, tvGenre: 10762, label: 'Infantil' },
            'criança': { movieGenre: 10751, tvGenre: 10762, label: 'Infantil' },
            'crianças': { movieGenre: 10751, tvGenre: 10762, label: 'Infantil' },
            'halloween': { movieGenre: 27, keywordQuery: 'halloween', label: 'Halloween' },
            'natal': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' },
            'natalino': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' },
            'natalina': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' },
            'natalinos': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' },
            'natalinas': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' },
            'natal/natalino': { movieGenre: 10751, tvGenre: 10751, keywordQuery: 'christmas', label: 'Natal' }
        };

        function normalizeSearchTerm(str) {
            return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        }

        function matchGenreSearch(query) {
            const normalized = normalizeSearchTerm(query);
            if (GENRE_SEARCH_MAP[normalized]) return GENRE_SEARCH_MAP[normalized];
            const words = normalized.split(/\s+/);
            const wordKey = Object.keys(GENRE_SEARCH_MAP).find(k => words.includes(normalizeSearchTerm(k)));
            if (wordKey) return GENRE_SEARCH_MAP[wordKey];
            // Também reconhece chaves com mais de uma palavra quando aparecem dentro da busca (ex.: "novela coreana").
            const phraseKey = Object.keys(GENRE_SEARCH_MAP).find(k => k.includes(' ') && normalized.includes(normalizeSearchTerm(k)));
            return phraseKey ? GENRE_SEARCH_MAP[phraseKey] : null;
        }

        async function resolveKeywordId(term) {
            try {
                const res = await fetch(`${BASE_URL}/search/keyword?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(term)}&page=1`);
                const data = await res.json();
                const match = (data.results || [])[0];
                return match ? match.id : null;
            } catch (error) {
                console.warn('Não foi possível resolver a palavra-chave do TMDB:', term, error);
                return null;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initSupabaseAuth();
            initCinefiaPrivacy();
            window.addEventListener('resize', refreshSynopsisControl);
            window.matchMedia('(max-width: 900px)').addEventListener('change', () => setMobileNavigation(false));
            document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (document.body.classList.contains('mobile-nav-open')) {
                        setMobileNavigation(false);
                    }
                });
            });
            initHeroCarousel();
            refreshFilterGenreOptions();
            updateMyListCount();
            fetchContent();

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                searchTimeout = setTimeout(() => {
                    if (query.length > 2) {
                        const genreConfig = matchGenreSearch(query);
                        currentPage = 1;
                        currentSearchQuery = query;
                        hideCategories();
                        document.querySelector('.hero').style.display = 'none';
                        if (genreConfig) {
                            currentMode = 'genresearch';
                            currentGenreSearch = genreConfig;
                            document.getElementById('sectionTitle').innerText = `Melhores de ${genreConfig.label}`;
                        } else {
                            currentMode = 'search';
                            currentGenreSearch = null;
                            // Título provisório: fetchSmartTextSearch troca para "Elenco: Nome" se a busca for de um(a) ator/atriz.
                            document.getElementById('sectionTitle').innerText = `Resultados para "${query}"`;
                        }
                        fetchContent();
                    } else if (query.length === 0 && (currentMode === 'search' || currentMode === 'genresearch')) {
                        loadHome();
                    }
                }, 500);
            });
        });

        /* --- CARROSSEL EM TELA CHEIA (ESTILO IMDB) --- */
        async function initHeroCarousel() {
            if(!TMDB_API_KEY) return;
            try {
                const requests = [
                    fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json()),
                    fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&page=1`).then(r => r.json()),
                    fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&page=1`).then(r => r.json()),
                    fetch(`${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&page=1`).then(r => r.json()),
                    fetch(`${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json())
                ];

                const datasets = await Promise.all(requests);
                const seen = new Set();
                const merged = [];

                datasets.flatMap(data => data.results || []).forEach(item => {
                    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    const key = `${type}-${item.id}`;
                    if (Number.isSafeInteger(item.id) && !item.adult && validTmdbImage(item.backdrop_path) && validTmdbImage(item.poster_path) && !seen.has(key)) {
                        seen.add(key);
                        merged.push({ ...item, media_type: type });
                    }
                });

                heroSlides = merged.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 31);

                const container = document.getElementById('heroCarouselContainer');
                if(heroSlides.length === 0) return;

                let slidesHTML = '';
                heroSlides.forEach((item, index) => {
                    const title = escapeCinefiaHtml(item.title || item.name);
                    const overview = escapeCinefiaHtml(item.overview || 'Explore os detalhes desta obra incrível no catálogo.');
                    const backdrop = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
                    const poster = `${IMG_BASE_URL}${item.poster_path}`;
                    const type = item.media_type === 'tv' ? 'tv' : 'movie';
                    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

                    slidesHTML += `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}">
                            <div class="hero-bg" style="background-image: url('${backdrop}')"></div>
                            <div class="hero-content-wrapper">
                                <img src="${poster}" class="hero-poster" alt="${title}" data-title-id="${item.id}" data-title-type="${type}" onclick="openDetails(Number(this.dataset.titleId), this.dataset.titleType)" />
                                <div class="hero-text">
                                    <h1>${title}</h1>
                                    <div class="modal-tags" style="margin-bottom: 0.8rem;">
                                        <span class="tag"><i class="fa-solid fa-star" style="color:#f5c518"></i> ${rating}</span>
                                        <span class="tag">${type === 'tv' ? 'Série' : 'Filme'}</span>
                                    </div>
                                    <p>${overview}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = slidesHTML + `
                    <div class="hero-arrows">
                        <button onclick="changeHeroSlide(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                        <button onclick="changeHeroSlide(1)"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                `;

                currentHeroSlide = 0;
                clearInterval(heroInterval);
                startHeroInterval();
            } catch (error) {
                console.error("Erro no carrossel", error);
            }
        }

        function changeHeroSlide(direction) {
            const slides = document.querySelectorAll('.hero-slide');
            if(slides.length === 0) return;

            slides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + direction + slides.length) % slides.length;
            slides[currentHeroSlide].classList.add('active');

            resetHeroInterval();
        }

        function startHeroInterval() {
            heroInterval = setInterval(() => { changeHeroSlide(1); }, 5000);
        }

        function resetHeroInterval() {
            clearInterval(heroInterval);
            startHeroInterval();
        }

        // --- FAIXAS DA HOME: lançamentos do ano, melhores avaliados e filmes (com aleatorização) ---
        function cinefiaShuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        async function fetchCinefiaJson(url, options) {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Serviço indisponível');
            return response.json();
        }

        function uniqueTitles(items, seen = new Set()) {
            return items.filter(item => {
                const key = `${item.media_type}-${item.id}`;
                if (!Number.isSafeInteger(item.id) || item.id <= 0 || !['movie', 'tv'].includes(item.media_type) ||
                    !validTmdbImage(item.poster_path) || item.adult || seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }

        function validTmdbImage(path) {
            return typeof path === 'string' && /^\/[\w.-]+\.(?:jpe?g|png|webp)$/i.test(path);
        }

        function tagTitles(items, type) {
            return items.map(item => ({ ...item, media_type: type || item.media_type || (item.title ? 'movie' : 'tv') }));
        }

        // O TMDB entrega lotes de 20. Os excedentes ficam disponíveis para a próxima página do Cinéfia.
        async function catalogPage(sources, page, compare) {
            if (!sources.length) return {items: [], pages: 1};
            const key = JSON.stringify(sources);
            let entry = catalogCache.get(key);
            if (!entry || entry.expires < Date.now()) {
                entry = {items: [], seen: new Set(), next: 1, limits: sources.map(() => 1), counts: [], expires: Date.now() + 300000};
            }
            catalogCache.delete(key);
            catalogCache.set(key, entry);
            if (catalogCache.size > 8) catalogCache.delete(catalogCache.keys().next().value);
            const end = page * TITLES_PER_PAGE;
            while (entry.items.length < end && entry.next <= Math.max(...entry.limits)) {
                if (!entry.pending) {
                    const batchPage = entry.next;
                    entry.pending = Promise.all(sources.map(({url, type}, index) => {
                        if (batchPage > entry.limits[index]) return [];
                        const requestUrl = new URL(url);
                        requestUrl.searchParams.set('page', batchPage);
                        return fetchCinefiaJson(requestUrl).then(data => {
                            const results = Array.isArray(data.results) ? data.results : [];
                            entry.limits[index] = Math.min(TMDB_PAGE_LIMIT, Number(data.total_pages) || 0);
                            entry.counts[index] = Math.min(Number(data.total_results) || entry.limits[index] * TMDB_PAGE_SIZE, entry.limits[index] * TMDB_PAGE_SIZE);
                            return tagTitles(results, type);
                        });
                    })).then(batches => {
                        const titles = batches.flat();
                        if (compare) titles.sort(compare);
                        entry.items.push(...uniqueTitles(titles, entry.seen));
                        entry.next++;
                    }).finally(() => { entry.pending = null; });
                }
                await entry.pending;
            }
            const more = entry.next <= Math.max(...entry.limits);
            const known = Math.ceil(entry.items.length / TITLES_PER_PAGE);
            const estimate = Math.ceil(entry.counts.reduce((sum, count) => sum + count, 0) / TITLES_PER_PAGE);
            return {items: entry.items.slice(end - TITLES_PER_PAGE, end), pages: Math.max(1, more ? Math.max(known, page + 1, estimate) : known)};
        }

        function showCatalogPage(result, request, emptyMessage = 'Nenhum resultado encontrado.') {
            if (request !== catalogRequest) return;
            if (currentPage > result.pages && currentPage > 1) {
                currentPage = result.pages;
                void fetchContent();
                return;
            }
            totalPages = result.pages;
            renderGrid(result.items);
            if (!result.items.length) showCatalogNotice(emptyMessage);
            updatePagination();
        }

        function showCatalogNotice(message = '') {
            const notice = document.getElementById('catalogNotice');
            notice.textContent = message;
            notice.hidden = !message;
        }

        async function fetchHomeBestReleases(request) {
            const currentYear = new Date().getFullYear();
            const samplePages = [1, 2, ...cinefiaShuffle([3,4,5,6,7,8]).slice(0, 2)];
            const history = JSON.parse(sessionStorage.getItem('cinefia_home_page_history') || '[]');
            const recentIds = new Set(history.slice(-5).flat().map(String));
            const requests = [];
            samplePages.forEach(page => {
                requests.push(fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=vote_average.desc&vote_count.gte=100&primary_release_date.gte=${currentYear}-01-01&primary_release_date.lte=${currentYear}-12-31&page=${page}`).then(r => r.json()).then(d => ({ d, type: 'movie' })));
                requests.push(fetch(`${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=vote_average.desc&vote_count.gte=20&first_air_date.gte=${currentYear}-01-01&first_air_date.lte=${currentYear}-12-31&page=${page}`).then(r => r.json()).then(d => ({ d, type: 'tv' })));
            });
            const datasets = await Promise.all(requests);
            const seen = new Set();
            let candidates = [];
            datasets.forEach(({ d, type }) => (d.results || []).forEach(item => {
                const key = `${type}-${item.id}`;
                if (item.poster_path && !seen.has(key) && !recentIds.has(key)) { seen.add(key); candidates.push({ ...item, media_type: type }); }
            }));
            const pageItems = fillHomePage(candidates, datasets, request);
            if (!pageItems) return;
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        async function fetchHomeTopRated(request) {
            const samplePages = cinefiaShuffle([1,2,3,4,5,6,7,8,9,10]).slice(0, 3);
            const history = JSON.parse(sessionStorage.getItem('cinefia_home_page_history') || '[]');
            const recentIds = new Set(history.slice(-5).flat().map(String));
            const requests = [];
            samplePages.forEach(page => {
                requests.push(fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&page=${page}`).then(r => r.json()).then(d => ({ d, type: 'movie' })));
                requests.push(fetch(`${BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`).then(r => r.json()).then(d => ({ d, type: 'tv' })));
            });
            const datasets = await Promise.all(requests);
            const seen = new Set();
            let candidates = [];
            datasets.forEach(({ d, type }) => (d.results || []).forEach(item => {
                const key = `${type}-${item.id}`;
                if (item.poster_path && !seen.has(key) && !recentIds.has(key)) { seen.add(key); candidates.push({ ...item, media_type: type }); }
            }));
            const pageItems = fillHomePage(candidates, datasets, request);
            if (!pageItems) return;
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        async function fetchHomeMoviesOnly(request) {
            const sorts = ['popularity.desc', 'vote_average.desc', 'revenue.desc'];
            const samplePages = cinefiaShuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 4);
            const history = JSON.parse(sessionStorage.getItem('cinefia_home_page_history') || '[]');
            const recentIds = new Set(history.slice(-5).flat().map(String));
            const requests = samplePages.map(page => {
                const sort = sorts[Math.floor(Math.random() * sorts.length)];
                return fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=${sort}&vote_count.gte=80&page=${page}`).then(r => r.json());
            });
            const datasets = await Promise.all(requests);
            const seen = new Set();
            let candidates = [];
            datasets.forEach(d => (d.results || []).forEach(item => {
                const key = `movie-${item.id}`;
                if (item.poster_path && !seen.has(key) && !recentIds.has(key)) { seen.add(key); candidates.push({ ...item, media_type: 'movie' }); }
            }));
            const pageItems = fillHomePage(candidates, datasets, request);
            if (!pageItems) return;
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        function fillHomePage(candidates, datasets, request) {
            if (request !== catalogRequest) return null;
            const available = datasets.flatMap(({d, type}) => tagTitles(d.results || [], type));
            const pageItems = uniqueTitles([...cinefiaShuffle(candidates), ...cinefiaShuffle(available)]).slice(0, TITLES_PER_PAGE);
            renderGrid(pageItems);
            if (!pageItems.length) showCatalogNotice('Nenhum título encontrado nesta página.');
            return pageItems;
        }

        async function fetchContent() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            if (!TMDB_API_KEY) return;
            const request = ++catalogRequest;
            const page = currentPage;
            const renew = document.getElementById('renewRecommendations');
            renew.hidden = currentMode !== 'recommendations' || !cinefiaAuthUser;
            renew.disabled = true;
            showCatalogNotice();

            grid.innerHTML = '<div class="message-box"><div class="spinner"></div><p style="margin-top:15px;">A carregar dados...</p></div>';
            pagination.style.display = 'none';

            let url = '';

            if (currentMode === 'home') {
                if (currentPage === 1 && cinefiaAuthUser && cinefiaAccountPreferences && (cinefiaAccountPreferences.genres.length || cinefiaAccountPreferences.providers.length)) {
                    document.getElementById('sectionTitle').innerText = 'Em destaque para você';
                    try {
                        await fetchPersonalizedHomeMix(request);
                        return;
                    } catch {
                        if (request !== catalogRequest) return;
                    }
                }
                // Faixas de página da Home: 1–5 melhores lançamentos do ano, 5–10 melhores avaliados, 10–15 somente filmes.
                try {
                    if (currentPage <= 5) {
                        document.getElementById('sectionTitle').innerText = `Melhores Lançamentos de ${new Date().getFullYear()}`;
                        await fetchHomeBestReleases(request);
                        return;
                    } else if (currentPage <= 10) {
                        document.getElementById('sectionTitle').innerText = 'Melhores Avaliados';
                        await fetchHomeTopRated(request);
                        return;
                    } else if (currentPage <= 15) {
                        document.getElementById('sectionTitle').innerText = 'Filmes Selecionados';
                        await fetchHomeMoviesOnly(request);
                        return;
                    }
                } catch { if (request !== catalogRequest) return; }
                // A partir da página 16, mantém a descoberta aleatória original: embaralha resultados de páginas/ordenações variadas e evita IDs vistos nas últimas cinco páginas.
                try {
                    const history = JSON.parse(sessionStorage.getItem('cinefia_home_page_history') || '[]');
                    const recentIds = new Set(history.slice(-5).flat().map(String));
                    const pageChoices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
                    const sorts = ['popularity.desc','vote_average.desc','primary_release_date.desc','revenue.desc'];
                    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
                    const requests = shuffle(pageChoices).slice(0, 4).map(page => {
                        const sort = sorts[Math.floor(Math.random() * sorts.length)];
                        return fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=${sort}&vote_count.gte=80&page=${page}`).then(r => r.json());
                    });
                    const batches = await Promise.all(requests);
                    let candidates = batches.flatMap(d => d.results || []).filter(item => item.poster_path && !recentIds.has(`movie-${item.id}`));
                    const seen = new Set();
                    candidates = shuffle(candidates).filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); item.media_type='movie'; return true; });
                    if (candidates.length < TITLES_PER_PAGE) {
                        const extra = await fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=${Math.floor(Math.random()*20)+1}`).then(r => r.json());
                        candidates = candidates.concat((extra.results || []).filter(item => item.poster_path && !recentIds.has(`${item.media_type || (item.title?'movie':'tv')}-${item.id}`)).map(item => ({...item, media_type:item.media_type || (item.title?'movie':'tv')})));
                    }
                    if (request !== catalogRequest) return;
                    const pageItems = uniqueTitles([...candidates, ...batches.flatMap(data => tagTitles(data.results || [], 'movie'))]).slice(0, TITLES_PER_PAGE);
                    renderGrid(pageItems);
                    history.push(pageItems.map(item => `${item.media_type || 'movie'}-${item.id}`));
                    sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
                    totalPages = 500;
                    updatePagination();
                    return;
                } catch { if (request !== catalogRequest) return; }
                url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&page=${currentPage}`;
            } else if (currentMode === 'trending') {
                url = `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=${currentPage}`;
            } else if (currentMode === 'search') {
                await fetchSmartTextSearch(request, page);
                return;
            } else if (currentMode === 'categories') {
                url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${currentCategory}&page=${currentPage}`;
            } else if (currentMode === 'movies') {
                url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=popularity.desc&vote_count.gte=50&page=${currentPage}`;
            } else if (currentMode === 'cinema') {
                url = `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&page=${currentPage}`;
            } else if (currentMode === 'streaming') {
                url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&watch_region=BR&with_watch_monetization_types=flatrate%7Cfree%7Cads&sort_by=popularity.desc&page=${currentPage}`;
            } else if (currentMode === 'series') {
                url = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&vote_count.gte=50&page=${currentPage}`;
            } else if (currentMode === 'genresearch') {
                await fetchGenreSearch(request, page);
                return;
            } else if (currentMode === 'mylist') {
                await fetchMyList(request, page);
                return;
            } else if (currentMode === 'recommendations') {
                await fetchRecommendations(request, page);
                return;
            } else if (currentMode === 'filters') {
                await fetchFilteredContent(request, page);
                return;
            }

            try {
                const sourceUrl = new URL(url);
                sourceUrl.searchParams.delete('page');
                showCatalogPage(await catalogPage([{url: sourceUrl.href}], page), request);
            } catch {
                if (request === catalogRequest) showError("Erro de conexão. Verifique sua API Key.");
            }
        }

        // --- MINHA LISTA / FAVORITOS ---
        // Sem login, a lista é apenas de visitante neste navegador. Ela não é um perfil
        // nem participa da identidade usada nos comentários; com login, a fonte é o Supabase.

        function getCurrentFavoriteItems() {
            if (cinefiaAuthUser && cinefiaCloudFavoritesLoadedFor === cinefiaAuthUser.id) {
                return cinefiaCloudFavorites;
            }
            return getFavoriteItems();
        }

        function updateMyListCount() {
            const el = document.getElementById('myListCount');
            const favorites = getCurrentFavoriteItems();
            if (el) el.textContent = favorites.length ? `(${favorites.length})` : '';
        }

        function isFavorite(id, type) {
            return getCurrentFavoriteItems().some(item => Number(item.id) === Number(id) && item.type === type);
        }

        async function toggleFavorite(id, type, title = '') {
            if (cinefiaAuthUser && cinefiaSupabaseClient && cinefiaCloudFavoritesLoadedFor !== cinefiaAuthUser.id) {
                await loadCinefiaCloudFavorites();
            }
            const useCloud = Boolean(cinefiaAuthUser && cinefiaCloudFavoritesLoadedFor === cinefiaAuthUser.id && cinefiaSupabaseClient);
            const favorites = [...(useCloud ? cinefiaCloudFavorites : getFavoriteItems())];
            const index = favorites.findIndex(item => Number(item.id) === Number(id) && item.type === type);
            const removing = index >= 0;
            if (removing) favorites.splice(index, 1);
            else favorites.unshift({ id: Number(id), type, title: title || `${type === 'tv' ? 'Série' : 'Filme'} ${id}` });
            const limited = favorites.slice(0, 50);

            if (useCloud) {
                cinefiaCloudFavorites = limited;
                updateMyListCount();
                renderCurrentListState();
                try {
                    let result;
                    if (removing) {
                        result = await cinefiaSupabaseClient.from('cinefia_favorites')
                            .delete().eq('user_id', cinefiaAuthUser.id).eq('media_type', type).eq('tmdb_id', Number(id));
                    } else {
                        const item = limited.find(entry => Number(entry.id) === Number(id) && entry.type === type);
                        result = await cinefiaSupabaseClient.from('cinefia_favorites').upsert({
                            user_id: cinefiaAuthUser.id,
                            media_type: type,
                            tmdb_id: Number(id),
                            title: item?.title || `${type === 'tv' ? 'Série' : 'Filme'} ${id}`
                        }, { onConflict: 'user_id,media_type,tmdb_id' });
                    }
                    if (result.error) throw result.error;
                } catch (error) {
                    console.error('[Cinéfia] Falha ao sincronizar favorito com a nuvem:', error);
                    cinefiaCloudSyncMessage = 'Não foi possível salvar a Minha Lista na nuvem. Execute o SQL de configuração e confira as políticas RLS.';
                    cinefiaCloudFavoritesLoadedFor = null;
                    await loadCinefiaCloudFavorites();
                    renderSupabaseAuthPanel();
                }
            } else {
                saveFavoriteItems(limited);
                updateMyListCount();
                renderCurrentListState();
            }

            const modal = document.getElementById('detailsModal');
            if (modal?.classList.contains('active') && modal.querySelector('.modal-title')) {
                // Atualiza apenas o conteúdo atual do modal para refletir o estado do favorito.
                openDetails(id, type);
            }
        }

        function renderCurrentListState() {
            if (currentMode === 'mylist') fetchContent();
        }

        async function fetchMyList(request, page) {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            pagination.style.display = 'none';
            const favorites = getCurrentFavoriteItems();
            if (!favorites.length) {
                grid.innerHTML = '<div class="message-box"><i class="fa-regular fa-heart" style="font-size:2rem;color:var(--accent);margin-bottom:12px;"></i><br>Sua Minha Lista está vazia.<br><span style="font-size:0.9rem;">Adicione filmes e séries usando o coração.</span></div>';
                return;
            }
            try {
                const results = await Promise.allSettled(favorites.slice((page - 1) * TITLES_PER_PAGE, page * TITLES_PER_PAGE).map(async item => {
                    const data = await fetchCinefiaJson(`${BASE_URL}/${item.type}/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    return { ...data, media_type: item.type };
                }));
                showCatalogPage({
                    items: results.filter(result => result.status === 'fulfilled').map(result => result.value),
                    pages: Math.ceil(favorites.length / TITLES_PER_PAGE)
                }, request, 'Não foi possível carregar os títulos desta página.');
            } catch (error) {
                if (request === catalogRequest) showError('Não foi possível carregar sua Minha Lista.');
            }
        }

        // --- RECOMENDAÇÕES ---
        async function fetchRecommendations(request, page) {
            const grid = document.getElementById('resultsGrid');
            const renew = document.getElementById('renewRecommendations');
            const authReady = await cinefiaAuthStartup;
            if (request !== catalogRequest) return;
            if (!authReady) return showError('Não foi possível verificar sua sessão Cinéfia. Atualize a página e tente novamente.');
            if (!cinefiaAuthUser) {
                grid.innerHTML = '<div class="message-box"><i class="fa-solid fa-lock" style="color:var(--accent);font-size:2rem;margin-bottom:12px;"></i><br>Recomendados é uma função exclusiva das contas Cinéfia.<br><span style="font-size:.9rem;">Entre ou cadastre-se para configurar seus gostos.</span><br><button class="feature-btn" style="margin-top:14px;" onclick="openProfileModal()"><i class="fa-solid fa-right-to-bracket"></i> Entrar ou cadastrar</button></div>';
                return;
            }
            try {
                const user = cinefiaAuthUser;
                const preferences = await getCinefiaPreferences(user);
                if (request !== catalogRequest || user.id !== cinefiaAuthUser?.id) return;
                const hasPreferences = preferences.genres.length || preferences.providers.length;
                const sources = hasPreferences ? preferenceSources(preferences) : getCurrentFavoriteItems().slice(0, 5).map(item => ({
                    url: `${BASE_URL}/${item.type}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`
                }));
                if (!hasPreferences && !sources.length) {
                    grid.innerHTML = '<div class="message-box">Escolha seus gostos na Experiência Cinéfia para receber sugestões.<br><button class="feature-btn" style="margin-top:14px" onclick="openCinefiaExperienceModal()">Escolher meus gostos</button></div>';
                    return;
                }
                const result = await catalogPage(sources, page, comparePopularity);
                if (request !== catalogRequest || user.id !== cinefiaAuthUser?.id) return;
                if (page > result.pages) {
                    currentPage = 1;
                    return fetchContent();
                }
                showCatalogPage(result, request, 'Nenhum título disponível para estes gostos.');
                renew.hidden = false;
                renew.disabled = result.pages < 2;
            } catch {
                if (request === catalogRequest) showError('Não foi possível gerar recomendações agora.');
            }
        }

        function comparePopularity(a, b) {
            return (b.popularity || 0) - (a.popularity || 0);
        }

        function renewCinefiaRecommendations() {
            if (currentMode !== 'recommendations' || totalPages < 2) return;
            currentPage = currentPage < totalPages ? currentPage + 1 : 1;
            fetchContent();
        }

        // --- FILTROS AVANÇADOS ---
        const movieGenreOptions = [
            ['', 'Todos'], ['28|10759', 'Ação / Ação e Aventura'], ['12|10759', 'Aventura'], ['16|16', 'Animação'], ['35|35', 'Comédia'], ['80|80', 'Crime'], ['99|99', 'Documentário'], ['18|18', 'Drama'], ['10751|10751', 'Família'], ['14|10765', 'Fantasia'], ['27|', 'Terror'], ['9648|9648', 'Mistério'], ['878|10765', 'Ficção Científica'], ['10749|10749', 'Romance'], ['37|37', 'Faroeste']
        ];

        function refreshFilterGenreOptions() {
            const select = document.getElementById('filterGenre');
            if (!select) return;
            const type = document.getElementById('filterType')?.value || 'all';
            select.innerHTML = movieGenreOptions.map(([value, label]) => {
                if (type === 'tv' && value === '27|') return '';
                const actual = type === 'movie' ? (value.split('|')[0] || '') : type === 'tv' ? (value.split('|')[1] || '') : value;
                return `<option value="${actual}">${label}</option>`;
            }).join('');
        }

        function toggleFilters() {
            document.getElementById('filterPanel')?.classList.toggle('active');
        }

        function resetFilters() {
            document.getElementById('filterType').value = 'all';
            document.getElementById('filterFromYear').value = '';
            document.getElementById('filterToYear').value = '';
            document.getElementById('filterRating').value = '';
            document.getElementById('filterLanguage').value = '';
            document.getElementById('filterSort').value = 'popularity.desc';
            document.getElementById('filterVotes').value = '';
            refreshFilterGenreOptions();
            document.getElementById('filterGenre').value = '';
        }

        function applyFilters() {
            currentMode = 'filters';
            currentPage = 1;
            currentSearchQuery = '';
            searchInput.value = '';
            document.querySelector('.hero').style.display = 'none';
            hideCategories();
            setActiveNav('navHome');
            document.getElementById('sectionTitle').innerText = 'Resultados filtrados';
            fetchContent();
        }

        async function fetchFilteredContent(request, page) {
            const type = document.getElementById('filterType').value;
            const genre = document.getElementById('filterGenre').value;
            const fromYear = document.getElementById('filterFromYear').value;
            const toYear = document.getElementById('filterToYear').value;
            const rating = document.getElementById('filterRating').value;
            const language = document.getElementById('filterLanguage').value;
            const sort = document.getElementById('filterSort').value;
            const votes = document.getElementById('filterVotes').value;
            const requests = [];
            const genreParts = genre ? genre.split('|') : ['', ''];
            const movieGenre = genreParts[0] || '';
            const tvGenre = genreParts[1] || '';

            const buildMovie = () => {
                const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', region: 'BR', sort_by: sort });
                if (movieGenre) params.set('with_genres', movieGenre);
                if (fromYear) params.set('primary_release_date.gte', `${fromYear}-01-01`);
                if (toYear) params.set('primary_release_date.lte', `${toYear}-12-31`);
                if (rating) params.set('vote_average.gte', rating);
                if (language) params.set('with_original_language', language);
                if (votes) params.set('vote_count.gte', votes);
                return {url: `${BASE_URL}/discover/movie?${params}`, type: 'movie'};
            };
            const buildTv = () => {
                let tvSort = sort === 'primary_release_date.desc' ? 'first_air_date.desc' : sort;
                const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', sort_by: tvSort });
                if (tvGenre) params.set('with_genres', tvGenre);
                if (fromYear) params.set('first_air_date.gte', `${fromYear}-01-01`);
                if (toYear) params.set('first_air_date.lte', `${toYear}-12-31`);
                if (rating) params.set('vote_average.gte', rating);
                if (language) params.set('with_original_language', language);
                if (votes) params.set('vote_count.gte', votes);
                return {url: `${BASE_URL}/discover/tv?${params}`, type: 'tv'};
            };

            if (type === 'movie') requests.push(buildMovie());
            else if (type === 'tv') requests.push(buildTv());
            else { requests.push(buildMovie()); requests.push(buildTv()); }

            try {
                showCatalogPage(await catalogPage(requests, page, comparePopularity), request);
            } catch (error) {
                if (request === catalogRequest) showError('Não foi possível aplicar os filtros.');
            }
        }

        // --- PESQUISA INTELIGENTE POR GÊNERO (RESULTADO) ---
        async function fetchGenreSearch(request, page) {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            const config = currentGenreSearch;
            if (!config) {
                grid.innerHTML = '<div class="message-box">Nenhum resultado encontrado.</div>';
                pagination.style.display = 'none';
                return;
            }
            try {
                // Para categorias temáticas sem gênero oficial no TMDB (Halloween, Natal), resolve a keyword real da API.
                const keywordId = config.keywordQuery ? await resolveKeywordId(config.keywordQuery) : null;
                const requests = [];
                if (config.movieGenre || keywordId) {
                    const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', region: 'BR', sort_by: 'vote_average.desc', 'vote_count.gte': '100' });
                    if (keywordId) params.set('with_keywords', String(keywordId));
                    else if (config.movieGenre) params.set('with_genres', String(config.movieGenre));
                    if (config.originLanguage) params.set('with_original_language', config.originLanguage);
                    requests.push({url: `${BASE_URL}/discover/movie?${params}`, type: 'movie'});
                }
                if (config.tvGenre || keywordId) {
                    const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', sort_by: 'vote_average.desc', 'vote_count.gte': '30' });
                    if (keywordId) params.set('with_keywords', String(keywordId));
                    else if (config.tvGenre) params.set('with_genres', String(config.tvGenre));
                    if (config.originLanguage) params.set('with_original_language', config.originLanguage);
                    requests.push({url: `${BASE_URL}/discover/tv?${params}`, type: 'tv'});
                }
                const compareRatings = (a, b) => (b.vote_average || 0) - (a.vote_average || 0);
                showCatalogPage(await catalogPage(requests, page, compareRatings), request, `Nenhum resultado encontrado para "${config.label}".`);
            } catch (error) {
                if (request === catalogRequest) showError(`Não foi possível buscar por "${config.label}" agora.`);
            }
        }

        // --- PESQUISA POR TEXTO, COM DETECÇÃO DE ATOR/ATRIZ ---
        // Se o termo buscado corresponder ao nome de uma pessoa no TMDB, mostra os filmes/séries
        // em que ela está no Elenco. Caso contrário, cai na busca normal por título.
        async function fetchSmartTextSearch(request, page) {
            const query = currentSearchQuery;
            try {
                const personRes = await fetch(`${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`);
                const personData = await personRes.json();
                const topPerson = (personData.results || [])[0];
                const normalizedQuery = normalizeSearchTerm(query);

                if (Number.isSafeInteger(topPerson?.id) && normalizeSearchTerm(topPerson.name) === normalizedQuery) {
                    const creditsRes = await fetch(`${BASE_URL}/person/${topPerson.id}/combined_credits?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const creditsData = await creditsRes.json();
                    const castItems = uniqueTitles(creditsData.cast || []).sort(comparePopularity);

                    if (castItems.length) {
                        if (request !== catalogRequest) return;
                        document.getElementById('sectionTitle').innerText = `Elenco: ${topPerson.name}`;
                        showCatalogPage({
                            items: castItems.slice((page - 1) * TITLES_PER_PAGE, page * TITLES_PER_PAGE),
                            pages: Math.ceil(castItems.length / TITLES_PER_PAGE)
                        }, request);
                        return;
                    }
                }
            } catch (error) {
                if (request !== catalogRequest) return;
            }

            // Busca padrão por título (comportamento original) quando não é reconhecido como ator/atriz.
            try {
                const url = `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
                showCatalogPage(await catalogPage([{url}], page), request);
            } catch (error) {
                if (request === catalogRequest) showError('Erro de conexão. Verifique sua API Key.');
            }
        }

        // --- CINÉFIA SCORE ---
        function calculateCinefiaScore(item) {
            const rating = Number(item.vote_average || 0);
            const votes = Number(item.vote_count || 0);
            const popularity = Number(item.popularity || 0);
            const ratingBase = Math.min(100, Math.max(0, rating * 10));
            const confidence = Math.min(100, Math.log10(votes + 1) / 4 * 100);
            const popularityBonus = Math.min(100, Math.log10(popularity + 1) / 3 * 100);
            const score = (ratingBase * 0.72) + (confidence * 0.18) + (popularityBonus * 0.10);
            return Math.round(score);
        }

        // --- TRAILERS ---
        function findBestTrailer(videos) {
            const usable = (videos || []).filter(v => v.site === 'YouTube' && v.key && ['Trailer','Teaser'].includes(v.type));
            if (!usable.length) return null;
            return usable.sort((a,b) => Number(Boolean(b.official)) - Number(Boolean(a.official)) || (a.type === 'Trailer' ? -1 : 1))[0];
        }

        // Mantém uma lista de opções para o caso de um vídeo não permitir incorporação.
        let trailerCandidates = [];
        let trailerCandidateIndex = 0;
        let trailerPlayer = null;
        let trailerOpenRequestId = 0;
        let youtubeIframeApiPromise = null;
        let currentTrailerTitle = 'Trailer';

        function getTrailerCandidates(videos) {
            return (videos || [])
                .filter(video => video.site === 'YouTube' && /^[A-Za-z0-9_-]{11}$/.test(video.key || '') && ['Trailer', 'Teaser'].includes(video.type))
                .sort((a, b) =>
                    Number(Boolean(b.official)) - Number(Boolean(a.official)) ||
                    Number(b.type === 'Trailer') - Number(a.type === 'Trailer') ||
                    Number(b.iso_639_1 === 'pt') - Number(a.iso_639_1 === 'pt')
                );
        }

        function loadYouTubeIframeAPI() {
            if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
            if (youtubeIframeApiPromise) return youtubeIframeApiPromise;

            youtubeIframeApiPromise = new Promise((resolve, reject) => {
                const scriptUrl = 'https://www.youtube.com/iframe_api';
                const existingScript = Array.from(document.scripts).find(script => script.src === scriptUrl);
                const previousCallback = window.onYouTubeIframeAPIReady;

                window.onYouTubeIframeAPIReady = function () {
                    if (typeof previousCallback === 'function') {
                        try { previousCallback(); } catch (error) { console.error('Erro no callback anterior do player do YouTube:', error); }
                    }
                    if (window.YT && window.YT.Player) resolve(window.YT);
                    else {
                        youtubeIframeApiPromise = null;
                        reject(new Error('A API do player do YouTube não foi inicializada.'));
                    }
                };

                if (!existingScript) {
                    const script = document.createElement('script');
                    script.src = scriptUrl;
                    script.async = true;
                    script.onerror = () => {
                        script.remove();
                        youtubeIframeApiPromise = null;
                        reject(new Error('Não foi possível carregar a API do player do YouTube.'));
                    };
                    document.head.appendChild(script);
                }
            });

            return youtubeIframeApiPromise;
        }

        function destroyTrailerPlayer() {
            if (trailerPlayer && typeof trailerPlayer.destroy === 'function') {
                try { trailerPlayer.destroy(); } catch (error) { /* O player pode já ter sido removido pelo navegador. */ }
            }
            trailerPlayer = null;
        }

        function showTrailerFallback(message, trailer = trailerCandidates[trailerCandidateIndex]) {
            const wrap = document.getElementById('trailerFrameWrap');
            if (!wrap) return;
            destroyTrailerPlayer();
            wrap.innerHTML = '';

            const messageBox = document.createElement('div');
            messageBox.className = 'trailer-message';
            messageBox.style.minHeight = '100%';
            messageBox.style.display = 'flex';
            messageBox.style.flexDirection = 'column';
            messageBox.style.alignItems = 'center';
            messageBox.style.justifyContent = 'center';
            messageBox.style.gap = '1rem';
            messageBox.textContent = message;

            if (trailer && trailer.key) {
                const alternativeLink = document.createElement('a');
                alternativeLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
                alternativeLink.target = '_blank';
                alternativeLink.rel = 'noopener noreferrer';
                alternativeLink.className = 'trailer-fallback-link';
                alternativeLink.textContent = 'Abrir este trailer no YouTube';
                alternativeLink.style.display = 'inline-flex';
                alternativeLink.style.alignItems = 'center';
                alternativeLink.style.justifyContent = 'center';
                alternativeLink.style.marginTop = '0.25rem';
                alternativeLink.style.padding = '10px 16px';
                alternativeLink.style.borderRadius = '7px';
                alternativeLink.style.background = 'var(--accent)';
                alternativeLink.style.color = '#fff';
                alternativeLink.style.fontWeight = '800';
                alternativeLink.style.textDecoration = 'none';
                messageBox.appendChild(alternativeLink);
            }

            wrap.appendChild(messageBox);
        }

        function handleTrailerPlayerError(event, requestId) {
            if (requestId !== trailerOpenRequestId || !document.getElementById('trailerOverlay')?.classList.contains('active')) return;

            const errorCode = Number(event.data);
            const failedTrailer = trailerCandidates[trailerCandidateIndex];

            // Erros do vídeo (removido, inválido ou incorporação bloqueada): tenta outro trailer/teaser do TMDB.
            if ([2, 5, 100, 101, 150].includes(errorCode) && trailerCandidateIndex < trailerCandidates.length - 1) {
                trailerCandidateIndex++;
                const nextTrailer = trailerCandidates[trailerCandidateIndex];
                try {
                    if (trailerPlayer && typeof trailerPlayer.loadVideoById === 'function') {
                        trailerPlayer.loadVideoById(nextTrailer.key);
                        return;
                    }
                } catch (error) {
                    console.warn('Não foi possível carregar o próximo trailer incorporado:', error);
                }
            }

            if (errorCode === 153) {
                const message = window.location.protocol === 'file:'
                    ? 'O Cinéfia foi aberto diretamente como arquivo local. O YouTube pode exigir um endereço HTTP/HTTPS para reproduzir o vídeo incorporado. Abra o projeto com um servidor local (por exemplo, Live Server) ou publique o site.'
                    : 'O YouTube não recebeu as informações de origem necessárias para o player incorporado. Verifique se o site está aberto por HTTP/HTTPS e se o navegador não está bloqueando essas informações.';
                showTrailerFallback(message, failedTrailer);
                return;
            }

            if ([101, 150].includes(errorCode)) {
                showTrailerFallback('Os trailers disponíveis encontrados para este filme não permitem reprodução incorporada. Isso é definido pelo responsável pelo vídeo.', trailerCandidates[trailerCandidateIndex]);
            } else if (errorCode === 100) {
                showTrailerFallback('Os trailers disponíveis estão removidos, privados ou indisponíveis para reprodução incorporada.', trailerCandidates[trailerCandidateIndex]);
            } else {
                showTrailerFallback('Não foi possível reproduzir este trailer dentro do Cinéfia. O vídeo pode estar indisponível ou bloquear a incorporação.', trailerCandidates[trailerCandidateIndex] || failedTrailer);
            }
        }

        function createTrailerPlayer(requestId) {
            const wrap = document.getElementById('trailerFrameWrap');
            const trailer = trailerCandidates[trailerCandidateIndex];
            if (!wrap || !trailer || requestId !== trailerOpenRequestId) return;

            wrap.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.id = 'cinefiaYouTubePlayer';
            iframe.className = 'trailer-frame';
            const playerParams = new URLSearchParams({ autoplay: '1', enablejsapi: '1', rel: '0', playsinline: '1' });
            if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
                playerParams.set('origin', window.location.origin);
            }
            iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}?${playerParams.toString()}`;
            iframe.title = `${currentTrailerTitle} — Trailer`;
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share; fullscreen';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            wrap.appendChild(iframe);

            trailerPlayer = new YT.Player(iframe, {
                events: {
                    onError: event => handleTrailerPlayerError(event, requestId)
                }
            });
        }

        async function openTrailer(movieId, title = '', type = 'movie') {
            currentTrailerTitle = title || document.querySelector('#modalContent .modal-title')?.textContent?.trim() || 'Trailer';
            const overlay = document.getElementById('trailerOverlay');
            const wrap = document.getElementById('trailerFrameWrap');
            const requestId = ++trailerOpenRequestId;

            destroyTrailerPlayer();
            trailerCandidates = [];
            trailerCandidateIndex = 0;
            document.getElementById('trailerTitle').textContent = `Trailer — ${currentTrailerTitle}`;
            wrap.innerHTML = '<div class="trailer-message"><div class="spinner"></div><p style="margin-top:12px;">Carregando trailer...</p></div>';
            overlay.classList.add('active');

            try {
                const mediaType = type === 'tv' ? 'tv' : 'movie';
                const data = await fetchFichaJson(`${BASE_URL}/${mediaType}/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR&include_video_language=pt-BR,en-US,null`);
                if (requestId !== trailerOpenRequestId) return;

                trailerCandidates = getTrailerCandidates(data.results || []);
                if (!trailerCandidates.length) {
                    wrap.innerHTML = '<div class="trailer-message">Trailer não localizado no TMDB.</div>';
                    return;
                }

                await loadYouTubeIframeAPI();
                if (requestId !== trailerOpenRequestId || !overlay.classList.contains('active')) return;
                createTrailerPlayer(requestId);
            } catch (error) {
                if (requestId !== trailerOpenRequestId) return;
                showTrailerFallback('Não foi possível iniciar o player incorporado. Verifique sua conexão e tente novamente.', trailerCandidates[0]);
            }
        }

        function closeTrailer(event) {
            if (event && event.target && !event.target.classList.contains('trailer-overlay')) return;
            trailerOpenRequestId++;
            const overlay = document.getElementById('trailerOverlay');
            const wrap = document.getElementById('trailerFrameWrap');
            overlay.classList.remove('active');
            destroyTrailerPlayer();
            trailerCandidates = [];
            trailerCandidateIndex = 0;
            wrap.innerHTML = '';
        }

        // --- SURPREENDA-ME ---
        let lastSurprise = '';
        async function surpriseMe() {
            const control = document.getElementById('navSurprise');
            if (control.dataset.busy) return;
            control.dataset.busy = 'true';
            control.setAttribute('aria-busy', 'true');
            const request = catalogRequest;
            try {
                if (!await cinefiaAuthStartup) throw new Error('Sessão indisponível');
                const user = cinefiaAuthUser;
                const preferences = user ? await getCinefiaPreferences(user) : null;
                if (request !== catalogRequest || user?.id !== cinefiaAuthUser?.id) return;
                if (user && !preferences.genres.length && !preferences.providers.length) {
                    return openCinefiaExperienceModal();
                }
                const sources = user ? preferenceSources(preferences) : [{url: `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR`}];
                const sort = user ? comparePopularity : undefined;
                const first = await catalogPage(sources, 1, sort);
                const second = first.pages > 1 ? await catalogPage(sources, 2, sort) : {items: []};
                if (request !== catalogRequest || user?.id !== cinefiaAuthUser?.id) return;
                const choices = [...first.items, ...second.items];
                if (!choices.length) return showCatalogNotice('Nenhuma surpresa encontrada para estas preferências.');
                const fresh = choices.filter(item => `${item.media_type}-${item.id}` !== lastSurprise);
                const pool = fresh.length ? fresh : choices;
                const pick = pool[Math.floor(Math.random() * pool.length)];
                lastSurprise = `${pick.media_type}-${pick.id}`;
                showCatalogNotice();
                openDetails(pick.id, pick.media_type);
            } catch {
                if (request === catalogRequest) showCatalogNotice('Não foi possível escolher uma surpresa agora.');
            } finally {
                delete control.dataset.busy;
                control.removeAttribute('aria-busy');
            }
        }

        function renderGrid(items) {
            const grid = document.getElementById('resultsGrid');
            grid.innerHTML = '';

            uniqueTitles(tagTitles(items)).slice(0, TITLES_PER_PAGE).forEach(item => {
                const title = escapeCinefiaHtml(item.title || item.name);
                const date = item.release_date || item.first_air_date || '';
                const year = escapeCinefiaHtml(date ? date.split('-')[0] : 'N/A');
                const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
                const imagePath = item.poster_path || item.profile_path;
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = () => openDetails(item.id, mediaType);

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <button class="favorite-btn ${isFavorite(item.id, mediaType) ? 'active' : ''}" aria-label="Adicionar ou remover da Minha Lista"><i class="fa-${isFavorite(item.id, mediaType) ? 'solid' : 'regular'} fa-heart"></i></button>
                        <img src="${IMG_BASE_URL}${imagePath}" alt="${title}" class="card-img" loading="lazy">
                        ${rating !== 'NR' ? `<div class="rating-badge"><i class="fa-solid fa-star"></i> ${rating}</div>` : ''}
                    </div>
                    <div class="card-info">
                        <h3 class="card-title">${title}</h3>
                        <div class="card-meta">${year} • ${mediaType === 'tv' ? 'Série' : 'Filme'} • <span class="cinefia-score"> CFS ${calculateCinefiaScore(item)}</span></div>
                    </div>
                `;
                card.querySelector('.favorite-btn').addEventListener('click', event => {
                    event.stopPropagation();
                    toggleFavorite(item.id, mediaType);
                });
                grid.appendChild(card);
            });
        }

        /* --- DETALHES + INTEGRAÇÃO TMDB & OMDB + ONDE ASSISTIR --- */
        let fichaRequestId = 0;
        const fichaCache = new Map();

        function fetchFichaJson(url) {
            const cached = fichaCache.get(url);
            if (cached?.expires > Date.now()) return cached.promise;
            const promise = fetchCinefiaJson(url, {signal: AbortSignal.timeout(10000)}).catch(error => {
                if (fichaCache.get(url)?.promise === promise) fichaCache.delete(url);
                throw error;
            });
            fichaCache.delete(url);
            fichaCache.set(url, {promise, expires: Date.now() + 600000});
            if (fichaCache.size > 48) fichaCache.delete(fichaCache.keys().next().value);
            return promise;
        }

        async function openDetails(id, type) {
            if (!Number.isSafeInteger(id) || id <= 0 || !['movie', 'tv'].includes(type)) return;

            const modal = document.getElementById('detailsModal');
            const content = document.getElementById('modalContent');
            const previousScroll = modal.classList.contains('active') && content.dataset.fichaKey === `${type}-${id}` ? content.scrollTop : 0;
            const requestId = ++fichaRequestId;
            closeDetailSidePanel();
            content.onscroll = null;
            content.classList.remove('ficha-explored');
            fichaPinObserver?.disconnect();
            content.innerHTML = fichaTopBar() + '<div class="ficha-loading" role="status"><div class="spinner"></div> Carregando ficha…</div>';
            modal.classList.add('active');
            content.scrollTop = 0;
            content.querySelector('.ficha-back')?.focus({preventScroll: true});

            try {
                const ratingResource = type === 'tv' ? 'content_ratings' : 'release_dates';
                const detailsUrl = `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=${ratingResource},watch/providers,external_ids,credits`;
                const data = await fetchFichaJson(detailsUrl);
                if (data.id !== id) throw new Error('Ficha indisponível');
                if (requestId !== fichaRequestId || !modal.classList.contains('active')) return;
                renderModal(data, type);
                content.scrollTop = previousScroll;
                const imdbId = data.imdb_id || data.external_ids?.imdb_id;
                if (/^tt\d+$/.test(imdbId || '') && OMDB_API_KEY) {
                    void fetchFichaJson(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`).then(omdbData => {
                        if (requestId === fichaRequestId && modal.classList.contains('active')) {
                            content.querySelector('.external-scores')?.insertAdjacentHTML('beforeend', omdbScoreMarkup(omdbData));
                        }
                    }).catch(() => {});
                }
            } catch {
                if (requestId !== fichaRequestId || !modal.classList.contains('active')) return;
                content.innerHTML = fichaTopBar() + '<div class="ficha-loading" role="status">Erro ao carregar detalhes. Volte e tente novamente.</div>';
            }
        }

        function omdbScoreMarkup(data) {
            if (!data || data.Response === 'False') return '';
            const rotten = Array.isArray(data.Ratings) ? data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value : null;
            return [
                [data.imdbRating, 'IMDb', 'fa-brands fa-imdb'],
                [rotten, 'Rotten', 'fa-solid fa-apple-whole']
            ].filter(([value]) => value && value !== 'N/A').map(([value, label, icon]) =>
                `<div class="score-badge"><i class="${icon}" aria-hidden="true"></i> ${label}: ${escapeCinefiaHtml(value)}</div>`
            ).join('');
        }

        function renderModal(data, type) {
            const content = document.getElementById('modalContent');
            const title = data.title || data.name;
            const overview = data.overview || 'Sinopse não disponível em português.';
            const poster = validTmdbImage(data.poster_path) ? `${IMG_BASE_URL}${data.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

            const releaseDate = data.release_date || data.first_air_date || 'N/A';
            const year = releaseDate !== 'N/A' ? releaseDate.split('-')[0] : 'N/A';

            const duration = data.runtime ? `${data.runtime} min` : (data.episode_run_time && data.episode_run_time[0] ? `${data.episode_run_time[0]} min` : 'N/A');
            const status = data.status || 'N/A';

            let ageRating = '';

            if (type === 'movie' && data.release_dates && data.release_dates.results) {
                const brRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'BR');
                const classification = brRelease?.release_dates?.find(release => release.certification)?.certification;
                if (classification) ageRating = classification;
            } else if (type === 'tv' && data.content_ratings && data.content_ratings.results) {
                const brRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'BR');
                if (brRating?.rating) ageRating = brRating.rating;
            }

            const genres = data.genres ? data.genres.map(g => `<span class="tag">${escapeCinefiaHtml(g.name)}</span>`).join('') : '';

            const scoresHtml = `
                <div class="score-badge">
                    <i class="fa-solid fa-star" style="color: #f5c518"></i> TMDB: ${data.vote_average ? data.vote_average.toFixed(1) : 'N/A'}
                </div>
                <div class="score-badge">
                    <i class="fa-solid fa-clapperboard" style="color:var(--accent)"></i> Cinéfia Score: <span class="cinefia-score">${calculateCinefiaScore(data)}/100</span>
                </div>
            `;

            let providersHtml = '';
            const watchProviders = data['watch/providers']?.results?.BR;
            const providers = [...new Map(['flatrate', 'free', 'ads', 'rent', 'buy'].flatMap(key => watchProviders?.[key] || []).map(item => [item.provider_id ?? item.provider_name, item])).values()];
            if (providers.length) {
                const list = providers;
                const providerLoginUrl = (name) => {
                    const n = (name || '').toLowerCase();
                    const known = [
                        [/netflix/, 'https://www.netflix.com/login'],
                        [/prime video|amazon prime/, 'https://www.primevideo.com/'],
                        [/disney\+|disney plus/, 'https://www.disneyplus.com/login'],
                        [/max|hbo max/, 'https://www.max.com/'],
                        [/apple tv/, 'https://tv.apple.com/'],
                        [/globoplay/, 'https://globoplay.globo.com/'],
                        [/paramount\+|paramount plus/, 'https://www.paramountplus.com/'],
                        [/crunchyroll/, 'https://www.crunchyroll.com/login'],
                        [/mubi/, 'https://mubi.com/users/sign_in'],
                        [/telecine/, 'https://www.telecine.com.br/'],
                        [/youtube/, 'https://www.youtube.com/'],
                        [/pluto tv/, 'https://pluto.tv/'],
                        [/looke/, 'https://www.looke.com.br/'],
                        [/mercado play/, 'https://www.mercadolivre.com.br/'],
                        [/google play/, 'https://play.google.com/store/movies']
                    ];
                    return (known.find(([pattern]) => pattern.test(n)) || [null, null])[1];
                };
                const unmatchedProviders = list.filter(p => !providerLoginUrl(p.provider_name)).map(p => p.provider_name);
                const logosHtml = list.map((p, index) => {
                    const href = providerLoginUrl(p.provider_name);
                    const name = escapeCinefiaHtml(p.provider_name);
                    const logo = `<img src="${IMG_BASE_URL}${escapeCinefiaHtml(p.logo_path)}" alt="${name}" title="${name}${href ? ' — abrir serviço' : ' — URL de acesso não configurada'}" class="provider-logo">`;
                    const hidden = index >= 9 ? ' hidden data-ficha-extra-provider' : '';
                    return href ? `<a class="provider-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${name}"${hidden}>${logo}</a>` : `<span class="provider-link provider-link-unmapped" title="URL de acesso não configurada para ${name}"${hidden}>${logo}<small>URL pendente</small></span>`;
                }).join('');
                if (unmatchedProviders.length) console.warn('[Cinéfia] URLs de acesso pendentes para provedores:', [...new Set(unmatchedProviders)]);
                providersHtml = `
                    <div class="streaming-providers">
                        <span class="streaming-title">Disponível em:</span>
                        <div class="provider-logos">${logosHtml}</div>
                    </div>
                `;
            }

            renderCinefiaFullSheet(content, data, type, {title, poster, year, duration, status, overview, genres, scoresHtml, ageRating, providersHtml, providerCount: providers.length});
        }

        /* A ficha em tela cheia reaproveita os serviços e as ações do Cinéfia. */
        let fichaPinObserver;
        let fichaCinemaCache;

        function fichaTopBar() {
            return `<div class="ficha-topbar"><div class="ficha-shell">
                <button class="feature-btn ficha-back" type="button" onclick="forceCloseModal()"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Voltar</button>
                <span>Cinéfia <b>/</b> Ficha do título</span>
            </div></div>`;
        }

        function fichaEpisodeCard(episode, still, rating, airDate, overview) {
            const safe = escapeCinefiaHtml;
            return `<article class="episode-card">
                <img class="episode-img" src="${safe(still)}" alt="" loading="lazy">
                <div class="episode-content">
                    <div class="episode-meta"><span class="episode-number">EP. ${safe(episode.episode_number)}</span>${episode.runtime ? `<span>${safe(episode.runtime)} min</span>` : ''}<span class="episode-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${safe(rating)}</span></div>
                    <div class="episode-title">${safe(episode.name || 'Episódio sem título')}</div>
                    <details class="ficha-episode-synopsis"><summary>Sinopse do episódio</summary><p>${safe(overview)}</p></details>
                    ${episode.air_date ? `<time class="ficha-air-date" datetime="${safe(episode.air_date)}" title="Data de exibição">${safe(airDate)}</time>` : '<span class="ficha-air-date">Data indisponível</span>'}
                </div>
            </article>`;
        }

        function fichaNowPlaying() {
            if (fichaCinemaCache?.key === TMDB_API_KEY && fichaCinemaCache.until > Date.now()) return fichaCinemaCache.promise;
            const url = `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`;
            const get = async page => {
                const response = await fetch(`${url}&page=${page}`);
                if (!response.ok) throw new Error('Cartaz indisponível');
                return response.json();
            };
            const promise = get(1).then(async first => {
                const pages = await Promise.allSettled(Array.from({length: Math.min(3, Math.max(0, (first.total_pages || 1) - 1))}, (_, index) => get(index + 2)));
                return new Set([first, ...pages.filter(page => page.status === 'fulfilled').map(page => page.value)].flatMap(page => (page.results || []).map(item => Number(item.id))));
            }).catch(() => new Set());
            fichaCinemaCache = {key: TMDB_API_KEY, until: Date.now() + 10 * 60 * 1000, promise};
            return promise;
        }

        function renderCinefiaFullSheet(content, data, type, view) {
            const safe = escapeCinefiaHtml;
            const isTV = type === 'tv';
            const id = Number(data.id);
            const title = view.title || 'Título sem nome';
            const favorite = isFavorite(id, type);
            const crew = data.credits?.crew || [];
            const people = jobs => [...new Set(crew.filter(person => jobs.includes(person.job)).map(person => person.name).filter(Boolean))].join(', ');
            const dollars = value => Number(value) > 0 ? `US$ ${Number(value).toLocaleString('pt-BR')}` : 'Não informado';
            const statusLabels = {Released:'Lançado', Ended:'Encerrada', Canceled:'Cancelada', 'Returning Series':'Em andamento', 'In Production':'Em produção', Planned:'Planejado', 'Post Production':'Pós-produção'};
            const age = /^(l|livre)$/i.test(view.ageRating) ? 'L' : view.ageRating;
            const ageColors = {L:'#21aa59',10:'#287ccb',12:'#eab308',14:'#ef812d',16:'#ce293b',18:'#080808'};
            const ageText = age === 'L' ? 'Livre' : age;
            const rating = age ? `<span class="age-rating ficha-age" style="--ficha-age-color:${Object.hasOwn(ageColors, age) ? ageColors[age] : '#343640'}" aria-label="Classificação indicativa ${safe(ageText)}">${safe(age)}</span>` : 'Não informada';
            const info = [
                ['Lançamento', view.year], ['Duração', view.duration], ['Tipo', isTV ? 'Série de TV' : 'Filme'],
                ['Classificação', rating, true], ['Status', statusLabels[view.status] || view.status],
                ...(isTV ? [['Criador(es)', data.created_by?.map(person => person.name).join(', ')], ['Temporadas', data.number_of_seasons], ['Episódios', data.number_of_episodes]] : [['Diretor', people(['Director'])], ['Escritor(es)', people(['Writer', 'Screenplay', 'Story'])]]),
                ['Orçamento', dollars(data.budget)], ['Receita', dollars(data.revenue)]
            ];
            const cast = (data.credits?.cast || []).slice(0, 12);
            const castMarkup = cast.length ? `<div class="cast-grid">${cast.map(person => `<div class="cast-card">
                ${person.profile_path ? `<img class="cast-img" src="https://image.tmdb.org/t/p/w185${safe(person.profile_path)}" alt="" loading="lazy">` : '<span class="ficha-cast-placeholder"><i class="fa-solid fa-user" aria-hidden="true"></i></span>'}
                <div><div class="cast-name">${safe(person.name)}</div><div class="cast-character">${safe(person.character || 'Personagem não informado')}</div></div>
            </div>`).join('')}</div>` : '<p class="ficha-note">Elenco não localizado.</p>';
            const backdrop = /^\/[\w.-]+$/.test(data.backdrop_path || '') ? ` style="--ficha-backdrop:url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})"` : '';
            const seasons = data.seasons || [];

            closeDetailSidePanel();
            content.dataset.fichaKey = `${type}-${id}`;
            content.innerHTML = `${fichaTopBar()}
                <div class="ficha-art"${backdrop} aria-hidden="true"></div>
                <div class="ficha-shell ficha-body">
                    <section class="ficha-intro" aria-labelledby="ficha-title">
                        <img src="${safe(view.poster)}" alt="Pôster de ${safe(title)}" class="modal-img">
                        <div class="ficha-copy">
                            <span class="ficha-kicker">${isTV ? 'Série' : 'Filme'}</span>
                            <h2 class="modal-title" id="ficha-title">${safe(title)}</h2>
                            <div class="modal-tags">${view.genres}</div>
                            <div class="external-scores">${view.scoresHtml}</div>
                            <div class="synopsis-section">
                                <h3>Sinopse</h3><p class="modal-desc synopsis-collapsed">${safe(view.overview)}</p>
                                <button class="synopsis-more-btn" type="button" style="display:none" onclick="openSynopsisQuadrant()"><i class="fa-solid fa-expand" aria-hidden="true"></i> Mostrar mais</button>
                            </div>
                        </div>
                    </section>
                    <div class="ficha-pin">
                        <section class="ficha-panel ficha-streaming" aria-labelledby="ficha-streaming-title">
                            <h3 id="ficha-streaming-title"><i class="fa-solid fa-tv" aria-hidden="true"></i> Onde assistir</h3>
                            ${view.providersHtml || `<p class="ficha-note" id="ficha-availability">${isTV ? 'Disponibilidade da série não localizada no Brasil.' : 'Streaming não localizado no Brasil.'}</p>`}
                            ${view.providerCount > 9 ? `<button class="feature-btn ficha-providers-more" type="button" aria-expanded="false">Ver todas (${view.providerCount}) <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : ''}
                        </section>
                        <section class="ficha-panel ficha-info" aria-labelledby="ficha-info-title">
                            <h3 id="ficha-info-title"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Informações</h3>
                            <dl class="ficha-info-grid">${info.map(([label, value, html]) => `<div><dt>${label}</dt><dd>${html ? value : safe(value ?? 'Não informado')}</dd></div>`).join('')}</dl>
                            <div class="feature-actions">
                                <button class="feature-btn ficha-trailer" type="button"><i class="fa-solid fa-play" aria-hidden="true"></i> Assistir ao trailer</button>
                                <button class="favorite-detail-btn ${favorite ? 'active' : ''}" type="button"><i class="fa-${favorite ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i> ${favorite ? 'Na Minha Lista' : 'Adicionar à Minha Lista'}</button>
                            </div>
                        </section>
                        <div class="ficha-comments-row"><button class="feature-btn ficha-comments-button" type="button" aria-controls="detailSideOverlay" aria-expanded="false"><i class="fa-regular fa-comments" aria-hidden="true"></i> Comentários e avaliações <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>
                    </div>
                    <div class="ficha-scroll-hint"><button class="feature-btn" type="button">Role para explorar <i class="fa-solid fa-angle-down" aria-hidden="true"></i></button></div>
                    <div class="ficha-sections ${isTV ? 'ficha-series' : 'ficha-movie'}" inert>
                        <section class="ficha-panel ficha-cast"><h3>Elenco</h3>${castMarkup}</section>
                        ${isTV ? `<section class="ficha-panel ficha-episodes" aria-labelledby="ficha-episodes-title">
                            <div class="episodes-toolbar"><h3 id="ficha-episodes-title">Episódios</h3><select class="season-select" id="seasonSelect_${id}" aria-label="Temporada" ${seasons.length ? '' : 'disabled'}>${seasons.map(season => `<option value="${Number(season.season_number)}">${safe(season.name)}</option>`).join('')}</select></div>
                            <div class="episode-grid ficha-episode-list" id="episodeGrid_${id}" role="region" aria-label="Lista de episódios" tabindex="0">${seasons.length ? '' : '<p class="ficha-note">Temporadas não localizadas.</p>'}</div>
                        </section>` : ''}
                    </div>
                    <details class="expandable-details ficha-comments-source" data-id="${id}" data-type="${type}" hidden>
                        <summary>Comentários e avaliações</summary>
                        <div class="expandable-body"><div class="cinefia-comments-container" id="cinefiaCommentsBody-${type}-${id}"></div></div>
                    </details>
                </div>`;

            const pin = content.querySelector('.ficha-pin');
            const intro = content.querySelector('.ficha-intro');
            const sections = content.querySelector('.ficha-sections');
            const explore = content.querySelector('.ficha-scroll-hint button');
            const commentsButton = content.querySelector('.ficha-comments-button');
            const select = content.querySelector('.season-select');
            const providerButton = content.querySelector('.ficha-providers-more');
            let loadedEpisodes = false;
            const onScroll = () => {
                const revealed = content.scrollTop >= Math.min(62, Math.max(18, intro.offsetHeight * .12));
                content.classList.toggle('ficha-explored', revealed);
                sections.inert = !revealed;
                commentsButton.tabIndex = revealed ? 0 : -1;
                explore.tabIndex = revealed ? -1 : 0;
                if (revealed && select?.value && !loadedEpisodes) {
                    loadedEpisodes = true;
                    void loadSeasonEpisodes(id, select.value);
                }
            };
            content.onscroll = onScroll;
            select?.addEventListener('change', () => void loadSeasonEpisodes(id, select.value));
            explore.addEventListener('click', () => content.scrollTo({top: intro.offsetHeight - 10, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
            commentsButton.addEventListener('click', () => {
                const source = content.querySelector('.ficha-comments-source');
                source.open = true;
                openDetailSidePanel(source);
                commentsButton.setAttribute('aria-expanded', 'true');
                void loadCinefiaComments(id, type);
                document.querySelector('#detailSideOverlay .detail-side-heading button')?.focus({preventScroll: true});
            });
            content.querySelector('.ficha-trailer').addEventListener('click', () => void openTrailer(id, title, type));
            content.querySelector('.favorite-detail-btn').addEventListener('click', () => void toggleFavorite(id, type));
            providerButton?.addEventListener('click', () => {
                const expanded = pin.classList.toggle('ficha-streaming-wide');
                content.querySelectorAll('[data-ficha-extra-provider]').forEach(provider => { provider.hidden = !expanded; });
                providerButton.setAttribute('aria-expanded', String(expanded));
                providerButton.innerHTML = expanded ? 'Recolher <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>' : `Ver todas (${view.providerCount}) <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;
            });
            if (!isTV && !view.providerCount) {
                const availability = content.querySelector('#ficha-availability');
                void fichaNowPlaying().then(ids => { if (availability?.isConnected && ids.has(id)) availability.textContent = 'Em cartaz nos cinemas. Streaming não localizado no Brasil.'; });
            }
            fichaPinObserver?.disconnect();
            if (typeof ResizeObserver === 'function') {
                fichaPinObserver = new ResizeObserver(() => content.style.setProperty('--ficha-pin-height', `${pin.offsetHeight}px`));
                fichaPinObserver.observe(pin);
            }
            requestAnimationFrame(() => {
                if (!intro.isConnected) return;
                refreshSynopsisControl();
                onScroll();
                if (content.closest('#detailsModal')?.classList.contains('active') && document.activeElement === document.body) content.querySelector('.ficha-back')?.focus({preventScroll:true});
            });
        }

        function closeProfileFromFicha() {
            if (activeDetailSide?.details.classList.contains('ficha-comments-source')) {
                document.getElementById('profileModal')?.classList.remove('active');
                document.querySelector('#detailSideOverlay .detail-side-heading button')?.focus({preventScroll: true});
                return;
            }
            forceCloseModal();
        }

        async function loadSeasonEpisodes(tvId, seasonNumber) {
            const grid = document.getElementById(`episodeGrid_${tvId}`);
            if (!grid || !TMDB_API_KEY || !/^\d+$/.test(String(seasonNumber))) return;

            const request = Symbol();
            grid.cinefiaSeasonRequest = request;
            grid.innerHTML = '<div class="episode-loading"><div class="spinner"></div><p style="margin-top:10px;">Carregando episódios...</p></div>';
            grid.scrollTop = 0;
            try {
                const data = await fetchFichaJson(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                if (!grid.isConnected || grid.cinefiaSeasonRequest !== request) return;
                const episodes = data.episodes || [];

                if (!episodes.length) {
                    grid.innerHTML = '<div class="episode-loading">Nenhum episódio encontrado para esta temporada.</div>';
                    return;
                }

                grid.innerHTML = episodes.map(ep => {
                    const still = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                    const rating = ep.vote_average ? ep.vote_average.toFixed(1) : 'N/A';
                    const airDate = ep.air_date ? ep.air_date.split('-').reverse().join('/') : 'N/A';
                    const overview = ep.overview || 'Sem sinopse disponível.';
                    return fichaEpisodeCard(ep, still, rating, airDate, overview);
                }).join('');
                grid.dataset.loaded = String(seasonNumber);
            } catch (error) {
                if (!grid.isConnected || grid.cinefiaSeasonRequest !== request) return;
                console.error('Erro ao carregar episódios:', error);
                grid.innerHTML = '<div class="episode-loading" style="color:#ef4444;">Não foi possível carregar os episódios.</div>';
            }
        }

        // --- NAVEGAÇÃO E ESTADOS ---
        function setActiveNav(id) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function loadMyList() {
            currentMode = 'mylist';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Minha Lista';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navMyList');
            hideCategories();
            fetchContent();
        }

        function loadRecommendations() {
            currentMode = 'recommendations';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Recomendados para você';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navRecommendations');
            hideCategories();
            fetchContent();
        }

        function loadHome() {
            currentMode = 'home';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Filmes em Destaque';
            document.querySelector('.hero').style.display = 'block';
            setActiveNav('navHome');
            hideCategories();
            fetchContent();
        }

        function loadTrending() {
            currentMode = 'trending';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Em Alta nesta Semana';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navTrending');
            hideCategories();
            fetchContent();
        }

        function loadMovies() {
            currentMode = 'movies';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Filmes';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navMovies');
            hideCategories();
            fetchContent();
        }

        function loadCinemaMovies() {
            currentMode = 'cinema';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Filmes em Cartaz (Cinema)';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navCinema');
            hideCategories();
            fetchContent();
        }

        function loadStreamingMovies() {
            currentMode = 'streaming';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Filmes em Streaming';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navStreaming');
            hideCategories();
            fetchContent();
        }

        function loadSeries() {
            currentMode = 'series';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Séries';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navSeries');
            hideCategories();
            fetchContent();
        }

        function toggleCategoriesView() {
            currentMode = 'categories';
            currentPage = 1;
            searchInput.value = '';
            document.getElementById('sectionTitle').innerText = 'Explorar por Categoria';
            document.querySelector('.hero').style.display = 'none';
            setActiveNav('navCategories');

            const catBar = document.getElementById('categoriesBar');
            catBar.classList.add('active');

            document.querySelector('.cat-btn').click();
        }

        function hideCategories() {
            document.getElementById('categoriesBar').classList.remove('active');
        }

        function filterByCategory(catId, event) {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');

            currentCategory = catId === 'all' ? '' : catId;
            currentMode = 'categories';
            currentPage = 1;

            if(catId === 'all') {
                currentMode = 'home';
                document.getElementById('sectionTitle').innerText = 'Todos os Gêneros (Populares)';
            } else {
                document.getElementById('sectionTitle').innerText = 'Categoria: ' + event.target.innerText;
            }
            fetchContent();
        }

        // --- PAGINAÇÃO ---
        function updatePagination() {
            const container = document.getElementById('paginationContainer');
            const info = document.getElementById('pageInfo');
            const btnPrev = document.getElementById('prevPage');
            const btnNext = document.getElementById('nextPage');

            if (totalPages > 1) {
                container.style.display = 'flex';
                info.innerText = `Página ${currentPage} de ${totalPages}`;
                btnPrev.disabled = currentPage === 1;
                btnNext.disabled = currentPage >= totalPages;
            } else {
                container.style.display = 'none';
            }
        }

        function changePage(delta) {
            const page = currentPage + delta;
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            fetchContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- MODAIS ---
        function refreshSynopsisControl() {
            const synopsis = document.querySelector('#modalContent .modal-desc');
            const moreButton = document.querySelector('#modalContent .synopsis-more-btn');
            if (!synopsis || !moreButton) return;
            moreButton.style.display = synopsis.scrollHeight > synopsis.clientHeight + 1 ? 'inline-flex' : 'none';
        }

        function openSynopsisQuadrant() {
            const synopsis = document.querySelector('#modalContent .modal-desc');
            if (!synopsis) return;
            let panel = document.getElementById('synopsisQuadrant');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'synopsisQuadrant';
                panel.className = 'synopsis-quadrant';
                panel.innerHTML = `
                    <section class="synopsis-quadrant-card" role="dialog" aria-modal="true" aria-labelledby="synopsisQuadrantTitle">
                        <button class="synopsis-quadrant-close" type="button" aria-label="Fechar sinopse" onclick="closeSynopsisQuadrant()"><i class="fa-solid fa-xmark"></i></button>
                        <h2 class="synopsis-quadrant-title" id="synopsisQuadrantTitle">Sinopse</h2>
                        <div class="synopsis-quadrant-text"></div>
                    </section>`;
                document.body.appendChild(panel);
                panel.addEventListener('click', event => { if (event.target === panel) closeSynopsisQuadrant(); });
            }
            panel.querySelector('.synopsis-quadrant-text').textContent = synopsis.textContent;
            panel.classList.add('active');
            document.addEventListener('keydown', synopsisEscapeHandler);
        }

        function closeSynopsisQuadrant() {
            document.getElementById('synopsisQuadrant')?.classList.remove('active');
            document.removeEventListener('keydown', synopsisEscapeHandler);
        }

        function synopsisEscapeHandler(event) {
            if (event.key === 'Escape') closeSynopsisQuadrant();
        }

        function setMobileNavigation(isOpen) {
            document.body.classList.toggle('mobile-nav-open', isOpen);
            const button = document.querySelector('.mobile-nav-toggle');
            if (button) {
                button.setAttribute('aria-expanded', String(isOpen));
                button.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
                button.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-ellipsis-vertical'}" aria-hidden="true"></i>`;
            }
            const mobile = window.matchMedia('(max-width: 900px)').matches;
            document.querySelector('.search-brand').setAttribute('aria-expanded', String(mobile ? isOpen : !document.body.classList.contains('desktop-nav-collapsed')));
        }

        function toggleMobileNavigation() {
            setMobileNavigation(!document.body.classList.contains('mobile-nav-open'));
        }

        function toggleDesktopNavigation() {
            const collapsed = document.body.classList.toggle('desktop-nav-collapsed');
            document.querySelector('.desktop-nav-collapse').setAttribute('aria-expanded', String(!collapsed));
            document.querySelector('.search-brand').setAttribute('aria-expanded', String(!collapsed));
            if (cookiePreference === 'preferences') writeCinefiaCookie('cinefia_nav', collapsed ? 'collapsed' : 'expanded');
            document.querySelector(collapsed ? '.search-brand' : '.desktop-nav-collapse').focus({preventScroll: true});
        }

        function openCinefiaNavigation() {
            if (window.matchMedia('(max-width: 900px)').matches) {
                setMobileNavigation(true);
                document.querySelector('.mobile-nav-toggle').focus({preventScroll: true});
            } else if (document.body.classList.contains('desktop-nav-collapsed')) {
                toggleDesktopNavigation();
            }
        }

        let activeDetailSide = null;
        function openDetailSidePanel(details) {
            const body = details.querySelector('.expandable-body');
            const overlay = document.getElementById('detailSideOverlay');
            const host = document.getElementById('detailSideContent');
            if (!body || !overlay || !host) return;
            closeDetailSidePanel();
            const marker = document.createComment('local do painel de detalhes');
            body.before(marker);
            host.append(body);
            activeDetailSide = { details, body, marker };
            document.getElementById('detailSideTitle').textContent = details.querySelector('summary')?.textContent?.trim() || 'Informações';
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.getElementById('detailsModal')?.classList.add('side-panel-open');
            document.addEventListener('keydown', detailSideEscape);
        }
        function closeDetailSidePanel() {
            const overlay = document.getElementById('detailSideOverlay');
            overlay?.classList.remove('active');
            overlay?.setAttribute('aria-hidden', 'true');
            document.getElementById('detailsModal')?.classList.remove('side-panel-open');
            document.removeEventListener('keydown', detailSideEscape);
            if (!activeDetailSide) return;
            const { details, body, marker } = activeDetailSide;
            activeDetailSide = null;
            if (marker.isConnected) marker.replaceWith(body);
            if (details.isConnected && details.open) details.open = false;
            if (details.classList.contains('ficha-comments-source')) {
                const button = document.querySelector('#detailsModal .ficha-comments-button');
                button?.setAttribute('aria-expanded', 'false');
                if (document.getElementById('detailsModal')?.classList.contains('active')) button?.focus({preventScroll: true});
            }
        }
        function detailSideEscape(event) {
            if (event.key !== 'Escape') return;
            if (activeDetailSide?.details.classList.contains('ficha-comments-source') && document.getElementById('profileModal')?.classList.contains('active')) closeProfileFromFicha();
            else closeDetailSidePanel();
        }

        function refreshOpenFichaComments() {
            const source = activeDetailSide?.details;
            if (!source?.classList.contains('ficha-comments-source')) return;
            const {id, type} = source.dataset;
            const target = document.getElementById(`cinefiaCommentsBody-${type}-${id}`);
            if (target && target.dataset.authId !== (cinefiaAuthUser?.id || '')) void loadCinefiaComments(Number(id), type);
        }

        function closeModal(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'detailsModal') {
                    closeDetailSidePanel();
                    document.getElementById('modalContent').innerHTML = '';
                }
            }
        }

        function forceCloseModal() {
            closeDetailSidePanel();
            document.getElementById('detailsModal')?.classList.remove('active');
            fichaPinObserver?.disconnect();
            document.getElementById('settingsModal')?.classList.remove('active');
            document.getElementById('profileModal')?.classList.remove('active');
            document.getElementById('onboardingModal')?.classList.remove('active');
            document.getElementById('cinefiaExperienceOnboarding')?.classList.remove('active');
            document.getElementById('experienceModal')?.classList.remove('active');
        }

        function openSettingsModal() {
            document.getElementById('settingsModal').classList.add('active');
            document.getElementById('apiKeyInput').value = TMDB_API_KEY;
        }

        function saveSettings() {
            const key = document.getElementById('apiKeyInput').value.trim();
            if (key) {
                localStorage.setItem('tmdb_api_key', key);
                TMDB_API_KEY = key;
                document.getElementById('settingsMsg').style.display = 'block';
                setTimeout(() => { forceCloseModal(); initHeroCarousel(); loadHome(); }, 1000);
            }
        }

        function showError(msg) {
            const grid = document.getElementById('resultsGrid');
            grid.innerHTML = `<div class="message-box" style="color: #ef4444">${escapeCinefiaHtml(msg)}</div>`;
        }


/* ======================================================================
   AUTENTICAÇÃO SUPABASE — CONTA ONLINE (sem remover os perfis locais)
   ====================================================================== */
let cinefiaSupabaseClient = null;
let cinefiaAuthUser = null;
let resolveCinefiaAuth;
const cinefiaAuthStartup = new Promise(resolve => { resolveCinefiaAuth = resolve; });
let cinefiaCloudFavorites = [];
let cinefiaCloudFavoritesLoadedFor = null;
let cinefiaCloudSyncMessage = 'Os comentários, avaliações e favoritos precisam das tabelas do Supabase configuradas.';
let cinefiaCloudSyncKind = 'info';
const CINEFIA_COMMENT_MAX_LENGTH = 2000;
let cinefiaAuthMode = 'login';
let cinefiaSignupInstructionsAccepted = false;
let cinefiaAuthMessage = '';
let cinefiaAuthMessageKind = 'info';
let cinefiaAuthBusy = false;
let cinefiaAuthSubscription = null;
let cinefiaPasswordRecoveryMode = /(?:^|[&#])type=recovery(?:&|$)/.test(window.location.hash || '');

function escapeCinefiaHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}

let cookiePreference;
let cookieReturnFocus;
const securityEventTimes = new Map();

function reportCinefiaSecurityEvent(event) {
    const now = Date.now();
    if (securityEventTimes.has(event) && now - securityEventTimes.get(event) < 60000) return;
    securityEventTimes.set(event, now);
    console.warn('[Cinéfia / segurança]', event);
}

function readCinefiaCookie(name) {
    try {
        return document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='))?.slice(name.length + 1);
    } catch {
        return undefined;
    }
}

function writeCinefiaCookie(name, value, age = 15552000) {
    if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) return;
    try {
        document.cookie = `${name}=${value}; Max-Age=${age}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {
        // A escolha continua válida nesta página se o navegador bloquear o armazenamento.
    }
}

function initCinefiaPrivacy() {
    cookiePreference = readCinefiaCookie('cinefia_cookie_choice');
    if (cookiePreference === 'preferences' && readCinefiaCookie('cinefia_nav') === 'collapsed') {
        document.body.classList.add('desktop-nav-collapsed');
        document.querySelector('.desktop-nav-collapse').setAttribute('aria-expanded', 'false');
    }
    setMobileNavigation(false);
    document.getElementById('cookiePreferences').hidden = ['essentials', 'preferences'].includes(cookiePreference);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
            setMobileNavigation(false);
            document.querySelector('.search-brand').focus({preventScroll: true});
        }
    });
}

function openCookiePreferences() {
    cookieReturnFocus = document.activeElement;
    setMobileNavigation(false);
    const banner = document.getElementById('cookiePreferences');
    banner.hidden = false;
    banner.querySelector('button')?.focus();
}

function setCookiePreferences(remember) {
    cookiePreference = remember ? 'preferences' : 'essentials';
    writeCinefiaCookie('cinefia_cookie_choice', cookiePreference);
    if (remember) {
        writeCinefiaCookie('cinefia_nav', document.body.classList.contains('desktop-nav-collapsed') ? 'collapsed' : 'expanded');
    } else {
        writeCinefiaCookie('cinefia_nav', '', 0);
    }
    document.getElementById('cookiePreferences').hidden = true;
    if (cookieReturnFocus?.getClientRects().length) cookieReturnFocus.focus();
    else if (cookieReturnFocus) document.querySelector('.search-brand').focus({preventScroll: true});
    cookieReturnFocus = null;
}

document.addEventListener('securitypolicyviolation', event => {
    if (event.disposition === 'enforce') reportCinefiaSecurityEvent('csp-block');
});

function setCinefiaAuthMessage(message, kind = 'info') {
    cinefiaAuthMessage = message;
    cinefiaAuthMessageKind = kind;
    const messageNode = document.getElementById('cinefiaAuthMessage');
    if (messageNode) {
        messageNode.textContent = message;
        messageNode.dataset.kind = kind;
    }
}

function renderSupabaseAuthPanel() {
    const panel = document.getElementById('supabaseAuthPanel');
    if (!panel) return;
    refreshOpenFichaComments();

    if (!cinefiaSupabaseClient) {
        panel.innerHTML = `
            <h3 class="cinefia-auth-title"><i class="fa-solid fa-shield-halved" style="color:var(--accent)"></i> Conta Cinéfia</h3>
            <p class="cinefia-auth-muted">A autenticação online não conseguiu iniciar. Verifique a conexão com a biblioteca Supabase e recarregue o site.</p>
            <p id="cinefiaAuthMessage" class="cinefia-auth-message" data-kind="error">${escapeCinefiaHtml(cinefiaAuthMessage || 'Não foi possível inicializar o cliente Supabase.')}</p>
        `;
        return;
    }

    if (cinefiaAuthUser && cinefiaPasswordRecoveryMode) {
        panel.innerHTML = `
            <h3 class="cinefia-auth-title"><i class="fa-solid fa-key" style="color:var(--accent)"></i> Criar nova senha</h3>
            <p class="cinefia-auth-muted">Defina uma nova senha para sua conta Cinéfia. Use pelo menos 10 caracteres.</p>
            <form class="cinefia-auth-form" onsubmit="handleCinefiaPasswordUpdate(event)">
                <div class="cinefia-auth-field"><label for="cinefiaNewPassword">Nova senha</label><input id="cinefiaNewPassword" type="password" autocomplete="new-password" minlength="10" maxlength="128" required></div>
                <div class="cinefia-auth-field"><label for="cinefiaConfirmNewPassword">Confirmar nova senha</label><input id="cinefiaConfirmNewPassword" type="password" autocomplete="new-password" minlength="10" maxlength="128" required></div>
                <div class="cinefia-auth-actions"><button id="cinefiaAuthSubmit" type="submit" class="save-btn" style="margin-top:0;" ${cinefiaAuthBusy ? 'disabled' : ''}>Atualizar senha</button></div>
            </form>
            <p id="cinefiaAuthMessage" class="cinefia-auth-message" data-kind="${escapeCinefiaHtml(cinefiaAuthMessageKind)}">${escapeCinefiaHtml(cinefiaAuthMessage)}</p>
        `;
        return;
    }

    if (cinefiaAuthUser) {
        const email = escapeCinefiaHtml(cinefiaAuthUser.email || 'E-mail não disponibilizado');
        panel.innerHTML = `
            <div class="cinefia-auth-account">
                <div class="cinefia-auth-account-icon"><i class="fa-solid fa-user-check"></i></div>
                <h3 class="cinefia-auth-title">Bem-vindo ao Cinéfia!</h3>
                <p class="cinefia-auth-muted">Você está conectado à sua conta autenticada.</p>
                <div class="cinefia-auth-email"><i class="fa-solid fa-envelope" style="color:var(--accent); margin-right:6px;"></i>${email}</div>
                <div class="cinefia-auth-actions">
                    <button type="button" class="feature-btn" onclick="importLocalFavoritesToCinefiaCloud()" ${cinefiaAuthBusy ? 'disabled' : ''}><i class="fa-solid fa-cloud-arrow-up"></i> Importar favoritos deste navegador</button>
                    <button type="button" class="feature-btn" onclick="signOutCinefia()" ${cinefiaAuthBusy ? 'disabled' : ''}><i class="fa-solid fa-right-from-bracket"></i> Sair da conta</button>
                </div>
                <p class="cinefia-cloud-status" data-kind="${escapeCinefiaHtml(cinefiaCloudSyncKind)}"><i class="fa-solid fa-cloud"></i> ${escapeCinefiaHtml(cinefiaCloudSyncMessage)}</p>
                <p id="cinefiaAuthMessage" class="cinefia-auth-message" data-kind="${escapeCinefiaHtml(cinefiaAuthMessageKind)}">${escapeCinefiaHtml(cinefiaAuthMessage)}</p>
            </div>
        `;
        return;
    }

    const isSignup = cinefiaAuthMode === 'signup';
    if (isSignup && !cinefiaSignupInstructionsAccepted) {
        panel.innerHTML = `
            <h3 class="cinefia-auth-title"><i class="fa-solid fa-shield-halved" style="color:var(--accent)"></i> Antes de criar sua conta</h3>
            <div class="cinefia-auth-instructions">
                <p>No Cinéfia, você cria uma conta com e-mail, nome de usuário e senha.</p>
                <ol>
                    <li>Preencha seus dados e envie o cadastro.</li>
                    <li>Ao concluir o cadastro, você já entra na sua conta.</li>
                    <li>Nos próximos acessos, use o e-mail e a senha cadastrados.</li>
                </ol>
                <p>O nome de usuário deve ter de 3 a 20 caracteres: letras minúsculas, números ou _.</p>
            </div>
            <div class="cinefia-auth-actions">
                <button type="button" class="save-btn" style="margin-top:0" onclick="continueCinefiaSignup()">Entendi, continuar</button>
                <button type="button" class="cinefia-auth-switch" onclick="setCinefiaAuthMode('login')">Voltar para entrar</button>
            </div>
        `;
        return;
    }
    panel.innerHTML = `
        <h3 class="cinefia-auth-title"><i class="fa-solid fa-shield-halved" style="color:var(--accent)"></i> ${isSignup ? 'Criar conta Cinéfia' : 'Entrar na sua conta'}</h3>
        <p class="cinefia-auth-muted">${isSignup ? 'Preencha seus dados para criar sua conta e começar a usar o Cinéfia.' : 'Entre com seu e-mail e senha.'}</p>
        <form class="cinefia-auth-form" onsubmit="submitCinefiaAuthForm(event)">
            ${isSignup ? `
                <button type="button" class="cinefia-auth-switch cinefia-auth-how-link" onclick="showCinefiaSignupInstructions()"><i class="fa-regular fa-circle-question"></i> Como funciona?</button>
                <div class="cinefia-auth-field">
                    <label for="cinefiaAuthUsername">Nome de usuário</label>
                    <input id="cinefiaAuthUsername" name="username" type="text" autocomplete="username" minlength="3" maxlength="20" pattern="[a-z0-9_]{3,20}" placeholder="ex: davi_cine" required>
                    <small class="cinefia-auth-muted">Use apenas letras minúsculas, números e _.</small>
                </div>
            ` : ''}
            <div class="cinefia-auth-field">
                <label for="cinefiaAuthEmail">E-mail</label>
                <input id="cinefiaAuthEmail" name="email" type="email" autocomplete="email" maxlength="254" placeholder="voce@exemplo.com" required>
            </div>
            <div class="cinefia-auth-field">
                <label for="cinefiaAuthPassword">Senha</label>
                <input id="cinefiaAuthPassword" name="password" type="password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" minlength="${isSignup ? '10' : '1'}" maxlength="128" placeholder="${isSignup ? 'Use pelo menos 10 caracteres' : 'Sua senha'}" required>
            </div>
            ${isSignup ? `
                <div class="cinefia-auth-field">
                    <label for="cinefiaAuthConfirmPassword">Confirmar senha</label>
                    <input id="cinefiaAuthConfirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="10" maxlength="128" placeholder="Digite a senha novamente" required>
                </div>
            ` : ''}
            <div class="cinefia-auth-actions">
                <button id="cinefiaAuthSubmit" type="submit" class="save-btn" style="margin-top:0;" ${cinefiaAuthBusy ? 'disabled' : ''}><i class="fa-solid ${isSignup ? 'fa-user-plus' : 'fa-right-to-bracket'}"></i> ${cinefiaAuthBusy ? 'Processando...' : (isSignup ? 'Cadastrar' : 'Entrar')}</button>
                <button type="button" class="cinefia-auth-switch" data-auth-mode="${isSignup ? 'login' : 'signup'}" onclick="setCinefiaAuthMode(this.dataset.authMode)">${isSignup ? 'Já tenho uma conta — Entrar' : 'Ainda não tem conta? Cadastrar'}</button>
            </div>
            ${!isSignup ? '<button type="button" class="cinefia-auth-switch" style="align-self:flex-start;" onclick="requestCinefiaPasswordReset()">Esqueci minha senha</button>' : ''}
        </form>
        <p id="cinefiaAuthMessage" class="cinefia-auth-message" data-kind="${escapeCinefiaHtml(cinefiaAuthMessageKind)}">${escapeCinefiaHtml(cinefiaAuthMessage)}</p>
    `;
}

function setCinefiaAuthMode(mode) {
    cinefiaAuthMode = mode === 'signup' ? 'signup' : 'login';
    cinefiaSignupInstructionsAccepted = false;
    cinefiaAuthMessage = '';
    cinefiaAuthMessageKind = 'info';
    cinefiaAuthBusy = false;
    renderSupabaseAuthPanel();
}

function continueCinefiaSignup() {
    cinefiaSignupInstructionsAccepted = true;
    renderSupabaseAuthPanel();
}

function showCinefiaSignupInstructions() {
    cinefiaSignupInstructionsAccepted = false;
    renderSupabaseAuthPanel();
}

function setCinefiaAuthBusy(isBusy) {
    cinefiaAuthBusy = isBusy;
    const button = document.getElementById('cinefiaAuthSubmit');
    if (button) {
        button.disabled = isBusy;
        button.innerHTML = isBusy ? '<i class="fa-solid fa-spinner fa-spin"></i> Processando...' : (cinefiaAuthMode === 'signup' ? '<i class="fa-solid fa-user-plus"></i> Cadastrar' : '<i class="fa-solid fa-right-to-bracket"></i> Entrar');
    }
}

function normalizeCinefiaAuthError(error, action) {
    const raw = String(error?.message || '').toLowerCase();
    if (raw.includes('profiles_username_key') || raw.includes('duplicate key') || (raw.includes('username') && (raw.includes('duplicate') || raw.includes('unique')))) return 'Esse nome de usuário já está em uso. Escolha outro.';
    if (raw.includes('invalid login credentials')) return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
    if (raw.includes('email not confirmed')) return 'O acesso desta conta ainda está pendente. Entre em contato com o suporte do Cinéfia.';
    if (raw.includes('user already registered')) return 'Não foi possível concluir o cadastro com esses dados. Tente entrar ou use outro e-mail.';
    if (raw.includes('rate limit') || raw.includes('too many requests')) return 'Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.';
    if (raw.includes('password should be') || raw.includes('password')) return 'A senha não atende aos requisitos configurados. Use uma senha longa e tente novamente.';
    if (raw.includes('failed to fetch') || raw.includes('fetch')) return 'Não foi possível conectar ao Supabase. Verifique sua conexão e as configurações do projeto.';
    return action === 'signup' ? 'Não foi possível concluir o cadastro. Verifique os dados e as configurações de autenticação do Supabase.' : 'Não foi possível entrar. Verifique os dados e tente novamente.';
}

async function ensureCinefiaPrivateProfile(user) {
    if (!cinefiaSupabaseClient || !user?.id) return;
    const suggestedName = String(user.user_metadata?.display_name || (user.email ? user.email.split('@')[0] : '') || 'Usuário Cinéfia').slice(0, 40);
    const { error } = await cinefiaSupabaseClient
        .from('cinefia_profiles')
        .upsert({ user_id: user.id, display_name: suggestedName }, { onConflict: 'user_id', ignoreDuplicates: true });
    if (error) {
        // Login deve continuar disponível mesmo antes de o usuário executar o SQL opcional de perfil.
        console.warn('Conta autenticada; o perfil privado não foi sincronizado. Confira supabase_setup.sql:', error.message);
    }
}

async function ensureCinefiaPublicProfile(user) {
    if (!cinefiaSupabaseClient || !user?.id) return;
    const shortId = String(user.id).replace(/-/g, '').slice(0, 8).toLowerCase();
    let displayName = `Cinefia-${shortId}`;
    const { data: profile, error: profileError } = await cinefiaSupabaseClient
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();
    if (!profileError && profile?.username) {
        const username = String(profile.username).trim();
        if (username.length >= 3 && username.length <= 32) displayName = username;
    }
    const { error } = await cinefiaSupabaseClient
        .from('cinefia_public_profiles')
        .upsert({ user_id: user.id, display_name: displayName }, { onConflict: 'user_id' });
    if (error) {
        console.warn('[Cinéfia] Perfil público não sincronizado; execute o SQL de configuração:', error.message);
    }
}

function setCinefiaCloudStatus(message, kind = 'info') {
    cinefiaCloudSyncMessage = message;
    cinefiaCloudSyncKind = kind;
    const node = document.querySelector('.cinefia-cloud-status');
    if (node) {
        node.textContent = message;
        node.dataset.kind = kind;
    }
}

function getCinefiaSupabaseTableErrorMessage(error, feature = 'dados compartilhados') {
    const message = String(error?.message || '').toLowerCase();
    if (message.includes('relation') && (message.includes('does not exist') || message.includes('schema cache'))) {
        return `A tabela de ${feature} ainda não existe. No Supabase, abra SQL Editor e execute supabase_setup.sql.`;
    }
    if (message.includes('row-level security') || message.includes('permission denied') || message.includes('not allowed')) {
        return `O Supabase bloqueou o acesso a ${feature}. Confira as permissões e políticas RLS no supabase_setup.sql.`;
    }
    if (message.includes('failed to fetch') || message.includes('fetch')) {
        return 'Não foi possível conectar à nuvem. Confira a internet, a URL e a chave pública do Supabase.';
    }
    return `Não foi possível acessar ${feature}. Confira se o SQL de configuração foi executado e se as políticas RLS estão ativas.`;
}

async function loadCinefiaCloudFavorites() {
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) {
        cinefiaCloudFavorites = [];
        cinefiaCloudFavoritesLoadedFor = null;
        updateMyListCount();
        return;
    }
    const userId = cinefiaAuthUser.id;
    cinefiaCloudFavoritesLoadedFor = null;
    setCinefiaCloudStatus('Carregando a Minha Lista da nuvem…', 'info');
    const { data, error } = await cinefiaSupabaseClient
        .from('cinefia_favorites')
        .select('media_type,tmdb_id,title,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
    if (error) {
        cinefiaCloudFavorites = [];
        cinefiaCloudFavoritesLoadedFor = null;
        setCinefiaCloudStatus(getCinefiaSupabaseTableErrorMessage(error, 'favoritos'), 'error');
        console.warn('[Cinéfia] Não foi possível carregar favoritos da nuvem:', error.message);
        updateMyListCount();
        return;
    }
    // Só considera a lista da nuvem pronta se a resposta pertencer à conta que continua conectada.
    if (!cinefiaAuthUser || cinefiaAuthUser.id !== userId) return;
    cinefiaCloudFavorites = (data || []).map(row => ({ id: Number(row.tmdb_id), type: row.media_type, title: row.title || '' }));
    cinefiaCloudFavoritesLoadedFor = userId;
    setCinefiaCloudStatus(`Nuvem conectada: ${cinefiaCloudFavorites.length} favorito(s) desta conta sincronizado(s).`, 'success');
    updateMyListCount();
    renderCurrentListState();
}

async function importLocalFavoritesToCinefiaCloud() {
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) {
        setCinefiaCloudStatus('Entre na sua conta antes de importar favoritos para a nuvem.', 'error');
        return;
    }
    const local = getFavoriteItems();
    if (!local.length) {
        setCinefiaCloudStatus('Não há favoritos de visitante neste navegador para importar.', 'info');
        return;
    }
    setCinefiaCloudStatus('Enviando os favoritos deste navegador para sua conta…', 'info');
    const rows = local.slice(0, 50).map(item => ({
        user_id: cinefiaAuthUser.id,
        media_type: item.type === 'tv' ? 'tv' : 'movie',
        tmdb_id: Number(item.id),
        title: String(item.title || `${item.type === 'tv' ? 'Série' : 'Filme'} ${item.id}`).slice(0, 300)
    }));
    const { error } = await cinefiaSupabaseClient
        .from('cinefia_favorites')
        .upsert(rows, { onConflict: 'user_id,media_type,tmdb_id' });
    if (error) {
        setCinefiaCloudStatus(getCinefiaSupabaseTableErrorMessage(error, 'favoritos'), 'error');
        console.error('[Cinéfia] Erro ao importar favoritos locais:', error);
        return;
    }
    await loadCinefiaCloudFavorites();
    setCinefiaCloudStatus('Favoritos locais importados para a nuvem desta conta.', 'success');
}

function formatCinefiaDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Data indisponível';
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function renderCinefiaCommentsMarkup(mediaType, tmdbId, rows) {
    const userId = cinefiaAuthUser?.id || null;
    const myRow = userId ? rows.find(row => row.user_id === userId) : null;
    const validRatings = rows.map(row => Number(row.rating)).filter(value => Number.isFinite(value) && value >= 0 && value <= 10);
    const average = validRatings.length ? (validRatings.reduce((sum, value) => sum + value, 0) / validRatings.length) : null;
    const score = average === null ? '—' : String(Math.round(average * 10));
    const ratingCount = validRatings.length;
    const form = userId ? `
        <form class="cinefia-comment-form" data-title-id="${Number(tmdbId)}" data-title-type="${escapeCinefiaHtml(mediaType)}" onsubmit="submitCinefiaComment(event, Number(this.dataset.titleId), this.dataset.titleType)">
            <div class="cinefia-comment-form-heading">${myRow ? 'Atualize sua avaliação' : 'Avalie esta obra'}</div>
            <label for="cinefiaRating-${mediaType}-${Number(tmdbId)}">Sua nota (0 a 10)</label>
            <div class="cinefia-comment-form-row">
                <input id="cinefiaRating-${mediaType}-${Number(tmdbId)}" type="number" min="0" max="10" step="0.5" value="${myRow ? Number(myRow.rating) : 8}" required aria-label="Nota de 0 a 10">
                <span class="cinefia-comment-form-hint">0 = não gostei • 10 = excelente</span>
            </div>
            <label for="cinefiaComment-${mediaType}-${Number(tmdbId)}">Comentário (opcional)</label>
            <textarea id="cinefiaComment-${mediaType}-${Number(tmdbId)}" maxlength="${CINEFIA_COMMENT_MAX_LENGTH}" rows="3" placeholder="Compartilhe sua opinião. Não inclua dados pessoais.">${escapeCinefiaHtml(myRow?.body || '')}</textarea>
            <div class="cinefia-comment-form-footer"><span>Máximo de ${CINEFIA_COMMENT_MAX_LENGTH} caracteres</span><button class="save-btn" type="submit"><i class="fa-solid fa-paper-plane"></i> ${myRow ? 'Atualizar avaliação' : 'Publicar avaliação'}</button></div>
            <p class="cinefia-comment-feedback" id="cinefiaCommentFeedback-${mediaType}-${Number(tmdbId)}" aria-live="polite"></p>
        </form>` : `
        <div class="cinefia-comments-login-prompt">
            <p>Entre ou crie uma conta para publicar um comentário e uma avaliação. Você pode ler as avaliações públicas sem fazer login.</p>
            <button class="feature-btn" type="button" onclick="openProfileModal()"><i class="fa-solid fa-right-to-bracket"></i> Entrar / Cadastrar</button>
        </div>`;
    const commentList = rows.length ? rows.map(row => `
        <article class="cinefia-comment-card">
            <div class="cinefia-comment-card-top"><strong>${escapeCinefiaHtml(row.display_name || 'Usuário Cinéfia')}</strong><span class="cinefia-comment-rating"><i class="fa-solid fa-star"></i> ${Number(row.rating).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/10</span></div>
            <time datetime="${escapeCinefiaHtml(row.updated_at || row.created_at)}">${formatCinefiaDate(row.updated_at || row.created_at)}</time>
            ${String(row.body || '').trim() ? `<p class="cinefia-comment-text">${escapeCinefiaHtml(row.body)}</p>` : '<p class="cinefia-comment-text cinefia-comment-no-text">Avaliação sem comentário escrito.</p>'}
            ${userId && row.user_id === userId ? '<span class="cinefia-comment-own-label">Sua avaliação</span>' : ''}
        </article>`).join('') : '<div class="cinefia-comments-empty"><i class="fa-regular fa-comments"></i><p>Ainda não há avaliações para este título. Seja o primeiro!</p></div>';
    return `
        <div class="cinefia-community-score">
            <div><span class="cinefia-community-score-label">Nota da comunidade</span><strong>${score}<small>/100</small></strong></div>
            <div class="cinefia-community-score-meta">${ratingCount} avaliação(ões)<br><span>Calculada pela média das notas individuais × 10</span></div>
        </div>
        ${form}
        <div class="cinefia-comments-list-heading"><strong>Opiniões da comunidade</strong><span>${rows.length} contribuição(ões)</span></div>
        <div class="cinefia-comments-list">${commentList}</div>
    `;
}

async function loadCinefiaComments(tmdbId, mediaType) {
    const containerId = `cinefiaCommentsBody-${mediaType}-${Number(tmdbId)}`;
    const target = document.getElementById(containerId);
    if (!target) return;
    const request = Symbol();
    target.cinefiaCommentRequest = request;
    target.dataset.authId = cinefiaAuthUser?.id || '';
    target.innerHTML = '<div class="cinefia-comments-loading"><div class="spinner"></div><p>Carregando comentários da comunidade…</p></div>';
    const client = cinefiaSupabaseClient || await Promise.resolve(window.cinefiaSupabaseReady).catch(() => null);
    if (!target.isConnected || target.cinefiaCommentRequest !== request) return;
    if (!client) {
        target.innerHTML = '<p class="cinefia-comments-error">A conexão com o Supabase ainda não foi iniciada. Recarregue o site e confira se os arquivos foram publicados juntos.</p>';
        return;
    }
    const { data, error } = await client
        .from('cinefia_comments')
        .select('id,user_id,display_name,body,rating,created_at,updated_at')
        .eq('media_type', mediaType)
        .eq('tmdb_id', Number(tmdbId))
        .order('created_at', { ascending: false })
        .limit(100);
    if (!target.isConnected || target.cinefiaCommentRequest !== request) return;
    if (error) {
        reportCinefiaSecurityEvent('comment-read');
        target.innerHTML = `<div class="cinefia-comments-error"><i class="fa-solid fa-cloud-arrow-down"></i><p>${escapeCinefiaHtml(getCinefiaSupabaseTableErrorMessage(error, 'comentários e avaliações'))}</p><p>Depois de executar o SQL, feche e reabra esta área.</p></div>`;
        return;
    }
    target.innerHTML = renderCinefiaCommentsMarkup(mediaType, Number(tmdbId), data || []);
}

async function submitCinefiaComment(event, tmdbId, mediaType) {
    event.preventDefault();
    if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0 || !['movie', 'tv'].includes(mediaType)) return;
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) {
        const feedback = document.getElementById(`cinefiaCommentFeedback-${mediaType}-${Number(tmdbId)}`);
        if (feedback) feedback.textContent = 'Entre na sua conta antes de publicar.';
        return;
    }
    const ratingNode = document.getElementById(`cinefiaRating-${mediaType}-${Number(tmdbId)}`);
    const bodyNode = document.getElementById(`cinefiaComment-${mediaType}-${Number(tmdbId)}`);
    const feedback = document.getElementById(`cinefiaCommentFeedback-${mediaType}-${Number(tmdbId)}`);
    const rating = ratingNode?.value === '' ? NaN : Number(ratingNode?.value);
    const body = String(bodyNode?.value || '').trim();
    if (!Number.isFinite(rating) || rating < 0 || rating > 10 || Math.round(rating * 2) !== rating * 2) {
        if (feedback) feedback.textContent = 'Escolha uma nota de 0 a 10, em intervalos de 0,5.';
        return;
    }
    if (body.length > CINEFIA_COMMENT_MAX_LENGTH) {
        if (feedback) feedback.textContent = `O comentário deve ter no máximo ${CINEFIA_COMMENT_MAX_LENGTH} caracteres.`;
        return;
    }
    if (feedback) feedback.textContent = 'Publicando na nuvem…';
    const row = {
        user_id: cinefiaAuthUser.id,
        media_type: mediaType,
        tmdb_id: Number(tmdbId),
        rating,
        body
    };
    const { error } = await cinefiaSupabaseClient
        .from('cinefia_comments')
        .upsert(row, { onConflict: 'user_id,media_type,tmdb_id' });
    if (error) {
        if (feedback) feedback.textContent = getCinefiaSupabaseTableErrorMessage(error, 'comentários e avaliações');
        reportCinefiaSecurityEvent('comment-write');
        return;
    }
    await loadCinefiaComments(Number(tmdbId), mediaType);
}

const CINEFIA_SITE_URL = 'https://xn--cinfia-dva.com.br/';
const CINEFIA_GUEST_EXPERIENCE_KEY = 'cinefia_guest_experience_v1';
const CINEFIA_INTRO_SESSION_KEY = 'cinefia_intro_seen_v1';
let cinefiaAccountPreferences = null;
let cinefiaPreferencesLoadedFor = null;
let cinefiaPreferencesRequest = null;
const CINEFIA_PREFERENCE_GENRES = [
    [28, 'Ação'], [12, 'Aventura'], [16, 'Animação'], [35, 'Comédia'], [80, 'Crime'], [99, 'Documentário'],
    [18, 'Drama'], [10751, 'Família'], [14, 'Fantasia'], [36, 'História'], [27, 'Terror'], [10402, 'Música'],
    [9648, 'Mistério'], [10749, 'Romance'], [878, 'Ficção científica'], [53, 'Suspense'], [10752, 'Guerra'], [37, 'Faroeste']
];
const CINEFIA_PREFERENCE_PROVIDERS = [
    [8, 'Netflix'], [119, 'Prime Video'], [337, 'Disney+'], [1899, 'Max'], [307, 'Globoplay'], [350, 'Apple TV+'], [531, 'Paramount+'], [283, 'Crunchyroll']
];
const CINEFIA_ORIGIN_OPTIONS = ['Indicação de amigo(a)', 'Google ou outro buscador', 'Redes sociais', 'Vídeo ou postagem', 'Já conhecia o projeto', 'Outro'];
const CINEFIA_PURPOSE_OPTIONS = ['Descobrir filmes e séries', 'Encontrar onde assistir', 'Guardar minha lista', 'Ler e publicar avaliações', 'Explorar recomendações', 'Outro'];

function defaultCinefiaPreferences() { return { origin: '', purpose: '', genres: [], providers: [] }; }
function normalizeCinefiaPreferences(row = {}) {
    const safeIds = (value, allowed) => (Array.isArray(value) ? value : []).map(Number).filter(id => allowed.some(([allowedId]) => allowedId === id));
    return { origin: String(row.origin || ''), purpose: String(row.purpose || ''), genres: safeIds(row.genres, CINEFIA_PREFERENCE_GENRES), providers: safeIds(row.providers, CINEFIA_PREFERENCE_PROVIDERS) };
}
function cinefiaPreferenceLabel(list, id) { return list.find(([value]) => value === Number(id))?.[1] || ''; }

async function loadCinefiaPreferences(user = cinefiaAuthUser) {
    if (!user?.id || !cinefiaSupabaseClient) return null;
    if (cinefiaPreferencesRequest?.id === user.id) return cinefiaPreferencesRequest.promise;
    const request = {id: user.id};
    request.promise = (async () => {
        const {data, error} = await cinefiaSupabaseClient.from('cinefia_preferences').select('origin,purpose,genres,providers').eq('user_id', user.id).maybeSingle();
        if (user.id !== cinefiaAuthUser?.id || request !== cinefiaPreferencesRequest) return null;
        if (error) {
            reportCinefiaSecurityEvent('preferences-read');
            return null;
        }
        cinefiaAccountPreferences = normalizeCinefiaPreferences(data || {});
        cinefiaPreferencesLoadedFor = user.id;
        return cinefiaAccountPreferences;
    })().finally(() => { if (request === cinefiaPreferencesRequest) cinefiaPreferencesRequest = null; });
    cinefiaPreferencesRequest = request;
    return request.promise;
}

async function getCinefiaPreferences(user) {
    const preferences = cinefiaPreferencesLoadedFor === user.id ? cinefiaAccountPreferences : await loadCinefiaPreferences(user);
    if (!preferences) throw new Error('Preferências indisponíveis');
    return preferences;
}

async function saveCinefiaPreferences(preferences, feedbackNode) {
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) { if (feedbackNode) feedbackNode.textContent = 'Entre na sua conta para salvar suas preferências.'; return false; }
    const userId = cinefiaAuthUser.id;
    const normalized = normalizeCinefiaPreferences(preferences);
    const { error } = await cinefiaSupabaseClient.from('cinefia_preferences').upsert({ user_id: userId, ...normalized, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (userId !== cinefiaAuthUser?.id) return false;
    if (error) { if (feedbackNode) feedbackNode.textContent = getCinefiaSupabaseTableErrorMessage(error, 'preferências da Experiência Cinéfia'); return false; }
    cinefiaPreferencesRequest = null;
    cinefiaAccountPreferences = normalized;
    cinefiaPreferencesLoadedFor = cinefiaAuthUser.id;
    if (feedbackNode) { feedbackNode.textContent = 'Preferências salvas com sucesso.'; feedbackNode.style.color = '#4ade80'; }
    return true;
}

function preferenceCheckboxes(list, name, selected) {
    return list.map(([id, label]) => `<button type="button" class="cinefia-preference-option" data-preference="${name}" data-value="${id}" aria-pressed="${selected.includes(id)}" onclick="this.setAttribute('aria-pressed', String(this.getAttribute('aria-pressed') !== 'true'))">${escapeCinefiaHtml(label)}</button>`).join('');
}

async function openCinefiaExperienceModal() {
    document.getElementById('settingsModal')?.classList.remove('active');
    const modal = document.getElementById('experienceModal');
    modal?.classList.add('active');
    renderCinefiaExperienceSettings();
    if (cinefiaAuthUser && cinefiaPreferencesLoadedFor !== cinefiaAuthUser.id) {
        await loadCinefiaPreferences(cinefiaAuthUser);
        if (modal?.classList.contains('active')) renderCinefiaExperienceSettings();
    }
}

function renderCinefiaExperienceSettings() {
    const target = document.getElementById('cinefiaExperienceSettings');
    if (!target) return;
    if (!cinefiaAuthUser) {
        target.innerHTML = `<section class="cinefia-experience-settings"><span class="experience-eyebrow">DO SEU JEITO</span><h3><i class="fa-solid fa-wand-magic-sparkles"></i> Experiência Cinéfia</h3><p>Seus gêneros, seus serviços, suas próximas descobertas.</p><div class="experience-account-prompt"><i class="fa-solid fa-user-lock"></i><h4>Uma experiência só sua</h4><p>Entre na sua conta para escolher seus gostos e levar suas preferências com você.</p><button class="save-btn" type="button" onclick="document.getElementById('experienceModal').classList.remove('active');openProfileModal()">Entrar ou cadastrar</button></div></section>`;
        return;
    }
    const prefs = cinefiaAccountPreferences || defaultCinefiaPreferences();
    target.innerHTML = `<section class="cinefia-experience-settings"><span class="experience-eyebrow">DO SEU JEITO</span><h3><i class="fa-solid fa-wand-magic-sparkles"></i> Experiência Cinéfia</h3><p>Escolha o que você gosta. A próxima descoberta começa aqui.</p><div class="cinefia-preference-group"><h4 id="experienceGenresTitle"><i class="fa-solid fa-film"></i> Seus gêneros favoritos</h4><p>Selecione quantos quiser.</p><div class="cinefia-preference-options" role="group" aria-labelledby="experienceGenresTitle">${preferenceCheckboxes(CINEFIA_PREFERENCE_GENRES, 'cinefiaGenre', prefs.genres)}</div></div><div class="cinefia-preference-group"><h4 id="experienceProvidersTitle"><i class="fa-solid fa-play"></i> Onde você assiste</h4><p>Serviços com assinatura · disponibilidade consultada no Brasil.</p><div class="cinefia-preference-options" role="group" aria-labelledby="experienceProvidersTitle">${preferenceCheckboxes(CINEFIA_PREFERENCE_PROVIDERS, 'cinefiaProvider', prefs.providers)}</div></div><div class="experience-footer"><p>Recomendados segue suas escolhas. O Início mistura seus gostos com novas descobertas.</p><button class="save-btn" type="button" onclick="saveCinefiaExperienceSettings()"><i class="fa-solid fa-check"></i> Salvar preferências</button><span id="cinefiaPreferencesFeedback" class="cinefia-auth-message" aria-live="polite"></span></div></section>`;
}

async function saveCinefiaExperienceSettings() {
    const preferences = { ...(cinefiaAccountPreferences || defaultCinefiaPreferences()), genres: [...document.querySelectorAll('[data-preference="cinefiaGenre"][aria-pressed="true"]')].map(node => Number(node.dataset.value)), providers: [...document.querySelectorAll('[data-preference="cinefiaProvider"][aria-pressed="true"]')].map(node => Number(node.dataset.value)) };
    const feedback = document.getElementById('cinefiaPreferencesFeedback');
    if (await saveCinefiaPreferences(preferences, feedback)) { currentPage = 1; if (currentMode === 'home' || currentMode === 'recommendations') fetchContent(); }
}

function renderCinefiaOnboarding() {
    const body = document.getElementById('cinefiaExperienceOnboardingBody');
    if (!body) return;
    body.innerHTML = `<h2 style="font-family:var(--font-title); color:var(--accent); margin-bottom:.4rem;"><i class="fa-solid fa-wand-magic-sparkles"></i> Sua primeira experiência</h2><p style="color:var(--text-muted); line-height:1.5; margin-bottom:1.2rem;">Conte um pouco sobre você para ajudarmos a organizar o Cinéfia. Você poderá alterar isso depois nas configurações.</p><form class="settings-form" onsubmit="saveCinefiaOnboarding(event)"><div class="cinefia-onboarding-options"><div class="settings-field"><label for="cinefiaOrigin">Como você conheceu o Cinéfia?</label><select id="cinefiaOrigin" required><option value="">Selecione uma opção</option>${CINEFIA_ORIGIN_OPTIONS.map(value => `<option value="${escapeCinefiaHtml(value)}">${escapeCinefiaHtml(value)}</option>`).join('')}</select></div><div class="settings-field"><label for="cinefiaPurpose">O que pretende fazer aqui?</label><select id="cinefiaPurpose" required><option value="">Selecione uma opção</option>${CINEFIA_PURPOSE_OPTIONS.map(value => `<option value="${escapeCinefiaHtml(value)}">${escapeCinefiaHtml(value)}</option>`).join('')}</select></div></div><p id="cinefiaOnboardingFeedback" class="cinefia-auth-message" aria-live="polite"></p><button class="save-btn" type="submit"><i class="fa-solid fa-arrow-right"></i> Continuar</button></form>`;
    const existing = cinefiaAuthUser ? (cinefiaAccountPreferences || {}) : (() => { try { return JSON.parse(localStorage.getItem(CINEFIA_GUEST_EXPERIENCE_KEY) || '{}'); } catch (_) { return {}; } })();
    if (existing.origin) document.getElementById('cinefiaOrigin').value = existing.origin;
    if (existing.purpose) document.getElementById('cinefiaPurpose').value = existing.purpose;
}

async function saveCinefiaOnboarding(event) {
    event.preventDefault();
    const origin = document.getElementById('cinefiaOrigin')?.value || '';
    const purpose = document.getElementById('cinefiaPurpose')?.value || '';
    const feedback = document.getElementById('cinefiaOnboardingFeedback');
    if (!origin || !purpose) { if (feedback) feedback.textContent = 'Selecione as duas opções para continuar.'; return; }
    if (cinefiaAuthUser) {
        const ok = await saveCinefiaPreferences({ ...(cinefiaAccountPreferences || defaultCinefiaPreferences()), origin, purpose }, feedback);
        if (!ok) return;
    } else localStorage.setItem(CINEFIA_GUEST_EXPERIENCE_KEY, JSON.stringify({ origin, purpose, completedAt: new Date().toISOString() }));
    closeCinefiaExperienceOnboarding();
}

function closeCinefiaExperienceOnboarding() { document.getElementById('cinefiaExperienceOnboarding')?.classList.remove('active'); }
async function playCinefiaExperienceIntro() {
    const overlay = document.getElementById('cinefiaExperienceIntro');
    if (!overlay) return;
    overlay.classList.add('active'); overlay.setAttribute('aria-hidden', 'false');
    await new Promise(resolve => setTimeout(resolve, 1700));
    overlay.classList.add('leaving');
    await new Promise(resolve => setTimeout(resolve, 550));
    overlay.classList.remove('active', 'leaving'); overlay.setAttribute('aria-hidden', 'true');
}
async function maybeStartCinefiaExperience(user) {
    const introKey = `${CINEFIA_INTRO_SESSION_KEY}_${user?.id || 'guest'}`;
    if (sessionStorage.getItem(introKey) !== '1') { sessionStorage.setItem(introKey, '1'); await playCinefiaExperienceIntro(); }
    if (user) {
        await loadCinefiaPreferences(user);
        if (!cinefiaAccountPreferences?.origin || !cinefiaAccountPreferences?.purpose) { renderCinefiaOnboarding(); document.getElementById('cinefiaExperienceOnboarding')?.classList.add('active'); }
    } else {
        let guest = null; try { guest = JSON.parse(localStorage.getItem(CINEFIA_GUEST_EXPERIENCE_KEY) || 'null'); } catch (_) {}
        if (!guest?.origin || !guest?.purpose) { renderCinefiaOnboarding(); document.getElementById('cinefiaExperienceOnboarding')?.classList.add('active'); }
    }
}

const TV_PREFERENCE_GENRES = new Map([[28, 10759], [12, 10759], [16, 16], [35, 35], [80, 80], [99, 99], [18, 18], [10751, 10751], [14, 10765], [9648, 9648], [878, 10765], [10752, 10768], [37, 37]]);

function preferenceSources(preferences) {
    const sources = [];
    for (const type of ['movie', 'tv']) {
        const genres = type === 'tv' ? preferences.genres.map(id => TV_PREFERENCE_GENRES.get(id)).filter(Boolean) : preferences.genres;
        if (preferences.genres.length && !genres.length) continue;
        const params = new URLSearchParams({api_key: TMDB_API_KEY, language: 'pt-BR', sort_by: 'popularity.desc', include_adult: 'false', 'vote_count.gte': '30'});
        if (genres.length) params.set('with_genres', [...new Set(genres)].join('|'));
        if (preferences.providers.length) {
            params.set('with_watch_providers', preferences.providers.join('|'));
            params.set('watch_region', 'BR');
            params.set('with_watch_monetization_types', 'flatrate');
        }
        sources.push({url: `${BASE_URL}/discover/${type}?${params}`, type});
    }
    return sources;
}

async function fetchPersonalizedHomeMix(request) {
    const [personalized, general] = await Promise.all([
        catalogPage(preferenceSources(cinefiaAccountPreferences), 1, comparePopularity),
        catalogPage([{url: `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR`}], 1)
    ]);
    const mixed = uniqueTitles([...personalized.items.slice(0, 20), ...general.items, ...personalized.items]);
    showCatalogPage({items: mixed.slice(0, TITLES_PER_PAGE), pages: 500}, request);
}

async function initSupabaseAuth() {
    const panel = document.getElementById('supabaseAuthPanel');
    try {
        const client = await window.cinefiaSupabaseReady;
        if (!client) throw new Error('Supabase client unavailable');
        cinefiaSupabaseClient = client;
        const { data, error } = await cinefiaSupabaseClient.auth.getSession();
        if (error) throw error;
        cinefiaAuthUser = data.session?.user || null;
        resolveCinefiaAuth(true);
        renderSupabaseAuthPanel();
        if (cinefiaAuthUser) {
            await ensureCinefiaPrivateProfile(cinefiaAuthUser);
            await ensureCinefiaPublicProfile(cinefiaAuthUser);
            renderSupabaseAuthPanel();
            await loadCinefiaCloudFavorites();
            await maybeStartCinefiaExperience(cinefiaAuthUser);
        } else {
            cinefiaCloudFavorites = [];
            cinefiaCloudFavoritesLoadedFor = null;
            renderSupabaseAuthPanel();
            await maybeStartCinefiaExperience(null);
        }
        if (!cinefiaAuthSubscription) {
            const { data: subscriptionData } = cinefiaSupabaseClient.auth.onAuthStateChange((_event, session) => {
                const nextUser = session?.user || null;
                const previousId = cinefiaAuthUser?.id || null;
                cinefiaAuthUser = nextUser;
                if (previousId !== (nextUser?.id || null)) {
                    cinefiaCloudFavorites = [];
                    cinefiaCloudFavoritesLoadedFor = null;
                    cinefiaPreferencesRequest = null;
                    cinefiaAccountPreferences = null;
                    cinefiaPreferencesLoadedFor = null;
                    if (currentMode === 'recommendations') setTimeout(() => {
                        if (currentMode === 'recommendations') loadRecommendations();
                    }, 0);
                }
                cinefiaAuthMessage = '';
                cinefiaAuthMessageKind = 'info';
                renderSupabaseAuthPanel();
                if (nextUser) {
                    setTimeout(() => {
                        if (nextUser.id !== cinefiaAuthUser?.id) return;
                        void ensureCinefiaPrivateProfile(nextUser);
                        void ensureCinefiaPublicProfile(nextUser);
                        void loadCinefiaCloudFavorites();
                        void maybeStartCinefiaExperience(nextUser);
                    }, 0);
                } else {
                    cinefiaAccountPreferences = null;
                    cinefiaPreferencesLoadedFor = null;
                    updateMyListCount();
                    renderCurrentListState();
                }
            });
            cinefiaAuthSubscription = subscriptionData?.subscription || null;
        }
    } catch (error) {
        resolveCinefiaAuth(false);
        reportCinefiaSecurityEvent('auth-start');
        cinefiaAuthMessage = 'Não foi possível conectar ao Supabase. Confira a URL, a chave pública e sua conexão.';
        cinefiaAuthMessageKind = 'error';
        renderSupabaseAuthPanel();
        if (panel) panel.dataset.connection = 'error';
    }
}

function submitCinefiaAuthForm(event) {
    return cinefiaAuthMode === 'signup' ? handleCinefiaSignup(event) : handleCinefiaLogin(event);
}

async function handleCinefiaLogin(event) {
    event.preventDefault();
    if (!cinefiaSupabaseClient || cinefiaAuthBusy) return;
    const email = document.getElementById('cinefiaAuthEmail')?.value.trim() || '';
    const password = document.getElementById('cinefiaAuthPassword')?.value || '';
    if (!email || !password) return setCinefiaAuthMessage('Preencha o e-mail e a senha.', 'error');
    setCinefiaAuthBusy(true);
    setCinefiaAuthMessage('Verificando suas credenciais...', 'info');
    try {
        const { data, error } = await cinefiaSupabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        cinefiaAuthUser = data.user || data.session?.user || null;
        cinefiaAuthBusy = false;
        cinefiaAuthMessage = 'Login realizado com sucesso.';
        cinefiaAuthMessageKind = 'success';
        if (cinefiaAuthUser) {
            await ensureCinefiaPrivateProfile(cinefiaAuthUser);
            await ensureCinefiaPublicProfile(cinefiaAuthUser);
            await loadCinefiaCloudFavorites();
        }
        renderSupabaseAuthPanel();
    } catch (error) {
        cinefiaAuthBusy = false;
        if (error?.status === 429 || error?.code === 'over_request_rate_limit') reportCinefiaSecurityEvent('auth-rate-limit');
        setCinefiaAuthMessage(normalizeCinefiaAuthError(error, 'login'), 'error');
        setCinefiaAuthBusy(false);
    }
}

async function handleCinefiaSignup(event) {
    event.preventDefault();
    if (!cinefiaSupabaseClient || cinefiaAuthBusy) return;
    const email = document.getElementById('cinefiaAuthEmail')?.value.trim() || '';
    const username = document.getElementById('cinefiaAuthUsername')?.value.trim().toLowerCase() || '';
    const password = document.getElementById('cinefiaAuthPassword')?.value || '';
    const confirmPassword = document.getElementById('cinefiaAuthConfirmPassword')?.value || '';
    if (!email || !username || !password || !confirmPassword) return setCinefiaAuthMessage('Preencha todos os campos.', 'error');
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return setCinefiaAuthMessage('O nome de usuário deve ter de 3 a 20 caracteres: apenas letras minúsculas, números e _.', 'error');
    if (password.length < 10) return setCinefiaAuthMessage('Use uma senha com pelo menos 10 caracteres.', 'error');
    if (password !== confirmPassword) return setCinefiaAuthMessage('As senhas não são iguais. Confira e tente novamente.', 'error');
    setCinefiaAuthBusy(true);
    setCinefiaAuthMessage('Criando sua conta...', 'info');
    try {
        const { data: existingProfiles, error: usernameCheckError } = await cinefiaSupabaseClient
            .from('profiles')
            .select('username')
            .ilike('username', username.replace(/_/g, '\\_'))
            .limit(1);
        if (usernameCheckError) throw usernameCheckError;
        const usernameTaken = (existingProfiles || []).some(profile =>
            String(profile.username || '').trim().toLowerCase() === username
        );
        if (usernameTaken) {
            cinefiaAuthBusy = false;
            renderSupabaseAuthPanel();
            setCinefiaAuthMessage('Esse nome de usuário já está em uso. Escolha outro.', 'error');
            return;
        }
        const { data, error } = await cinefiaSupabaseClient.auth.signUp({
            email,
            password,
            options: { data: { user_name: username, username } }
        });
        if (error) throw error;
        cinefiaAuthBusy = false;
        if (data.session?.user) {
            cinefiaAuthUser = data.session?.user || data.user;
            cinefiaAuthMode = 'login';
            cinefiaAuthMessage = 'Conta criada com sucesso. Bem-vindo ao Cinéfia!';
            cinefiaAuthMessageKind = 'success';
            if (cinefiaAuthUser) {
                await ensureCinefiaPrivateProfile(cinefiaAuthUser);
                await ensureCinefiaPublicProfile(cinefiaAuthUser);
                await loadCinefiaCloudFavorites();
            }
            renderSupabaseAuthPanel();
        } else {
            cinefiaAuthMode = 'login';
            cinefiaAuthMessage = 'Não foi possível iniciar sua sessão após o cadastro. Tente entrar com seu e-mail e senha. Se o acesso continuar indisponível, entre em contato com o suporte do Cinéfia.';
            cinefiaAuthMessageKind = 'error';
            renderSupabaseAuthPanel();
        }
    } catch (error) {
        cinefiaAuthBusy = false;
        renderSupabaseAuthPanel();
        if (error?.status === 429 || error?.code === 'over_request_rate_limit') reportCinefiaSecurityEvent('auth-rate-limit');
        setCinefiaAuthMessage(normalizeCinefiaAuthError(error, 'signup'), 'error');
    }
}

async function requestCinefiaPasswordReset() {
    if (!cinefiaSupabaseClient || cinefiaAuthBusy) return;
    const email = document.getElementById('cinefiaAuthEmail')?.value.trim() || '';
    if (!email) return setCinefiaAuthMessage('Digite seu e-mail no campo acima para solicitar a recuperação.', 'error');
    cinefiaAuthBusy = true;
    setCinefiaAuthMessage('Solicitando recuperação de senha...', 'info');
    const submitButton = document.getElementById('cinefiaAuthSubmit');
    if (submitButton) submitButton.disabled = true;
    try {
        // O redirecionamento usa a URL de Site URL configurada no painel Supabase.
        const { error } = await cinefiaSupabaseClient.auth.resetPasswordForEmail(email, { redirectTo: CINEFIA_SITE_URL });
        if (error) throw error;
        cinefiaAuthMessage = 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.';
        cinefiaAuthMessageKind = 'success';
        cinefiaAuthBusy = false;
        renderSupabaseAuthPanel();
    } catch (error) {
        cinefiaAuthBusy = false;
        renderSupabaseAuthPanel();
        setCinefiaAuthMessage(normalizeCinefiaAuthError(error, 'reset'), 'error');
    }
}

async function handleCinefiaPasswordUpdate(event) {
    event.preventDefault();
    if (!cinefiaSupabaseClient || cinefiaAuthBusy) return;
    const password = document.getElementById('cinefiaNewPassword')?.value || '';
    const confirmation = document.getElementById('cinefiaConfirmNewPassword')?.value || '';
    if (password.length < 10) return setCinefiaAuthMessage('Use uma senha com pelo menos 10 caracteres.', 'error');
    if (password !== confirmation) return setCinefiaAuthMessage('As senhas não são iguais.', 'error');
    cinefiaAuthBusy = true;
    const button = document.getElementById('cinefiaAuthSubmit');
    if (button) button.disabled = true;
    setCinefiaAuthMessage('Atualizando sua senha...', 'info');
    try {
        const { error } = await cinefiaSupabaseClient.auth.updateUser({ password });
        if (error) throw error;
        cinefiaPasswordRecoveryMode = false;
        try { window.history.replaceState({}, document.title, window.location.pathname + window.location.search); } catch (_) {}
        cinefiaAuthBusy = false;
        cinefiaAuthMessage = 'Senha atualizada com sucesso.';
        cinefiaAuthMessageKind = 'success';
        renderSupabaseAuthPanel();
    } catch (error) {
        cinefiaAuthBusy = false;
        renderSupabaseAuthPanel();
        setCinefiaAuthMessage(normalizeCinefiaAuthError(error, 'update'), 'error');
    }
}

async function signOutCinefia() {
    if (!cinefiaSupabaseClient || cinefiaAuthBusy) return;
    cinefiaAuthBusy = true;
    renderSupabaseAuthPanel();
    try {
        const { error } = await cinefiaSupabaseClient.auth.signOut();
        if (error) throw error;
        cinefiaAuthUser = null;
        cinefiaCloudFavorites = [];
        cinefiaCloudFavoritesLoadedFor = null;
        cinefiaCloudSyncMessage = 'Você saiu da conta; os favoritos exibidos agora são desta sessão de visitante.';
        cinefiaCloudSyncKind = 'info';
        cinefiaAuthMode = 'login';
        cinefiaAuthBusy = false;
        cinefiaAuthMessage = 'Você saiu da sua conta com segurança.';
        cinefiaAuthMessageKind = 'success';
        renderSupabaseAuthPanel();
    } catch (error) {
        cinefiaAuthBusy = false;
        renderSupabaseAuthPanel();
        setCinefiaAuthMessage('Não foi possível encerrar a sessão. Tente novamente.', 'error');
        console.error('Falha ao sair da conta Cinéfia:', error);
    }
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    renderSupabaseAuthPanel();
    modal.classList.add('active');
}

/* ======================================================================
   FAVORITOS DE VISITANTE — sem identidade de perfil local
   ====================================================================== */
const GUEST_FAVORITES_STORAGE_KEY = 'cinefia_guest_favorites_v1';

function getFavoriteItems() {
    try {
        const current = JSON.parse(localStorage.getItem(GUEST_FAVORITES_STORAGE_KEY) || 'null');
        if (Array.isArray(current)) return current;

        // Migra somente a lista de favoritos dos perfis antigos; não recria os perfis.
        const oldProfiles = JSON.parse(localStorage.getItem('cinefia_local_profiles_v1') || '[]');
        const migrated = Array.isArray(oldProfiles)
            ? oldProfiles.flatMap(profile => Array.isArray(profile?.favorites) ? profile.favorites : [])
            : [];
        const unique = migrated.filter((item, index, list) =>
            list.findIndex(other => Number(other?.id) === Number(item?.id) && other?.type === item?.type) === index
        ).slice(0, 50);
        localStorage.setItem(GUEST_FAVORITES_STORAGE_KEY, JSON.stringify(unique));
        return unique;
    } catch (error) {
        console.warn('Não foi possível carregar favoritos de visitante.', error);
        return [];
    }
}

function saveFavoriteItems(favorites) {
    localStorage.setItem(GUEST_FAVORITES_STORAGE_KEY, JSON.stringify(Array.isArray(favorites) ? favorites.slice(0, 50) : []));
}

