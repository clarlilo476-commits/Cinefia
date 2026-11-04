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
            window.addEventListener('resize', refreshSynopsisControl);
            document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.matchMedia('(max-width: 700px)').matches && document.body.classList.contains('mobile-nav-open')) {
                        toggleMobileNavigation();
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
                    if (item.backdrop_path && item.poster_path && !seen.has(key)) {
                        seen.add(key);
                        merged.push({ ...item, media_type: type });
                    }
                });

                heroSlides = merged.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 31);

                const container = document.getElementById('heroCarouselContainer');
                if(heroSlides.length === 0) return;

                let slidesHTML = '';
                heroSlides.forEach((item, index) => {
                    const title = item.title || item.name;
                    const overview = item.overview || 'Explore os detalhes desta obra incrível no catálogo.';
                    const backdrop = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
                    const poster = `${IMG_BASE_URL}${item.poster_path}`;
                    const type = item.media_type === 'tv' ? 'tv' : 'movie';
                    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

                    slidesHTML += `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}">
                            <div class="hero-bg" style="background-image: url('${backdrop}')"></div>
                            <div class="hero-content-wrapper">
                                <img src="${poster}" class="hero-poster" alt="${title}" onclick="openDetails(${item.id}, '${type}')" />
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
            return arr.sort(() => Math.random() - 0.5);
        }

        async function fetchHomeBestReleases() {
            const currentYear = new Date().getFullYear();
            const samplePages = cinefiaShuffle([1,2,3,4,5,6,7,8]).slice(0, 3);
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
            const pageItems = cinefiaShuffle(candidates).slice(0, 20);
            renderGrid(pageItems.length ? pageItems : candidates.slice(0, 20));
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        async function fetchHomeTopRated() {
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
            const pageItems = cinefiaShuffle(candidates).slice(0, 20);
            renderGrid(pageItems.length ? pageItems : candidates.slice(0, 20));
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        async function fetchHomeMoviesOnly() {
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
            const pageItems = cinefiaShuffle(candidates).slice(0, 20);
            renderGrid(pageItems.length ? pageItems : candidates.slice(0, 20));
            history.push(pageItems.map(item => `${item.media_type}-${item.id}`));
            sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
            totalPages = 500;
            updatePagination();
        }

        async function fetchContent() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            if (!TMDB_API_KEY) return;

            grid.innerHTML = '<div class="message-box"><div class="spinner"></div><p style="margin-top:15px;">A carregar dados...</p></div>';
            pagination.style.display = 'none';

            let url = '';

            if (currentMode === 'home') {
                if (currentPage === 1 && cinefiaAuthUser && cinefiaAccountPreferences && (cinefiaAccountPreferences.genres.length || cinefiaAccountPreferences.providers.length)) {
                    document.getElementById('sectionTitle').innerText = 'Em destaque para você';
                    await fetchPersonalizedHomeMix();
                    return;
                }
                // Faixas de página da Home: 1–5 melhores lançamentos do ano, 5–10 melhores avaliados, 10–15 somente filmes.
                try {
                    if (currentPage <= 5) {
                        document.getElementById('sectionTitle').innerText = `Melhores Lançamentos de ${new Date().getFullYear()}`;
                        await fetchHomeBestReleases();
                        return;
                    } else if (currentPage <= 10) {
                        document.getElementById('sectionTitle').innerText = 'Melhores Avaliados';
                        await fetchHomeTopRated();
                        return;
                    } else if (currentPage <= 15) {
                        document.getElementById('sectionTitle').innerText = 'Filmes Selecionados';
                        await fetchHomeMoviesOnly();
                        return;
                    }
                } catch (e) { console.warn('Falha ao montar a Home por faixa de página; usando descoberta aleatória.', e); }
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
                    if (candidates.length < 12) {
                        const extra = await fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=${Math.floor(Math.random()*20)+1}`).then(r => r.json());
                        candidates = candidates.concat((extra.results || []).filter(item => item.poster_path && !recentIds.has(`${item.media_type || (item.title?'movie':'tv')}-${item.id}`)).map(item => ({...item, media_type:item.media_type || (item.title?'movie':'tv')})));
                    }
                    const pageItems = candidates.slice(0,20);
                    renderGrid(pageItems);
                    history.push(pageItems.map(item => `${item.media_type || 'movie'}-${item.id}`));
                    sessionStorage.setItem('cinefia_home_page_history', JSON.stringify(history.slice(-5)));
                    totalPages = 500;
                    updatePagination();
                    return;
                } catch(e) { console.warn('Falha na aleatorização da Home.', e); }
                url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&page=${currentPage}`;
            } else if (currentMode === 'trending') {
                url = `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=${currentPage}`;
            } else if (currentMode === 'search') {
                await fetchSmartTextSearch();
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
                await fetchGenreSearch();
                return;
            } else if (currentMode === 'mylist') {
                await fetchMyList();
                return;
            } else if (currentMode === 'recommendations') {
                await fetchRecommendations();
                return;
            } else if (currentMode === 'filters') {
                await fetchFilteredContent();
                return;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    totalPages = data.total_pages;
                    renderGrid(data.results);
                    updatePagination();
                } else {
                    grid.innerHTML = '<div class="message-box">Nenhum resultado encontrado.</div>';
                }
            } catch (error) {
                showError("Erro de conexão. Verifique sua API Key.");
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

        async function fetchMyList() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            pagination.style.display = 'none';
            const favorites = getCurrentFavoriteItems();
            if (!favorites.length) {
                grid.innerHTML = '<div class="message-box"><i class="fa-regular fa-heart" style="font-size:2rem;color:var(--accent);margin-bottom:12px;"></i><br>Sua Minha Lista está vazia.<br><span style="font-size:0.9rem;">Adicione filmes e séries usando o coração.</span></div>';
                return;
            }
            try {
                const results = await Promise.all(favorites.slice(0, 30).map(async item => {
                    const response = await fetch(`${BASE_URL}/${item.type}/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const data = await response.json();
                    return { ...data, media_type: item.type };
                }));
                renderGrid(results.filter(item => item && item.id));
            } catch (error) {
                showError('Não foi possível carregar sua Minha Lista.');
            }
        }

        // --- RECOMENDAÇÕES ---
        async function fetchRecommendations() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            pagination.style.display = 'none';
            if (!cinefiaAuthUser) {
                grid.innerHTML = '<div class="message-box"><i class="fa-solid fa-lock" style="color:var(--accent);font-size:2rem;margin-bottom:12px;"></i><br>Recomendados é uma função exclusiva das contas Cinéfia.<br><span style="font-size:.9rem;">Entre ou cadastre-se para configurar seus gostos.</span><br><button class="feature-btn" style="margin-top:14px;" onclick="openProfileModal()"><i class="fa-solid fa-right-to-bracket"></i> Entrar ou cadastrar</button></div>';
                return;
            }
            const favorites = getCurrentFavoriteItems();
            try {
                if (cinefiaAuthUser && cinefiaAccountPreferences && (cinefiaAccountPreferences.genres.length || cinefiaAccountPreferences.providers.length)) {
                    const personalized = await fetchPreferenceDiscoverResults(24);
                    if (personalized.length) {
                        renderGrid(personalized);
                        return;
                    }
                }
                let pool = [];
                const seeds = favorites.slice(0, 5);
                if (seeds.length) {
                    const responses = await Promise.all(seeds.map(item => fetch(`${BASE_URL}/${item.type}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json()).catch(() => ({results:[]}))));
                    responses.forEach(data => { pool.push(...(data.results || [])); });
                } else {
                    const trending = await fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json());
                    pool = trending.results || [];
                }
                const seen = new Set(favorites.map(item => `${item.type}-${item.id}`));
                const unique = [];
                pool.forEach(item => {
                    const type = item.media_type || (item.title ? 'movie' : 'tv');
                    const key = `${type}-${item.id}`;
                    if (!seen.has(key) && !unique.some(x => `${x.media_type}-${x.id}` === key) && (item.poster_path || item.backdrop_path)) {
                        unique.push({ ...item, media_type: type });
                    }
                });
                const sorted = unique.sort((a,b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 24);
                if (!sorted.length) {
                    grid.innerHTML = '<div class="message-box">Ainda não há recomendações suficientes.</div>';
                    return;
                }
                renderGrid(sorted);
            } catch (error) {
                showError('Não foi possível gerar recomendações agora.');
            }
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

        async function fetchFilteredContent() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
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
                const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', region: 'BR', page: String(currentPage), sort_by: sort });
                if (movieGenre) params.set('with_genres', movieGenre);
                if (fromYear) params.set('primary_release_date.gte', `${fromYear}-01-01`);
                if (toYear) params.set('primary_release_date.lte', `${toYear}-12-31`);
                if (rating) params.set('vote_average.gte', rating);
                if (language) params.set('with_original_language', language);
                if (votes) params.set('vote_count.gte', votes);
                return fetch(`${BASE_URL}/discover/movie?${params}`).then(r => r.json());
            };
            const buildTv = () => {
                let tvSort = sort === 'primary_release_date.desc' ? 'first_air_date.desc' : sort;
                const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', page: String(currentPage), sort_by: tvSort });
                if (tvGenre) params.set('with_genres', tvGenre);
                if (fromYear) params.set('first_air_date.gte', `${fromYear}-01-01`);
                if (toYear) params.set('first_air_date.lte', `${toYear}-12-31`);
                if (rating) params.set('vote_average.gte', rating);
                if (language) params.set('with_original_language', language);
                if (votes) params.set('vote_count.gte', votes);
                return fetch(`${BASE_URL}/discover/tv?${params}`).then(r => r.json());
            };

            if (type === 'movie') requests.push(buildMovie());
            else if (type === 'tv') requests.push(buildTv());
            else { requests.push(buildMovie()); requests.push(buildTv()); }

            try {
                const datasets = await Promise.all(requests);
                const results = [];
                let maxPages = 1;
                datasets.forEach((data, idx) => {
                    maxPages = Math.max(maxPages, data.total_pages || 1);
                    (data.results || []).forEach(item => results.push({ ...item, media_type: idx === 0 && type !== 'all' ? type : (idx === 0 ? 'movie' : 'tv') }));
                });
                results.sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
                totalPages = Math.min(maxPages, 500);
                renderGrid(results);
                updatePagination();
            } catch (error) {
                showError('Não foi possível aplicar os filtros.');
            }
        }

        // --- PESQUISA INTELIGENTE POR GÊNERO (RESULTADO) ---
        async function fetchGenreSearch() {
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
                    const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', region: 'BR', sort_by: 'vote_average.desc', 'vote_count.gte': '100', page: String(currentPage) });
                    if (keywordId) params.set('with_keywords', String(keywordId));
                    else if (config.movieGenre) params.set('with_genres', String(config.movieGenre));
                    if (config.originLanguage) params.set('with_original_language', config.originLanguage);
                    requests.push(fetch(`${BASE_URL}/discover/movie?${params}`).then(r => r.json()).then(d => ({ d, type: 'movie' })));
                }
                if (config.tvGenre || keywordId) {
                    const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'pt-BR', sort_by: 'vote_average.desc', 'vote_count.gte': '30', page: String(currentPage) });
                    if (keywordId) params.set('with_keywords', String(keywordId));
                    else if (config.tvGenre) params.set('with_genres', String(config.tvGenre));
                    if (config.originLanguage) params.set('with_original_language', config.originLanguage);
                    requests.push(fetch(`${BASE_URL}/discover/tv?${params}`).then(r => r.json()).then(d => ({ d, type: 'tv' })));
                }
                const datasets = await Promise.all(requests);
                let merged = [];
                let maxPages = 1;
                datasets.forEach(({ d, type }) => {
                    maxPages = Math.max(maxPages, d.total_pages || 1);
                    (d.results || []).forEach(item => { if (item.poster_path) merged.push({ ...item, media_type: type }); });
                });
                merged.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
                if (!merged.length) {
                    grid.innerHTML = `<div class="message-box">Nenhum resultado encontrado para "${config.label}".</div>`;
                    pagination.style.display = 'none';
                    return;
                }
                renderGrid(merged);
                totalPages = Math.min(maxPages, 500);
                updatePagination();
            } catch (error) {
                showError(`Não foi possível buscar por "${config.label}" agora.`);
            }
        }

        // --- PESQUISA POR TEXTO, COM DETECÇÃO DE ATOR/ATRIZ ---
        // Se o termo buscado corresponder ao nome de uma pessoa no TMDB, mostra os filmes/séries
        // em que ela está no Elenco. Caso contrário, cai na busca normal por título.
        async function fetchSmartTextSearch() {
            const grid = document.getElementById('resultsGrid');
            const pagination = document.getElementById('paginationContainer');
            const query = currentSearchQuery;
            try {
                const personRes = await fetch(`${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`);
                const personData = await personRes.json();
                const topPerson = (personData.results || [])[0];
                const normalizedQuery = normalizeSearchTerm(query);

                if (topPerson && normalizeSearchTerm(topPerson.name) === normalizedQuery) {
                    const creditsRes = await fetch(`${BASE_URL}/person/${topPerson.id}/combined_credits?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const creditsData = await creditsRes.json();
                    const seen = new Set();
                    const castItems = (creditsData.cast || []).filter(item => {
                        if (!item.poster_path || (item.media_type !== 'movie' && item.media_type !== 'tv')) return false;
                        const key = `${item.media_type}-${item.id}`;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    }).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

                    if (castItems.length) {
                        document.getElementById('sectionTitle').innerText = `Elenco: ${topPerson.name}`;
                        const perPage = 20;
                        totalPages = Math.max(1, Math.ceil(castItems.length / perPage));
                        const pageItems = castItems.slice((currentPage - 1) * perPage, currentPage * perPage);
                        renderGrid(pageItems);
                        updatePagination();
                        return;
                    }
                }
            } catch (error) {
                console.warn('Falha na pesquisa por ator/atriz; usando busca padrão.', error);
            }

            // Busca padrão por título (comportamento original) quando não é reconhecido como ator/atriz.
            try {
                const response = await fetch(`${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${currentPage}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    totalPages = data.total_pages;
                    renderGrid(data.results);
                    updatePagination();
                } else {
                    grid.innerHTML = '<div class="message-box">Nenhum resultado encontrado.</div>';
                }
            } catch (error) {
                showError('Erro de conexão. Verifique sua API Key.');
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
                .filter(video => video.site === 'YouTube' && video.key && ['Trailer', 'Teaser'].includes(video.type))
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
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            wrap.appendChild(iframe);

            trailerPlayer = new YT.Player(iframe, {
                events: {
                    onError: event => handleTrailerPlayerError(event, requestId)
                }
            });
        }

        async function openTrailer(movieId, title = '') {
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
                const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR&include_video_language=pt-BR,en-US,null`);
                if (!response.ok) throw new Error('Não foi possível consultar os trailers no TMDB.');
                const data = await response.json();
                if (requestId !== trailerOpenRequestId) return;

                trailerCandidates = getTrailerCandidates(data.results || []);
                if (!trailerCandidates.length) {
                    wrap.innerHTML = '<div class="trailer-message">Este filme não possui um trailer disponível no TMDB.</div>';
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
        async function surpriseMe() {
            try {
                const data = await fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json());
                const choices = (data.results || []).filter(item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv'));
                if (!choices.length) return;
                const pick = choices[Math.floor(Math.random() * choices.length)];
                openDetails(pick.id, pick.media_type);
            } catch (error) {
                showError('Não foi possível escolher uma recomendação agora.');
            }
        }

        function renderGrid(items) {
            const grid = document.getElementById('resultsGrid');
            grid.innerHTML = '';

            items.forEach(item => {
                if (!item.poster_path && !item.profile_path) return;

                const title = item.title || item.name;
                const date = item.release_date || item.first_air_date || '';
                const year = date ? date.split('-')[0] : 'N/A';
                const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
                const imagePath = item.poster_path || item.profile_path;
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

                const card = document.createElement('div');
                card.className = 'card';
                card.onclick = () => openDetails(item.id, mediaType);

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <button class="favorite-btn ${isFavorite(item.id, mediaType) ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id}, '${mediaType}');"><i class="fa-${isFavorite(item.id, mediaType) ? 'solid' : 'regular'} fa-heart"></i></button>
                        <img src="${IMG_BASE_URL}${imagePath}" alt="${title}" class="card-img" loading="lazy">
                        ${rating !== 'NR' ? `<div class="rating-badge"><i class="fa-solid fa-star"></i> ${rating}</div>` : ''}
                    </div>
                    <div class="card-info">
                        <h3 class="card-title">${title}</h3>
                        <div class="card-meta">${year} • ${mediaType === 'tv' ? 'Série' : 'Filme'} • <span class="cinefia-score"> CFS ${calculateCinefiaScore(item)}</span></div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        /* --- DETALHES + INTEGRAÇÃO TMDB & OMDB + ONDE ASSISTIR --- */
        async function openDetails(id, type) {
            if (type === 'person') return;

            const modal = document.getElementById('detailsModal');
            const content = document.getElementById('modalContent');
            content.innerHTML = '<div style="padding: 4rem; width: 100%; text-align: center;"><div class="spinner"></div></div>';
            modal.classList.add('active');

            try {
                const detailsUrl = `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=release_dates,content_ratings,watch/providers,external_ids,credits,videos&include_video_language=pt-BR,en-US,null`;
                const res = await fetch(detailsUrl);
                const data = await res.json();

                let omdbData = null;
                const imdbId = data.imdb_id || data.external_ids?.imdb_id;
                if (imdbId && OMDB_API_KEY) {
                    try {
                        const omdbRes = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}`);
                        omdbData = await omdbRes.json();
                    } catch(e) { console.error("Erro ao buscar dados do OMDb:", e); }
                }

                renderModal(data, type, omdbData);
            } catch (error) {
                content.innerHTML = '<div style="padding: 2rem; color: white;">Erro ao carregar detalhes.</div>';
            }
        }

        function renderModal(data, type, omdbData = null) {
            const content = document.getElementById('modalContent');
            const title = data.title || data.name;
            const overview = data.overview || 'Sinopse não disponível em português.';
            const poster = data.poster_path ? `${IMG_BASE_URL}${data.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

            const releaseDate = data.release_date || data.first_air_date || 'N/A';
            const year = releaseDate !== 'N/A' ? releaseDate.split('-')[0] : 'N/A';

            const duration = data.runtime ? `${data.runtime} min` : (data.episode_run_time && data.episode_run_time[0] ? `${data.episode_run_time[0]} min` : 'N/A');
            const status = data.status || 'N/A';

            let ageRating = 'Livre';
            let ageColor = '#4ade80';

            if (type === 'movie' && data.release_dates && data.release_dates.results) {
                const brRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'BR');
                if (brRelease && brRelease.release_dates[0]?.certification) ageRating = brRelease.release_dates[0].certification;
            } else if (type === 'tv' && data.content_ratings && data.content_ratings.results) {
                const brRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'BR');
                if (brRating) ageRating = brRating.rating;
            }

            if(ageRating === '18') ageColor = '#ef4444';
            else if(ageRating === '16') ageColor = '#f97316';
            else if(ageRating === '14' || ageRating === '12') ageColor = '#eab308';
            else if(ageRating === '10') ageColor = '#3b82f6';

            const genres = data.genres ? data.genres.map(g => `<span class="tag">${g.name}</span>`).join('') : '';

            let scoresHtml = `
                <div class="score-badge">
                    <i class="fa-solid fa-star" style="color: #f5c518"></i> TMDB: ${data.vote_average ? data.vote_average.toFixed(1) : 'N/A'}
                </div>
                <div class="score-badge">
                    <i class="fa-solid fa-clapperboard" style="color:var(--accent)"></i> Cinéfia Score: <span class="cinefia-score">${calculateCinefiaScore(data)}/100</span>
                </div>
            `;

            if (omdbData && omdbData.Response !== "False") {
                if (omdbData.imdbRating && omdbData.imdbRating !== 'N/A') {
                    scoresHtml += `
                        <div class="score-badge">
                            <i class="fa-brands fa-imdb" style="color: #f5c518"></i> IMDb: ${omdbData.imdbRating}
                        </div>
                    `;
                }
                if (omdbData.Ratings) {
                    const rt = omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes');
                    if (rt) {
                        scoresHtml += `
                            <div class="score-badge">
                                <i class="fa-solid fa-apple-whole" style="color: #fa320a"></i> Rotten: ${rt.Value}
                            </div>
                        `;
                    }
                }
            }

            let providersHtml = '';
            const watchProviders = data['watch/providers']?.results?.BR;
            if (watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy)) {
                const list = watchProviders.flatrate || watchProviders.rent || watchProviders.buy;
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
                const logosHtml = list.map(p => {
                    const href = providerLoginUrl(p.provider_name);
                    const logo = `<img src="${IMG_BASE_URL}${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name}${href ? ' — abrir serviço' : ' — URL de acesso não configurada'}" class="provider-logo">`;
                    return href ? `<a class="provider-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${p.provider_name}">${logo}</a>` : `<span class="provider-link provider-link-unmapped" title="URL de acesso não configurada para ${p.provider_name}">${logo}<small>URL pendente</small></span>`;
                }).join('');
                if (unmatchedProviders.length) console.warn('[Cinéfia] URLs de acesso pendentes para provedores:', [...new Set(unmatchedProviders)]);
                providersHtml = `
                    <div class="streaming-providers">
                        <span class="streaming-title">Disponível em:</span>
                        <div class="provider-logos">${logosHtml}</div>
                    </div>
                `;
            }

            // Informações adicionais de filmes: orçamento, receita, diretor e escritores.
            let advancedHtml = '';
            if (type === 'movie') {
                const director = (data.credits?.crew || []).filter(p => p.job === 'Director').map(p => p.name).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'Não informado';
                const writers = (data.credits?.crew || []).filter(p => ['Writer', 'Screenplay', 'Story'].includes(p.job)).map(p => p.name).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'Não informado';
                const budget = data.budget ? `US$ ${Number(data.budget).toLocaleString('en-US')}` : 'Não informado';
                const revenue = data.revenue ? `US$ ${Number(data.revenue).toLocaleString('en-US')}` : 'Não informado';
                const isFav = isFavorite(data.id, 'movie');
                const score = calculateCinefiaScore(data);
                const trailerExists = findBestTrailer(data.videos?.results || []) !== null;
                const castPeople = (data.credits?.cast || []).filter(p => p.profile_path).slice(0, 12);
                advancedHtml = `
                    <details class="expandable-details">
                        <summary>Mais informações do filme</summary>
                        <div class="expandable-body">
                            <div class="feature-actions">
                                <button class="feature-btn ${trailerExists ? '' : 'disabled'}" ${trailerExists ? `onclick="openTrailer(${data.id})"` : 'disabled'}><i class="fa-solid fa-play"></i> ${trailerExists ? 'Assistir trailer' : 'Trailer indisponível'}</button>
                                <button class="favorite-detail-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${data.id}, 'movie')"><i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i> ${isFav ? 'Na Minha Lista' : 'Minha Lista'}</button>
                            </div>
                            <div class="crew-grid">
                                <div class="crew-item"><span>Diretor</span><strong>${director}</strong></div>
                                <div class="crew-item"><span>Escritor(es)</span><strong>${writers}</strong></div>
                                <div class="crew-item"><span>Orçamento</span><strong>${budget}</strong></div>
                                <div class="crew-item"><span>Receita</span><strong>${revenue}</strong></div>
                            </div>
                            <div class="crew-item"><span>Cinéfia Score</span><strong class="cinefia-score">${score}/100</strong></div>
                        </div>
                    </details>
                `;
                if (castPeople.length) {
                    advancedHtml += `
                        <details class="expandable-details">
                            <summary>Elenco</summary>
                            <div class="expandable-body">
                                <div class="cast-grid">
                                    ${castPeople.map(p => `<div class="cast-card"><img class="cast-img" src="https://image.tmdb.org/t/p/w185${p.profile_path}" alt="${p.name}" loading="lazy"><div><div class="cast-name">${p.name}</div><div class="cast-character">${p.character || 'Personagem não informado'}</div></div></div>`).join('')}
                                </div>
                            </div>
                        </details>
                    `;
                }
            } else {
                const creators = data.created_by?.map(p => p.name).join(', ') || 'Não informado';
                const isFav = isFavorite(data.id, 'tv');
                const score = calculateCinefiaScore(data);
                advancedHtml = `
                    <details class="expandable-details" id="episodesDetails" ontoggle="handleEpisodesToggle(${data.id}, this)">
                        <summary>Episódios e avaliações</summary>
                        <div class="expandable-body">
                            <div class="feature-actions">
                                <button class="favorite-detail-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${data.id}, 'tv')"><i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i> ${isFav ? 'Na Minha Lista' : 'Minha Lista'}</button>
                            </div>
                            <div class="crew-grid">
                                <div class="crew-item"><span>Criador(es)</span><strong>${creators}</strong></div>
                                <div class="crew-item"><span>Temporadas</span><strong>${data.number_of_seasons ?? 'N/A'}</strong></div>
                                <div class="crew-item"><span>Episódios</span><strong>${data.number_of_episodes ?? 'N/A'}</strong></div>
                                <div class="crew-item"><span>Status</span><strong>${status}</strong></div>
                            </div>
                            <div class="crew-item"><span>Cinéfia Score</span><strong class="cinefia-score">${score}/100</strong></div>
                            <div class="episodes-toolbar">
                                <div>
                                    <span class="episode-select-label">Temporada</span>
                                    <select class="season-select" id="seasonSelect_${data.id}" onchange="loadSeasonEpisodes(${data.id}, this.value)">
                                        ${(data.seasons || []).map(s => `<option value="${s.season_number}">${s.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="episode-grid" id="episodeGrid_${data.id}"><div class="episode-loading"><div class="spinner"></div><p style="margin-top:10px;">Selecione uma temporada para ver os episódios.</p></div></div>
                        </div>
                    </details>
                `;
                const castPeople = (data.credits?.cast || []).filter(p => p.profile_path).slice(0, 12);
                if (castPeople.length) {
                    advancedHtml += `
                        <details class="expandable-details">
                            <summary>Elenco</summary>
                            <div class="expandable-body">
                                <div class="cast-grid">
                                    ${castPeople.map(p => `<div class="cast-card"><img class="cast-img" src="https://image.tmdb.org/t/p/w185${p.profile_path}" alt="${p.name}" loading="lazy"><div><div class="cast-name">${p.name}</div><div class="cast-character">${p.character || 'Personagem não informado'}</div></div></div>`).join('')}
                                </div>
                            </div>
                        </details>
                    `;
                }
            }

            // Comentários e avaliações compartilhados pelo Supabase (o conteúdo é carregado ao abrir o painel).
            advancedHtml += `
                <details class="expandable-details cinefia-comments-details" ontoggle="if (this.open) loadCinefiaComments(${Number(data.id)}, '${type}')">
                    <summary>Comentários e avaliações</summary>
                    <div class="expandable-body">
                        <div class="cinefia-comments-container" id="cinefiaCommentsBody-${type}-${Number(data.id)}">
                            <div class="cinefia-comments-loading"><div class="spinner"></div><p>Conectando aos comentários compartilhados…</p></div>
                        </div>
                    </div>
                </details>
            `;

            closeDetailSidePanel();
            content.innerHTML = `
                <button class="modal-close" onclick="forceCloseModal()"><i class="fa-solid fa-xmark"></i></button>
                <img src="${poster}" alt="${title}" class="modal-img">
                <div class="modal-info">
                    <h2 class="modal-title">${title}</h2>

                    <div class="modal-tags">
                        <span class="age-rating" style="background-color: ${ageColor}">${ageRating}</span>
                        ${genres}
                    </div>

                    <div class="external-scores">
                        ${scoresHtml}
                    </div>

                    ${providersHtml}

                    <div class="synopsis-section">
                        <p class="modal-desc synopsis-collapsed">${overview}</p>
                        ${overview.length > 0 ? `<button class="synopsis-more-btn" type="button" style="display:none" onclick="openSynopsisQuadrant()"><i class="fa-solid fa-expand"></i> Mostrar mais</button>` : ''}
                    </div>

                    <div class="modal-meta-grid">
                        <div class="meta-item"><span>Lançamento</span> ${year}</div>
                        <div class="meta-item"><span>Duração</span> ${duration}</div>
                        <div class="meta-item"><span>Tipo</span> ${type === 'tv' ? 'Série de TV' : 'Filme'}</div>
                        <div class="meta-item"><span>Status</span> ${status}</div>
                    </div>

                    <div class="feature-actions">
                        <button class="favorite-detail-btn ${isFavorite(data.id, type) ? 'active' : ''}" onclick="toggleFavorite(${data.id}, '${type}')"><i class="fa-${isFavorite(data.id, type) ? 'solid' : 'regular'} fa-heart"></i> ${isFavorite(data.id, type) ? 'Na Minha Lista' : 'Adicionar à Minha Lista'}</button>
                    </div>

                    ${advancedHtml}
                </div>
            `;

            requestAnimationFrame(refreshSynopsisControl);

            // Os painéis abrem à direita; o modal principal continua rolável.
            const expandableItems = Array.from(content.querySelectorAll('.expandable-details'));
            expandableItems.forEach(details => {
                details.addEventListener('toggle', () => {
                    if (!details.open) {
                        if (activeDetailSide?.details === details) closeDetailSidePanel();
                        return;
                    }
                    expandableItems.forEach(other => {
                        if (other !== details && other.open) other.open = false;
                    });
                    openDetailSidePanel(details);
                });
            });
        }

        async function handleEpisodesToggle(id, detailsEl) {
            if (!detailsEl.open) return;
            const select = document.getElementById(`seasonSelect_${id}`);
            if (!select || !select.value) return;
            const grid = document.getElementById(`episodeGrid_${id}`);
            if (grid.dataset.loaded !== select.value) {
                await loadSeasonEpisodes(id, select.value);
            }
        }

        async function loadSeasonEpisodes(tvId, seasonNumber) {
            const grid = document.getElementById(`episodeGrid_${tvId}`);
            if (!grid || !TMDB_API_KEY || !seasonNumber) return;

            grid.innerHTML = '<div class="episode-loading"><div class="spinner"></div><p style="margin-top:10px;">Carregando episódios...</p></div>';
            try {
                const response = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                const data = await response.json();
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
                    return `
                        <article class="episode-card">
                            <img class="episode-img" src="${still}" alt="${ep.name || `Episódio ${ep.episode_number}`}" loading="lazy">
                            <div class="episode-content">
                                <div class="episode-number">EP. ${ep.episode_number}</div>
                                <div class="episode-title">${ep.name || 'Episódio sem título'}</div>
                                <div class="episode-meta"><span class="episode-rating"><i class="fa-solid fa-star"></i> ${rating}</span><span>${airDate}</span></div>
                                <div class="episode-overview">${overview}</div>
                            </div>
                        </article>
                    `;
                }).join('');
                grid.dataset.loaded = String(seasonNumber);
            } catch (error) {
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
                info.innerText = `Página ${currentPage} de ${totalPages > 500 ? 500 : totalPages}`;
                btnPrev.disabled = currentPage === 1;
                btnNext.disabled = currentPage >= (totalPages > 500 ? 500 : totalPages);
            } else {
                container.style.display = 'none';
            }
        }

        function changePage(delta) {
            currentPage += delta;
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

        function toggleMobileNavigation() {
            const isOpen = document.body.classList.toggle('mobile-nav-open');
            const button = document.querySelector('.mobile-nav-toggle');
            if (button) {
                button.setAttribute('aria-expanded', String(isOpen));
                button.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
                button.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-ellipsis-vertical'}"></i>`;
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
        }
        function detailSideEscape(event) { if (event.key === 'Escape') closeDetailSidePanel(); }

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
            grid.innerHTML = `<div class="message-box" style="color: #ef4444">${msg}</div>`;
        }


/* ======================================================================
   AUTENTICAÇÃO SUPABASE — CONTA ONLINE (sem remover os perfis locais)
   ====================================================================== */
let cinefiaSupabaseClient = null;
let cinefiaAuthUser = null;
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
        <form class="cinefia-auth-form" onsubmit="${isSignup ? 'handleCinefiaSignup(event)' : 'handleCinefiaLogin(event)'}">
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
                <button type="button" class="cinefia-auth-switch" onclick="setCinefiaAuthMode('${isSignup ? 'login' : 'signup'}')">${isSignup ? 'Já tenho uma conta — Entrar' : 'Ainda não tem conta? Cadastrar'}</button>
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
        <form class="cinefia-comment-form" onsubmit="submitCinefiaComment(event, ${Number(tmdbId)}, '${mediaType}')">
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
    if (!cinefiaSupabaseClient) {
        target.innerHTML = '<p class="cinefia-comments-error">A conexão com o Supabase ainda não foi iniciada. Recarregue o site e confira se os arquivos foram publicados juntos.</p>';
        return;
    }
    target.innerHTML = '<div class="cinefia-comments-loading"><div class="spinner"></div><p>Carregando comentários da comunidade…</p></div>';
    const { data, error } = await cinefiaSupabaseClient
        .from('cinefia_comments')
        .select('id,user_id,display_name,body,rating,created_at,updated_at')
        .eq('media_type', mediaType)
        .eq('tmdb_id', Number(tmdbId))
        .order('created_at', { ascending: false })
        .limit(100);
    if (!target.isConnected) return;
    if (error) {
        console.warn('[Cinéfia] Não foi possível carregar comentários:', error);
        target.innerHTML = `<div class="cinefia-comments-error"><i class="fa-solid fa-cloud-arrow-down"></i><p>${escapeCinefiaHtml(getCinefiaSupabaseTableErrorMessage(error, 'comentários e avaliações'))}</p><p>Depois de executar o SQL, feche e reabra esta área.</p></div>`;
        return;
    }
    target.innerHTML = renderCinefiaCommentsMarkup(mediaType, Number(tmdbId), data || []);
}

async function submitCinefiaComment(event, tmdbId, mediaType) {
    event.preventDefault();
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) {
        const feedback = document.getElementById(`cinefiaCommentFeedback-${mediaType}-${Number(tmdbId)}`);
        if (feedback) feedback.textContent = 'Entre na sua conta antes de publicar.';
        return;
    }
    const ratingNode = document.getElementById(`cinefiaRating-${mediaType}-${Number(tmdbId)}`);
    const bodyNode = document.getElementById(`cinefiaComment-${mediaType}-${Number(tmdbId)}`);
    const feedback = document.getElementById(`cinefiaCommentFeedback-${mediaType}-${Number(tmdbId)}`);
    const rating = Number(ratingNode?.value);
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
        console.error('[Cinéfia] Erro ao salvar comentário/avaliação:', error);
        return;
    }
    await loadCinefiaComments(Number(tmdbId), mediaType);
}

const CINEFIA_SITE_URL = 'https://xn--cinfia-dva.com.br/';
const CINEFIA_GUEST_EXPERIENCE_KEY = 'cinefia_guest_experience_v1';
const CINEFIA_INTRO_SESSION_KEY = 'cinefia_intro_seen_v1';
let cinefiaAccountPreferences = null;
let cinefiaPreferencesLoadedFor = null;
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
    if (!user?.id || !cinefiaSupabaseClient) { cinefiaAccountPreferences = null; cinefiaPreferencesLoadedFor = null; return null; }
    const { data, error } = await cinefiaSupabaseClient.from('cinefia_preferences').select('origin,purpose,genres,providers').eq('user_id', user.id).maybeSingle();
    if (error) { console.warn('[Cinéfia] Preferências indisponíveis; execute a migração SQL:', error.message); cinefiaAccountPreferences = defaultCinefiaPreferences(); cinefiaPreferencesLoadedFor = user.id; return cinefiaAccountPreferences; }
    cinefiaAccountPreferences = normalizeCinefiaPreferences(data || {});
    cinefiaPreferencesLoadedFor = user.id;
    return cinefiaAccountPreferences;
}

async function saveCinefiaPreferences(preferences, feedbackNode) {
    if (!cinefiaSupabaseClient || !cinefiaAuthUser?.id) { if (feedbackNode) feedbackNode.textContent = 'Entre na sua conta para salvar suas preferências.'; return false; }
    const normalized = normalizeCinefiaPreferences(preferences);
    const { error } = await cinefiaSupabaseClient.from('cinefia_preferences').upsert({ user_id: cinefiaAuthUser.id, ...normalized, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) { if (feedbackNode) feedbackNode.textContent = getCinefiaSupabaseTableErrorMessage(error, 'preferências da Experiência Cinéfia'); return false; }
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

function preferenceDiscoverUrl(type, page = 1, extra = '') {
    const prefs = cinefiaAccountPreferences || defaultCinefiaPreferences();
    const genreIds = prefs.genres.join('|');
    const providerIds = prefs.providers.join('|');
    const providerFilter = providerIds ? `&with_watch_providers=${providerIds}&watch_region=BR&with_watch_monetization_types=flatrate` : '';
    const genreFilter = genreIds ? `&with_genres=${genreIds}` : '';
    return `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&vote_count.gte=30&page=${page}${genreFilter}${providerFilter}${extra}`;
}
async function fetchPreferenceDiscoverResults(limit = 24) {
    if (!cinefiaAccountPreferences || (!cinefiaAccountPreferences.genres.length && !cinefiaAccountPreferences.providers.length)) return [];
    const [movieData, tvData] = await Promise.all([fetch(preferenceDiscoverUrl('movie')).then(r => r.json()), fetch(preferenceDiscoverUrl('tv')).then(r => r.json())]);
    const items = [...(movieData.results || []).map(item => ({ ...item, media_type: 'movie' })), ...(tvData.results || []).map(item => ({ ...item, media_type: 'tv' }))].filter(item => item.poster_path);
    return items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, limit);
}
async function fetchPersonalizedHomeMix() {
    const [personalized, generalData] = await Promise.all([fetchPreferenceDiscoverResults(16), fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`).then(r => r.json())]);
    const general = (generalData.results || []).filter(item => item.poster_path).map(item => ({ ...item, media_type: item.media_type || (item.title ? 'movie' : 'tv') }));
    const seen = new Set(); const mixed = [];
    [...personalized.slice(0, 16), ...general.slice(0, 8)].forEach(item => { const key = `${item.media_type}-${item.id}`; if (!seen.has(key)) { seen.add(key); mixed.push(item); } });
    renderGrid(mixed.slice(0, 24));
    totalPages = 1; updatePagination();
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
                }
                cinefiaAuthMessage = '';
                cinefiaAuthMessageKind = 'info';
                renderSupabaseAuthPanel();
                if (nextUser) {
                    void ensureCinefiaPrivateProfile(nextUser);
                    void ensureCinefiaPublicProfile(nextUser);
                    void loadCinefiaCloudFavorites();
                    void maybeStartCinefiaExperience(nextUser);
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
        console.error('Falha ao iniciar autenticação Supabase:', error);
        cinefiaAuthMessage = 'Não foi possível conectar ao Supabase. Confira a URL, a chave pública e sua conexão.';
        cinefiaAuthMessageKind = 'error';
        renderSupabaseAuthPanel();
        if (panel) panel.dataset.connection = 'error';
    }
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
            .select('username');
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

