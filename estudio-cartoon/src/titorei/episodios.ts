import React from "react";
import { CenaProps } from "./common";
import * as geladeira from "./episodios/geladeira-demissao";
import * as nuvem from "./episodios/nuvem-funcionaria";
import * as relogio from "./episodios/relogio-gerente";
import * as planta from "./episodios/planta-rainha";
import * as eleicao from "./episodios/grande-eleicao";
import * as pipoca from "./episodios/golpe-pipoca";
import * as geladeirinha from "./episodios/geladeirinha";
import * as exame from "./episodios/exame-dna";
import * as descongelar from "./episodios/descongelar-tito";

/** Catálogo de episódios do Titorei: pasta ./episodios/<video>/ com index.ts exportando CENAS. */
export const EPISODIOS: Record<string, { id: string; Comp: React.FC<CenaProps> }[]> = {
  "geladeira-demissao": geladeira.CENAS,
  "nuvem-funcionaria": nuvem.CENAS,
  "relogio-gerente": relogio.CENAS,
  "planta-rainha": planta.CENAS,
  "grande-eleicao": eleicao.CENAS,
  "golpe-pipoca": pipoca.CENAS,
  geladeirinha: geladeirinha.CENAS,
  "exame-dna": exame.CENAS,
  "descongelar-tito": descongelar.CENAS,
};
