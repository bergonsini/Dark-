import React from "react";
import { interpolate } from "remotion";
import { PersonagemEm } from "../characters/Personagem";
import { Espaco } from "../components/Backgrounds";
import { Camera } from "../components/Camera";
import { Feixe, LequeCores, Prisma, Sol } from "../components/Props";
import { Tag } from "../components/Text";
import { C, RAINBOW } from "../theme";
import { lineStart, wordAt } from "../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "./common";

const NOMES = ["vermelho,", "laranja,", "amarelo,", "verde,", "azul", "violeta,"];

/** DESENVOLVIMENTO 1: a luz branca é uma mistura de cores (prisma). */
export const S3Prisma: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l0 = lineStart(scene, 0);
  const mistura = wordAt(scene, "mistura");
  const beam = interpolate(f, [l0, l0 + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fan = interpolate(f, [mistura, mistura + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tudo = wordAt(scene, "tudo");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.1, x: 60 }, { f: mistura, zoom: 1, x: 0 }, { f: tudo, zoom: 1.05 }, { f: 260, zoom: 1.12, y: 40 }]}>
        <Espaco />
        <Sol x={140} y={450} r={70} cor={C.white} />
        <Feixe x1={185} y1={495} x2={390} y2={660} p={beam} cor={C.white} largura={26} />
        <LequeCores x={450} y={670} p={fan} abertura={50} comprimento={440} />
        <Prisma x={420} y={680} s={1.0} />
        {NOMES.map((n, i) => {
          const at = wordAt(scene, n);
          const ang = ((i - 2.5) / 5) * 50 * (Math.PI / 180);
          return <Tag key={n} text={n.replace(",", "").toUpperCase()} x={450 + Math.cos(ang) * 400} y={670 + Math.sin(ang) * 400 + (i - 2.5) * 34} at={at} bg={RAINBOW[i]} color={i === 2 ? C.outline : C.white} size={40} />;
        })}
        <PersonagemEm x={330} pe={1300} altura={540} boca={mouth} expressao={f > mistura ? "encantado" : "feliz"} pose={f > mistura ? "apontando" : "explicando"} poseDe="explicando" poseT={(f - mistura) / 8} olharX={0.6} olharY={-0.3} />
      </Camera>
      <Tag text="LUZ BRANCA = TODAS AS CORES" x={540} y={260} at={mistura} bg={C.white} size={50} />
      <Sfx at={l0} name="riser" volume={0.35} />
      <Sfx at={mistura} name="sparkle" volume={0.7} />
      <Sfx at={mistura + 4} name="ding" volume={0.4} />
      {NOMES.map((n) => <Sfx key={n} at={wordAt(scene, n)} name="pop" volume={0.45} />)}
    </Full>
  );
};
