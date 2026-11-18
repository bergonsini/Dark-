import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { PersonagemEm } from "../../characters/Personagem";
import { CeuCampo } from "../../components/Backgrounds";
import { Camera } from "../../components/Camera";
import { AlpesVaca, BarraChocolate, BebidaMaia, Cacau, Caravela, CHOC, FabricaAntiga, MercadoAsteca, PiramideMaia } from "../../components/Chocolate";
import { Praia } from "../../components/Mar";
import { Cozinha } from "../../components/Natal";
import { BalaoComentario, Brilhos } from "../../components/Props";
import { Tag, TitleSlam } from "../../components/Text";
import { C } from "../../theme";
import { lineStart, wordAt } from "../../timeline";
import { Full, SceneProps, Sfx, useSceneFrame } from "../common";

/** "Como surgiu o chocolate?" (video: "chocolate") — fatos: Mental Floss, History.com, Wikipedia (ver roteiro "fontes"). */

const cl = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Sementinhas de cacau caindo como moedas (2D por cima). */
const ChuvaSementes: React.FC<{ f: number; at: number }> = ({ f, at }) =>
  f < at ? null : (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const y = ((i * 211 + (f - at) * 22) % 2100) - 150;
          const x = (i * 149) % 1040 + 20;
          return <ellipse key={i} cx={x} cy={y} rx={26} ry={17} fill={CHOC.semente} stroke={C.outline} strokeWidth={5} transform={`rotate(${f * 4 + i * 40} ${x} ${y})`} />;
        })}
      </svg>
    </AbsoluteFill>
  );

/** 0–3 s: GANCHO. Sementes de cacau caindo como moedas: "Sabia que o chocolate já foi DINHEIRO?" */
export const K1Gancho: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const din = wordAt(scene, "dinheiro?");
  const flash = interpolate(f, [0, 3, 12], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.3, y: 80 }, { f: 30, zoom: 1.05 }]} shakes={[din]}>
        <CeuCampo nuvens />
        <BarraChocolate x={760} y={1150} s={0.8} rot={12} />
        <PersonagemEm x={300} pe={1560} altura={520} boca={mouth} expressao="surpreso" pose="assustado" olharX={0.6} olharY={-0.5} />
      </Camera>
      <ChuvaSementes f={f} at={0} />
      <AbsoluteFill style={{ background: C.white, opacity: flash, pointerEvents: "none" }} />
      <TitleSlam text="O CHOCOLATE JÁ FOI…" top={190} size={92} color={C.white} at={0} />
      <TitleSlam text="DINHEIRO?!" top={1390} size={150} color={C.yellow} at={Math.max(0, din - 4)} rotate={3} />
      <Sfx at={0} name="whoosh" volume={0.6} />
      <Sfx at={0} name="riser" volume={0.4} />
      <Sfx at={Math.max(0, din - 4)} name="boom" volume={0.6} />
    </Full>
  );
};

/** Mais de 3 mil anos atrás, México e América Central; o cacau nasce numa fruta cheia de sementes. */
export const K2Origem: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const tres = wordAt(scene, "três");
  const l1 = lineStart(scene, 1);
  const sem = wordAt(scene, "sementes.");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: tres, zoom: 1.08, y: 40 }]}>
          <CeuCampo nuvens colina1="#2E8B57" colina2="#1F6F43" />
          <PiramideMaia x={620} y={1420} s={0.95} />
          <PersonagemEm x={180} pe={1560} altura={360} boca={mouth} expressao="encantado" pose="apontando" olharX={0.8} olharY={-0.4} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: sem, zoom: 1.12 }]} shakes={[sem]}>
          <CeuCampo nuvens colina1="#2E8B57" colina2="#1F6F43" />
          <Cacau x={540} y={900} s={1.25} aberto={cl(f, sem - 8, sem + 6)} />
        </Camera>
      )}
      {f >= tres && f < l1 && <Tag text="+ DE 3.000 ANOS" x={540} y={320} at={tres} bg={C.yellow} size={60} />}
      {f >= tres + 20 && f < l1 && <Tag text="MÉXICO E AMÉRICA CENTRAL" x={540} y={440} at={tres + 20} bg={C.white} size={44} />}
      {f >= l1 && <Tag text="FRUTO DO CACAU" x={540} y={300} at={l1 + 4} bg={C.orange} color={C.white} size={56} />}
      {f >= sem && <Tag text="SEMENTES!" x={540} y={1440} at={sem} bg={C.white} size={58} />}
      <Sfx at={tres} name="ding" volume={0.45} />
      <Sfx at={l1 + 4} name="pop" volume={0.45} />
      <Sfx at={sem} name="boing" volume={0.45} />
    </Full>
  );
};

