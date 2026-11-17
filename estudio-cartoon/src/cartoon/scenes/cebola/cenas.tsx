import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { BandeiraJapao, CebolaPersonagem, Celulas, Faca, GasTravesso, GeladeiraCebola, OlhoChorao, Trofeu } from "../../components/Cebola";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario, Brilhos } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que a cebola faz chorar?" (video: "cebola") — fatos: Library of Congress, Nature 2002, Scientific American (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 0–3 s: GANCHO. Tito chorando com a faca na mão; a cebola sorrindo, malandra. */
export const C1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const chorar = wordAt(scene, "chorar?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.35, y: 100 }, { f: 30, zoom: 1.05 }, { f: 90, zoom: 1.1 }]} shakes={[chorar]}>
        <Cozinha />
        <CebolaPersonagem x={760} y={1180} s={0.8} expr="malandra" />
        <PersonagemEm x={300} pe={1560} altura={560} boca={mouth} expressao="preocupado" pose="assustado" olharX={0.6} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE A CEBOLA" top={190} size={100} color={C.white} at={0} />
      <TitleSlam text="FAZ CHORAR?" top={1390} size={140} color={C.yellow} at={Math.max(0, chorar - 4)} rotate={3} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={0} name="riser" volume={0.4} />
      <Sfx at={Math.max(0, chorar - 4)} name="boom" volume={0.6} />
    </Full>
  );
};

/** Ela nem tá triste… mas tem uma ARMADILHA química: ingredientes separados, cada um no seu cantinho. */
export const C2Armadilha: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sert = wordAt(scene, "sertanejo…");
  const sim = wordAt(scene, "sim");
  const arm = wordAt(scene, "armadilha");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: arm, zoom: 1.15, y: 60 }]} shakes={[arm]}>
          <Cozinha />
          <CebolaPersonagem x={600} y={1150} s={1.3} expr={f >= arm ? "malandra" : f >= sim ? "surpresa" : "feliz"} sertaneja={f < sim} chapeuVoa={cl(f, sim, sim + 14)} />
          <PersonagemEm x={180} pe={1560} altura={380} boca={mouth} expressao={f >= arm ? "surpreso" : "feliz"} pose="apontando" olharX={0.8} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: 120, zoom: 1.08 }]}>
          <CeuCampo topo="#EDE7F6" base="#D1C4E9" nuvens={false} colina1="#D1C4E9" colina2="#D1C4E9" />
          <Celulas cx={540} cy={1000} rompe={0} />
        </Camera>
      )}
      {f < sim && f >= sert - 6 && <Tag text="SOFRÊNCIA?" x={540} y={320} at={sert - 6} bg={C.white} size={60} />}
      {f >= sim && f < arm && <Tag text="NÃO É ISSO!" x={540} y={320} at={sim} bg={C.red} color={C.white} size={60} />}
      {f >= arm && f < l1 && <Tag text="ARMADILHA QUÍMICA" x={540} y={320} at={arm} bg={C.yellow} size={58} />}
      {f >= l1 && <Tag text="CÉLULAS DA CEBOLA" x={540} y={300} at={l1 + 4} bg={C.violet} color={C.white} size={52} />}
      {f >= l1 + 40 && <Tag text="INGREDIENTES SEPARADOS" x={540} y={1400} at={l1 + 40} bg={C.white} size={48} />}
      <Sfx at={4} name="ding" volume={0.3} />
      <Sfx at={22} name="ding" volume={0.3} />
      <Sfx at={sim} name="whoosh" volume={0.5} />
      <Sfx at={arm} name="boing" volume={0.5} />
      <Sfx at={l1 + 4} name="whoosh" volume={0.4} />
      <Sfx at={l1 + 40} name="ding" volume={0.4} />
    </Full>
  );
};

