import React from "react";
import { AbsoluteFill } from "remotion";
import { CenaProps, lerp, mola, passo, Sfx, tremor, TINTA, useCena } from "../../common";
import { Cozinha, Estudio, Explosao, Fumaca, Mesa, ParedeTijolos, Ratoeira } from "../../Objetos";
import { EstrelaPreco, Faixa, LigueJa, NomeProduto, Onomatopeia, Selo, Terco } from "../../Overlay";
import { DoutorOferta, Rato, SeuKuka } from "../../Personagens";
import { Tela } from "../../Tela";
import { lineEnd, lineStart, wordAt } from "../../timeline";

/** INUTILIDADES 0800 · Ep. 1 — "Ratoeira Explosiva 3000" (inutilidades/roteiros/ratoeira-explosiva.json) */

const Pedestal: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-170 0 L170 0 L150 260 L-150 260 Z" fill="#fff" />
    <rect x={-180} y={-20} width={360} height={40} rx={10} fill="#FFD23F" />
  </g>
);

/** 1. GANCHO: o rato almoçando na mesa olha para a câmera: "Faltou sal." */
export const Gancho: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  return (
    <>
      <Tela zoom={lerp(f, 0, 30, 1.0, 1.1)} foco={[540, 950]}>
        <Cozinha />
        <Rato x={540} y={1430} escala={1.75} guardanapo talheres boca={boca("rato")} mastiga={f < 3} />
        <Mesa x={540} y={1320} escala={1.25} />
      </Tela>
      <Sfx at={0} nome="pop" vol={0.3} />
    </>
  );
};

/** 2. O PROBLEMA (preto e branco, o "antes"): ratos almoçando sua comida e derrubando paredes. */
export const Problema: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const almoc = wordAt(scene, "almoçando");
  const l1 = lineStart(scene, 1);
  const derr = wordAt(scene, "derrubando");
  const quebra = lerp(f, derr, derr + 26);
  const marreta = f < derr ? -40 + Math.sin(f * 0.5) * 30 : lerp(f, derr - 4, derr + 2, -70, 40);
  return (
    <>
      {f < l1 ? (
        <Tela pb zoom={1}>
          <Cozinha />
          <Rato x={640} y={1460} escala={1.2} guardanapo talheres mastiga boca={boca("rato")} />
          <Mesa x={640} y={1380} escala={0.95} comido={lerp(f, almoc, l1 - 10)} />
          <SeuKuka x={210} y={1820} escala={0.62} estado="faminto" pose="prato" />
        </Tela>
      ) : (
        <Tela pb shake={tremor(f, derr, 30, 18)}>
          <ParedeTijolos quebra={quebra} />
          <Rato x={250} y={1640} escala={1.25} capacete marreta={marreta} />
        </Tela>
      )}
      {f < l1 && <Onomatopeia texto="NHAC NHAC" at={almoc} dur={40} x={700} y={620} tam={96} rot={6} />}
      <Onomatopeia texto="CRASH!" at={derr + 2} dur={40} y={520} cor="#fff" />
      <Sfx at={almoc} nome="pop" vol={0.35} />
      <Sfx at={almoc + 8} nome="pop" vol={0.3} />
      <Sfx at={derr} nome="boom" vol={0.45} />
      <Sfx at={derr + 4} nome="tum" vol={0.4} />
    </>
  );
};

