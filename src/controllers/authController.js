const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

// Senha temporária amigável de ditar: "copa" + 4 dígitos + 2 letras (sem caracteres ambíguos)
function gerarSenhaTemporaria() {
  const digitos = String(crypto.randomInt(1000, 10000));
  const letras = 'abcdefghijkmnpqrstuvwxyz';
  let suf = '';
  for (let i = 0; i < 2; i++) suf += letras[crypto.randomInt(0, letras.length)];
  return `copa${digitos}${suf}`;
}

// Reset feito pelo admin: define uma senha temporária e a devolve em texto puro
// (uma única vez) para o admin repassar ao participante.
async function resetarSenhaUsuario(db, usuarioId) {
  const usuario = db.prepare('SELECT id, nome FROM usuarios WHERE id = ?').get(usuarioId);
  if (!usuario) return null;
  const senhaTemp = gerarSenhaTemporaria();
  const hash = await bcrypt.hash(senhaTemp, SALT_ROUNDS);
  db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(hash, usuarioId);
  return { nome: usuario.nome, senha: senhaTemp };
}

// Troca de senha pelo próprio usuário (precisa informar a senha atual)
async function trocarSenha(req, res) {
  const db = req.app.locals.db;
  const id = req.session.usuario.id;
  const { senha_atual, senha_nova } = req.body;

  if (!senha_atual || !senha_nova || senha_nova.length < 6) {
    return res.redirect('/perfil?msg=senha_invalida#senha');
  }

  const usuario = db.prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(id);
  const ok = usuario && await bcrypt.compare(senha_atual, usuario.senha_hash);
  if (!ok) return res.redirect('/perfil?msg=senha_atual_errada#senha');

  const hash = await bcrypt.hash(senha_nova, SALT_ROUNDS);
  db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(hash, id);
  res.redirect('/perfil?msg=senha_ok#senha');
}

async function cadastro(req, res) {
  const { nome, senha } = req.body;
  const email = (req.body.email || '').trim().toLowerCase();
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
  const { senha } = req.body;
  const email = (req.body.email || '').trim().toLowerCase();
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

module.exports = { cadastro, login, trocarSenha, resetarSenhaUsuario };
