import { E1Gancho } from "./E1Gancho";
import { E2Nuvem } from "./E2Nuvem";
import { E3Colapso } from "./E3Colapso";
import { E4Disco } from "./E4Disco";
import { E5Sol } from "./E5Sol";
import { E6Planetas } from "./E6Planetas";
import { E7Lua } from "./E7Lua";
import { E8Conclusao } from "./E8Conclusao";

/** "Como surgiu o Sistema Solar?" (video: "sistema-solar") */
export const CENAS = [
  { id: "gancho", Comp: E1Gancho },
  { id: "nuvem", Comp: E2Nuvem },
  { id: "colapso", Comp: E3Colapso },
  { id: "disco", Comp: E4Disco },
  { id: "sol", Comp: E5Sol },
  { id: "planetas", Comp: E6Planetas },
  { id: "lua", Comp: E7Lua },
  { id: "conclusao", Comp: E8Conclusao },
];
