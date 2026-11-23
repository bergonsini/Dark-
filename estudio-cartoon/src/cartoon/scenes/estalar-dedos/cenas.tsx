import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { DuasMaos, Junta, PotePepino, Relogio20, Ressonancia, Ventosa } from "../../components/Dedo";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o dedo estala?" (video: "estalar-dedos") — fatos: Kawchuk 2015 (PLOS ONE), Univ. Alberta, NPR, Unger 1998 (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Lab: React.FC = () => <CeuCampo topo="#ffe9f0" base="#fff6f9" nuvens={false} colina1="#ffe1ea" colina2="#ffd6e2" />;

/** 0–3 s: GANCHO. O Tito estala o dedo: CREC! "Por que o dedo ESTALA?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const est = wordAt(scene, "estala?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 40 }, { f: 30, zoom: 1.05 }]} shakes={[est]}>
        <Cozinha />
        <PersonagemEm x={540} pe={1600} altura={620} boca={mouth} expressao={f >= est ? "surpreso" : "feliz"} pose="explicando" />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O DEDO" top={190} size={100} color={C.white} at={0} />
      {f >= est && <TitleSlam text="CREC!" top={560} size={170} color={C.orange} at={est} rotate={8} />}
      <TitleSlam text="ESTALA?!" top={1390} size={160} color={C.yellow} at={Math.max(0, est - 4)} rotate={-3} />
      <Sfx at={est} name="click" volume={0.7} />
    </Full>
  );
};

/** Dentro da junta: um líquido que funciona como óleo, deixa tudo liso. */
export const S2Dentro: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const oleo = wordAt(scene, "óleo.");
  const liso = wordAt(scene, "liso.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: oleo, zoom: 1.05 }]}>
        <Lab />
        <Junta x={500} y={880} s={0.72} afasta={0} bolha={0} />
        <PersonagemEm x={890} pe={1680} altura={300} boca={mouth} expressao="animado" pose="apontando" espelhar olharX={-0.6} />
      </Camera>
      <Tag text="DENTRO DA JUNTA" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= oleo && <Tag text="LÍQUIDO = ÓLEO" x={540} y={420} at={oleo} bg={C.blue} color={C.white} size={52} />}
      {f >= liso && <Tag text="DESLIZA LISO" x={300} y={1220} at={liso} bg={C.yellow} size={48} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={oleo} name="borbulha" volume={0.45} />
    </Full>
  );
};

/** Puxa: os ossos se afastam… e abre de repente uma bolha de gás. Tipo ventosa saindo do vidro: PLOC! */
export const S3Ventosa: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const puxa = wordAt(scene, "puxa");
  const l1 = lineStart(scene, 1);
  const bolha = wordAt(scene, "bolha");
  const vent = wordAt(scene, "ventosa");
  const ploc = wordAt(scene, "ploc!");
  return (
    <Full>
      {f < vent ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: bolha, zoom: 1.04 }]} shakes={[bolha]}>
          <Lab />
          <Junta x={540} y={880} s={0.68} afasta={cl(f, puxa, l1)} bolha={cl(f, bolha - 2, bolha + 3)} ploc={bolha} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: ploc, zoom: 1.06 }]} shakes={[ploc]}>
          <Lab />
          <Ventosa x={600} y={900} s={1.2} puxa={cl(f, vent, ploc)} />
        </Camera>
      )}
      {f >= puxa && f < bolha && <Tag text="OS OSSOS SE AFASTAM" x={540} y={300} at={puxa} bg={C.white} size={50} />}
      {f >= bolha && f < vent && <TitleSlam text="BOLHA DE GÁS!" top={300} size={110} color={C.blue} at={bolha} />}
      {f >= vent && f < ploc && <Tag text="TIPO VENTOSA" x={540} y={300} at={vent} bg={C.pink} color={C.white} size={58} />}
      {f >= ploc && <TitleSlam text="PLOC!" top={300} size={200} color={C.yellow} at={ploc} />}
      <Sfx at={puxa} name="whoosh" volume={0.4} />
      <Sfx at={bolha} name="click" volume={0.7} />
      <Sfx at={ploc} name="pop" volume={0.6} />
    </Full>
  );
};

