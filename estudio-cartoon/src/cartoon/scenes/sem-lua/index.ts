import { L1Gancho } from "./L1Gancho";
import { L2Puf } from "./L2Puf";
import { L3Noite } from "./L3Noite";
import { L4Mares } from "./L4Mares";
import { L5Quiz } from "./L5Quiz";
import { L6Eixo } from "./L6Eixo";
import { L7Conclusao } from "./L7Conclusao";

/** "E se a Lua sumisse?" (video: "sem-lua") */
export const CENAS = [
  { id: "gancho", Comp: L1Gancho },
  { id: "puf", Comp: L2Puf },
  { id: "noite", Comp: L3Noite },
  { id: "mares", Comp: L4Mares },
  { id: "quiz", Comp: L5Quiz },
  { id: "eixo", Comp: L6Eixo },
  { id: "conclusao", Comp: L7Conclusao },
];
