import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { CerebroLado, Pena, RatoRindo, RoboPena, TVSpoiler, Volume } from "../../components/Cocegas";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que cócega sozinho não funciona?" (video: "cocegas") — fatos: Blakemore/UCL 1998-2000, Panksepp 1999 (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
/** chacoalhão de quem está rindo de cócega */
const ri = (f: number) => Math.sin(f * 1.4) * 14;
const FundoLab: React.FC = () => <CeuCampo topo="#E3F2FD" base="#F3F9FF" nuvens={false} colina1="#E3F2FD" colina2="#D6EBFF" />;
const HaHa: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) =>
  f >= at && (f - at) % 24 < 16 ? <Tag text="HAHAHA!" x={x} y={y} at={f - ((f - at) % 24)} bg={C.yellow} size={56} /> : null;

/** 0–3 s: GANCHO. O Tito fazendo cócega em si mesmo com uma pena… cara de nada. */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const coc = wordAt(scene, "cócega");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.3, y: 60 }, { f: 30, zoom: 1.05 }]} shakes={[coc]}>
        <Cozinha />
        <PersonagemEm x={540} pe={1600} altura={620} boca={mouth} expressao="neutro" pose="pensando" />
        <Pena x={660} y={1150} s={0.7} rot={-30} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="CÓCEGA SOZINHO" top={190} size={100} color={C.white} at={0} />
      <TitleSlam text="NÃO FUNCIONA?!" top={1390} size={130} color={C.yellow} at={Math.max(0, coc + 10)} rotate={-3} />
      <Sfx at={0} name="whoosh" volume={0.5} />
      <Sfx at={coc + 10} name="boing" volume={0.5} />
    </Full>
  );
};

/** O culpado é o cérebro… mais exatamente o CEREBELO, aqui atrás. */
export const S2Cerebelo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const cer = wordAt(scene, "cérebro.");
  const cbl = wordAt(scene, "cerebelo,");
  const atras = wordAt(scene, "atrás");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: cbl, zoom: 1.08 }]} shakes={[cbl]}>
        <FundoLab />
        <CerebroLado x={540} y={900} s={1.4} destaque={cl(f, cbl, cbl + 10)} />
        <PersonagemEm x={880} pe={1660} altura={320} boca={mouth} expressao="animado" pose={f >= atras ? "apontando" : "explicando"} espelhar olharX={-0.7} />
      </Camera>
      {f >= cer && <Tag text="O CULPADO: SEU CÉREBRO" x={540} y={300} at={cer} bg={C.white} size={52} />}
      {f >= cbl && <Tag text="CEREBELO" x={300} y={1180} at={cbl} bg={C.orange} color={C.white} size={60} />}
      <Sfx at={cer} name="pop" volume={0.45} />
      <Sfx at={cbl} name="ding" volume={0.5} />
    </Full>
  );
};

/** Ele PREVÊ o que você vai sentir e ABAIXA o volume da sensação. */
export const S3Previsao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const prev = wordAt(scene, "prevê");
  const abaixa = wordAt(scene, "abaixa");
  const v = 0.9 - cl(f, abaixa, abaixa + 20) * 0.75;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: abaixa, zoom: 1.06 }]}>
        <FundoLab />
        <CerebroLado x={330} y={720} s={0.8} destaque={1} olhos={f >= prev} />
        <Volume x={800} y={850} s={0.9} v={v} />
        <PersonagemEm x={320} pe={1660} altura={420} boca={mouth} expressao={f >= abaixa ? "neutro" : "pensativo"} pose="pensando" olharX={0.6} />
        <Pena x={440} y={1360} s={0.6} rot={-40} />
      </Camera>
      {f >= prev && <Tag text="PREVISÃO: CÓCEGA VINDO!" x={540} y={300} at={prev} bg={C.yellow} size={50} />}
      {f >= abaixa && <Tag text="VOLUME LÁ EMBAIXO" x={760} y={1230} at={abaixa} bg={C.green} color={C.white} size={44} />}
      <Sfx at={prev} name="sparkle" volume={0.45} />
      <Sfx at={abaixa} name="click" volume={0.5} />
    </Full>
  );
};

