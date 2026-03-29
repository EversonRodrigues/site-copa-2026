// Dados estáticos ricos das 48 seleções da Copa 2026
// Fontes: FIFA, Wikipedia, Transfermarkt (dados de jan/2025)

const SELECOES = {
  // GRUPO A
  'México': {
    grupo: 'A', continente: 'CONCACAF', cor: '#006847',
    estilo: 'Jogo combinativo de toque curto, pressão alta e transições rápidas. Conhecido pelo futebol vistoso e pela fiel torcida.',
    treinador: 'Javier Aguirre',
    provaveisJogadores: ['Guillermo Ochoa (goleiro)', 'Jorge Sánchez (lateral)', 'Edson Álvarez (volante)', 'Hirving Lozano (ponta)', 'Santiago Giménez (atacante)'],
    conquistas: '3x vencedor da Copa Ouro CONCACAF. Jamais passou das quartas de final em Copas do Mundo.',
    curiosidades: 'O México é o único país a sediar a Copa do Mundo três vezes (1970, 1986 e agora 2026). O "Grito do Elmo" é uma das torcidas mais barulhentas do mundo.',
    ranking_fifa: 16
  },
  'Jamaica': {
    grupo: 'A', continente: 'CONCACAF', cor: '#000000',
    estilo: 'Defesa organizada e contra-ataques rápidos. Aproveita a velocidade dos atacantes.',
    treinador: 'Heimir Hallgrímsson',
    provaveisJogadores: ['Andre Blake (goleiro)', 'Damion Lowe (zagueiro)', 'Kasey Palmer (meia)', 'Bobby Decordova-Reid (atacante)', 'Michail Antonio (atacante)'],
    conquistas: 'Primeira classificação para a Copa em 1998. Histórico retorno em 2026.',
    curiosidades: 'A Jamaica tem forte influência caribenha no futebol. Vários jogadores atuam na Premier League inglesa.',
    ranking_fifa: 43
  },
  'África do Sul': {
    grupo: 'A', continente: 'CAF', cor: '#007A4D',
    estilo: 'Físico e intenso, com boa marcação. Valoriza a disciplina tática.',
    treinador: 'Hugo Broos',
    provaveisJogadores: ['Ronwen Williams (goleiro)', 'Siyanda Xulu (zagueiro)', 'Themba Zwane (meia)', 'Percy Tau (atacante)', 'Lyle Foster (atacante)'],
    conquistas: 'Única nação a sediar a Copa do Mundo africana (2010). Tricampeão africano.',
    curiosidades: 'Conhecida como "Bafana Bafana" (Os Meninos). A Copa de 2010 foi a primeira realizada na África.',
    ranking_fifa: 58
  },
  'Uzbequistão': {
    grupo: 'A', continente: 'AFC', cor: '#1EB53A',
    estilo: 'Organizado taticamente, com foco na solidez defensiva. Estreante na Copa.',
    treinador: 'Srecko Katanec',
    provaveisJogadores: ['Otabek Shukurov (goleiro)', 'Sanjar Tursunov (zagueiro)', 'Jaloliddin Masharipov (meia)', 'Eldor Shomurodov (atacante)', 'Dostonbek Khamdamov (meia)'],
    conquistas: 'Primeira Copa do Mundo da história do país.',
    curiosidades: 'O Uzbequistão faz parte da Ásia Central e tem crescido muito no futebol desde a independência em 1991.',
    ranking_fifa: 74
  },

  // GRUPO B
  'Qatar': {
    grupo: 'B', continente: 'AFC', cor: '#8D153A',
    estilo: 'Posse de bola, pressão intensa e jogo combinativo. Evolução notável após 2022.',
    treinador: 'Marquez López',
    provaveisJogadores: ['Meshaal Barsham (goleiro)', 'Pedro Miguel (lateral)', 'Karim Boudiaf (volante)', 'Hassan Al-Haydos (meia)', 'Akram Afif (atacante)'],
    conquistas: 'Campeão da Copa da Ásia 2019 e 2023. Primeiro país a sediar a Copa como anfitrião sem passar pela fase classificatória.',
    curiosidades: 'Qatar foi o anfitrião da Copa 2022. Akram Afif foi o artilheiro da Copa da Ásia 2023.',
    ranking_fifa: 37
  },
  'Suíça': {
    grupo: 'B', continente: 'UEFA', cor: '#FF0000',
    estilo: 'Tático e organizado, alta intensidade, pressão alta. Especialista em surpreender nas eliminatórias.',
    treinador: 'Murat Yakin',
    provaveisJogadores: ['Yann Sommer (goleiro)', 'Manuel Akanji (zagueiro)', 'Granit Xhaka (volante)', 'Xherdan Shaqiri (meia)', 'Breel Embolo (atacante)'],
    conquistas: 'Presença constante em Copas. Melhor resultado: quartas de final (1934, 1938, 1954).',
    curiosidades: 'A Suíça nunca foi eliminada na fase de grupos desde 2010. Granit Xhaka é uma das lideranças mais consistentes da Europa.',
    ranking_fifa: 19
  },
  'Canadá': {
    grupo: 'B', continente: 'CONCACAF', cor: '#FF0000',
    estilo: 'Físico e intenso, com bons atletas. Crescimento explosivo nos últimos anos.',
    treinador: 'Jesse Marsch',
    provaveisJogadores: ['Maxime Crépeau (goleiro)', 'Alphonso Davies (lateral)', 'Atiba Hutchinson (volante)', 'Jonathan David (atacante)', 'Cyle Larin (atacante)'],
    conquistas: 'Classificou para 1986 e 2022. Em 2022 voltou após 36 anos de ausência.',
    curiosidades: 'Alphonso Davies é um dos laterais mais rápidos do mundo. Jonathan David é artilheiro consistente na Ligue 1.',
    ranking_fifa: 40
  },
  'Panamá': {
    grupo: 'B', continente: 'CONCACAF', cor: '#005293',
    estilo: 'Compacto e disciplinado, difícil de ser batido. Forte no duelo físico.',
    treinador: 'Thomas Christiansen',
    provaveisJogadores: ['Luis Mejía (goleiro)', 'Fidel Escobar (zagueiro)', 'Aníbal Godoy (volante)', 'Alberto Quintero (meia)', 'Rolando Blackburn (atacante)'],
    conquistas: 'Estreou em Copas em 2018. Terceiro em Copa Ouro 2023.',
    curiosidades: 'O Panamá é a menor nação da CONCACAF a se classificar consecutivamente para Copas do Mundo.',
    ranking_fifa: 52
  },

  // GRUPO C
  'Brasil': {
    grupo: 'C', continente: 'CONMEBOL', cor: '#009C3B',
    estilo: 'Futebol ofensivo, técnica individual e coletiva, jogo rápido. O "jogo bonito" como filosofia.',
    treinador: 'Dorival Júnior',
    provaveisJogadores: ['Alisson (goleiro)', 'Danilo (lateral)', 'Marquinhos (zagueiro)', 'Casemiro (volante)', 'Vinicius Jr. (atacante)', 'Rodrygo (meia)', 'Endrick (atacante)'],
    conquistas: 'Pentacampeão mundial (1958, 1962, 1970, 1994, 2002). Único a participar de todas as edições.',
    curiosidades: 'O Brasil é o maior vencedor da Copa. Pelé marcou 77 gols pela seleção. Vinicius Jr. foi eleito melhor do mundo em 2024.',
    ranking_fifa: 5
  },
  'Marrocos': {
    grupo: 'C', continente: 'CAF', cor: '#C1272D',
    estilo: 'Defesa sólida, transições rápidas e organização tática europeia. Semifinalista em 2022.',
    treinador: 'Walid Regragui',
    provaveisJogadores: ['Yassine Bounou (goleiro)', 'Achraf Hakimi (lateral)', 'Romain Saïss (zagueiro)', 'Sofyan Amrabat (volante)', 'Hakim Ziyech (meia)', 'Youssef En-Nesyri (atacante)'],
    conquistas: 'Primeiro país africano a chegar às semifinais de uma Copa (2022).',
    curiosidades: 'Marrocos eliminou Espanha e Portugal em 2022. Achraf Hakimi é um dos melhores laterais do mundo.',
    ranking_fifa: 14
  },
  'Haiti': {
    grupo: 'C', continente: 'CONCACAF', cor: '#00209F',
    estilo: 'Técnico e criativo, com jogadores formados no exterior.',
    treinador: 'Marc Collat',
    provaveisJogadores: ['Josué Duverger (goleiro)', 'Andrew Wooten (atacante)', 'Duckens Nazon (atacante)'],
    conquistas: 'Única Copa disputada foi em 1974.',
    curiosidades: 'Haiti tem vários jogadores nascidos em países estrangeiros que escolheram defender a bandeira caribenha.',
    ranking_fifa: 85
  },
  'Escócia': {
    grupo: 'C', continente: 'UEFA', cor: '#003087',
    estilo: 'Físico, disciplinado e guerreiro. Forte no duelo individual.',
    treinador: 'Steve Clarke',
    provaveisJogadores: ['Angus Gunn (goleiro)', 'Andy Robertson (lateral)', 'Scott McTominay (volante)', 'John McGinn (meia)', 'Che Adams (atacante)'],
    conquistas: 'Nunca avançou além da fase de grupos em Copas.',
    curiosidades: 'A Escócia foi um dos países fundadores do futebol moderno. Andy Robertson é capitão do Liverpool.',
    ranking_fifa: 39
  },

  // GRUPO D
  'EUA': {
    grupo: 'D', continente: 'CONCACAF', cor: '#002868',
    estilo: 'Atlético e intenso, com crescimento técnico expressivo. Mistura de jogadores da MLS e grandes ligas europeias.',
    treinador: 'Mauricio Pochettino',
    provaveisJogadores: ['Matt Turner (goleiro)', 'Sergino Dest (lateral)', 'Tyler Adams (volante)', 'Christian Pulisic (meia)', 'Folarin Balogun (atacante)', 'Ricardo Pepi (atacante)'],
    conquistas: 'Terceiro lugar em 1930. Classificou para todas as Copas desde 1990.',
    curiosidades: 'Os EUA são um dos países-sede do torneio. Christian Pulisic é o maior jogador americano da geração atual.',
    ranking_fifa: 13
  },
  'Paraguai': {
    grupo: 'D', continente: 'CONMEBOL', cor: '#D52B1E',
    estilo: 'Compacto defensivamente e perigoso nos contra-ataques. Muito disciplinado taticamente.',
    treinador: 'Gustavo Alfaro',
    provaveisJogadores: ['Antony Silva (goleiro)', 'Fabián Balbuena (zagueiro)', 'Andrés Cubas (volante)', 'Miguel Almirón (meia)', 'Antonio Sanabria (atacante)'],
    conquistas: 'Vice-campeão da Copa América 2011. Quartas de final em 2010.',
    curiosidades: 'Paraguai é conhecido pela solidez defensiva histórica. Miguel Almirón se destaca na Premier League.',
    ranking_fifa: 60
  },
  'Austrália': {
    grupo: 'D', continente: 'AFC', cor: '#FFD700',
    estilo: 'Intenso e físico, com boa organização. Os "Socceroos" cresceram muito após 2006.',
    treinador: 'Tony Popovic',
    provaveisJogadores: ['Mat Ryan (goleiro)', 'Miloš Degenek (zagueiro)', 'Aaron Mooy (meia)', 'Mathew Leckie (ponta)', 'Mitchell Duke (atacante)'],
    conquistas: 'Quartas de final em 2006. Semifinalistas da Copa da Ásia 2023.',
    curiosidades: 'A Austrália compete na AFC desde 2006. Sam Kerr é lenda do futebol feminino, mas o masculino também cresce.',
    ranking_fifa: 23
  },
  'Nigéria': {
    grupo: 'D', continente: 'CAF', cor: '#008751',
    estilo: 'Veloz e atlético, com grande talento individual. As "Super Águias" são temidas.',
    treinador: 'Finidi George',
    provaveisJogadores: ['Francis Uzoho (goleiro)', 'Semi Ajayi (zagueiro)', 'Wilfred Ndidi (volante)', 'Alex Iwobi (meia)', 'Victor Osimhen (atacante)', 'Samuel Chukwueze (ponta)'],
    conquistas: 'Tricampeão africano. Oitavas de final em 1994 e 1998.',
    curiosidades: 'Victor Osimhen foi artilheiro da Serie A italiana em 2022/23. Nigéria é a nação mais populosa da África.',
    ranking_fifa: 30
  },

  // GRUPO E
  'Alemanha': {
    grupo: 'E', continente: 'UEFA', cor: '#000000',
    estilo: 'Eficiência, organização tática e mentalidade vencedora. Futebol total adaptado ao século XXI.',
    treinador: 'Julian Nagelsmann',
    provaveisJogadores: ['Manuel Neuer (goleiro)', 'Joshua Kimmich (lateral/volante)', 'Antonio Rüdiger (zagueiro)', 'Toni Kroos (meia)', 'Florian Wirtz (meia)', 'Kai Havertz (atacante)', 'Leroy Sané (ponta)'],
    conquistas: 'Tetracampeão mundial (1954, 1974, 1990, 2014). 3x vice-campeão.',
    curiosidades: 'A Alemanha chegou à final da Copa em 8 ocasiões. Miroslav Klose é o maior artilheiro de toda a história da Copa com 16 gols.',
    ranking_fifa: 12
  },
  'Curaçao': {
    grupo: 'E', continente: 'CONCACAF', cor: '#003DA5',
    estilo: 'Técnico e criativo, com jogadores de origem holandesa. Estilo europeu.',
    treinador: 'Remko Bicentini',
    provaveisJogadores: ['Eloy Room (goleiro)', 'Ethan Do Blessman (zagueiro)', 'Leandro Bacuna (meia)', 'Cuco Martina (lateral)', 'Juninho (atacante)'],
    conquistas: 'Primeira Copa do Mundo da história.',
    curiosidades: 'Curaçao é uma ilha do Caribe com forte influência holandesa. Muitos jogadores atuam na Eredivisie.',
    ranking_fifa: 80
  },
  'Costa do Marfim': {
    grupo: 'E', continente: 'CAF', cor: '#F77F00',
    estilo: 'Físico, veloz e talentoso. A geração de Didier Drogba abriu portas; a nova geração quer ir além.',
    treinador: 'Emerse Faé',
    provaveisJogadores: ['Yahia Fofana (goleiro)', 'Serge Aurier (lateral)', 'Wilfried Singo (lateral)', 'Franck Kessié (volante)', 'Sébastien Haller (atacante)', 'Nicolas Pépé (ponta)'],
    conquistas: 'Bicampeão africano (1992, 2023). Ainda busca avançar nas Copas.',
    curiosidades: 'Campeã da CAN 2023 em casa. Didier Drogba é ídolo eterno e atual dirigente do futebol marfinense.',
    ranking_fifa: 48
  },
  'Equador': {
    grupo: 'E', continente: 'CONMEBOL', cor: '#FFD100',
    estilo: 'Organizado e compacto, com boa pressão e transições. Crescimento constante na CONMEBOL.',
    treinador: 'Sébastien Beccacece',
    provaveisJogadores: ['Hernán Galíndez (goleiro)', 'Piero Hincapié (zagueiro)', 'Moisés Caicedo (volante)', 'Gonzalo Plata (ponta)', 'Enner Valencia (atacante)'],
    conquistas: 'Oitavas de final em 2006. Abriu a Copa 2022 contra o Qatar.',
    curiosidades: 'Moisés Caicedo foi o jogador mais caro do mundo em agosto de 2023 (£115M para o Chelsea). Enner Valencia é o maior artilheiro do país.',
    ranking_fifa: 35
  },

  // GRUPO F
  'Holanda': {
    grupo: 'F', continente: 'UEFA', cor: '#FF6900',
    estilo: '"Futebol total" como legado. Toque curto, posse, pressing alto e criatividade.',
    treinador: 'Ronald Koeman',
    provaveisJogadores: ['Bart Verbruggen (goleiro)', 'Denzel Dumfries (lateral)', 'Virgil van Dijk (zagueiro)', 'Frenkie de Jong (volante)', 'Memphis Depay (atacante)', 'Cody Gakpo (ponta)'],
    conquistas: '3x vice-campeão (1974, 1978, 2010). Nunca venceu a Copa.',
    curiosidades: 'Johan Cruyff inventou o "futebol total". A Holanda lidera a lista de seleções que mais vezes chegaram à final sem vencer.',
    ranking_fifa: 7
  },
  'Japão': {
    grupo: 'F', continente: 'AFC', cor: '#BC002D',
    estilo: 'Técnico, disciplinado e surpreendente. Eliminações históricas de Alemanha e Espanha em 2022.',
    treinador: 'Hajime Moriyasu',
    provaveisJogadores: ['Shuichi Gonda (goleiro)', 'Hiroki Sakai (lateral)', 'Maya Yoshida (zagueiro)', 'Wataru Endo (volante)', 'Takumi Minamino (meia)', 'Kaoru Mitoma (ponta)', 'Daichi Kamada (meia)'],
    conquistas: 'Oitavas de final em 2002, 2010, 2018 e 2022. Nunca passou das quartas.',
    curiosidades: 'O Japão venceu Alemanha e Espanha na Copa 2022. Vários jogadores atuam nos principais clubes europeus.',
    ranking_fifa: 18
  },
  'Colômbia': {
    grupo: 'F', continente: 'CONMEBOL', cor: '#FCD116',
    estilo: 'Técnico e ofensivo, com grande qualidade individual. Sempre produz talentos de nível mundial.',
    treinador: 'Néstor Lorenzo',
    provaveisJogadores: ['David Ospina (goleiro)', 'Dávinson Sánchez (zagueiro)', 'Wilmar Barrios (volante)', 'James Rodríguez (meia)', 'Luis Díaz (ponta)', 'Jhon Córdoba (atacante)'],
    conquistas: 'Quartas de final em 2014. Finalista da Copa América 2024.',
    curiosidades: 'James Rodríguez foi o artilheiro da Copa 2014 com 6 gols. Luis Díaz é um dos extremos mais em forma do mundo.',
    ranking_fifa: 9
  },
  'Camarões': {
    grupo: 'F', continente: 'CAF', cor: '#007A5E',
    estilo: 'Atlético e físico, com grande talento individual. Os "Leões Indomáveis" são a maior seleção da África Central.',
    treinador: 'Marc Brys',
    provaveisJogadores: ['André Onana (goleiro)', 'Michael Ngadeu (zagueiro)', 'André-Frank Zambo Anguissa (volante)', 'Martin Hongla (meia)', 'Vincent Aboubakar (atacante)', 'Bryan Mbeumo (ponta)'],
    conquistas: '5x campeão africano. Quartas de final em 1990.',
    curiosidades: 'André Onana é goleiro do Manchester United. Roger Milla, que jogou com 38 anos em 1994, é lenda mundial.',
    ranking_fifa: 46
  },

  // GRUPO G
  'Bélgica': {
    grupo: 'G', continente: 'UEFA', cor: '#EF3340',
    estilo: 'Físico e técnico, com talento individual excepcional. A "geração dourada" ainda está ativa.',
    treinador: 'Domenico Tedesco',
    provaveisJogadores: ['Thibaut Courtois (goleiro)', 'Toby Alderweireld (zagueiro)', 'Kevin De Bruyne (meia)', 'Axel Witsel (volante)', 'Romelu Lukaku (atacante)', 'Dries Mertens (meia)'],
    conquistas: '3º lugar em 2018. Liderou o ranking FIFA por vários anos.',
    curiosidades: 'Bélgica teve a melhor geração de sua história nos anos 2010. Kevin De Bruyne é considerado um dos melhores meias do mundo.',
    ranking_fifa: 3
  },
  'Egito': {
    grupo: 'G', continente: 'CAF', cor: '#CE1126',
    estilo: 'Organizado e experiente, com estrela individual absoluta.',
    treinador: 'Hossam El-Badry',
    provaveisJogadores: ['Mohamed El-Shenawy (goleiro)', 'Ahmed Hegazi (zagueiro)', 'Tarek Hamed (volante)', 'Mohamed Salah (meia/atacante)', 'Mostafa Mohamed (atacante)'],
    conquistas: '7x campeão africano. Última Copa em 1990.',
    curiosidades: 'Mohamed Salah é um dos melhores do mundo e maior ídolo do país. O Egito tem o recorde de títulos da CAN.',
    ranking_fifa: 34
  },
  'Irã': {
    grupo: 'G', continente: 'AFC', cor: '#239F40',
    estilo: 'Defensivo, organizado e difícil de ser batido. Forte no trabalho coletivo.',
    treinador: 'Amir Ghalenoei',
    provaveisJogadores: ['Alireza Beiranvand (goleiro)', 'Milad Mohammadi (lateral)', 'Saeid Ezatolahi (volante)', 'Sardar Azmoun (atacante)', 'Mehdi Taremi (atacante)'],
    conquistas: '3x campeão asiático. Presença regular em Copas desde 1978.',
    curiosidades: 'Mehdi Taremi marcou um gol de bicicleta espetacular contra o Chelsea na Champions League 2023/24. Irã venceu os EUA em 1998.',
    ranking_fifa: 22
  },
  'Nova Zelândia': {
    grupo: 'G', continente: 'OFC', cor: '#FFFFFF',
    estilo: 'Físico e competitivo, aproveitando a força atlética dos jogadores.',
    treinador: 'Darren Bazeley',
    provaveisJogadores: ['Oliver Sail (goleiro)', 'Liberato Cacace (lateral)', 'Winston Reid (zagueiro)', 'Clayton Lewis (meia)', 'Chris Wood (atacante)'],
    conquistas: 'Segunda Copa do Mundo (2010, 2026). Único país a terminar a Copa sem ser eliminado em 2010 (3 empates).',
    curiosidades: 'Chris Wood é artilheiro histórico da Nova Zelândia. A seleção é dominante na Oceania.',
    ranking_fifa: 92
  },

  // GRUPO H
  'Arábia Saudita': {
    grupo: 'H', continente: 'AFC', cor: '#006C35',
    estilo: 'Organizado e disciplinado, com jogadores de alto nível chegando à Saudi Pro League.',
    treinador: 'Roberto Mancini',
    provaveisJogadores: ['Mohammed Al-Owais (goleiro)', 'Ali Al-Bulayhi (lateral)', 'Abdulelah Al-Malki (volante)', 'Salem Al-Dawsari (ponta)', 'Firas Al-Buraikan (atacante)'],
    conquistas: 'Oitavas de final em 1994. Surpreendeu ao vencer a Argentina em 2022.',
    curiosidades: 'A Arábia Saudita venceu a Argentina por 2x1 em 2022, em uma das maiores zebras da história. Cristiano Ronaldo joga na Saudi League.',
    ranking_fifa: 56
  },
  'Uruguai': {
    grupo: 'H', continente: 'CONMEBOL', cor: '#5EB6E4',
    estilo: '"La Garra Charrúa": raça, garra e determinação. Futebol físico com técnica.',
    treinador: 'Marcelo Bielsa',
    provaveisJogadores: ['Sergio Rochet (goleiro)', 'Ronald Araújo (zagueiro)', 'Diego Godín (zagueiro)', 'Federico Valverde (meia)', 'Darwin Núñez (atacante)', 'Luis Suárez (atacante)'],
    conquistas: 'Bicampeão mundial (1930, 1950). 15x campeão da Copa América.',
    curiosidades: 'Uruguai venceu a Copa de 1950 no Maracanã, o famoso "Maracanazo". Federico Valverde é uma das grandes promessas do Real Madrid.',
    ranking_fifa: 11
  },
  'Espanha': {
    grupo: 'H', continente: 'UEFA', cor: '#AA151B',
    estilo: '"La Roja" e o "tiki-taka": posse de bola, toque curto, pressão imediata. Escola de futebol mais influente dos últimos 20 anos.',
    treinador: 'Luis de la Fuente',
    provaveisJogadores: ['Unai Simón (goleiro)', 'Carvajal (lateral)', 'Pau Cubarsí (zagueiro)', 'Rodri (volante)', 'Pedri (meia)', 'Lamine Yamal (ponta)', 'Álvaro Morata (atacante)'],
    conquistas: 'Tricampeão europeu (2008, 2012, 2024). Campeão mundial em 2010.',
    curiosidades: 'Espanha ganhou o Euro 2024 com jovens talentosos como Lamine Yamal (16 anos). Rodri venceu a Bola de Ouro 2024.',
    ranking_fifa: 8
  },
  'Cabo Verde': {
    grupo: 'H', continente: 'CAF', cor: '#003893',
    estilo: 'Organizado e compacto. Jogadores formados principalmente em Portugal.',
    treinador: 'Bubista',
    provaveisJogadores: ['Vozinha (goleiro)', 'Roberto Lopes (zagueiro)', 'Jamiro Monteiro (meia)', 'Ryan Mendes (ponta)', 'Garry Rodrigues (ponta)'],
    conquistas: 'Quartas de final na CAN 2021 e 2023. Primeira Copa do Mundo.',
    curiosidades: 'Cabo Verde é um arquipélago no Atlântico. A maioria dos jogadores nasceu em Portugal.',
    ranking_fifa: 71
  },

  // GRUPO I
  'França': {
    grupo: 'I', continente: 'UEFA', cor: '#002395',
    estilo: 'Veloz, físico e com enorme qualidade técnica. "Les Bleus" combinam atletismo com técnica europeia.',
    treinador: 'Didier Deschamps',
    provaveisJogadores: ['Mike Maignan (goleiro)', 'Theo Hernández (lateral)', 'Raphaël Varane (zagueiro)', 'Aurélien Tchouaméni (volante)', 'Antoine Griezmann (meia)', 'Kylian Mbappé (atacante)', 'Ousmane Dembélé (ponta)'],
    conquistas: 'Bicampeão mundial (1998, 2018). Vice-campeão em 2022.',
    curiosidades: 'Kylian Mbappé é o maior artilheiro da história da seleção francesa. A França tem a maior diversidade étnica entre as grandes seleções.',
    ranking_fifa: 2
  },
  'Senegal': {
    grupo: 'I', continente: 'CAF', cor: '#00853F',
    estilo: 'Atlético, físico e técnico. Uma das seleções mais completas da África.',
    treinador: 'Aliou Cissé',
    provaveisJogadores: ['Édouard Mendy (goleiro)', 'Kalidou Koulibaly (zagueiro)', 'Idrissa Gueye (volante)', 'Sadio Mané (atacante)', 'Ismaïla Sarr (ponta)'],
    conquistas: 'Campeão africano 2021 e 2022. Quartas de final em 2002.',
    curiosidades: 'Sadio Mané é o maior ídolo da história. Senegal eliminou o Brasil em 2002 nas oitavas de final.',
    ranking_fifa: 20
  },
  'Honduras': {
    grupo: 'I', continente: 'CONCACAF', cor: '#0073CF',
    estilo: 'Físico e combativo, com defesa sólida.',
    treinador: 'Diego Vázquez',
    provaveisJogadores: ['Luis López (goleiro)', 'Maynor Figueroa (zagueiro)', 'Andy Najar (lateral)', 'Alberth Elis (ponta)', 'Romell Quioto (ponta)'],
    conquistas: 'Participou de Copas em 1982, 2010 e 2014.',
    curiosidades: 'Honduras nunca venceu uma partida em Copas do Mundo. Alberth Elis é a principal estrela da geração atual.',
    ranking_fifa: 77
  },
  'Venezuela': {
    grupo: 'I', continente: 'CONMEBOL', cor: '#CF142B',
    estilo: 'Técnico e organizado. A "Vinotinto" vive sua melhor geração histórica.',
    treinador: 'Fernando Batista',
    provaveisJogadores: ['Wuilker Faríñez (goleiro)', 'Jhon Chancellor (zagueiro)', 'Tomás Rincón (volante)', 'Yangel Herrera (meia)', 'Salomón Rondón (atacante)'],
    conquistas: 'Primeira Copa do Mundo da história. Semifinalista da Copa América 2024.',
    curiosidades: 'Venezuela foi a última seleção sul-americana a se classificar para uma Copa. Yangel Herrera joga no Girona.',
    ranking_fifa: 42
  },

  // GRUPO J
  'Argentina': {
    grupo: 'J', continente: 'CONMEBOL', cor: '#74ACDF',
    estilo: 'Técnico, ofensivo e com mentalidade campeã. Organização tática impecável e gênio individual.',
    treinador: 'Lionel Scaloni',
    provaveisJogadores: ['Emiliano Martínez (goleiro)', 'Cristian Romero (zagueiro)', 'Lisandro Martínez (zagueiro)', 'Rodrigo De Paul (volante)', 'Lionel Messi (camisa 10)', 'Julián Álvarez (atacante)', 'Paulo Dybala (meia)'],
    conquistas: 'Tricampeão mundial (1978, 1986, 2022). 15x campeão da Copa América.',
    curiosidades: 'Lionel Messi finalmente conquistou a Copa em 2022 no Qatar. A Argentina é a atual campeã do mundo.',
    ranking_fifa: 1
  },
  'Argélia': {
    grupo: 'J', continente: 'CAF', cor: '#006233',
    estilo: 'Técnico e organizado, com jogadores de alto nível na Europa.',
    treinador: 'Vladimir Petkovic',
    provaveisJogadores: ['Rais M\'Bolhi (goleiro)', 'Ramy Bensebaini (lateral)', 'Ismaël Bennacer (volante)', 'Sofiane Feghouli (meia)', 'Islam Slimani (atacante)'],
    conquistas: 'Campeão africano 2019. Oitavas de final em 2014.',
    curiosidades: 'A Argélia venceu a CAN 2019 invicta. Ismaël Bennacer joga no Milan.',
    ranking_fifa: 32
  },
  'Áustria': {
    grupo: 'J', continente: 'UEFA', cor: '#ED2939',
    estilo: 'Intenso e organizado, com pressing alto. Crescimento expressivo nos últimos anos.',
    treinador: 'Ralf Rangnick',
    provaveisJogadores: ['Patrick Pentz (goleiro)', 'David Alaba (zagueiro)', 'Konrad Laimer (volante)', 'Marcel Sabitzer (meia)', 'Christoph Baumgartner (meia)', 'Marko Arnautovic (atacante)'],
    conquistas: '3º lugar em 1954. Forte presença nas Euros recentes.',
    curiosidades: 'David Alaba joga no Real Madrid como zagueiro. Ralf Rangnick é conhecido por popularizar o pressing intenso.',
    ranking_fifa: 25
  },
  'Jordânia': {
    grupo: 'J', continente: 'AFC', cor: '#007A3D',
    estilo: 'Organizado e disciplinado. Surpreendeu ao chegar à final da Copa da Ásia 2023.',
    treinador: 'Noureddine Ould Ali',
    provaveisJogadores: ['Yazeed Abulaila (goleiro)', 'Baha\' Faisal (zagueiro)', 'Yazan Al-Naimat (meia)', 'Musa Al-Taamari (ponta)'],
    conquistas: 'Finalista da Copa da Ásia 2023. Primeira Copa do Mundo.',
    curiosidades: 'Jordânia surpreendeu o mundo ao chegar à final da Copa da Ásia 2023, eliminando Coreia do Sul e Iraque.',
    ranking_fifa: 68
  },

  // GRUPO K
  'Coreia do Sul': {
    grupo: 'K', continente: 'AFC', cor: '#003478',
    estilo: 'Técnico, intenso e bem organizado. Forte na pressão coletiva.',
    treinador: 'Hong Myung-bo',
    provaveisJogadores: ['Jo Hyeon-woo (goleiro)', 'Kim Min-jae (zagueiro)', 'Jung Woo-young (volante)', 'Lee Jae-sung (meia)', 'Son Heung-min (atacante)', 'Hwang Hee-chan (ponta)'],
    conquistas: '4º lugar em 2002. Oitavas de final em 2010 e 2022.',
    curiosidades: 'Son Heung-min é capitão e artilheiro histórico da seleção. Coreia co-sediou a Copa com o Japão em 2002.',
    ranking_fifa: 23
  },
  'Inglaterra': {
    grupo: 'K', continente: 'UEFA', cor: '#FFFFFF',
    estilo: 'Físico, técnico e cada vez mais moderno. A nova geração trouxe futebol atraente.',
    treinador: 'Lee Carsley',
    provaveisJogadores: ['Jordan Pickford (goleiro)', 'Kyle Walker (lateral)', 'Harry Maguire (zagueiro)', 'Declan Rice (volante)', 'Jude Bellingham (meia)', 'Harry Kane (atacante)', 'Phil Foden (meia)'],
    conquistas: 'Campeão mundial em 1966 (único título). Vice-campeão Euro 2021 e 2024.',
    curiosidades: 'Harry Kane é o maior artilheiro da história da seleção. England sofre com a "dor de pênaltis" em eliminatórias.',
    ranking_fifa: 5
  },
  'Tunísia': {
    grupo: 'K', continente: 'CAF', cor: '#E70013',
    estilo: 'Organizado e difícil de ser batido. Defesa sólida como marca registrada.',
    treinador: 'Jalel Kadri',
    provaveisJogadores: ['Aymen Dahmen (goleiro)', 'Dylan Bronn (zagueiro)', 'Ellyes Skhiri (volante)', 'Youssef Msakni (meia)', 'Wahbi Khazri (atacante)'],
    conquistas: '5x campeão africano. Presença regular em Copas.',
    curiosidades: 'A Tunísia marcou o primeiro gol de Copa em 1978 para um país africano. É conhecida por eliminações amargas por placar mínimo.',
    ranking_fifa: 31
  },

  // GRUPO L
  'Portugal': {
    grupo: 'L', continente: 'UEFA', cor: '#006600',
    estilo: 'Técnico e ofensivo, equilibrando estrelas individuais com coletividade.',
    treinador: 'Roberto Martínez',
    provaveisJogadores: ['Diogo Costa (goleiro)', 'João Cancelo (lateral)', 'Rúben Dias (zagueiro)', 'João Palhinha (volante)', 'Bruno Fernandes (meia)', 'Bernardo Silva (meia)', 'Cristiano Ronaldo (atacante)', 'Rafael Leão (ponta)'],
    conquistas: '3º lugar em 1966. Campeão Euro 2016. Finalista da Nations League.',
    curiosidades: 'Cristiano Ronaldo é o maior artilheiro da história das seleções com mais de 130 gols. Bernardo Silva é eleito constantemente como um dos melhores do mundo.',
    ranking_fifa: 6
  },
  'Sérvia': {
    grupo: 'L', continente: 'UEFA', cor: '#C6363C',
    estilo: 'Físico, técnico e com grande talento individual no meio-campo.',
    treinador: 'Dragan Stojković',
    provaveisJogadores: ['Predrag Rajković (goleiro)', 'Strahinja Pavlović (zagueiro)', 'Nemanja Maksimović (volante)', 'Sergej Milinković-Savić (meia)', 'Dušan Tadic (meia)', 'Dušan Vlahović (atacante)', 'Luka Jović (atacante)'],
    conquistas: 'Semifinalista como Iugoslávia em 1930 e 1962.',
    curiosidades: 'Dušan Vlahović é um dos centroavantes mais promissores da Europa. Sergej Milinković-Savić dominou a Serie A por anos.',
    ranking_fifa: 33
  },
  'El Salvador': {
    grupo: 'L', continente: 'CONCACAF', cor: '#0F47AF',
    estilo: 'Compacto e trabalhador. Melhora constante com jogadores do exterior.',
    treinador: 'Hugo Pérez',
    provaveisJogadores: ['Mario González (goleiro)', 'Roberto Domínguez (zagueiro)', 'Alexander Larin (meia)', 'Nelson Bonilla (atacante)', 'Eriq Zavaleta (zagueiro)'],
    conquistas: 'Participou de Copas em 1970 e 1982.',
    curiosidades: 'El Salvador marcou o recorde de derrotas consecutivas em uma Copa (9-0 para a Hungria em 1982).',
    ranking_fifa: 73
  },
  'Iraque': {
    grupo: 'L', continente: 'AFC', cor: '#007A3D',
    estilo: 'Organizado e crescendo no futebol asiático.',
    treinador: 'Jesús Casas',
    provaveisJogadores: ['Mohammed Hamid (goleiro)', 'Ali Adnan (lateral)', 'Ibrahim Bayesh (zagueiro)', 'Amjed Attwan (volante)', 'Aymen Hussein (atacante)'],
    conquistas: 'Campeão asiático em 2007. Primeira Copa desde 1986.',
    curiosidades: 'O Iraque ganhou a Copa da Ásia de 2007 de forma surpreendente. O país tem a maior liga árabe por número de torcedores.',
    ranking_fifa: 66
  },
};

function getSelecao(nome) {
  return SELECOES[nome] || null;
}

function getTodasSelecoes() {
  return Object.entries(SELECOES).map(([nome, dados]) => ({
    nome,
    ...dados
  }));
}

module.exports = { getSelecao, getTodasSelecoes, SELECOES };
