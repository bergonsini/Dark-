import type { Episodio } from "../../episodios";
import { getScene } from "../../timeline";
import { Demonstracao, Letrinhas, Oferta, Problema, Produto } from "./cenas";

/** INUTILIDADES 0800 · Ep. 9 "Fone Antirruído Extremo" — formato curto. A fala da Dona Cleide fica MUDA (piada). */
export const EPISODIO: Episodio = {
  cenas: [
    { id: "problema", Comp: Problema },
    { id: "produto", Comp: Produto, glitch: true },
    { id: "demonstracao", Comp: Demonstracao },
    { id: "oferta", Comp: Oferta, glitch: true },
    { id: "letrinhas", Comp: Letrinhas },
  ],
  semLegenda: ["letrinhas"],
  mudos: () => {
    const s = getScene("demonstracao");
    const l = s.lines.find((x) => x.quem === "cleide");
    return l ? [[l.startFrame - 2, l.endFrame + 4]] : [];
  },
};
