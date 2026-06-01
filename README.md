# Copa do Mundo 2026 — Site Oficial do Bolão

🚀 **Demo ao vivo:** https://site-copa-2026-production.up.railway.app

Site completo da Copa do Mundo 2026 com calendário de jogos, grupos, seleções, notícias e bolão interativo com palpites e ranking.

## Tecnologias

- **Backend:** Node.js + Express 5 (SSR)
- **Template Engine:** EJS
- **Banco de dados:** SQLite (better-sqlite3)
- **Autenticação:** express-session + bcrypt
- **Dados de jogos:** TheSportsDB API (gratuita) + dataset estático (104 jogos)
- **Notícias:** RSS feeds (GE Globo, ESPN Brasil, UOL Esporte)

## Funcionalidades

| Página | Descrição |
|--------|-----------|
| `/` | Home com contagem regressiva, próximos jogos e notícias |
| `/jogos` | Calendário completo dos 104 jogos com filtro por fase |
| `/grupos` | Tabela dos 12 grupos (A–L) com 48 seleções |
| `/selecoes` | Perfil rico de cada seleção (estilo, convocados, conquistas) |
| `/noticias` | Notícias em tempo real via RSS, priorizando Copa 2026 |
| `/ranking` | Ranking do bolão com medalhas para o top 3 |
| `/meus-palpites` | Fazer, editar e acompanhar palpites (antes do início do jogo) |
| `/admin` | Registrar o campeão da Copa e premiar o bônus (somente `ADMIN_EMAIL`) |

## Sistema de Pontuação do Bolão

- **5 pontos** — Placar exato (ex: palpitou 2×1, resultado foi 2×1)
- **3 pontos** — Resultado correto (ex: palpitou 3×1, resultado foi 2×0 — ambos vitória)
- **0 pontos** — Resultado errado, ou sem palpite registrado antes do jogo
- **+15 pontos** — Bônus por acertar o campeão da Copa
- **Prazo:** palpites até o início de cada jogo; só valem os 90' + acréscimos (sem prorrogação/pênaltis)
- **Desempate:** maior pontuação → mais placares exatos (5 pts) → mais resultados certos (3 pts)

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores

# Iniciar em desenvolvimento (auto-reload)
npm run dev

# Iniciar em produção
npm start
```

O servidor iniciará em `http://localhost:3000` por padrão.

## Estrutura do Projeto

```
site_copa/
├── server.js               # Entry point — inicializa Express, DB e rotas
├── database/
│   └── init.js             # Schema SQLite (tabelas de usuários, palpites, cache)
├── src/
│   ├── controllers/        # Lógica de cada página
│   ├── middleware/         # Autenticação (requireAuth)
│   ├── routes/             # Definição das rotas Express
│   └── services/           # Integração com APIs e dados estáticos
├── public/                 # Assets estáticos servidos diretamente
│   ├── css/                # 6 arquivos CSS modulares (variables, base, components…)
│   └── js/                 # Scripts de interatividade (navbar, palpites, animações)
├── views/                  # Templates EJS
│   ├── pages/              # Uma view por página
│   └── partials/           # header.ejs e footer.ejs compartilhados
└── docs/                   # Documentação do projeto
    ├── prd.md              # Product Requirements Document
    └── specs/              # Specs técnicos de design e implementação
```

## Variáveis de Ambiente

Veja [.env.example](.env.example) para a lista completa de variáveis necessárias.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `SESSION_SECRET` | Sim (produção) | String longa e aleatória para assinar as sessões |
| `ADMIN_EMAIL` | Para usar `/admin` | E-mail do usuário com acesso ao painel de administração |
| `DB_PATH` | Em deploy | Caminho do SQLite. Em produção, aponte para um volume persistente |
| `PORT` | Não | Porta HTTP (padrão 3000; em deploy a plataforma define) |

## Deploy (Railway)

O deploy é automático a cada push na `main` (build via Nixpacks, `npm start`).

> ⚠️ **Banco persistente — obrigatório.** O SQLite grava em arquivo. Sem um volume
> persistente, o banco é apagado a cada novo deploy (usuários, palpites e ranking se perdem).

**Passo a passo:**

1. No serviço do Railway, vá em **Settings → Volumes → New Volume**
2. Defina o **Mount path** como `/data`
3. Em **Variables**, adicione:
   - `DB_PATH=/data/db.sqlite` (faz o SQLite viver dentro do volume)
   - `SESSION_SECRET=<string longa e aleatória>`
   - `ADMIN_EMAIL=<e-mail do administrador>`
4. Salve e deixe o Railway **redeployar**

O diretório do volume é criado automaticamente pelo app (`database/init.js`), então não há
passo manual de migração — as tabelas são criadas no primeiro start.

## Dados da Copa

Os 104 jogos são armazenados estaticamente em `src/services/jogosEstaticos.js` (fonte: FIFA).
Placares e status em tempo real são buscados da [TheSportsDB](https://www.thesportsdb.com/) (API gratuita, sem chave).

Dados ricos das 48 seleções (treinador, prováveis convocados, estilo, conquistas) estão em `src/services/selecoesData.js`.
