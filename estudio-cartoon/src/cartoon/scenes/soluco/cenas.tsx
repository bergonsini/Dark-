import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario } from "../../components/Props";
import { Calendario68, CordasVocais, PlacaMedico, PratoRefri, Simpatias, TroncoDiafragma, Ultrassom } from "../../components/Soluco";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que a gente soluça?" (video: "soluco") — fatos: Mayo Clinic, Wikipedia, Discover, ScienceAlert (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
/** pulinho do soluço: a cada `p` frames o corpo dá um tranco pra cima */
const hicPulo = (f: number, p = 34, off = 0) => {
  const t = (f + off) % p;
  return t < 6 ? -Math.sin((t / 6) * Math.PI) * 40 : 0;
};
const HicTag: React.FC<{ f: number; p?: number; x: number; y: number; off?: number }> = ({ f, p = 34, x, y, off = 0 }) =>
  (f + off) % p < 14 ? <Tag text="HIC!" x={x} y={y} at={f - ((f + off) % p)} bg={C.yellow} size={64} /> : null;

/** 0–3 s: GANCHO. O Tito soluçando: "Por que a gente SOLUÇA do nada?" */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const sol = wordAt(scene, "soluça");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.3, y: 80 }, { f: 30, zoom: 1.05 }]} shakes={[sol]}>
        <Cozinha />
        <PersonagemEm x={540} pe={1600} altura={620} boca={mouth} expressao="surpreso" pose="assustado" corpoY={hicPulo(f, 30)} />
      </Camera>
      <HicTag f={f} p={30} x={820} y={760} />
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE A GENTE" top={190} size={100} color={C.white} at={0} />
      <TitleSlam text="SOLUÇA?!" top={1390} size={150} color={C.yellow} at={Math.max(0, sol - 4)} rotate={3} />
      <Sfx at={0} name="boing" volume={0.5} />
      <Sfx at={30} name="boing" volume={0.45} />
      <Sfx at={60} name="boing" volume={0.45} />
    </Full>
  );
};

/** O diafragma: músculo embaixo dos pulmões, que sobe e desce como um TRAMPOLIM. */
export const S2Diafragma: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const diaf = wordAt(scene, "diafragma.");
  const l1 = lineStart(scene, 1);
  const tramp = wordAt(scene, "trampolim.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: diaf, zoom: 1.08 }]}>
        <CeuCampo topo="#FFE0EC" base="#FFF3F7" nuvens={false} colina1="#FFE0EC" colina2="#FFE0EC" />
        <TroncoDiafragma x={540} y={1050} s={1.25} respira={f >= l1 ? 1.4 : 0.6} destaque={f >= diaf} />
        <PersonagemEm x={900} pe={1640} altura={300} boca={mouth} expressao="feliz" pose="apontando" espelhar olharX={-0.7} />
      </Camera>
      <Tag text="POR DENTRO DO PEITO" x={540} y={300} at={6} bg={C.white} size={52} />
      {f >= diaf && <Tag text="DIAFRAGMA" x={540} y={420} at={diaf} bg={C.red} color={C.white} size={60} />}
      {f >= tramp && <Tag text="TIPO UM TRAMPOLIM!" x={540} y={540} at={tramp} bg={C.yellow} size={52} />}
      <Sfx at={6} name="whoosh" volume={0.4} />
      <Sfx at={diaf} name="pop" volume={0.45} />
      <Sfx at={tramp} name="boing" volume={0.5} />
    </Full>
  );
};

/** No soluço, ele dá um TRANCO sem avisar e você puxa o ar de repente. */
export const S3Tranco: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const tranco = wordAt(scene, "tranco");
  const ar = wordAt(scene, "ar");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: tranco, zoom: 1.1 }]} shakes={[tranco, ar]}>
        <CeuCampo topo="#FFE0EC" base="#FFF3F7" nuvens={false} colina1="#FFE0EC" colina2="#FFE0EC" />
        <TroncoDiafragma x={540} y={1050} s={1.25} respira={0.5} tranco={tranco} destaque />
      </Camera>
      {f >= tranco && <TitleSlam text="TRANCO!" top={300} size={130} color={C.red} at={tranco} />}
      {f >= ar && <Tag text="PUXA O AR DE REPENTE" x={540} y={1180} at={ar} bg={C.white} size={50} />}
      <Sfx at={tranco} name="boom" volume={0.45} />
      <Sfx at={ar} name="whoosh" volume={0.5} />
    </Full>
  );
};

/** As cordas vocais FECHAM na hora… e sai o famoso HIC! */
export const S4Hic: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const fecham = wordAt(scene, "fecham");
  const hic = wordAt(scene, "hic!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: fecham, zoom: 1.12 }]} shakes={[hic]}>
        <CeuCampo topo="#FFE0EC" base="#FFF3F7" nuvens={false} colina1="#FFE0EC" colina2="#FFE0EC" />
        <CordasVocais x={540} y={950} s={1.3} fecha={cl(f, fecham, fecham + 4)} />
      </Camera>
      <Tag text="CORDAS VOCAIS" x={540} y={300} at={6} bg={C.white} size={56} />
      {f >= fecham && <Tag text="FECHAM DE UMA VEZ!" x={540} y={420} at={fecham} bg={C.orange} color={C.white} size={52} />}
      {f >= hic && <TitleSlam text="HIC!" top={1200} size={220} color={C.yellow} at={hic} />}
      <Sfx at={6} name="pop" volume={0.4} />
      <Sfx at={fecham} name="click" volume={0.6} />
      <Sfx at={hic} name="boing" volume={0.6} />
    </Full>
  );
};

