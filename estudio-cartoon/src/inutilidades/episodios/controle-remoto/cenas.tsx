import React from "react";
import { Freeze } from "remotion";
import { CenaProps, lerp, mola, passo, Sfx, tremor, TINTA, useCena } from "../../common";
import { Confete, ControleRemoto, Estudio, Pedestal, Sala } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, Rato, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** INUTILIDADES 0800 · Ep. 3 — "Controle Remoto Universal de Verdade" (inutilidades/roteiros/controle-remoto.json) */

const NUMERO = "0800-PAUSE";

/** Seu Kuka segurando o controle (pose "controle": a mão fica em (351, -477) no espaço dele). */
const KukaControle: React.FC<{ x: number; y: number; escala: number; boca: number; aperta?: "pause" | "ejetar" | null; estado?: "normal" | "faminto" }> = ({ x, y, escala, boca, aperta = null, estado }) => (
  <>
    <SeuKuka x={x} y={y} escala={escala} banguela pose="controle" boca={boca} estado={estado} feliz={!estado} />
    <ControleRemoto x={x + 351 * escala} y={y - 500 * escala} escala={0.32 * escala} rot={25} aperta={aperta} />
  </>
);

/** Rato congelado no meio do pulo, com um queijo. */
const RatoPulando: React.FC<{ x: number; y: number; escala?: number; rot?: number }> = ({ x, y, escala = 1, rot = -18 }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <Rato x={x} y={y} escala={escala} />
    <path d={`M${x + 60 * escala} ${y - 200 * escala} l${90 * escala} 0 l${-30 * escala} ${-50 * escala} Z`} fill="#FFD23F" stroke={TINTA} strokeWidth={6} />
    <g stroke="#fff" strokeWidth={10} strokeLinecap="round">
      <path d={`M${x - 160 * escala} ${y - 120 * escala} l-90 40 M${x - 150 * escala} ${y - 40 * escala} l-90 40`} />
    </g>
  </g>
);

/** 1. GANCHO: o rato congelado no ar; o Kuka com o controle: "Pausei o rato." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  return (
    <>
      <Tela zoom={lerp(f, 0, 50, 1.0, 1.08)} foco={[540, 1000]}>
        <Freeze frame={0}>
          <Sala canal={0} tvX={230} />
          <RatoPulando x={700} y={980} escala={1.05} />
        </Freeze>
        <KukaControle x={300} y={1820} escala={0.95} boca={boca("kuka")} aperta="pause" />
      </Tela>
      <Onomatopeia texto="‖" at={0} dur={60} x={820} y={560} tam={200} cor="#fff" rot={0} />
      <Sfx at={0} nome="click" vol={0.6} />
    </>
  );
};

/** 2. O PROBLEMA (P&B): o controle que só muda de canal… e se a vida tivesse PAUSE? */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const pausa = wordAt(scene, "pause");
  const canal = Math.floor(f / 12);
  return (
    <>
      {f < l1 ? (
        <Tela pb>
          <Sala canal={canal} tvX={300} sofa={false} />
          <KukaControle x={720} y={1820} escala={0.9} boca={boca("kuka")} estado="faminto" />
        </Tela>
      ) : (
        <Tela pb shake={tremor(f, l1, 8, 10)}>
          <Freeze frame={pausa} active={f >= pausa}>
            <Sala canal={canal} tvX={250} />
            <SeuKuka x={300} y={1820} escala={0.85} estado="faminto" pose="bracosPraCima" banguela />
            <Rato x={lerp(f, l1, l1 + 70, 1200, 700)} y={1700} escala={0.8} capacete />
          </Freeze>
        </Tela>
      )}
      {f < l1 && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Sfx key={i} at={i * 12 + 2} nome="click" vol={0.3} />)}
      {f >= pausa && <Onomatopeia texto="‖ PAUSE" at={pausa} dur={80} x={540} y={520} tam={130} cor="#fff" rot={0} />}
      <Sfx at={pausa} nome="vhs" vol={0.4} />
    </>
  );
};

