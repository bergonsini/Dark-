import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { BrocaNaParede, Chamas, Estudio, Extintor, FoneExtremo, JatoBombeiro, Pedestal, RelogioParede, Sala } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 9 — "Fone Antirruído Extremo" (formato curto). Silêncio TOTAL: o Kuka não ouve a furadeira…
 * nem a Dona Cleide avisando do incêndio (a fala dela fica MUDA no vídeo), nem os bombeiros.
 */

const NUMERO = "0800-SHHHH";
const KX = 470;
const KY = 1800;
const KE = 1.0;
/** Fone na cabeça do Kuka. */
const FoneNoKuka: React.FC<{ x?: number; y?: number; e?: number; ligado?: boolean }> = ({ x = KX, y = KY, e = KE, ligado = true }) => (
  <FoneExtremo x={x} y={y - 900 * e} escala={0.95 * e} ligado={ligado} />
);

/** 1. O PROBLEMA (P&B): o vizinho furando a parede todo domingo… às 7 da manhã! */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const furando = wordAt(scene, "furando");
  const l1 = lineStart(scene, 1);
  return (
    <>
      <Tela pb shake={tremor(f, furando, 200, 10)}>
        <Sala sofa={false} tvX={-400} />
        <RelogioParede x={760} y={330} texto={f >= l1 ? "07:00" : "06:59"} />
        <BrocaNaParede x={1060} y={1000} escala={1.4} liga={f >= furando - 8} />
        <SeuKuka x={KX} y={KY} escala={KE} banguela careca estado="faminto" pose="bracosPraCima" arrepiado treme={6} />
      </Tela>
      {f >= furando - 8 && <Onomatopeia texto="BRRRRRR!" at={furando - 8} dur={l1 - furando + 8} x={540} y={560} tam={130} cor="#fff" />}
      {f >= l1 && <Onomatopeia texto="DOMINGO, 7H!" at={l1} dur={60} x={540} y={560} tam={110} cor="#fff" />}
      <Sfx at={furando - 8} nome="motor" vol={0.45} />
      <Sfx at={l1} nome="motor" vol={0.45} />
      <Sfx at={l1 + 20} nome="alarme" vol={0.25} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento o Fone Antirruído Extremo!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const fone = wordAt(scene, "fone");
  const entra = mola(f, fone, 140, 12);
  return (
    <>
      {f < fone ? (
        <Tela zoom={lerp(f, 0, fone, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={780} y={1450} />
          <FoneExtremo x={780} y={1280} escala={0.75 * entra} rot={(1 - entra) * 360} ligado={f >= fone + 30} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" curativo />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="FONE ANTIRRUÍDO" linha2="EXTREMO" at={fone} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={fone} nome="whoosh" vol={0.5} />
      <Sfx at={fone + 30} nome="sparkle" vol={0.35} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: silêncio total… a Cleide avisa do fogo (SEM SOM!), o Kuka em paz, e nem os bombeiros ele ouve. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const sil = wordAt(scene, "silêncio");
  const liga = lineEnd(scene, 0) + 2;
  const l1 = lineStart(scene, 1);
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const bomb = wordAt(scene, "bombeiros!");
  const fogo = f >= l1 - 6;
  return (
    <>
      <Tela shake={tremor(f, bomb, 14, 12)}>
        <Sala sofa={false} tvX={-400} />
        <BrocaNaParede x={1060} y={1000} escala={1.4} liga={f < sil} />
        {fogo && <Chamas x={160} y={1460} escala={1.0} n={4} />}
        {fogo && <Chamas x={980} y={1460} escala={0.8} n={3} />}
        <SeuKuka x={KX} y={KY} escala={KE} banguela careca pose={f >= l2 ? "joinha" : "parado"} boca={boca("kuka")} feliz molhado={f >= bomb} />
        <FoneNoKuka ligado={f >= liga} />
        {f >= l1 - 6 && f < l3 && <DonaCleide x={860} y={1860} escala={0.75} pose="bracosPraCima" expr="assustada" boca={f >= l1 && f < l2 ? 0.8 * Math.abs(Math.sin(f * 0.9)) : 0} />}
        {f >= bomb - 4 && <JatoBombeiro x={KX} y={KY - 820} escala={1.0} />}
      </Tela>
      {f >= sil && f < l1 && <Onomatopeia texto="…" at={sil} dur={l1 - sil} x={540} y={540} tam={180} cor="#fff" rot={0} />}
      {f >= l1 && f < l2 + 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "#1f1b2e", color: "#fff", fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 70, padding: "10px 34px", borderRadius: 24, border: "8px solid #FFD23F" }}>🔇 SEM SOM</span>
        </div>
      )}
      {f >= l2 && f < l3 && <Selo texto={"NÍVEL DE PAZ:\n100%"} at={l2 + 4} x={600} y={300} cor="#22A447" />}
      {f >= bomb && <Onomatopeia texto="SPLASH!" at={bomb} dur={40} x={540} y={540} tam={150} cor="#3da5ff" />}
      <Sfx at={liga} nome="sparkle" vol={0.35} />
      <Sfx at={l3 + 6} nome="alarme" vol={0.25} />
      <Sfx at={bomb} nome="borbulha" vol={0.55} />
    </>
  );
};

/** 4. A OFERTA: 39,90 + extintor de brinde. O Kuka (de fone): "MANDA DOIS! O quê? MANDA DOIS!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3990");
  const agora = wordAt(scene, "agora");
  const ext = wordAt(scene, "extintor");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, ext, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <FoneExtremo x={790} y={1280} escala={0.7} ligado />
          {f >= ext && <Extintor x={930} y={1180} escala={0.75 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela shake={tremor(f, l2, 30, 8)}>
          <Sala sofa={false} tvX={-400} />
          <SeuKuka x={540} y={1800} escala={1.0} banguela careca pose="telefone" boca={boca("kuka")} feliz molhado />
          <FoneNoKuka x={540} y={1800} e={1.0} ligado />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 39,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= ext && f < l2 && <Selo texto={"+ EXTINTOR\nDE BRINDE!"} at={ext + 4} x={40} y={620} cor="#22A447" rot={-8} tam={58} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 20" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={ext} nome="boing" vol={0.45} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: o fone ligado no pedestal, a broca ainda furando ao fundo (em silêncio). */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <FoneExtremo x={540} y={1090} escala={0.6} ligado />
        <BrocaNaParede x={1080} y={760} escala={0.8} />
      </Tela>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: "'Baloo 2'", fontWeight: 800, lineHeight: 0.95 }}>
        <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: `16px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>INUTILIDADES</div>
        <div style={{ fontSize: 170, color: "#FFD23F", WebkitTextStroke: `18px ${TINTA}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${TINTA}` }}>0800</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1360, padding: "16px 24px", background: "rgba(0,0,0,.55)", borderRadius: 14, fontFamily: "'Nunito'", fontWeight: 900, fontSize: tam, lineHeight: 1.15, color: "#fff", textAlign: "center" }}>
        *Não ouve campainha, alarme nem a sua mãe. Vizinho não incluso.
      </div>
      <LigueJa at={0} numero={NUMERO} />
    </>
  );
};
