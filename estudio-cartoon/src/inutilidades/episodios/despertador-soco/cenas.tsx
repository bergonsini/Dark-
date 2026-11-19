import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { CamaCabeceira, CamaFrente, CriadoMudo, Despertador, Estudio, Pedestal, Quarto, Rua, TravesseiroCapacete, Zzz } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 7 — "Despertador com Soco" (formato curto). Tocou? POW! O Seu Kuka acorda… no quintal do
 * vizinho. E no modo soneca é soco DUPLO: quem leva é o Doutor Oferta.
 */

const NUMERO = "0800-POW-POW";
const KE = 0.8; // escala do Kuka na cama

/** Kuka dormindo na cama, com o despertador no criado-mudo. */
const CamaComKuka: React.FC<{ tocando?: boolean; soco?: number; voo?: number; dormindo?: boolean; noite?: boolean; zzz?: boolean; texto?: string }> = ({
  tocando = false,
  soco = 0,
  voo = 0,
  dormindo = true,
  noite = true,
  zzz = true,
  texto = "6:00",
}) => (
  <>
    <Quarto noite={noite} janelaQuebrada={voo >= 0.6} />
    <CamaCabeceira />
    {voo < 0.98 && (
      <g transform={`translate(${voo * 400} ${-voo * 700}) rotate(${voo * 220} 420 1130) translate(420 1130) scale(${1 - voo * 0.6}) translate(-420 -1130)`}>
        <SeuKuka x={420} y={1746} escala={KE} banguela careca dormindo={dormindo && voo === 0} galos={voo > 0} />
      </g>
    )}
    <CamaFrente />
    <CriadoMudo x={890} y={1360} escala={0.9} />
    <Despertador x={880} y={1250} escala={0.5} flip tocando={tocando} soco={soco} texto={texto} />
    {zzz && dormindo && voo === 0 && <Zzz x={520} y={960} />}
  </>
);

