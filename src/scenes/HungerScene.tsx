import React from "react";
import { spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Landscape } from "../components/Backgrounds";
import { PopTitle } from "../components/Text";
import { lineStart } from "../timeline";
import { C } from "../theme";
import { Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

const MeatThought: React.FC<{ frame: number }> = ({ frame }) => (
  <svg viewBox="0 0 320 300" width={320} height={300} style={{ overflow: "visible" }}>
    <circle cx={30} cy={280} r={14} fill="#FFF" stroke={C.outline} strokeWidth={5} />
    <circle cx={65} cy={240} r={22} fill="#FFF" stroke={C.outline} strokeWidth={5} />
    <ellipse cx={190} cy={130} rx={130} ry={110} fill="#FFF" stroke={C.outline} strokeWidth={7} />
    <g transform={`rotate(${Math.sin(frame / 3) * 10} 190 130)`}>
      <rect x={180} y={110} width={100} height={26} rx={12} fill="#FFF3DC" stroke={C.outline} strokeWidth={5} transform="rotate(-30 190 130)" />
      <ellipse cx={170} cy={140} rx={70} ry={55} fill="#C2452D" stroke={C.outline} strokeWidth={7} />
      <ellipse cx={150} cy={125} rx={24} ry={14} fill="#E8735A" />
    </g>
  </svg>
);

export const HungerScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();
  const l2 = lineStart(scene, 1);
  const second = f >= l2 - 2;
  const thought = spring({ frame: f - 6, fps, config: { damping: 10 } });
  const growl = Math.sin(f / 1.3);

  return (
    <SceneWrap shakes={[l2]}>
      <Landscape frame={f + 120} mood="dusk" />
      {!second ? (
        <PopTitle frame={f} top={190} lines={[[{ text: "BATEU A", size: 130 }], [{ text: "FOME?", color: C.yellow, size: 230 }]]} />
      ) : (
        <PopTitle
          frame={f - l2 + 2}
          top={170}
          stagger={3}
          lines={[[{ text: "2", color: C.red, size: 260 }], [{ text: "JEITOS DE", size: 110 }, { text: "COMER", color: C.yellow, size: 110 }]]}
        />
      )}
      <Pos x={620} y={560} scale={thought} origin="left bottom">
        <MeatThought frame={f} />
      </Pos>
      {/* linhas de "ronco" da barriga */}
      {!second &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 230 + i * 18 + growl * 6,
              top: 1010 + i * 40,
              width: 60,
              height: 10,
              borderRadius: 5,
              background: C.outline,
              transform: `rotate(${-20 + i * 20}deg)`,
              opacity: 0.8,
            }}
          />
        ))}
      <Pos x={320} y={690}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={380}
          mouth={mouth}
          expression={second ? "happy" : "worried"}
          lookX={second ? 0 : 0.8}
          lookY={second ? 0 : -0.8}
          brow={second ? 1 : 0.3}
          armL={second ? 20 : -38 + growl * 6}
          armR={second ? 165 + Math.sin(f / 3) * 10 : -38 - growl * 6}
          squash={second ? 0 : growl * 0.02}
          bodyY={second ? -Math.abs(Math.sin(f / 4)) * 20 : 0}
          headTilt={second ? 0 : 8}
          blinkSeed={3}
        />
      </Pos>
    </SceneWrap>
  );
};
