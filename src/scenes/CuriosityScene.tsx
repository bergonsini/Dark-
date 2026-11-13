import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { Caveperson } from "../characters/Caveperson";
import { Sunburst } from "../components/Backgrounds";
import { Brain, Fire } from "../components/Props";
import { Badge, PopTitle } from "../components/Text";
import { lineEnd, lineStart } from "../timeline";
import { C } from "../theme";
import { formatBR, Pos, SceneProps, SceneWrap, useSceneFrame } from "./common";

export const CuriosityScene: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const { fps } = useVideoConfig();
  const l2 = lineStart(scene, 1);
  const l3 = lineStart(scene, 2);
  const end3 = lineEnd(scene, 2);

  const fireIn = spring({ frame: f - l2, fps, config: { damping: 10 } });
  const count = interpolate(f, [l2 + 4, l2 + 40], [0, 1000000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brainIn = spring({ frame: f - l3, fps, config: { damping: 9 } });
  const brainGrow = interpolate(f, [l3, end3], [0.7, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stir = Math.sin(f / 5);

  return (
    <SceneWrap>
      <Sunburst frame={f} c1="#3C1361" c2="#52217F" center={[540, 1150]} speed={0.3} />
      <Badge frame={f} text="CURIOSIDADE!" bg={C.yellow} color={C.red} top={150} size={100} />
      {/* lâmpada de ideia */}
      <Pos x={60} y={110} scale={spring({ frame: f - 6, fps })} rotate={Math.sin(f / 4) * 12} origin="center center">
        <svg viewBox="0 0 100 140" width={110} height={154}>
          <circle cx={50} cy={50} r={40} fill="#FFE14D" stroke={C.outline} strokeWidth={6} />
          <rect x={32} y={88} width={36} height={30} rx={6} fill="#AAA" stroke={C.outline} strokeWidth={6} />
        </svg>
      </Pos>
      {f >= l2 && f < l3 && (
        <PopTitle
          frame={f - l2}
          top={360}
          lines={[[{ text: "FOGO HÁ", size: 100 }], [{ text: formatBR(count), color: "#FFB21E", size: 170 }], [{ text: "DE ANOS", size: 100 }]]}
        />
      )}
      {f >= l3 && (
        <PopTitle
          frame={f - l3}
          top={380}
          lines={[[{ text: "COMIDA", size: 110 }, { text: "COZIDA", color: "#FFB21E", size: 110 }], [{ text: "=", size: 110 }, { text: "CÉREBRO", color: "#FF8FB1", size: 110 }], [{ text: "MAIOR?", color: "#FF8FB1", size: 130 }]]}
        />
      )}
      <Pos x={380} y={900} scale={fireIn} origin="center bottom">
        <Fire frame={f} size={340} />
      </Pos>
      <Pos x={-10} y={700}>
        <Caveperson
          variant="ugo"
          frame={f}
          width={360}
          mouth={mouth}
          expression={f < l2 ? "surprised" : "talk"}
          lookX={0.6}
          lookY={0.3}
          brow={f >= l3 ? 1 : 0.3}
          armL={f < l2 ? 160 : 25}
          armR={f < l2 ? 160 : 75 + stir * 8}
          heldItem={f < l2 ? "none" : "meat"}
          bodyY={f < l2 ? -Math.abs(Math.sin(f / 3)) * 30 : 0}
          blinkSeed={6}
        />
      </Pos>
      {f >= l3 && (
        <Pos x={720} y={700} scale={brainIn * brainGrow} origin="center center">
          <div style={{ position: "relative" }}>
            <Brain frame={f} size={260} />
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2 + f / 10;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 135 + Math.cos(a) * 190,
                    top: 105 + Math.sin(a) * 150,
                    fontFamily: "'Luckiest Guy'",
                    fontSize: 70,
                    color: C.yellow,
                    WebkitTextStroke: `7px ${C.outline}`,
                    paintOrder: "stroke fill",
                  }}
                >
                  +
                </div>
              );
            })}
          </div>
        </Pos>
      )}
    </SceneWrap>
  );
};
