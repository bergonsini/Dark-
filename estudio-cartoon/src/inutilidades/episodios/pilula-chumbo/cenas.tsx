import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { Chapeu, Estudio, FrascoPilula, Fumaca, GuardaChuva, Mesa, Pedestal, PredioCorte, Rua, Sala, Vento } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 6 — "Pílula Chumbo" (anunciada no fim da Pílula Pena). Formato curto: problema → produto →
 * demonstração → oferta → letrinhas. A Dona Cleide fica tão pesada que atravessa o chão… e cai na casa do Seu Kuka.
 */

const NUMERO = "0800-AFUNDA";
const CINZA = "#7A7F8C";

/** 1. O PROBLEMA (P&B): o vento leva o chapéu, o guarda-chuva… e VOCÊ. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const gc = wordAt(scene, "guarda-chuva…");
  const voce = wordAt(scene, "você?!");
  const voa = lerp(f, voce, voce + 24);
  return (
    <>
      <Tela pb shake={tremor(f, voce, 12, 14)}>
        <Rua chuva={false} />
        <Vento forca={1} />
        <Chapeu x={lerp(f, 4, l1 + 20, 540, 1300)} y={lerp(f, 4, l1 + 20, 1840 - 1010 * 0.85, 400)} escala={0.85} rot={f * 6} />
        {f >= gc - 4 && <GuardaChuva x={lerp(f, gc - 4, gc + 30, 700, 1400)} y={lerp(f, gc - 4, gc + 30, 1500, 700)} escala={0.6} rot={f * 9} cor="#3D6CC9" />}
        <DonaCleide x={540 + voa * 900} y={1840 - voa * 900} escala={0.85} pose={f >= voce ? "bracosPraCima" : "parado"} expr={f >= voce ? "assustada" : "triste"} giro={voa * 60} treme={f < voce ? 3 : 0} />
      </Tela>
      {f >= l1 && f < voce && <Onomatopeia texto="FUUUU…" at={l1} dur={voce - l1} x={540} y={300} tam={110} cor="#fff" />}
      {f >= voce && <Onomatopeia texto="SOCORRO!" at={voce} dur={60} x={540} y={300} tam={120} cor="#fff" />}
      <Sfx at={4} nome="whoosh" vol={0.45} />
      <Sfx at={gc} nome="whoosh" vol={0.45} />
      <Sfx at={voce} nome="boing" vol={0.5} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento a Pílula Chumbo!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const pil = wordAt(scene, "pílula");
  const entra = mola(f, pil, 140, 12);
  return (
    <>
      {f < pil ? (
        <Tela zoom={lerp(f, 0, pil, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela shake={tremor(f, pil + 8, 20, 10)}>
          <Estudio cor="#3A3A4A" raio="#4E4E62" />
          <Pedestal x={790} y={1450} />
          <FrascoPilula x={790} y={1440} escala={0.85 * entra} rot={(1 - entra) * 360} cor={CINZA} rotulo="CHUMBO" />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" curativo />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="PÍLULA" linha2="CHUMBO" at={pil} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={pil} nome="whoosh" vol={0.5} />
      <Sfx at={pil + 8} nome="tum" vol={0.55} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: firme como uma rocha… CRACK… atravessa o chão e cai na casa do Seu Kuka (que está almoçando). */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pil = wordAt(scene, "pílula…");
  const rocha = wordAt(scene, "rocha!");
  const cai = lineEnd(scene, 0) + 6;
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const desce = lerp(f, cai, cai + 10, 0, 1);
  const cy = 900 + desce * 900;
  return (
    <>
      <Tela zoom={f < cai ? 1.55 : f < l3 ? 1.4 : 1.0} foco={f < cai ? [540, 520] : f < l3 ? [540, 1420] : [540, 960]} shake={tremor(f, cai + 10, 40, 18)}>
        <PredioCorte racha={lerp(f, rocha, rocha + 10)} buraco={f >= cai} />
        <Mesa x={720} y={1640} escala={0.75} comido={0.3} />
        <SeuKuka x={860} y={1800} escala={0.6} banguela pose="parado" boca={boca("kuka")} feliz={f >= l2} estado={f >= cai && f < l2 ? "faminto" : "normal"} />
        <DonaCleide
          x={500}
          y={cy}
          escala={0.62}
          pose={f >= cai ? "bracosPraCima" : f >= pil ? "boca" : "parado"}
          expr={f >= cai ? "surpresa" : "feliz"}
          boca={boca("cleide")}
          treme={f >= rocha && f < cai ? 4 : 0}
        />
        {f >= cai + 10 && <Fumaca x={540} y={1760} cor="#BDBDBD" n={4} />}
        {f >= l3 && <DoutorOferta x={250} y={900} escala={0.55} pose="joinha" boca={boca("doutor")} expr="sorriso" curativo />}
      </Tela>
      {f >= rocha && f < cai && <Onomatopeia texto="CRACK…" at={rocha + 4} dur={cai - rocha - 4} x={540} y={300} tam={120} cor="#fff" />}
      {f >= cai && f < l1 && <Onomatopeia texto="BUUUM!" at={cai + 8} dur={l1 - cai - 8} x={540} y={300} tam={150} cor="#FF8C1A" />}
      {f >= l3 && <Selo texto={"FIRMEZA\n100%*"} at={l3 + 4} x={680} y={300} cor="#22A447" />}
      <Sfx at={pil} nome="pop" vol={0.45} />
      <Sfx at={rocha + 4} nome="click" vol={0.5} />
      <Sfx at={cai} nome="whoosh" vol={0.5} />
      <Sfx at={cai + 10} nome="boom" vol={0.6} />
      <Sfx at={l2} nome="ding" vol={0.3} />
      <Sfx at={l3 + 4} nome="tada" vol={0.35} />
    </>
  );
};