/** Cócega precisa de SURPRESA: outra pessoa faz, o cérebro não sabe onde… risada! */
export const S4Surpresa: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sur = wordAt(scene, "surpresa!");
  const l1 = lineStart(scene, 1);
  const ris = wordAt(scene, "risada!");
  const rindo = f >= ris - 20;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.04 }, { f: ris, zoom: 1.12 }]} shakes={[sur]}>
        <CeuCampo nuvens />
        <PersonagemEm
          x={540}
          pe={1640}
          altura={560}
          boca={mouth}
          expressao={rindo ? "encantado" : f >= l1 ? "surpreso" : "animado"}
          pose={rindo ? "comemorando" : f >= l1 ? "assustado" : "explicando"}
          corpoY={rindo ? ri(f) : 0}
        />
        {f >= l1 && (
          <>
            <Pena x={250 + Math.sin(f * 0.2) * 40} y={1250} s={0.7} rot={40} cor={C.violet} />
            <Pena x={830} y={1150 + Math.cos(f * 0.2) * 60} s={0.7} rot={-50} cor={C.green} />
            {f >= ris - 30 && <Pena x={560} y={1500} s={0.6} rot={10} cor={C.orange} />}
          </>
        )}
      </Camera>
      {f >= sur && f < l1 && <TitleSlam text="SURPRESA!" top={300} size={150} color={C.yellow} at={sur} />}
      {f >= l1 && f < ris - 20 && <Tag text="ONDE VAI SER?!" x={540} y={320} at={l1 + 10} bg={C.white} size={58} />}
      <HaHa f={f} at={ris - 20} x={540} y={360} />
      <Sfx at={sur} name="boing" volume={0.5} />
      <Sfx at={l1 + 10} name="whoosh" volume={0.45} />
      <Sfx at={ris - 20} name="tada" volume={0.35} />
    </Full>
  );
};

/** O robô: com um atrasinho no movimento, a cócega voltava! */
export const S5Robo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const robo = wordAt(scene, "robô");
  const atr = wordAt(scene, "atrasinho");
  const volta = wordAt(scene, "voltava!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: atr, zoom: 1.06 }]} shakes={[volta]}>
        <FundoLab />
        <RoboPena x={360} y={1060} s={1.0} atraso={f >= atr} />
        <PersonagemEm x={820} pe={1660} altura={460} boca={mouth} expressao={f >= volta ? "encantado" : "pensativo"} pose={f >= volta ? "comemorando" : "pensando"} corpoY={f >= volta ? ri(f) : 0} espelhar olharX={-0.6} />
      </Camera>
      <Tag text="TESTE NO LABORATÓRIO" x={540} y={300} at={robo - 4} bg={C.white} size={52} />
      {f >= atr && <Tag text="+ UM ATRASINHO" x={540} y={420} at={atr} bg={C.violet} color={C.white} size={52} />}
      {f >= volta && <TitleSlam text="VOLTOU!" top={1180} size={120} color={C.yellow} at={volta} />}
      <Sfx at={robo} name="click" volume={0.45} />
      <Sfx at={atr} name="ding" volume={0.45} />
      <Sfx at={volta} name="boing" volume={0.5} />
    </Full>
  );
};

/** Ratos também dão risadinhas de cócega — num som fino demais pro nosso ouvido. */
export const S6Ratos: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const ratos = wordAt(scene, "ratos");
  const fino = wordAt(scene, "fino");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: fino, zoom: 1.1 }]}>
        <CeuCampo nuvens />
        <RatoRindo x={520} y={1000} s={1.4} cocegas={f >= ratos} />
        <Pena x={760} y={1180} s={0.6} rot={-60} cor={C.pink} />
      </Camera>
      {f >= ratos && <Tag text="RATOS TAMBÉM RIEM!" x={540} y={300} at={ratos} bg={C.yellow} size={56} />}
      {f >= fino && <Tag text="SOM AGUDO DEMAIS PRA GENTE" x={540} y={1200} at={fino} bg={C.violet} color={C.white} size={44} />}
      <Sfx at={ratos} name="sparkle" volume={0.45} />
      <Sfx at={fino} name="pop" volume={0.45} />
    </Full>
  );
};

/** Conclusão: o cérebro é o amigo que conta o final do filme… sem surpresa, sem graça! + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fin = wordAt(scene, "final");
  const graca = wordAt(scene, "graça!");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "aí!") - 8;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: fin, zoom: 1.1 }, { f: l1, zoom: 1.0 }]} shakes={[graca]}>
        <Cozinha />
        {f < l1 && <TVSpoiler x={700} y={880} s={0.9} spoiler={f >= fin} />}
        {f < l1 && <CerebroLado x={260} y={760} s={0.45} destaque={0.5} olhos />}
        <PersonagemEm
          x={f < l1 ? 330 : 540}
          pe={1640}
          altura={f < l1 ? 440 : 560}
          boca={mouth}
          expressao={f >= l1 ? "animado" : f >= fin ? "bravo" : "feliz"}
          pose={f >= l1 ? "acenando" : f >= fin ? "maosNaCintura" : "explicando"}
          corpoY={f >= l1 ? ri(f) * 0.5 : 0}
        />
        {f >= l1 && <Pena x={760} y={1250} s={0.7} rot={-40} />}
      </Camera>
      {f >= fin && f < l1 && <Tag text="SPOILER!" x={260} y={560} at={fin} bg={C.red} color={C.white} size={58} />}
      {f >= graca && f < l1 && <Tag text="SEM SURPRESA = SEM GRAÇA" x={540} y={300} at={graca - 10} bg={C.yellow} size={50} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="TEM MUITA CÓCEGA?" />}
      <Sfx at={fin} name="boom" volume={0.4} />
      <Sfx at={graca} name="boing" volume={0.45} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
