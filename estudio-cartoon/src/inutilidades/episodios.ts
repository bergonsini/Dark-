import React from "react";
import { CenaProps } from "./common";
import * as controle from "./episodios/controle-remoto";
import * as escova from "./episodios/escova-turbo";
import * as tapete from "./episodios/tapete-turbo";
import * as pilula from "./episodios/pilula-pena";
import * as secador from "./episodios/secador-jato";
import * as ratoeira from "./episodios/ratoeira-explosiva";
import * as despertador from "./episodios/despertador-soco";
import * as liquidificador from "./episodios/liquidificador-sem-tampa";
import * as fone from "./episodios/fone-antirruido";
import * as gps from "./episodios/gps-pessimista";

export type Episodio = {
  cenas: { id: string; Comp: React.FC<CenaProps>; glitch?: boolean; glitchEm?: number }[];
  /** cenas sem a legenda padrão (ex.: as letrinhas miúdas já aparecem na tela) */
  semLegenda?: string[];
  /** trechos (frames globais) em que a fita está em PAUSE: o HUD mostra "PAUSE ‖" */
  pausas?: () => [number, number][];
  /** trechos (frames globais) em que a NARRAÇÃO fica muda (piada do som cortado) */
  mudos?: () => [number, number][];
};

/** Catálogo de comerciais do INUTILIDADES 0800: id do vídeo (roteiro.json "video") -> cenas. */
export const EPISODIOS: Record<string, Episodio> = {
  "ratoeira-explosiva": ratoeira.EPISODIO,
  "escova-turbo": escova.EPISODIO,
  "controle-remoto": controle.EPISODIO,
  "tapete-turbo": tapete.EPISODIO,
  "pilula-pena": pilula.EPISODIO,
  "secador-jato": secador.EPISODIO,
  "despertador-soco": despertador.EPISODIO,
  "liquidificador-sem-tampa": liquidificador.EPISODIO,
  "fone-antirruido": fone.EPISODIO,
  "gps-pessimista": gps.EPISODIO,
};
