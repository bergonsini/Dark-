import { S1Gancho } from "./S1Gancho";
import { S2Problema } from "./S2Problema";
import { S3Prisma } from "./S3Prisma";
import { S4Espalhamento } from "./S4Espalhamento";
import { S5Violeta } from "./S5Violeta";
import { S6PorDoSol } from "./S6PorDoSol";
import { S7Marte } from "./S7Marte";
import { S8Conclusao } from "./S8Conclusao";

/** "Por que o céu é azul?" (roteiros/ceu-azul.json) */
export const CENAS = [
  { id: "gancho", Comp: S1Gancho },
  { id: "problema", Comp: S2Problema },
  { id: "prisma", Comp: S3Prisma },
  { id: "espalhamento", Comp: S4Espalhamento },
  { id: "violeta", Comp: S5Violeta },
  { id: "por-do-sol", Comp: S6PorDoSol },
  { id: "marte", Comp: S7Marte },
  { id: "conclusao", Comp: S8Conclusao },
];
