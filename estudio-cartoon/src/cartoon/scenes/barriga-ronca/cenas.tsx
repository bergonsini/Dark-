import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Carteira, Colega, Estomago, Intestino, OndasRonco, SalaProva } from "../../components/Barriga";
import { Pergaminho } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que a barriga ronca?" (video: "barriga-ronca") — fatos: Scientific American, Live Science, Colorado State, Deloose 2012 (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Lab: React.FC = () => <CeuCampo topo="#FFE6EE" base="#FFF5F8" nuvens={false} colina1="#FFD9E5" colina2="#FFCCDC" />;

/** Tito sentado na carteira, com dois colegas que viram pra olhar. */
const Turma: React.FC<{ mouth: number; olha: number; choque: number; expr: "feliz" | "preocupado" | "surpreso" | "neutro" | "pensativo" | "animado"; pose: "parado" | "assustado" | "pensando" | "explicando" }> = ({ mouth, olha, choque, expr, pose }) => (
  <>
    <Colega x={150} y={1230} s={0.78} olha={olha} choque={choque} camisa={C.violet} cabelo="#d9a441" />
    <Colega x={930} y={1230} s={0.78} olha={-olha} choque={choque} camisa={C.green} pele="#8d5a3c" cabelo="#1c1410" />
    <Carteira x={150} y={1420} s={0.62} />
    <Carteira x={930} y={1420} s={0.62} />
    <PersonagemEm x={540} pe={1640} altura={760} boca={mouth} expressao={expr} pose={pose} />
    <Carteira x={540} y={1470} s={0.9} />
  </>
);

/** 0–3 s: GANCHO. Prova em silêncio… RONC! "Por que a barriga RONCA?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const ronca = wordAt(scene, "ronca?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 60 }, { f: 30, zoom: 1.05 }]} shakes={[0, ronca]}>
        <SalaProva />
        <Turma mouth={mouth} olha={1} choque={cl(f, 0, 8)} expr="preocupado" pose="assustado" />
        <OndasRonco x={540} y={1440} forca={1} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE A BARRIGA" top={190} size={96} color={C.white} at={0} />
      <TitleSlam text="RONCA?!" top={1500} size={170} color={C.yellow} at={0} rotate={-3} />
      {f >= ronca && <TitleSlam text="RONC!" top={640} size={150} color={C.orange} at={ronca} rotate={8} />}
      <Sfx at={0} name="boom" volume={0.5} />
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={ronca} name="ronco" volume={0.7} />
    </Full>
  );
};

/** Sala em silêncio, prova valendo nota… e a barriga resolve fazer um SHOW. Colegas viram pra olhar. */
export const S2Prova: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const show = wordAt(scene, "show!");
  const olha = f >= show ? 1 : 0;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.12, y: 40 }, { f: l1, zoom: 1.0 }, { f: show, zoom: 1.08 }]} shakes={[show]}>
        <SalaProva />
        <Turma mouth={mouth} olha={olha * cl(f, show, show + 6)} choque={cl(f, show, show + 6)} expr={f >= show ? "surpreso" : f >= l1 ? "preocupado" : "pensativo"} pose={f >= show ? "assustado" : "pensando"} />
        <OndasRonco x={540} y={1440} forca={cl(f, show - 4, show + 2)} cor={C.pink} />
      </Camera>
      {f < l1 && <Tag text="SHHH… PROVA" x={540} y={300} at={4} bg={C.white} size={58} />}
      {f >= l1 && f < show && <Tag text="A BARRIGA…" x={540} y={300} at={l1} bg={C.yellow} size={58} />}
      {f >= show && <TitleSlam text="SHOW!" top={250} size={150} color={C.pink} at={show} rotate={-4} />}
      <Sfx at={l1} name="click" volume={0.4} />
      <Sfx at={show} name="ronco" volume={0.7} />
      <Sfx at={show + 2} name="tada" volume={0.35} />
    </Full>
  );
};

