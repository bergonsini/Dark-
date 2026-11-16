import React from "react";
import { CenaProps, lerp, mola, passo, Sfx, tremor, TINTA, useCena } from "../../common";
import { Balde, Chuva, Cozinha, Estudio, Fumaca, GuardaChuva, Pedestal, Poca, Rua } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, Rato, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** INUTILIDADES 0800 · Ep. 4 — "Guarda-Chuva Peneira" (inutilidades/roteiros/guarda-chuva-peneira.json) */

const NUMERO = "0800-PINGA-PINGA";

/** Seu Kuka segurando um guarda-chuva (pose "guardaChuva": mão em (166, -691)). */
const KukaGuardaChuva: React.FC<{
  x: number;
  y: number;
  escala: number;
  boca?: number;
  peneira?: boolean;
  jorra?: number;
  molhado?: boolean;
  esponja?: boolean;
  abafado?: boolean;
  estado?: "normal" | "faminto";
}> = ({ x, y, escala, boca = 0, peneira = false, jorra = 0, molhado, esponja, abafado, estado }) => (
  <>
    <SeuKuka x={x} y={y} escala={escala} banguela pose="guardaChuva" boca={boca} molhado={molhado} esponja={esponja} abafado={abafado} suor={abafado} estado={estado} feliz={!estado} />
    <GuardaChuva x={x + 166 * escala} y={y - 691 * escala} escala={0.95 * escala} rot={-15} peneira={peneira} jorra={jorra} cor={peneira ? "#FF8C1A" : "#3D6CC9"} />
  </>
);

/** 1. GANCHO: o Kuka encharcado debaixo do guarda-chuva furado: "Choveu DENTRO do guarda-chuva." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  return (
    <>
      <Tela zoom={lerp(f, 0, 80, 1.15, 1.25)} foco={[540, 900]}>
        <Rua />
        <Chuva intensidade={1.2} />
        <Poca x={560} y={1800} tam={1.6} />
        <KukaGuardaChuva x={480} y={1820} escala={0.95} boca={boca("kuka")} peneira jorra={1} molhado esponja />
      </Tela>
      <Onomatopeia texto="PLOC PLOC" at={4} dur={50} x={540} y={300} tam={100} cor="#BFE6FF" rot={-4} />
      <Sfx at={0} nome="chuva" vol={0.35} />
      <Sfx at={30} nome="chuva" vol={0.3} />
    </>
  );
};

/** 2. O PROBLEMA (P&B): guarda-chuva comum deixa a cabeça ABAFADA, sem ventilação nenhuma! */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const abafada = wordAt(scene, "abafada");
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Tela pb zoom={f >= l1 ? 1.5 : 1.0} foco={[540, 760]} shake={tremor(f, l1, 10, 10)}>
        <Rua />
        <Chuva intensidade={0.8} />
        <KukaGuardaChuva x={460} y={1820} escala={0.95} abafado={f >= abafada} estado="faminto" />
      </Tela>
      {f >= abafada && f < l1 && <Onomatopeia texto="QUE CALOR…" at={abafada} dur={l1 - abafada} x={540} y={300} tam={100} cor="#fff" />}
      {f >= l1 && <Onomatopeia texto="SEM AR?!" at={l1} dur={60} x={540} y={300} tam={120} cor="#fff" />}
      <Sfx at={0} nome="chuva" vol={0.25} />
      <Sfx at={abafada} nome="apito" vol={0.3} />
      <Sfx at={l1} nome="tum" vol={0.45} />
    </>
  );
};

/** 3. A SOLUÇÃO: "Apresento o Guarda-Chuva Peneira!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const gc = wordAt(scene, "guarda-chuva");
  const entra = mola(f, gc, 140, 12);
  return (
    <>
      {f < gc ? (
        <Tela zoom={lerp(f, 0, gc, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <GuardaChuva x={790} y={1440} escala={0.95 * entra} rot={(1 - entra) * 360} peneira cor="#FF8C1A" />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="GUARDA-CHUVA" linha2="PENEIRA" at={gc} y={360} tam={110} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={gc} nome="whoosh" vol={0.5} />
      <Sfx at={gc + 10} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 4. A DEMONSTRAÇÃO: mil furinhos de ventilação… a chuva passa direto. "Banho e passeio ao mesmo tempo!" */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const mil = wordAt(scene, "mil");
  const fim0 = lineEnd(scene, 0);
  const chove = fim0 + 4;
  const l1 = lineStart(scene, 1);
  const banho = wordAt(scene, "banho");
  return (
    <>
      {f < chove ? (
        <Tela zoom={lerp(f, 0, chove, 1.0, 1.15)} foco={[540, 900]}>
          <Rua chuva={false} />
          <GuardaChuva x={540} y={1500} escala={1.3} rot={0} peneira cor="#FF8C1A" />
        </Tela>
      ) : (
        <Tela shake={tremor(f, chove, 12, 12)}>
          <Rua />
          <Chuva intensidade={1.3} />
          <Poca x={560} y={1800} tam={lerp(f, chove, l1 + 40, 0.4, 1.6)} />
          <KukaGuardaChuva x={480} y={1820} escala={0.95} peneira jorra={1} molhado={f >= chove + 6} esponja={f >= chove + 20} boca={boca("kuka")} />
          {f >= l1 && <DoutorOferta x={880} y={1880} escala={0.62} pose="joinha" boca={boca("doutor")} expr="sorriso" />}
        </Tela>
      )}
      {f >= mil && f < chove && <Onomatopeia texto="1000 FURINHOS!" at={mil} dur={chove - mil} x={540} y={420} tam={110} />}
      {f >= chove && f < l1 && <Onomatopeia texto="SPLASH!" at={chove + 2} dur={l1 - chove} x={540} y={360} tam={130} cor="#BFE6FF" />}
      {f >= banho && <Selo texto={"BANHO\nGRÁTIS*"} at={banho} x={680} y={300} cor="#3DA5FF" />}
      <Sfx at={mil} nome="sparkle" vol={0.4} />
      <Sfx at={chove} nome="chuva" vol={0.55} />
      <Sfx at={chove + 30} nome="chuva" vol={0.45} />
      <Sfx at={chove + 2} nome="borbulha" vol={0.4} />
      <Sfx at={banho} nome="ding" vol={0.45} />
    </>
  );
};

