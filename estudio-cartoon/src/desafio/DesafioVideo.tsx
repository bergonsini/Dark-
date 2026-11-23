import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import "../cartoon/fonts";
import ativo from "../../desafios/ativo.json";
import { DesafioFoguete, DURACAO as DUR_FOGUETE } from "./desafios/foguete";
import { DesafioBalao, DURACAO as DUR_BALAO } from "./desafios/balao";
import { DesafioCarro, DURACAO as DUR_CARRO } from "./desafios/carro";
import { DesafioCopo, DURACAO as DUR_COPO } from "./desafios/copo";
import { DesafioOvo, DURACAO as DUR_OVO } from "./desafios/ovo";

/**
 * CANAL 4 — desafio do pause (nome a definir). Neon/arcade, sem personagem fixo, SEM narração.
 * Catálogo de desafios: id (desafios/ativo.json "desafio") → componente + duração.
 */
export const DESAFIOS: Record<string, { Comp: React.FC; duracao: number }> = {
  foguete: { Comp: DesafioFoguete, duracao: DUR_FOGUETE },
  balao: { Comp: DesafioBalao, duracao: DUR_BALAO },
  carro: { Comp: DesafioCarro, duracao: DUR_CARRO },
  copo: { Comp: DesafioCopo, duracao: DUR_COPO },
  ovo: { Comp: DesafioOvo, duracao: DUR_OVO },
};

export const desafioAtivo = () => {
  const d = DESAFIOS[ativo.desafio];
  if (!d) throw new Error(`Desafio desconhecido: ${ativo.desafio}. Registre em src/desafio/DesafioVideo.tsx`);
  return d;
};

export const DesafioVideo: React.FC = () => {
  const { Comp, duracao } = desafioAtivo();
  return (
    <AbsoluteFill>
      <Comp />
      <Audio src={staticFile("desafio/audio/music.wav")} volume={(f) => 0.6 * interpolate(f, [duracao - 20, duracao], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
