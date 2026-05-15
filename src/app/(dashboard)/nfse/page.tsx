"use client";
import { useEffect, useState } from "react";
import type { Nfse as NfseModel, Cliente } from "@/types/models";

export default function Nfse() {
  const [nfses, setNfses] = useState<NfseModel[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ numero: "", servico: "", valor: "", emissao: "", status: "emitida", clienteId: "" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/nfse")
      .then(r => r.json())
      .then(data => setNfses(Array.isArray(data) ? data : []));
    fetch("/api/clientes")
      .then(r => r.json())
      .then(data => setClientes(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    await fetch("/api/nfse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await fetch("/api/nfse").then(r => r.json());
    setNfses(Array.isArray(data) ? data : []);
    setForm({ numero: "", servico: "", valor: "", emissao: "", status: "emitida", clienteId: "" });
    setMostrarForm(false);
    setCarregando(false);
  }

  return (
    <div style={{padding:"28px 32px"}}>
      <div className="page-header">
        <div>
          <div className="page-title">NFS-e</div>
          <div className="page-sub">Histórico de notas fiscais de serviço</div>
        </div>
        <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>+ Registrar NFS-e</button>
      </div>

      <div className="info-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:"1px"}}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <strong>MEI emite NFS-e exclusivamente pelo gov.br/nfse</strong> — por determinação do CGSN (Resolução nº 172/2023). Registre aqui o histórico após emitir no portal oficial.{" "}
          <a href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/nota-fiscal/nota-fiscal-de-servico-eletronica-nfs-e" target="_blank" style={{color:"var(--accent)",fontWeight:"600"}}>Abrir gov.br/nfse →</a>
        </div>
      </div>

      {mostrarForm && (
        <div className="card">
          <div className="card-head"><span className="card-title">Registrar NFS-e emitida</span></div>
          <form onSubmit={handleSubmit}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Número da nota</label>
                <input className="form-input" value={form.numero} onChange={e => setForm({...form,numero:e.target.value})} placeholder="Ex: 042" required/>
              </div>
              <div>
                <label className="form-label">Data de emissão</label>
                <input className="form-input" type="date" value={form.emissao} onChange={e => setForm({...form,emissao:e.target.value})} required/>
              </div>
            </div>
            <label className="form-label">Serviço prestado</label>
            <input className="form-input" value={form.servico} onChange={e => setForm({...form,servico:e.target.value})} placeholder="Ex: Desenvolvimento web" required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Valor (R$)</label>
                <input className="form-input" type="number" step="0.01" value={form.valor} onChange={e => setForm({...form,valor:e.target.value})} placeholder="0,00" required/>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                  <option value="emitida">Emitida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <label className="form-label">Cliente</label>
            <select className="form-input" value={form.clienteId} onChange={e => setForm({...form,clienteId:e.target.value})}>
              <option value="">Selecionar cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <div style={{display:"flex",gap:"10px",marginTop:"6px"}}>
              <button type="submit" className="btn-primary" disabled={carregando}>{carregando?"Salvando...":"Salvar"}</button>
              <button type="button" className="btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head"><span className="card-title">{nfses.length} nota{nfses.length!==1?"s":""} registrada{nfses.length!==1?"s":""}</span></div>
        {nfses.length === 0 ? (
          <p style={{fontSize:"14px",color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Nenhuma NFS-e registrada ainda.</p>
        ) : (
          <table>
            <thead><tr>{["Nº","Tomador","Serviço","Emissão","Valor","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {nfses.map(n => (
                <tr key={n.id}>
                  <td style={{color:"var(--accent)",fontWeight:"600"}}>#{n.numero}</td>
                  <td style={{color:"var(--text)",fontWeight:"500"}}>{n.cliente?.nome||"—"}</td>
                  <td>{n.servico}</td>
                  <td>{new Date(n.emissao).toLocaleDateString("pt-BR")}</td>
                  <td style={{color:"var(--pos)",fontWeight:"600"}}>R$ {n.valor.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                  <td><span className={`pill pill-${n.status}`}>{n.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
