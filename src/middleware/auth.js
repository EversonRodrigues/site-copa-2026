function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// Admin = usuário logado cujo e-mail bate com ADMIN_EMAIL (.env)
function requireAdmin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const email = (req.session.usuario.email || '').trim().toLowerCase();
  if (!adminEmail || email !== adminEmail) {
    return res.status(403).render('pages/404', { titulo: 'Acesso negado' });
  }
  next();
}

// Só libera o envio de palpites depois que o admin confirma o depósito (taxa de R$10).
// Usado nas rotas de API (responde JSON).
function requirePago(req, res, next) {
  const db = req.app.locals.db;
  const u = db.prepare('SELECT pago FROM usuarios WHERE id = ?').get(req.session.usuario.id);
  if (!u || !u.pago) {
    return res.status(403).json({
      erro: 'Deposite a taxa de R$10 e aguarde a confirmação para liberar seus palpites.'
    });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, requirePago };
