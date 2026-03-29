const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/db.sqlite');
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';
const COPA_2026_ID = 1; // ID da Copa do Mundo 2026 na API-Football
const TEMPORADA = 2026;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function getDb() {
  return new Database(DB_PATH);
}

async function fetchApi(endpoint) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': API_KEY
    }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function cacheValido(atualizado_em) {
  return new Date() - new Date(atualizado_em) < CACHE_TTL_MS;
}

async function fetchJogos(fase = null) {
  const db = getDb();
  const chave = fase ? `jogos_fase_${fase}` : 'jogos_todos';
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get(chave);

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  let endpoint = `/fixtures?league=${COPA_2026_ID}&season=${TEMPORADA}`;
  if (fase) endpoint += `&round=${encodeURIComponent(fase)}`;

  const data = await fetchApi(endpoint);
  const jogos = (data.response || []).map(mapJogo);

  // Salva cada jogo individualmente no cache também
  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);
  jogos.forEach(j => upsert.run(String(j.id), JSON.stringify(j)));

  // Cache da listagem completa
  upsert.run(chave, JSON.stringify(jogos));

  return jogos;
}

async function fetchGrupos() {
  const db = getDb();
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get('grupos');

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  const data = await fetchApi(`/standings?league=${COPA_2026_ID}&season=${TEMPORADA}`);
  const standings = data.response?.[0]?.league?.standings || [];

  const grupos = standings.map(grupo => ({
    nome: grupo[0]?.group?.replace('Group ', '') || '?',
    times: grupo.map(t => ({
      id: t.team.id,
      nome: t.team.name,
      bandeira: t.team.logo,
      jogos: t.all.played,
      vitorias: t.all.win,
      empates: t.all.draw,
      derrotas: t.all.lose,
      pontos: t.points
    }))
  }));

  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES ('grupos', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);
  upsert.run(JSON.stringify(grupos));

  return grupos;
}

async function fetchSelecoes() {
  const db = getDb();
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get('selecoes');

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  const data = await fetchApi(`/teams?league=${COPA_2026_ID}&season=${TEMPORADA}`);
  const selecoes = (data.response || []).map(r => ({
    id: r.team.id,
    nome: r.team.name,
    bandeira: r.team.logo
  }));

  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES ('selecoes', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);
  upsert.run(JSON.stringify(selecoes));

  return selecoes;
}

async function fetchSelecao(id) {
  const db = getDb();
  const chave = `selecao_${id}`;
  const cached = db.prepare('SELECT dados_json, atualizado_em FROM jogos_cache WHERE jogo_id_api = ?').get(chave);

  if (cached && cacheValido(cached.atualizado_em)) {
    return JSON.parse(cached.dados_json);
  }

  const [teamData, statsData] = await Promise.all([
    fetchApi(`/teams?id=${id}`),
    fetchApi(`/teams/statistics?league=${COPA_2026_ID}&season=${TEMPORADA}&team=${id}`)
  ]);

  const team = teamData.response?.[0]?.team;
  const stats = statsData.response;

  const selecao = {
    id: team?.id,
    nome: team?.name,
    bandeira: team?.logo,
    jogos: stats?.fixtures?.played?.total || 0,
    vitorias: stats?.fixtures?.wins?.total || 0,
    empates: stats?.fixtures?.draws?.total || 0,
    derrotas: stats?.fixtures?.loses?.total || 0,
    gols_marcados: stats?.goals?.for?.total?.total || 0,
    gols_sofridos: stats?.goals?.against?.total?.total || 0
  };

  const upsert = db.prepare(`
    INSERT INTO jogos_cache (jogo_id_api, dados_json, atualizado_em)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id_api) DO UPDATE SET dados_json = excluded.dados_json, atualizado_em = excluded.atualizado_em
  `);
  upsert.run(chave, JSON.stringify(selecao));

  return selecao;
}

function mapJogo(fixture) {
  const status = fixture.fixture.status.short;
  let statusLabel = 'Em breve';
  let statusKey = 'em_breve';

  if (['1H', '2H', 'ET', 'P'].includes(status)) {
    statusKey = 'ao_vivo';
    statusLabel = 'Ao Vivo';
  } else if (['FT', 'AET', 'PEN'].includes(status)) {
    statusKey = 'encerrado';
    statusLabel = 'Encerrado';
  }

  const data = new Date(fixture.fixture.date);
  const dataFormatada = data.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });

  return {
    id: String(fixture.fixture.id),
    timeCasa: fixture.teams.home.name,
    timeFora: fixture.teams.away.name,
    bandeirasCasa: fixture.teams.home.logo,
    bandeiraFora: fixture.teams.away.logo,
    gols_casa: fixture.goals.home,
    gols_fora: fixture.goals.away,
    placar: fixture.goals.home !== null ? `${fixture.goals.home} - ${fixture.goals.away}` : '-',
    status: statusKey,
    statusLabel,
    data: dataFormatada,
    inicio: fixture.fixture.date,
    fase: fixture.league.round,
    // campos internos para lookups
    teams: fixture.teams,
    fixture: { date: fixture.fixture.date }
  };
}

module.exports = { fetchJogos, fetchGrupos, fetchSelecoes, fetchSelecao };
