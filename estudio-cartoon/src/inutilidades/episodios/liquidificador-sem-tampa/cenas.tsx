import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { CapaChuva, Cozinha, Estudio, LiquidificadorProMax, LiquidificadorVelho, Manchas, Mesa, Pedestal } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 8 — "Liquidificador Sem Tampa Pro Max" (formato curto). Tritura em 1 segundo… e a vitamina
 * vai parar no teto, nas paredes e no Seu Kuka. "Vitamina distribuída por igual!"
 */

const NUMERO = "0800-SPLASH";
const MX = 720; // mesa / liquidificador
const MY = 1380;

/** 1. O PROBLEMA (P&B): o liquidificador velho gira, gira… e o morango continua INTEIRO. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const inteiro = wordAt(scene, "inteiro!");
  return (
    <>
      <Tela pb shake={tremor(f, inteiro, 14, 10)} zoom={f >= l1 ? 1.12 : 1.0} foco={[MX, 1150]}>
        <Cozinha />
        <Mesa x={MX} y={MY} escala={0.8} />
        <LiquidificadorVelho x={MX} y={MY} escala={0.9} ligado />
        <DonaCleide x={290} y={1860} escala={0.8} pose={f >= l1 ? "bracosPraCima" : "parado"} expr="triste" suor={f >= l1} />
      </Tela>
      {f >= l1 && f < inteiro && <Onomatopeia texto="VRRR… VRRR…" at={l1} dur={inteiro - l1} x={540} y={560} tam={96} cor="#fff" />}
      {f >= inteiro && <Onomatopeia texto="INTEIRO!" at={inteiro} dur={60} x={540} y={560} tam={130} cor="#fff" />}
      <Sfx at={4} nome="motor" vol={0.25} />
      <Sfx at={l1} nome="motor" vol={0.25} />
      <Sfx at={inteiro} nome="tum" vol={0.4} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento o Liquidificador Sem Tampa Pro Max!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const liq = wordAt(scene, "liquidificador");
  const entra = mola(f, liq, 140, 12);
  return (
    <>
      {f < liq ? (
        <Tela zoom={lerp(f, 0, liq, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={780} y={1450} />
          <LiquidificadorProMax x={780} y={1440} escala={0.75 * entra} rot={(1 - entra) * 360} ligado={f >= liq + 30} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="LIQUIDIFICADOR" linha2="SEM TAMPA PRO MAX" at={liq} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={liq} nome="whoosh" vol={0.5} />
      <Sfx at={liq + 30} nome="motor" vol={0.35} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: tritura em UM segundo… SPLASH! Vitamina no teto, na Cleide e no Kuka. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const um = wordAt(scene, "um");
  const liga = lineEnd(scene, 0) + 4;
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const jato = lerp(f, liga, liga + 10, 0, 1);
  const sujeira = lerp(f, liga + 4, l1 - 2, 0, 1);
  return (
    <>
      {f < l1 ? (
        <Tela shake={tremor(f, liga, 30, 26)}>
          <Cozinha />
          <Mesa x={MX} y={MY} escala={0.8} />
          <LiquidificadorProMax x={MX} y={MY} escala={0.75} ligado={f >= liga} jato={jato} />
          <DonaCleide x={290} y={1860} escala={0.8} pose={f >= liga ? "bracosPraCima" : "parado"} expr={f >= liga ? "assustada" : "feliz"} />
          <Manchas k={sujeira} />
        </Tela>
      ) : f < l2 ? (
        <Tela>
          <Cozinha />
          <Mesa x={MX} y={MY} escala={0.8} />
          <LiquidificadorProMax x={MX} y={MY} escala={0.75} jato={1} />
          <DonaCleide x={420} y={1860} escala={0.85} pose="parado" expr="surpresa" boca={boca("cleide")} />
          <Manchas k={1} />
        </Tela>
      ) : f < l3 ? (
        <Tela zoom={1.05} foco={[540, 1000]}>
          <Cozinha />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca galos={false} pose="bracosPraCima" boca={boca("kuka")} feliz />
          <Manchas k={1} seed={3} />
          <Manchas k={0.6} seed={7} area={[300, 700, 480, 900]} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.0} pose="joinha" boca={boca("doutor")} expr="sorriso" curativo />
          <Manchas k={0.45} seed={11} />
        </Tela>
      )}
      {f >= um && f < liga && <Onomatopeia texto="1 SEGUNDO!" at={um} dur={liga - um} x={540} y={420} tam={110} />}
      {f >= liga && f < l1 && <Onomatopeia texto="SPLASH!" at={liga} dur={l1 - liga} x={540} y={420} tam={170} cor="#FF8C1A" />}
      {f >= l2 && f < l3 && <Onomatopeia texto="SLURP!" at={l2 + 30} dur={l3 - l2 - 30} x={540} y={420} tam={120} cor="#FFD23F" />}
      {f >= l3 && <Selo texto={"VITAMINA\nPOR IGUAL*"} at={l3 + 4} x={600} y={300} cor="#22A447" />}
      <Sfx at={um} nome="ding" vol={0.4} />
      <Sfx at={liga} nome="motor" vol={0.6} />
      <Sfx at={liga + 4} nome="boom" vol={0.45} />
      <Sfx at={liga + 8} nome="borbulha" vol={0.55} />
      <Sfx at={l2 + 30} nome="borbulha" vol={0.35} />
      <Sfx at={l3} nome="tada" vol={0.35} />
    </>
  );
};

/** 4. A OFERTA: 44,90 + capa de chuva. O Kuka (laranja): "Manda dois… e um canudo bem comprido!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "4490");
  const agora = wordAt(scene, "agora");
  const capa = wordAt(scene, "capa");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, capa, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <LiquidificadorProMax x={790} y={1440} escala={0.7} ligado={f >= l3} />
          {f >= capa && <CapaChuva x={900} y={1000} escala={0.8 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Cozinha />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca pose="telefone" boca={boca("kuka")} feliz />
          <Manchas k={1} seed={3} />
          <Manchas k={0.6} seed={7} area={[300, 700, 480, 900]} />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 44,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= capa && f < l2 && <Selo texto={"+ CAPA\nDE CHUVA!"} at={capa + 4} x={40} y={620} cor="#22A447" rot={-8} tam={58} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 18" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={capa} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="whoosh" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: o Pro Max soltando jato sem parar. */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <LiquidificadorProMax x={540} y={1230} escala={0.55} ligado jato={0.5 + Math.sin(f * 0.2) * 0.1} />
        <Manchas k={lerp(f, 0, fim, 0.1, 0.6)} seed={21} area={[0, 600, 1080, 700]} />
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
        *Tampa vendida separadamente. Teto não incluso. Lave a casa após o uso.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={10} nome="borbulha" vol={0.3} />
    </>
  );
};
