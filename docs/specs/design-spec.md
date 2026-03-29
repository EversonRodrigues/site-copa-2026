# Site Copa do Mundo 2026 — Design Spec

**Data:** 2026-03-29
**Status:** Aprovado

---

## Visão Geral

Site público para a Copa do Mundo de 2026 com funcionalidades informativas (jogos, grupos, seleções, notícias) e interativas (bolão com palpites, ranking de pontuação, cadastro de usuários). Desenvolvido em HTML, CSS e JS vanilla com backend Node.js + Express e banco de dados SQLite.

---

## Arquitetura

### Abordagem: Hybrid SSR + JS Dinâmico

O servidor Node.js + Express renderiza as páginas completas via EJS (Server-Side Rendering). O JS vanilla no cliente é responsável apenas pelas partes que exigem dinamismo real: envio de palpites, atualização de ranking e placares ao vivo.

```
┌─────────────────────────────────────────────┐
│             NAVEGADOR (Cliente)             │
│  HTML/CSS/JS vanilla — EJS renderizado      │
│  JS dinâmico para: palpites, ranking ao vivo│
└───────────────────┬─────────────────────────┘
                    │ HTTP
┌───────────────────▼─────────────────────────┐
│         SERVIDOR — Node.js + Express        │
│  Rotas SSR (EJS) + API REST (/api/*)        │
│  Autenticação via sessão (express-session)  │
│  Cache de jogos (atualiza a cada 5 min)     │
└──────────┬──────────────────┬───────────────┘
           │                  │
┌──────────▼───────┐  ┌───────▼──────────────┐
│   SQLite (dados  │  │  API Externa de       │
│   do app)        │  │  Futebol (jogos,      │
│   usuários,      │  │  resultados,          │
│   palpites,      │  │  times, grupos)       │
│   pontuação      │  └──────────────────────┘
└──────────────────┘
```

**Fontes de dados externas:**
- **API de futebol:** API-Football (api-football.com) — jogos, resultados, grupos, seleções. Plano gratuito cobre 100 requisições/dia; cache local atualizado a cada 5 minutos reduz o consumo.
- **RSS de notícias:** ge.globo.com e ESPN Brasil — agregado automaticamente pelo servidor, cache atualizado a cada 30 minutos, armazenado em SQLite.

---

## Páginas e Funcionalidades

### Páginas Públicas (sem login)

| Página | Descrição | Fonte de dados |
|---|---|---|
| **Home** | Próximos jogos, jogos ao vivo, destaques | API futebol + RSS |
| **Jogos** | Listagem completa com filtro por fase e data | API futebol |
| **Grupos** | Tabela de classificação dos 8 grupos | API futebol |
| **Seleções** | Página por seleção com elenco e estatísticas | API futebol |
| **Notícias** | Feed RSS agregado (título, fonte, data, link) | RSS |
| **Ranking do Bolão** | Pontuação pública de todos os participantes | SQLite |

### Páginas Autenticadas (com login)

| Página | Descrição |
|---|---|
| **Meus Palpites** | Formulário de palpite + histórico de palpites anteriores |
| **Meu Perfil** | Dados do usuário, pontuação total, posição no ranking |
| **Cadastro / Login** | Formulário com email + senha |

### Regras do Bolão

- Placar exato → **5 pontos**
- Acertou apenas o vencedor ou empate → **2 pontos**
- Prazo para palpitar: até **1 hora antes** do início do jogo (validado no servidor)
- Ranking atualizado automaticamente após cada resultado confirmado via API

---

## Estrutura Técnica

### Stack

- **Frontend:** HTML5, CSS3, JavaScript vanilla (sem framework)
- **Backend:** Node.js + Express.js
- **Banco de dados:** SQLite (via `better-sqlite3`)
- **Template engine:** EJS
- **Autenticação:** `express-session` + `bcrypt`
- **Segurança:** `express-rate-limit`, cookies HTTPOnly
- **RSS parser:** `rss-parser` (npm)

### Estrutura de Pastas

```
site_copa/
├── server.js              # Entry point
├── package.json
├── .env                   # Chaves de API (gitignore)
├── database/
│   └── db.sqlite
├── src/
│   ├── routes/            # Express routes (jogos, bolão, auth, noticias)
│   ├── controllers/       # Lógica de negócio
│   ├── services/          # Integração API futebol + RSS parser
│   └── middleware/        # Auth, session check
├── views/                 # Templates EJS
│   ├── partials/          # header, footer, navbar
│   └── pages/             # home, jogos, grupos, palpites, etc.
└── public/                # Arquivos estáticos
    ├── css/
    ├── js/
    └── img/
```

### Banco de Dados — Tabelas SQLite

| Tabela | Campos principais |
|---|---|
| `usuarios` | id, nome, email, senha_hash, criado_em |
| `palpites` | id, usuario_id, jogo_id, gols_casa, gols_fora, pontos, criado_em |
| `pontuacao` | id, usuario_id, total_pontos, atualizado_em |
| `noticias_cache` | id, titulo, fonte, url, publicado_em, atualizado_em |
| `jogos_cache` | id, jogo_id_api, dados_json, atualizado_em |

### Segurança

- Senhas armazenadas com hash `bcrypt`
- Sessões com `express-session` + cookie HTTPOnly
- Palpites só aceitos até 1h antes do jogo — validação obrigatória no servidor
- Rate limiting nas rotas de autenticação (`express-rate-limit`)
- Chaves de API armazenadas em `.env` (nunca no repositório)

---

## Identidade Visual

### Paleta de Cores — Tema FIFA 2026

| Elemento | Cor | Hex |
|---|---|---|
| Fundo principal | Azul escuro | `#0A1628` |
| Destaque primário | Vermelho FIFA | `#C8102E` |
| Destaque secundário | Branco | `#FFFFFF` |
| Cards / painéis | Azul médio | `#122040` |
| Texto principal | Branco | `#FFFFFF` |
| Texto secundário | Azul acinzentado | `#8FA3C0` |
| Borda / divisor | Azul escuro médio | `#1E3A5F` |

### Tipografia

- **Títulos:** `Bebas Neue` (Google Fonts — estilo esportivo, impacto visual)
- **Corpo:** `Inter` (legibilidade, moderna, suporte completo a acentos)

### Responsividade

- Abordagem **mobile-first** com CSS Grid e Flexbox puro (sem framework CSS)
- Navbar colapsável em mobile (hamburguer menu em JS vanilla)
- Tabelas de grupos viram cards empilhados em telas menores
- Breakpoints:
  - Mobile: `< 768px`
  - Tablet: `768px – 1024px`
  - Desktop: `> 1024px`

### Componentes Visuais Principais

- Cards de jogo com placar, times (casa vs visitante), horário e status (ao vivo / encerrado / em breve)
- Tabela de grupos com bandeiras dos países
- Formulário de palpite inline nos cards de jogo
- Ranking com medalhas para top 3 (ouro, prata, bronze)
- Feed de notícias em lista com fonte, data e link externo

---

## Público-Alvo e Escala

- Site **aberto ao público** — qualquer pessoa pode se cadastrar
- Escala média a alta: arquitetura preparada para crescimento
- Cache agressivo das APIs externas para reduzir latência e limites de requisição
