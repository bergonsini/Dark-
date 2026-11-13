import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {Captions} from './components/Text';
import {Transition, TransitionType} from './components/Transitions';
import {T, f, sceneFrames, wordAt} from './lib';
import {ChoiceScene, CtaScene, CuriosityScene, HookScene, IntroScene, NightScene} from './scenes/Scenes';

const SCENES: Record<string, React.FC> = {
  hook: HookScene,
  intro: IntroScene,
  choice: ChoiceScene,
  curiosity: CuriosityScene,
  night: NightScene,
  cta: CtaScene,
};

const TRANSITIONS: {type: TransitionType; color: string; color2?: string}[] = [
  {type: 'swipe', color: '#FF4D6D', color2: '#FFE135'},
  {type: 'shutter', color: '#E5202E', color2: '#16A34A'},
  {type: 'zoom', color: '#FFE135'},
  {type: 'iris', color: '#1A0E05', color2: '#FF8A1F'},
  {type: 'swipe', color: '#7B2FF7', color2: '#FFE135'},
];

const Sfx: React.FC<{name: string; at: number; volume?: number}> = ({name, at, volume = 0.6}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`audio/sfx_${name}.wav`)} volume={volume} />
  </Sequence>
);

export const Video: React.FC = () => {
  const scenes = T.scenes.map((s) => ({id: s.id, ...sceneFrames(s.id)}));
  const at = (id: string, word: string, nth = 0) => sceneFrames(id).from + wordAt(id, word, nth);
  const total = T.durationInFrames;
  const hookEnd = sceneFrames('hook').duration;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s) => {
        const C = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
            <C />
          </Sequence>
        );
      })}

      {scenes.slice(1).map((s, i) => (
        <Transition key={s.id} at={s.from} {...TRANSITIONS[i % TRANSITIONS.length]} />
      ))}

      {/* legendas (no gancho a pergunta já aparece gigante na tela) */}
      <Sequence from={hookEnd} layout="none">
        <Sequence from={-hookEnd} layout="none">
          <Captions />
        </Sequence>
      </Sequence>

      {/* ÁUDIO ------------------------------------------------------ */}
      <Audio src={staticFile('audio/narration.wav')} volume={1} />
      <Audio
        src={staticFile('audio/music.wav')}
        volume={(fr) =>
          interpolate(fr, [0, 8, 20, total - f(1.4), total - 10, total], [0.45, 0.45, 0.16, 0.16, 0.4, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* efeitos sonoros */}
      <Sfx name="drum" at={0} volume={0.9} />
      <Sfx name="boing" at={5} volume={0.5} />
      <Sfx name="pop" at={20} volume={0.4} />
      {scenes.slice(1).map((s) => (
        <Sfx key={s.id} name="whoosh" at={s.from - 8} volume={0.55} />
      ))}
      <Sfx name="pop" at={at('intro', 'Gruk')} volume={0.5} />
      <Sfx name="pop" at={at('intro', 'casa') - 2} volume={0.45} />
      <Sfx name="drum" at={at('intro', 'casa') + 7} volume={0.5} />
      <Sfx name="pop" at={at('intro', 'mercado') - 2} volume={0.45} />
      <Sfx name="drum" at={at('intro', 'mercado') + 7} volume={0.5} />
      <Sfx name="pop" at={at('intro', 'celular') - 2} volume={0.45} />
      <Sfx name="drum" at={at('intro', 'celular') + 7} volume={0.6} />
      <Sfx name="swoosh_up" at={sceneFrames('choice').from + 2} volume={0.35} />
      <Sfx name="whoosh" at={at('choice', 'enfrentar') - 6} volume={0.5} />
      <Sfx name="roar" at={at('choice', 'mamute')} volume={0.55} />
      <Sfx name="whoosh" at={at('choice', 'coletar') - 6} volume={0.5} />
      <Sfx name="ding" at={at('choice', 'coletar') + 4} volume={0.35} />
      <Sfx name="tick" at={at('choice', 'perigo') - 2} volume={0.4} />
      <Sfx name="tick" at={at('choice', 'perigo') + 4} volume={0.4} />
      <Sfx name="ding" at={sceneFrames('curiosity').from + 1} volume={0.5} />
      <Sfx name="fire" at={at('curiosity', 'fogo') - 4} volume={0.45} />
      <Sfx name="fire" at={at('curiosity', 'fogo') + 70} volume={0.4} />
      <Sfx name="swoosh_up" at={at('curiosity', 'cerebro') - 6} volume={0.45} />
      <Sfx name="fire" at={sceneFrames('night').from} volume={0.3} />
      <Sfx name="fire" at={sceneFrames('night').from + 70} volume={0.3} />
      <Sfx name="pop" at={at('cta', 'cacar') - 2} volume={0.5} />
      <Sfx name="pop" at={at('cta', 'coletar') - 2} volume={0.5} />
      <Sfx name="ding" at={at('cta', 'comenta') - 2} volume={0.5} />
      <Sfx name="boing" at={at('cta', 'comenta') + 6} volume={0.35} />
    </AbsoluteFill>
  );
};
