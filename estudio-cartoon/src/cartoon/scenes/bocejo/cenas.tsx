import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { BebeBarriga, Cachorro, CerebroFrio, FilaBocejo, RostoBocejo } from "../../components/Bocejo";
import { Camera } from "../../components/Camera";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o bocejo é contagioso?" (video: "bocejo") — fatos: Smithsonian, Cleveland Clinic, PMC (Gallup), Biology Letters 2008. */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Noite: React.FC = () => <CeuCampo topo="#3b3f8f" base="#7a7fcf" nuvens={false} colina1="#5a5fb0" colina2="#4a4f9f" />;
const Lab: React.FC = () => <CeuCampo topo="#e3e8ff" base="#f5f7ff" nuvens={false} colina1="#e8ecff" colina2="#dde3ff" />;

/** 0–3 s: GANCHO. Rosto gigante bocejando: "Aposto que você vai BOCEJAR!" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const boc = wordAt(scene, "bocejar!");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.2 }, { f: boc, zoom: 1.0 }]} shakes={[boc]}>
        <Noite />
        <RostoBocejo x={540} y={900} s={1.5} k={cl(f, boc - 14, boc + 30)} oculos />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="APOSTO QUE VOCÊ" top={190} size={96} color={C.white} at={0} />
      <TitleSlam text="VAI BOCEJAR!" top={1390} size={130} color={C.yellow} at={Math.max(0, boc - 4)} rotate={-3} />
      <Sfx at={boc} name="whoosh" volume={0.45} />
    </Full>
  );
};

/** A ciência ainda nem sabe direito por que a gente boceja! */
export const S2Misterio: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const dir = wordAt(scene, "direito");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: dir, zoom: 1.06 }]}>
        <Lab />
        <PersonagemEm x={540} pe={1640} altura={560} boca={mouth} expressao={f >= dir ? "pensativo" : "surpreso"} pose={f >= dir ? "pensando" : "explicando"} />
      </Camera>
      <Tag text="CIÊNCIA:" x={540} y={300} at={6} bg={C.white} size={58} />
      {f >= dir && <TitleSlam text="???" top={420} size={200} color={C.violet} at={dir} />}
      <Sfx at={6} name="pop" volume={0.4} />
      <Sfx at={dir} name="boing" volume={0.45} />
    </Full>
  );
};

/** A ideia mais aceita: o bocejo RESFRIA o cérebro (entra ar, a mandíbula estica, o sangue esfria). */
export const S3Cerebro: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const resf = wordAt(scene, "resfria");
  const l1 = lineStart(scene, 1);
  const ar = wordAt(scene, "ar,");
  const esf = wordAt(scene, "esfria.");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: resf, zoom: 1.06 }]} shakes={[resf]}>
          <Lab />
          <CerebroFrio x={500} y={880} s={1.1} temp={1 - cl(f, resf, resf + 30) * 0.4} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: esf, zoom: 1.08 }]} shakes={[esf]}>
          <Lab />
          <CerebroFrio x={620} y={640} s={0.75} temp={1 - cl(f, ar, esf + 10)} ar={f >= ar} />
          <RostoBocejo x={330} y={1010} s={0.65} k={cl(f, 0, esf)} />
        </Camera>
      )}
      <Tag text="IDEIA MAIS ACEITA" x={540} y={300} at={6} bg={C.white} size={52} />
      {f >= resf && f < l1 && <TitleSlam text="RESFRIA O CÉREBRO!" top={1260} size={90} color={C.blue} at={resf} />}
      {f >= ar && <Tag text="ENTRA AR FRESQUINHO" x={540} y={420} at={ar} bg={C.blue} color={C.white} size={46} />}
      {f >= esf && <Tag text="AR-CONDICIONADO!" x={720} y={1150} at={esf} bg={C.yellow} size={50} />}
      <Sfx at={resf} name="sparkle" volume={0.45} />
      <Sfx at={ar} name="whoosh" volume={0.45} />
      <Sfx at={esf} name="ding" volume={0.45} />
    </Full>
  );
};

/** Até bebê boceja dentro da barriga, antes de respirar. */
export const S4Barriga: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const barriga = wordAt(scene, "barriga,");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: barriga, zoom: 1.08 }]}>
        <Lab />
        <BebeBarriga x={540} y={900} s={1.1} k={cl(f, barriga - 10, barriga + 40)} />
      </Camera>
      <Tag text="ULTRASSOM" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= barriga && <Tag text="ANTES DE RESPIRAR!" x={540} y={1280} at={barriga + 10} bg={C.pink} color={C.white} size={52} />}
      <Sfx at={6} name="pop" volume={0.4} />
      <Sfx at={barriga + 10} name="sparkle" volume={0.45} />
    </Full>
  );
};