/** Cientistas filmaram numa ressonância, ao vivo, em 2015. */
export const S4Mri: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const res = wordAt(scene, "ressonância,");
  const vivo = wordAt(scene, "vivo,");
  const k = ((f - res) % 50) / 50;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: vivo, zoom: 1.06 }]}>
        <Lab />
        <Ressonancia x={540} y={860} s={1.0} afasta={f >= res ? Math.min(1, k * 2) : 0} bolha={f >= res && k > 0.5 ? Math.min(1, (k - 0.5) * 8) : 0} />
        <PersonagemEm x={880} pe={1680} altura={280} boca={mouth} expressao="encantado" pose="apontando" espelhar olharX={-0.6} />
      </Camera>
      <Tag text="RESSONÂNCIA" x={540} y={300} at={res} bg={C.white} size={58} />
      {f >= vivo && <Tag text="AO VIVO!" x={540} y={1260} at={vivo} bg={C.red} color={C.white} size={58} />}
      <Sfx at={res} name="ding" volume={0.4} />
      <Sfx at={vivo} name="pop" volume={0.45} />
    </Full>
  );
};

/** Depois do estalo, o mesmo dedo leva uns 20 minutos pra estalar de novo. */
export const S5Espera: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const vinte = wordAt(scene, "vinte");
  const end = scene.endFrame - scene.startFrame;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: vinte, zoom: 1.06 }]}>
        <Lab />
        <Relogio20 x={540} y={820} s={1.0} p={cl(f, vinte - 10, end - 10)} />
        <PersonagemEm x={880} pe={1680} altura={300} boca={mouth} expressao="pensativo" pose="pensando" espelhar olharX={-0.6} />
      </Camera>
      <Tag text="ESTALOU? ESPERA!" x={540} y={300} at={6} bg={C.white} size={56} />
      <Sfx at={vinte} name="click" volume={0.45} />
    </Full>
  );
};

/** Dá artrite? Um médico estalou só uma das mãos por ~60 anos: nenhuma teve artrite… e ele ganhou um prêmio! */
export const S6Artrite: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const art = wordAt(scene, "artrite?");
  const sess = wordAt(scene, "sessenta");
  const nen = wordAt(scene, "nenhuma");
  const pre = wordAt(scene, "prêmio!");
  return (
    <Full>
      {f < 25 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }]} shakes={[art]}>
          <Lab />
          <PersonagemEm x={540} pe={1640} altura={540} boca={mouth} expressao="preocupado" pose="pensando" />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: pre, zoom: 1.06 }]} shakes={[pre]}>
          <Lab />
          <DuasMaos x={540} y={960} s={1.35} anos={60 * cl(f, 30, sess + 20)} ok={f >= nen} trofeu={f >= pre - 4} />
        </Camera>
      )}
      {f < 25 && <TitleSlam text="DÁ ARTRITE?" top={300} size={120} color={C.red} at={2} />}
      {f >= nen && f < pre && <Tag text="NENHUMA TEVE ARTRITE" x={540} y={300} at={nen} bg={C.green} color={C.white} size={50} />}
      {f >= pre && <Tag text="PRÊMIO IG NOBEL!" x={540} y={300} at={pre} bg={C.yellow} size={58} />}
      <Sfx at={art} name="boing" volume={0.4} />
      <Sfx at={nen} name="ding" volume={0.45} />
      <Sfx at={pre} name="tada" volume={0.45} />
    </Full>
  );
};

/** Conclusão: estalar o dedo é tipo abrir pote de pepino: PLOC! E depois tem que esperar a tampa fechar. + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pote = wordAt(scene, "pote");
  const ploc = wordAt(scene, "ploc!");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: ploc, zoom: 1.12 }, { f: l1, zoom: 1.0 }]} shakes={[ploc]}>
        <Cozinha />
        {f >= pote - 6 && f < l1 && <PotePepino x={780} y={1050} s={0.85} abre={f >= ploc ? 1 - cl(f, ploc + 30, l1 - 4) : cl(f, ploc - 8, ploc)} />}
        <PersonagemEm x={f < l1 ? 300 : 540} pe={1640} altura={f < l1 ? 460 : 560} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} />
      </Camera>
      {f >= ploc && f < l1 && <TitleSlam text="PLOC!" top={420} size={170} color={C.yellow} at={ploc} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="VOCÊ ESTALA OS DEDOS?" />}
      <Sfx at={ploc} name="pop" volume={0.6} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