/** 1. O PROBLEMA (P&B): o despertador toca, toca… SONECA x15, e ele nem se mexe. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const grita = wordAt(scene, "grita…");
  const n = Math.min(15, 1 + Math.floor(lerp(f, 0, l1 - 6, 0, 15)));
  const toca = f >= grita;
  return (
    <>
      <Tela pb shake={tremor(f, grita, 30, 8)} zoom={lerp(f, 0, scene.endFrame - scene.startFrame, 1.0, 1.08)} foco={[600, 1150]}>
        <CamaComKuka tocando={toca || (f < l1 && f % 14 < 7)} texto={`6:${String(Math.min(59, n * 4)).padStart(2, "0")}`} />
      </Tela>
      {f < l1 && <Onomatopeia texto={`SONECA x${n}`} at={0} dur={l1} x={540} y={430} tam={110} cor="#fff" />}
      {toca && <Onomatopeia texto="TRIIIIIM!" at={grita} dur={60} x={540} y={430} tam={140} cor="#fff" />}
      {toca && f >= grita + 40 && <Onomatopeia texto="…NEM SE MEXE" at={grita + 40} dur={80} x={540} y={600} tam={80} cor="#fff" />}
      <Sfx at={4} nome="alarme" vol={0.2} />
      <Sfx at={l1 - 20} nome="ronco" vol={0.35} />
      <Sfx at={grita} nome="alarme" vol={0.35} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento o Despertador com Soco!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const desp = wordAt(scene, "despertador");
  const soco = wordAt(scene, "soco!");
  const entra = mola(f, desp, 140, 12);
  const s = f >= soco ? Math.max(0, Math.sin(((f - soco) / 10) * Math.PI)) : 0;
  return (
    <>
      {f < desp ? (
        <Tela zoom={lerp(f, 0, desp, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela shake={tremor(f, soco, 10, 10)}>
          <Estudio />
          <Pedestal x={760} y={1450} />
          <Despertador x={700} y={1240} escala={0.6 * entra} rot={(1 - entra) * 360} flip soco={(f - soco) % 20 < 10 ? s : 0} tocando={f >= soco} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="DESPERTADOR" linha2="COM SOCO" at={desp} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={desp} nome="whoosh" vol={0.5} />
      <Sfx at={soco} nome="boom" vol={0.4} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: Tocou? POW! Kuka sai pela janela… "no quintal do vizinho!". Modo soneca: soco DUPLO no Doutor. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const dur = scene.endFrame - scene.startFrame;
  const pow = lineEnd(scene, 0) + 2;
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const pow2 = lineEnd(scene, 2) + 2;
  const soco = f >= pow ? Math.min(1.25, (f - pow) / 3) * (f < pow + 14 ? 1 : lerp(f, pow + 14, pow + 22, 1, 0)) : 0;
  const voo = lerp(f, pow + 3, l1 - 4, 0, 1);
  const soco2 = f >= pow2 ? Math.min(1, (f - pow2) / 3) : 0;
  const ej = lerp(f, pow2 + 3, dur, 0, 1);
  return (
    <>
      {f < l1 ? (
        <Tela shake={tremor(f, pow, 24, 26)}>
          <CamaComKuka tocando soco={soco} voo={voo} noite={false} />
        </Tela>
      ) : f < l2 ? (
        <Tela shake={tremor(f, l1, 14, 12)}>
          <Rua chuva={false} />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca galos pose="bracosPraCima" boca={boca("kuka")} />
        </Tela>
      ) : (
        <Tela shake={tremor(f, pow2, 24, 26)}>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <Despertador x={760} y={1240} escala={0.6} flip duplo tocando={f >= pow2 - 10} soco={soco2} texto="ZZZ" />
          <g transform={`translate(${-ej * 900} ${-ej * 500})`}>
            <DoutorOferta x={300} y={1740} escala={0.84} pose={f >= pow2 ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={f >= pow2 ? "chocado" : "sorriso"} curativo giro={-ej * 300} />
          </g>
        </Tela>
      )}
      {f >= pow && f < l1 && <Onomatopeia texto="POW!" at={pow} dur={l1 - pow} x={540} y={430} tam={200} cor="#E8282B" />}
      {f >= l1 && f < l2 && <Terco nome="SEU KUKA BELUDO" sub="acordadíssimo · quintal do vizinho" at={l1} />}
      {f >= l2 && f < pow2 && <Selo texto={"MODO\nSONECA"} at={l2 + 4} x={600} y={300} cor="#9A62F5" />}
      {f >= pow2 && <Onomatopeia texto="POW! POW!" at={pow2} dur={dur - pow2} x={540} y={430} tam={160} cor="#E8282B" />}
      <Sfx at={2} nome="alarme" vol={0.3} />
      <Sfx at={pow} nome="boom" vol={0.55} />
      <Sfx at={pow + 4} nome="whoosh" vol={0.5} />
      <Sfx at={l1} nome="boing" vol={0.45} />
      <Sfx at={pow2} nome="boom" vol={0.5} />
      <Sfx at={pow2 + 5} nome="boom" vol={0.4} />
      <Sfx at={pow2 + 8} nome="whoosh" vol={0.45} />
    </>
  );
};

/** 4. A OFERTA: 34,90 + travesseiro de capacete. O Kuka: "Manda dois… um é pra segunda-feira!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3490");
  const agora = wordAt(scene, "agora");
  const trav = wordAt(scene, "travesseiro");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, trav, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <Despertador x={760} y={1240} escala={0.6} flip tocando={f >= l3} />
          {f >= trav && <TravesseiroCapacete x={880} y={1010} escala={0.7 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Quarto janelaQuebrada />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca galos pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 34,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= trav && f < l2 && <Selo texto={"+ TRAVESSEIRO\nDE CAPACETE!"} at={trav + 4} x={40} y={620} cor="#22A447" rot={-8} tam={54} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 16" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={trav} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="whoosh" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: o despertador socando o ar sem parar (não tem botão de desligar). */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  const s = Math.max(0, Math.sin(f * 0.35));
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <Despertador x={430} y={1080} escala={0.45} tocando soco={s} />
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
        *Não tem botão de desligar. Nem de soneca. Dentes não inclusos.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={10} nome="alarme" vol={0.2} />
    </>
  );
};
