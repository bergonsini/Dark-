import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Aristoteles, CabecaNervos, Carinha, Gotinhas, LetrasAchoo, RuaCinema } from "../../components/Espirro";
import { BalaoComentario, Sol } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o sol faz espirrar?" (video: "espirro-sol") — fatos: Live Science, Scientific American, PBS, Cleveland Clinic, NCBI (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Lab: React.FC = () => <CeuCampo topo="#FFF4C7" base="#FFFBEA" nuvens={false} colina1="#FFEFB0" colina2="#FFE69A" />;
/** Squash do espirro do Tito: estica no "a-a-a" (14 frames antes) e achata no ATCHIM. */
const espirro = (f: number, at: number) => {
  const t = f - at;
  if (t > -14 && t < 0) return ((t + 14) / 14) * 0.14;
  if (t >= 0 && t < 10) return -0.2 * (1 - t / 10);
  return 0;
};

/** 0–3 s: GANCHO. Sol forte na cara do Tito… ATCHIM! "Por que o sol faz ESPIRRAR?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const esp = wordAt(scene, "espirrar?");
  const flash = interpolate(f, [0, 3, 12], [0.7, 0.4, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 40 }, { f: 30, zoom: 1.05 }]} shakes={[esp]}>
        <RuaCinema />
        <Sol x={880} y={330} r={120} />
        <PersonagemEm x={480} pe={1640} altura={620} boca={mouth} expressao={f >= esp ? "surpreso" : "feliz"} pose="parado" squash={espirro(f, esp)} />
        <Gotinhas x={600} y={1060} at={esp} />
      </Camera>
      <AbsoluteFill style={{ background: "#FFFBE0", opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O SOL" top={190} size={110} color={C.white} at={0} />
      {f >= esp && <TitleSlam text="ATCHIM!" top={560} size={170} color={C.orange} at={esp} rotate={8} />}
      <TitleSlam text="FAZ ESPIRRAR?" top={1390} size={140} color={C.yellow} at={0} rotate={-3} />
      <Sfx at={0} name="boom" volume={0.5} />
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={esp} name="pop" volume={0.7} />
    </Full>
  );
};

/** Sai do cinema, bate o sol na cara… e: ATCHIM! */
export const S2Cinema: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sol = wordAt(scene, "sol");
  const l1 = lineStart(scene, 1);
  const at = wordAt(scene, "atchim!");
  const sai = cl(f, 0, sol);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sol, zoom: 1.1, y: 60 }, { f: at, zoom: 1.18, y: 80 }]} shakes={[at]}>
        <RuaCinema luz={f >= sol ? 1 : 0.2} />
        <Sol x={880} y={330} r={f >= sol ? 140 : 100} />
        <PersonagemEm x={370 + sai * 130} pe={1640} altura={560} boca={mouth} expressao={f >= at ? "surpreso" : f >= sol ? "pensativo" : "feliz"} pose={f >= sol ? "pensando" : "andando"} andando={f < sol} squash={espirro(f, at)} />
        <Gotinhas x={620} y={1110} at={at} />
      </Camera>
      {f < sol && <Tag text="FIM DO FILME" x={540} y={300} at={4} bg={C.white} size={58} />}
      {f >= sol && f < at && <TitleSlam text="SOL NA CARA!" top={260} size={120} color={C.yellow} at={sol} />}
      {f >= l1 && f < at && <Tag text="A… A… A…" x={540} y={460} at={l1} bg={C.white} size={58} />}
      {f >= at && <TitleSlam text="ATCHIM!" top={300} size={190} color={C.orange} at={at} rotate={-6} />}
      <Sfx at={sol} name="sparkle" volume={0.45} />
      <Sfx at={at} name="pop" volume={0.7} />
    </Full>
  );
};