/** Os maias: bebida AMARGA e espumante… às vezes com PIMENTA! Nada de docinho. */
export const K3Maias: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const amarga = wordAt(scene, "amarga");
  const pimenta = wordAt(scene, "pimenta!");
  const l1 = lineStart(scene, 1);
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: pimenta, zoom: 1.1, y: 40 }]} shakes={[pimenta]}>
          <CeuCampo nuvens colina1="#2E8B57" colina2="#1F6F43" />
          <BebidaMaia x={600} y={1300} s={1.2} despeja={1} pimenta={cl(f, pimenta - 6, pimenta + 6)} />
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: 30, zoom: 1.15, y: 120 }]}>
          <CeuCampo nuvens colina1="#2E8B57" colina2="#1F6F43" />
          <PersonagemEm x={540} pe={1650} altura={700} boca={mouth} expressao="bravo" pose="assustado" />
        </Camera>
      )}
      {f >= amarga && f < l1 && <Tag text="AMARGA E ESPUMANTE" x={540} y={320} at={amarga} bg={C.white} size={54} />}
      {f >= pimenta && f < l1 && <Tag text="COM PIMENTA!" x={540} y={440} at={pimenta} bg={C.red} color={C.white} size={58} />}
      {f >= l1 && <TitleSlam text="ECA… AMARGO!" top={300} size={110} color={C.yellow} at={l1 + 2} />}
      <Sfx at={amarga} name="borbulha" volume={0.45} />
      <Sfx at={pimenta} name="boom" volume={0.35} />
      <Sfx at={l1 + 2} name="boing" volume={0.45} />
    </Full>
  );
};

/** Os astecas usavam as sementes como MOEDA… pagar o pão e receber o troco em sementinhas! */
export const K4Dinheiro: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const moeda = wordAt(scene, "moeda!");
  const l1 = lineStart(scene, 1);
  const troco = wordAt(scene, "troco");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: l1, zoom: 1.06, y: 40 }]} shakes={[troco]}>
        <CeuCampo nuvens colina1="#2E8B57" colina2="#1F6F43" />
        <MercadoAsteca x={540} y={1160} s={1.1} troco={cl(f, troco, troco + 16)} />
        <PersonagemEm x={860} pe={1620} altura={360} boca={mouth} expressao={f >= troco ? "encantado" : "feliz"} pose={f >= troco ? "comemorando" : "explicando"} espelhar olharX={-0.6} />
      </Camera>
      <ChuvaSementes f={f} at={moeda} />
      {f >= moeda && f < l1 && <Tag text="SEMENTE = MOEDA" x={540} y={320} at={moeda} bg={C.yellow} size={60} />}
      {f >= troco && <Tag text="TROCO EM SEMENTINHAS!" x={540} y={320} at={troco} bg={C.white} size={52} />}
      <Sfx at={moeda} name="tada" volume={0.45} />
      <Sfx at={troco} name="pop" volume={0.45} />
      <Sfx at={troco + 6} name="pop" volume={0.4} />
    </Full>
  );
};

/** Século XVI: o cacau chega à Europa… e ganha AÇÚCAR! */
export const K5Europa: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const europa = wordAt(scene, "europa…");
  const acucar = wordAt(scene, "açúcar!");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.0 }, { f: acucar, zoom: 1.1 }]} shakes={[acucar]}>
        <Praia nivel={1100} areia={false} />
        <Caravela x={540 + Math.max(0, 260 - f * 2.4)} y={1050} s={1.1} />
        <PersonagemEm x={200} pe={1700} altura={300} boca={mouth} expressao="feliz" pose="acenando" />
      </Camera>
      <Tag text="SÉCULO XVI" x={540} y={300} at={4} bg={C.white} size={56} />
      {f >= europa && <Tag text="RUMO À EUROPA" x={540} y={420} at={europa} bg={C.blue} color={C.white} size={52} />}
      {f >= acucar && <TitleSlam text="+ AÇÚCAR!" top={1200} size={130} color={C.yellow} at={acucar} />}
      {f >= acucar && <Brilhos x={400} y={950} at={acucar} />}
      <Sfx at={4} name="whoosh" volume={0.45} />
      <Sfx at={europa} name="borbulha" volume={0.35} />
      <Sfx at={acucar} name="sparkle" volume={0.5} />
    </Full>
  );
};

