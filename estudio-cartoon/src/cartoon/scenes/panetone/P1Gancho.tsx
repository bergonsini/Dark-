import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Arvore, Calendario, Neve, Panetone, SalaNatal } from "../../components/Natal";
import { TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** 0-3 s: GANCHO. Panetone gigante (com carinha) salta na tela + pergunta no frame 0. */
export const P1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const natal = wordAt(scene, "natal?");
  const pula = useSpringAt(0, { damping: 7, stiffness: 160 });
  const cal = useSpringAt(natal - 4, { damping: 9, stiffness: 180 });
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  const squash = interpolate(f, [0, 5, 10, 16], [0.6, 1.25, 0.92, 1], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.35, y: 60 }, { f: 30, zoom: 1.05 }, { f: 100, zoom: 1.1 }]} shakes={[0]}>
        <SalaNatal chao={1330} />
        <Neve n={40} />
        <Arvore x={910} y={1330} s={0.85} />
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - pula) * 700}px) scale(1, ${squash})`, transformOrigin: "560px 1330px" }}>
          <Panetone x={560} y={1330} s={1.55} rosto boca={Math.abs(Math.sin(f * 0.4)) * (f < 40 ? 1 : 0.3)} />
        </div>
        <PersonagemEm x={210} pe={1330} altura={520} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.8} olharY={-0.3} acessorio="gorroNatal" corpoY={f < 10 ? -Math.sin((f / 10) * Math.PI) * 50 : 0} />
      </Camera>
      {f >= natal - 4 && <Calendario x={300} y={640} mes="DEZ" dia="25" s={cal * 0.9} destaque={interpolate(f, [natal, natal + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O PANETONE" top={160} size={98} color={C.white} at={0} />
      <TitleSlam text="SÓ APARECE NO NATAL?" top={1380} size={100} color={C.yellow} at={Math.max(0, natal - 8)} rotate={2} />
      <Sfx at={0} name="boing" volume={0.8} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={natal - 4} name="pop" volume={0.7} />
      <Sfx at={natal + 4} name="sparkle" volume={0.5} />
    </Full>
  );
};