/** 1 em cada 4 pessoas. Se não é você, é o amigo do lado (o 4º espirra e molha o 3º). */
export const S3UmEmQuatro: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const quatro = wordAt(scene, "quatro");
  const l1 = lineStart(scene, 1);
  const lado = wordAt(scene, "lado.");
  const quem = quatro + 8;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.04 }, { f: lado, zoom: 1.12, x: -100 }]} shakes={[quem, lado + 4]}>
        <Lab />
        <Sol x={540} y={480} r={110} />
        <Carinha x={180} y={980} s={0.95} oculos />
        <Carinha x={420} y={1000} s={0.95} pele="#8d5a3c" cabelo="#1c1410" />
        <Carinha x={660} y={980} s={0.95} pele="#eab593" cabelo="#d9a441" espirra={lado + 4} />
        <Carinha x={900} y={1000} s={0.95} pele="#c98b5e" cabelo="#9b59d0" espirra={quem} />
        <Gotinhas x={810} y={1040} at={quem} dir={-1} />
        <Gotinhas x={570} y={1020} at={lado + 4} dir={-1} />
        <PersonagemEm x={180} pe={1760} altura={400} boca={mouth} expressao="animado" pose="apontando" />
      </Camera>
      {f >= quatro && <TitleSlam text="1 EM CADA 4" top={250} size={130} color={C.orange} at={quatro} />}
      {f >= quem && f < l1 && <Tag text="ATCHIM!" x={900} y={820} at={quem} bg={C.yellow} size={46} />}
      {f >= lado && <Tag text="O AMIGO DO LADO!" x={540} y={1270} at={lado} bg={C.pink} color={C.white} size={52} />}
      <Sfx at={quatro} name="ding" volume={0.45} />
      <Sfx at={quem} name="pop" volume={0.6} />
      <Sfx at={lado + 4} name="pop" volume={0.6} />
    </Full>
  );
};

/** Fios cruzados no cérebro: a luz forte chega pelo olho e o sinal VAZA pro nervo do espirro. */
export const S4Fios: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const cruz = wordAt(scene, "cruzados");
  const l1 = lineStart(scene, 1);
  const olho = wordAt(scene, "olho…");
  const vaza = wordAt(scene, "vaza");
  const nervo = wordAt(scene, "espirro!");
  const end = scene.endFrame - scene.startFrame;
  const at = nervo + 14;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: cruz, zoom: 1.06 }, { f: vaza, zoom: 1.12, x: 30 }]} shakes={[vaza, at]}>
        <Lab />
        <CabecaNervos x={500} y={880} s={1.15} luz={cl(f, l1, olho + 10) * 0.5} vaza={cl(f, vaza, nervo + 8)} atchim={f >= at && f < end} />
        {f >= at && <Gotinhas x={900} y={990} at={at} s={1.2} />}
        <PersonagemEm x={180} pe={1760} altura={400} boca={mouth} expressao={f >= vaza ? "surpreso" : "animado"} pose="apontando" />
      </Camera>
      <Tag text="FIOS CRUZADOS" x={540} y={300} at={cruz} bg={C.white} size={60} />
      {f >= l1 && f < vaza && <Tag text="LUZ FORTE!" x={790} y={460} at={l1} bg={C.yellow} size={52} />}
      {f >= vaza && f < at && <TitleSlam text="VAZOU!" top={420} size={130} color={C.orange} at={vaza} rotate={-5} />}
      {f >= at && <TitleSlam text="ATCHIM!" top={420} size={150} color={C.red} at={at} rotate={6} />}
      <Sfx at={l1} name="sparkle" volume={0.45} />
      <Sfx at={vaza} name="click" volume={0.6} />
      <Sfx at={at} name="pop" volume={0.7} />
    </Full>
  );
};

