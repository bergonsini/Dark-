import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { Camera } from "../../components/Camera";
import { Corais, Lobisomem, QuizCards } from "../../components/Lua";
import { Brilhos } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame, useSpringAt } from "../common";

/** QUIZ: corais ou lobisomem? Os dois! (piada do lobisomem desempregado) + corais desovando no luar. */
export const L5Quiz: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const quiz = wordAt(scene, "quiz:");
  const corais = wordAt(scene, "corais…");
  const lobi = wordAt(scene, "lobisomem?");
  const l1 = lineStart(scene, 1);
  const desemp = wordAt(scene, "desempregado…");
  const l2 = lineStart(scene, 2);
  const reproduzir = wordAt(scene, "reproduzir.");
  // 2ª menção ("O lobisomem ia ficar...") na fala 1: é quando ele entra em cena
  const w1 = scene.lines[1].words.find((w) => w.text.toLowerCase().startsWith("lobisomem"));
  const loboAt = (w1 ? w1.startFrame - scene.startFrame : desemp - 20) - 4;
  const lobo = useSpringAt(loboAt, { damping: 8, stiffness: 160 });
  const placa = useSpringAt(desemp, { damping: 7, stiffness: 220 });
  const marAt = l2 + 18;
  const mar = interpolate(f, [marAt, marAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const desova = interpolate(f, [reproduzir - 20, reproduzir + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.08 }, { f: quiz, zoom: 1.0 }, { f: l1, zoom: 1.0 }, { f: desemp, zoom: 1.12, y: -80 }, { f: l2, zoom: 1.0 }]} shakes={[l1]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #8E5CF7, #3A1E7A 70%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[160, 540, 920].map((x, i) => (
            <path key={i} d={`M ${x - 40} 0 L ${x + 40} 0 L ${x + 200 + Math.sin(f * 0.05 + i) * 60} 1400 L ${x - 200 + Math.sin(f * 0.05 + i) * 60} 1400 Z`} fill="#FFF6C8" opacity={0.08} />
          ))}
        </svg>
        {f >= loboAt && f < marAt + 14 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - lobo) * 800}px)` }}>
            <Lobisomem x={620} y={1330} s={1.1} placa={f >= desemp ? placa : 0} uiva={f >= desemp + 24 ? 1 : 0} />
          </div>
        )}
        <PersonagemEm x={170} pe={1340} altura={400} boca={mouth} expressao={f >= l1 ? "animado" : "pensativo"} pose={f >= desemp ? "comemorando" : f >= l1 ? "explicando" : "pensando"} olharX={0.7} corpoY={f >= desemp && f < marAt ? -Math.abs(Math.sin((f - desemp) * 0.5)) * 30 : 0} />
      </Camera>
      {f < loboAt && (
        <>
          <TitleSlam text="QUIZ!" top={190} size={140} color={C.yellow} at={quiz} />
          <QuizCards
            y={540}
            opcoes={[
              { letra: "A", texto: "OS CORAIS", cor: C.pink, at: corais },
              { letra: "B", texto: "O LOBISOMEM", cor: "#6E6A75", at: lobi },
            ]}
            certa={[0, 1]}
            revela={l1}
            timer={f < l1 ? interpolate(f, [lobi + 6, l1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : undefined}
          />
          {f >= l1 && <TitleSlam text="OS DOIS!" top={920} size={120} color={C.white} at={l1} />}
        </>
      )}
      <Brilhos x={540} y={700} at={l1} cor={C.yellow} n={16} raio={420} />
      {mar > 0 && (
        <AbsoluteFill style={{ opacity: mar }}>
          <Corais chao={1330} desova={desova} />
          <Tag text="LUA CHEIA = SINAL" x={540} y={300} at={marAt + 8} bg={C.yellow} size={54} />
          {desova > 0.3 && <Tag text="HORA DE SE REPRODUZIR!" x={540} y={420} at={reproduzir} bg={C.pink} size={44} />}
        </AbsoluteFill>
      )}
      <Sfx at={quiz} name="tada" volume={0.45} />
      <Sfx at={corais} name="pop" volume={0.5} />
      <Sfx at={lobi} name="pop" volume={0.5} />
      <Sfx at={lobi + 6} name="click" volume={0.4} />
      <Sfx at={l1} name="ding" volume={0.7} />
      <Sfx at={loboAt} name="whoosh" volume={0.4} />
      <Sfx at={desemp} name="boing" volume={0.7} />
      <Sfx at={desemp + 24} name="riser" volume={0.2} />
      <Sfx at={marAt} name="whoosh" volume={0.5} />
      <Sfx at={reproduzir} name="borbulha" volume={0.4} />
    </Full>
  );
};
