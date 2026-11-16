import React from "react";
import { CenaProps, lerp, mola, passo, Sfx, tremor, TINTA, useCena } from "../../common";
import { Capacete, Estudio, Fumaca, LinhasVelocidade, ParedeBuraco, Pedestal, RelogioParede, Rua, Sala, TapeteTurbo } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, Rato, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** INUTILIDADES 0800 · Ep. 4 — "Tapete Escorregador Turbo" (inutilidades/roteiros/tapete-turbo.json) */

const NUMERO = "0800-ZUUUM";

/** Linhas de velocidade na horizontal. */
const VelocidadeHorizontal: React.FC = () => (
  <g transform="rotate(90 540 960)">
    <LinhasVelocidade />
  </g>
);

/** 1. GANCHO: buraco com o formato do Kuka na parede; ele, zonzo: "Fui na cozinha… e atravessei TRÊS paredes." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const tres = wordAt(scene, "três");
  return (
    <>
      <Tela zoom={lerp(f, 0, 100, 1.12, 1.0)} foco={[540, 1000]} shake={tremor(f, 0, 30, 12)}>
        <Sala sofa={false} tvX={-400} />
        <ParedeBuraco x={420} y={1500} escala={0.8} />
        <Fumaca x={420} y={1300} cor="#E8E0D0" n={4} />
        <SeuKuka x={850} y={1830} escala={0.62} banguela galos boca={boca("kuka")} />
      </Tela>
      <Onomatopeia texto="CRASH!" at={0} dur={24} x={540} y={300} tam={130} cor="#fff" />
      {f >= tres && <Onomatopeia texto="3 PAREDES" at={tres} dur={60} x={540} y={300} tam={120} cor="#FFD23F" />}
      <Sfx at={0} nome="boom" vol={0.6} />
      <Sfx at={tres} nome="tum" vol={0.45} />
    </>
  );
};

/** 2. O PROBLEMA (P&B): 5 SEGUNDOS do quarto até a cozinha… uma ETERNIDADE (nasce até barba). */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const fim0 = lineEnd(scene, 0);
  const seg = Math.min(5, Math.floor(lerp(f, 10, fim0, 0, 5.99)));
  return (
    <>
      {f < l1 ? (
        <Tela pb>
          <Sala sofa={false} tvX={-400} />
          <RelogioParede x={760} y={330} texto={`0:0${seg}`} />
          <SeuKuka x={lerp(f, 0, l1, 200, 560)} y={1820} escala={0.85} estado="faminto" banguela barba={lerp(f, 10, l1, 0, 0.6)} pose="parado" treme={2} />
        </Tela>
      ) : (
        <Tela pb zoom={1.0}>
          <Sala sofa={false} tvX={-400} />
          <SeuKuka x={540} y={2300} escala={1.7} estado="faminto" banguela barba={1} pose="parado" />
        </Tela>
      )}
      {f < l1 && <Onomatopeia texto="5 SEGUNDOS?!" at={30} dur={l1 - 30} x={540} y={540} tam={110} cor="#fff" />}
      {f >= l1 && <Onomatopeia texto="ETERNIDADE…" at={l1} dur={60} x={540} y={300} tam={120} cor="#fff" />}
      <Sfx at={30} nome="apito" vol={0.3} />
      <Sfx at={l1} nome="tum" vol={0.45} />
    </>
  );
};

