import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { Bolo, CalendarioDieta, Capsula, CeuAberto, Contagem, Cozinha, Estudio, FrascoPilula, Lustre, Pedestal, Sala, Tijolo } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 5 — "Pílula Pena" (formato curto pedido pelo usuário: sem gancho separado e sem depoimento).
 * Estreia da DONA CLEIDE (voz Raquel). Piada literal: perde TODO o peso… e sai flutuando; o Doutor agarra o pé e sobe junto.
 * Gancho para outro comercial: a PÍLULA CHUMBO.
 */

const NUMERO = "0800-LEVINHA";
/** mãos do Doutor na pose "bracosAbertos" ≈ (±326, -682) no espaço dele */
const MAO_D: [number, number] = [326, -682];

/** 1. O PROBLEMA (P&B): começa a dieta na segunda… desiste na segunda à TARDE. Quer perder peso SEM ESFORÇO? */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const tarde = wordAt(scene, "tarde?");
  const l2 = lineStart(scene, 2);
  const esforco = wordAt(scene, "esforço");
  return (
    <>
      {f < l2 ? (
        <Tela pb shake={tremor(f, tarde, 14, 10)}>
          <Cozinha />
          <CalendarioDieta x={540} y={480} escala={0.95} desiste={f >= tarde} />
          <DonaCleide x={540} y={1860} escala={0.85} pose={f >= l1 ? "boca" : "parado"} expr={f >= l1 ? "feliz" : "triste"} />
          {f >= l1 && <Bolo x={545} y={1860 - 740 * 0.85} escala={0.7} />}
        </Tela>
      ) : (
        <Tela pb>
          <Sala sofa={false} tvX={-400} />
          <DonaCleide x={540} y={2350} escala={1.7} pose="parado" expr={f >= esforco ? "surpresa" : "feliz"} />
        </Tela>
      )}
      {f >= l1 && f < tarde && <Onomatopeia texto="NHAC!" at={l1 + 6} dur={tarde - l1 - 6} x={760} y={1000} tam={100} cor="#fff" />}
      {f >= esforco && <Onomatopeia texto="SEM ESFORÇO?" at={esforco} dur={60} x={540} y={300} tam={110} cor="#FFD23F" />}
      <Sfx at={4} nome="click" vol={0.35} />
      <Sfx at={l1 + 6} nome="pop" vol={0.4} />
      <Sfx at={tarde} nome="tum" vol={0.45} />
      <Sfx at={esforco} nome="ding" vol={0.4} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Seus problemas ACABARAM! Apresento a Pílula Pena!" */
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
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <FrascoPilula x={760} y={1440} escala={0.8 * entra} rot={(1 - entra) * 360} />
          <Capsula x={900} y={1400} escala={0.8 * entra} rot={-20} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="PÍLULA" linha2="PENA" at={pil} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={pil} nome="whoosh" vol={0.5} />
      <Sfx at={pil + 10} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: 5, 4, 3, 2, 1… ela flutua até o lustre; o Doutor segura o pé… e sobe junto. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pil = wordAt(scene, "pílula…");
  const cinco = wordAt(scene, "cinco");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const l4 = lineStart(scene, 4);
  const fimCont = l1 - 4;
  const passoC = Math.max(1, (fimCont - cinco) / 5);
  const n = f >= cinco && f < fimCont ? 5 - Math.floor((f - cinco) / passoC) : 0;
  const sobe = f >= fimCont ? Math.min(1, Math.pow(lerp(f, fimCont, l2, 0, 1), 1.3)) : 0;
  const cy = 1840 - sobe * 880;
  const esc = 0.8;
  // o Doutor entra agarrando o pé dela e é puxado pra cima
  const dSobe = f >= l2 ? lerp(f, l2 + 10, l3, 0, 1) : 0;
  const dX = 540 - MAO_D[0] * 0.72 + 30;
  const dY = cy + 1840 - 1840 + MAO_D[1] * -0.72 + 20 - dSobe * 0;
  return (
    <>
      {f < l3 ? (
        <Tela shake={n > 0 ? tremor(f, cinco, 4, 200) : tremor(f, l2, 10, 8)}>
          <Sala tvX={230} />
          <Lustre x={540} balanca={f >= l1 ? 1 : 0} />
          <DonaCleide
            x={540}
            y={cy}
            escala={esc}
            pose={f >= fimCont ? "bracosPraCima" : f >= pil ? "boca" : "parado"}
            expr={f >= fimCont ? "surpresa" : "feliz"}
            boca={boca("cleide")}
            treme={n > 0 ? 3 : 0}
          />
          {f >= l2 && <DoutorOferta x={dX} y={Math.min(1900, dY + (1 - dSobe) * 260)} escala={0.72} pose="bracosAbertos" expr="chocado" boca={boca("doutor")} />}
          {f >= pil && f < cinco + 6 && <Capsula x={560} y={1840 - 760 * esc} escala={0.45} rot={-30} />}
          <Contagem n={n} />
        </Tela>
      ) : (
        <Tela>
          <CeuAberto subindo={1.2} />
          <DonaCleide x={620} y={1100 + Math.sin(f * 0.12) * 25} escala={0.6} pose="bracosPraCima" expr={f >= l4 ? "feliz" : "surpresa"} boca={boca("cleide")} giro={Math.sin(f * 0.08) * 8} />
          <DoutorOferta x={620 - MAO_D[0] * 0.55 + 20} y={1100 + 760 * 0.55 + Math.sin(f * 0.12) * 25} escala={0.55} pose="bracosAbertos" expr={f >= l4 ? "chocado" : "gritando"} boca={boca("doutor")} />
        </Tela>
      )}
      {f >= l1 && f < l2 && <Onomatopeia texto="FLUTUANDO?!" at={l1} dur={l2 - l1} x={760} y={1120} tam={90} cor="#fff" />}
      {f >= l2 && f < l3 && <Onomatopeia texto="EU SEGURO!" at={l2} dur={l3 - l2} x={780} y={1120} tam={90} cor="#FFD23F" />}
      {f >= l3 && f < l4 && <Selo texto={"ZERO ESFORÇO\nZERO CHÃO*"} at={l3 + 4} x={560} y={300} cor="#22A447" />}
      {f >= l4 && <Onomatopeia texto="SEM BALANÇA!" at={l4} dur={80} x={540} y={300} tam={110} cor="#FFD23F" />}
      <Sfx at={pil} nome="pop" vol={0.5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={cinco + i * passoC} nome="click" vol={0.45} />
      ))}
      <Sfx at={fimCont} nome="riser" vol={0.45} />
      <Sfx at={l2} nome="boing" vol={0.45} />
      <Sfx at={l3} nome="whoosh" vol={0.5} />
      <Sfx at={l4 + 10} nome="tada" vol={0.3} />
    </>
  );
};

