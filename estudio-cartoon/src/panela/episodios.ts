import React from "react";
import { CenaProps } from "./common";
import * as estreia from "./episodios/estreia";

/** Catálogo de episódios do Panela Depressão: "video" do roteiro → cenas. */
export const EPISODIOS: Record<string, { id: string; Comp: React.FC<CenaProps> }[]> = {
  estreia: estreia.CENAS,
};
