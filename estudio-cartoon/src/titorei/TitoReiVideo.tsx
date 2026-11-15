import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import "../cartoon/fonts";
import { CenaTiming } from "./common";
import { EPISODIOS } from "./episodios";
import { Capitulo, LegendaPalavra } from "./Overlay";
import { isSpeaking, timeline } from "./timeline";

/**
 * Composição do TITOREI: humor absurdo em 3D low-poly. CORTES SECOS entre as cenas (sem transição),
 * legenda de UMA palavra por vez, títulos de capítulo, narração + música + efeitos.
 */
export const TitoReiVideo: React.FC = () => {
  const cenas = EPISODIOS[timeline.video ?? ""];
  if (!cenas) throw new Error(`Episódio do Titorei desconhecido: ${timeline.video}. Registre em src/titorei/episodios.ts`);
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {cenas.map(({ id, Comp }, i) => {
        const s = timeline.scenes.find((x) => x.id === id);
        if (!s) throw new Error(`Cena ${id} não está no timeline do Titorei`);
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
      <LegendaPalavra />
      <Audio src={staticFile("titorei/audio/narration.wav")} />
      <Audio
        src={staticFile("titorei/audio/music.wav")}
        volume={(f) =>
          (isSpeaking(f) ? 0.1 : 0.22) *
          interpolate(f, [timeline.durationInFrames - 30, timeline.durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
    </AbsoluteFill>
  );
};
