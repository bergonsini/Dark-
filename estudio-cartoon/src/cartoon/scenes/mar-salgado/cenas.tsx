import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Chuva2D, CopoSal, FundoMarFonte, Montanha, Praia, PredioSal, Rio, SalNoMar, Vapor } from "../../components/Mar";
import { BalaoComentario, Brilhos, Sol } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o mar é salgado?" (video: "mar-salgado") — fatos: NOAA, USGS, WHOI (ver roteiro.json "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 0–3 s: GANCHO. Tito na praia com cara de "eca" depois de provar a água. */
export const M1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const rio = wordAt(scene, "rio");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.35, y: 100 }, { f: 30, zoom: 1.05 }, { f: 90, zoom: 1.1 }]} shakes={[rio]}>
        <Praia nivel={980} />
        <Sol x={860} y={330} r={90} />
        <PersonagemEm x={400} pe={1560} altura={560} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.3} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O MAR É SALGADO…" top={190} size={92} color={C.white} at={0} />
      <TitleSlam text="E O RIO NÃO?" top={1390} size={130} color={C.yellow} at={Math.max(0, rio - 4)} rotate={3} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={0} name="riser" volume={0.4} />
      <Sfx at={Math.max(0, rio - 4)} name="boom" volume={0.6} />
    </Full>
  );
};

/** A chuva (levemente ácida) desgasta as rochas bem devagarinho. */
export const M2Chuva: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const acida = wordAt(scene, "ácida");
  const desg = wordAt(scene, "desgastando");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.08, y: -40 }, { f: desg, zoom: 1.18, y: -80 }]}>
        <CeuCampo topo="#546E7A" base="#90A4AE" nuvens corNuvem="#CFD8DC" />
        <Montanha x={620} y={1380} s={1.15} desgaste={cl(f, desg, desg + 60)} />
        <Chuva2D intensidade={0.9} />
        <PersonagemEm x={200} pe={1500} altura={420} boca={mouth} expressao={f >= desg ? "surpreso" : "feliz"} pose="apontando" olharX={0.8} olharY={-0.3} />
      </Camera>
      <Tag text="CHUVA" x={540} y={300} at={4} bg={C.blue} color={C.white} size={60} />
      {f >= acida && <Tag text="LEVEMENTE ÁCIDA" x={540} y={420} at={acida} bg={C.yellow} size={52} />}
      {f >= desg && <Tag text="DESGASTA AS ROCHAS" x={620} y={1080} at={desg} bg={C.white} size={46} />}
      <Sfx at={4} name="whoosh" volume={0.4} />
      <Sfx at={acida} name="pop" volume={0.45} />
      <Sfx at={desg} name="sparkle" volume={0.4} />
    </Full>
  );
};

/** Os rios levam os sais até o mar, um pouquinho por vez, por milhões de anos. */
export const M3Rios: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sais = wordAt(scene, "sais");
  const l1 = lineStart(scene, 1);
  const milhoes = wordAt(scene, "milhões");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.04, y: -30 }]}>
        <CeuCampo nuvens />
        <Montanha x={200} y={620} s={0.55} desgaste={0.6} />
        <Rio vel={f >= milhoes ? 2.4 : 1} />
        <Praia nivel={1500} areia={false} semCeu />
        <PersonagemEm x={840} pe={1440} altura={380} boca={mouth} expressao={f >= milhoes ? "encantado" : "feliz"} pose="explicando" olharX={-0.6} espelhar />
      </Camera>
      {f >= sais && <Tag text="SAIS" x={560} y={900} at={sais} bg={C.white} size={58} />}
      {f >= milhoes && <Tag text="MILHÕES DE ANOS!" x={540} y={300} at={milhoes} bg={C.yellow} size={56} />}
      {f >= l1 && f < milhoes && <Tag text="UM POUQUINHO POR VEZ" x={540} y={300} at={l1} bg={C.white} size={46} />}
      <Sfx at={6} name="borbulha" volume={0.35} />
      <Sfx at={sais} name="pop" volume={0.5} />
      <Sfx at={milhoes} name="riser" volume={0.4} />
    </Full>
  );
};

/** O Sol evapora a água… mas o sal fica e se acumula. */
export const M4Evapora: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sal = wordAt(scene, "sal");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sal, zoom: 1.12, y: 60 }]} shakes={[sal]}>
        <Praia nivel={900} areia={false} ceu={["#FFB74D", "#FFE082"]} />
        <Sol x={540} y={330} r={130} />
        <Vapor y={900} forca={1} />
        <SalNoMar y={900} qtd={f < sal ? 0 : Math.min(1, cl(f, sal, sal + 20) * 0.5 + cl(f, l1, l1 + 40) * 0.5)} />
        <PersonagemEm x={230} pe={1700} altura={420} boca={mouth} expressao={f >= sal ? "animado" : "pensativo"} pose={f >= sal ? "comemorando" : "pensando"} />
      </Camera>
      <Tag text="ÁGUA EVAPORA" x={680} y={560} at={10} bg={C.white} size={48} />
      {f >= sal && <TitleSlam text="O SAL FICA!" top={1230} size={110} color={C.yellow} at={sal} />}
      {f >= l1 && <Tag text="E SE ACUMULA" x={720} y={760} at={l1} bg={C.yellow} size={46} />}
      <Sfx at={10} name="whoosh" volume={0.4} />
      <Sfx at={sal} name="tada" volume={0.5} />
      <Sfx at={l1} name="pop" volume={0.4} />
    </Full>
  );
};

