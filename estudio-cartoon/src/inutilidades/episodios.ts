import React from "react";
import { CenaProps } from "./common";
import * as escova from "./episodios/escova-turbo";
import * as ratoeira from "./episodios/ratoeira-explosiva";

export type Episodio = {
  cenas: { id: string; Comp: React.FC<CenaProps>; glitch?: boolean; glitchEm?: number }[];
  /** cenas sem a legenda padrão (ex.: as letrinhas miúdas já aparecem na tela) */
  semLegenda?: string[];
};

/** Catálogo de comerciais do INUTILIDADES 0800: id do vídeo (roteiro.json "video") -> cenas. */
export const EPISODIOS: Record<string, Episodio> = {
  "ratoeira-explosiva": ratoeira.EPISODIO,
  "escova-turbo": escova.EPISODIO,
};