/** 5. O DEPOIMENTO: saiu seco, chegou lavado; cabelo virou esponja; economizou chuveiro. */
export const Depoimento: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const lavado = wordAt(scene, "lavado");
  const l1 = lineStart(scene, 1);
  const esponja = wordAt(scene, "esponja");
  const l2 = lineStart(scene, 2);
  const plano = passo(f, [
    [0, "medio"],
    [esponja, "close"],
    [l2, "medio"],
  ] as [number, string][]);
  const torce = f >= esponja + 8 && f < l2;
  return (
    <>
      <Tela shake={tremor(f, lavado, 10, 8)}>
        <Cozinha />
        <Poca x={540} y={1800} tam={1.5} />
        {plano === "medio" && <SeuKuka x={540} y={1790} escala={1.05} banguela molhado esponja={f >= l1} boca={boca("kuka")} pose={f >= l2 ? "joinha" : "parado"} feliz />}
        {plano === "close" && <SeuKuka x={540} y={2550} escala={2.1} banguela molhado esponja boca={boca("kuka")} pose="parado" treme={torce ? 4 : 0} />}
        {plano === "close" && torce && <Fumaca x={540} y={700} cor="#7FD3FF" n={4} />}
      </Tela>
      {f >= lavado && f < l1 && <Onomatopeia texto="LAVADO!" at={lavado} dur={l1 - lavado} x={540} y={420} tam={110} cor="#BFE6FF" />}
      {plano === "close" && <Onomatopeia texto="SQUISH" at={esponja + 6} dur={30} x={540} y={300} tam={110} cor="#fff" />}
      {f >= l2 && <Onomatopeia texto="★★★★★" at={l2 + 4} dur={60} y={560} tam={110} rot={0} />}
      <Selo texto={"DEPOIMENTO\nREAL*"} at={2} x={640} y={260} />
      {plano !== "close" && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 10" at={6} />}
      <Sfx at={2} nome="click" vol={0.4} />
      <Sfx at={lavado} nome="borbulha" vol={0.4} />
      <Sfx at={esponja + 6} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 6. A OFERTA: de 999 por 19,90 + um balde de brinde. O Kuka: "Manda dois!" LIGUE JÁ! */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "1990");
  const agora = wordAt(scene, "agora");
  const balde = wordAt(scene, "balde");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sb = mola(f, balde, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <GuardaChuva x={790} y={1440} escala={0.95} peneira cor="#FF8C1A" />
          {f >= balde && <Balde x={960} y={1460} escala={0.8 * sb} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Cozinha />
          <Poca x={540} y={1800} tam={1.5} />
          <SeuKuka x={540} y={1790} escala={1.05} banguela molhado esponja pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 19,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= balde && f < l2 && <Selo texto={"+ BALDE\nGRÁTIS!"} at={balde + 4} x={40} y={620} cor="#22A447" rot={-8} tam={60} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 12" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={balde} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 7. LETRINHAS + participação do rato (sequinho, com um guarda-chuva NORMAL). */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 32, 46);
  const ratoX = lerp(f, 40, fim, 1250, 760);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={400} y={1240} escala={0.8} />
        <GuardaChuva x={400} y={1230} escala={0.75} peneira cor="#FF8C1A" />
        <Chuva intensidade={0.5} x0={600} />
        <Rato x={ratoX} y={1640} escala={0.75} />
        <GuardaChuva x={ratoX + 60} y={1510} escala={0.45} rot={-8} cor="#3D6CC9" />
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
        *Não usar em dias de chuva. Nem de sol. Balde não segura chuva.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={4} nome="chuva" vol={0.2} />
    </>
  );
};