/** 4. A OFERTA: 39,90 + uma Pílula PENA pra equilibrar… ela toma as duas e fica presa no ar. Kuka: "Manda DUAS!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3990");
  const agora = wordAt(scene, "agora");
  const pena = wordAt(scene, "pena");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const l4 = lineStart(scene, 4);
  const grita = f >= l4 || (f >= agora && f < agora + 20);
  const sp = mola(f, pena, 160, 10);
  return (
    <>
      {f < l2 || f >= l4 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l4 ? "#D92B2B" : "#2E6BE6"} raio={f >= l4 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <FrascoPilula x={720} y={1440} escala={0.75} cor={CINZA} rotulo="CHUMBO" />
          {f >= pena && <FrascoPilula x={880} y={1440} escala={0.6 * sp} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : f < l3 ? (
        <Tela>
          <Sala tvX={230} />
          <DonaCleide x={540} y={1350 + Math.sin(f * 0.15) * 14} escala={0.8} pose="parado" expr="triste" boca={boca("cleide")} />
        </Tela>
      ) : (
        <Tela>
          <PredioCorte buraco />
          <SeuKuka x={720} y={1800} escala={0.75} banguela pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l4) && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= pena && f < l2 && <Selo texto={"+ PÍLULA PENA\nGRÁTIS!"} at={pena + 4} x={40} y={620} cor="#22A447" rot={-8} tam={56} />}
      {f >= l2 && f < l3 && <Onomatopeia texto="NEM SOBE, NEM DESCE" at={l2 + 6} dur={l3 - l2 - 6} x={540} y={420} tam={90} cor="#FFD23F" />}
      {f >= l3 && f < l4 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 16" at={l3} />}
      {f >= l4 && <LigueJa at={l4} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={pena} nome="sparkle" vol={0.45} />
      <Sfx at={l2} nome="apito" vol={0.3} />
      <Sfx at={l3} nome="click" vol={0.35} />
      <Sfx at={l4} nome="alarme" vol={0.25} />
      <Sfx at={l4 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: "Não tomar no segundo andar. O vizinho de baixo agradece." */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <FrascoPilula x={460} y={1220} escala={0.55} cor={CINZA} rotulo="CHUMBO" />
        <FrascoPilula x={640} y={1220} escala={0.55} />
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
        *Não tomar no segundo andar. O vizinho de baixo agradece.
      </div>
      <LigueJa at={0} numero={NUMERO} />
    </>
  );
};
