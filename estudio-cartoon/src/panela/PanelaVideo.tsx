import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import "../cartoon/fonts";
import { CenaTiming } from "./common";
import { EPISODIOS } from "./episodios";
import { Capitulo, GC, Legenda, LogoBug } from "./Overlay";
import { isSpeaking, timeline } from "./timeline";

/**
 * PANELA DEPRESSÃO: competição de culinária trash em MASSINHA 3D. Cortes secos, legenda de até 3 palavras,
 * tarja de nome (GC) de quem fala, selo "AO VIVO" e faixas de capítulo.
 */
export const PanelaVideo: React.FC = () => {
  const cenas = EPISODIOS[timeline.video ?? ""];
  if (!cenas) throw new Error(`Episódio do Panela Depressão desconhecido: ${timeline.video}. Registre em src/panela/episodios.ts`);
  return (
    <AbsoluteFill style={{ background: "#2a0a2a" }}>
      {cenas.map(({ id, Comp }, i) => {
        const s = timeline.scenes.find((x) => x.id === id);
        if (!s) throw new Error(`Cena ${id} não está no timeline do Panela Depressão`);
        const fim = i === cenas.length - 1 ? timeline.durationInFrames : s.endFrame;
        const len = fim - s.startFrame;
        return (
          <Sequence key={id} from={s.startFrame} durationInFrames={len} name={id}>
            <CenaTiming.Provider value={{ len }}>
              <Comp scene={s} />
              {s.capitulo ? <Capitulo texto={s.capitulo} at={2} /> : null}
            </CenaTiming.Provider>
          </Sequence>
        );
      })}
      <LogoBug />
      <GC />
      <Legenda />
      <Audio src={staticFile("panela/audio/narration.wav")} />
      <Audio
        src={staticFile("panela/audio/music.wav")}
        volume={(f) => (isSpeaking(f) ? 0.12 : 0.26) * interpolate(f, [timeline.durationInFrames - 30, timeline.durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
