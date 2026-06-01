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

module.exports = { requireAuth, requireAdmin };
