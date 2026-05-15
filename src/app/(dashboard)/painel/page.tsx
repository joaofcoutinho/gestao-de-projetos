"use client";
import { useEffect, useState } from "react";
import type { Transacao, Das } from "@/types/models";

export default function Painel() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [das, setDas] = useState<Das[]>([]);

  useEffect(() => {
    fetch("/api/transacoes")
      .then(r => r.json())
      .then(data => setTransacoes(Array.isArray(data) ? data : []));
    fetch("/api/das")
      .then(r => r.json())
      .then(data => setDas(Array.isArray(data) ? data : []));
  }, []);

  const receitas = transacoes.filter(t => t.tipo === "receita").reduce((a, t) => a + t.valor, 0);
  const despesas = transacoes.filter(t => t.tipo === "despesa").reduce((a, t) => a + t.valor, 0);
  const saldo = receitas - despesas;
  const dasAberto = das.find(d => d.status === "pendente");

  return (
    <div style={{padding:"28px 32px"}}>
      <div className="page-header">
        <div>
          <div className="page-title">Painel geral</div>
          <div className="page-sub">Visão geral do seu negócio</div>
        </div>
      </div>

      {dasAberto && (
        <div className="warn-banner">
          <div>
            <div style={{fontSize:"14px",fontWeight:"600",color:"var(--warn)"}}>DAS-MEI em aberto — {dasAberto.competencia}</div>
            <div style={{fontSize:"12px",color:"var(--warn)",opacity:.8,marginTop:"3px"}}>Vence em {new Date(dasAberto.vencimento).toLocaleDateString("pt-BR")} · Regime SIMEI · Valor fixo</div>
          </div>
          <div style={{fontSize:"16px",fontWeight:"700",color:"var(--warn)"}}>R$ {dasAberto.valor.toFixed(2)}</div>
        </div>
      )}

      <div className="kpis">
        {[
          { label: "Receitas", valor: `R$ ${receitas.toLocaleString("pt-BR",{minimumFractionDigits:2})}`, cor: "var(--pos)" },
          { label: "Despesas", valor: `R$ ${despesas.toLocaleString("pt-BR",{minimumFractionDigits:2})}`, cor: "var(--neg)" },
          { label: "Saldo líquido", valor: `R$ ${saldo.toLocaleString("pt-BR",{minimumFractionDigits:2})}`, cor: "var(--text)" },
          { label: "Transações", valor: String(transacoes.length), cor: "var(--accent)" },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.cor}}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Últimas transações</span>
        </div>
        {transacoes.length === 0 ? (
          <p style={{fontSize:"14px",color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Nenhuma transação ainda. Acesse Financeiro para adicionar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                {["Descrição","Tipo","Valor","Status"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {transacoes.slice(0,8).map(t => (
                <tr key={t.id}>
                  <td style={{color:"var(--text)",fontWeight:"500"}}>{t.descricao}</td>
                  <td style={{color:t.tipo==="receita"?"var(--pos)":"var(--neg)",fontWeight:"500",textTransform:"capitalize"}}>{t.tipo}</td>
                  <td style={{color:t.tipo==="receita"?"var(--pos)":"var(--neg)",fontWeight:"600"}}>{t.tipo==="receita"?"+":"-"}R$ {t.valor.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                  <td><span className={`pill pill-${t.status}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
