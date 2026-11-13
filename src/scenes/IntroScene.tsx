import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Landscape } from "../components/Backgrounds";
import { CartIcon, HouseIcon, PhoneIcon, RedX } from "../components/Props";
import { PopTitle } from "../components/Text";
import { lineStart } from "../timeline";
import { C } from "../theme";
import { formatBR, Pos, SceneProps, SceneWrap, useSceneFrame, walkCycle } from "./common";

export const STAMP_DELAY = 9;

export const IntroScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();
  const iconStarts = [lineStart(scene, 1), lineStart(scene, 2), lineStart(scene, 3)];
  const titleExit = iconStarts[0] - 6;

  const counter = interpolate(f, [4, 30], [0, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const walking = f < 34;
  const ugoX = interpolate(f, [0, 34], [-380, 330], { extrapolateRight: "clamp" });
  const walk = walkCycle(f, 0.55, 24);
  const crossed = iconStarts.filter((s) => f >= s + STAMP_DELAY).length;
  const lastStamp = Math.max(...iconStarts.map((s) => (f >= s + STAMP_DELAY ? s + STAMP_DELAY : -100)));
  const shakeNo = f - lastStamp < 14 ? Math.sin((f - lastStamp) * 1.2) * 14 : 0;

  const icons = [HouseIcon, CartIcon, PhoneIcon];
  const labels = ["CASA", "MERCADO", "CELULAR"];

  return (
    <SceneWrap shakes={iconStarts.map((s) => s + STAMP_DELAY)}>
      <Landscape frame={f} />
      <PopTitle
        frame={f}
        top={170}
        exitAt={titleExit}
        lines={[
          [{ text: "HÁ MAIS DE", size: 100 }],
          [{ text: formatBR(counter), color: C.yellow, size: 230 }],
          [{ text: "ANOS!", size: 130 }],
        ]}
      />
      {f >= titleExit && (
        <PopTitle frame={f - titleExit} top={150} lines={[[{ text: "NÃO EXISTIA:", size: 110, color: C.white }]]} />
      )}
      {icons.map((Icon, i) => {
        const s = spring({ frame: f - iconStarts[i], fps, config: { damping: 9, stiffness: 150 } });
        const x = spring({ frame: f - iconStarts[i] - STAMP_DELAY, fps, config: { damping: 8, stiffness: 220 } });
        if (f < iconStarts[i]) return null;
        return (
          <Pos key={i} x={45 + i * 340} y={300} scale={s} origin="center center">
            <div style={{ position: "relative", width: 310, height: 340, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 40, border: `8px solid ${C.outline}`, padding: 18 }}>
                <Icon size={210} />
              </div>
              <div
                style={{
                  fontFamily: "'Luckiest Guy'",
                  fontSize: 56,
                  color: C.white,
                  marginTop: 6,
                  WebkitTextStroke: `9px ${C.outline}`,
                  paintOrder: "stroke fill",
                }}
              >
                {labels[i]}
              </div>
              <div style={{ position: "absolute", top: 20, left: 30 }}>
                <RedX size={250} progress={f >= iconStarts[i] + STAMP_DELAY ? x : 0} />
              </div>
            </div>
          </Pos>
        );
      })}
      <Pos x={ugoX} y={700}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={380}
          mouth={mouth}
          expression={crossed > 0 ? "worried" : "happy"}
          lookY={crossed > 0 ? -1 : 0}
          lookX={walking ? 1 : 0}
          brow={crossed > 0 ? 0.6 : 0}
          legL={walking ? walk.legL : 0}
          legR={walking ? walk.legR : 0}
          armL={walking ? walk.armL : crossed > 0 ? 70 + Math.sin(f / 4) * 6 : 20}
          armR={walking ? walk.armR : crossed > 0 ? 70 - Math.sin(f / 4) * 6 : 140 + Math.sin(f / 2) * 25}
          bodyY={walking ? walk.bodyY : 0}
          headTilt={shakeNo}
          heldItem="club"
          blinkSeed={2}
        />
      </Pos>
    </SceneWrap>
  );
};
