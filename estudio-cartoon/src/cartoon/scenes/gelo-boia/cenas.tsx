import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Cobertor, CopoGelo, GarrafaCongelador, Iceberg, LagoInverno, Moleculas } from "../../components/Gelo";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o gelo boia?" (video: "gelo-boia") — fatos: USGS, Univ. of Illinois, Live Science (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Frio: React.FC = () => <CeuCampo topo="#d6efff" base="#f2faff" nuvens={false} colina1="#e8f6ff" colina2="#dcefff" />;

/** 0–3 s: GANCHO. O Tito com um copo d'água e o gelo boiando: "Por que o gelo BOIA?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const boia = wordAt(scene, "boia?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 40 }, { f: 30, zoom: 1.05 }]} shakes={[boia]}>
        <Cozinha />
        <CopoGelo x={720} y={1080} s={0.75} boia={cl(f, 0, boia)} />
        <PersonagemEm x={260} pe={1640} altura={520} boca={mouth} expressao="surpreso" pose="apontando" olharX={0.7} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O GELO" top={190} size={100} color={C.white} at={0} />
      <TitleSlam text="BOIA?!" top={1390} size={170} color={C.yellow} at={Math.max(0, boia - 4)} rotate={-3} />
      <Sfx at={0} name="borbulha" volume={0.45} />
      <Sfx at={boia} name="boing" volume={0.5} />
    </Full>
  );
};

/** Era pra afundar: quase todo sólido é mais pesado que o líquido… a água faz o contrário. */
export const S2Estranho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const afundar = wordAt(scene, "afundar!");
  const pesado = wordAt(scene, "pesado.");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.08 }]} shakes={[l1]}>
        <Frio />
        <CopoGelo x={540} y={950} s={1.05} comparar afunda={cl(f, pesado - 10, pesado + 20)} boia={1} />
        <PersonagemEm x={890} pe={1660} altura={300} boca={mouth} expressao={f >= l1 ? "surpreso" : "pensativo"} pose={f >= l1 ? "assustado" : "pensando"} espelhar olharX={-0.6} />
      </Camera>
      {f >= afundar && <Tag text="ERA PRA AFUNDAR!" x={540} y={300} at={afundar} bg={C.white} size={56} />}
      {f >= pesado && f < l1 && <Tag text="SÓLIDO COMUM: AFUNDA" x={640} y={1200} at={pesado} bg={C.red} color={C.white} size={44} />}
      {f >= l1 && <TitleSlam text="A ÁGUA NÃO!" top={1170} size={110} color={C.blue} at={l1} />}
      <Sfx at={afundar} name="pop" volume={0.45} />
      <Sfx at={pesado} name="boom" volume={0.45} />
      <Sfx at={l1} name="boing" volume={0.5} />
    </Full>
  );
};

/** Ao congelar, as moléculas se dão as mãos (roda de ciranda): fica espaçoso, com buracos, ~9% maior. */
export const S3Ciranda: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const maos = wordAt(scene, "mãos,");
  const l1 = lineStart(scene, 1);
  const esp = wordAt(scene, "espaçoso,");
  const nove = wordAt(scene, "nove");
  const k = cl(f, maos - 20, maos + 25);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: maos, zoom: 1.05 }, { f: nove, zoom: 1.1 }]} shakes={[nove]}>
        <Frio />
        <Moleculas x={540} y={880} s={1.15} k={k} />
        <PersonagemEm x={880} pe={1660} altura={300} boca={mouth} expressao={f >= esp ? "encantado" : "animado"} pose={f >= l1 ? "comemorando" : "explicando"} espelhar olharX={-0.6} />
      </Camera>
      <Tag text={f < maos - 20 ? "ÁGUA LÍQUIDA: BAGUNÇA" : "GELO: DE MÃOS DADAS"} x={540} y={300} at={f < maos - 20 ? 6 : maos - 20} bg={f < maos - 20 ? C.white : C.yellow} size={50} />
      {f >= esp && <Tag text="BURACOS NO MEIO" x={540} y={420} at={esp} bg={C.blue} color={C.white} size={48} />}
      {f >= nove && <TitleSlam text="+9% DE ESPAÇO" top={1180} size={110} color={C.yellow} at={nove} />}
      <Sfx at={maos} name="sparkle" volume={0.45} />
      <Sfx at={esp} name="pop" volume={0.45} />
      <Sfx at={nove} name="tada" volume={0.4} />
    </Full>
  );
};