/** 3. A SOLUÇÃO: "Apresento o Controle Remoto Universal… de VERDADE!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const ctrl = wordAt(scene, "controle");
  const entra = mola(f, ctrl, 140, 12);
  return (
    <>
      {f < ctrl ? (
        <Tela zoom={lerp(f, 0, ctrl, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <ControleRemoto x={790} y={1180} escala={0.85 * entra} rot={-10 + (1 - entra) * 360} aperta={f >= ctrl + 30 ? "play" : null} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="CONTROLE REMOTO" linha2="DE VERDADE!" at={ctrl} y={360} tam={100} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={ctrl} nome="whoosh" vol={0.5} />
      <Sfx at={ctrl + 10} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 4. A DEMONSTRAÇÃO: PAUSE congela até o Doutor e o confete; o Kuka aperta EJETAR… e o Doutor é ejetado. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pausa = wordAt(scene, "pause");
  const para = wordAt(scene, "para");
  const l1 = lineStart(scene, 1);
  const ejeta = lineEnd(scene, 1) - 6;
  const sobe = lerp(f, ejeta, ejeta + 10, 0, 1);
  return (
    <>
      {f < l1 ? (
        <Tela>
          <Freeze frame={para} active={f >= para}>
            <Estudio />
            <Confete />
            <DoutorOferta x={480} y={1740} escala={0.95} pose="apresentando" boca={boca("doutor")} expr={f >= pausa ? "gritando" : "sorriso"} />
            <ControleRemoto x={480 + 355 * 0.95} y={1740 - 560 * 0.95} escala={0.3} rot={20} aperta={f >= pausa ? "pause" : null} />
          </Freeze>
        </Tela>
      ) : (
        <Tela shake={tremor(f, ejeta, 18, 12)}>
          <Estudio />
          <Confete />
          <DoutorOferta x={330} y={1740 - sobe * 2600} escala={0.85} pose="bracosAbertos" expr="chocado" giro={sobe * 200} />
          <KukaControle x={660} y={1840} escala={0.8} boca={boca("kuka")} aperta={f >= ejeta - 4 ? "ejetar" : null} />
        </Tela>
      )}
      {f >= para && f < l1 && <Onomatopeia texto="‖ PAUSE" at={para} dur={l1 - para} x={540} y={520} tam={130} cor="#fff" rot={0} />}
      {f >= ejeta && <Onomatopeia texto="⏏ EJETAR!" at={ejeta} dur={30} x={540} y={520} tam={120} cor="#FF8C1A" />}
      <Sfx at={pausa} nome="click" vol={0.5} />
      <Sfx at={para} nome="vhs" vol={0.45} />
      <Sfx at={l1} nome="click" vol={0.4} />
      <Sfx at={ejeta} nome="boing" vol={0.6} />
      <Sfx at={ejeta + 2} nome="whoosh" vol={0.6} />
    </>
  );
};

/** 5. O DEPOIMENTO: pausou o rato, adiantou a segunda… e ejetou o apresentador (que cai do céu). */
export const Depoimento: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const rato = wordAt(scene, "rato");
  const segunda = wordAt(scene, "segunda-feira");
  const apres = wordAt(scene, "apresentador");
  const l2 = lineStart(scene, 2);
  const cai = apres + 4;
  const quedaY = f < cai ? -900 : Math.min(1900, -900 + (f - cai) * 280);
  const caiu = f >= cai + 10;
  const ratoNoAr = passo(f, [[0, false], [rato, true], [segunda, false]] as [number, boolean][]);
  return (
    <>
      <Tela shake={tremor(f, cai + 10, 30, 14)}>
        <Sala canal={2} tvX={210} />
        {ratoNoAr && (
          <Freeze frame={0}>
            <RatoPulando x={740} y={760} escala={0.7} />
          </Freeze>
        )}
        {f >= cai && !caiu && <DoutorOferta x={760} y={quedaY} escala={0.6} pose="bracosAbertos" expr="chocado" giro={180} />}
        {caiu && <DoutorOferta x={720} y={1900} escala={0.6} pose="parado" expr="chocado" giro={90} curativo />}
        <KukaControle x={300} y={1800} escala={0.95} boca={boca("kuka")} />
      </Tela>
      {ratoNoAr && <Onomatopeia texto="‖" at={rato} dur={60} x={860} y={420} tam={150} cor="#fff" rot={0} />}
      {f >= segunda && f < apres && <Onomatopeia texto="▶▶ SEXTA-FEIRA!" at={segunda} dur={apres - segunda} x={540} y={420} tam={96} cor="#FFD23F" />}
      {caiu && f < l2 + 10 && <Onomatopeia texto="CRASH!" at={cai + 10} dur={30} x={720} y={900} tam={110} cor="#fff" />}
      {f >= l2 && <Onomatopeia texto="★★★★★" at={l2 + 4} dur={60} y={420} tam={110} rot={0} />}
      <Selo texto={"DEPOIMENTO\nREAL*"} at={2} x={640} y={180} />
      <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 7" at={6} />
      <Sfx at={rato} nome="click" vol={0.4} />
      <Sfx at={segunda} nome="whoosh" vol={0.4} />
      <Sfx at={cai} nome="whoosh" vol={0.5} />
      <Sfx at={cai + 10} nome="boom" vol={0.55} />
      <Sfx at={l2} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 6. A OFERTA: de 999 por 39,90 + um controle pra controlar o controle. O Kuka: "Manda dois!" LIGUE JÁ! */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3990");
  const agora = wordAt(scene, "agora");
  const controlar = wordAt(scene, "controlar");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const seg = mola(f, controlar, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <ControleRemoto x={760} y={1180} escala={0.85} rot={-10} />
          {f >= controlar && <ControleRemoto x={930} y={1270} escala={0.45 * seg} rot={14} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Sala canal={1} tvX={210} />
          <SeuKuka x={540} y={1790} escala={1.05} banguela pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= controlar && f < l2 && <Selo texto={"+ CONTROLE\nDO CONTROLE\nGRÁTIS!"} at={controlar + 4} x={40} y={600} cor="#22A447" rot={-8} tam={54} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 9" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={controlar} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 7. LETRINHAS MIÚDAS: "Não aperte ejetar perto do apresentador. Pilhas não inclusas." */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 32, 48);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <ControleRemoto x={540} y={1010} escala={0.65} rot={-8} />
      </Tela>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, lineHeight: 0.95 }}>
        <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: `16px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>INUTILIDADES</div>
        <div style={{ fontSize: 170, color: "#FFD23F", WebkitTextStroke: `18px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>0800</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1360,
          padding: "16px 24px",
          background: "rgba(0,0,0,.55)",
          borderRadius: 14,
          fontFamily: "'Nunito'",
          fontWeight: 900,
          fontSize: tam,
          lineHeight: 1.15,
          color: "#fff",
          textAlign: "center",
        }}
      >
        *Não aperte ejetar perto do apresentador. Pilhas não inclusas.
      </div>
      <LigueJa at={0} numero={NUMERO} />
    </>
  );
};