/** Nome científico: síndrome ACHOO! (é o "atchim" em inglês). */
export const S5Nome: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const ach = wordAt(scene, "achoo!");
  const l1 = lineStart(scene, 1);
  const ing = wordAt(scene, "inglês.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: ach, zoom: 1.05 }, { f: ing, zoom: 1.08 }]} shakes={[ach]}>
        <Lab />
        <LetrasAchoo y={860} at={ach} />
        <PersonagemEm x={540} pe={1720} altura={480} boca={mouth} expressao={f >= ach ? "animado" : "feliz"} pose={f >= ach ? "comemorando" : "explicando"} squash={espirro(f, ing + 10)} />
        <Gotinhas x={660} y={1300} at={ing + 10} />
      </Camera>
      <Tag text="NOME CIENTÍFICO" x={540} y={300} at={4} bg={C.white} size={58} />
      {f >= ach && f < l1 && <Tag text="SÍNDROME" x={540} y={520} at={ach} bg={C.violet} color={C.white} size={56} />}
      {f >= l1 && <Tag text="ACHOO = ATCHIM" x={540} y={520} at={l1} bg={C.blue} color={C.white} size={56} />}
      <Sfx at={ach} name="tada" volume={0.45} />
      <Sfx at={ing + 10} name="pop" volume={0.6} />
    </Full>
  );
};

/** Passa de pai pra filho (pai e filho espirrando juntos) + Aristóteles já estranhava, há mais de 2 mil anos. */
export const S6Familia: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const filho = wordAt(scene, "filho.");
  const l1 = lineStart(scene, 1);
  const ari = wordAt(scene, "aristóteles");
  const dois = wordAt(scene, "dois");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: filho, zoom: 1.06 }]} shakes={[filho + 6]}>
          <Lab />
          <Sol x={540} y={480} r={100} />
          <Carinha x={360} y={1000} s={1.3} pele="#c98b5e" cabelo="#3a2414" espirra={filho + 6} />
          <Carinha x={720} y={1080} s={0.9} pele="#c98b5e" cabelo="#3a2414" espirra={filho + 6} />
          <Gotinhas x={500} y={1060} at={filho + 6} />
          <Gotinhas x={820} y={1120} at={filho + 6} s={0.7} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: dois, zoom: 1.06 }]} shakes={[dois + 10]}>
          <Lab />
          <Sol x={860} y={480} r={100} />
          <Aristoteles x={480} y={930} s={1.2} espirra={dois + 10} />
          <Gotinhas x={560} y={890} at={dois + 10} />
        </Camera>
      )}
      {f < l1 && <Tag text="É DE FAMÍLIA" x={540} y={300} at={4} bg={C.white} size={58} />}
      {f < l1 && f >= filho && <Tag text="PAI" x={360} y={1220} at={filho} bg={C.blue} color={C.white} size={48} />}
      {f < l1 && f >= filho && <Tag text="FILHO" x={720} y={1250} at={filho + 4} bg={C.green} color={C.white} size={44} />}
      {f >= l1 && <Tag text="ARISTÓTELES" x={540} y={300} at={ari} bg={C.white} size={58} />}
      {f >= dois && <TitleSlam text="+2.000 ANOS" top={420} size={120} color={C.orange} at={dois} />}
      <Sfx at={filho + 6} name="pop" volume={0.6} />
      <Sfx at={ari} name="whoosh" volume={0.4} />
      <Sfx at={dois + 10} name="pop" volume={0.6} />
    </Full>
  );
};

/** Conclusão: o sol não te deixa doente… só dá um curto-circuito no nariz. + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const curto = wordAt(scene, "curto-circuito");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: curto, zoom: 1.12 }, { f: l1, zoom: 1.0 }]} shakes={[curto + 8]}>
        <RuaCinema />
        <Sol x={880} y={330} r={120} />
        <PersonagemEm x={540} pe={1660} altura={600} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} squash={espirro(f, curto + 8)} />
        <Gotinhas x={680} y={1090} at={curto + 8} />
      </Camera>
      {f >= curto && f < l1 && <TitleSlam text="CURTO-CIRCUITO!" top={300} size={110} color={C.yellow} at={curto} rotate={-4} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="VOCÊ ESPIRRA NO SOL?" />}
      <Sfx at={curto} name="click" volume={0.5} />
      <Sfx at={curto + 8} name="pop" volume={0.6} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
