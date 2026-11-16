import React from "react";
import { CenaProps, lerp, mola, passo, Sfx, tremor, TINTA, useCena } from "../../common";
import { Banheiro, DentesNoChao, DentesVoando, EscovaTurbo, Estudio, LinhasVelocidade, Pedestal, RelogioParede } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** INUTILIDADES 0800 · Ep. 2 — "Escova de Dentes Turbo V8" (inutilidades/roteiros/escova-turbo.json) */

const NUMERO = "0800-VRUM-VRUM";

/** 1. GANCHO: o Kuka banguela, espumando e despenteado: "Meus dentes nunca estiveram tão LIMPOS." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const limpos = wordAt(scene, "limpos");
  return (
    <>
      <Tela zoom={lerp(f, 0, 90, 1.0, 1.08)} foco={[540, 900]}>
        <Banheiro bagunca={1} />
        <SeuKuka x={540} y={2330} escala={2.0} banguela arrepiado boca={boca("kuka")} feliz />
      </Tela>
      <Onomatopeia texto="BLING!" at={limpos + 4} dur={40} x={540} y={330} tam={130} cor="#fff" />
      <Sfx at={0} nome="motor" vol={0.25} />
      <Sfx at={limpos + 4} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 2. O PROBLEMA (preto e branco): escovar por DOIS minutos inteiros… o braço não aguenta. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const dois = wordAt(scene, "dois");
  const l1 = lineStart(scene, 1);
  const aguenta = wordAt(scene, "aguenta");
  const seg = Math.min(119, Math.floor(f / 1.6));
  const relogio = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;
  return (
    <>
      {f < l1 ? (
        <Tela pb>
          <Banheiro />
          <RelogioParede x={300} y={330} texto={relogio} />
          <SeuKuka x={540} y={1800} escala={1.0} pose="escovando" escova="normal" suor estado={f >= dois ? "faminto" : "normal"} boca={boca("kuka")} />
        </Tela>
      ) : (
        <Tela pb shake={tremor(f, aguenta, 14, 10)}>
          <Banheiro />
          <SeuKuka x={540} y={2350} escala={1.9} pose={f >= aguenta ? "parado" : "escovando"} escova={f >= aguenta ? undefined : "normal"} suor estado="faminto" treme={f >= aguenta ? 0 : 9} />
        </Tela>
      )}
      {f >= dois && f < l1 && <Onomatopeia texto="2 MINUTOS?!" at={dois} dur={l1 - dois} x={540} y={560} tam={110} cor="#fff" />}
      {f >= aguenta && <Onomatopeia texto="PLOFT" at={aguenta} dur={40} x={540} y={420} cor="#fff" />}
      <Sfx at={dois} nome="apito" vol={0.35} />
      <Sfx at={aguenta} nome="tum" vol={0.5} />
    </>
  );
};

/** 3. A SOLUÇÃO: "Seus problemas ACABARAM! Apresento a Escova de Dentes Turbo V8!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const escova = wordAt(scene, "escova");
  const entra = mola(f, escova, 140, 12);
  return (
    <>
      {f < escova ? (
        <Tela zoom={lerp(f, 0, escova, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 14 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <EscovaTurbo x={740} y={1300} escala={0.85 * entra} rot={-12 + (1 - entra) * 360} ligada={f >= escova + 30} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="ESCOVA" linha2="TURBO V8" at={escova} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={escova} nome="whoosh" vol={0.5} />
      <Sfx at={escova + 30} nome="motor" vol={0.35} />
    </>
  );
};

/** 4. A DEMONSTRAÇÃO: puxa a cordinha… VRUUUM! Dentes pra todo lado. "Dentes brancos em UM segundo!" */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const cordinha = wordAt(scene, "cordinha");
  const e = lineEnd(scene, 0);
  const vrum = e + 4;
  const l1 = lineStart(scene, 1);
  const um = wordAt(scene, "um");
  const puxa = f < cordinha ? 0 : f < cordinha + 6 ? (f - cordinha) / 6 : Math.max(0, 1 - (f - cordinha - 6) / 8);
  const t = lerp(f, vrum + 6, vrum + 30);
  return (
    <>
      {f < vrum ? (
        <Tela zoom={lerp(f, 0, vrum, 1.0, 1.1)} foco={[540, 1000]}>
          <Banheiro />
          <EscovaTurbo x={500} y={1050} escala={1.15} rot={-8} cordinha={puxa} />
        </Tela>
      ) : f < l1 ? (
        <Tela shake={tremor(f, vrum, 22, l1 - vrum)}>
          <Banheiro bagunca={lerp(f, vrum, vrum + 20)} />
          <SeuKuka
            x={540}
            y={1820}
            escala={1.05}
            pose="escovando"
            escova="turbo"
            espuma={lerp(f, vrum, vrum + 10)}
            arrepiado={f >= vrum + 4}
            banguela={f >= vrum + 10}
            treme={12}
          />
          <DentesVoando x={560} y={1140} t={t} />
          <LinhasVelocidade />
        </Tela>
      ) : (
        <Tela>
          <Banheiro bagunca={1} />
          <DentesNoChao x={620} y={1560} escala={1.6} />
          <DoutorOferta x={200} y={1820} escala={0.7} pose="apontando" boca={boca("doutor")} expr="sorriso" />
        </Tela>
      )}
      {f >= vrum && f < l1 && <Onomatopeia texto="VRUUUUM!" at={vrum} dur={l1 - vrum} x={540} y={430} tam={140} cor="#FF8C1A" />}
      <Selo texto={"BRANCO\n100%*"} at={um} x={680} y={330} cor="#22A447" />
      <Sfx at={cordinha} nome="whoosh" vol={0.35} />
      <Sfx at={vrum} nome="motor" vol={0.7} />
      <Sfx at={vrum + 8} nome="pop" vol={0.4} />
      <Sfx at={vrum + 12} nome="pop" vol={0.4} />
      <Sfx at={vrum + 16} nome="pop" vol={0.4} />
      <Sfx at={l1} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 5. O DEPOIMENTO: branquinhos… pena que ficaram todos no chão. "Mas eu tô muito satisfeito!" */
export const Depoimento: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const chao = wordAt(scene, "chão");
  const l2 = lineStart(scene, 2);
  const plano = passo(f, [
    [0, "medio"],
    [chao, "chao"],
    [l2, "medio"],
  ] as [number, string][]);
  return (
    <>
      <Tela>
        <Banheiro bagunca={1} />
        {plano === "medio" && <SeuKuka x={540} y={1790} escala={1.05} banguela arrepiado boca={boca("kuka")} pose={f >= l2 ? "joinha" : "parado"} feliz />}
        {plano === "chao" && <DentesNoChao x={540} y={1500} escala={1.9} />}
      </Tela>
      <Selo texto={"DEPOIMENTO\nREAL*"} at={2} x={640} y={260} />
      {plano !== "chao" && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 4" at={6} />}
      {f >= l2 && <Onomatopeia texto="★★★★★" at={l2 + 4} dur={60} y={560} tam={110} rot={0} />}
      <Sfx at={2} nome="click" vol={0.4} />
      <Sfx at={chao} nome="apito" vol={0.3} />
      <Sfx at={l2} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 6. A OFERTA: de 999 por 29,90 + fio dental motorizado. O Kuka: "Manda duas!" LIGUE JÁ! */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "2990");
  const agora = wordAt(scene, "agora");
  const motor = wordAt(scene, "motorizado");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const grita = f >= l3 || (f >= agora && f < agora + 20);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <EscovaTurbo x={740} y={1300} escala={0.85} rot={-12} ligada={f >= motor} />
          <DoutorOferta x={260} y={1740} escala={0.84} pose={grita ? "bracosAbertos" : "apontando"} boca={boca("doutor")} expr={grita ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Banheiro bagunca={1} />
          <SeuKuka x={540} y={1790} escala={1.05} banguela arrepiado pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 29,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={560} tam={420} />}
      {f >= motor && f < l2 && <Selo texto={"+ FIO DENTAL\nMOTORIZADO\nGRÁTIS!"} at={motor} x={40} y={600} cor="#22A447" rot={-8} tam={54} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 6" at={l2} />}
      {f >= l3 && <LigueJa at={l3} numero={NUMERO} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={motor} nome="motor" vol={0.3} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 7. LETRINHAS MIÚDAS: "Não recomendado para quem tem dentes. Gasolina não inclusa." */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const fim = lineEnd(scene, 0);
  const tam = lerp(f, 0, fim, 32, 48);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <EscovaTurbo x={520} y={1140} escala={0.55} rot={-12} ligada />
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
        *Não recomendado para quem tem dentes. Gasolina não inclusa.
      </div>
      <LigueJa at={0} numero={NUMERO} />
      <Sfx at={4} nome="motor" vol={0.2} />
    </>
  );
};
