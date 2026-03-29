const Parser = require('rss-parser');
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/db.sqlite');
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos
const MAX_POR_FONTE = 20;

const FEEDS = [
  { nome: 'ge.globo.com', url: 'https://ge.globo.com/rss/feeds/futebol.xml' },
  { nome: 'ESPN Brasil', url: 'https://www.espn.com.br/rss/futebol/noticias' },
  { nome: 'UOL Esporte', url: 'https://esporte.uol.com.br/rss.xml' },
];

// Palavras-chave para filtrar notícias relacionadas à Copa / seleções
const PALAVRAS_COPA = [
  'copa do mundo', 'world cup', '2026', 'copa 2026',
  'seleção brasileira', 'seleção', 'eliminatórias',
  'fifa', 'copa', 'mundial',
  'brasil', 'argentina', 'frança', 'espanha', 'alemanha', 'portugal',
  'inglater', 'uruguai', 'colombia', 'holanda',
];

function relevanteCopa(titulo) {
  const t = (titulo || '').toLowerCase();
  return PALAVRAS_COPA.some(p => t.includes(p));
}

const parser = new Parser({ timeout: 8000 });

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
