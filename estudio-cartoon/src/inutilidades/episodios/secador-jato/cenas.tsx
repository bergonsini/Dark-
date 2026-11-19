import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { Banheiro, BlackPowerVoando, CapacetePiloto, CeuAberto, Estudio, LinhasVelocidade, Pedestal, RelogioParede, Rua, SecadorComum, SecadorJato } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 6 — "Secador a Jato" (formato curto). Seca em 1 segundo… e a Dona Cleide decola com o
 * cabelo de cometa; o vento arranca o black power do Seu Kuka.
 */

const NUMERO = "0800-DECOLA";

/** 1. O PROBLEMA (P&B): esperar o cabelo secar, 20 minutos, braço cansado… e atrasada! */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const atras = wordAt(scene, "atrasada!");
  const min = Math.min(20, Math.floor(lerp(f, 0, atras, 0, 20)));
  const e = 0.85;
  const treme = f >= l1 ? 5 : 0;
  return (
    <>
      <Tela pb shake={tremor(f, atras, 16, 12)}>
        <Banheiro />
        <RelogioParede x={300} y={330} texto={`0:${String(min).padStart(2, "0")}`} />
        <DonaCleide x={600} y={1840} escala={e} pose="parado" expr="triste" molhada suor={f >= l1} treme={treme} />
        <SecadorComum x={600 - 360 * e} y={1840 - 820 * e} escala={0.8} />
      </Tela>
      {f >= l1 && f < atras && <Onomatopeia texto="BRAÇO CANSADO…" at={l1} dur={atras - l1} x={540} y={560} tam={96} cor="#fff" />}
      {f >= atras && <Onomatopeia texto="ATRASADA!" at={atras} dur={60} x={540} y={560} tam={130} cor="#fff" />}
      <Sfx at={4} nome="ronco" vol={0.3} />
      <Sfx at={l1} nome="apito" vol={0.3} />
      <Sfx at={atras} nome="alarme" vol={0.3} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento o Secador a Jato!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const sec = wordAt(scene, "secador");
  const entra = mola(f, sec, 140, 12);
  return (
    <>
      {f < sec ? (
        <Tela zoom={lerp(f, 0, sec, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <SecadorJato x={760} y={1250} escala={0.7 * entra} rot={(1 - entra) * 360} ligado={f >= sec + 30 ? 1 : 0} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="SECADOR" linha2="A JATO" at={sec} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={sec} nome="whoosh" vol={0.5} />
      <Sfx at={sec + 30} nome="motor" vol={0.35} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: seca em UM segundo… VRUUUSH! Ela decola; o black power do Kuka voa. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const um = wordAt(scene, "um");
  const liga = lineEnd(scene, 0) + 4;
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const e = 0.85;
  const sai = lerp(f, liga + 6, l1 - 2, 0, 1);
  return (
    <>
      {f < l1 ? (
        <Tela shake={tremor(f, liga, 34, 30)}>
          <Banheiro bagunca={f >= liga ? 1 : 0} />
          <g transform={`translate(${sai * 900} ${-sai * 1300})`}>
            <DonaCleide x={600} y={1840} escala={e} pose={f >= liga ? "bracosPraCima" : "parado"} expr={f >= liga ? "assustada" : "feliz"} molhada={f < liga + 4} cometa={f >= liga + 2} giro={sai * 40} />
            <SecadorJato x={600 - 420 * e} y={1840 - 760 * e} escala={0.55} ligado={f >= liga ? 1 : 0} />
          </g>
          {f >= liga && <LinhasVelocidade />}
        </Tela>
      ) : f < l2 ? (
        <Tela>
          <CeuAberto subindo={0.3} />
          <g transform="rotate(90 540 960)">
            <LinhasVelocidade />
          </g>
          <DonaCleide x={620} y={1250 + Math.sin(f * 0.2) * 20} escala={0.7} pose="bracosPraCima" expr="feliz" boca={boca("cleide")} cometa giro={-75} />
          <SecadorJato x={330} y={980} escala={0.45} rot={-10} ligado={1} />
        </Tela>
      ) : f < l3 ? (
        <Tela shake={tremor(f, l2, 18, 12)}>
          <Rua chuva={false} />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca estado="faminto" pose="bracosPraCima" boca={boca("kuka")} />
          <BlackPowerVoando x={lerp(f, l2, l3 + 10, 560, 1300)} y={lerp(f, l2, l3 + 10, 900, 200)} escala={0.8} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.0} pose="joinha" boca={boca("doutor")} expr="sorriso" curativo />
        </Tela>
      )}
      {f >= um && f < liga && <Onomatopeia texto="1 SEGUNDO!" at={um} dur={liga - um} x={540} y={420} tam={110} />}
      {f >= liga && f < l1 && <Onomatopeia texto="VRUUUSH!" at={liga} dur={l1 - liga} x={540} y={420} tam={140} cor="#FF8C1A" />}
      {f >= l1 && f < l2 && <Onomatopeia texto="SEQUINHO!" at={l1 + 30} dur={l2 - l1 - 30} x={540} y={420} tam={110} cor="#FFD23F" />}
      {f >= l2 && f < l3 && <Onomatopeia texto="FUUUIII…" at={l2} dur={l3 - l2} x={540} y={420} tam={110} cor="#fff" />}
      {f >= l3 && <Selo texto={"SECO EM 1s*\nAERODINÂMICO"} at={l3 + 4} x={600} y={300} cor="#22A447" />}
      <Sfx at={um} nome="ding" vol={0.4} />
      <Sfx at={liga} nome="motor" vol={0.6} />
      <Sfx at={liga + 6} nome="whoosh" vol={0.6} />
      <Sfx at={l2} nome="whoosh" vol={0.5} />
      <Sfx at={l3} nome="tada" vol={0.35} />
    </>
  );
};

/** 4. A OFERTA: 59,90 + capacete de piloto. A Cleide (voando): "Manda dois… e um PARAQUEDAS!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "5990");
  const agora = wordAt(scene, "agora");
  const cap = wordAt(scene, "capacete");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, cap, 160, 10);
  const cy = 1400 + Math.sin(f * 0.15) * 20;
  const ce = 0.75;
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <SecadorJato x={760} y={1250} escala={0.7} ligado={1} />
          {f >= cap && <CapacetePiloto x={900} y={1100} escala={0.7 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <CeuAberto subindo={0.4} />
          <DonaCleide x={540} y={cy} escala={ce} pose="bracosPraCima" expr="feliz" boca={boca("cleide")} cometa />
          <CapacetePiloto x={540 - 60 * ce} y={cy - 930 * ce} escala={0.9 * ce} />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 59,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= cap && f < l2 && <Selo texto={"+ CAPACETE\nDE PILOTO!"} at={cap + 4} x={40} y={620} cor="#22A447" rot={-8} tam={58} />}
      {f >= l2 && f < l3 && <Terco nome="DONA CLEIDE" sub="cliente · em altitude de cruzeiro" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={cap} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="whoosh" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS + o black power do Kuka passando no céu. */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <SecadorJato x={520} y={1080} escala={0.55} ligado={1} />
        <BlackPowerVoando x={lerp(f, 20, fim, -200, 1300)} y={760} escala={0.5} />
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
        *Não usar em ambientes fechados. Nem abertos. Cabelo não incluso.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={20} nome="whoosh" vol={0.35} />
    </>
  );
};
