import React from "react";
import { SceneProps } from "./scenes/common";
import * as ceuAzul from "./scenes/ceu-azul";
import * as vulcoes from "./scenes/vulcoes";
import * as sistemaSolar from "./scenes/sistema-solar";
import * as panetone from "./scenes/panetone";
import * as semLua from "./scenes/sem-lua";
import * as marSalgado from "./scenes/mar-salgado";
import * as cebola from "./scenes/cebola";
import * as gatoDePe from "./scenes/gato-de-pe";
import * as chocolate from "./scenes/chocolate";
import * as soluco from "./scenes/soluco";

/**
 * Catálogo de vídeos. Cada vídeo tem sua pasta em ./scenes/<id>/ com um index.ts que exporta CENAS
 * (ids na mesma ordem do roteiro). O vídeo renderizado é o do campo "video" do roteiro usado no
 * `npm run audio` (fica gravado em timeline.json).
 */
export type Cena = { id: string; Comp: React.FC<SceneProps> };

export const VIDEOS: Record<string, Cena[]> = {
  "ceu-azul": ceuAzul.CENAS,
  vulcoes: vulcoes.CENAS,
  "sistema-solar": sistemaSolar.CENAS,
  panetone: panetone.CENAS,
  "sem-lua": semLua.CENAS,
  "mar-salgado": marSalgado.CENAS,
  cebola: cebola.CENAS,
  "gato-de-pe": gatoDePe.CENAS,
  chocolate: chocolate.CENAS,
  soluco: soluco.CENAS,
};

export const cenasDoVideo = (video?: string): Cena[] => {
  const cenas = VIDEOS[video ?? "ceu-azul"];
  if (!cenas) throw new Error(`Vídeo desconhecido: ${video}. Registre em src/cartoon/videos.ts`);
  return cenas;
};
