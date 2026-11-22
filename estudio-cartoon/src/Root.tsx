import React from "react";
import { Composition } from "remotion";
import { CartoonExplainer } from "./cartoon/CartoonExplainer";
import { FPS, HEIGHT, WIDTH } from "./cartoon/config";
import { timeline } from "./cartoon/timeline";
import { TitoReiVideo } from "./titorei/TitoReiVideo";
import { timeline as timelineRei } from "./titorei/timeline";
import { InutilidadesVideo } from "./inutilidades/InutilidadesVideo";
import { timeline as timelineInu } from "./inutilidades/timeline";
import { DesafioVideo, desafioAtivo } from "./desafio/DesafioVideo";
import { Mascote } from "./curso/Mascote";
import { PanelaVideo } from "./panela/PanelaVideo";
import { timeline as timelinePanela } from "./panela/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1º TITO: vídeos explicativos 2D. Skill cartoon-explainer: 9:16, 1080x1920, 30 fps, duração vinda do timeline (padrão 60 s) */}
      <Composition
        id="CartoonExplainer"
        component={CartoonExplainer}
        durationInFrames={timeline.durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* 2º TITOREI: humor absurdo em 3D low-poly (skill titorei) */}
      <Composition id="TitoRei" component={TitoReiVideo} durationInFrames={timelineRei.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* 3º INUTILIDADES 0800: comerciais de televendas de produtos absurdos, 2D + VHS (skill inutilidades) */}
      <Composition id="Inutilidades" component={InutilidadesVideo} durationInFrames={timelineInu.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* 4º canal (nome a definir): DESAFIO DO PAUSE, neon/arcade, sem narração (skill desafio) */}
      <Composition id="Desafio" component={DesafioVideo} durationInFrames={desafioAtivo().duracao} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* 5º PANELA DEPRESSÃO: competição de culinária trash em massinha 3D */}
      <Composition id="PanelaDepressao" component={PanelaVideo} durationInFrames={timelinePanela.durationInFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* Apostila "Estúdio de Bolso": mascotes com fundo transparente para as aberturas de módulo */}
      <Composition id="CursoMascote" component={Mascote} durationInFrames={1} fps={FPS} width={1080} height={1080} defaultProps={{ m: "tito-explicando" as const }} />
    </>
  );
};
