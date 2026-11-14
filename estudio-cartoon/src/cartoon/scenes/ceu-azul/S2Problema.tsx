import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Brilhos, Sol } from "../../components/Props";
import { Tag } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** COMEÇO: apresenta o personagem e o problema. Tito entra andando. */
export const S2Problema: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fisica = wordAt(scene, "física!");
  const sol = lineStart(scene, 1);
  const bora = lineStart(scene, 2);
  const x = interpolate(f, [0, 34], [-200, 540], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 2) });
  const andando = f < 34;
  const pose = f >= bora ? "comemorando" : f >= sol ? "apontandoCima" : f >= fisica ? "explicando" : andando ? "andando" : "parado";
  const prev = f >= bora ? "apontandoCima" : f >= sol ? "explicando" : "parado";
  const t = f >= bora ? (f - bora) / 8 : f >= sol ? (f - sol) / 8 : f >= fisica ? (f - fisica) / 8 : 1;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1 }, { f: sol, zoom: 1, y: 0 }, { f: sol + 20, zoom: 1.15, y: 160 }, { f: bora, zoom: 1.15, y: 160 }, { f: bora + 16, zoom: 1.05, y: 0 }]}>
        <CeuCampo chao={1300} />
        <Sol x={540} y={330} r={100} cor={C.white} piscadela={sol + 18} />
        <Brilhos x={540} y={330} at={sol + 18} />
        <PersonagemEm x={x} pe={1290} altura={680} boca={mouth} andando={andando} expressao={f >= bora ? "animado" : "feliz"} pose={pose} poseDe={prev} poseT={t} olharY={f >= sol && f < bora ? -0.9 : 0} corpoY={f >= bora ? -Math.abs(Math.sin((f - bora) * 0.25)) * 50 : 0} />
      </Camera>
      <Tag text="MÁGICA?" x={300} y={640} at={lineStart(scene, 0) + 2} bg={C.pink} />
      {f >= fisica && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <line x1={170} y1={600} x2={430} y2={680} stroke={C.red} strokeWidth={16} strokeLinecap="round" opacity={Math.min(1, (f - fisica) / 4)} />
        </svg>
      )}
      <Tag text="FÍSICA!" x={780} y={720} at={fisica} bg={C.yellow} size={66} />
      <Sfx at={0} name="whoosh" volume={0.5} />
      {[6, 14, 22, 30].map((s) => <Sfx key={s} at={s} name="click" volume={0.25} />)}
      <Sfx at={lineStart(scene, 0) + 2} name="pop" />
      <Sfx at={fisica} name="ding" volume={0.6} />
      <Sfx at={sol + 18} name="sparkle" volume={0.5} />
      <Sfx at={bora} name="boing" volume={0.5} />
    </Full>
  );
};
