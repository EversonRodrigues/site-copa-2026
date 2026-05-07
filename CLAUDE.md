# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (auto-reload via --watch)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000` (or `PORT` from `.env`).

No build step — pure Node.js SSR with vanilla JS/CSS on the frontend.

## Environment Setup

Copy `.env.example` to `.env` and set `SESSION_SECRET` to a long random string. No API keys required — TheSportsDB is free and keyless.

## Architecture

**Full-stack SSR app:** Express + EJS renders complete HTML pages server-side. Vanilla JS handles client-side interactivity (prediction submission via AJAX, hamburger menu, animations).

**Request flow:**
```
Browser (EJS HTML + Vanilla JS)
    ↓ HTTP
Express Server (server.js — routes → controllers → services)
    ↓
SQLite (better-sqlite3)      TheSportsDB API (games/results)
                             RSS feeds (GE Globo, ESPN Brasil)
```

**Layer responsibilities:**
- `src/routes/` — Route definitions; mixed pattern — some routes delegate to controllers, others have inline handlers (see table below)
- `src/controllers/` — Business logic for home, auth, jogos, and bolão (meus-palpites)
- `src/services/` — External API wrappers (`footballApi.js`), static data (`jogosEstaticos.js` has all 104 games, `selecoesData.js` has all 48 teams), RSS parsing (`rssService.js`)
- `src/middleware/auth.js` — `requireAuth` guard; checks `req.session.usuario`, redirects to `/login` if missing
- `views/pages/` — One EJS template per page; `views/partials/` has `header.ejs` and `footer.ejs`
- `public/` — Static CSS (split across 6 files: variables, base, components, layout, animations, responsive) and JS

**Route → handler mapping:**

| Route | Handler | Auth? |
|-------|---------|-------|
| `GET /` | `homeController.home` | No |
| `GET/POST /login`, `GET/POST /cadastro` | GET inline (render form), POST → `authController` | No (rate-limited) |
| `GET /logout` | Inline | No |
| `GET /jogos`, `/grupos`, `/selecoes`, `/selecoes/:nome` | `jogosController` | No |
| `GET /noticias` | Inline async | No |
| `GET /ranking` | Inline | No |
| `GET /meus-palpites` | `bolaoController.paginaMeusPalpites` | Yes |
| `POST /api/palpites` | Inline | Yes |
| `GET /perfil` | Inline | Yes |

**Shared context in handlers:** `req.app.locals.db` gives access to the SQLite instance from any route/controller. `res.locals.usuario` (set by a global middleware in `server.js`) is available in all EJS templates — no need to pass it explicitly.

**Database** (`database/init.js`) — 5 SQLite tables: `usuarios`, `palpites`, `pontuacao`, `noticias_cache`, `jogos_cache`. All caches stored in SQLite (TheSportsDB: 5-min TTL; RSS: 30-min TTL). Unique constraints on `usuarios.email`, `noticias_cache.url`, and `(usuario_id, jogo_id)` in `palpites`.

## Key Domain Logic

**Betting pool scoring** (`src/controllers/bolaoController.js`):
- 5 pts — exact score match
- 2 pts — correct result (win/draw/loss) only
- 0 pts — wrong prediction
- Deadline: predictions must be submitted ≥1 hour before kickoff (enforced server-side)

**Authentication:** bcrypt for password hashing, express-session with 7-day HTTPOnly cookies, rate limiting on auth routes via express-rate-limit.

**Static vs. dynamic data:** Game schedule (`jogosEstaticos.js`) and team data (`selecoesData.js`) are hardcoded static files. Live scores/results come from TheSportsDB API and are cached in `jogos_cache`. News comes from 3 RSS feeds (GE Globo, ESPN Brasil, UOL Esporte) filtered by Copa-related keywords.

## CSS Architecture

Six CSS files loaded in order: `variables.css` → `base.css` → `components.css` → `layout.css` → `animations.css` → `responsive.css`. Color scheme uses CSS custom properties defined in `variables.css` (dark blue `#0A1628` primary, red `#C8102E` accent). Responsive breakpoints: mobile <768px, tablet 768–1024px, desktop >1024px.
