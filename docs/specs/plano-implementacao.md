# Site Copa do Mundo 2026 — Plano de Implementação

**Data:** 2026-03-29
**Spec base:** `docs/superpowers/specs/2026-03-29-site-copa-mundo-design.md`

---

## Visão Geral

O projeto é dividido em **7 fases** sequenciais. Cada fase entrega valor incremental e pode ser testada de forma independente antes de avançar.

---

## Fase 1 — Setup do Projeto

**Objetivo:** estrutura base funcionando localmente.

- [ ] Inicializar `package.json` com `npm init`
- [ ] Instalar dependências: `express`, `ejs`, `better-sqlite3`, `bcrypt`, `express-session`, `express-rate-limit`, `rss-parser`, `dotenv`, `node-fetch`
- [ ] Criar estrutura de pastas conforme o spec (`src/routes`, `src/controllers`, `src/services`, `src/middleware`, `views/partials`, `views/pages`, `public/css`, `public/js`, `public/img`)
- [ ] Configurar `server.js` com Express básico (porta 3000, EJS como view engine, arquivos estáticos em `public/`)
- [ ] Criar `.env` com variáveis: `PORT`, `SESSION_SECRET`, `API_FOOTBALL_KEY`
- [ ] Criar `.gitignore` incluindo `.env`, `node_modules/`, `database/`
- [ ] Testar: `node server.js` responde na porta 3000

---

## Fase 2 — Banco de Dados e Autenticação

**Objetivo:** usuários conseguem se cadastrar e fazer login.

- [ ] Criar `database/init.js` com script de criação das tabelas SQLite:
  - `usuarios` (id, nome, email, senha_hash, criado_em)
  - `palpites` (id, usuario_id, jogo_id, gols_casa, gols_fora, pontos, criado_em)
  - `pontuacao` (id, usuario_id, total_pontos, atualizado_em)
  - `noticias_cache` (id, titulo, fonte, url, publicado_em, atualizado_em)
  - `jogos_cache` (id, jogo_id_api, dados_json, atualizado_em)
- [ ] Executar `init.js` no boot do servidor se o banco não existir
- [ ] Criar `src/routes/auth.js` com rotas: `GET /cadastro`, `POST /cadastro`, `GET /login`, `POST /login`, `GET /logout`
- [ ] Criar `src/controllers/authController.js`:
  - Cadastro: validar email único, hash da senha com `bcrypt`, inserir no banco
  - Login: buscar usuário, comparar hash, criar sessão
  - Logout: destruir sessão
- [ ] Criar `src/middleware/auth.js`: middleware `requireAuth` que redireciona para `/login` se não houver sessão
- [ ] Criar views EJS: `views/pages/login.ejs`, `views/pages/cadastro.ejs`
- [ ] Aplicar rate limiting nas rotas `POST /login` e `POST /cadastro`
- [ ] Testar: cadastro, login, logout e proteção de rota funcionando

---

## Fase 3 — Integração com API de Futebol

**Objetivo:** dados reais de jogos, grupos e seleções disponíveis no servidor.

- [ ] Criar `src/services/footballApi.js`:
  - Função `fetchJogos()` — busca jogos da Copa 2026 na API-Football
  - Função `fetchGrupos()` — busca classificação dos grupos
  - Função `fetchSelecao(id)` — busca dados de uma seleção
  - Todas as funções salvam resultado em `jogos_cache` no SQLite com timestamp
- [ ] Implementar lógica de cache: se dado tem menos de 5 minutos, usa cache; senão, chama API
- [ ] Criar `src/routes/jogos.js` com rotas: `GET /jogos`, `GET /grupos`, `GET /selecoes`, `GET /selecoes/:id`
- [ ] Criar `src/controllers/jogosController.js` consumindo o service
- [ ] Criar views EJS:
  - `views/pages/jogos.ejs` — listagem com filtro por fase/data
  - `views/pages/grupos.ejs` — tabela dos 8 grupos com bandeiras
  - `views/pages/selecoes.ejs` — lista de seleções
  - `views/pages/selecao.ejs` — detalhe de uma seleção
- [ ] Testar: páginas exibem dados reais da API com cache funcionando

---

## Fase 4 — Notícias via RSS

**Objetivo:** feed de notícias atualizado automaticamente.

- [ ] Criar `src/services/rssService.js`:
  - Função `fetchNoticias()` usando `rss-parser`
  - Feeds: ge.globo.com (esportes) e ESPN Brasil
  - Salva itens mais recentes (máx. 20 por fonte) em `noticias_cache`
  - Cache de 30 minutos
