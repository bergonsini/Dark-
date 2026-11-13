import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../characters/Personagem";
import { CeuCampo } from "../components/Backgrounds";
import { Camera } from "../components/Camera";
import { Feixe, Molecula, RaioZigue } from "../components/Props";
import { Tag } from "../components/Text";
import { C } from "../theme";
import { lineStart } from "../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "./common";

const MOL: [number, number][] = [
  [200, 380], [420, 300], [680, 360], [900, 280], [300, 600], [560, 560], [820, 620], [160, 820], [430, 860], [700, 820], [940, 880],
];

/** DESENVOLVIMENTO 2: espalhamento. A luz azul quica nas partículas do ar; a vermelha passa reto. */
export const S4Espalhamento: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const [l0, l1, l2, l3] = [0, 1, 2, 3].map((i) => lineStart(scene, i));
  const p = (a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const azulCeu = p(l2, 40);
  const zigs: [number, number][][] = [
    [[-40, 120], [200, 380], [420, 300], [300, 600], [560, 560], [680, 360], [900, 280], [1120, 180]],
    [[200, 380], [160, 820], [430, 860], [560, 560], [820, 620], [940, 880], [1120, 1000]],
    [[420, 300], [680, 360], [820, 620], [700, 820], [430, 860], [-40, 1000]],
  ];
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.12, y: 80 }, { f: l1, zoom: 1.05, y: 40 }, { f: l2 + 30, zoom: 1, y: 0 }, { f: l3, zoom: 1.06, x: -30 }]} shakes={[l1 + 6]}>
        <CeuCampo chao={1300} topo="#9FB7D6" base="#D9E4F0" nuvens={false} />
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.skyDeep}, ${C.sky})`, opacity: azulCeu }} />
        <Feixe x1={-40} y1={120} x2={200} y2={380} p={p(l0, 20)} cor={C.white} largura={22} />
        {MOL.map(([x, y], i) => (
          <Molecula key={i} x={x} y={y} seed={i} r={i % 3 === 0 ? 30 : 36} hit={l1 + 4 + i * 5} />
        ))}
        <RaioZigue pontos={zigs[0]} cor={C.blue} p={p(l1, 50)} />
        <RaioZigue pontos={zigs[1]} cor={C.blue} p={p(l2 - 6, 45)} />
        <RaioZigue pontos={zigs[2]} cor={C.blue} p={p(l2 + 4, 45)} />
        <Feixe x1={-40} y1={1040} x2={1120} y2={1180} p={p(l3, 30)} cor={C.red} largura={18} />
        <PersonagemEm x={760} pe={1290} altura={520} boca={mouth} expressao={f >= l3 ? "surpreso" : f >= l2 ? "encantado" : "pensativo"} pose={f >= l2 && f < l3 ? "comemorando" : "apontandoCima"} poseDe="apontandoCima" poseT={f >= l2 && f < l3 ? (f - l2) / 8 : 1} olharX={f >= l3 ? -0.8 : -0.3} olharY={f >= l3 ? 0.2 : -0.8} />
      </Camera>
      <Tag text="PARTÍCULAS DO AR" x={540} y={190} at={l0 + 30} bg={C.white} size={46} />
      <Tag text="AZUL QUICA!" x={300} y={1080} at={l1 + 10} bg={C.blue} color={C.white} size={52} />
      <Tag text="VERMELHO PASSA RETO" x={540} y={1220} at={l3 + 20} bg={C.red} color={C.white} size={44} />
      <Sfx at={l0} name="whoosh" volume={0.5} />
      {MOL.map((_, i) => <Sfx key={i} at={l1 + 4 + i * 5} name="boing" volume={0.18} />)}
      <Sfx at={l2} name="sparkle" volume={0.6} />
      <Sfx at={l3} name="whoosh" volume={0.6} />
    </Full>
  );
};