/** A faca corta: as células se ROMPEM e tudo se mistura! */
export const C3Corte: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const corta = wordAt(scene, "corta,");
  const rompem = wordAt(scene, "rompem…");
  const mistura = wordAt(scene, "mistura!");
  const desce = cl(f, corta - 6, corta + 4);
  return (
    <Full>
      {f < rompem ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }]} shakes={[corta + 4]}>
          <Cozinha />
          <CebolaPersonagem x={540} y={1250} s={1.2} expr={f >= corta ? "surpresa" : "feliz"} corte={cl(f, corta + 4, corta + 14)} />
          <Faca x={300} y={600 + desce * 420} ang={20} s={1.1} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.05 }, { f: 60, zoom: 1.15 }]} shakes={[mistura]}>
          <CeuCampo topo="#EDE7F6" base="#D1C4E9" nuvens={false} colina1="#D1C4E9" colina2="#D1C4E9" />
          <Celulas cx={540} cy={1000} rompe={cl(f, rompem, mistura + 10)} />
        </Camera>
      )}
      {f >= corta && f < rompem && <Tag text="CRAU!" x={540} y={400} at={corta + 4} bg={C.white} size={70} />}
      {f >= rompem && <Tag text="CÉLULAS ROMPIDAS" x={540} y={300} at={rompem} bg={C.red} color={C.white} size={52} />}
      {f >= mistura && <TitleSlam text="MISTUROU!" top={1350} size={110} color={C.green} at={mistura} />}
      <Sfx at={corta + 4} name="click" volume={0.6} />
      <Sfx at={rompem} name="pop" volume={0.5} />
      <Sfx at={mistura} name="borbulha" volume={0.5} />
    </Full>
  );
};

/** Uma enzima transforma a mistura num gás INVISÍVEL… que voa direto pros seus OLHOS! */
export const C4Gas: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const enzima = wordAt(scene, "enzima");
  const invis = wordAt(scene, "invisível…");
  const l1 = lineStart(scene, 1);
  const olhos = wordAt(scene, "olhos!");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: invis, zoom: 1.1, y: -40 }]}>
          <CeuCampo topo="#EDE7F6" base="#D1C4E9" nuvens={false} colina1="#D1C4E9" colina2="#D1C4E9" />
          <Celulas cx={540} cy={1100} rompe={1} />
          <GasTravesso x0={540} y0={1100} x1={540} y1={650} t={cl(f, enzima + 10, invis + 10)} s={1.4} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: olhos, zoom: 1.12, x: 60, y: 120 }]} shakes={[olhos]}>
          <Cozinha />
          <CebolaPersonagem x={260} y={1300} s={0.75} corte={1} />
          <PersonagemEm x={760} pe={1640} altura={620} boca={mouth} expressao={f >= olhos ? "preocupado" : "surpreso"} pose="assustado" olharX={-0.6} espelhar />
          <GasTravesso x0={260} y0={1100} x1={760} y1={800} t={cl(f, l1, olhos + 4)} s={1} />
        </Camera>
      )}
      {f >= enzima && f < l1 && <Tag text="ENZIMA" x={300} y={480} at={enzima} bg={C.teal} color={C.white} size={54} />}
      {f >= invis && f < l1 && <Tag text="GÁS INVISÍVEL" x={720} y={380} at={invis} bg={C.white} size={52} />}
      {f >= olhos && <TitleSlam text="NOS OLHOS!" top={300} size={110} color={C.yellow} at={olhos} />}
      <Sfx at={enzima} name="sparkle" volume={0.45} />
      <Sfx at={invis} name="whoosh" volume={0.4} />
      <Sfx at={l1} name="whoosh" volume={0.5} />
      <Sfx at={olhos} name="boing" volume={0.5} />
    </Full>
  );
};

/** O gás irrita os nervos do olho; o corpo reage soltando LÁGRIMAS pra lavar tudo. */
export const C5Olho: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const irrita = wordAt(scene, "irrita");
  const lagr = wordAt(scene, "lágrimas");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: irrita, zoom: 1.08 }, { f: lagr, zoom: 1.15, y: 60 }]} shakes={[lagr]}>
        <CeuCampo topo="#F8BBD0" base="#FCE4EC" nuvens={false} colina1="#FCE4EC" colina2="#FCE4EC" />
        <OlhoChorao x={540} y={860} s={1.4} irrita={cl(f, irrita, irrita + 20)} lagrimas={cl(f, lagr, lagr + 14)} />
        <GasTravesso x0={-100} y0={500} x1={360} y1={720} t={cl(f, 0, irrita)} s={0.9} />
      </Camera>
      {f >= irrita && <Tag text="NERVOS IRRITADOS" x={540} y={300} at={irrita} bg={C.red} color={C.white} size={54} />}
      {f >= lagr && <Tag text="LÁGRIMAS = LAVAGEM!" x={540} y={1180} at={lagr} bg={C.blue} color={C.white} size={54} />}
      <Sfx at={irrita} name="click" volume={0.4} />
      <Sfx at={lagr} name="borbulha" volume={0.5} />
    </Full>
  );
};

