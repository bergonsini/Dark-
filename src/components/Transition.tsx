import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../lib";

export type TransitionKind = "zoom" | "slideLeft" | "slideUp" | "circle" | "whip" | "spin" | "wipe" | "none";
export const TRANSITION_FRAMES = 10;

/**
 * Envolve uma cena e aplica a animação de ENTRADA dela por cima da cena anterior
 * (as cenas se sobrepõem por alguns quadros). Também desenha um flash rápido.
 */
export const SceneTransition: React.FC<{ kind: TransitionKind; children: React.ReactNode }> = ({ kind, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  let style: React.CSSProperties = {};
  switch (kind) {
    case "zoom":
      style = { transform: `scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: interpolate(p, [0, 0.4], [0, 1], clamp) };
      break;
    case "slideLeft":
      style = { transform: `translateX(${(1 - p) * 1080}px)` };
      break;
    case "slideUp":
      style = { transform: `translateY(${(1 - p) * 1920}px)` };
      break;
    case "circle":
      style = { clipPath: `circle(${p * 120}% at 50% 55%)` };
      break;
    case "whip":
      style = { transform: `translateX(${(1 - p) * -1080}px) skewX(${(1 - p) * 25}deg)`, filter: `blur(${(1 - p) * 14}px)` };
      break;
    case "spin":
      style = { transform: `rotate(${(1 - p) * -90}deg) scale(${0.3 + 0.7 * p})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) };
      break;
    case "wipe":
      style = { clipPath: `polygon(0 0, ${p * 140}% 0, ${p * 140 - 40}% 100%, 0 100%)` };
      break;
  }
  const flash = interpolate(frame, [TRANSITION_FRAMES - 3, TRANSITION_FRAMES, TRANSITION_FRAMES + 5], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {kind !== "none" && <AbsoluteFill style={{ background: "white", opacity: flash, pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};
