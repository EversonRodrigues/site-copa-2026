const { fetchJogos, fetchGrupos, fetchSelecoes, fetchSelecao } = require('../services/footballApi');

async function listarJogos(req, res) {
  const { fase } = req.query;
  try {
    const jogos = await fetchJogos(fase || null);
    res.render('pages/jogos', { titulo: 'Jogos', jogos, faseSelecionada: fase || '' });
  } catch (err) {
    console.error('Erro ao buscar jogos:', err.message);
    res.render('pages/jogos', { titulo: 'Jogos', jogos: [], faseSelecionada: '' });
  }
}

async function listarGrupos(req, res) {
  try {
    const grupos = await fetchGrupos();
    res.render('pages/grupos', { titulo: 'Grupos', grupos });
  } catch (err) {
    console.error('Erro ao buscar grupos:', err.message);
    res.render('pages/grupos', { titulo: 'Grupos', grupos: [] });
  }
}

async function listarSelecoes(req, res) {
  try {
    const selecoes = await fetchSelecoes();
    res.render('pages/selecoes', { titulo: 'Seleções', selecoes });
  } catch (err) {
    console.error('Erro ao buscar seleções:', err.message);
    res.render('pages/selecoes', { titulo: 'Seleções', selecoes: [] });
  }
}

async function detalheSelecao(req, res) {
  try {
    const selecao = await fetchSelecao(req.params.id);
    res.render('pages/selecao', { titulo: selecao.nome || 'Seleção', selecao });
  } catch (err) {
    console.error('Erro ao buscar seleção:', err.message);
    res.redirect('/selecoes');
  }
}

module.exports = { listarJogos, listarGrupos, listarSelecoes, detalheSelecao };
