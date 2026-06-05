const { fetchJogos } = require('../services/footballApi');
const { fetchNoticias } = require('../services/rssService');
const { getTodosJogosEstaticos } = require('../services/jogosEstaticos');

// Jogo de abertura (primeiro do calendário) — alimenta a contagem regressiva
// da home a partir do próprio calendário, sem horário fixo que possa desalinhar.
function getAbertura() {
  const primeiro = getTodosJogosEstaticos()
    .filter(j => j.inicio)
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))[0];
  if (!primeiro) return null;
  const dataBR = new Date(primeiro.inicio)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })
    .replace(/\//g, '.');
  return {
    iso: primeiro.inicio,
    label: `${dataBR} · ${primeiro.timeCasa.toUpperCase()} × ${primeiro.timeFora.toUpperCase()}`,
  };
}

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
    topRanking,
    abertura: getAbertura()
  });
}

module.exports = { home };