/** Gatilhos: comer rápido demais, refrigerante e até nervosismo. */
export const S5Gatilhos: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const rapido = wordAt(scene, "rápido");
  const refri = wordAt(scene, "refrigerante…");
  const nerv = wordAt(scene, "nervosismo");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: nerv, zoom: 1.08 }]}>
        <Cozinha />
        <PratoRefri x={600} y={1250} s={1.1} />
        <PersonagemEm x={240} pe={1640} altura={440} boca={mouth} expressao={f >= nerv ? "preocupado" : "animado"} pose={f >= nerv ? "assustado" : "explicando"} corpoY={f >= nerv ? hicPulo(f, 28) : 0} olharX={0.6} />
      </Camera>
      {f >= rapido && <Tag text="COMER RÁPIDO" x={300} y={320} at={rapido} bg={C.yellow} size={50} />}
      {f >= refri && <Tag text="REFRIGERANTE" x={760} y={440} at={refri} bg={C.red} color={C.white} size={50} />}
      {f >= nerv && <Tag text="NERVOSISMO" x={420} y={560} at={nerv} bg={C.violet} color={C.white} size={50} />}
      <Sfx at={rapido} name="pop" volume={0.45} />
      <Sfx at={refri} name="borbulha" volume={0.45} />
      <Sfx at={nerv} name="boing" volume={0.4} />
    </Full>
  );
};

/** O recorde: 68 ANOS de soluço! E até bebê na barriga soluça. */
export const S6Recorde: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const sess = wordAt(scene, "sessenta");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sess, zoom: 1.08 }]} shakes={[sess + 30]}>
          <CeuCampo nuvens />
          <Calendario68 x={540} y={950} s={1.2} p={cl(f, sess - 10, sess + 30)} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: 40, zoom: 1.08 }]}>
          <CeuCampo topo="#FFE0EC" base="#FFF3F7" nuvens={false} colina1="#FFE0EC" colina2="#FFE0EC" />
          <Ultrassom x={540} y={950} s={1.2} />
        </Camera>
      )}
      <Tag text="RECORDE MUNDIAL" x={540} y={300} at={4} bg={C.yellow} size={58} />
      {f >= sess + 30 && f < l1 && <TitleSlam text="68 ANOS!" top={1250} size={140} color={C.red} at={sess + 30} />}
      {f >= l1 && <Tag text="ATÉ NA BARRIGA DA MÃE!" x={540} y={1180} at={l1 + 4} bg={C.pink} color={C.white} size={50} />}
      <Sfx at={4} name="tada" volume={0.4} />
      <Sfx at={sess + 30} name="boom" volume={0.45} />
      <Sfx at={l1 + 4} name="sparkle" volume={0.45} />
    </Full>
  );
};

/** Simpatias (água de cabeça pra baixo, susto, açúcar): nenhuma comprovada; passa sozinho. Mais de 2 dias: médico. */
export const S7Simpatias: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const agua = wordAt(scene, "água");
  const susto = wordAt(scene, "susto,");
  const acucar = wordAt(scene, "açúcar…");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const quais = f >= acucar ? 3 : f >= susto ? 2 : f >= agua ? 1 : 0;
  return (
    <Full>
      {f < l2 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.04 }]} shakes={[l1]}>
          <CeuCampo nuvens />
          <Simpatias y={850} quais={quais} xis={cl(f, l1, l1 + 10)} />
          <PersonagemEm x={540} pe={1640} altura={360} boca={mouth} expressao={f >= l1 ? "pensativo" : "animado"} pose={f >= l1 ? "pensando" : "explicando"} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }]}>
          <CeuCampo nuvens />
          <PlacaMedico x={540} y={850} s={1.2} />
          <PersonagemEm x={540} pe={1640} altura={360} boca={mouth} expressao="feliz" pose="apontandoCima" />
        </Camera>
      )}
      <Tag text="SIMPATIAS?" x={540} y={300} at={4} bg={C.white} size={58} />
      {f >= l1 && f < l2 && <Tag text="SEM COMPROVAÇÃO" x={540} y={1180} at={l1} bg={C.red} color={C.white} size={52} />}
      <Sfx at={agua} name="pop" volume={0.4} />
      <Sfx at={susto} name="boom" volume={0.35} />
      <Sfx at={acucar} name="pop" volume={0.4} />
      <Sfx at={l1} name="click" volume={0.45} />
      <Sfx at={l2} name="ding" volume={0.45} />
    </Full>
  );
};

/** Conclusão + chamada: qual simpatia você usa? */
export const S8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }]}>
        <Cozinha />
        <PersonagemEm x={540} pe={1600} altura={560} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} corpoY={f >= l1 ? hicPulo(f, 40, 10) : 0} />
      </Camera>
      {f < l1 && <Tag text="TRANCO + HIC!" x={540} y={320} at={8} bg={C.yellow} size={60} />}
      {f >= l1 && <HicTag f={f} p={40} off={10} x={840} y={800} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="QUAL SIMPATIA VOCÊ USA?" />}
      <Sfx at={8} name="whoosh" volume={0.4} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
