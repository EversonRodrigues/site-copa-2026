require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDb } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa banco de dados
const db = initDb();
app.locals.db = db;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
}));

// Disponibiliza usuário logado em todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rotas
app.use('/', require('./src/routes/home'));
app.use('/', require('./src/routes/auth'));
app.use('/', require('./src/routes/jogos'));
app.use('/', require('./src/routes/noticias'));
app.use('/', require('./src/routes/bolao'));
app.use('/', require('./src/routes/perfil'));

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', { titulo: 'Página não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
