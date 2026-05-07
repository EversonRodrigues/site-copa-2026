const { fetchJogos } = require('../services/footballApi');
const { fetchNoticias } = require('../services/rssService');

async function home(req, res) {
  let proximosJogos = [];
  let jogosAoVivo = [];
  let noticias = [];
  let topRanking = [];

  try {
    const todos = await fetchJogos();
    const agora = new Date();

    jogosAoVivo = todos.filter(j => j.status === 'ao_vivo');
    proximosJogos = todos
      .filter(j => j.status === 'em_breve' && new Date(j.inicio) > agora)
      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
      .slice(0, 6);
  } catch (err) {
    console.error('Erro ao buscar jogos para home:', err.message);
  }

  try {
    noticias = (await fetchNoticias()).slice(0, 4);
  } catch (err) {
    console.error('Erro ao buscar notícias para home:', err.message);
  }

  try {
    topRanking = req.app.locals.db.prepare(`
      SELECT u.nome, p.total_pontos
      FROM pontuacao p
      JOIN usuarios u ON u.id = p.usuario_id
      ORDER BY p.total_pontos DESC
      LIMIT 5
    `).all();
  } catch (err) {
    console.error('Erro ao buscar ranking para home:', err.message);
  }

  res.render('pages/home', {
    titulo: 'Copa do Mundo 2026',
    jogosAoVivo,
    proximosJogos,
    noticias,
    topRanking
  });
}

module.exports = { home };
