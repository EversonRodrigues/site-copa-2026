// Migração única: ajuste da grade ao SORTEIO/CALENDÁRIO OFICIAL (dez/2025).
//
// A grade antiga foi montada com um palpite de sorteio anterior. Ao corrigir os
// grupos para o sorteio real, os confrontos de vários "slots" (jogo_id) mudaram.
// Como o jogo_id é posicional, esta migração trata as apostas já registradas:
//
//   • TROCADOS  — o confronto daquele jogo_id passou a ter outros times.
//                 A aposta não faz mais sentido e é REMOVIDA (o apostador refaz).
//   • INVERTIDOS — a dupla é a mesma, mas mandante/visitante trocaram de lado.
//                 O placar apostado é INVERTIDO (gols_casa <-> gols_fora) para
//                 preservar a intenção original do apostador.
//   • IDÊNTICOS  — confronto inalterado: a aposta fica exatamente como estava.
//
// Também remove o palpite de campeão de seleções que saíram da Copa.
// Roda só uma vez (guardada por flag no config), no padrão das demais limpezas
// do init.js. NÃO apaga apostas de confrontos que continuam iguais.

const FLAG = 'migracao_grade_oficial_v1';

// Confrontos cujos times mudaram -> apostas removidas
const TROCADOS = [
  '9000000', '9000001', '9000002', '9000003', '9000004', '9000005',
  '9000006', '9000007', '9000008', '9000009', '9000010', '9000011',
  '9000014', '9000015', '9000019', '9000020', '9000021', '9000022',
  '9000031', '9000032', '9000033', '9000034', '9000035', '9000040',
  '9000041', '9000042', '9000043', '9000046', '9000047', '9000049',
  '9000050', '9000051', '9000052', '9000053', '9000054', '9000055',
  '9000056', '9000057', '9000058', '9000059', '9000060', '9000061',
  '9000062', '9000063', '9000064', '9000065', '9000066', '9000067',
  '9000068', '9000069', '9000070', '9000071',
];

// Mesma dupla, mando trocado -> inverte o placar apostado
const INVERTIDOS = ['9000016', '9000027', '9000028', '9000039', '9000044'];

// Seleções que não estão mais na Copa -> remove o palpite de campeão
const SELECOES_REMOVIDAS = [
  'Jamaica', 'Nigéria', 'Camarões', 'Honduras', 'Venezuela', 'Sérvia', 'El Salvador',
];

function aplicarMigracaoGradeOficial(db) {
  const jaAplicada = db.prepare('SELECT valor FROM config WHERE chave = ?').get(FLAG);
  if (jaAplicada) return;

  const tx = db.transaction(() => {
    const swap = db.prepare('UPDATE palpites SET gols_casa = gols_fora, gols_fora = gols_casa WHERE jogo_id = ?');
    let invertidos = 0;
    INVERTIDOS.forEach(id => { invertidos += swap.run(id).changes; });

    const del = db.prepare('DELETE FROM palpites WHERE jogo_id = ?');
    let removidos = 0;
    TROCADOS.forEach(id => { removidos += del.run(id).changes; });

    const delCampeao = db.prepare('DELETE FROM palpite_campeao WHERE selecao = ?');
    let campeoes = 0;
    SELECOES_REMOVIDAS.forEach(s => { campeoes += delCampeao.run(s).changes; });

    // Limpa o cache de jogos para repopular já com a nova grade (sem esperar o TTL).
    db.prepare("DELETE FROM jogos_cache WHERE jogo_id_api = 'grupos' OR jogo_id_api = 'jogos_todos' OR jogo_id_api LIKE 'jogos_fase_%' OR jogo_id_api GLOB '[0-9]*'").run();

    db.prepare("INSERT INTO config (chave, valor) VALUES (?, '1') ON CONFLICT(chave) DO NOTHING").run(FLAG);

    console.log(`[migração grade oficial] placares invertidos: ${invertidos} | palpites removidos: ${removidos} | palpites de campeão removidos: ${campeoes}`);
  });

  tx();
}

module.exports = { aplicarMigracaoGradeOficial, FLAG, TROCADOS, INVERTIDOS, SELECOES_REMOVIDAS };