/** Por que ele PEGA? Empatia: o cérebro copia quem a gente gosta… pega mais de família e amigo. */
export const S5Contagio: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pega = wordAt(scene, "pega?");
  const l1 = lineStart(scene, 1);
  const emp = wordAt(scene, "empatia:");
  const l2 = lineStart(scene, 2);
  const fam = wordAt(scene, "família");
  return (
    <Full>
      {f < l2 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: emp, zoom: 1.04 }]} shakes={[pega]}>
          <Noite />
          <FilaBocejo y={860} f0={l1} passo={18} />
          {f < l1 && <PersonagemEm x={540} pe={1640} altura={480} boca={mouth} expressao="surpreso" pose="pensando" />}
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: fam, zoom: 1.06 }]}>
          <Cozinha />
          <RostoBocejo x={300} y={900} s={0.7} k={cl(f, 20, 60)} cor="#eab593" cabelo="#d9d9de" />
          <RostoBocejo x={780} y={900} s={0.7} k={cl(f, 45, 85)} oculos />
        </Camera>
      )}
      {f >= pega - 4 && f < l1 && <TitleSlam text="POR QUE PEGA?" top={300} size={110} color={C.yellow} at={pega - 4} />}
      {f >= emp && f < l2 && <Tag text="EMPATIA" x={540} y={300} at={emp} bg={C.pink} color={C.white} size={70} />}
      {f >= fam && <Tag text="PEGA MAIS DE QUEM VOCÊ GOSTA ♥" x={540} y={1260} at={fam} bg={C.yellow} size={44} />}
      <Sfx at={pega} name="boing" volume={0.45} />
      <Sfx at={emp} name="sparkle" volume={0.45} />
      <Sfx at={fam} name="pop" volume={0.45} />
    </Full>
  );
};

/** Num estudo, cachorros bocejaram depois de ver gente bocejar. */
export const S6Cachorro: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const cach = wordAt(scene, "cachorros");
  const gente = wordAt(scene, "gente");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: gente, zoom: 1.06 }]}>
        <Cozinha />
        <PersonagemEm x={260} pe={1640} altura={460} boca={mouth} expressao="feliz" pose="explicando" olharX={0.6} />
        <Cachorro x={740} y={960} s={0.95} k={cl(f, gente + 10, gente + 50)} />
      </Camera>
      <Tag text="NUM ESTUDO…" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= cach && <Tag text="ATÉ O CACHORRO!" x={540} y={420} at={cach} bg={C.orange} color={C.white} size={56} />}
      <Sfx at={cach} name="boing" volume={0.45} />
      <Sfx at={gente + 20} name="whoosh" volume={0.4} />
    </Full>
  );
};

/** Conclusão: ar-condicionado do cérebro… e é tipo FOFOCA: um começa, todo mundo passa pra frente! + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const fof = wordAt(scene, "fofoca:");
  const l1 = lineStart(scene, 1);
  const bocejou = wordAt(scene, "bocejou?");
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      {f < fof ? (
        <Camera keys={[{ f: 0, zoom: 1.05 }]}>
          <Lab />
          <CerebroFrio x={540} y={800} s={0.9} temp={0.1} ar />
        </Camera>
      ) : f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }]} shakes={[fof]}>
          <Noite />
          <FilaBocejo y={880} f0={fof} passo={14} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: bocejou, zoom: 1.05 }]}>
          <Cozinha />
          <PersonagemEm x={540} pe={1640} altura={560} boca={Math.max(mouth, f >= bocejou && f < bocejou + 30 ? 1 : 0)} expressao={f >= bocejou ? "surpreso" : "animado"} pose="acenando" />
        </Camera>
      )}
      {f < fof && <Tag text="AR-CONDICIONADO DO CÉREBRO" x={540} y={320} at={8} bg={C.blue} color={C.white} size={44} />}
      {f >= fof && f < l1 && <Tag text="TIPO FOFOCA!" x={540} y={320} at={fof} bg={C.yellow} size={64} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="BOCEJOU? 🥱" />}
      <Sfx at={8} name="whoosh" volume={0.4} />
      <Sfx at={fof} name="pop" volume={0.45} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
