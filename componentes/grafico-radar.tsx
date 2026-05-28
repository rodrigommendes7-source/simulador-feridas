"use client";

import { useMemo } from "react";
import type { RegistoTentativa } from "@/lib/clinico/indice";

export function GraficoRadar({ historico }: { historico: RegistoTentativa[] }) {
  const averages = useMemo(() => {
    if (historico.length === 0) return { obs: 0, ident: 0, aval: 0, plano: 0, tec: 0 };
    
    let obsSum = 0, obsCount = 0;
    let identSum = 0, identCount = 0;
    let avalSum = 0, avalCount = 0;
    let planoSum = 0, planoCount = 0;
    let tecSum = 0, tecCount = 0;

    historico.forEach(h => {
      if (h.seccoesAvaliacao) {
        h.seccoesAvaliacao.forEach(s => {
          if (s.pontuacaoMaxima > 0) {
            const perc = (s.pontuacao / s.pontuacaoMaxima) * 100;
            if (s.id === "observacao") { obsSum += perc; obsCount++; }
            if (s.id === "identificacao-visual") { identSum += perc; identCount++; }
            if (s.id === "avaliacao") { avalSum += perc; avalCount++; }
            if (s.id === "plano-terapeutico") { planoSum += perc; planoCount++; }
            if (s.id === "tecnica-aplicacao") { tecSum += perc; tecCount++; }
          }
        });
      } else {
        // Fallback no caso de existir histórico muito antigo sem a propriedade seccoesAvaliacao
        obsSum += h.pontuacoesPorSeccao["observacao"] || 0; obsCount++;
        if (h.pontuacoesPorSeccao["identificacao-visual"] !== undefined) {
          identSum += h.pontuacoesPorSeccao["identificacao-visual"] || 0; identCount++;
        }
        avalSum += h.pontuacoesPorSeccao["avaliacao"] || 0; avalCount++;
        planoSum += h.pontuacoesPorSeccao["plano-terapeutico"] || 0; planoCount++;
        tecSum += h.pontuacoesPorSeccao["tecnica-aplicacao"] || 0; tecCount++;
      }
    });
    
    return { 
      obs: obsCount ? Math.round(obsSum / obsCount) : 0, 
      ident: identCount ? Math.round(identSum / identCount) : 0, 
      aval: avalCount ? Math.round(avalSum / avalCount) : 0, 
      plano: planoCount ? Math.round(planoSum / planoCount) : 0, 
      tec: tecCount ? Math.round(tecSum / tecCount) : 0 
    };
  }, [historico]);

  const size = 280;
  const center = size / 2;
  const radius = 90;

  const getPoint = (value: number, angleIndex: number, totalPoints: number) => {
    const angle = (angleIndex * 2 * Math.PI) / totalPoints - Math.PI / 2;
    const distance = (value / 100) * radius;
    return { x: center + distance * Math.cos(angle), y: center + distance * Math.sin(angle) };
  };

  const pointsData = [
    { value: averages.obs, label: `Observação (${averages.obs}%)` },
    { value: averages.ident, label: `Identificação visual (${averages.ident}%)` },
    { value: averages.aval, label: `Avaliação e diálogo (${averages.aval}%)` },
    { value: averages.plano, label: `Plano terapêutico (${averages.plano}%)` },
    { value: averages.tec, label: `Técnica de aplicação (${averages.tec}%)` }
  ];

  const pObs = getPoint(averages.obs, 0, 5);
  const pIdent = getPoint(averages.ident, 1, 5);
  const pAval = getPoint(averages.aval, 2, 5);
  const pPlano = getPoint(averages.plano, 3, 5);
  const pTec = getPoint(averages.tec, 4, 5);
  const pathData = `M ${pObs.x},${pObs.y} L ${pIdent.x},${pIdent.y} L ${pAval.x},${pAval.y} L ${pPlano.x},${pPlano.y} L ${pTec.x},${pTec.y} Z`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", overflow: "visible" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        {[25, 50, 75, 100].map(val => {
          const r = (val/100) * radius;
          const pts = Array.from({length: 5}).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={val} points={pts} fill="none" stroke="var(--color-border-subtle)" strokeDasharray="3 3" />;
        })}
        {Array.from({length: 5}).map((_, i) => {
           const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
           return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="var(--color-border-subtle)" />
        })}
        <path d={pathData} fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
        {[pObs, pIdent, pAval, pPlano, pTec].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="2" />)}
        {pointsData.map((data, i) => {
           const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
           const labelRadius = radius + 15;
           const x = center + labelRadius * Math.cos(angle);
           const y = center + labelRadius * Math.sin(angle);
           
           let textAnchor = "middle";
           if (Math.cos(angle) > 0.1) textAnchor = "start";
           else if (Math.cos(angle) < -0.1) textAnchor = "end";

           let dy = "0.3em";
           if (Math.sin(angle) < -0.5) dy = "0em";
           else if (Math.sin(angle) > 0.5) dy = "0.8em";

           return (
             <text key={i} x={x} y={y} dy={dy} textAnchor={textAnchor} fill="var(--color-text-secondary)" fontSize="12" fontWeight="500">
               {data.label}
             </text>
           );
        })}
      </svg>
    </div>
  );
}
