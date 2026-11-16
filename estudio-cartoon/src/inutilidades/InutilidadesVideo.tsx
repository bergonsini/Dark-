import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import "../cartoon/fonts";
import { CenaTiming } from "./common";
import { EPISODIOS } from "./episodios";
import { Legenda, LogoCanal, VHSInterface } from "./Overlay";
import { isSpeaking, timeline } from "./timeline";

/**
 * INUTILIDADES 0800 (3º canal): comerciais de televendas de produtos absurdos, 2D + filtro VHS.
 * Cortes secos entre as cenas; "a fita embola" (glitch + REW) nas cenas marcadas com `glitch`.
 */
const AberracaoCromatica: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="vhs-ca" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx="6" result="r2" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
        <feOffset in="gb" dx="-3" result="gb2" />
        <feBlend in="r2" in2="gb2" mode="screen" result="c" />
        <feGaussianBlur in="c" stdDeviation="1.1" />
      </filter>
    </defs>
  </svg>
);

export const InutilidadesVideo: React.FC = () => {
  const f = useCurrentFrame();
  const ep = EPISODIOS[timeline.video ?? ""];
  if (!ep) throw new Error(`Episódio desconhecido: ${timeline.video}. Registre em src/inutilidades/episodios.ts`);
  const glitches: number[] = [];
  for (const c of ep.cenas) {
    const s = timeline.scenes.find((x) => x.id === c.id);
    if (s && c.glitch) glitches.push(s.startFrame + (c.glitchEm ?? 0));
  }
  const emGlitch = glitches.find((a) => f >= a && f < a + 8);
  const jit = emGlitch !== undefined ? Math.sin(f * 9.1) * 40 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AberracaoCromatica />
      <AbsoluteFill style={{ filter: "url(#vhs-ca) saturate(1.35) contrast(1.08)", transform: `translateX(${jit}px) skewX(${jit * 0.05}deg)` }}>
        {ep.cenas.map(({ id, Comp }, i) => {
          const s = timeline.scenes.find((x) => x.id === id);
          if (!s) throw new Error(`Cena ${id} não está no timeline`);
          const fim = i === ep.cenas.length - 1 ? timeline.durationInFrames : s.endFrame;
          const len = fim - s.startFrame;
          return (
            <Sequence key={id} from={s.startFrame} durationInFrames={len} name={id}>
              <CenaTiming.Provider value={{ len }}>
                <Comp scene={s} />
              </CenaTiming.Provider>
            </Sequence>
          );
        })}
        <LogoCanal />
      </AbsoluteFill>
      <Legenda pular={ep.semLegenda ?? []} />
      <VHSInterface glitches={glitches} />
      {glitches.map((a) => (
        <Sequence key={a} from={a} durationInFrames={20} layout="none">
          <Audio src={staticFile("inutilidades/audio/sfx/vhs.wav")} volume={0.35} />
        </Sequence>
      ))}
      <Audio src={staticFile("inutilidades/audio/narration.wav")} />
      <Audio
        src={staticFile("inutilidades/audio/music.wav")}
        volume={(fr) =>
          (isSpeaking(fr) ? 0.09 : 0.2) *
          interpolate(fr, [timeline.durationInFrames - 30, timeline.durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
    </AbsoluteFill>
  );
};