/** O intestino é um tubo de músculo que aperta e empurra; espremendo gás e líquido → RONCO. */
export const S3Tubo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const musc = wordAt(scene, "músculo");
  const l1 = lineStart(scene, 1);
  const ronco = wordAt(scene, "ronco!");
  const end = scene.endFrame - scene.startFrame;
  const onda = ((f - 10) % 60) / 60;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.06 }, { f: ronco, zoom: 1.1 }]} shakes={[ronco]}>
        <Lab />
        <Intestino x={540} y={860} s={1.0} onda={f < 10 ? 0 : onda} bolhas={f >= l1 - 10} />
        {f >= ronco && <OndasRonco x={540} y={760} forca={1 - cl(f, ronco + 20, end)} />}
        <PersonagemEm x={880} pe={1720} altura={460} boca={mouth} expressao={f >= ronco ? "animado" : "encantado"} pose="apontando" espelhar olharX={-0.6} />
      </Camera>
      <Tag text="INTESTINO" x={540} y={300} at={4} bg={C.white} size={60} />
      {f >= musc && f < l1 && <Tag text="TUBO DE MÚSCULO" x={420} y={1220} at={musc} bg={C.pink} color={C.white} size={50} />}
      {f >= l1 && f < ronco && <Tag text="ESPREME O GÁS" x={420} y={1220} at={l1} bg={C.blue} color={C.white} size={50} />}
      {f >= ronco && <TitleSlam text="RONC!" top={1150} size={150} color={C.orange} at={ronco} rotate={-6} />}
      <Sfx at={4} name="whoosh" volume={0.4} />
      <Sfx at={l1} name="borbulha" volume={0.5} />
      <Sfx at={ronco} name="ronco" volume={0.7} />
    </Full>
  );
};

/** Barriga vazia → começa a FAXINA: ondas fortes varrem os restinhos. A equipe da limpeza passando! */
export const S4Faxina: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fax = wordAt(scene, "faxina:");
  const l1 = lineStart(scene, 1);
  const limp = wordAt(scene, "limpeza");
  const end = scene.endFrame - scene.startFrame;
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.05 }, { f: limp, zoom: 1.12, y: -20 }]} shakes={[fax]}>
        <Lab />
        <Intestino x={540} y={860} s={1.0} onda={cl(f, l1 - 10, end - 6)} bolhas={false} restos={1} faxina={f >= l1} />
        <PersonagemEm x={880} pe={1720} altura={460} boca={mouth} expressao={f >= limp ? "animado" : "feliz"} pose={f >= limp ? "comemorando" : "explicando"} espelhar olharX={-0.6} />
      </Camera>
      <Tag text="BARRIGA VAZIA" x={540} y={300} at={4} bg={C.white} size={58} />
      {f >= fax && f < limp && <TitleSlam text="FAXINA!" top={1170} size={120} color={C.teal} at={fax} rotate={-3} />}
      {f >= limp && <Tag text="EQUIPE DA LIMPEZA" x={540} y={1240} at={limp} bg={C.yellow} size={54} />}
      <Sfx at={fax} name="sparkle" volume={0.45} />
      <Sfx at={l1} name="whoosh" volume={0.45} />
      <Sfx at={limp} name="ronco" volume={0.55} />
    </Full>
  );
};

