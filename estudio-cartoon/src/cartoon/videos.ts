import React from "react";
import { SceneProps } from "./scenes/common";
import * as ceuAzul from "./scenes/ceu-azul";
import * as vulcoes from "./scenes/vulcoes";

/**
 * Catálogo de vídeos. Cada vídeo tem sua pasta em ./scenes/<id>/ com um index.ts que exporta CENAS
 * (ids na mesma ordem do roteiro). O vídeo renderizado é o do campo "video" do roteiro usado no
 * `npm run audio` (fica gravado em timeline.json).
 */
export type Cena = { id: string; Comp: React.FC<SceneProps> };

export const VIDEOS: Record<string, Cena[]> = {
  "ceu-azul": ceuAzul.CENAS,
  vulcoes: vulcoes.CENAS,
};

export const cenasDoVideo = (video?: string): Cena[] => {
  const cenas = VIDEOS[video ?? "ceu-azul"];
  if (!cenas) throw new Error(`Vídeo desconhecido: ${video}. Registre em src/cartoon/videos.ts`);
  return cenas;
};
