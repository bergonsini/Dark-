import React from "react";
import { CenaProps } from "./common";
import * as geladeira from "./episodios/geladeira-demissao";

/** Catálogo de episódios do Titorei: pasta ./episodios/<video>/ com index.ts exportando CENAS. */
export const EPISODIOS: Record<string, { id: string; Comp: React.FC<CenaProps> }[]> = {
  "geladeira-demissao": geladeira.CENAS,
};
