import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { CarroFrente, Estudio, GPSPessimista, Lencinho, Pedestal, Rio, Rua, Sala } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 10 — "GPS Pessimista" (formato curto). O GPS fala a "verdade": você vai se atrasar de qualquer jeito.
 * O Kuka desanima e nunca mais sai de casa… logo, nunca mais se perde. O Doutor estreia o topete de galã (sem curativo).
 */

const NUMERO = "0800-NEM-VAI";

/** Kuka dirigindo: corpo atrás do capô do carro. */
const KukaNoCarro: React.FC<{ y?: number; boca?: number; estado?: "normal" | "faminto"; afundando?: number; treme?: number }> = ({ y = 1700, boca = 0, estado = "normal", afundando = 0, treme = 0 }) => (
  <>
    <SeuKuka x={540} y={y + 220 + afundando * 120} escala={0.9} banguela careca estado={estado} pose="parado" boca={boca} treme={treme} />
    <CarroFrente x={540} y={y} escala={1.0} afundando={afundando} />
  </>
);

/** 1. O PROBLEMA (P&B): o GPS comum te manda pro mato… recalculando… e você no meio do rio! */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const rio = wordAt(scene, "rio!");
  return (
    <>
      <Tela pb shake={tremor(f, rio, 20, 10)}>
        <Rua chuva={false} />
        <Rio nivel={lerp(f, l1, rio + 10, 0, 1)} />
        <KukaNoCarro estado="faminto" afundando={lerp(f, l1 + 20, rio + 10, 0, 1)} treme={f >= rio ? 4 : 0} />
      </Tela>
      {f < l1 && f > 20 && <Onomatopeia texto="VIRE NO MATO" at={20} dur={l1 - 20} x={540} y={560} tam={100} cor="#fff" />}
      {f >= l1 && f < rio && <Onomatopeia texto="RECALCULANDO…" at={l1} dur={rio - l1} x={540} y={560} tam={100} cor="#fff" />}
      {f >= rio && <Onomatopeia texto="TCHIBUM!" at={rio} dur={60} x={540} y={560} tam={130} cor="#fff" />}
      <Sfx at={l1} nome="apito" vol={0.3} />
      <Sfx at={rio} nome="borbulha" vol={0.5} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento o GPS Pessimista!" (Doutor de topete novo). */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const gps = wordAt(scene, "gps");
  const entra = mola(f, gps, 140, 12);
  return (
    <>
      {f < gps ? (
        <Tela zoom={lerp(f, 0, gps, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={780} y={1450} />
          <GPSPessimista x={780} y={1300} escala={0.85 * entra} chuva={f >= gps + 20} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="GPS" linha2="PESSIMISTA" at={gps} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={gps} nome="whoosh" vol={0.5} />
      <Sfx at={gps + 20} nome="chuva" vol={0.2} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: "Vire à direita. Ou não. Você vai se atrasar de qualquer jeito." — Kuka: "Então eu nem vou!" */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const casa = wordAt(scene, "casa!");
  return (
    <>
      {f < l2 ? (
        <Tela>
          <Rua chuva={false} />
          <KukaNoCarro boca={0} />
          <GPSPessimista x={820} y={1080} escala={0.6} fala={boca("gps")} chuva={f >= l1} />
          {f < l1 && <DoutorOferta x={220} y={1760} escala={0.7} pose="apontando" boca={boca("doutor")} expr="sorriso" />}
        </Tela>
      ) : f < l3 ? (
        <Tela shake={tremor(f, l2, 12, 8)}>
          <Rua chuva />
          <KukaNoCarro boca={boca("kuka")} estado="faminto" />
          <GPSPessimista x={820} y={1080} escala={0.6} />
        </Tela>
      ) : (
        <Tela zoom={lerp(f, l3, casa, 1.0, 1.05)} foco={[540, 1100]}>
          <Sala />
          <SeuKuka x={560} y={1780} escala={0.95} banguela careca estado="faminto" pose="parado" />
          <DoutorOferta x={220} y={1780} escala={0.72} pose="joinha" boca={boca("doutor")} expr="sorriso" />
        </Tela>
      )}
      {f >= l1 && f < l2 && <Selo texto={"MODO\nREALISTA"} at={l1 + 4} x={60} y={300} cor="#5A5A6E" />}
      {f >= l2 && f < l3 && <Onomatopeia texto="BUÁÁÁ!" at={l2} dur={l3 - l2} x={540} y={520} tam={140} cor="#7fd6ff" />}
      {f >= casa && <Selo texto={"0 VEZES\nPERDIDO*"} at={casa} x={620} y={300} cor="#22A447" />}
      <Sfx at={l1} nome="apito" vol={0.25} />
      <Sfx at={l2} nome="boing" vol={0.35} />
      <Sfx at={casa} nome="tada" vol={0.35} />
    </>
  );
};

/** 4. A OFERTA: 29,90 + lencinho. O Kuka (desanimado): "Manda dois… mas acho que nem chega." */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "2990");
  const agora = wordAt(scene, "agora");
  const len = wordAt(scene, "lencinho");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, len, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <GPSPessimista x={790} y={1300} escala={0.75} />
          {f >= len && <Lencinho x={900} y={1000} escala={0.9 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Sala />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca estado="faminto" pose="telefone" boca={boca("kuka")} />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 29,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= len && f < l2 && <Selo texto={"+ LENCINHO\nDE BRINDE!"} at={len + 4} x={40} y={620} cor="#22A447" rot={-8} tam={58} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 22" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={len} nome="boing" vol={0.45} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: o GPS chorando no pedestal. */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <GPSPessimista x={540} y={1100} escala={0.6} />
      </Tela>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, lineHeight: 0.95 }}>
        <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: `16px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>INUTILIDADES</div>
        <div style={{ fontSize: 170, color: "#FFD23F", WebkitTextStroke: `18px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>0800</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1360, padding: "16px 24px", background: "rgba(0,0,0,.55)", borderRadius: 14, fontFamily: "'Nunito'", fontWeight: 900, fontSize: tam, lineHeight: 1.15, color: "#fff", textAlign: "center" }}>
        *Destino não garantido. Vontade de sair também não. Lencinho de uso único.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={10} nome="chuva" vol={0.2} />
    </>
  );
};
