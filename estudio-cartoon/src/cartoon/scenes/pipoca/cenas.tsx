import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Cozinha } from "../../components/Natal";
import { FolhaProva, GraoPipoca, Manometro, MapaPeru, PanelaPipoca, VasoAntigo } from "../../components/Pipoca";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que a pipoca estoura?" (video: "pipoca") — fatos: Scientific American, PopSci, USDA, Smithsonian, Live Science (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const FundoLab: React.FC = () => <CeuCampo topo="#FFF4C7" base="#FFFBEA" nuvens={false} colina1="#FFF1B8" colina2="#FFE9A0" />;

/** 0–3 s: GANCHO. Panela pipocando forte, Tito assustado: "Por que a pipoca ESTOURA?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const est = wordAt(scene, "estoura?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.3, y: 60 }, { f: 30, zoom: 1.05 }]} shakes={[est]}>
        <Cozinha />
        <PanelaPipoca x={700} y={1180} s={0.85} pulos pipocas={8} />
        <PersonagemEm x={250} pe={1640} altura={520} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.7} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE A PIPOCA" top={190} size={96} color={C.white} at={0} />
      <TitleSlam text="ESTOURA?!" top={1390} size={150} color={C.yellow} at={Math.max(0, est - 4)} rotate={-3} />
      <Sfx at={0} name="pop" volume={0.5} />
      <Sfx at={14} name="pop" volume={0.45} />
      <Sfx at={est} name="pop" volume={0.55} />
      <Sfx at={est + 10} name="pop" volume={0.45} />
    </Full>
  );
};

/** O grão: água lá dentro + casca durinha que não deixa nada escapar. */
export const S2Grao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const agua = wordAt(scene, "água");
  const l1 = lineStart(scene, 1);
  const casca = wordAt(scene, "casca");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: agua, zoom: 1.08 }, { f: l1, zoom: 1.0 }]}>
        <FundoLab />
        <GraoPipoca x={540} y={920} s={2.1} corte={cl(f, agua - 12, agua + 4)} destaqueCasca={f >= casca} />
        <PersonagemEm x={880} pe={1660} altura={320} boca={mouth} expressao="animado" pose="apontando" espelhar olharX={-0.7} />
      </Camera>
      <Tag text="MILHO DE PIPOCA" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= agua && <Tag text="ÁGUA LÁ DENTRO!" x={540} y={420} at={agua} bg={C.blue} color={C.white} size={52} />}
      {f >= casca && <Tag text="CASCA DURINHA" x={540} y={540} at={casca} bg={C.orange} color={C.white} size={52} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={agua} name="borbulha" volume={0.45} />
      <Sfx at={casca} name="click" volume={0.5} />
    </Full>
  );
};

/** Na panela a água vira vapor e a pressão sobe, sobe… */
export const S3Pressao: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const vapor = wordAt(scene, "vapor…");
  const press = wordAt(scene, "pressão");
  const p = cl(f, press - 6, (scene.endFrame - scene.startFrame) - 6);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: press, zoom: 1.06 }, { f: (scene.endFrame - scene.startFrame), zoom: 1.14 }]} shakes={[(scene.endFrame - scene.startFrame) - 20]}>
        <FundoLab />
        <PanelaPipoca x={540} y={1530} s={0.9} />
        <GraoPipoca x={540} y={800} s={1.7} corte={1} vapor={cl(f, vapor - 6, vapor + 14)} pressao={p} />
        <Manometro x={870} y={1110} s={0.75} p={p} />
      </Camera>
      <Tag text="180 °C" x={210} y={1130} at={8} bg={C.red} color={C.white} size={56} />
      {f >= vapor && <Tag text="ÁGUA → VAPOR" x={540} y={300} at={vapor} bg={C.white} size={56} />}
      {f >= press && <Tag text="PRESSÃO SUBINDO…" x={540} y={420} at={press} bg={C.yellow} size={52} />}
      <Sfx at={8} name="ronco" volume={0.3} />
      <Sfx at={vapor} name="borbulha" volume={0.5} />
      <Sfx at={press} name="riser" volume={0.45} />
    </Full>
  );
};

