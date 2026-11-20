import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { BanheiraFrente, CortePele, Mao, Pneu, PontaDigital, PotesBolinhas } from "../../components/Dedos";
import { BalaoComentario } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Por que o dedo enruga na água?" (video: "dedo-enrugado") — fatos: Smithsonian, NPR, Nature, Kareklas 2013 (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const Banheiro: React.FC = () => <CeuCampo topo="#CDEBFF" base="#EAF6FF" nuvens={false} colina1="#D8EFFF" colina2="#CDE7FA" />;
/** Tito dentro da banheira (corpo escondido pela banheira). */
const TitoBanho: React.FC<{ mouth: number; expressao?: React.ComponentProps<typeof PersonagemEm>["expressao"]; pose?: React.ComponentProps<typeof PersonagemEm>["pose"]; x?: number }> = ({
  mouth,
  expressao = "feliz",
  pose = "parado",
  x = 540,
}) => (
  <>
    <PersonagemEm x={x} pe={1560} altura={760} boca={mouth} expressao={expressao} pose={pose} />
    <BanheiraFrente y={1360} />
  </>
);

/** 0–3 s: GANCHO. O Tito na banheira olhando a mão enrugar. */
export const S1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const enr = wordAt(scene, "enruga");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.25, y: 40 }, { f: 30, zoom: 1.05 }]} shakes={[enr]}>
        <Banheiro />
        <TitoBanho mouth={mouth} expressao="surpreso" pose="assustado" x={360} />
        <Mao x={790} y={820} s={0.75} rugas={cl(f, enr - 10, enr + 10)} molhada rot={8} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O DEDO" top={190} size={100} color={C.white} at={0} />
      <TitleSlam text="ENRUGA?!" top={1390} size={160} color={C.yellow} at={Math.max(0, enr - 4)} rotate={-3} />
      <Sfx at={0} name="borbulha" volume={0.45} />
      <Sfx at={enr} name="boing" volume={0.5} />
    </Full>
  );
};

/** Mito: a pele bebendo água? NÃO! */
export const S2Mito: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const beb = wordAt(scene, "bebendo");
  const l1 = lineStart(scene, 1);
  const x = cl(f, l1, l1 + 8);
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.06 }]} shakes={[l1]}>
        <Banheiro />
        <Mao x={540} y={820} s={1.0} rugas={1} molhada />
        <PersonagemEm x={880} pe={1660} altura={320} boca={mouth} expressao={f >= l1 ? "bravo" : "pensativo"} pose={f >= l1 ? "maosNaCintura" : "pensando"} espelhar olharX={-0.6} />
        {x > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d="M260 480 L820 1080 M820 480 L260 1080" stroke={C.red} strokeWidth={40} strokeLinecap="round" opacity={x} />
          </svg>
        )}
      </Camera>
      {f >= beb && <Tag text="PELE BEBENDO ÁGUA?" x={540} y={300} at={beb} bg={C.white} size={54} />}
      {f >= l1 && <TitleSlam text="MITO!" top={1180} size={150} color={C.red} at={l1} />}
      <Sfx at={beb} name="borbulha" volume={0.45} />
      <Sfx at={l1} name="boom" volume={0.45} />
    </Full>
  );
};

/** Depois de uns minutinhos… quem manda é o sistema NERVOSO: ele aperta os vasinhos e a pele enruga. */
export const S3Nervo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const min = wordAt(scene, "minutinhos");
  const l1 = lineStart(scene, 1);
  const nerv = wordAt(scene, "nervoso.");
  const l2 = lineStart(scene, 2);
  const aperta = wordAt(scene, "aperta");
  const enr = wordAt(scene, "enruga.");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: min, zoom: 1.06 }]}>
          <Banheiro />
          <TitoBanho mouth={mouth} expressao="feliz" pose="explicando" />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: aperta, zoom: 1.08 }]} shakes={[enr]}>
          <Banheiro />
          <CortePele x={540} y={880} s={1.05} aperta={cl(f, aperta, enr + 6)} sinal={f >= nerv} />
        </Camera>
      )}
      {f < l1 && f >= min && <Tag text="UNS MINUTINHOS…" x={540} y={320} at={min} bg={C.white} size={56} />}
      {f >= l1 && <Tag text="POR DENTRO DA PONTA DO DEDO" x={540} y={300} at={l1} bg={C.white} size={46} />}
      {f >= nerv && <Tag text="NERVO" x={300} y={1230} at={nerv} bg={C.yellow} size={50} />}
      {f >= l2 && <Tag text="VASINHOS APERTANDO" x={540} y={420} at={aperta} bg={C.red} color={C.white} size={48} />}
      {f >= enr && <TitleSlam text="ENRUGOU!" top={1180} size={110} color={C.orange} at={enr} />}
      <Sfx at={min} name="borbulha" volume={0.4} />
      <Sfx at={nerv} name="sparkle" volume={0.45} />
      <Sfx at={aperta} name="click" volume={0.45} />
      <Sfx at={enr} name="boing" volume={0.5} />
    </Full>
  );
};

