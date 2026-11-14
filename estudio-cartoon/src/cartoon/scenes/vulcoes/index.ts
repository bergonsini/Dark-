import { V1Gancho } from "./V1Gancho";
import { V2Descida } from "./V2Descida";
import { V3Interior } from "./V3Interior";
import { V4Placas } from "./V4Placas";
import { V5Magma } from "./V5Magma";
import { V6Brasil } from "./V6Brasil";
import { V7Conclusao } from "./V7Conclusao";

/** "Por que vulcões existem?" (roteiro.json, video: "vulcoes") */
export const CENAS = [
  { id: "gancho", Comp: V1Gancho },
  { id: "descida", Comp: V2Descida },
  { id: "interior", Comp: V3Interior },
  { id: "placas", Comp: V4Placas },
  { id: "magma", Comp: V5Magma },
  { id: "brasil", Comp: V6Brasil },
  { id: "conclusao", Comp: V7Conclusao },
];
