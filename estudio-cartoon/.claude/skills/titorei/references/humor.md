# Escrevendo humor absurdo (Titorei)

## A fórmula da escalada
1. **Premissa absurda dita como fato** no gancho: "A geladeira do Tito pediu demissão."
2. **Lógica interna séria**: o absurdo tem motivo ("cansada de passar frio") e consequência ("foi pra praia").
3. **Cada cena sobe um degrau** e puxa a próxima: geladeira de férias → falta geladeira → contrata uma capivara →
   a capivara não gela, mas acalma → a cozinha inteira vira zen → o Tito vira o "rei da cozinha zen".
4. **Gancho final de mistério** (padrão da série): algo inesperado acontece no último plano e fica sem resposta
   ("…e deixou uma caixa que fazia tic-tac. O que tem dentro? Descobre no próximo episódio!") + título "CONTINUA…".
5. **Continuidade**: o episódio seguinte começa resolvendo esse mistério (ver `titorei/serie.md`).

## Técnicas
- **Personificação**: objetos e bichos com emprego, sentimentos, burocracia (demissão, férias, contrato, sindicato).
- **Literalizar expressões**: "leite com medo de azedar", "cubinhos derretendo de tanto sol".
- **Seco/deadpan**: a narração conta o absurdo como notícia normal; a graça vem do contraste.
- **Títulos de capítulo** batizam o absurdo como se fosse um produto/profissão: "CAPIVARA REFRIGERADORA",
  "GELADEIRA DE FÉRIAS", "COZINHA ZEN".
- **Elenco recorrente** (criar reconhecimento): Tito.rei, a capivara, a geladeira. Pode crescer com novos bichos/objetos.
- Humor leve e para todas as idades: sem ofensa, sem pessoas reais, sem marcas.

## Formato do roteiro (titorei/roteiro.json)
```json
{
  "projeto": "titorei", "video": "slug-do-episodio", "titulo": "...",
  "fps": 30, "duracaoSegundos": 60,
  "saida": { "timeline": "src/titorei/timeline.json", "audio": "public/titorei/audio" },
  "pausas": { "entreCenas": 0.25, "final": 1.6 },
  "voz": { ... }, "musica": { "bpm": 124, "tom": -5 },
  "cenas": [
    { "id": "gancho", "capitulo": "TEXTO DO GANCHO NA TELA", "falas": [ { "texto": "...", "pronuncia": "[excited] ..." } ] }
  ]
}
```
~140–150 palavras para 60 s (6–9 cenas). Frases de 5–12 palavras. Pausas curtas (ritmo rápido).
Na voz Jonas (~150 palavras/min) isso fica perto de 60 s; se passar, ajuste `pausas` (sem custo).
