import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Cozinha } from "../../components/Natal";
import { Amido, Forno, Gelado, Pao } from "../../components/Pao";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o pão fica duro?" (video: "pao-duro") — fatos: BBC Science Focus, Wikipedia (Staling), Chowhound (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Lab: React.FC = () => <CeuCampo topo="#fff1d6" base="#fffaf0" nuvens={false} colina1="#ffeccc" colina2="#ffe4b8" />;

/** 0–3 s: GANCHO. O Tito bate no pão… TOC TOC: "Por que o pão fica DURO no outro dia?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const duro = wordAt(scene, "duro");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 40 }, { f: 30, zoom: 1.05 }]} shakes={[duro, duro + 10]}>
        <Cozinha />
        <Pao x={720} y={1180} s={0.85} duro={1} rot={-4} />
        <PersonagemEm x={270} pe={1640} altura={520} boca={mouth} expressao="surpreso" pose="apontando" olharX={0.7} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O PÃO FICA" top={190} size={92} color={C.white} at={0} />
      <TitleSlam text="DURO?!" top={1390} size={170} color={C.yellow} at={Math.max(0, duro - 4)} rotate={-3} />
      <Sfx at={duro} name="click" volume={0.6} />
      <Sfx at={duro + 10} name="click" volume={0.6} />
    </Full>
  );
};

/** Mito: "só secou"? O culpado é o AMIDO! */
export const S2Mito: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const secou = wordAt(scene, "secou.");
  const l1 = lineStart(scene, 1);
  const amido = wordAt(scene, "amido!");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: secou, zoom: 1.06 }]}>
          <Cozinha />
          <Pao x={540} y={1000} s={1.0} duro={1} />
          <PersonagemEm x={880} pe={1660} altura={300} boca={mouth} expressao="pensativo" pose="pensando" espelhar olharX={-0.6} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: amido, zoom: 1.08 }]} shakes={[amido]}>
          <Lab />
          <Amido x={540} y={880} s={1.0} incha={0} cristal={0} />
        </Camera>
      )}
      {f >= secou && f < l1 && <Tag text="SÓ SECOU?" x={540} y={320} at={secou} bg={C.white} size={60} />}
      {f >= l1 && f < amido && <Tag text="POR DENTRO DO PÃO" x={540} y={300} at={l1} bg={C.white} size={50} />}
      {f >= amido && <TitleSlam text="O AMIDO!" top={390} size={110} color={C.orange} at={amido} />}
      <Sfx at={secou} name="pop" volume={0.45} />
      <Sfx at={amido} name="boom" volume={0.4} />
    </Full>
  );
};

/** No forno o amido bebe água e incha (molinho); esfriando, se arruma de novo tipo cristal… e endurece. */
export const S3Forno: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const incha = wordAt(scene, "incha");
  const l1 = lineStart(scene, 1);
  const crist = wordAt(scene, "cristal…");
  const end = wordAt(scene, "endurece.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: incha, zoom: 1.05 }, { f: crist, zoom: 1.1 }]} shakes={[end]}>
        <Lab />
        <Amido x={540} y={880} s={1.0} incha={cl(f, 10, incha + 10)} cristal={cl(f, l1 + 20, crist + 10)} />
        <PersonagemEm x={890} pe={1680} altura={280} boca={mouth} expressao={f >= end ? "surpreso" : "animado"} pose="explicando" espelhar olharX={-0.6} />
      </Camera>
      {f < l1 && <Tag text="NO FORNO: BEBE ÁGUA" x={540} y={300} at={6} bg={C.blue} color={C.white} size={50} />}
      {f >= incha && f < l1 && <Tag text="INCHA = MOLINHO" x={540} y={420} at={incha} bg={C.yellow} size={52} />}
      {f >= l1 && <Tag text="ESFRIANDO…" x={540} y={300} at={l1} bg={C.white} size={56} />}
      {f >= crist && <Tag text="TIPO CRISTAL" x={540} y={420} at={crist} bg={C.violet} color={C.white} size={52} />}
      {f >= end && <TitleSlam text="ENDURECEU!" top={1130} size={110} color={C.orange} at={end} />}
      <Sfx at={incha} name="borbulha" volume={0.45} />
      <Sfx at={crist} name="click" volume={0.45} />
      <Sfx at={end} name="boing" volume={0.45} />
    </Full>
  );
};

/** Geladeira: PIORA! No friozinho endurece mais rápido. */
export const S4Geladeira: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const piora = wordAt(scene, "piora!");
  const l1 = lineStart(scene, 1);
  const rap = wordAt(scene, "rápido.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: piora, zoom: 1.06 }]} shakes={[piora]}>
        <Cozinha />
        <Gelado x={560} y={900} s={1.0} tipo="geladeira" duroPao={cl(f, l1, rap)} />
        <PersonagemEm x={190} pe={1660} altura={320} boca={mouth} expressao={f >= piora ? "preocupado" : "pensativo"} pose={f >= piora ? "assustado" : "pensando"} olharX={0.6} />
      </Camera>
      <Tag text="E NA GELADEIRA?" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= piora && <TitleSlam text="PIORA!" top={420} size={140} color={C.red} at={piora} />}
      {f >= rap && <Tag text="ENDURECE MAIS RÁPIDO" x={560} y={1290} at={rap} bg={C.blue} color={C.white} size={46} />}
      <Sfx at={6} name="click" volume={0.4} />
      <Sfx at={piora} name="boom" volume={0.4} />
      <Sfx at={rap} name="pop" volume={0.45} />
    </Full>
  );
};