/** 3. A SOLUÇÃO: "Seus problemas ACABARAM! Apresento a Ratoeira Explosiva 3000!" */
export const Produto: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const l1 = lineStart(scene, 1);
  const rat = wordAt(scene, "ratoeira");
  const entra = mola(f, rat, 140, 12);
  return (
    <>
      {f < rat ? (
        <Tela zoom={lerp(f, 0, rat, 1.0, 1.06)} foco={[540, 1100]}>
          <Estudio />
          <DoutorOferta x={540} y={1720} escala={1.02} pose={f < l1 ? "bracosAbertos" : "apresentando"} boca={boca("doutor")} expr={f < 12 ? "gritando" : "sorriso"} />
        </Tela>
      ) : (
        <Tela>
          <Estudio />
          <Pedestal x={790} y={1450} />
          <Ratoeira x={790} y={1430} escala={entra} rot={(1 - entra) * 360} />
          <DoutorOferta x={290} y={1740} escala={0.84} pose="apontando" boca={boca("doutor")} expr="piscando" />
        </Tela>
      )}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={l1} y={220} />
      <NomeProduto linha1="RATOEIRA" linha2="EXPLOSIVA 3000" at={rat} y={360} />
      <Sfx at={2} nome="tada" vol={0.4} />
      <Sfx at={rat} nome="whoosh" vol={0.5} />
      <Sfx at={rat + 10} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 4. A DEMONSTRAÇÃO: queijo, pavio… BUM! Cozinha em ruínas, "rato capturado com SUCESSO!" */
export const Demonstracao: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const queijo = wordAt(scene, "queijo");
  const pavio = wordAt(scene, "pavio");
  const eFim = lineEnd(scene, 0);
  const bum = eFim + 12;
  const l1 = lineStart(scene, 1);
  const sucesso = wordAt(scene, "sucesso");
  const ratoX = lerp(f, pavio + 8, bum - 4, 1250, 800);
  const flash = f >= bum && f < bum + 3;
  if (flash) return <AbsoluteFill style={{ background: "#fff" }} />;
  return (
    <>
      {f < bum ? (
        <Tela zoom={lerp(f, 0, bum, 1.0, 1.12)} foco={[540, 1300]}>
          <Cozinha />
          <Ratoeira x={540} y={1560} escala={1.55} queijo={f >= queijo} aceso={f >= pavio} />
          {f >= pavio + 8 && <Rato x={ratoX} y={1640} escala={0.8} olhar={-12} />}
        </Tela>
      ) : f < bum + 20 ? (
        <Tela shake={tremor(f, bum, 50, 20)}>
          <Cozinha />
          <Explosao x={540} y={1250} t={(f - bum) / 20} escala={1.1} />
        </Tela>
      ) : (
        <Tela shake={tremor(f, bum + 20, 10, 10)}>
          <Cozinha destruida />
          <Fumaca x={760} y={1300} />
          <Ratoeira x={720} y={1650} escala={1.1} queijo={false} rot={-8} />
          <Rato x={720} y={1600} escala={0.85} tostado />
          <DoutorOferta x={280} y={1800} escala={0.78} pose="joinha" queimado boca={boca("doutor")} expr="sorriso" />
        </Tela>
      )}
      {f >= queijo && f < bum && <Onomatopeia texto="PLIM!" at={queijo} dur={16} x={540} y={700} tam={90} />}
      {f >= pavio && f < bum && <Onomatopeia texto="TSSSS…" at={pavio} dur={bum - pavio} x={600} y={600} tam={96} cor="#FF8C1A" rot={4} />}
      <Selo texto={"100%\nEFICAZ*"} at={sucesso} x={660} y={330} />
      <Sfx at={queijo} nome="pop" vol={0.5} />
      <Sfx at={pavio} nome="borbulha" vol={0.45} />
      <Sfx at={pavio + 8} nome="click" vol={0.3} />
      <Sfx at={bum} nome="boom" vol={0.9} />
      <Sfx at={l1} nome="tum" vol={0.3} />
      <Sfx at={sucesso} nome="ding" vol={0.45} />
    </>
  );
};

/** 5. O DEPOIMENTO do Seu Kuka Beludo, tostado e feliz: "Mudou minha vida!" */
export const Depoimento: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const cozinha = wordAt(scene, "cozinha…");
  const sobr = wordAt(scene, "sobrancelha");
  const l2 = lineStart(scene, 2);
  const plano = passo(f, [
    [0, "medio"],
    [cozinha, "aberto"],
    [sobr, "close"],
    [l2, "medio"],
  ] as [number, string][]);
  const b = boca("kuka");
  return (
    <>
      <Tela>
        <Cozinha destruida />
        <Fumaca x={820} y={1250} n={4} />
        {plano === "medio" && <SeuKuka x={540} y={1780} escala={1.05} estado="tostado" boca={b} pose={f >= l2 ? "joinha" : "parado"} feliz />}
        {plano === "aberto" && <SeuKuka x={300} y={1760} escala={0.6} estado="tostado" boca={b} pose="parado" />}
        {plano === "close" && <SeuKuka x={540} y={2600} escala={2.3} estado="tostado" boca={b} pose="parado" />}
      </Tela>
      {plano === "close" && <Onomatopeia texto="CADÊ?" at={sobr + 4} dur={40} y={300} cor="#fff" />}
      <Selo texto={"DEPOIMENTO\nREAL*"} at={2} x={640} y={260} />
      {plano !== "close" && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 1" at={6} />}
      {f >= l2 && <Onomatopeia texto="★★★★★" at={l2 + 4} dur={60} y={600} tam={110} rot={0} />}
      <Sfx at={2} nome="click" vol={0.4} />
      <Sfx at={cozinha} nome="whoosh" vol={0.35} />
      <Sfx at={sobr} nome="apito" vol={0.35} />
      <Sfx at={l2} nome="sparkle" vol={0.5} />
    </>
  );
};

