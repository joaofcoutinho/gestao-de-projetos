"use client";
import { useEffect, useState } from "react";
import type { Cliente } from "@/types/models";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nome: "", documento: "", email: "", telefone: "" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/clientes")
      .then(r => r.json())
      .then(data => setClientes(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await fetch("/api/clientes").then(r => r.json());
    setClientes(Array.isArray(data) ? data : []);
    setForm({ nome: "", documento: "", email: "", telefone: "" });
    setMostrarForm(false);
    setCarregando(false);
  }

  const cores = ["var(--accent-bg)","var(--pos-bg)","var(--warn-bg)","var(--neg-bg)"];
  const coresTexto = ["var(--accent)","var(--pos)","var(--warn)","var(--neg)"];

  return (
    <div style={{padding:"28px 32px"}}>
      <div className="page-header">
        <div>
          <div className="page-title">Clientes</div>
          <div className="page-sub">Gestão de clientes</div>
        </div>
        <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>+ Novo cliente</button>
      </div>

      {mostrarForm && (
        <div className="card">
          <div className="card-head"><span className="card-title">Novo cliente</span></div>
          <form onSubmit={handleSubmit}>
            <label className="form-label">Nome</label>
            <input className="form-input" value={form.nome} onChange={e => setForm({...form,nome:e.target.value})} placeholder="Nome do cliente" required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">CPF / CNPJ</label>
                <input className="form-input" value={form.documento} onChange={e => setForm({...form,documento:e.target.value})} placeholder="000.000.000-00"/>
              </div>
              <div>
                <label className="form-label">Telefone</label>
                <input className="form-input" value={form.telefone} onChange={e => setForm({...form,telefone:e.target.value})} placeholder="(27) 99999-9999"/>
              </div>
            </div>
            <label className="form-label">Email</label>
            <input className="form-input" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="cliente@email.com"/>
            <div style={{display:"flex",gap:"10px",marginTop:"6px"}}>
              <button type="submit" className="btn-primary" disabled={carregando}>{carregando?"Salvando...":"Salvar"}</button>
              <button type="button" className="btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <span className="card-title">{clientes.length} cliente{clientes.length!==1?"s":""} cadastrado{clientes.length!==1?"s":""}</span>
        </div>
        {clientes.length === 0 ? (
          <p style={{fontSize:"14px",color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Nenhum cliente ainda. Clique em &quot;Novo cliente&quot; para adicionar.</p>
        ) : (
          clientes.map((c, i) => (
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 0",borderBottom:"0.5px solid var(--border)"}}>
              <div style={{width:"40px",height:"40px",borderRadius:"50%",background:cores[i%4],display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"600",color:coresTexto[i%4],flexShrink:0}}>
                {c.nome.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:"600",color:"var(--text)"}}>{c.nome}</div>
                <div style={{fontSize:"12px",color:"var(--text3)",marginTop:"2px"}}>{c.documento||"Sem documento"}{c.email?` · ${c.email}`:""}</div>
              </div>
              <div style={{fontSize:"12px",color:"var(--text3)"}}>{c.telefone||""}</div>
              <span className={`pill ${c.ativo?"pill-ativo":"pill-inativo"}`}>{c.ativo?"Ativo":"Inativo"}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
