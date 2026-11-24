# Bíblia da série — Titorei

Leia ANTES de escrever um episódio novo e ATUALIZE depois de entregar.

## Regra da série
- Cada episódio CONTINUA o anterior: começa respondendo/retomando o gancho deixado no fim do episódio passado.
- Cada episódio TERMINA com um gancho de mistério para o próximo ("O que tem dentro? Descobre no próximo episódio!"),
  com o título "CONTINUA…" na tela.
- O gancho dos 3 primeiros segundos continua obrigatório (premissa absurda nova, texto na tela no frame 0).

## Elenco fixo
- **Tito.rei** — protagonista (Tito low-poly de coroa). Contrata funcionários absurdos para a cozinha.
  Desde o ep. 3 está SEM COROA (`semCoroa`); no ep. 4 virou DETETIVE (lupa: `Lupa`).
- **Geladeira** — pediu demissão (ep. 1), foi à praia, voltou bronzeada, de chinelo, com a porta descascando, e com ciúme.
  Agora divide a cozinha com a capivara: "uma gela, a outra acalma".
- **Capivara** — "capivara refrigeradora": não gela nada, mas acalma tudo. Nunca se abala. Correu UMA vez na vida (modo turbo, ep. 3).
  Ep. 5: virou **RAINHA CAPIVARA** sem nem ser candidata (desempate: "vence o mais calmo"). Usa coroa (`coroa`).
- **Nuvem** — funcionária nova (ep. 2): rega as plantas, espirra e vira tempestade; acalma com música e solta arco-íris.
- **Relógio gerente** — despertador vermelho de gravata que saiu da caixa TIC-TAC (ep. 3). Mandão: virou gerente,
  fez quadro de horários, acelerou o tempo, superaqueceu e dormiu ao apertarem a soneca (está dormindo na cozinha).
- **Rei Micro-ondas** — o candidato misterioso da coroa gigante (ep. 5). Prometeu "tudo pronto em 30 s, até as férias";
  nervoso, gira o prato e apita. Perdeu a eleição e começou uma CONTAGEM REGRESSIVA. Componente `MicroOndas`.
- **Planta (RAINHA PLANTA)** — cresceu com a chuva da nuvem e pediu AUMENTO; como ninguém deu, LEVOU A COROA do Tito (ep. 4)
  e se promoveu a "Rainha da Cozinha". Exigiu vaso maior, sol de praia e crachá; aceitou o adubo e ficou com a coroa.
  Convocou uma ELEIÇÃO pra rei da cozinha. Componente: `Vaso` com `coroa`, `escala`, `boca`, `vasoMaior`.
- **Micro-ondas** virou **MINISTRO DA PIPOCA** (ep. 6) depois do "golpe da pipoca" (a contagem do ep. 5 terminava em… PIM, pipoca).
  O Tito virou **MINISTRO DO PIRUÁ**. Componentes novos: `Pipoca`, `MarDePipoca` (nível), `PipocasPulando`, `OvoGigante` (`racha`, `treme`) em `objetos/Pipoca.tsx`.
- **Gelinha (GELADEIRINHA)** — nasceu do ovo gigante (ep. 7); chama a geladeira de MAMÃE, come gelo e congela tudo; adora pipoca ("BIS!").
  O nome levou 3 dias (a rainha capivara escolhe bem devagarinho). Componente: `Geladeira` em escala 0.38 + chupeta (dentro de `episodios/geladeirinha`).
  O Tito agora é Ministro do Piruá E BABÁ (sem salário). Objetos novos: `CascaOvo`, `Congelada` (k), `SilhuetaFreezer` em `objetos/Pipoca.tsx`.
- **Freezer** (ep. 8) — apareceu dizendo ser o pai da Gelinha; o "exame de DNA… de temperatura" deu NÃO. Ficou tão triste que desligou da tomada e virou um ARMÁRIO. Componente `Freezer` (`desligado`, `armario`).
  O **pai da Gelinha é o MICRO-ONDAS** (por isso ela ama pipoca; ela é MORNA). Objetos novos em `objetos/Familia.tsx`: `Geladeirinha`, `Freezer`, `Termometro`, `Envelope`, `BlocoGelo`.
