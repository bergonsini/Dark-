import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { CeuNoturno, LuaPersonagem, Poof, QuizCards } from "../../components/Lua";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineEnd, lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** Contagem regressiva 3-2-1, PUF (a Lua some) e o PALPITE interativo com cronômetro. */
export const L2Puf: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const tres = wordAt(scene, "três,");
  const dois = wordAt(scene, "dois,");
  const um = wordAt(scene, "um…");
  const puf = wordAt(scene, "puf!");
  const l1 = lineStart(scene, 1);
  const fim = scene.endFrame - scene.startFrame;
  const luar = interpolate(f, [puf, puf + 24], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [puf, puf + 3, puf + 14], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const num = f >= puf ? "" : f >= um ? "1" : f >= dois ? "2" : f >= tres ? "3" : "";
  const numAt = f >= um ? um : f >= dois ? dois : tres;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: puf - 2, zoom: 1.2, y: 120 }, { f: puf + 10, zoom: 1.0 }]} shakes={[puf]} shakeAmp={26}>
        <CeuNoturno luar={luar} />
        {f < puf + 2 && <LuaPersonagem x={560} y={660} r={200} expr="nervosa" />}
        <Poof x={560} y={660} at={puf} r={220} />
        <PersonagemEm x={900} pe={1340} altura={360} boca={mouth} expressao={f >= l1 ? "pensativo" : f >= puf ? "surpreso" : "preocupado"} pose={f >= l1 ? "pensando" : f >= puf ? "assustado" : "parado"} espelhar olharX={-0.6} olharY={-0.6} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      {num && <TitleSlam key={num} text={num} top={960} size={260} color={C.yellow} at={numAt} rotate={0} />}
      {f >= puf && f < l1 && <TitleSlam text="PUF!" top={560} size={200} color={C.white} at={puf} />}
      {f >= l1 && (
        <>
          <Tag text="PALPITE RÁPIDO!" x={540} y={260} at={l1} bg={C.yellow} size={56} />
          <QuizCards
            y={420}
            opcoes={[
              { letra: "A", texto: "NOITES ESCURAS", cor: C.violet, at: l1 + 10 },
              { letra: "B", texto: "MARÉS MENORES", cor: C.blue, at: l1 + 16 },
              { letra: "C", texto: "ESTAÇÕES MALUCAS", cor: C.orange, at: l1 + 22 },
            ]}
            timer={interpolate(f, [lineEnd(scene, 1) - 30, fim + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
        </>
      )}
      {[tres, dois, um].map((a) => <Sfx key={a} at={a} name="click" volume={0.6} />)}
      <Sfx at={puf} name="boom" volume={0.55} />
      <Sfx at={puf + 1} name="sparkle" volume={0.5} />
      {[10, 16, 22].map((d) => <Sfx key={d} at={l1 + d} name="pop" volume={0.45} />)}
      <Sfx at={lineEnd(scene, 1) - 30} name="riser" volume={0.3} />
    </Full>
  );
};
