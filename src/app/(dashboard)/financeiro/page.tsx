"use client";
import { useEffect, useState } from "react";
import type { Transacao } from "@/types/models";

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ descricao: "", valor: "", tipo: "receita", status: "pendente", vencimento: "" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/transacoes")
      .then(r => r.json())
      .then(data => setTransacoes(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    await fetch("/api/transacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await fetch("/api/transacoes").then(r => r.json());
    setTransacoes(Array.isArray(data) ? data : []);
    setForm({ descricao: "", valor: "", tipo: "receita", status: "pendente", vencimento: "" });
    setMostrarForm(false);
    setCarregando(false);
  }

  const receitas = transacoes.filter(t => t.tipo === "receita");
  const despesas = transacoes.filter(t => t.tipo === "despesa");

  const input = { width:"100%", padding:"10px 14px", borderRadius:"8px", border:"0.5px solid #E8EAF0", fontSize:"13px", color:"#141417", outline:"none", background:"#fff", marginBottom:"12px" };
  const label = { fontSize:"12px", fontWeight:"500" as const, color:"#484C5E", display:"block" as const, marginBottom:"6px" };

  return (
    <div style={{padding:"24px 28px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"}}>
        <div>
          <h1 style={{fontSize:"18px",fontWeight:"600",color:"#141417",marginBottom:"4px"}}>Financeiro</h1>
          <p style={{fontSize:"12px",color:"#A0A3AE"}}>Contas a pagar e receber</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 16px",borderRadius:"8px",background:"#3B6BE8",color:"#fff",fontSize:"13px",fontWeight:"500",border:"none",cursor:"pointer"}}>
          + Nova conta
        </button>
      </div>

      {mostrarForm && (
        <div style={{background:"#fff",border:"0.5px solid #E8EAF0",borderRadius:"12px",padding:"20px",marginBottom:"16px"}}>
          <div style={{fontSize:"13px",fontWeight:"500",color:"#141417",marginBottom:"16px"}}>Nova transação</div>
          <form onSubmit={handleSubmit}>
            <label style={label}>Descrição</label>
            <input style={input} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Ex: NFS-e #042" required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={label}>Valor (R$)</label>
                <input style={input} type="number" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="0,00" required/>
              </div>
              <div>
                <label style={label}>Vencimento</label>
                <input style={input} type="date" value={form.vencimento} onChange={e => setForm({...form, vencimento: e.target.value})} required/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div>
                <label style={label}>Tipo</label>
                <select style={input} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div>
                <label style={label}>Status</label>
                <select style={input} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"4px"}}>
              <button type="submit" disabled={carregando} style={{padding:"9px 20px",borderRadius:"8px",background:"#3B6BE8",color:"#fff",fontSize:"13px",fontWeight:"500",border:"none",cursor:"pointer"}}>
                {carregando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} style={{padding:"9px 20px",borderRadius:"8px",background:"#F7F8FA",color:"#6B6F7E",fontSize:"13px",border:"0.5px solid #E8EAF0",cursor:"pointer"}}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {[{ titulo: "Contas a receber", lista: receitas, cor: "#16A060" }, { titulo: "Contas a pagar", lista: despesas, cor: "#E05252" }].map(secao => (
        <div key={secao.titulo} style={{background:"#fff",border:"0.5px solid #E8EAF0",borderRadius:"12px",padding:"18px 20px",marginBottom:"14px"}}>
          <div style={{fontSize:"13px",fontWeight:"500",color:"#141417",marginBottom:"16px"}}>{secao.titulo}</div>
          {secao.lista.length === 0 ? (
            <p style={{fontSize:"13px",color:"#A0A3AE",textAlign:"center",padding:"16px 0"}}>Nenhum lançamento ainda.</p>
          ) : (
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
              <thead>
                <tr>{["Descrição","Vencimento","Valor","Status"].map(h => (
                  <th key={h} style={{textAlign:"left",fontSize:"10px",color:"#A0A3AE",fontWeight:"500",letterSpacing:".5px",textTransform:"uppercase",paddingBottom:"10px",borderBottom:"0.5px solid #E8EAF0"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {secao.lista.map(t => (
                  <tr key={t.id}>
                    <td style={{padding:"10px 0",borderBottom:"0.5px solid #F0F1F5",color:"#484C5E"}}>{t.descricao}</td>
                    <td style={{padding:"10px 0",borderBottom:"0.5px solid #F0F1F5",color:"#6B6F7E"}}>{new Date(t.vencimento).toLocaleDateString("pt-BR")}</td>
                    <td style={{padding:"10px 0",borderBottom:"0.5px solid #F0F1F5",color:secao.cor,fontWeight:"500"}}>R$ {t.valor.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                    <td style={{padding:"10px 0",borderBottom:"0.5px solid #F0F1F5"}}>
                      <span style={{fontSize:"10px",padding:"3px 9px",borderRadius:"20px",fontWeight:"500",background:t.status==="pago"?"#F0FDF7":t.status==="pendente"?"#FFFBEB":"#FFF2F2",color:t.status==="pago"?"#16A060":t.status==="pendente"?"#B45309":"#E05252"}}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