- Ep. 9: o Tito foi descongelado na PRAIA (micro-ondas não coube; capivara derreteu 1 cm em 3 h). Saiu espirrando, molhado. O sorvete derreteu junto.
  Mistério novo: bilhete "Essa cozinha é minha. — O VERDADEIRO REI 👑".
- **Panela de Pressão** (ep. 10) — o "verdadeiro rei" do bilhete: velha rainha aposentada (40 anos de feijão), mora no armário, usa coroa antiga. Perdeu o duelo de culinária (o Tito votou na PIZZA que a capivara pediu). Componentes em `objetos/Familia.tsx`: `PanelaPressao` (`apito`, `inchada`, `coroa`), `CaixaPizza`, `PratoFeijao`.
- **Leite** — medroso, sua de nervoso (mas desceu o arco-íris gritando de alegria). **Queijo** — medita flutuando. **Manteiga** — faz ioga. **Sorvete** — pediu pra ficar.

## Piadas recorrentes
- Objetos com emprego/burocracia (demissão, férias, entrevista, aumento, contrato).
- A capivara indiferente ao caos. O leite com medo de tudo.
- Títulos de capítulo batizando o absurdo ("CAPIVARA REFRIGERADORA").
- A capivara faz tudo "bem devagarinho" ("1 CM POR HORA").
- Funcionários pedindo aumento/benefícios.
- O Tito perdendo o posto de rei ("SEM CARGO", "rei só no fim de semana", coroa roubada pela planta, eleição).
- A capivara "detetive" que investiga a 1 cm por hora.
- Cargos inúteis de ministro ("ministro da pipoca", "ministro do piruá"). Todo mundo finge que dorme quando o relógio manda fazer faxina.

## Episódios
| # | Vídeo (id) | Título | Gancho deixado no final |
|---|---|---|---|
| 1 | geladeira-demissao | A geladeira pediu demissão | "Segue pra ver quem o Tito contrata amanhã!" |
| 2 | nuvem-funcionaria | O funcionário nuvem | Alguém bateu na porta e deixou uma **caixa que faz TIC-TAC**. "O que tem dentro? Descobre no próximo episódio!" |
| 3 | relogio-gerente | O relógio gerente | Na comemoração, **a coroa do Tito sumiu**; pegadinhas misteriosas vão até a janela. "Quem levou? Descobre no próximo episódio!" |
| 4 | planta-rainha | A planta rainha | A planta convocou uma **ELEIÇÃO pra rei da cozinha**; bateram na porta e entrou um **candidato surpresa (silhueta) com uma coroa AINDA MAIOR**. "Quem é? Descobre no próximo episódio!" |
| 5 | grande-eleicao | A grande eleição | A capivara virou rainha; o **micro-ondas não aceitou a derrota e começou uma CONTAGEM REGRESSIVA** (00:10, 00:09…). "O que acontece no zero? Descobre no próximo episódio!" |
| 6 | golpe-pipoca | O golpe da pipoca | Depois da enchente de pipoca, apareceu um **OVO GIGANTE** no fundo da pipoca e ele **começou a rachar**. "O que vai nascer? Descobre no próximo episódio!" |
| 7 | geladeirinha | Nasceu a geladeirinha | "Se a geladeira é a mãe… quem é o PAI?" Bateram na porta: **silhueta de um FREEZER** com olhinhos azuis. "Descobre no próximo episódio!" |
| 8 | exame-dna | O exame de DNA | A Gelinha falou a primeira palavra… e **CONGELOU O TITO INTEIRO** (bloco de gelo). "Como descongelar o Tito? Descobre no próximo episódio!" |
| 9 | descongelar-tito | Descongelando o Tito | Na água do gelo derretido boiava um **bilhete**: "Essa cozinha é minha. — O VERDADEIRO REI". "Quem é? Descobre no próximo episódio!" |
| 10 | verdadeiro-rei | O verdadeiro rei | A panela de pressão ficou tão brava que começou a **apitar cada vez mais alto e inchar**. "Ela vai EXPLODIR? Descobre no próximo episódio!" |
