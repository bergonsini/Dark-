import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { GEO, IlhaVulcanica, MapaAmericaSul } from "../../components/Geo";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** CURIOSIDADE: o Brasil fica no meio de uma placa (sem vulcões ativos); Noronha nasceu de um vulcão. */
export const V6Brasil: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const brasil = wordAt(scene, "brasil?");
  const bordas = wordAt(scene, "bordas.");
  const l1 = lineStart(scene, 1);
  const noronha = wordAt(scene, "fernando");
  const p = (a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ilha = p(noronha + 14, 12);
  const br = useSpringAt(brasil);
  return (
    <Full>
      <Camera
        keys={[
          { f: 0, zoom: 1.1 },
          { f: brasil, zoom: 1.0 },
          { f: noronha, zoom: 1.0, x: 0, y: 0 },
          { f: noronha + 18, zoom: 2.2, x: -1012, y: 489 },
        ]}
      >
        <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 50%, #4A9BE8, ${GEO.oceano} 75%)` }} />
        <MapaAmericaSul brasil={br} borda={p(bordas, 24)} noronha={p(noronha, 10)} />
        <PersonagemEm x={880} pe={1330} altura={400} boca={mouth} expressao={f >= l1 ? "pensativo" : "feliz"} pose={f >= l1 ? "pensando" : "apontando"} espelhar olharX={-0.6} cabeca={f >= l1 && f < noronha ? Math.sin(f * 0.4) * 8 : 0} />
      </Camera>
      {f < noronha + 14 && (
        <>
          <Tag text="BRASIL" x={720} y={860} at={brasil + 4} bg={C.yellow} size={52} />
          {f >= bordas && <Tag text="BORDA DA PLACA" x={300} y={500} at={bordas + 4} bg={C.red} color={C.white} size={40} />}
          {f >= l1 && <Tag text="SEM VULCÕES ATIVOS" x={620} y={430} at={l1 + 4} bg={C.white} size={44} />}
        </>
      )}
      {ilha > 0 && (
        <AbsoluteFill style={{ opacity: ilha }}>
          <IlhaVulcanica chao={1260} />
          <PersonagemEm x={780} pe={1240} altura={400} boca={mouth} expressao="encantado" pose="acenando" olharX={-0.5} olharY={-0.4} />
          <Tag text="FERNANDO DE NORONHA" x={540} y={260} at={noronha + 18} bg={C.yellow} size={50} />
          <Tag text="VULCÃO EXTINTO" x={540} y={380} at={noronha + 30} bg={C.white} size={44} />
        </AbsoluteFill>
      )}
      <Sfx at={brasil} name="pop" volume={0.6} />
      <Sfx at={bordas} name="whoosh" volume={0.4} />
      <Sfx at={l1 + 4} name="click" volume={0.5} />
      <Sfx at={noronha} name="riser" volume={0.35} />
      <Sfx at={noronha + 18} name="sparkle" volume={0.6} />
    </Full>
  );
};
