import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { Capsula, CeuAberto, Contagem, Cozinha, Estudio, FrascoPilula, Halter, Pedestal, PratoAlface, Sala, Tijolo } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 5 — "Pílula Pena" (formato NOVO pedido pelo usuário: sem gancho separado e sem depoimento;
 * começa direto no problema). Estreia da DONA CLEIDE. A piada é literal: ela perde TODO o peso… e sai flutuando.
 */

const NUMERO = "0800-LEVINHA";

/** 1. O PROBLEMA (P&B): salada sem graça, academia todo santo dia… quer perder peso SEM ESFORÇO? */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const graca = wordAt(scene, "graça");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const esforco = wordAt(scene, "esforço");
  return (
    <>
      {f < l1 ? (
        <Tela pb zoom={lerp(f, 0, l1, 1.0, 1.1)} foco={[540, 1100]}>
          <Cozinha />
          <rect x={140} y={1460} width={800} height={60} fill="#8B5A2B" stroke={TINTA} strokeWidth={8} />
          <DonaCleide x={540} y={1850} escala={0.9} pose="boca" expr="triste" />
          <path d="M560 1170 L620 1060" stroke="#9AA4B5" strokeWidth={10} strokeLinecap="round" />
          <path d="M600 1080 Q 590 1040 630 1040 Q 660 1050 640 1080 Z" fill="#7CCB5C" stroke={TINTA} strokeWidth={5} />
          <PratoAlface x={540} y={1450} />
        </Tela>
      ) : f < l2 ? (
        <Tela pb shake={tremor(f, l1, 6, 60)}>
          <Sala sofa={false} tvX={-400} />
          <DonaCleide x={540} y={1840} escala={0.9} pose="halter" expr="triste" suor treme={4} />
          <Halter x={540} y={1840 - 806 * 0.9} escala={0.9} />
        </Tela>
      ) : (
        <Tela pb zoom={1.0}>
          <Sala sofa={false} tvX={-400} />
          <DonaCleide x={540} y={2350} escala={1.7} pose="parado" expr={f >= esforco ? "surpresa" : "feliz"} />
        </Tela>
      )}
      {f >= graca && f < l1 && <Onomatopeia texto="BLÉ…" at={graca} dur={l1 - graca} x={540} y={300} tam={120} cor="#fff" />}
      {f >= l1 && f < l2 && <Onomatopeia texto="UFA… UFA…" at={l1 + 4} dur={l2 - l1 - 4} x={540} y={300} tam={110} cor="#fff" />}
      {f >= esforco && <Onomatopeia texto="SEM ESFORÇO?" at={esforco} dur={60} x={540} y={300} tam={110} cor="#FFD23F" />}
      <Sfx at={graca} nome="apito" vol={0.3} />
      <Sfx at={l1} nome="tum" vol={0.4} />
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

/** 3. A DEMONSTRAÇÃO: uma pílula… 5, 4, 3, 2, 1… ela perde TODO o peso e sai FLUTUANDO. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pil = wordAt(scene, "pílula…");
  const cinco = wordAt(scene, "cinco");
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const fimCont = l1 - 4;
  const passoC = Math.max(1, (fimCont - cinco) / 5);
  const n = f >= cinco && f < fimCont ? 5 - Math.floor((f - cinco) / passoC) : 0;
  const sobe = f >= fimCont ? Math.pow(lerp(f, fimCont, l2, 0, 1), 1.4) : 0;
  return (
    <>
      {f < l2 ? (
        <Tela shake={n > 0 ? tremor(f, cinco, 4, 200) : [0, 0]}>
          <Sala tvX={230} />
          <DonaCleide
            x={540}
            y={1840 - sobe * 900}
            escala={0.9}
            pose={f >= fimCont ? "bracosPraCima" : f >= pil ? "boca" : "parado"}
            expr={f >= fimCont ? "surpresa" : "feliz"}
            boca={boca("cleide")}
            treme={n > 0 ? 3 : 0}
            giro={sobe * 10}
          />
          {f >= pil && f < cinco + 6 && <Capsula x={560} y={1840 - 760 * 0.9} escala={0.45} rot={-30} />}
          <Contagem n={n} />
        </Tela>
      ) : (
        <Tela>
          <CeuAberto subindo={1.4} />
          <DonaCleide x={540} y={1500 + Math.sin(f * 0.12) * 30} escala={0.6} pose="bracosPraCima" expr="assustada" giro={Math.sin(f * 0.08) * 20} />
        </Tela>
      )}
      {f >= l1 && f < l2 && <Onomatopeia texto="FLUTUANDO?!" at={l1} dur={l2 - l1} x={540} y={300} tam={120} cor="#fff" />}
      {f >= l2 && <Selo texto={"-100% DO PESO*\nGARANTIDO!"} at={l2 + 4} x={560} y={300} cor="#22A447" />}
      <Sfx at={pil} nome="pop" vol={0.5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={cinco + i * passoC} nome="click" vol={0.45} />
      ))}
      <Sfx at={fimCont} nome="riser" vol={0.45} />
      <Sfx at={l2} nome="whoosh" vol={0.5} />
    </>
  );
};

/** 4. A OFERTA: de 999 por 39,90 + um TIJOLO de brinde pra voltar pro chão. A Cleide (no céu): "Manda DOIS tijolos!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3990");
  const agora = wordAt(scene, "agora");
  const tij = wordAt(scene, "tijolo");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const st = mola(f, tij, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <FrascoPilula x={760} y={1440} escala={0.8} />
          {f >= tij && <Tijolo x={920} y={1300} escala={0.55 * st} rot={-8} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <CeuAberto subindo={0.4} />
          <DonaCleide x={540} y={1650 + Math.sin(f * 0.12) * 30} escala={0.85} pose="bracosPraCima" expr="feliz" boca={boca("cleide")} giro={Math.sin(f * 0.1) * 8} />
          <rect x={540 + 110} y={1650 - 860} width={46} height={100} rx={10} fill="#333" stroke={TINTA} strokeWidth={6} />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= tij && f < l2 && <Selo texto={"+ TIJOLO\nGRÁTIS!"} at={tij + 4} x={40} y={620} cor="#22A447" rot={-8} tam={60} />}
      {f >= l2 && f < l3 && <Terco nome="DONA CLEIDE" sub="cliente nova · direto do céu" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={tij} nome="tum" vol={0.5} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS + participação do Seu Kuka (que também tomou… e passa flutuando). */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  const ky = lerp(f, 30, fim + 20, 2100, -300);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <FrascoPilula x={540} y={1220} escala={0.6} />
        <SeuKuka x={900} y={ky} escala={0.4} banguela pose="bracosPraCima" feliz />
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
        *Não tomar perto de ventiladores. Não nos responsabilizamos por clientes em órbita.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={30} nome="whoosh" vol={0.35} />
    </>
  );
};
