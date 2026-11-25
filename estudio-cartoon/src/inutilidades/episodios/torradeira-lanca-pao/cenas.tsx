import React from "react";
import { CenaProps, lerp, mola, Sfx, tremor, TINTA, useCena } from "../../common";
import { BuracoTeto, Cozinha, Estudio, LuvaGoleiro, Mesa, Pedestal, Sala, Torrada, TorradeiraLancaPao, TorradeiraVelha } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DonaCleide, DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/**
 * INUTILIDADES 0800 · Ep. 11 — "Torradeira Lança-Pão 3000" (formato curto). Entrega a torrada "direto na sua mão"…
 * no nível máximo ela atravessa o teto, tosta o Seu Kuka e chove pão no apartamento da Dona Cleide.
 */

const NUMERO = "0800-VOA-PAO";
const MX = 720;
const MY = 1380;

/** 1. O PROBLEMA (P&B): o Kuka faminto, de prato na mão, esperando a torradeira velha… que queima o pão lá dentro. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const queima = wordAt(scene, "queima");
  return (
    <>
      <Tela pb shake={tremor(f, queima, 14, 10)} zoom={f >= l1 ? 1.1 : 1.0} foco={[MX, 1150]}>
        <Cozinha />
        <Mesa x={MX} y={MY} escala={0.8} />
        <TorradeiraVelha x={MX} y={MY - 60} escala={0.8} fumaca={f >= queima - 6} />
        <SeuKuka x={290} y={1840} escala={0.85} estado="faminto" pose="prato" />
      </Tela>
      {f >= l1 && f < queima && <Onomatopeia texto="TIC… TAC…" at={l1} dur={queima - l1} x={540} y={560} tam={100} cor="#fff" />}
      {f >= queima && <Onomatopeia texto="QUEIMOU!" at={queima} dur={60} x={540} y={560} tam={130} cor="#fff" />}
      <Sfx at={l1} nome="click" vol={0.4} />
      <Sfx at={queima} nome="tum" vol={0.4} />
    </>
  );
};

/** 2. A SOLUÇÃO: "Apresento a Torradeira Lança-Pão 3000!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const tor = wordAt(scene, "torradeira");
  const entra = mola(f, tor, 140, 12);
  return (
    <>
      {f < tor ? (
        <Tela zoom={lerp(f, 0, tor, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={780} y={1450} />
          <TorradeiraLancaPao x={780} y={1440} escala={0.75 * entra} rot={(1 - entra) * 360} ligada={f >= tor + 30} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="TORRADEIRA" linha2="LANÇA-PÃO 3000" at={tor} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={tor} nome="whoosh" vol={0.5} />
    </>
  );
};

/** 3. A DEMONSTRAÇÃO: "direto na sua mão!" → Kuka: "nível MÁXIMO!" → BUM, torrada atravessa o teto → chove pão na Dona Cleide. */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const dispara = lineEnd(scene, 1) + 4;
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const tostado = f >= dispara + 2;
  return (
    <>
      {f < l1 ? (
        <Tela zoom={1.04} foco={[MX, 1150]}>
          <Cozinha />
          <Mesa x={MX} y={MY} escala={0.8} />
          <TorradeiraLancaPao x={MX} y={MY - 60} escala={0.55} />
          <DoutorOferta x={280} y={1760} escala={0.86} pose="apontando" boca={boca("doutor")} expr="sorriso" />
        </Tela>
      ) : f < l2 ? (
        <Tela shake={tremor(f, dispara, 30, 28)}>
          <Cozinha />
          {f >= dispara && <BuracoTeto x={MX} y={70} escala={1.1} />}
          <Mesa x={MX} y={MY} escala={0.8} />
          <TorradeiraLancaPao x={MX} y={MY - 60} escala={0.55} ligada={f >= l1 + 10} fogo={f >= dispara ? 1 - lerp(f, dispara + 10, l2, 0, 0.7) : 0} />
          {f >= dispara && f < dispara + 10 && (
            <>
              <Torrada x={MX - 40} y={lerp(f, dispara, dispara + 8, 1100, -200)} escala={0.6} rot={f * 30} />
              <Torrada x={MX + 40} y={lerp(f, dispara, dispara + 9, 1100, -200)} escala={0.6} rot={-f * 30} />
            </>
          )}
          <SeuKuka x={330} y={1840} escala={0.9} estado={tostado ? "tostado" : "normal"} pose={tostado ? "bracosPraCima" : "joinha"} boca={boca("kuka")} feliz={!tostado} arrepiado={tostado} />
        </Tela>
      ) : f < l3 ? (
        <Tela>
          <Sala sofa={false} tvX={850} />
          <BuracoTeto x={790} y={1760} escala={0.9} chao />
          {[0, 1, 2, 3, 4].map((i) => {
            const q = ((f - l2 + i * 9) % 40) / 40;
            return <Torrada key={i} x={140 + i * 200} y={-150 + q * 1700} escala={0.45} rot={f * 8 + i * 70} />;
          })}
          <DonaCleide x={420} y={1860} escala={0.85} pose="bracosPraCima" expr="surpresa" boca={boca("cleide")} />
          <Torrada x={420} y={1000} escala={0.5} rot={-12} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.0} pose="joinha" boca={boca("doutor")} expr="sorriso" />
          <Torrada x={760} y={900} escala={0.5} rot={20} />
        </Tela>
      )}
      {f < l1 && <Selo texto={"NA SUA\nMÃO!"} at={lineStart(scene, 0) + 10} x={640} y={520} cor="#22A447" rot={6} tam={62} />}
      {f >= l1 && f < dispara && <Onomatopeia texto="NÍVEL MÁX!" at={l1} dur={dispara - l1} x={540} y={420} tam={110} cor="#FF3B3B" />}
      {f >= dispara && f < l2 && <Onomatopeia texto="FIUUU… BUM!" at={dispara} dur={l2 - dispara} x={540} y={420} tam={130} cor="#FF8C1A" />}
      {f >= l3 && <Selo texto={"ENTREGA\nEXPRESSA*"} at={l3 + 4} x={560} y={300} cor="#2E6BE6" />}
      <Sfx at={l1 + 8} nome="click" vol={0.5} />
      <Sfx at={l1 + 10} nome="motor" vol={0.35} />
      <Sfx at={dispara} nome="boom" vol={0.45} />
      <Sfx at={dispara + 1} nome="whoosh" vol={0.5} />
      <Sfx at={l2} nome="boing" vol={0.35} />
      <Sfx at={l3} nome="tada" vol={0.35} />
    </>
  );
};

