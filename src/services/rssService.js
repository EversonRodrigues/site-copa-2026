const Parser = require('rss-parser');
const Database = require('better-sqlite3');
const path = require('path');

// Respeita DB_PATH (volume persistente em produção); cai no caminho local em dev.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/db.sqlite');
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos
const MAX_POR_FONTE = 20;

const FEEDS = [
  { nome: 'GE — Copa do Mundo', url: 'https://ge.globo.com/rss/ge/copa-do-mundo/' },
  { nome: 'GE — Futebol', url: 'https://ge.globo.com/rss/ge/futebol/' },
  { nome: 'Trivela', url: 'https://trivela.com.br/feed/' },
  { nome: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' },
];

// Palavras-chave para filtrar notícias relacionadas à Copa / seleções
const PALAVRAS_COPA = [
  'copa do mundo', 'world cup', '2026', 'copa 2026',
  'seleção brasileira', 'seleção', 'eliminatórias',
  'fifa', 'copa', 'mundial',
  'brasil', 'argentina', 'frança', 'espanha', 'alemanha', 'portugal',
  'inglater', 'uruguai', 'colombia', 'holanda',
  'convoca', 'convocad', 'amistoso', 'seleções', 'grupo da morte',
];

function relevanteCopa(titulo) {
  const t = (titulo || '').toLowerCase();
  return PALAVRAS_COPA.some(p => t.includes(p));
}

// User-Agent de navegador: vários feeds bloqueiam requisições sem isso (403/406).
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

function getDb() {
  return new Database(DB_PATH);
}

function cacheValido(atualizado_em) {
  return new Date() - new Date(atualizado_em) < CACHE_TTL_MS;
}

async function fetchNoticias() {
  const db = getDb();

  const recente = db.prepare('SELECT atualizado_em FROM noticias_cache ORDER BY atualizado_em DESC LIMIT 1').get();
  if (recente && cacheValido(recente.atualizado_em)) {
    return db.prepare('SELECT * FROM noticias_cache ORDER BY publicado_em DESC LIMIT 60').all()
      .map(formatarNoticia);
  }

  const resultados = await Promise.allSettled(
    FEEDS.map(feed => buscarFeed(feed.nome, feed.url))
  );

  const upsert = db.prepare(`
    INSERT INTO noticias_cache (titulo, fonte, url, publicado_em, atualizado_em)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(url) DO UPDATE SET titulo = excluded.titulo, atualizado_em = excluded.atualizado_em
  `);

  for (const resultado of resultados) {
    if (resultado.status === 'fulfilled') {
      resultado.value.forEach(item => {
        try {
          upsert.run(item.titulo, item.fonte, item.url, item.publicado_em);
        } catch {
          // ignora duplicatas
        }
      });
    }
  }

  return db.prepare('SELECT * FROM noticias_cache ORDER BY publicado_em DESC LIMIT 60').all()
    .map(formatarNoticia);
}

async function buscarFeed(nome, url) {
  const feed = await parser.parseURL(url);
  const itens = (feed.items || []).slice(0, MAX_POR_FONTE).map(item => ({
    titulo: item.title || '',
    fonte: nome,
    url: item.link || item.guid || '',
    publicado_em: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
  }));

  // Prioriza notícias Copa, mas inclui todas
  const copa = itens.filter(i => relevanteCopa(i.titulo));
  const outras = itens.filter(i => !relevanteCopa(i.titulo));
  return [...copa, ...outras];
}

function formatarNoticia(n) {
  const data = new Date(n.publicado_em);
  return {
    ...n,
    ehCopa: relevanteCopa(n.titulo),
    data: isNaN(data) ? '' : data.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  };
}

module.exports = { fetchNoticias };
