const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

async function cadastro(req, res) {
  const { nome, email, senha } = req.body;
  const db = req.app.locals.db;

  if (!nome || !email || !senha || senha.length < 6) {
    return res.render('pages/cadastro', {
      titulo: 'Cadastro',
      erro: 'Preencha todos os campos. A senha deve ter no mínimo 6 caracteres.'
    });
  }

  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) {
    return res.render('pages/cadastro', {
      titulo: 'Cadastro',
      erro: 'Este e-mail já está cadastrado.'
    });
  }

  const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
  const result = db.prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)').run(nome, email, senha_hash);

  db.prepare('INSERT INTO pontuacao (usuario_id, total_pontos) VALUES (?, 0)').run(result.lastInsertRowid);

  req.session.usuario = { id: result.lastInsertRowid, nome, email };
  res.redirect('/');
}

async function login(req, res) {
  const { email, senha } = req.body;
  const db = req.app.locals.db;

  if (!email || !senha) {
    return res.render('pages/login', { titulo: 'Login', erro: 'Preencha e-mail e senha.' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!usuario) {
    return res.render('pages/login', { titulo: 'Login', erro: 'E-mail ou senha incorretos.' });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaCorreta) {
    return res.render('pages/login', { titulo: 'Login', erro: 'E-mail ou senha incorretos.' });
  }

  req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  res.redirect('/');
}

module.exports = { cadastro, login };