/** Mais espaço com o mesmo peso: mais leve que a água, flutua. Só 10% pra fora: a ponta do iceberg! */
export const S4Boia: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const leve = wordAt(scene, "leve");
  const l1 = lineStart(scene, 1);
  const ponta = wordAt(scene, "ponta");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: leve, zoom: 1.08 }]}>
          <Frio />
          <CopoGelo x={540} y={950} s={1.05} boia={cl(f, 10, leve + 10)} />
          <PersonagemEm x={880} pe={1660} altura={300} boca={mouth} expressao="feliz" pose="apontando" espelhar olharX={-0.6} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: ponta, zoom: 1.06, y: -40 }]} shakes={[ponta]}>
          <CeuCampo topo="#9fd8ff" base="#d6efff" nuvens colina1="#d6efff" colina2="#d6efff" />
          <Iceberg x={540} y={760} s={1.0} />
        </Camera>
      )}
      {f >= leve && f < l1 && <Tag text="MAIS LEVE QUE A ÁGUA" x={540} y={300} at={leve} bg={C.white} size={52} />}
      {f >= l1 && <Tag text="10% PRA FORA" x={540} y={300} at={l1 + 6} bg={C.yellow} size={58} />}
      {f >= l1 && <Tag text="90% ESCONDIDO" x={540} y={1150} at={l1 + 30} bg={C.blue} color={C.white} size={52} />}
      {f >= ponta && <TitleSlam text="A PONTA DO ICEBERG!" top={430} size={80} color={C.white} at={ponta} />}
      <Sfx at={leve} name="boing" volume={0.4} />
      <Sfx at={l1 + 6} name="whoosh" volume={0.45} />
      <Sfx at={ponta} name="tada" volume={0.4} />
    </Full>
  );
};

/** Por isso a garrafa de vidro esquecida no congelador ESTOURA! */
export const S5Garrafa: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const est = wordAt(scene, "estoura!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: est - 20, zoom: 1.1 }]} shakes={[est]}>
        <Cozinha />
        <GarrafaCongelador x={540} y={900} s={1.0} gelo={cl(f, 10, est - 20)} racha={cl(f, est - 25, est + 2)} />
      </Camera>
      <Tag text="ESQUECEU NO CONGELADOR?" x={540} y={300} at={6} bg={C.white} size={50} />
      {f >= est && <TitleSlam text="CRAC!" top={1200} size={170} color={C.red} at={est} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={est - 20} name="click" volume={0.5} />
      <Sfx at={est} name="boom" volume={0.45} />
    </Full>
  );
};

/** Salva os peixes: o lago congela só em cima e o gelo vira um cobertor pra água lá embaixo. */
export const S6Peixes: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const cima = wordAt(scene, "cima…");
  const l1 = lineStart(scene, 1);
  const cob = wordAt(scene, "cobertor");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: cob, zoom: 1.06 }]}>
        <Frio />
        <LagoInverno x={540} y={950} s={1.0} gelo={cl(f, 15, cima + 10)} cobertor={f >= cob} />
      </Camera>
      <Tag text="SALVA OS PEIXES!" x={540} y={300} at={6} bg={C.yellow} size={58} />
      {f >= cima && f < l1 && <Tag text="SÓ CONGELA EM CIMA" x={540} y={560} at={cima} bg={C.white} size={48} />}
      {f >= cob && <Tag text="COBERTOR DE GELO" x={540} y={560} at={cob} bg={C.red} color={C.white} size={50} />}
      <Sfx at={6} name="borbulha" volume={0.4} />
      <Sfx at={cima} name="click" volume={0.4} />
      <Sfx at={cob} name="sparkle" volume={0.45} />
    </Full>
  );
};

/** Conclusão: o gelo fica espaçoso no frio… e eu viro bolinha debaixo da coberta! + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const bol = wordAt(scene, "bolinha");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  const enrolado = f >= bol - 10 && f < l1;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: bol, zoom: 1.14 }, { f: l1, zoom: 1.0 }]} shakes={[bol]}>
        <Frio />
        {f < bol - 10 && <CopoGelo x={790} y={1000} s={0.6} />}
        <PersonagemEm
          x={enrolado ? 540 : f >= l1 ? 540 : 330}
          pe={1640}
          altura={enrolado ? 560 : f >= l1 ? 560 : 440}
          boca={mouth}
          expressao={f >= l1 ? "animado" : enrolado ? "preocupado" : "feliz"}
          pose={f >= l1 ? "acenando" : "explicando"}
        />
        {enrolado && <Cobertor x={540} y={1560} s={1.05} />}
        {f >= l1 && <CopoGelo x={830} y={1250} s={0.45} />}
      </Camera>
      {f < bol - 10 && <Tag text="GELO: ESPAÇOSO NO FRIO" x={540} y={320} at={8} bg={C.white} size={50} />}
      {enrolado && <Tag text="EU: BOLINHA NO FRIO" x={540} y={320} at={bol - 10} bg={C.violet} color={C.white} size={52} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="JÁ ESQUECEU UMA GARRAFA?" />}
      <Sfx at={8} name="whoosh" volume={0.4} />
      <Sfx at={bol} name="boing" volume={0.5} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
