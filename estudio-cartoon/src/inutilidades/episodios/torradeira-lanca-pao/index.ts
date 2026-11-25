import type { Episodio } from "../../episodios";
import { Demonstracao, Letrinhas, Oferta, Problema, Produto } from "./cenas";

/** INUTILIDADES 0800 · Ep. 11 "Torradeira Lança-Pão 3000" — formato curto. */
export const EPISODIO: Episodio = {
  cenas: [
    { id: "problema", Comp: Problema },
    { id: "produto", Comp: Produto, glitch: true },
    { id: "demonstracao", Comp: Demonstracao },
    { id: "oferta", Comp: Oferta, glitch: true },
    { id: "letrinhas", Comp: Letrinhas },
  ],
  semLegenda: ["letrinhas"],
};
