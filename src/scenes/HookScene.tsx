import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Mammoth } from "../characters/Mammoth";
import { Sunburst } from "../components/Backgrounds";
import { PopTitle } from "../components/Text";
import { TITLE_FONT } from "../fonts";
import { C } from "../theme";
import { Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

// palavra narrada -> palavra do título ("um dia" vira "1 DIA")
const WORD_TO_TITLE = [0, 1, 2, 2, 3, 4, 5, 6];
export const HOOK_MAMMOTH_AT = 36;

export const HookScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, g, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();

  const words = scene.lines[0].words;
  let spoken = -1;
  words.forEach((w, i) => {
    if (g >= w.startFrame) spoken = i;
  });
  const highlight = spoken >= 0 && g < scene.lines[0].endFrame + 4 ? WORD_TO_TITLE[spoken] : -1;

  const enter = spring({ frame: f + 5, fps, config: { damping: 8, stiffness: 120 } });
  const panic = Math.sin(f / 2.2);
  const mammothIn = spring({ frame: f - HOOK_MAMMOTH_AT, fps, config: { damping: 12 } });
  const scared = f >= HOOK_MAMMOTH_AT + 2;

  return (
    <SceneWrap shakes={[0, HOOK_MAMMOTH_AT + 2]}>
      <Sunburst frame={f} c1="#FF7A00" c2="#FF9E2C" speed={0.8} />
      <PopTitle
        frame={f}
        top={150}
        delay={-6}
        stagger={2}
        highlight={highlight}
        lines={[
          [{ text: "VOCÊ" }, { text: "SOBREVIVERIA" }],
          [{ text: "1 DIA", color: C.yellow, size: 230 }],
          [{ text: "COMO" }, { text: "HOMEM" }],
          [{ text: "DAS" }, { text: "CAVERNAS?", color: "#FFE9C7" }],
        ]}
      />
      {/* pontos de interrogação flutuando */}
      {[
        [90, 1000, 0],
        [910, 960, 2],
      ].map(([x, y, o], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y + Math.sin(f / 5 + o) * 20,
            fontFamily: TITLE_FONT,
            fontSize: 150,
            color: C.yellow,
            WebkitTextStroke: `12px ${C.outline}`,
            paintOrder: "stroke fill",
            transform: `rotate(${Math.sin(f / 6 + o) * 15}deg) scale(${enter})`,
          }}
        >
          ?
        </div>
      ))}
      {/* mamute espiando pela direita */}
      <Pos x={interpolate(mammothIn, [0, 1], [1100, 650])} y={1200} scale={1}>
        <Mammoth frame={f} width={520} stomp={scared ? 1 : 0} angry />
      </Pos>
      {/* Ugo pulando em pânico */}
      <Pos x={270} y={interpolate(enter, [0, 1], [1500, 940])} scale={1}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={390}
          mouth={mouth}
          expression={scared ? "surprised" : "surprised"}
          lookX={scared ? 1 : 0}
          brow={1}
          armL={150 + panic * 22}
          armR={150 - panic * 22}
          legL={panic * 10}
          legR={-panic * 10}
          bodyY={-Math.abs(Math.sin(f / 3)) * 30}
          squash={Math.sin(f / 1.5) * 0.04}
          headTilt={scared ? -8 : Math.sin(f / 4) * 6}
          blinkSeed={1}
        />
      </Pos>
    </SceneWrap>
  );
};
