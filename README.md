# Copa do Mundo 2026 — Site Oficial do Bolão

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
| `/meus-palpites` | Fazer, editar e acompanhar palpites (até 1h antes do jogo) |

## Sistema de Pontuação do Bolão

- **5 pontos** — Placar exato (ex: palpitou 2×1, resultado foi 2×1)
- **2 pontos** — Resultado correto (ex: palpitou 2×1, resultado foi 3×0 — ambos vitória)
- **0 pontos** — Resultado errado

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

## Dados da Copa

Os 104 jogos são armazenados estaticamente em `src/services/jogosEstaticos.js` (fonte: FIFA).
Placares e status em tempo real são buscados da [TheSportsDB](https://www.thesportsdb.com/) (API gratuita, sem chave).

Dados ricos das 48 seleções (treinador, prováveis convocados, estilo, conquistas) estão em `src/services/selecoesData.js`.