/** Descoberta em 2002 por cientistas japoneses… e ganhou o IgNobel! */
export const C6Descoberta: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const ano = wordAt(scene, "2002,");
  const jap = wordAt(scene, "japoneses.");
  const l1 = lineStart(scene, 1);
  const ig = wordAt(scene, "ignobel,");
  const rir = wordAt(scene, "rir…");
  const pensar = wordAt(scene, "pensar!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.05 }, { f: ig, zoom: 1.12, y: -40 }]} shakes={[ig]}>
        <CeuCampo nuvens />
        {f < l1 && f >= jap && <BandeiraJapao x={620} y={700} s={1.4} />}
        {f >= ig && <Trofeu x={700} y={1060} s={1.4} />}
        <PersonagemEm
          x={250}
          pe={1500}
          altura={460}
          boca={mouth}
          expressao={f >= pensar ? "pensativo" : f >= rir ? "animado" : f >= ig ? "encantado" : "feliz"}
          pose={f >= pensar ? "pensando" : f >= rir ? "comemorando" : "explicando"}
          olharX={0.6}
        />
      </Camera>
      {f >= ano && f < l1 && <TitleSlam text="2002" top={300} size={160} color={C.yellow} at={ano} />}
      {f >= jap && f < l1 && <Tag text="CIENTISTAS JAPONESES" x={620} y={1130} at={jap} bg={C.white} size={46} />}
      {f >= ig && <Tag text="PRÊMIO IG NOBEL" x={540} y={300} at={ig} bg={C.yellow} size={56} />}
      {f >= rir && <Tag text="RIR… E DEPOIS PENSAR!" x={600} y={1300} at={rir} bg={C.white} size={46} />}
      {f >= ig && <Brilhos x={700} y={800} at={ig} />}
      <Sfx at={ano} name="boom" volume={0.45} />
      <Sfx at={jap} name="pop" volume={0.45} />
      <Sfx at={ig} name="tada" volume={0.5} />
      <Sfx at={rir} name="boing" volume={0.4} />
    </Full>
  );
};

/** Dicas: faca BEM afiada (estraga menos células) e cebola na GELADEIRA antes de cortar. */
export const C7Dicas: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const afiada = wordAt(scene, "afiada,");
  const l1 = lineStart(scene, 1);
  const gel = wordAt(scene, "geladeira");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: afiada, zoom: 1.08 }]}>
          <Cozinha />
          <Faca x={260} y={900} ang={-8} s={1.4} brilho={f >= afiada} />
          <PersonagemEm x={820} pe={1560} altura={420} boca={mouth} expressao="feliz" pose="explicando" espelhar olharX={-0.6} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: gel, zoom: 1.08 }]}>
          <Cozinha />
          <GeladeiraCebola x={400} y={1420} s={1.15} abre={cl(f, gel - 4, gel + 10)} />
          <PersonagemEm x={860} pe={1560} altura={400} boca={mouth} expressao="encantado" pose="apontando" espelhar olharX={-0.8} />
        </Camera>
      )}
      <Tag text="QUER CHORAR MENOS?" x={540} y={300} at={4} bg={C.white} size={54} />
      {f >= afiada && f < l1 && <Tag text="DICA 1: FACA AFIADA" x={540} y={420} at={afiada} bg={C.yellow} size={52} />}
      {f >= gel && <Tag text="DICA 2: GELADEIRA" x={540} y={420} at={gel} bg={C.blue} color={C.white} size={52} />}
      <Sfx at={4} name="click" volume={0.4} />
      <Sfx at={afiada} name="sparkle" volume={0.5} />
      <Sfx at={gel} name="ding" volume={0.5} />
    </Full>
  );
};

/** Conclusão: não é tristeza, é QUÍMICA pura! Qual comida te faz chorar? */
export const C8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const quimica = wordAt(scene, "química");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }]} shakes={[quimica]}>
        <Cozinha />
        <CebolaPersonagem x={760} y={1200} s={0.85} expr={f >= l1 ? "malandra" : "feliz"} />
        <PersonagemEm x={300} pe={1560} altura={520} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} olharX={0.4} />
      </Camera>
      {f < quimica && <Tag text="NÃO É SOFRÊNCIA…" x={540} y={320} at={8} bg={C.white} size={56} />}
      {f >= quimica && f < l1 && <TitleSlam text="É QUÍMICA PURA!" top={300} size={100} color={C.yellow} at={quimica} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="QUAL COMIDA TE FAZ CHORAR?" />}
      <Sfx at={quimica} name="tada" volume={0.5} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