/** POP! E o amido vira espuma branquinha, dezenas de vezes maior. */
export const S4Pop: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pop = wordAt(scene, "pop!");
  const l1 = lineStart(scene, 1);
  const dez = wordAt(scene, "dezenas");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.15 }, { f: pop, zoom: 1.0 }]} shakes={[pop]}>
        <FundoLab />
        <GraoPipoca x={540} y={f >= l1 ? 820 : 900} s={f >= dez ? 1.25 + cl(f, dez, dez + 20) * 0.25 : 1.4} corte={0} pressao={cl(f, 0, pop)} humor={f > pop - 30 ? "susto" : "tenso"} estouro={pop} />
        {f >= l1 && <GraoPipoca x={170} y={1180} s={0.35} humor="feliz" />}
        {f >= l1 && <PersonagemEm x={880} pe={1660} altura={330} boca={mouth} expressao="encantado" pose="comemorando" />}
      </Camera>
      {f >= pop && f < l1 && <TitleSlam text="POP!" top={300} size={220} color={C.yellow} at={pop} />}
      {f >= l1 && <Tag text="AMIDO → ESPUMA" x={540} y={300} at={l1} bg={C.white} size={56} />}
      {f >= dez && <Tag text="DEZENAS DE VEZES MAIOR!" x={540} y={1180} at={dez} bg={C.green} color={C.white} size={48} />}
      {f >= dez && <Tag text="ANTES" x={170} y={1030} at={dez} bg={C.white} size={36} />}
      <Sfx at={pop} name="boom" volume={0.5} />
      <Sfx at={pop + 1} name="pop" volume={0.6} />
      <Sfx at={l1} name="sparkle" volume={0.45} />
      <Sfx at={dez} name="tada" volume={0.4} />
    </Full>
  );
};

/** Milho comum: casca cheia de furinhos, o vapor escapa e nada estoura. */
export const S5Milho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const furos = wordAt(scene, "furinhos,");
  const escapa = wordAt(scene, "escapa");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.08 }]}>
        <FundoLab />
        {f < l1 ? (
          <>
            <GraoPipoca x={300} y={900} s={1.1} humor="feliz" />
            <GraoPipoca x={780} y={900} s={1.1} humor="triste" furos />
          </>
        ) : (
          <GraoPipoca x={540} y={880} s={1.9} humor="triste" furos={f >= furos - 6} vapor={cl(f, escapa - 8, escapa + 6)} />
        )}
        <PersonagemEm x={540} pe={1660} altura={300} boca={mouth} expressao={f >= l1 ? "pensativo" : "surpreso"} pose={f >= l1 ? "explicando" : "pensando"} />
      </Camera>
      {f < l1 && <Tag text="PIPOCA" x={300} y={640} at={6} bg={C.yellow} size={48} />}
      {f < l1 && <Tag text="MILHO COMUM" x={780} y={640} at={12} bg={C.white} size={48} />}
      {f >= furos && <Tag text="CHEIA DE FURINHOS" x={540} y={300} at={furos} bg={C.white} size={54} />}
      {f >= escapa && <Tag text="O VAPOR ESCAPA!" x={540} y={420} at={escapa} bg={C.red} color={C.white} size={52} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={furos} name="click" volume={0.45} />
      <Sfx at={escapa} name="whoosh" volume={0.5} />
    </Full>
  );
};

