:root {
            --bg-dark: #000000; --bg-panel: #141519; --bg-card: #23252b;
            --accent: #F47521; --accent-hover: #ff8c42;
            --text-main: #ffffff; --text-muted: #a0a0a0;
            --font-ui: 'Lato', sans-serif; --font-title: 'Montserrat', sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        * { scrollbar-width: thin; scrollbar-color: #000000 #141519; }
        *::-webkit-scrollbar { width: 10px; height: 10px; }
        *::-webkit-scrollbar-track { background: #141519; }
        *::-webkit-scrollbar-thumb { background: #000000; border-radius: 10px; border: 2px solid #141519; }
        *::-webkit-scrollbar-thumb:hover { background: #050505; }
        body { background-color: var(--bg-dark); color: var(--text-main); font-family: var(--font-ui); display: flex; min-height: 100vh; overflow-x: hidden; }

        /* BARRA LATERAL */
        .sidebar { width: 260px; background-color: var(--bg-panel); padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 2rem; position: fixed; height: 100vh; border-right: 1px solid rgba(255, 255, 255, 0.05); z-index: 100; }

        /* ÍCONE DE TV EM 3D */
        .brand { display: flex; align-items: center; gap: 14px; font-family: var(--font-title); font-size: 1.8rem; font-weight: 800; color: var(--accent); text-decoration: none; }
        .brand-icon-wrapper { perspective: 500px; display: inline-flex; align-items: center; justify-content: center; }
        .brand-name { font-family: 'Full Width', 'Arial Rounded MT Bold', sans-serif; font-variant-east-asian: full-width; font-feature-settings: 'fwid'; letter-spacing: 0.5px; }
        .brand-icon-3d {
            font-size: 2.2rem;
            background: linear-gradient(135deg, #ff9e59 0%, #F47521 50%, #b34a00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(3px 5px 6px rgba(244, 117, 33, 0.5));
            transform: rotateY(-15deg) rotateX(10deg);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .brand:hover .brand-icon-3d {
            transform: rotateY(0deg) rotateX(0deg) scale(1.15);
            filter: drop-shadow(0px 0px 14px rgba(244, 117, 33, 0.9));
        }

        .nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-title { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; margin-top: 1.2rem; letter-spacing: 1px; }
        .nav-link { display: flex; align-items: center; gap: 15px; padding: 0.8rem 1rem; color: var(--text-main); text-decoration: none; font-weight: 700; border-radius: 8px; transition: all 0.2s ease; cursor: pointer; }
        .nav-link:hover, .nav-link.active { background-color: rgba(244, 117, 33, 0.1); color: var(--accent); }
        .nav-link i { width: 20px; text-align: center; font-size: 1.2rem; }

        .main-content { margin-left: 260px; flex: 1; padding: 0; display: flex; flex-direction: column; }

        /* CARROSSEL ESTILO IMDB (OCUPA TODO O ESPAÇO) */
        .hero { position: relative; height: 480px; width: 100%; overflow: hidden; background-color: var(--bg-dark); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .hero-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.8s ease-in-out; display: flex; align-items: flex-end; padding: 3rem 4rem; z-index: 1; }
        .hero-slide.active { opacity: 1; z-index: 2; }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center 20%; z-index: -1; }
        .hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, var(--bg-dark) 0%, rgba(0,0,0,0.4) 60%, transparent 100%), linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%); }

        .hero-content-wrapper { display: flex; align-items: flex-end; gap: 2rem; max-width: 1000px; position: relative; z-index: 3; }
        .hero-poster { width: 180px; height: 270px; object-fit: cover; border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.1); transition: transform 0.3s; cursor: pointer; }
        .hero-poster:hover { transform: scale(1.05); border-color: var(--accent); }
        .hero-text { margin-bottom: 1rem; }
        .hero-text h1 { font-family: var(--font-title); font-size: 2.8rem; font-weight: 900; margin-bottom: 0.8rem; line-height: 1.1; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
        .hero-text p { font-size: 1.05rem; color: #d1d5db; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); max-width: 700px; }

        /* SETAS DO CARROSSEL */
        .hero-arrows { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); display: flex; justify-content: space-between; padding: 0 1.5rem; z-index: 10; pointer-events: none; }
        .hero-arrows button { pointer-events: auto; background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; backdrop-filter: blur(4px); }
        .hero-arrows button:hover { background: var(--accent); border-color: var(--accent); transform: scale(1.1); }

        .hero-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 5; text-align: center; padding: 4rem; background: linear-gradient(to right, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.5) 100%); }

        .search-container { padding: 1.5rem 4rem; background-color: var(--bg-dark); position: sticky; top: 0; z-index: 90; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .search-box { position: relative; flex: 1; min-width: 300px; }
        .search-box i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-box input { width: 100%; padding: 0.9rem 1rem 0.9rem 3rem; background-color: var(--bg-card); border: 2px solid transparent; border-radius: 8px; color: var(--text-main); font-size: 1rem; font-family: var(--font-ui); outline: none; transition: border-color 0.3s; }
        .search-box input:focus { border-color: var(--accent); }

        .categories-bar { display: none; gap: 10px; overflow-x: auto; padding-bottom: 5px; margin-top: 1rem; width: 100%; }
        .categories-bar.active { display: flex; }
        .cat-btn { background-color: var(--bg-card); color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .cat-btn:hover, .cat-btn.active { background-color: var(--accent); color: white; border-color: var(--accent); }

        .results-section { padding: 2rem 4rem; }
        .section-title { font-family: var(--font-title); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }

        .card { background-color: transparent; border-radius: 4px; overflow: hidden; cursor: pointer; transition: transform 0.3s ease; position: relative; }
        .card:hover { transform: translateY(-5px); }
        .card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 3px solid var(--accent); opacity: 0; transition: opacity 0.2s ease; pointer-events: none; z-index: 10; }
        .card:hover::after { opacity: 1; }
        .card-img-wrapper { position: relative; width: 100%; aspect-ratio: 2 / 3; background-color: var(--bg-card); overflow: hidden; }
        .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover .card-img { transform: scale(1.05); }
        .rating-badge { position: absolute; top: 10px; right: 10px; background-color: rgba(0,0,0,0.8); color: var(--accent); padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; backdrop-filter: blur(4px); }
        .card-info { padding: 10px 0; }
        .card-title { font-family: var(--font-title); font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-main); }
        .card-meta { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }

        .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 3rem; padding-bottom: 2rem; }
        .page-btn { background-color: var(--bg-card); color: var(--text-main); border: none; padding: 10px 20px; border-radius: 6px; font-family: var(--font-ui); font-weight: bold; cursor: pointer; transition: background 0.3s, color 0.3s; }
        .page-btn:hover:not(:disabled) { background-color: var(--accent); }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-info { font-weight: bold; color: var(--text-muted); }

        .message-box { grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted); font-size: 1.2rem; }
        .spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(244, 117, 33, 0.3); border-radius: 50%; border-top-color: var(--accent); animation: spin 1s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modal3DIn {
            0% { opacity: 0; transform: perspective(1000px) rotateX(-20deg) translateY(60px) scale(0.9); }
            100% { opacity: 1; transform: perspective(1000px) rotateX(0deg) translateY(0) scale(1); }
        }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.88); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.35s ease; backdrop-filter: blur(10px); }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-content { background-color: var(--bg-panel); width: 90%; max-width: 900px; border-radius: 12px; display: flex; overflow: visible; position: relative; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; opacity: 0; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .modal-overlay.active .modal-content { animation: modal3DIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .modal-close { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.6); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; transition: background 0.2s; z-index: 10; }
        .modal-close:hover { background: var(--accent); }
        .modal-img { width: 320px; min-width: 320px; max-width: 320px; flex: 0 0 320px; height: auto; aspect-ratio: 2 / 3; object-fit: cover; align-self: flex-start; }
        .modal-info { padding: 2.5rem; flex: 1; overflow: visible; position: relative; }
        .modal-title { font-family: var(--font-title); font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--accent); line-height: 1.1; }
        .modal-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.2rem; align-items: center; }
        .tag { background-color: var(--bg-card); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
        .age-rating { color: white; padding: 4px 8px; border-radius: 4px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px; }

        /* SCORES E STREAMING */
        .external-scores { display: flex; gap: 12px; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .score-badge { display: flex; align-items: center; gap: 8px; background-color: var(--bg-dark); padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.05); }

        .streaming-providers { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 8px; }
        .streaming-title { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
        .provider-logos { display: flex; gap: 10px; flex-wrap: wrap; }
        .provider-logo { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, filter 0.28s ease; }

        .modal-desc { line-height: 1.6; color: #d1d5db; font-size: 0.98rem; margin-bottom: 1.5rem; }
        .modal-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background-color: var(--bg-dark); padding: 1.2rem; border-radius: 8px; }
        .meta-item span { display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }

        .expandable-details { margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; position: static; }
        .expandable-details summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--text-main); font-weight: 800; padding: 0.8rem 0; }
        .expandable-details summary::-webkit-details-marker { display: none; }
        .expandable-details summary::after { content: '\f078'; font-family: 'Font Awesome 6 Free'; font-weight: 900; color: var(--accent); transition: transform 0.2s ease; }
        .expandable-details[open] summary::after { transform: rotate(180deg); }
        .expandable-body { position: absolute; top: auto; bottom: 0; left: calc(100% + 12px); width: min(480px, 44vw); max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding: 2.25rem 1.25rem 1.25rem; background: var(--bg-panel); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); opacity: 0; visibility: hidden; transform: translateX(-12px); transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease; z-index: 20; }
        .expandable-details[open] .expandable-body { opacity: 1; visibility: visible; transform: translateX(0); }
        /* Mantém o painel dentro da janela quando não há espaço à direita do modal. */
        .expandable-body.is-overflowing { left: auto; right: 0; width: min(480px, calc(100vw - 32px)); max-width: calc(100vw - 32px); }
        .crew-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .crew-item { background: var(--bg-dark); padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .crew-item span, .episode-section-title, .episode-select-label { display: block; font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.7px; font-weight: 800; margin-bottom: 4px; }
        .crew-item strong { font-size: 0.92rem; color: white; line-height: 1.35; }
        .episodes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .season-select { min-width: 150px; background: var(--bg-dark); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; padding: 8px 10px; outline: none; }
        .season-select:focus { border-color: var(--accent); }
        .episode-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .episode-card { display: grid; grid-template-columns: 92px 1fr; gap: 10px; background: var(--bg-dark); border: 1px solid rgba(255,255,255,0.06); border-radius: 9px; overflow: hidden; transition: transform 0.2s ease, border-color 0.2s ease; }
        .episode-card:hover { transform: translateY(-2px); border-color: rgba(244,117,33,0.5); }
        .episode-img { width: 92px; height: 126px; object-fit: cover; background: #0a0a0a; }
        .episode-content { padding: 10px 10px 10px 0; min-width: 0; }
        .episode-number { color: var(--accent); font-size: 0.72rem; font-weight: 900; }
        .episode-title { color: #fff; font-weight: 800; font-size: 0.9rem; line-height: 1.2; margin: 3px 0 6px; }
        .episode-meta { display: flex; gap: 8px; flex-wrap: wrap; color: var(--text-muted); font-size: 0.75rem; }
        .episode-overview { color: #bfc2c9; font-size: 0.76rem; line-height: 1.35; margin-top: 7px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .episode-rating { color: #f5c518; font-weight: 900; }
        .episode-loading { grid-column: 1 / -1; color: var(--text-muted); padding: 1rem; text-align: center; }
        @media (max-width: 900px) { .expandable-body { position: static; width: 100%; max-height: 45vh; margin-top: 0.5rem; padding: 1rem; opacity: 1; visibility: visible; transform: none; box-shadow: none; border-radius: 8px; } .expandable-details[open] .expandable-body { transform: none; } }
        @media (max-width: 650px) { .crew-grid { grid-template-columns: 1fr; } .episode-card { grid-template-columns: 78px 1fr; } .episode-img { width: 78px; height: 108px; } }

        /* NOVOS RECURSOS CINÉFIA */
        .feature-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 1rem; }
        .feature-btn, .favorite-detail-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--bg-dark); color: white; border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; padding: 8px 12px; font-family: var(--font-ui); font-weight: 800; cursor: pointer; transition: all 0.2s ease; }
        .feature-btn:hover, .favorite-detail-btn:hover { background: var(--accent); border-color: var(--accent); }
        .favorite-detail-btn.active { color: var(--accent); border-color: rgba(244,117,33,0.5); }
        .favorite-btn { position: absolute; top: 10px; left: 10px; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.72); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 12; backdrop-filter: blur(5px); transition: all 0.2s ease; }
        .favorite-btn:hover, .favorite-btn.active { color: #ff4d67; border-color: rgba(255,77,103,0.55); transform: scale(1.08); }
        .cinefia-score { color: var(--accent); font-weight: 900; }
        .cast-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .cast-card { display: grid; grid-template-columns: 52px minmax(0, 1fr); align-items: center; gap: 8px; background: var(--bg-dark); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px; min-width: 0; }
        .cast-card > div { min-width: 0; overflow-wrap: anywhere; }
        .cast-img { width: 52px; height: 68px; object-fit: cover; border-radius: 5px; background: #0a0a0a; }
        .cast-name { color: white; font-size: 0.8rem; font-weight: 800; line-height: 1.2; overflow-wrap: anywhere; }
        .cast-character { color: var(--text-muted); font-size: 0.72rem; margin-top: 3px; line-height: 1.2; overflow-wrap: anywhere; }
        .filter-toggle { flex: 0 0 auto; }
        .filter-panel { display: none; width: 100%; background: var(--bg-panel); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; margin-top: 0.25rem; }
        .filter-panel.active { display: block; }
        .filter-grid { display: grid; grid-template-columns: repeat(4, minmax(140px, 1fr)); gap: 10px; }
        .filter-field { display: flex; flex-direction: column; gap: 5px; }
        .filter-field label { color: var(--text-muted); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; }
        .filter-field select, .filter-field input { width: 100%; background: var(--bg-dark); color: white; border: 1px solid rgba(255,255,255,0.09); border-radius: 7px; padding: 9px 10px; outline: none; }
        .filter-field select:focus, .filter-field input:focus { border-color: var(--accent); }
        .filter-actions { display: flex; gap: 8px; margin-top: 10px; }
        .filter-apply { background: var(--accent); border-color: var(--accent); }
        .filter-reset { background: var(--bg-card); }
        .recommendation-note { color: var(--text-muted); font-size: 0.85rem; margin: -0.6rem 0 1.25rem; }
        .surprise-modal { width: 90%; max-width: 520px; }
        .trailer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.94); display: flex; align-items: center; justify-content: center; z-index: 1200; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; padding: 2rem; }
        .trailer-overlay.active { opacity: 1; pointer-events: all; }
        .trailer-window { width: min(1100px, 96vw); background: #050505; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.85); position: relative; }
        .trailer-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.8rem 1rem; background: var(--bg-panel); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .trailer-title { color: white; font-weight: 900; font-family: var(--font-title); }
        .trailer-close { width: 36px; height: 36px; border: none; border-radius: 50%; background: rgba(0,0,0,0.55); color: white; cursor: pointer; font-size: 1.2rem; }
        .trailer-close:hover { background: var(--accent); }
        .trailer-frame-wrap { aspect-ratio: 16 / 9; background: #000; }
        .trailer-frame { width: 100%; height: 100%; border: 0; display: block; }
        .trailer-message { padding: 3rem; text-align: center; color: var(--text-muted); }
        @media (max-width: 900px) { .filter-grid { grid-template-columns: repeat(2, minmax(130px, 1fr)); } .cast-grid { grid-template-columns: 1fr; } }
        @media (max-width: 650px) { .filter-grid { grid-template-columns: 1fr; } }

        /* FORM CONFIGURAÇÕES */
        .settings-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .settings-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .settings-field label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
        .settings-field input { padding: 0.8rem; background-color: var(--bg-dark); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white; font-family: var(--font-ui); outline: none; }
        .settings-field input:focus { border-color: var(--accent); }
        .save-btn { background-color: var(--accent); color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s; margin-top: 0.5rem; }
        .save-btn:hover { background-color: var(--accent-hover); }

        @media (max-width: 900px) {
            .modal-img { width: 100%; min-width: 0; max-width: 100%; flex: 0 0 auto; height: 220px; aspect-ratio: auto; align-self: auto; }
            .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
            .main-content { margin-left: 0; }
            .search-container, .results-section { padding: 1.5rem 2rem; }
            .modal-content { flex-direction: column; overflow-y: auto; }
            .modal-img { width: 100%; height: 220px; object-position: center 20%; }
            .hero { padding: 0; height: 400px; }
            .hero-poster { display: none; }
            .hero-slide { justify-content: center; text-align: center; padding: 2rem; align-items: center; }
            .hero-text h1 { font-size: 2rem; }
            .hero-arrows { padding: 0 0.5rem; }
            .hero-bg::after { background: linear-gradient(to top, var(--bg-dark) 0%, rgba(0,0,0,0.6) 100%); }
        }


/* Links dos provedores de streaming: alterações isoladas para preservar o design existente. */
.provider-link { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; }
.provider-link .provider-logo { cursor: pointer; }
.provider-link-unmapped { opacity: .72; cursor: help; }
.provider-link-unmapped small { color: #f47521; font-size: 9px; max-width: 76px; text-align: center; margin-top: 3px; }

/* Animação de destaque ao passar o cursor nos ícones de streaming (sem contorno, apenas movimento/luz). */
.provider-link:hover .provider-logo,
.provider-link:focus-visible .provider-logo {
    transform: translateY(-6px) scale(1.14);
    box-shadow: 0 14px 26px rgba(244, 117, 33, 0.45);
    filter: brightness(1.18) saturate(1.1);
}
.provider-link:active .provider-logo { transform: translateY(-2px) scale(1.06); }


/* Ajustes solicitados: sinopse limitada e expansão em quadrante independente */
.synopsis-section { margin-bottom: 1.5rem; min-width: 0; }
.modal-desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    overflow: hidden;
    overflow-wrap: anywhere;
    margin-bottom: 0.45rem;
}
.synopsis-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 4px;
    padding: 7px 11px;
    border: 1px solid rgba(244,117,33,.45);
    border-radius: 7px;
    color: var(--accent);
    background: rgba(244,117,33,.08);
    font: 700 .85rem var(--font-ui);
    cursor: pointer;
    transition: background .2s ease, color .2s ease;
}
.synopsis-more-btn:hover { background: var(--accent); color: #fff; }
.synopsis-quadrant {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
    background: rgba(0,0,0,.82);
    backdrop-filter: blur(8px);
    opacity: 0;
    visibility: hidden;
    transition: opacity .2s ease, visibility .2s ease;
}
.synopsis-quadrant.active { opacity: 1; visibility: visible; }
.synopsis-quadrant-card {
    position: relative;
    width: min(680px, 100%);
    max-height: min(75vh, 720px);
    overflow-y: auto;
    padding: 30px;
    border: 1px solid rgba(244,117,33,.35);
    border-radius: 14px;
    background: #141519;
    box-shadow: 0 24px 80px rgba(0,0,0,.75);
    transform: translateY(10px);
    transition: transform .2s ease;
}
.synopsis-quadrant.active .synopsis-quadrant-card { transform: translateY(0); }
.synopsis-quadrant-label {
    display: block;
    margin-bottom: 10px;
    color: var(--accent);
    font-size: .72rem;
    font-weight: 900;
    letter-spacing: 1.5px;
}
.synopsis-quadrant-card h3 {
    padding-right: 35px;
    margin-bottom: 18px;
    font: 800 1.35rem var(--font-title);
    color: #fff;
}
.synopsis-quadrant-text {
    color: #d1d5db;
    font-size: 1rem;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.synopsis-quadrant-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: #000;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
}
.synopsis-quadrant-close:hover { background: var(--accent); }
@media (max-width: 650px) {
    .synopsis-quadrant { padding: 12px; }
    .synopsis-quadrant-card { padding: 24px 18px; max-height: 82vh; }
}


/* Conta Supabase — estilos isolados para preservar o design original do Cinéfia. */
.cinefia-auth-panel { background: linear-gradient(145deg, rgba(244,117,33,.09), rgba(20,21,25,.98) 45%); border: 1px solid rgba(244,117,33,.28); border-radius: 12px; padding: 1.1rem; margin: .15rem 0 1rem; }
.cinefia-auth-title { font-family: var(--font-title); color: var(--text-main); font-size: 1.05rem; font-weight: 800; margin-bottom: .35rem; }
.cinefia-auth-muted { color: var(--text-muted); font-size: .84rem; line-height: 1.5; }
.cinefia-auth-instructions { margin: .8rem 0 1rem; padding: .9rem 1rem; border: 1px solid rgba(244,117,33,.24); border-radius: 9px; background: rgba(0,0,0,.28); color: #d1d5db; font-size: .86rem; line-height: 1.55; }
.cinefia-auth-instructions p + p { margin-top: .65rem; }
.cinefia-auth-instructions ol { margin: .55rem 0 .55rem 1.25rem; padding: 0; }
.cinefia-auth-instructions li { padding-left: .2rem; margin: .3rem 0; }
.cinefia-auth-how-link { align-self: flex-start; margin: -.35rem 0 0; }
.cinefia-auth-form { display: flex; flex-direction: column; gap: .8rem; margin-top: .9rem; }
.cinefia-auth-field { display: flex; flex-direction: column; gap: .35rem; }
.cinefia-auth-field label { color: var(--text-muted); font-size: .82rem; font-weight: 800; }
.cinefia-auth-field input { width: 100%; min-width: 0; padding: .78rem .85rem; background: var(--bg-dark); color: var(--text-main); border: 1px solid rgba(255,255,255,.13); border-radius: 7px; outline: none; font: inherit; }
.cinefia-auth-field input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(244,117,33,.12); }
.cinefia-auth-actions { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; margin-top: .1rem; }
.cinefia-auth-switch { appearance: none; border: 0; padding: .45rem .2rem; background: transparent; color: var(--accent); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; font: 700 .84rem var(--font-ui); }
.cinefia-auth-message { margin-top: .8rem; font-size: .83rem; line-height: 1.45; overflow-wrap: anywhere; }
.cinefia-auth-message[data-kind="error"] { color: #ff8585; }
.cinefia-auth-message[data-kind="success"] { color: #7ee5a1; }
.cinefia-auth-message[data-kind="info"] { color: #e3b987; }
.cinefia-auth-account { display: flex; flex-direction: column; gap: .55rem; }
.cinefia-auth-account-icon { display: inline-flex; width: 42px; height: 42px; border-radius: 50%; align-items: center; justify-content: center; color: var(--accent); background: rgba(244,117,33,.14); border: 1px solid rgba(244,117,33,.28); margin-bottom: .25rem; }
.cinefia-auth-email { color: var(--text-main); font-size: .9rem; overflow-wrap: anywhere; }
.cinefia-section-divider { display: flex; align-items: center; gap: .75rem; margin: .5rem 0 1rem; color: var(--text-muted); font-size: .68rem; font-weight: 900; letter-spacing: 1.2px; }
.cinefia-section-divider::before, .cinefia-section-divider::after { content: ''; height: 1px; flex: 1; background: rgba(255,255,255,.09); }
.cinefia-auth-panel button:disabled { opacity: .6; cursor: wait; }
@media (max-width: 600px) {
  #profileModal .modal-content { width: calc(100% - 1rem) !important; padding: 1.2rem !important; max-height: 92dvh !important; }
  .cinefia-auth-panel { padding: .9rem; }
  .cinefia-auth-actions > button { flex: 1 1 auto; }
}


/* Comentários e avaliações compartilhados do Cinéfia via Supabase */
.cinefia-cloud-status { margin-top: .75rem; padding: .7rem .8rem; background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; color: var(--text-muted); font-size: .78rem; line-height: 1.45; overflow-wrap: anywhere; }
.cinefia-cloud-status[data-kind="success"] { color: #86efac; border-color: rgba(74,222,128,.24); }
.cinefia-cloud-status[data-kind="error"] { color: #fca5a5; border-color: rgba(248,113,113,.3); }
.cinefia-comments-container { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.cinefia-comments-loading, .cinefia-comments-error, .cinefia-comments-empty { padding: 1.2rem .6rem; text-align: center; color: var(--text-muted); line-height: 1.5; }
.cinefia-comments-loading .spinner { width: 28px; height: 28px; border-width: 3px; }
.cinefia-comments-loading p { margin-top: .7rem; font-size: .85rem; }
.cinefia-comments-error { color: #fca5a5; background: rgba(127,29,29,.14); border: 1px solid rgba(248,113,113,.2); border-radius: 8px; }
.cinefia-comments-error p + p { margin-top: .45rem; font-size: .78rem; }
.cinefia-community-score { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(244,117,33,.14), rgba(255,255,255,.025)); border: 1px solid rgba(244,117,33,.26); border-radius: 10px; }
.cinefia-community-score > div:first-child { display: flex; flex-direction: column; gap: .25rem; }
.cinefia-community-score-label { color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; font-size: .68rem; font-weight: 800; }
.cinefia-community-score strong { color: var(--accent); font-family: var(--font-title); font-size: 2rem; line-height: 1; }
.cinefia-community-score strong small { font: 700 .8rem var(--font-ui); color: var(--text-muted); margin-left: 2px; }
.cinefia-community-score-meta { text-align: right; color: var(--text-main); font-size: .78rem; line-height: 1.5; }
.cinefia-community-score-meta span { color: var(--text-muted); font-size: .68rem; }
.cinefia-comment-form { display: flex; flex-direction: column; gap: .55rem; padding: 1rem; background: var(--bg-dark); border: 1px solid rgba(255,255,255,.075); border-radius: 10px; }
.cinefia-comment-form-heading { font-size: .93rem; font-weight: 900; margin-bottom: .2rem; color: var(--text-main); }
.cinefia-comment-form label { color: var(--text-muted); font-size: .76rem; font-weight: 800; }
.cinefia-comment-form input, .cinefia-comment-form textarea { width: 100%; background: #191a1f; color: white; border: 1px solid rgba(255,255,255,.12); border-radius: 7px; padding: .7rem .75rem; font: 500 .88rem var(--font-ui); outline: none; }
.cinefia-comment-form input:focus, .cinefia-comment-form textarea:focus { border-color: var(--accent); }
.cinefia-comment-form textarea { resize: vertical; min-height: 82px; line-height: 1.5; }
.cinefia-comment-form-row { display: flex; align-items: center; gap: .7rem; }
.cinefia-comment-form-row input { max-width: 105px; }
.cinefia-comment-form-hint { color: var(--text-muted); font-size: .72rem; line-height: 1.35; }
.cinefia-comment-form-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .6rem; color: var(--text-muted); font-size: .7rem; }
.cinefia-comment-feedback { min-height: 0; color: var(--text-muted); font-size: .78rem; line-height: 1.4; }
.cinefia-comments-login-prompt { padding: 1rem; background: var(--bg-dark); border: 1px solid rgba(255,255,255,.07); border-radius: 9px; }
.cinefia-comments-login-prompt p { margin-bottom: .8rem; color: var(--text-muted); font-size: .83rem; line-height: 1.5; }
.cinefia-comments-list-heading { display: flex; justify-content: space-between; align-items: baseline; gap: .6rem; border-bottom: 1px solid rgba(255,255,255,.09); padding-bottom: .55rem; }
.cinefia-comments-list-heading strong { color: var(--text-main); font-size: .88rem; }
.cinefia-comments-list-heading span { color: var(--text-muted); font-size: .7rem; }
.cinefia-comments-list { display: flex; flex-direction: column; gap: .7rem; }
.cinefia-comment-card { position: relative; padding: .85rem; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.07); border-radius: 9px; overflow-wrap: anywhere; }
.cinefia-comment-card-top { display: flex; justify-content: space-between; align-items: center; gap: .6rem; }
.cinefia-comment-card-top strong { color: var(--text-main); font-size: .82rem; }
.cinefia-comment-rating { flex: 0 0 auto; color: #f5c518; font-size: .76rem; font-weight: 900; }
.cinefia-comment-card time { display: block; margin-top: .25rem; color: var(--text-muted); font-size: .68rem; }
.cinefia-comment-text { color: #d7d9df; font-size: .82rem; line-height: 1.55; white-space: pre-wrap; margin-top: .7rem; }
.cinefia-comment-no-text { color: var(--text-muted); font-style: italic; }
.cinefia-comment-own-label { display: inline-block; margin-top: .65rem; color: var(--accent); font-size: .67rem; font-weight: 900; }

/* Limites reais do modal: todo o conteúdo, inclusive painéis abertos, fica dentro. */
#detailsModal { padding: 16px; overflow: hidden; }
#detailsModal #modalContent {
    display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
    width: min(100%, 980px); height: min(860px, calc(100dvh - 32px));
    max-height: calc(100dvh - 32px); min-height: 0; overflow: hidden;
    border-radius: 16px;
}
#detailsModal .modal-info {
    min-width: 0; min-height: 0; height: 100%; padding: 32px 28px;
    overflow: auto; overscroll-behavior: contain; scrollbar-gutter: stable;
}
#detailsModal .modal-img {
    width: 100%; min-width: 0; max-width: 100%; height: auto; max-height: 100%;
    aspect-ratio: 2 / 3; object-fit: cover; border-radius: 14px; margin: 0;
}
#detailsModal .modal-title { padding-right: 30px; overflow-wrap: anywhere; }
#detailsModal .modal-close { z-index: 30; }
#detailsModal .expandable-body,
#detailsModal .expandable-body.is-overflowing {
    position: static; inset: auto; width: 100%; max-width: 100%;
    max-height: none; opacity: 1; visibility: visible; transform: none;
}
#detailsModal .expandable-details[open] .expandable-body { transform: none; }
#detailsModal .expandable-body .cinefia-comments-container,
#detailsModal .expandable-body .crew-grid,
#detailsModal .expandable-body .episode-grid { min-width: 0; }
.detail-side-overlay {
    position: fixed; inset: 0; z-index: 1900; display: none;
    background: rgba(0,0,0,.35); backdrop-filter: blur(3px);
}
.detail-side-overlay.active { display: block; }
#trailerOverlay { z-index: 2200; }
.detail-side-panel {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    width: min(470px, calc(100vw - 32px)); max-height: min(85dvh, 800px);
    display: flex; flex-direction: column; overflow: hidden;
    background: var(--bg-panel); color: var(--text-main);
    border: 1px solid rgba(244,117,33,.34); border-radius: 14px;
    box-shadow: 0 26px 80px rgba(0,0,0,.8);
}
.detail-side-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
.detail-side-heading h3 { color: var(--accent); font: 800 1.1rem var(--font-title); }
.detail-side-heading button { flex: 0 0 auto; width: 36px; height: 36px; border: 0; border-radius: 50%; background: #050505; color: #fff; cursor: pointer; }
.detail-side-heading button:hover { background: var(--accent); }
.detail-side-content { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 20px; }
.detail-side-content > .expandable-body,
.detail-side-content > .expandable-body.is-overflowing {
    position: static; inset: auto; width: 100%; max-width: 100%; max-height: none;
    padding: 0; margin: 0; opacity: 1; visibility: visible; transform: none;
    box-shadow: none; border: 0; background: transparent; overflow: visible;
}
@media (min-width: 1200px) {
    #detailsModal.side-panel-open #modalContent { transform: translateX(-min(14vw, 180px)) !important; }
}
#detailsModal .modal-desc.synopsis-collapsed {
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5;
    line-clamp: 5; overflow: hidden;
}
.card, .card::after { border-radius: 12px; }
.card-img-wrapper, .card-img { border-radius: 12px; }
.hero-poster { border-radius: 12px; }

/* Experiência: mesma identidade preta/cinza/laranja, sem caixas duplicadas. */
#experienceModal { padding: 16px; }
#experienceModal .modal-content {
    display: block; width: min(780px, 100%); max-height: calc(100dvh - 32px);
    padding: 0; overflow: auto; overscroll-behavior: contain; border-radius: 16px;
    background: var(--bg-panel); border: 1px solid rgba(255,255,255,.12);
}
#experienceModal .cinefia-experience-settings { margin: 0; padding: 34px; border: 0; background: none; }
#experienceModal .experience-eyebrow { display: block; color: var(--accent); font-size: .68rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 10px; }
#experienceModal h3 { font: 800 clamp(1.2rem, 3vw, 1.6rem) var(--font-title); padding-right: 28px; margin-bottom: 12px; line-height: 1.3; }
#experienceModal .cinefia-experience-settings > p { font-size: .92rem; }
#experienceModal .cinefia-preference-group { margin-top: 26px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.08); }
#experienceModal h4 { font: 800 .95rem var(--font-ui); color: var(--text-main); margin-bottom: 6px; }
#experienceModal h4 i { color: var(--accent); margin-right: 6px; }
#experienceModal .cinefia-preference-options { gap: 9px; }
#experienceModal .cinefia-preference-option {
    min-height: 42px; padding: 10px 16px; border-radius: 24px;
    border: 1px solid rgba(255,255,255,.12); background: var(--bg-card);
    color: #cbd0d7; font: 700 .85rem var(--font-ui); cursor: pointer;
    transition: background .18s, border-color .18s, color .18s;
}
#experienceModal .cinefia-preference-option:hover { color: #fff; border-color: rgba(244,117,33,.6); background: #303037; }
#experienceModal .cinefia-preference-option[aria-pressed="true"] { background: rgba(244,117,33,.14); border-color: var(--accent); color: var(--accent); box-shadow: none; }
#experienceModal .cinefia-preference-option[aria-pressed="true"]::before { content: '✓'; margin-right: 7px; }
#experienceModal .experience-footer { margin-top: 28px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.08); }
#experienceModal .save-btn { padding: 12px 22px; border-radius: 8px; font: 800 .9rem var(--font-ui); }
#experienceModal .cinefia-auth-message { display: block; }
#experienceModal .experience-account-prompt { padding: 30px 10px 10px; text-align: center; }
#experienceModal .experience-account-prompt > i { color: var(--accent); font-size: 2rem; margin-bottom: 16px; }
@media (max-width: 900px) {
    #detailsModal #modalContent { display: flex; flex-direction: column; overflow-y: auto; }
    #detailsModal .modal-info { height: auto; flex: 0 0 auto; overflow: visible; padding: 24px 20px; }
    #detailsModal .modal-img { flex: 0 0 auto; height: 220px; max-height: none; aspect-ratio: auto; object-position: center 20%; }
    .detail-side-panel { right: 12px; width: min(470px, calc(100vw - 24px)); }
}
@media (max-width: 600px) {
    #detailsModal, #experienceModal { padding: 8px; }
    #detailsModal #modalContent { height: calc(100dvh - 16px); max-height: calc(100dvh - 16px); }
    #experienceModal .modal-content { max-height: calc(100dvh - 16px); }
    #experienceModal .cinefia-experience-settings { padding: 26px 18px; }
    #experienceModal .cinefia-preference-option { padding: 10px 13px; }
    .detail-side-panel { right: 8px; max-height: calc(100dvh - 16px); width: calc(100vw - 16px); }
    .detail-side-content { padding: 16px; }
}
@media (max-width: 650px) { .cinefia-community-score { align-items: flex-start; flex-direction: column; } .cinefia-community-score-meta { text-align: left; } .cinefia-comment-form-row { align-items: flex-start; flex-direction: column; } .cinefia-comment-form-row input { max-width: 100%; } .cinefia-comment-card-top { align-items: flex-start; flex-direction: column; gap: .3rem; } }