/** 4. A OFERTA: 34,90 + luva de goleiro. O Kuka (tostado): "Manda duas! Uma é pra Dona Cleide!" */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "3490");
  const agora = wordAt(scene, "agora");
  const luva = wordAt(scene, "luva");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, luva, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <TorradeiraLancaPao x={790} y={1440} escala={0.6} ligada={f >= l3} />
          {f >= luva && <LuvaGoleiro x={880} y={960} escala={0.9 * sc} rot={12} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Cozinha />
          <BuracoTeto x={540} escala={1.1} />
          <SeuKuka x={540} y={1800} escala={1.0} estado="tostado" arrepiado pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 34,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= luva && f < l2 && <Selo texto={"+ LUVA DE\nGOLEIRO!"} at={luva + 4} x={40} y={620} cor="#22A447" rot={-8} tam={58} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 24" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={luva} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="whoosh" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 5. LETRINHAS: a torradeira disparando torradas sem parar. */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 30, 44);
  const q = (f % 18) / 18;
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <TorradeiraLancaPao x={540} y={1230} escala={0.5} ligada fogo={0.4} />
        <Torrada x={500} y={1050 - q * 1300} escala={0.4} rot={f * 20} />
        <Torrada x={580} y={1050 - ((q + 0.5) % 1) * 1300} escala={0.4} rot={-f * 20} />
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
        *Torrada pode chegar antes de você. Teto não incluso. Vizinha de cima também não.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={10} nome="whoosh" vol={0.3} />
    </>
  );
};
