"use client";
import { useEffect, useState } from "react";
import type { Das as DasModel } from "@/types/models";

export default function Das() {
  const [das, setDas] = useState<DasModel[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ competencia: "", vencimento: "", valor: "75.90", pagamento: "", status: "pendente" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/das")
      .then(r => r.json())
      .then(data => setDas(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    await fetch("/api/das", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await fetch("/api/das").then(r => r.json());
    setDas(Array.isArray(data) ? data : []);
    setForm({ competencia: "", vencimento: "", valor: "75.90", pagamento: "", status: "pendente" });
    setMostrarForm(false);
    setCarregando(false);
  }

  const totalPago = das.filter(d => d.status === "pago").reduce((a, d) => a + d.valor, 0);
  const dasAberto = das.find(d => d.status === "pendente");

  return (
    <div style={{padding:"28px 32px"}}>
      <div className="page-header">
        <div>
          <div className="page-title">DAS-MEI</div>
          <div className="page-sub">Regime SIMEI — valor fixo mensal</div>
        </div>
        <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>+ Adicionar competência</button>
      </div>

      {dasAberto && (
        <div className="warn-banner">
          <div>
            <div style={{fontSize:"14px",fontWeight:"600",color:"var(--warn)"}}>DAS-MEI em aberto — {dasAberto.competencia}</div>
            <div style={{fontSize:"12px",color:"var(--warn)",opacity:.8,marginTop:"3px"}}>Vence em {new Date(dasAberto.vencimento).toLocaleDateString("pt-BR")} · Regime SIMEI · Valor fixo</div>
          </div>
          <div style={{fontSize:"18px",fontWeight:"700",color:"var(--warn)"}}>R$ {dasAberto.valor.toFixed(2)}</div>
        </div>
      )}

      <div className="kpis" style={{gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
        <div className="kpi">
          <div className="kpi-label">Total pago no ano</div>
          <div className="kpi-value" style={{color:"var(--pos)"}}>R$ {totalPago.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Valor mensal fixo</div>
          <div className="kpi-value">R$ 75,90</div>
          <div className="kpi-delta">Serviços · SIMEI</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Competências pagas</div>
          <div className="kpi-value">{das.filter(d=>d.status==="pago").length}</div>
        </div>
      </div>

      {mostrarForm && (
        <div className="card">
          <div className="card-head"><span className="card-title">Nova competência DAS-MEI</span></div>
          <form onSubmit={handleSubmit}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Competência</label>
                <input className="form-input" value={form.competencia} onChange={e => setForm({...form,competencia:e.target.value})} placeholder="Ex: Abril/2026" required/>
              </div>
              <div>
                <label className="form-label">Vencimento</label>
                <input className="form-input" type="date" value={form.vencimento} onChange={e => setForm({...form,vencimento:e.target.value})} required/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Valor (R$)</label>
                <input className="form-input" type="number" step="0.01" value={form.valor} onChange={e => setForm({...form,valor:e.target.value})} required/>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>
            {form.status === "pago" && (
              <div>
                <label className="form-label">Data do pagamento</label>
                <input className="form-input" type="date" value={form.pagamento} onChange={e => setForm({...form,pagamento:e.target.value})}/>
              </div>
            )}
            <div style={{display:"flex",gap:"10px",marginTop:"6px"}}>
              <button type="submit" className="btn-primary" disabled={carregando}>{carregando?"Salvando...":"Salvar"}</button>
              <button type="button" className="btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head"><span className="card-title">Histórico DAS-MEI</span></div>
        {das.length === 0 ? (
          <p style={{fontSize:"14px",color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Nenhuma competência registrada ainda.</p>
        ) : (
          <table>
            <thead><tr>{["Competência","Vencimento","Valor","Pagamento","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {das.map(d => (
                <tr key={d.id}>
                  <td style={{color:"var(--text)",fontWeight:"600"}}>{d.competencia}</td>
                  <td style={{color:d.status==="pendente"?"var(--warn)":"var(--text2)"}}>{new Date(d.vencimento).toLocaleDateString("pt-BR")}</td>
                  <td>R$ {d.valor.toFixed(2)}</td>
                  <td>{d.pagamento?new Date(d.pagamento).toLocaleDateString("pt-BR"):"—"}</td>
                  <td><span className={`pill pill-${d.status}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"0.5px solid var(--border)"}}>
          <span style={{fontSize:"12px",color:"var(--accent)",background:"var(--accent-bg)",padding:"4px 10px",borderRadius:"6px",fontWeight:"500"}}>
            MEI prestador de serviços — SIMEI — valor fixo, sem cálculo percentual
          </span>
        </div>
      </div>
    </div>
  );
}