/** 6. A OFERTA: de 999 por 19,90, a segunda de brinde, o Kuka quer duas. LIGUE JÁ! */
export const Oferta: React.FC<CenaProps> = ({ scene }) => {
  const { f, boca } = useCena(scene);
  const por = wordAt(scene, "1990");
  const agora = wordAt(scene, "agora");
  const segunda = wordAt(scene, "segunda");
  const l2 = lineStart(scene, 2);
  const l3 = lineStart(scene, 3);
  const segundaEntra = mola(f, segunda, 160, 10);
  return (
    <>
      {f < l2 || f >= l3 ? (
        <Tela shake={tremor(f, por, 12, 10)}>
          <Estudio cor={f >= l3 ? "#D92B2B" : "#2E6BE6"} raio={f >= l3 ? "#F04A3A" : "#4A85F5"} />
          <Pedestal x={790} y={1450} />
          <Ratoeira x={790} y={1430} />
          {f >= segunda && <Ratoeira x={900} y={1455} escala={0.7 * segundaEntra} rot={12} />}
          <DoutorOferta
            x={290}
            y={1740}
            escala={0.84}
            pose={f >= l3 ? "bracosAbertos" : f >= agora && f < agora + 20 ? "bracosAbertos" : "apontando"}
            boca={boca("doutor")}
            expr={f >= l3 || (f >= agora && f < agora + 20) ? "gritando" : "sorriso"}
          />
        </Tela>
      ) : (
        <Tela>
          <Cozinha destruida />
          <SeuKuka x={540} y={1780} escala={1.05} estado="tostado" pose="telefone" boca={boca("kuka")} feliz />
        </Tela>
      )}
      {(f < l2 || f >= l3) && <EstrelaPreco de="DE R$ 999" por="R$ 19,90" extra="SÓ HOJE!" at={2} porAt={por} x={620} y={560} tam={420} />}
      {f >= segunda && f < l2 && <Selo texto="+1 GRÁTIS!" at={segunda + 4} x={580} y={1060} cor="#22A447" rot={-8} tam={64} />}
      {f >= l2 && f < l3 && <Terco nome="SEU KUKA BELUDO" sub="cliente fiel · produtos comprados: 3" at={l2} />}
      {f >= l3 && <LigueJa at={l3} />}
      <Faixa texto="★ OFERTA EXCLUSIVA ★" at={2} y={220} />
      <Sfx at={2} nome="whoosh" vol={0.4} />
      <Sfx at={por} nome="caixa" vol={0.6} />
      <Sfx at={segunda} nome="boing" vol={0.45} />
      <Sfx at={segunda + 6} nome="caixa" vol={0.4} />
      <Sfx at={l2} nome="click" vol={0.35} />
      <Sfx at={l3} nome="alarme" vol={0.25} />
      <Sfx at={l3 + 2} nome="tada" vol={0.35} />
    </>
  );
};

/** 7. LETRINHAS MIÚDAS (lidas bem rápido) + participação do rato: "Rato não incluso." */
export const Letrinhas: React.FC<CenaProps> = ({ scene }) => {
  const { f } = useCena(scene);
  const rato = wordAt(scene, "rato");
  const fim = lineEnd(scene, 0);
  const sobe = mola(f, rato, 160, 12);
  const tam = lerp(f, 0, fim, 30, 46);
  return (
    <>
      <Tela>
        <Estudio cor="#1E3F8F" raio="#2B54B0" />
        <Pedestal x={540} y={1240} escala={0.8} />
        <Ratoeira x={540} y={1225} escala={0.85} />
        <Rato x={900} y={1960 - sobe * 330} escala={0.95} capacete />
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
        *Não nos responsabilizamos pela sua casa, cozinha, vizinhos ou dignidade. Rato não incluso.
      </div>
      <LigueJa at={0} />
      <Sfx at={rato} nome="boing" vol={0.4} />
    </>
  );
};