- [ ] Criar `src/routes/noticias.js` com rota `GET /noticias`
- [ ] Criar `src/controllers/noticiasController.js`
- [ ] Criar `views/pages/noticias.ejs` — lista com título, fonte, data e link externo
- [ ] Testar: página de notícias exibe itens dos feeds com cache funcionando

---

## Fase 5 — Bolão e Palpites

**Objetivo:** usuários autenticados fazem palpites e veem o ranking.

- [ ] Criar `src/routes/bolao.js` com rotas:
  - `GET /meus-palpites` (protegida)
  - `POST /palpites` (protegida) — enviar palpite
  - `GET /ranking` (pública)
- [ ] Criar `src/controllers/bolaoController.js`:
  - `enviarPalpite`: valida se jogo existe, se prazo não expirou (1h antes), se usuário já palpitou; insere em `palpites`
  - `listarMeusPalpites`: busca palpites do usuário com dados do jogo
  - `calcularPontuacao`: chamada após resultado confirmado — compara palpite com resultado real, atribui 5 pts (placar exato) ou 2 pts (só resultado), atualiza `pontuacao`
  - `listarRanking`: retorna usuários ordenados por `total_pontos`
- [ ] Criar views EJS:
  - `views/pages/meus-palpites.ejs` — formulário de palpite + histórico
  - `views/pages/ranking.ejs` — tabela com medalhas para top 3
- [ ] Criar `src/routes/api.js` com endpoints JSON para JS do cliente:
  - `POST /api/palpites` — envio de palpite via fetch
  - `GET /api/ranking` — ranking atualizado
- [ ] Testar: palpite enviado, prazo bloqueado, pontuação calculada, ranking exibido

---

## Fase 6 — Home e Perfil

**Objetivo:** página inicial completa e página de perfil do usuário.

- [ ] Criar `src/routes/home.js` com rota `GET /`
- [ ] Criar `src/controllers/homeController.js`:
  - Busca próximos 5 jogos
  - Busca jogos ao vivo (se houver)
  - Busca 3 notícias mais recentes
- [ ] Criar `views/pages/home.ejs` com seções: jogos ao vivo, próximos jogos, destaques de notícias
- [ ] Criar `src/routes/perfil.js` com rota `GET /perfil` (protegida)
- [ ] Criar `views/pages/perfil.ejs` — dados do usuário, total de pontos, posição no ranking, últimos palpites
- [ ] Testar: home carrega sem erros, perfil exibe dados corretos do usuário logado

---

## Fase 7 — Identidade Visual e Responsividade

**Objetivo:** site com visual tema FIFA 2026 e funcionando em mobile.

- [ ] Criar `public/css/variables.css` com as variáveis de cor e tipografia do spec
- [ ] Criar `public/css/base.css` — reset CSS, tipografia (`Bebas Neue` + `Inter` via Google Fonts), estilos globais
- [ ] Criar `public/css/components.css` — cards de jogo, tabelas de grupos, formulário de palpite, ranking, feed de notícias
- [ ] Criar `public/css/layout.css` — grid principal, navbar, footer, breakpoints (mobile < 768px, tablet 768–1024px, desktop > 1024px)
- [ ] Criar `public/css/responsive.css` — ajustes mobile: navbar hamburguer, tabelas como cards empilhados
- [ ] Criar `views/partials/header.ejs` — navbar com links e estado de login/logout
- [ ] Criar `views/partials/footer.ejs`
- [ ] Criar `public/js/navbar.js` — hamburguer menu em JS vanilla
- [ ] Criar `public/js/palpites.js` — envio de palpite via fetch sem recarregar a página
- [ ] Aplicar estilos em todas as views EJS das fases anteriores
- [ ] Testar em mobile (375px), tablet (768px) e desktop (1280px)

---

## Ordem de Implementação Recomendada

```
Fase 1 (Setup)
    ↓
Fase 2 (Auth)
    ↓
Fase 3 (API Futebol)
    ↓
Fase 4 (RSS Notícias)   ←── pode ser feita em paralelo com Fase 3
    ↓
Fase 5 (Bolão)
    ↓
Fase 6 (Home + Perfil)
    ↓
Fase 7 (Visual)
```

---

## Dependências npm

```json
{
  "dependencies": {
    "bcrypt": "^5.x",
    "better-sqlite3": "^9.x",
    "dotenv": "^16.x",
    "ejs": "^3.x",
    "express": "^4.x",
    "express-rate-limit": "^7.x",
    "express-session": "^1.x",
    "node-fetch": "^3.x",
    "rss-parser": "^3.x"
  }
}
```

---

## Variáveis de Ambiente (.env)

```
PORT=3000
SESSION_SECRET=chave_secreta_longa_aqui
API_FOOTBALL_KEY=sua_chave_api_football_aqui
```
