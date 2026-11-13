import React from "react";
import { interpolate } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { CaveInterior } from "../components/Backgrounds";
import { CavePainting, Fire } from "../components/Props";
import { PopTitle } from "../components/Text";
import { lineStart } from "../timeline";
import { Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

export const NightScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l2 = lineStart(scene, 1);
  const paint = interpolate(f, [l2, l2 + 60], [0, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const painting = f >= l2;
  const brush = Math.sin(f / 2.5);
  const flicker = 0.85 + Math.sin(f / 2) * 0.1 + Math.sin(f / 3.7) * 0.05;

  return (
    <SceneWrap>
      <CaveInterior frame={f} glow={flicker} />
      <PopTitle frame={f} top={140} lines={[[{ text: "À NOITE...", size: 140, color: "#FFF6C9" }]]} />
      <Pos x={20} y={420} style={{ filter: `brightness(${flicker})` }}>
        <CavePainting progress={paint} width={600} />
      </Pos>
      <Pos x={350} y={940}>
        <Fire frame={f} size={300} />
      </Pos>
      {/* Lia pintando a parede */}
      <Pos x={40} y={760}>
        <Caveperson
          variant="lia"
          frame={f}
          width={300}
          expression="happy"
          lookX={painting ? -0.4 : 0.8}
          lookY={painting ? -1 : 0}
          armL={20}
          armR={painting ? 150 + brush * 15 : 30}
          heldItem="stick"
          flip
          headTilt={painting ? -10 : Math.sin(f / 10) * 3}
          blinkSeed={7}
        />
      </Pos>
      {/* Ugo comendo perto do fogo */}
      <Pos x={700} y={760}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={300}
          mouth={mouth}
          expression="talk"
          lookX={-0.7}
          armL={20}
          armR={110 + Math.sin(f / 6) * 8}
          heldItem="meat"
          flip
          headTilt={Math.sin(f / 9) * 4}
          blinkSeed={8}
        />
      </Pos>
    </SceneWrap>
  );
};