/** No fundo do mar, fontes quentes também soltam minerais. */
export const M5Fundo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const quentes = wordAt(scene, "quentes");
  const minerais = wordAt(scene, "minerais.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0, y: -200 }, { f: quentes, zoom: 1.1, y: 60 }]}>
        <FundoMarFonte jorro={cl(f, quentes - 10, quentes + 10)} />
        <PersonagemEm x={840} pe={1580} altura={380} boca={mouth} expressao="encantado" pose="apontando" espelhar olharX={-0.7} acessorio="capaceteEspacial" />
      </Camera>
      <Tag text="FUNDO DO MAR" x={540} y={300} at={4} bg={C.blue} color={C.white} size={54} />
      {f >= quentes && <Tag text="FONTES QUENTES" x={540} y={420} at={quentes} bg={C.orange} color={C.white} size={52} />}
      {f >= minerais && <Tag text="+ MINERAIS" x={300} y={900} at={minerais} bg={C.yellow} size={50} />}
      <Sfx at={4} name="borbulha" volume={0.45} />
      <Sfx at={quentes} name="boom" volume={0.35} />
      <Sfx at={minerais} name="ding" volume={0.45} />
    </Full>
  );
};

/** 35 g por litro… e espalhado na terra: uma camada da altura de um prédio de 40 andares. */
export const M6Quanto: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const trinta = wordAt(scene, "35");
  const l1 = lineStart(scene, 1);
  const quarenta = wordAt(scene, "40");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: trinta, zoom: 1.1 }]} shakes={[trinta]}>
          <CeuCampo nuvens />
          <CopoSal x={420} y={1250} s={1.25} pilha={cl(f, trinta - 6, trinta + 10)} />
          <PersonagemEm x={860} pe={1520} altura={360} boca={mouth} expressao="surpreso" pose="apontando" espelhar olharX={-0.8} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: quarenta, zoom: 1.05, y: 40 }]} shakes={[quarenta]}>
          <CeuCampo nuvens chao={1500} />
          <PredioSal sobe={cl(f, l1 + 10, quarenta + 6)} />
          <PersonagemEm x={600} pe={1560} altura={160} boca={mouth} expressao="surpreso" pose="assustado" />
        </Camera>
      )}
      {f < l1 && f >= trinta && <Tag text="≈ 35 g DE SAL" x={700} y={420} at={trinta} bg={C.yellow} size={60} />}
      {f >= l1 && <Tag text="CAMADA DE SAL" x={800} y={420} at={l1 + 10} bg={C.white} size={48} />}
      {f >= quarenta && <Brilhos x={800} y={600} at={quarenta} />}
      <Sfx at={trinta} name="ding" volume={0.5} />
      <Sfx at={l1 + 10} name="riser" volume={0.4} />
      <Sfx at={quarenta} name="boom" volume={0.45} />
    </Full>
  );
};

/** E o rio? Também leva sal, mas a chuva renova a água o tempo todo → continua doce. */
export const M7Rio: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const renova = wordAt(scene, "renova");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: renova, zoom: 1.08 }, { f: l1, zoom: 1.15, y: 80 }]}>
        <CeuCampo nuvens />
        <Rio graos={0.25} vel={1.6} />
        {f >= renova && <Chuva2D intensidade={0.5} y1={1500} />}
        <PersonagemEm x={820} pe={1300} altura={400} boca={mouth} expressao={f >= l1 ? "encantado" : "pensativo"} pose={f >= l1 ? "comemorando" : "pensando"} espelhar />
      </Camera>
      <Tag text="E O RIO?" x={540} y={300} at={4} bg={C.white} size={60} />
      {f >= renova && <Tag text="ÁGUA SEMPRE NOVA" x={540} y={420} at={renova} bg={C.blue} color={C.white} size={50} />}
      {f >= l1 && <TitleSlam text="DOCINHO!" top={1180} size={120} color={C.green} at={l1 + 4} />}
      <Sfx at={4} name="click" volume={0.4} />
      <Sfx at={renova} name="whoosh" volume={0.45} />
      <Sfx at={l1 + 4} name="sparkle" volume={0.5} />
    </Full>
  );
};

/** Conclusão + chamada: "Você já engoliu água do mar sem querer? Conta aí!" */
export const M8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  const onda = cl(f, l1 + 10, l1 + 30);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }]} shakes={[l1 + 26]}>
        <Praia nivel={1000 - onda * 120} />
        <Sol x={860} y={330} r={90} />
        <PersonagemEm x={400} pe={1560} altura={540} boca={mouth} expressao={f >= l1 + 26 ? "surpreso" : "feliz"} pose={f >= l1 + 26 ? "assustado" : "explicando"} />
      </Camera>
      {f < l1 && <TitleSlam text="SAL DE MILHÕES DE ANOS" top={240} size={80} color={C.white} at={6} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="CONTA AÍ! 💬" />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={l1 + 26} name="boing" volume={0.5} />
      <Sfx at={conta} name="tada" volume={0.45} />
    </Full>
  );
};
