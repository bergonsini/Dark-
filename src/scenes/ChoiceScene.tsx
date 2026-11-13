import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Mammoth } from "../characters/Mammoth";
import { Sunburst } from "../components/Backgrounds";
import { BerryBush, PoisonMushroom } from "../components/Props";
import { TITLE_FONT } from "../fonts";
import { lineStart } from "../timeline";
import { C } from "../theme";
import { Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

const OptionLabel: React.FC<{ letter: string; l1: string; l2: string; color: string; frame: number; active: boolean }> = ({
  letter,
  l1,
  l2,
  color,
  frame,
  active,
}) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  const txt = (size: number, col: string): React.CSSProperties => ({
    fontFamily: TITLE_FONT,
    fontSize: size,
    lineHeight: 1,
    color: col,
    WebkitTextStroke: `${size * 0.09}px ${C.outline}`,
    paintOrder: "stroke fill",
    textShadow: `0 7px 0 ${C.outline}`,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${s * (active ? 1.05 : 0.95)})` }}>
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          background: color,
          border: `9px solid ${C.outline}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 10px 0 ${C.outline}`,
          transform: `rotate(${Math.sin(frame / 5) * 6}deg)`,
          ...txt(100, C.white),
          paddingTop: 14,
        }}
      >
        {letter}
      </div>
      <div style={{ ...txt(92, C.white), marginTop: 18 }}>{l1}</div>
      <div style={{ ...txt(92, color) }}>{l2}</div>
    </div>
  );
};

export const ChoiceScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();
  const lA = lineStart(scene, 0);
  const lB = lineStart(scene, 1);
  const lWarn = lineStart(scene, 2);

  const aActive = f < lB;
  const bActive = f >= lB - 2 || f < lA + 4;
  const inL = spring({ frame: f, fps, config: { damping: 14 } });
  const inR = spring({ frame: f - 4, fps, config: { damping: 14 } });
  const vs = spring({ frame: f - 8, fps, config: { damping: 8 } });
  const warn = spring({ frame: f - lWarn, fps, config: { damping: 8 } });
  const dim = (on: boolean) => ({ filter: on ? "none" : "brightness(0.45) saturate(0.6)", transition: "none" });

  // golpe de lança: puxa e estoca
  const jab = Math.sin(f / 3.2);
  const attacking = f >= lA && f < lB;

  return (
    <SceneWrap shakes={[lA + 10, lA + 30, lWarn]}>
      {/* metade A */}
      <AbsoluteFill style={{ transform: `translateX(${(inL - 1) * 560}px)`, clipPath: "polygon(0 0, 560px 0, 520px 100%, 0 100%)", ...dim(aActive) }}>
        <Sunburst frame={f} c1="#D7263D" c2="#E8475B" center={[270, 900]} />
        <Pos x={0} y={170} style={{ width: 540, display: "flex", justifyContent: "center" }}>
          <OptionLabel letter="A" l1="CAÇAR" l2="MAMUTE" color={C.red} frame={f - 2} active={aActive} />
        </Pos>
        <Pos x={150} y={870}>
          <Mammoth frame={f} width={400} stomp={attacking ? 1 : 0.2} angry={attacking} />
        </Pos>
        <Pos x={-30} y={880}>
          <Caveperson
            variant="ugo"
            frame={f}
            width={260}
            mouth={mouth}
            expression={attacking ? "talk" : "happy"}
            lookX={1}
            brow={attacking ? 0.4 : 0}
            armL={30}
            armR={attacking ? 80 + jab * 18 : 150}
            heldItem="spear"
            legL={-8}
            legR={14}
            bodyY={attacking ? -Math.abs(jab) * 10 : 0}
            blinkSeed={4}
          />
        </Pos>
      </AbsoluteFill>

      {/* metade B */}
      <AbsoluteFill style={{ transform: `translateX(${(1 - inR) * 560}px)`, clipPath: "polygon(560px 0, 100% 0, 100% 100%, 520px 100%)", ...dim(bActive) }}>
        <Sunburst frame={f} c1="#1F9D55" c2="#34C46F" center={[810, 900]} />
        <Pos x={540} y={170} style={{ width: 540, display: "flex", justifyContent: "center" }}>
          <OptionLabel letter="B" l1="COLETAR" l2="FRUTAS" color={C.green} frame={f - 6} active={f >= lB} />
        </Pos>
        <Pos x={770} y={1030}>
          <BerryBush frame={f} size={300} />
        </Pos>
        {f >= lWarn && (
          <Pos x={610} y={1110} scale={warn} origin="center bottom">
            <PoisonMushroom frame={f} size={130} />
            <div
              style={{
                position: "absolute",
                top: -120,
                left: 25,
                fontFamily: TITLE_FONT,
                fontSize: 110,
                color: C.yellow,
                WebkitTextStroke: `10px ${C.outline}`,
                paintOrder: "stroke fill",
                transform: `scale(${1 + Math.sin(f / 2) * 0.1})`,
              }}
            >
              !
            </div>
          </Pos>
        )}
        <Pos x={560} y={880}>
          <Caveperson
            variant="lia"
            frame={f}
            width={260}
            expression={f >= lWarn ? "worried" : "happy"}
            lookX={f >= lWarn ? 0.3 : 1}
            lookY={f >= lWarn ? 1 : 0}
            brow={f >= lWarn ? 1 : 0}
            armL={20}
            armR={f >= lB && f < lWarn ? 60 + Math.sin(f / 4) * 25 : 45}
            heldItem="berries"
            headTilt={f >= lWarn ? Math.sin(f / 3) * 5 : 0}
            bodyY={f >= lWarn ? interpolate(warn, [0, 1], [0, -20]) : 0}
            blinkSeed={5}
          />
        </Pos>
      </AbsoluteFill>

      {/* divisória + VS */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d="M 560 -10 L 520 1930" stroke={C.outline} strokeWidth={22} />
        <path d="M 560 -10 L 520 1930" stroke={C.white} strokeWidth={10} />
      </svg>
      <Pos x={430} y={640} scale={vs} rotate={(1 - vs) * 360 + Math.sin(f / 5) * 6} origin="center center">
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: 105,
            background: C.yellow,
            border: `10px solid ${C.outline}`,
            boxShadow: `0 12px 0 ${C.outline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: TITLE_FONT,
            fontSize: 110,
            paddingTop: 16,
            color: C.red,
            WebkitTextStroke: `8px ${C.outline}`,
            paintOrder: "stroke fill",
          }}
        >
          VS
        </div>
      </Pos>
    </SceneWrap>
  );
};