/** 1847: uma das primeiras BARRAS (Inglaterra). 1875: chocolate ao LEITE (Suíça). */
export const K6Barra: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const barras = wordAt(scene, "barras");
  const l1 = lineStart(scene, 1);
  const leite = wordAt(scene, "leite!");
  return (
    <Full>
      {f < l1 ? (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: barras, zoom: 1.08 }]} shakes={[barras]}>
          <CeuCampo topo="#78909C" base="#B0BEC5" nuvens />
          <FabricaAntiga x={420} y={1450} s={1.0} />
          {f >= barras && <BarraChocolate x={800} y={1150} s={0.7 * cl(f, barras, barras + 8)} rot={-10} cor={CHOC.amargo} />}
        </Camera>
      ) : (
        <Camera keys={[{ f: 0, zoom: 1.0 }, { f: leite, zoom: 1.08 }]} shakes={[leite]}>
          <CeuCampo nuvens />
          <AlpesVaca y={1450} />
          {f >= leite && <BarraChocolate x={740} y={1180} s={0.6 * cl(f, leite, leite + 8)} rot={8} />}
          <PersonagemEm x={180} pe={1640} altura={300} boca={mouth} expressao="encantado" pose="comemorando" />
        </Camera>
      )}
      {f < l1 && <TitleSlam text="1847" top={240} size={150} color={C.white} at={4} />}
      {f >= barras && f < l1 && <Tag text="INGLATERRA: BARRA PRA COMER" x={540} y={460} at={barras} bg={C.yellow} size={44} />}
      {f >= l1 && <TitleSlam text="1875" top={240} size={150} color={C.white} at={l1 + 2} />}
      {f >= leite && <Tag text="SUÍÇA: AO LEITE!" x={540} y={460} at={leite} bg={C.white} size={54} />}
      <Sfx at={4} name="whoosh" volume={0.4} />
      <Sfx at={barras} name="ding" volume={0.45} />
      <Sfx at={l1 + 2} name="whoosh" volume={0.4} />
      <Sfx at={leite} name="tada" volume={0.45} />
    </Full>
  );
};

/** Conclusão + chamada: ao leite, amargo ou branco? */
export const K7Conclusao: React.FC<SceneProps> = ({ scene }) => {
  const { f, mouth } = useSceneFrame(scene);
  const doc = wordAt(scene, "docinho");
  const l1 = lineStart(scene, 1);
  const conta = wordAt(scene, "conta");
  return (
    <Full>
      <Camera keys={[{ f: 0, zoom: 1.05 }, { f: l1, zoom: 1.0 }]} shakes={[doc]}>
        <Cozinha />
        <PersonagemEm x={300} pe={1560} altura={500} boca={mouth} expressao={f >= l1 ? "animado" : "feliz"} pose={f >= l1 ? "acenando" : "explicando"} olharX={0.5} />
        {f >= l1 && (
          <>
            <BarraChocolate x={720} y={900} s={0.45} rot={-8} />
            <BarraChocolate x={900} y={1050} s={0.45} rot={10} cor={CHOC.amargo} />
            <BarraChocolate x={760} y={1250} s={0.45} rot={-4} cor="#FFF3DC" />
          </>
        )}
      </Camera>
      {f < l1 && <Tag text="AMARGO → DINHEIRO → DOCINHO" x={540} y={320} at={8} bg={C.white} size={44} />}
      {f >= l1 && f < conta - 10 && <Tag text="AO LEITE · AMARGO · BRANCO" x={540} y={320} at={l1} bg={C.yellow} size={48} />}
      {f >= conta - 10 && <BalaoComentario x={540} y={400} s={1} texto="QUAL É O SEU FAVORITO?" />}
      <Sfx at={doc} name="tada" volume={0.45} />
      <Sfx at={l1} name="pop" volume={0.4} />
      <Sfx at={conta} name="pop" volume={0.45} />
    </Full>
  );
};