/** 3. A SOLUÇÃO: "Apresento o Tapete Escorregador Turbo!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const tap = wordAt(scene, "tapete");
  const entra = mola(f, tap, 140, 12);
  return (
    <>
      {f < tap ? (
        <Tela zoom={lerp(f, 0, tap, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <TapeteTurbo x={790} y={1400} escala={0.55 * entra} rot={(1 - entra) * 360} jato={f >= tap + 30 ? 1 : 0} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="TAPETE" linha2="ESCORREGADOR TURBO" at={tap} y={360} tam={100} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={tap} nome="whoosh" vol={0.5} />
      <Sfx at={tap + 30} nome="riser" vol={0.35} />
    </>
  );
};

/** 4. A DEMONSTRAÇÃO: pisa no tapete… ZUUUM! Atravessa 3 paredes. "Cozinha em MEIO segundo!" */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const pisar = wordAt(scene, "pisar");
  const zum = lineEnd(scene, 0) + 4;
  const l1 = lineStart(scene, 1);
  const meio = wordAt(scene, "meio");
  const parede = passo(f, [
    [0, 0],
    [zum + 10, 1],
    [zum + 17, 2],
    [zum + 24, 3],
  ] as [number, number][]);
  const kx = f < zum ? 300 : lerp(f, zum, zum + 10, 300, 1500);
  return (
    <>
      {parede === 0 ? (
        <Tela zoom={f >= pisar ? 1.08 : 1.0} foco={[400, 1500]}>
          <Sala sofa={false} tvX={-400} />
          <TapeteTurbo x={kx + 10} y={1830} escala={0.75} jato={f >= zum ? 1 : 0} />
          <SeuKuka x={kx} y={1800} escala={0.8} banguela pose={f >= zum ? "bracosPraCima" : "parado"} arrepiado={f >= zum} feliz />
          {f >= zum && <VelocidadeHorizontal />}
        </Tela>
      ) : f < l1 ? (
        <Tela shake={tremor(f, zum + 10 + (parede - 1) * 7, 34, 7)}>
          <Sala sofa={false} tvX={-400} />
          <ParedeBuraco x={540} y={1550} escala={0.9} cor={["#F4D9A8", "#BFE6F5", "#E9D3F2"][parede - 1]} />
          <Fumaca x={540} y={1300} cor="#E8E0D0" n={5} />
        </Tela>
      ) : (
        <Tela>
          <Sala sofa={false} tvX={-400} />
          <ParedeBuraco x={600} y={1550} escala={0.9} />
          <Fumaca x={600} y={1300} cor="#E8E0D0" n={3} />
          <DoutorOferta x={230} y={1820} escala={0.72} pose="joinha" boca={boca("doutor")} expr="sorriso" />
        </Tela>
      )}
      {f >= pisar && f < zum && <Onomatopeia texto="PISA…" at={pisar} dur={zum - pisar} x={540} y={420} tam={100} cor="#fff" />}
      {f >= zum && parede === 0 && <Onomatopeia texto="ZUUUUM!" at={zum} dur={10} x={540} y={420} tam={140} cor="#FF8C1A" />}
      {parede > 0 && f < l1 && <Onomatopeia texto={["CRASH!", "CRASH!!", "CRASH!!!"][parede - 1]} at={zum + 10 + (parede - 1) * 7} dur={7} x={540} y={360} tam={140 + parede * 10} cor="#fff" />}
      {f >= meio && <Selo texto={"0,5 s*\nRECORDE!"} at={meio} x={680} y={300} cor="#22A447" />}
      <Sfx at={pisar} nome="click" vol={0.4} />
      <Sfx at={zum} nome="whoosh" vol={0.6} />
      <Sfx at={zum + 10} nome="boom" vol={0.5} />
      <Sfx at={zum + 17} nome="boom" vol={0.5} />
      <Sfx at={zum + 24} nome="boom" vol={0.55} />
      <Sfx at={meio} nome="ding" vol={0.45} />
    </>
  );
};

/** 5. O DEPOIMENTO: foi buscar água… parou no bairro vizinho. "Mas cheguei RAPIDINHO!" */
export const Depoimento: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const vizinho = wordAt(scene, "vizinho");
  const l2 = lineStart(scene, 2);
  return (
    <>
      <Tela>
        <Rua chuva={false} />
        <SeuKuka x={540} y={1790} escala={1.0} banguela galos arrepiado boca={boca("kuka")} pose={f >= l2 ? "joinha" : "parado"} feliz />
        <TapeteTurbo x={540} y={1830} escala={0.7} />
      </Tela>
      {f >= vizinho && f < l2 && <Selo texto={"VOCÊ ESTÁ AQUI:\nBAIRRO VIZINHO"} at={vizinho} x={110} y={420} cor="#3D6CC9" rot={-4} tam={56} />}
      {f >= l2 && <Onomatopeia texto="★★★★★" at={l2 + 4} dur={60} y={560} tam={110} rot={0} />}
      <Selo texto={"DEPOIMENTO\nREAL*"} at={2} x={640} y={260} />
      <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 10" at={6} />
      <Sfx at={2} nome="click" vol={0.4} />
      <Sfx at={vizinho} nome="tum" vol={0.45} />
      <Sfx at={l2} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 6. A OFERTA: de 999 por 49,90 + capacete de brinde. O Kuka: "Manda dois!" LIGUE JÁ! */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "4990");
  const agora = wordAt(scene, "agora");
  const cap = wordAt(scene, "capacete");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  const sc = mola(f, cap, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <TapeteTurbo x={790} y={1400} escala={0.55} jato={1} />
          {f >= cap && <Capacete x={800} y={1290} escala={0.8 * sc} />}
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} curativo />
        </Tela>
      ) : (
        <Tela>
          <Rua chuva={false} />
          <SeuKuka x={540} y={1790} escala={1.05} banguela galos pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 49,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={520} tam={420} />}
      {f >= cap && f < l2 && <Selo texto={"+ CAPACETE\nGRÁTIS!"} at={cap + 4} x={40} y={620} cor="#22A447" rot={-8} tam={60} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 12" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={cap} nome="boing" vol={0.45} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 7. LETRINHAS + participação do rato surfando no tapete. */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 32, 46);
  const rx = lerp(f, 50, 80, -300, 1400);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <TapeteTurbo x={540} y={1200} escala={0.5} />
        {f >= 50 && f < 82 && (
          <g>
            <TapeteTurbo x={rx} y={1700} escala={0.4} jato={1} />
            <Rato x={rx + 20} y={1680} escala={0.55} capacete />
          </g>
        )}
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
        *Não pise no tapete. Paredes vendidas separadamente.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={50} nome="whoosh" vol={0.5} />
    </>
  );
};
