import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { GEO, Manometro, Subduccao, Vulcao } from "../../components/Geo";
import { Seta } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** DESENVOLVIMENTO 3: subducção → a rocha derrete → o magma sobe → pressão → ERUPÇÃO. */
export const V5Magma: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const p = (a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const afunda = wordAt(scene, "afunda");
  const derrete = wordAt(scene, "derrete");
  const sobe = lineStart(scene, 1);
  const pressao = lineStart(scene, 2);
  const explode = wordAt(scene, "explode:");
  const erup = p(explode, 8);
  return (
    <Full>
      <Camera
        keys={[
          { f: 0, zoom: 1.25, y: -260 },
          { f: derrete, zoom: 1.25, y: -260 },
          { f: sobe, zoom: 1.1, y: -120 },
          { f: pressao, zoom: 1.05, y: 0 },
          { f: explode, zoom: 1.05, y: 0 },
          { f: explode + 12, zoom: 1.18, y: 220, x: -120 },
        ]}
        shakes={[explode, explode + 10, pressao + 16]}
        shakeAmp={20}
      >
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #2A1838 0%, #7A2E3A 30%, #E0663A 37%)` }} />
        <Subduccao derrete={p(derrete, 20)} sobe={p(sobe, 40)} pressao={p(pressao, 36)} />
        <Vulcao x={720} y={705} s={0.75} erupcao={erup} lava={p(explode + 6, 50)} fumaca={0.2 + p(pressao, 30) * 0.5} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={170} cy={700} rx={120} ry={30} fill="#7A6A5A" stroke={C.outline} strokeWidth={6} />
        </svg>
        <PersonagemEm x={170} pe={695} altura={360} boca={mouth} expressao={f >= explode ? "surpreso" : f >= pressao ? "preocupado" : "pensativo"} pose={f >= explode ? "assustado" : "apontando"} olharX={0.8} olharY={f >= explode ? -0.6 : 0.5} />
        {f >= sobe && f < explode && <Seta x={620} y={1120} rot={180} cor={GEO.lavaClara} />}
      </Camera>
      <Tag text="PLACA AFUNDA" x={300} y={1120} at={afunda} bg={C.white} size={42} />
      {f >= derrete && f < explode && <Tag text="MAGMA" x={420} y={1330} at={derrete + 4} bg={GEO.lava} color={C.white} size={56} />}
      {f >= sobe && f < explode && <Tag text="MAIS LEVE: SOBE" x={540} y={260} at={sobe + 4} bg={C.yellow} size={46} />}
      {f >= pressao && f < explode && <Manometro x={900} y={1180} p={p(pressao, 36)} />}
      {f >= explode && <TitleSlam text="ERUPÇÃO!" top={230} size={150} color={C.yellow} at={explode} />}
      <Sfx at={afunda} name="whoosh" volume={0.4} />
      <Sfx at={derrete} name="borbulha" volume={0.6} />
      <Sfx at={sobe} name="riser" volume={0.35} />
      <Sfx at={pressao} name="ronco" volume={0.45} />
      <Sfx at={explode} name="boom" volume={0.55} />
      <Sfx at={explode + 2} name="whoosh" volume={0.35} />
    </Full>
  );
};
