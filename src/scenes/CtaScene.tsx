import React from "react";
import { spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Sunburst } from "../components/Backgrounds";
import { ArrowDown, CommentIcon } from "../components/Props";
import { PopTitle } from "../components/Text";
import { TITLE_FONT } from "../fonts";
import { lineStart } from "../timeline";
import { C } from "../theme";
import { Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

const Card: React.FC<{ text: string; letter: string; color: string; s: number; f: number }> = ({ text, letter, color, s, f }) => (
  <div
    style={{
      transform: `scale(${s}) rotate(${Math.sin(f / 6) * 3}deg)`,
      background: color,
      border: `9px solid ${C.outline}`,
      boxShadow: `0 12px 0 ${C.outline}`,
      borderRadius: 36,
      padding: "22px 26px 10px",
      fontFamily: TITLE_FONT,
      fontSize: 76,
      color: C.white,
      WebkitTextStroke: `7px ${C.outline}`,
      paintOrder: "stroke fill",
      textAlign: "center",
      lineHeight: 1,
    }}
  >
    <div style={{ fontSize: 60, color: C.yellow }}>{letter}</div>
    {text}
  </div>
);

export const CtaScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();
  const l2 = lineStart(scene, 1);
  const l3 = lineStart(scene, 2);
  const cA = spring({ frame: f - l2, fps, config: { damping: 9 } });
  const cB = spring({ frame: f - l2 - 14, fps, config: { damping: 9 } });
  const cm = spring({ frame: f - l3, fps, config: { damping: 8 } });
  const bounce = Math.abs(Math.sin(f / 4)) * 30;
  const pulse = 1 + Math.sin(f / 3) * 0.05;

  return (
    <SceneWrap>
      <Sunburst frame={f} c1="#FFB000" c2="#FFC93B" speed={0.6} />
      <PopTitle frame={f} top={140} lines={[[{ text: "E VOCÊ?", size: 190, color: C.white }]]} />
      {f >= l2 && (
        <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <Card text="CAÇAR" letter="A" color={C.red} s={cA} f={f} />
          <div
            style={{
              fontFamily: TITLE_FONT,
              fontSize: 90,
              color: C.white,
              WebkitTextStroke: `8px ${C.outline}`,
              paintOrder: "stroke fill",
              transform: `scale(${cB})`,
            }}
          >
            OU
          </div>
          <Card text="COLETAR" letter="B" color={C.green} s={cB} f={f + 10} />
        </div>
      )}
      <Pos x={10} y={720}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={340}
          mouth={mouth}
          expression="happy"
          lookY={f >= l3 ? 1 : 0}
          brow={f >= l3 ? 0.8 : 0.2}
          armL={f >= l2 && f < l3 ? 140 : 20}
          armR={f >= l3 ? 35 + Math.sin(f / 3) * 8 : 160 + Math.sin(f / 3) * 12}
          heldItem="spear"
          bodyY={-Math.abs(Math.sin(f / 5)) * 18}
          blinkSeed={9}
        />
      </Pos>
      <Pos x={730} y={720}>
        <Caveperson
          variant="lia"
          frame={f}
          width={340}
          expression="happy"
          lookY={f >= l3 ? 1 : 0}
          lookX={-0.3}
          armL={f >= l2 && f < l3 ? 150 : 20}
          armR={f >= l2 ? 130 + Math.sin(f / 3) * 15 : 40}
          heldItem="berries"
          bodyY={-Math.abs(Math.sin(f / 5 + 1)) * 18}
          blinkSeed={10}
        />
      </Pos>
      {f >= l3 && (
        <>
          <Pos x={250} y={1590} scale={cm * pulse} origin="center center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: C.white,
                border: `9px solid ${C.outline}`,
                boxShadow: `0 12px 0 ${C.outline}`,
                borderRadius: 50,
                padding: "10px 34px 0 24px",
              }}
            >
              <CommentIcon size={100} />
              <span style={{ fontFamily: TITLE_FONT, fontSize: 84, color: C.red, paddingTop: 8 }}>COMENTA!</span>
            </div>
          </Pos>
          <Pos x={460} y={1740 + bounce} scale={cm} origin="center top">
            <ArrowDown size={130} />
          </Pos>
        </>
      )}
    </SceneWrap>
  );
};