/** Freezer: quase tudo PARA; pão congelado aguenta MESES. */
export const S5Freezer: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const para = wordAt(scene, "para.");
  const meses = wordAt(scene, "meses!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: meses, zoom: 1.08 }]} shakes={[meses]}>
        <Cozinha />
        <Gelado x={560} y={900} s={1.0} tipo="freezer" duroPao={0} />
        <PersonagemEm x={190} pe={1660} altura={320} boca={mouth} expressao="animado" pose="apontando" olharX={0.6} />
      </Camera>
      <Tag text="NO FREEZER" x={540} y={300} at={6} bg={C.blue} color={C.white} size={58} />
      {f >= para && <Tag text="QUASE TUDO PARA" x={540} y={420} at={para} bg={C.white} size={52} />}
      {f >= meses && <TitleSlam text="AGUENTA MESES!" top={1130} size={96} color={C.green} at={meses} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={para} name="click" volume={0.45} />
      <Sfx at={meses} name="tada" volume={0.4} />
    </Full>
  );
};

/** Truque: pinguinho de água na casca + forno quente; o pão amolece… mas só por um tempinho. */
export const S6Truque: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pingo = wordAt(scene, "pinguinho");
  const quente = wordAt(scene, "quente.");
  const l1 = lineStart(scene, 1);
  const amol = wordAt(scene, "amolece…");
  const temp = wordAt(scene, "tempinho!");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: quente, zoom: 1.06 }]}>
          <Cozinha />
          <Forno x={540} y={920} s={1.0} luz={cl(f, quente - 10, quente + 10)} borrifa={f >= pingo - 6 && f < quente} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: amol, zoom: 1.08 }]} shakes={[temp]}>
          <Cozinha />
          <Pao x={600} y={1050} s={0.95} duro={f >= temp ? 0.6 : 0} quente={f < temp} />
          <PersonagemEm x={200} pe={1660} altura={340} boca={mouth} expressao={f >= temp ? "preocupado" : "encantado"} pose={f >= temp ? "pensando" : "comemorando"} olharX={0.6} />
        </Camera>
      )}
      <Tag text="O TRUQUE" x={540} y={300} at={6} bg={C.yellow} size={60} />
      {f >= pingo && f < l1 && <Tag text="ÁGUA NA CASCA + FORNO" x={540} y={420} at={pingo} bg={C.white} size={48} />}
      {f >= amol && f < temp && <Tag text="AMOLECEU!" x={600} y={760} at={amol} bg={C.green} color={C.white} size={58} />}
      {f >= temp && <Tag text="SÓ POR UM TEMPINHO" x={540} y={420} at={temp} bg={C.red} color={C.white} size={48} />}
      <Sfx at={pingo} name="borbulha" volume={0.4} />
      <Sfx at={quente} name="whoosh" volume={0.45} />
      <Sfx at={amol} name="sparkle" volume={0.45} />
      <Sfx at={temp} name="boing" volume={0.4} />
    </Full>
  );
};

/** Conclusão: pão amanhecido é tipo a gente de manhã: duro… mas um calorzinho resolve! + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const duro = wordAt(scene, "duro…");
  const cal = wordAt(scene, "calorzinho");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: duro, zoom: 1.12 }, { f: l1, zoom: 1.0 }]} shakes={[duro]}>
        <Cozinha />
        <Pao x={790} y={1050} s={0.6} duro={f >= cal ? 0 : 1} quente={f >= cal} />
        <PersonagemEm
          x={f >= l1 ? 540 : 320}
          pe={1640}
          altura={f >= l1 ? 560 : 460}
          boca={mouth}
          expressao={f >= l1 ? "animado" : f >= cal ? "encantado" : f >= duro ? "neutro" : "feliz"}
          pose={f >= l1 ? "acenando" : f >= cal ? "comemorando" : f >= duro ? "parado" : "explicando"}
        />
      </Camera>
      {f >= duro && f < cal && <Tag text="EU DE MANHÃ: DURO" x={540} y={320} at={duro} bg={C.white} size={52} />}
      {f >= cal && f < l1 && <Tag text="+ CALORZINHO = NOVO!" x={540} y={320} at={cal} bg={C.yellow} size={52} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="GUARDA O PÃO ONDE?" />}
      <Sfx at={duro} name="click" volume={0.5} />
      <Sfx at={cal} name="sparkle" volume={0.45} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
