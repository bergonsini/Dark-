import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { Gato, JanelaTela, OuvidoInterno, RaioXGato, Toalha } from "../../components/Gato";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario, Brilhos } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Como o gato sempre cai de pé?" (video: "gato-de-pe") — fatos: Live Science, Purina, Catster/Wikipedia (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Pódio de ginástica (a piada: "não fez ginástica olímpica"). */
const Podio: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y})`} stroke={C.outline} strokeWidth={8} strokeLinejoin="round">
        <rect x={-200} y={0} width={400} height={260} fill="#FFC21A" />
        <text x={0} y={180} textAnchor="middle" fontSize={180} fontWeight={800} fill={C.white} stroke={C.outline} strokeWidth={10} paintOrder="stroke" fontFamily="'Baloo 2'">
          1
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);

/** 0–3 s: GANCHO. Um gato despenca de cabeça pra baixo… e aterrissa de pé. */
export const G1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const pe = wordAt(scene, "pé?");
  const t = cl(f, 0, pe);
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.2, y: 60 }, { f: 40, zoom: 1.05 }]} shakes={[pe]}>
        <Cozinha />
        <Gato x={640} y={380 + t * 880} s={1.0} viradoFrente={1 - cl(f, 10, 40)} viradoTras={1 - cl(f, 30, 60)} expr={f >= pe ? "orgulhoso" : "focado"} />
        <PersonagemEm x={240} pe={1560} altura={480} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.7} olharY={-0.4} />
      </Camera>
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="POR QUE O GATO SEMPRE" top={190} size={88} color={C.white} at={0} />
      <TitleSlam text="CAI DE PÉ?" top={1390} size={140} color={C.yellow} at={Math.max(0, pe - 4)} rotate={3} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={0} name="riser" volume={0.4} />
      <Sfx at={Math.max(0, pe - 2)} name="boing" volume={0.6} />
    </Full>
  );
};

/** Não, ele não fez ginástica olímpica… é um SUPERPODER: reflexo de endireitamento! */
export const G2Reflexo: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const nao = wordAt(scene, "não,");
  const l1 = lineStart(scene, 1);
  const sup = wordAt(scene, "superpoder");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: 60, zoom: 1.08 }]}>
          <CeuCampo nuvens />
          <Podio x={560} y={1200} />
          <Gato x={540} y={1070} s={0.9} expr="orgulhoso" medalha />
          <PersonagemEm x={180} pe={1560} altura={380} boca={mouth} expressao="animado" pose="apontando" olharX={0.8} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sup, zoom: 1.12 }]} shakes={[sup]}>
          <CeuCampo topo="#8E5CF7" base="#C7A6FF" nuvens={false} />
          <Gato x={520} y={1000} s={1.1} expr="focado" />
          <PersonagemEm x={860} pe={1560} altura={360} boca={mouth} expressao="encantado" pose="comemorando" espelhar />
          <Brilhos x={540} y={850} at={sup} />
        </Camera>
      )}
      {f < l1 && <Tag text="GINÁSTICA OLÍMPICA?" x={540} y={320} at={8} bg={C.white} size={54} />}
      {f >= nao + 8 && f < l1 && <TitleSlam text="NÃO!" top={480} size={160} color={C.red} at={nao + 8} />}
      {f >= sup && <Tag text="SUPERPODER!" x={540} y={300} at={sup} bg={C.yellow} size={64} />}
      {f >= sup + 12 && <TitleSlam text="REFLEXO DE ENDIREITAMENTO" top={420} size={74} color={C.white} at={sup + 12} />}
      <Sfx at={8} name="tada" volume={0.35} />
      <Sfx at={nao + 8} name="boing" volume={0.45} />
      <Sfx at={sup} name="sparkle" volume={0.5} />
    </Full>
  );
};

/** Um sensor no ouvido interno avisa: o chão é pra LÁ! */
export const G3Ouvido: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const ouvido = wordAt(scene, "ouvido");
  const la = wordAt(scene, "lá!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: ouvido, zoom: 1.06 }]} shakes={[la]}>
        <CeuCampo nuvens />
        <Gato x={420} y={600 + f * 0.6} s={0.95} viradoFrente={1} viradoTras={1} rot={-8} expr="focado" />
        {f >= ouvido && <OuvidoInterno x={700} y={1050} s={0.95} aponta={cl(f, la - 6, la + 4)} />}
      </Camera>
      <Tag text="QUEDA!" x={540} y={300} at={4} bg={C.white} size={56} />
      {f >= ouvido && <Tag text="SENSOR NO OUVIDO" x={540} y={420} at={ouvido} bg={C.pink} color={C.white} size={52} />}
      {f >= la && <TitleSlam text="O CHÃO É PRA LÁ!" top={1180} size={84} color={C.yellow} at={la} />}
      <Sfx at={4} name="whoosh" volume={0.45} />
      <Sfx at={ouvido} name="pop" volume={0.45} />
      <Sfx at={la} name="ding" volume={0.5} />
    </Full>
  );
};

/** Gira a FRENTE primeiro… depois a parte de TRÁS — tipo uma toalha sendo torcida. */
export const G4Gira: React.FC<SceneProps> = ({ scene }) => {
  const { f } = useSceneFrame(scene);
  const frente = wordAt(scene, "frente");
  const l1 = lineStart(scene, 1);
  const tras = wordAt(scene, "trás,");
  const toalha = wordAt(scene, "toalha");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.05 }]}>
        <CeuCampo nuvens />
        <Gato x={540} y={900} s={1.3} viradoFrente={1 - cl(f, 30, frente + 10)} viradoTras={1 - cl(f, tras - 6, tras + 18)} expr="focado" />
        {f >= toalha && <Toalha x={540} y={520} s={0.9} torce={cl(f, toalha, toalha + 30)} />}
      </Camera>
      {f < l1 && f >= frente - 10 && <Tag text="1º GIRA A FRENTE" x={540} y={300} at={frente - 10} bg={C.yellow} size={56} />}
      {f >= tras - 6 && <Tag text="2º GIRA A TRÁS" x={540} y={300} at={tras - 6} bg={C.orange} color={C.white} size={56} />}
      {f >= toalha && <Tag text="TOALHA TORCIDA!" x={540} y={1180} at={toalha} bg={C.blue} color={C.white} size={54} />}
      <Sfx at={frente} name="whoosh" volume={0.45} />
      <Sfx at={tras} name="whoosh" volume={0.45} />
      <Sfx at={toalha} name="boing" volume={0.4} />
    </Full>
  );
};

/** Coluna SUPERFLEXÍVEL e clavícula solta (raio X). */
export const G5Coluna: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const flex = wordAt(scene, "superflexível…");
  const clav = wordAt(scene, "clavícula");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: flex, zoom: 1.06 }]}>
        <CeuCampo topo="#1B1530" base="#2A1E5C" nuvens={false} colina1="#2A1E5C" colina2="#2A1E5C" />
        <RaioXGato x={540} y={820} s={1.05} dobra={cl(f, flex - 6, flex + 20)} clavicula={cl(f, clav, clav + 10)} />
        <PersonagemEm x={820} pe={1560} altura={380} boca={mouth} expressao="encantado" pose="apontando" espelhar olharX={-0.6} olharY={-0.5} />
      </Camera>
      <Tag text="RAIO X DO GATO" x={540} y={330} at={4} bg={C.white} size={54} />
      {f >= flex && <Tag text="COLUNA SUPERFLEXÍVEL" x={540} y={1210} at={flex} bg={C.yellow} size={50} />}
      {f >= clav && <Tag text="CLAVÍCULA SOLTA" x={420} y={1090} at={clav} bg={C.teal} color={C.white} size={48} />}
      <Sfx at={4} name="click" volume={0.4} />
      <Sfx at={flex} name="boing" volume={0.45} />
      <Sfx at={clav} name="pop" volume={0.45} />
    </Full>
  );
};

/** Os filhotes já treinam com POUCAS semanas de vida. */
export const G6Filhote: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const poucas = wordAt(scene, "poucas");
  const filhote = (i: number) => {
    const ciclo = ((f + i * 22) % 60) / 60;
    const salto = Math.sin(ciclo * Math.PI);
    return <Gato key={i} x={260 + i * 260} y={1180 - salto * 360} s={0.42} viradoFrente={salto > 0.3 ? Math.max(0, 1 - ciclo * 1.6) : 0} viradoTras={salto > 0.3 ? Math.max(0, 1 - ciclo * 1.3) : 0} expr="feliz" />;
  };
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: poucas, zoom: 1.08 }]}>
        <CeuCampo nuvens />
        {[0, 1, 2].map(filhote)}
        <PersonagemEm x={540} pe={1600} altura={300} boca={mouth} expressao="encantado" pose="comemorando" />
      </Camera>
      <Tag text="TREINO DE FILHOTE" x={540} y={320} at={6} bg={C.white} size={54} />
      {f >= poucas && <Tag text="POUCAS SEMANAS DE VIDA!" x={540} y={440} at={poucas} bg={C.pink} color={C.white} size={48} />}
      <Sfx at={6} name="boing" volume={0.4} />
      <Sfx at={26} name="boing" volume={0.35} />
      <Sfx at={poucas} name="ding" volume={0.45} />
    </Full>
  );
};

/** Cuidado: não é MÁGICA, o gato pode se machucar. Tela de proteção na janela, SEMPRE! */
export const G7Cuidado: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const magica = wordAt(scene, "mágica!");
  const l1 = lineStart(scene, 1);
  const tela = wordAt(scene, "tela");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.04 }]} shakes={[magica]}>
        <Cozinha />
        <JanelaTela x={540} y={760} s={1.1} tela={f >= tela} />
        <Gato x={560} y={1180} s={0.8} expr={f >= tela ? "feliz" : "assustado"} />
        <PersonagemEm x={200} pe={1580} altura={380} boca={mouth} expressao={f >= tela ? "feliz" : "preocupado"} pose={f >= tela ? "apontando" : "explicando"} olharX={0.7} />
      </Camera>
      {f >= magica && f < l1 && <Tag text="NÃO É MÁGICA!" x={540} y={300} at={magica} bg={C.red} color={C.white} size={60} />}
      {f >= tela && <Tag text="TELA DE PROTEÇÃO ✓" x={540} y={300} at={tela} bg={C.green} color={C.white} size={58} />}
      <Sfx at={magica} name="boom" volume={0.35} />
      <Sfx at={tela} name="ding" volume={0.5} />
    </Full>
  );
};

/** Conclusão + chamada. */
export const G8Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const duas = wordAt(scene, "duas");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }]} shakes={[duas]}>
        <CeuCampo nuvens />
        <Gato x={700} y={1180} s={0.85} expr="orgulhoso" medalha={f >= l1} />
        <PersonagemEm x={260} pe={1560} altura={480} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} olharX={0.5} />
      </Camera>
      {f < l1 && <Tag text="OUVIDO + CORPO QUE GIRA" x={540} y={320} at={8} bg={C.white} size={54} />}
      {f >= duas && f < l1 && <TitleSlam text="EM DUAS PARTES!" top={440} size={96} color={C.yellow} at={duas} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="SEU GATO JÁ FEZ ACROBACIA?" />}
      <Sfx at={8} name="whoosh" volume={0.4} />
      <Sfx at={duas} name="tada" volume={0.45} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
