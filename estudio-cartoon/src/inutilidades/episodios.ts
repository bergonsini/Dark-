import React from "react";
import { CenaProps } from "./common";
import * as controle from "./episodios/controle-remoto";
import * as escova from "./episodios/escova-turbo";
import * as tapete from "./episodios/tapete-turbo";
import * as pilula from "./episodios/pilula-pena";
import * as ratoeira from "./episodios/ratoeira-explosiva";

export type Episodio = {
  cenas: { id: string; Comp: React.FC<CenaProps>; glitch?: boolean; glitchEm?: number }[];
  /** cenas sem a legenda padrão (ex.: as letrinhas miúdas já aparecem na tela) */
  semLegenda?: string[];
  /** trechos (frames globais) em que a fita está em PAUSE: o HUD mostra "PAUSE ‖" */
  pausas?: () => [number, number][];
};

/** Catálogo de comerciais do INUTILIDADES 0800: id do vídeo (roteiro.json "video") -> cenas. */
export const EPISODIOS: Record<string, Episodio> = {
  "ratoeira-explosiva": ratoeira.EPISODIO,
  "escova-turbo": escova.EPISODIO,
  "controle-remoto": controle.EPISODIO,
  "tapete-turbo": tapete.EPISODIO,
  "pilula-pena": pilula.EPISODIO,
};
