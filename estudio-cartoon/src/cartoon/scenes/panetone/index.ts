import { P1Gancho } from "./P1Gancho";
import { P2Origem } from "./P2Origem";
import { P3Luxo } from "./P3Luxo";
import { P4Trabalho } from "./P4Trabalho";
import { P5Fabrica } from "./P5Fabrica";
import { P6Pascoa } from "./P6Pascoa";
import { P7Conclusao } from "./P7Conclusao";

/** "Por que o panetone só aparece no Natal?" (video: "panetone") */
export const CENAS = [
  { id: "gancho", Comp: P1Gancho },
  { id: "origem", Comp: P2Origem },
  { id: "luxo", Comp: P3Luxo },
  { id: "trabalho", Comp: P4Trabalho },
  { id: "fabrica", Comp: P5Fabrica },
  { id: "pascoa", Comp: P6Pascoa },
  { id: "conclusao", Comp: P7Conclusao },
];