/** A prova: em 1935, dedo com nervo cortado não enrugava. */
export const S4Prova: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const ano = wordAt(scene, "1935");
  const cort = wordAt(scene, "cortado");
  const nao = wordAt(scene, "enrugava.");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: cort, zoom: 1.1, y: 60 }]} shakes={[nao]}>
        <CeuCampo nuvens />
        <Mao x={540} y={900} s={1.0} rugas={1} curativo={f >= cort - 6} />
        <PersonagemEm x={880} pe={1660} altura={320} boca={mouth} expressao={f >= nao ? "surpreso" : "pensativo"} pose="apontando" espelhar olharX={-0.6} />
      </Camera>
      <TitleSlam text="1935" top={240} size={140} color={C.yellow} at={Math.max(0, ano)} />
      {f >= cort && <Tag text="NERVO CORTADO" x={540} y={460} at={cort} bg={C.red} color={C.white} size={50} />}
      {f >= nao && <Tag text="= SEM RUGA!" x={540} y={1180} at={nao} bg={C.white} size={56} />}
      <Sfx at={ano} name="ding" volume={0.45} />
      <Sfx at={cort} name="click" volume={0.45} />
      <Sfx at={nao} name="boing" volume={0.45} />
    </Full>
  );
};

/** Pra que serve? Uma teoria: pneu de chuva — segura melhor coisas molhadas (teste das bolinhas). */
export const S5Pneu: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pneu = wordAt(scene, "pneu");
  const l1 = lineStart(scene, 1);
  const seg = wordAt(scene, "segurar");
  const l2 = lineStart(scene, 2);
  const enr = wordAt(scene, "enrugado!");
  const end = scene.endFrame - scene.startFrame;
  return (
    <Full>
      {f < l2 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: pneu, zoom: 1.06 }]} shakes={[pneu]}>
          <CeuCampo nuvens />
          {f >= pneu - 6 && <Pneu x={760} y={880} s={0.95} />}
          <Mao x={f >= pneu - 6 ? 300 : 540} y={900} s={0.75} rugas={1} molhada={f >= l1} />
          <PersonagemEm x={540} pe={1660} altura={300} boca={mouth} expressao="animado" pose="explicando" />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: enr, zoom: 1.08 }]} shakes={[enr]}>
          <CeuCampo nuvens />
          <PotesBolinhas x={540} y={900} s={1.25} p={cl(f, l2 + 20, end - 20)} />
          <PersonagemEm x={540} pe={1660} altura={340} boca={mouth} expressao={f >= enr ? "encantado" : "animado"} pose={f >= enr ? "comemorando" : "apontando"} />
        </Camera>
      )}
      <Tag text="UMA TEORIA…" x={540} y={300} at={4} bg={C.white} size={52} />
      {f >= pneu && f < l2 && <Tag text="PNEU DE CHUVA!" x={540} y={420} at={pneu} bg={C.yellow} size={56} />}
      {f >= seg && f < l2 && <Tag text="SEGURA COISA MOLHADA" x={540} y={1200} at={seg} bg={C.blue} color={C.white} size={46} />}
      {f >= l2 && <Tag text="TESTE DAS BOLINHAS" x={540} y={420} at={l2} bg={C.yellow} size={54} />}
      {f >= enr && <Tag text="MAIS RÁPIDO ENRUGADO!" x={540} y={1200} at={enr} bg={C.green} color={C.white} size={46} />}
      <Sfx at={pneu} name="whoosh" volume={0.45} />
      <Sfx at={seg} name="pop" volume={0.45} />
      <Sfx at={l2} name="click" volume={0.4} />
      <Sfx at={enr} name="tada" volume={0.4} />
    </Full>
  );
};

/** O dedo enruga SEMPRE do mesmo jeito: impressão digital… de banheira! */
export const S6Digital: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const sempre = wordAt(scene, "sempre");
  const l1 = lineStart(scene, 1);
  const banh = wordAt(scene, "banheira!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sempre, zoom: 1.0 }, { f: l1, zoom: 1.08 }]} shakes={[sempre, banh]}>
        <Banheiro />
        <PontaDigital x={540} y={900} s={f >= sempre ? 1.0 : 1.4} dupla={f >= sempre} />
      </Camera>
      {f >= sempre && <Tag text="BANHO 1  =  BANHO 2" x={540} y={300} at={sempre} bg={C.white} size={52} />}
      {f >= banh && <TitleSlam text="DIGITAL DE BANHEIRA!" top={440} size={86} color={C.yellow} at={banh} />}
      <Sfx at={sempre} name="ding" volume={0.45} />
      <Sfx at={banh} name="borbulha" volume={0.5} />
    </Full>
  );
};

/** Conclusão: seu dedo troca de pneu sozinho… e nem cobra a calibragem! + chamada. */
export const S7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pneu = wordAt(scene, "pneu");
  const cal = wordAt(scene, "calibragem!");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: cal, zoom: 1.12 }, { f: l1, zoom: 1.0 }]} shakes={[cal]}>
        <Banheiro />
        {f >= pneu - 4 && f < l1 && <Pneu x={830} y={760} s={0.55} />}
        <TitoBanho mouth={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} x={f >= l1 ? 540 : 400} />
      </Camera>
      {f >= cal && f < l1 && <Tag text="CALIBRAGEM GRÁTIS" x={540} y={320} at={cal} bg={C.yellow} size={52} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="DEMORA NO BANHO?" />}
      <Sfx at={pneu} name="whoosh" volume={0.4} />
      <Sfx at={cal} name="boing" volume={0.45} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
