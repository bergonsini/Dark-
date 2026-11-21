import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill } from "remotion";
import "../cartoon/fonts";
import { PersonagemEm } from "../cartoon/characters/Personagem";
import { CameraRig, frente } from "../titorei/CameraRig";
import { Luzes } from "../titorei/lowpoly";
import { Capivara } from "../titorei/personagens/Capivara";
import { TitoRei } from "../titorei/personagens/TitoRei";
import { Geladeira } from "../titorei/objetos/Cozinha";
import { MicroOndas } from "../titorei/objetos/MicroOndas";
import { RelogioGerente } from "../titorei/objetos/Relogio";
import { DoutorOferta, SeuKuka } from "../inutilidades/Personagens";

/**
 * Mascotes (fundo transparente, 1080x1080) para as aberturas de módulo da apostila "Estúdio de Bolso".
 * Render: npx remotion still CursoMascote out/m.png --props='{"m":"capivara"}' --image-format=png
 */
export type MascoteId =
  | "tito-explicando"
  | "tito-apontando"
  | "tito-comemorando"
  | "tito-pensando"
  | "titorei"
  | "capivara"
  | "geladeira"
  | "microondas"
  | "relogio"
  | "doutor"
  | "kuka";

const Tres: React.FC<{ children: React.ReactNode; alvo: [number, number, number]; dist: number; altura: number; rotY?: number; fov?: number }> = ({ children, alvo, dist, altura, rotY = 0, fov = 34 }) => (
  <ThreeCanvas width={1080} height={1080} flat gl={{ alpha: true, antialias: true }} camera={{ fov: 40, position: [0, 2, 6] }}>
    <Luzes />
    <CameraRig keys={[{ f: 0, ...frente(alvo, rotY, dist, altura, fov) }]} />
    {children}
  </ThreeCanvas>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1080} viewBox="-40 620 1160 1200" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

export const Mascote: React.FC<{ m: MascoteId }> = ({ m }) => {
  let c: React.ReactNode = null;
  if (m.startsWith("tito-")) {
    const pose = { "tito-explicando": "explicando", "tito-apontando": "apontandoCima", "tito-comemorando": "comemorando", "tito-pensando": "pensando" }[m as "tito-explicando"] as "explicando";
    const expr = { "tito-explicando": "feliz", "tito-apontando": "animado", "tito-comemorando": "encantado", "tito-pensando": "pensativo" }[m as "tito-explicando"] as "feliz";
    c = <PersonagemEm x={540} pe={1060} altura={1000} boca={m === "tito-comemorando" ? 0.6 : 0.25} expressao={expr} pose={pose} />;
  } else if (m === "titorei") {
    c = (
      <Tres alvo={[0, 0, 0]} dist={6.2} altura={1.35} rotY={0.25}>
        <TitoRei pos={[0, 0, 0]} expr="feliz" pose="acenando" />
      </Tres>
    );
  } else if (m === "capivara") {
    c = (
      <Tres alvo={[0, 0, 0]} dist={4.8} altura={0.8} rotY={0.6}>
        <Capivara pos={[0, 0, 0]} zen fechado={0.85} coroa />
      </Tres>
    );
  } else if (m === "geladeira") {
    c = (
      <Tres alvo={[0, 0, 0]} dist={5.4} altura={1.3} rotY={0.3}>
        <Geladeira pos={[0, 0, 0]} expr="feliz" oculos={1} bracos={1} />
      </Tres>
    );
  } else if (m === "microondas") {
    c = (
      <Tres alvo={[0, 0, 0]} dist={5.4} altura={1.25} rotY={0.3}>
        <MicroOndas pos={[0, 0, 0]} escala={1.3} expr="feliz" coroa />
      </Tres>
    );
  } else if (m === "relogio") {
    c = (
      <Tres alvo={[0, 0, 0]} dist={3.4} altura={0.9} rotY={0.25}>
        <RelogioGerente pos={[0, 0, 0]} expr="feliz" />
      </Tres>
    );
  } else if (m === "doutor") {
    c = (
      <Svg>
        <DoutorOferta x={540} y={1760} escala={1} pose="bracosAbertos" expr="sorriso" />
      </Svg>
    );
  } else if (m === "kuka") {
    c = (
      <Svg>
        <SeuKuka x={540} y={1760} escala={1} banguela careca pose="joinha" feliz />
      </Svg>
    );
  }
  return <AbsoluteFill style={{ background: "transparent" }}>{c}</AbsoluteFill>;
};