/** O piruá: grão seco demais — sem água, sem vapor, sem pop. */
export const S6Pirua: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pirua = wordAt(scene, "piruá?");
  const secou = wordAt(scene, "secou");
  const sem1 = wordAt(scene, "água,");
  const sem2 = wordAt(scene, "vapor,");
  const sem3 = wordAt(scene, "pop.");
  const tags: [number, string, string][] = [
    [sem1 - 4, "SEM ÁGUA", C.blue],
    [sem2 - 4, "SEM VAPOR", C.violet],
    [sem3 - 4, "SEM POP", C.red],
  ];
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: secou, zoom: 1.1 }]} shakes={[sem3]}>
        <Cozinha />
        <GraoPipoca x={540} y={920} s={1.7} seco corte={cl(f, secou, secou + 10)} humor="triste" />
        <PersonagemEm x={880} pe={1660} altura={320} boca={mouth} expressao="preocupado" pose="maosNaCintura" espelhar />
      </Camera>
      {f >= pirua && <TitleSlam text="PIRUÁ" top={260} size={130} color={C.orange} at={pirua} />}
      {tags.map(([at, txt, cor], i) => (f >= at ? <Tag key={i} text={txt} x={200 + i * 340} y={1210} at={at} bg={cor} color={C.white} size={44} /> : null))}
      <Sfx at={pirua} name="boing" volume={0.45} />
      <Sfx at={sem1} name="click" volume={0.4} />
      <Sfx at={sem2} name="click" volume={0.4} />
      <Sfx at={sem3} name="boom" volume={0.5} />
    </Full>
  );
};

/** No Peru, arqueólogos acharam pipoca com milhares de anos. */
export const S7Historia: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const peru = wordAt(scene, "peru,");
  const arq = wordAt(scene, "arqueólogos");
  const mil = wordAt(scene, "milhares");
  return (
    <Full>
      {f < arq ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: peru, zoom: 1.1 }]}>
          <CeuCampo nuvens />
          <MapaPeru x={540} y={900} s={1.3} pino={cl(f, peru - 4, peru + 8)} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: mil, zoom: 1.08 }]}>
          <CeuCampo topo="#FFE0B2" base="#FFF3E0" nuvens={false} colina1="#D7A86E" colina2="#C58F55" />
          <VasoAntigo x={520} y={1000} s={1.25} />
        </Camera>
      )}
      <Tag text="PERU" x={540} y={300} at={peru} bg={C.red} color={C.white} size={60} />
      {f >= mil && <TitleSlam text="MILHARES DE ANOS!" top={1200} size={96} color={C.yellow} at={mil} />}
      <Sfx at={peru} name="pop" volume={0.45} />
      <Sfx at={arq} name="whoosh" volume={0.45} />
      <Sfx at={mil} name="tada" volume={0.45} />
    </Full>
  );
};

/** Conclusão: pipoca é o milho que não aguentou a pressão… igual a gente em dia de prova! + chamada. */
export const S8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const prova = wordAt(scene, "prova!");
  const igual = wordAt(scene, "igual");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: igual, zoom: 1.12 }, { f: l1, zoom: 1.0 }]} shakes={[prova]}>
        <Cozinha />
        {f < igual && <GraoPipoca x={540} y={820} s={1.2} pressao={cl(f, 30, igual)} humor="tenso" estouro={igual - 8} />}
        {f >= igual && f < l1 && <FolhaProva x={780} y={900} s={1} />}
        {f >= l1 && <PanelaPipoca x={760} y={1260} s={0.6} pulos pipocas={6} />}
        <PersonagemEm
          x={f >= igual && f < l1 ? 330 : f >= l1 ? 300 : 540}
          pe={1640}
          altura={f >= igual ? 520 : 400}
          boca={mouth}
          expressao={f >= igual && f < l1 ? "preocupado" : f >= l1 ? "animado" : "feliz"}
          pose={f >= igual && f < l1 ? "assustado" : f >= l1 ? "acenando" : "explicando"}
        />
      </Camera>
      {f >= igual && f < l1 && <Tag text="SUANDO!" x={330} y={620} at={igual} bg={C.blue} color={C.white} size={46} />}
      {f < igual && <Tag text="NÃO AGUENTOU A PRESSÃO" x={540} y={320} at={8} bg={C.yellow} size={50} />}
      {f >= prova && f < l1 && <TitleSlam text="POP!" top={300} size={170} color={C.yellow} at={prova} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="DOCE OU SALGADA?" />}
      <Sfx at={8} name="whoosh" volume={0.4} />
      <Sfx at={igual - 8} name="pop" volume={0.5} />
      <Sfx at={prova} name="boing" volume={0.5} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
