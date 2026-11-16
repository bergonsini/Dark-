import type { Episodio } from "../../episodios";
import { timeline, wordAt } from "../../timeline";
import { Demonstracao, Depoimento, Gancho, Letrinhas, Oferta, Problema, Produto } from "./cenas";

const cena = (id: string) => timeline.scenes.find((s) => s.id === id)!;
const g = (id: string, palavra: string) => cena(id).startFrame + wordAt(cena(id), palavra);

/** INUTILIDADES 0800 · Ep. 3 "Controle Remoto Universal de Verdade" */
export const EPISODIO: Episodio = {
  cenas: [
    { id: "gancho", Comp: Gancho },
    { id: "problema", Comp: Problema },
    { id: "produto", Comp: Produto, glitch: true },
    { id: "demonstracao", Comp: Demonstracao },
    { id: "depoimento", Comp: Depoimento, glitch: true },
    { id: "oferta", Comp: Oferta, glitch: true },
    { id: "letrinhas", Comp: Letrinhas },
  ],
  semLegenda: ["letrinhas"],
  // a fita fica em PAUSE quando o controle congela o mundo
  pausas: () => [
    [0, cena("gancho").endFrame],
    [g("problema", "pause"), cena("problema").endFrame],
    [g("demonstracao", "para"), cena("demonstracao").startFrame + cena("demonstracao").lines[1].startFrame - cena("demonstracao").startFrame],
    [g("depoimento", "rato"), g("depoimento", "segunda-feira")],
  ],
};
