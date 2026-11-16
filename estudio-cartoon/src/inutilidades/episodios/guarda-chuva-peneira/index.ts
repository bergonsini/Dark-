import type { Episodio } from "../../episodios";
import { Demonstracao, Depoimento, Gancho, Letrinhas, Oferta, Problema, Produto } from "./cenas";

/** INUTILIDADES 0800 · Ep. 4 "Guarda-Chuva Peneira" */
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
};