/** Por que ronca mais ALTO com fome? Sem comida dentro, nada abafa o barulho (vazio x cheio). */
export const S5Eco: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const alto = wordAt(scene, "alto");
  const l1 = lineStart(scene, 1);
  const nada = wordAt(scene, "nada");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }]} shakes={[alto]}>
          <Lab />
          <PersonagemEm x={540} pe={1660} altura={560} boca={mouth} expressao="pensativo" pose="pensando" />
          <OndasRonco x={540} y={1300} forca={cl(f, alto, alto + 6)} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: nada, zoom: 1.05 }]}>
          <Lab />
          <Estomago x={300} y={860} s={0.95} forca={1} rotulo="VAZIO" cor={C.orange} />
          <Estomago x={790} y={860} s={0.95} cheio forca={0.25} rotulo="CHEIO" cor={C.green} />
          <PersonagemEm x={540} pe={1740} altura={420} boca={mouth} expressao="animado" pose="explicando" />
        </Camera>
      )}
      {f < l1 && f >= alto && <TitleSlam text="MAIS ALTO?" top={300} size={130} color={C.orange} at={alto} />}
      {f >= l1 && <Tag text="RONC!!!" x={300} y={500} at={l1} bg={C.orange} color={C.white} size={58} />}
      {f >= l1 && <Tag text="ronc…" x={790} y={500} at={l1 + 6} bg={C.green} color={C.white} size={44} />}
      {f >= nada && <Tag text="COMIDA ABAFA O SOM" x={540} y={300} at={nada} bg={C.white} size={52} />}
      <Sfx at={alto} name="boing" volume={0.4} />
      <Sfx at={l1} name="ronco" volume={0.6} />
      <Sfx at={nada} name="pop" volume={0.4} />
    </Full>
  );
};

/** Nome chique: BORBORIGMO! Palavra grega que imita o próprio barulho. */
export const S6Nome: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const nome = wordAt(scene, "borborigmo!");
  const l1 = lineStart(scene, 1);
  const grega = wordAt(scene, "grega");
  const k = cl(f, nome - 4, nome + 6);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: nome, zoom: 1.06 }]} shakes={[nome]}>
        <Lab />
        <PersonagemEm x={540} pe={1700} altura={480} boca={mouth} expressao={f >= nome ? "encantado" : "feliz"} pose={f >= nome ? "apontandoCima" : "explicando"} />
      </Camera>
      <Tag text="NOME CHIQUE" x={540} y={300} at={4} bg={C.white} size={58} />
      {f >= nome - 4 && (
        <Pergaminho x={540} y={720} w={860} h={420} s={0.6 + 0.4 * k}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2'", color: C.outline }}>
            <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: 2 }}>BORBORIGMO</div>
            {f >= grega && <div style={{ fontSize: 64, fontWeight: 700, color: "#7A4E22" }}>βορβορυγμός</div>}
            {f >= l1 && <div style={{ fontSize: 52, fontWeight: 800, color: C.red }}>“borbor… rugmós!”</div>}
          </div>
        </Pergaminho>
      )}
      <Sfx at={nome} name="tada" volume={0.45} />
      <Sfx at={grega} name="ronco" volume={0.5} />
    </Full>
  );
};

/** Conclusão: ronca porque tá fazendo faxina… e o show é de graça. + chamada para comentar. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fax = wordAt(scene, "faxina…");
  const graca = wordAt(scene, "graca.");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: graca, zoom: 1.08 }]} shakes={[graca]}>
          <Lab />
          <Intestino x={540} y={780} s={0.85} onda={((f % 50) / 50)} bolhas={false} restos={1} faxina />
          <PersonagemEm x={540} pe={1700} altura={420} boca={mouth} expressao="animado" pose="explicando" />
          {f >= graca && <OndasRonco x={540} y={700} forca={1} cor={C.pink} />}
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.05 }, { f: conta, zoom: 1.0 }]}>
          <SalaProva />
          <Turma mouth={mouth} olha={0} choque={0} expr="animado" pose="explicando" />
        </Camera>
      )}
      {f >= fax && f < graca && <Tag text="FAXINA" x={540} y={300} at={fax} bg={C.teal} color={C.white} size={60} />}
      {f >= graca && f < l1 && <TitleSlam text="SHOW GRÁTIS!" top={260} size={120} color={C.pink} at={graca} rotate={-3} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="JÁ RONCOU NA HORA ERRADA?" />}
      <Sfx at={fax} name="sparkle" volume={0.45} />
      <Sfx at={graca} name="ronco" volume={0.6} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
