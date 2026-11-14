import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Feixe, Molecula, RaioZigue, Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** DESENVOLVIMENTO 4: pôr do sol. A luz atravessa mais ar, o azul se perde, sobra laranja/vermelho. */
export const S6PorDoSol: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const [l0, l1, l2] = [0, 1, 2].map((i) => lineStart(scene, i));
  const laranja = wordAt(scene, "laranja");
  const k = interpolate(f, [l0, laranja + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topo = interpolateColors(k, [0, 0.5, 1], [C.skyDeep, "#7A5BC7", "#3B1F6B"]);
  const base = interpolateColors(k, [0, 0.5, 1], [C.sky, "#FFB36B", C.orange]);
  const solY = interpolate(k, [0, 1], [380, 1120]);
  const solCor = interpolateColors(k, [0, 1], [C.yellow, C.red]);
  const raio = interpolate(f, [l0 + 10, l0 + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diag = f < l2;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l2, zoom: 1.05 }, { f: l2 + 30, zoom: 1.2, y: 120 }, { f: 260, zoom: 1.24, y: 130 }]}>
        <CeuCampo topo={topo} base={base} chao={1300} colina1={interpolateColors(k, [0, 1], [C.grass, "#3F5E3A"])} colina2={interpolateColors(k, [0, 1], [C.grassDark, "#2C4430"])} corNuvem={interpolateColors(k, [0, 1], [C.white, "#FFC2A1"])} />
        <Sol x={900} y={solY} r={90} cor={solCor} />
        {diag && (
          <>
            {[[740, 1060], [560, 1010], [380, 1050], [200, 1000]].map(([x, y], i) => (
              <Molecula key={i} x={x} y={y} seed={i * 5} r={28} hit={l0 + 18 + i * 8} />
            ))}
            <Feixe x1={860} y1={1120} x2={-40} y2={1030} p={raio} cor={interpolateColors(raio, [0, 0.5, 1], [C.white, C.yellow, C.orange])} largura={20} />
            {[[740, 1060], [560, 1010], [380, 1050]].map(([x, y], i) => (
              <RaioZigue key={i} pontos={[[x, y], [x - 60, y - 200], [x + 40, y - 420]]} cor={C.blue} p={interpolate(f, [l1 + i * 8, l1 + i * 8 + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} largura={10} />
            ))}
          </>
        )}
        <PersonagemEm x={330} pe={1290} altura={600} boca={mouth} expressao={f >= l2 ? "encantado" : "pensativo"} pose={f >= l2 ? "maosNaCintura" : "explicando"} poseDe="explicando" poseT={(f - l2) / 10} olharX={0.8} olharY={-0.2} cabeca={f >= l2 ? 6 : 0} />
      </Camera>
      <Tag text="MUITO MAIS AR NO CAMINHO" x={540} y={230} at={l0 + 20} bg={C.white} size={44} />
      {f >= l1 && <Tag text="AZUL SE PERDE" x={540} y={340} at={l1 + 10} bg={C.blue} color={C.white} size={44} />}
      <Sfx at={l0} name="whoosh" volume={0.45} />
      {[0, 1, 2].map((i) => <Sfx key={i} at={l1 + i * 8} name="boing" volume={0.25} />)}
      <Sfx at={laranja} name="sparkle" volume={0.6} />
      <Sfx at={l2} name="ding" volume={0.4} />
    </Full>
  );
};
