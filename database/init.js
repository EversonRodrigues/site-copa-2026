const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db.sqlite');

function initDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS palpites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      jogo_id TEXT NOT NULL,
      gols_casa INTEGER NOT NULL,
      gols_fora INTEGER NOT NULL,
      pontos INTEGER DEFAULT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      UNIQUE (usuario_id, jogo_id)
    );

    CREATE TABLE IF NOT EXISTS pontuacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL UNIQUE,
      total_pontos INTEGER DEFAULT 0,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS noticias_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      fonte TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      publicado_em DATETIME,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS jogos_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jogo_id_api TEXT NOT NULL UNIQUE,
      dados_json TEXT NOT NULL,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS palpite_campeao (
      usuario_id INTEGER PRIMARY KEY,
      selecao TEXT NOT NULL,
      pontos INTEGER DEFAULT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS config (
      chave TEXT PRIMARY KEY,
      valor TEXT,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mata_mata (
      jogo_id TEXT PRIMARY KEY,
      time_casa TEXT NOT NULL,
      time_fora TEXT NOT NULL,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Limpeza única: versões antigas geravam IDs instáveis e o jogos_cache
  // acumulou linhas de jogo duplicadas. Zera essas linhas uma vez (o cache
  // se repopula sozinho na próxima visita, já com IDs estáveis).
  const flag = db.prepare("SELECT valor FROM config WHERE chave = 'cache_ids_v2'").get();
  if (!flag) {
    db.prepare(`
      DELETE FROM jogos_cache
      WHERE jogo_id_api NOT IN ('jogos_todos', 'grupos', 'selecoes')
        AND jogo_id_api NOT LIKE 'jogos_fase_%'
        AND jogo_id_api NOT LIKE 'selecao_%'
    `).run();
    db.prepare("INSERT INTO config (chave, valor) VALUES ('cache_ids_v2', '1') ON CONFLICT(chave) DO NOTHING").run();
  }

  // Migração: taxa de inscrição do bolão (depósito confirmado libera os palpites)
  const colunas = db.prepare('PRAGMA table_info(usuarios)').all();
  if (!colunas.some(c => c.name === 'pago')) {
    db.exec('ALTER TABLE usuarios ADD COLUMN pago INTEGER NOT NULL DEFAULT 0');
  }
  if (!colunas.some(c => c.name === 'pago_em')) {
    db.exec('ALTER TABLE usuarios ADD COLUMN pago_em DATETIME');
  }

  return db;
}

module.exports = { initDb, DB_PATH };