/** 4. A OFERTA: 39,90 + TIJOLO de brinde → "Manda DOIS tijolos!" → BUUUM. Pílula CHUMBO no próximo comercial. Kuka: "Manda DOIS!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3990");
  const agora = wordAt(scene, "agora");
  const tij = wordAt(scene, "tijolo");
  const l2 = lineStart(scene, 2);
  const cai = lineEnd(scene, 2) + 2;
  const l3 = lineStart(scene, 3);
  const chumbo = wordAt(scene, "chumbo…");
  const l4 = lineStart(scene, 4);
  const l5 = lineStart(scene, 5);
  const st = mola(f, tij, 160, 10);
  const grita = f >= l5 || (f >= agora && f < agora + 20);
  const queda = lerp(f, cai, cai + 10, 0, 1);
  const naoEstudio = (f >= l2 && f < l3) || (f >= l4 && f < l5);
  return (
    <>
      {!naoEstudio ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l5 ? "#D92B2B" : f >= l3 ? "#3A3A4A" : "#2E6BE6"} raio={f >= l5 ? "#F04A3A" : f >= l3 ? "#4E4E62" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          {f >= l3 && f < l5 ? (
            <FrascoPilula x={790} y={1440} escala={0.8 * mola(f, chumbo, 160, 12)} cor="#7A7F8C" rotulo="CHUMBO" />
          ) : (
            <>
              <FrascoPilula x={760} y={1440} escala={0.8} />
              {f >= tij && <Tijolo x={920} y={1300} escala={0.55 * st} rot={-8} />}
            </>
          )}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : f >= l3 ? "piscando" : "sorriso"} curativo={f >= l3} />
        </Tela>
      ) : f < l3 ? (
        <Tela shake={tremor(f, cai + 10, 40, 16)}>
          <CeuAberto subindo={f >= cai ? -3 : 0.4} />
          <DonaCleide x={540} y={1650 + queda * 900 + Math.sin(f * 0.12) * 30 * (1 - queda)} escala={0.85} pose="bracosPraCima" expr={f >= cai ? "assustada" : "feliz"} boca={boca("cleide")} />
          <Tijolo x={430} y={1650 - 900 * 0.85 + queda * 900} escala={0.4} rot={10} />
          <Tijolo x={660} y={1650 - 900 * 0.85 + queda * 900} escala={0.4} rot={-10} />
        </Tela>
      ) : (
        <Tela>
          <CeuAberto subindo={0.6} />
          <SeuKuka x={540} y={1700 + Math.sin(f * 0.12) * 30} escala={0.9} banguela pose="bracosPraCima" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {f < l2 && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= l5 && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={l5} x={620} y={520} tam={420} />}
      {f >= tij && f < l2 && <Selo texto={"+ TIJOLO\nGRÁTIS!"} at={tij + 4} x={40} y={620} cor="#22A447" rot={-8} tam={60} />}
      {f >= l2 && f < cai && <Terco nome="DONA CLEIDE" sub="cliente nova · direto do céu" at={l2} />}
      {f >= cai && f < l3 && <Onomatopeia texto="BUUUM!" at={cai + 8} dur={l3 - cai - 8} x={540} y={700} tam={150} cor="#FF8C1A" />}
      {f >= chumbo && f < l4 && <Selo texto={"EM BREVE!"} at={chumbo} x={560} y={560} cor="#E8282B" tam={64} />}
      {f >= l4 && f < l5 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 14" at={l4} />}
      {f >= l5 && <LigueJa at={l5} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={tij} nome="tum" vol={0.45} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={cai} nome="whoosh" vol={0.5} />
      <Sfx at={cai + 10} nome="boom" vol={0.6} />
      <Sfx at={chumbo} nome="tum" vol={0.5} />
      <Sfx at={l4} nome="boing" vol={0.4} />
      <Sfx at={l5} nome="alarme" vol={0.25} />
      <Sfx at={l5 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: "Efeitos colaterais: leveza, nuvens no cabelo e multa por voar sem brevê." */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <FrascoPilula x={460} y={1220} escala={0.55} />
        <FrascoPilula x={640} y={1220} escala={0.55} cor="#7A7F8C" rotulo="CHUMBO" />
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
        *Efeitos colaterais: leveza, nuvens no cabelo e multa por voar sem brevê.
      </div>
      <LigueJa at={0} numero={NUMERO} />
    </>
  );
};
