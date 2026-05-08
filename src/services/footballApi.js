const Database = require('better-sqlite3');
const { DB_PATH } = require('../../database/init');
const { getTodosJogosEstaticos, getGruposEstaticos } = require('./jogosEstaticos');

// TheSportsDB — gratuita, sem chave de API
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const COPA_ID = '4429'; // FIFA World Cup na TheSportsDB
const TEMPORADA = '2026';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function getDb() {
  return new Database(DB_PATH);
}

async function fetchApi(endpoint) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function cacheValido(atualizado_em) {
  return new Date() - new Date(atualizado_em) < CACHE_TTL_MS;
}

async function fetchJogos() {
  const db = getDb();
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get('jogos_todos');

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  // Base: todos os jogos do calendário estático (104 jogos)
  const jogosEstaticos = getTodosJogosEstaticos();

  // Sobrescreve com dados reais da TheSportsDB (placares, status ao vivo)
  let jogosReais = [];
  try {
    const data = await fetchApi(`/eventsseason.php?id=${COPA_ID}&s=${TEMPORADA}`);
    jogosReais = (data.events || []).map(mapJogo);
  } catch (err) {
    console.warn('TheSportsDB indisponível, usando dados estáticos:', err.message);
  }

  // Mescla: para cada jogo real, tenta encontrar correspondente estático pelo nome dos times
  const mapaEstatico = {};
  jogosEstaticos.forEach(j => {
    const chave = `${normalizar(j.timeCasa)}_${normalizar(j.timeFora)}`;
    mapaEstatico[chave] = j;
  });

  jogosReais.forEach(real => {
    const chave = `${normalizar(real.timeCasa)}_${normalizar(real.timeFora)}`;
    if (mapaEstatico[chave]) {
      // Atualiza placar e status do estático com dados reais
      Object.assign(mapaEstatico[chave], {
        gols_casa: real.gols_casa,
        gols_fora: real.gols_fora,
        placar: real.placar,
        status: real.status,
        statusLabel: real.statusLabel,
        bandeirasCasa: real.bandeirasCasa || mapaEstatico[chave].bandeirasCasa,
        bandeiraFora: real.bandeiraFora || mapaEstatico[chave].bandeiraFora,
      });
    }
  });

  const jogos = jogosEstaticos.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);

  jogos.forEach(j => upsert.run(String(j.id), JSON.stringify(j)));
  upsert.run('jogos_todos', JSON.stringify(jogos));

  return jogos;
}

function normalizar(str) {
  return (str || '').toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function fetchGrupos() {
  const db = getDb();
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get('grupos');

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  // Usa sempre os dados estáticos — a TheSportsDB retorna dados de outras copas
  // Quando a copa iniciar e os placares aparecerem, os pontos serão calculados localmente
  const grupos = getGruposEstaticos();

  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES ('grupos', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);
  upsert.run(JSON.stringify(grupos));

  return grupos;
}

async function fetchSelecoes() {
  const { getTodasSelecoes } = require('./selecoesData');
  return getTodasSelecoes();
}

async function fetchSelecao(nome) {
  const { getSelecao } = require('./selecoesData');
  const decodedNome = decodeURIComponent(nome);
  const dados = getSelecao(decodedNome);
  if (!dados) throw new Error('Seleção não encontrada');
  return { nome: decodedNome, ...dados };
}

function mapJogo(e) {
  const status = (e.strStatus || '').toLowerCase();
  let statusKey = 'em_breve';
  let statusLabel = 'Em breve';

  if (status === 'match finished' || status === 'ft') {
    statusKey = 'encerrado'; statusLabel = 'Encerrado';
  } else if (status === 'in progress' || status === 'live') {
    statusKey = 'ao_vivo'; statusLabel = 'Ao Vivo';
  }

  const dataHora = e.dateEvent && e.strTime
    ? new Date(`${e.dateEvent}T${e.strTime}`)
    : e.dateEvent ? new Date(e.dateEvent) : null;

  const dataFormatada = dataHora && !isNaN(dataHora)
    ? dataHora.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      })
    : e.dateEvent || '';

  return {
    id: String(e.idEvent),
    timeCasa: e.strHomeTeam || '',
    timeFora: e.strAwayTeam || '',
    bandeirasCasa: e.strHomeTeamBadge || '',
    bandeiraFora: e.strAwayTeamBadge || '',
    gols_casa: e.intHomeScore !== null ? Number(e.intHomeScore) : null,
    gols_fora: e.intAwayScore !== null ? Number(e.intAwayScore) : null,
    placar: e.intHomeScore !== null ? `${e.intHomeScore} - ${e.intAwayScore}` : '-',
    status: statusKey,
    statusLabel,
    data: dataFormatada,
    inicio: dataHora ? dataHora.toISOString() : null,
    fase: e.strRound || e.intRound || '',
    // campos internos
    teams: { home: { name: e.strHomeTeam }, away: { name: e.strAwayTeam } },
    fixture: { date: dataHora ? dataHora.toISOString() : null }
  };
}

module.exports = { fetchJogos, fetchGrupos, fetchSelecoes, fetchSelecao };
