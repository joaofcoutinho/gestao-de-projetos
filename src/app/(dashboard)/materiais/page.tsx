"use client";
import { useEffect, useState } from "react";
import type { Material } from "@/types/models";

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nome: "", categoria: "", quantidade: "", minimo: "5", custo: "" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    fetch("/api/materiais")
      .then(r => r.json())
      .then(data => setMateriais(Array.isArray(data) ? data : []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    await fetch("/api/materiais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await fetch("/api/materiais").then(r => r.json());
    setMateriais(Array.isArray(data) ? data : []);
    setForm({ nome: "", categoria: "", quantidade: "", minimo: "5", custo: "" });
    setMostrarForm(false);
    setCarregando(false);
  }

  function statusEstoque(qtd: number, min: number) {
    if (qtd === 0) return { cor: "var(--neg)", bg: "var(--neg-bg)", label: "Esgotado", pct: 0 };
    if (qtd <= min) return { cor: "var(--warn)", bg: "var(--warn-bg)", label: "Estoque baixo", pct: Math.round((qtd/min)*50) };
    return { cor: "var(--pos)", bg: "var(--pos-bg)", label: "Normal", pct: 100 };
  }

  return (
    <div style={{padding:"28px 32px"}}>
      <div className="page-header">
        <div>
          <div className="page-title">Materiais</div>
          <div className="page-sub">Controle de insumos e estoque</div>
        </div>
        <button className="btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>+ Novo item</button>
      </div>

      {mostrarForm && (
        <div className="card">
          <div className="card-head"><span className="card-title">Novo material</span></div>
          <form onSubmit={handleSubmit}>
            <label className="form-label">Nome</label>
            <input className="form-input" value={form.nome} onChange={e => setForm({...form,nome:e.target.value})} placeholder="Nome do material" required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Categoria</label>
                <input className="form-input" value={form.categoria} onChange={e => setForm({...form,categoria:e.target.value})} placeholder="Ex: Equipamento"/>
              </div>
              <div>
                <label className="form-label">Custo unitário (R$)</label>
                <input className="form-input" type="number" step="0.01" value={form.custo} onChange={e => setForm({...form,custo:e.target.value})} placeholder="0,00"/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label className="form-label">Quantidade</label>
                <input className="form-input" type="number" value={form.quantidade} onChange={e => setForm({...form,quantidade:e.target.value})} placeholder="0" required/>
              </div>
              <div>
                <label className="form-label">Quantidade mínima</label>
                <input className="form-input" type="number" value={form.minimo} onChange={e => setForm({...form,minimo:e.target.value})} placeholder="5"/>
              </div>
            </div>
            <div style={{display:"flex",gap:"10px",marginTop:"6px"}}>
              <button type="submit" className="btn-primary" disabled={carregando}>{carregando?"Salvando...":"Salvar"}</button>
              <button type="button" className="btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head"><span className="card-title">{materiais.length} item{materiais.length!==1?"s":""} cadastrado{materiais.length!==1?"s":""}</span></div>
        {materiais.length === 0 ? (
          <p style={{fontSize:"14px",color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Nenhum material ainda. Clique em &quot;Novo item&quot; para adicionar.</p>
        ) : (
          materiais.map(m => {
            const s = statusEstoque(m.quantidade, m.minimo);
            return (
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 0",borderBottom:"0.5px solid var(--border)"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
                    <span style={{fontSize:"14px",fontWeight:"600",color:"var(--text)"}}>{m.nome}</span>
                    {m.categoria && <span style={{fontSize:"11px",color:"var(--text3)",background:"var(--bg)",padding:"2px 8px",borderRadius:"4px"}}>{m.categoria}</span>}
                  </div>
                  <div style={{height:"4px",background:"var(--border)",borderRadius:"2px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.pct}%`,background:s.cor,borderRadius:"2px"}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",minWidth:"80px"}}>
                  <div style={{fontSize:"15px",fontWeight:"700",color:s.cor}}>{m.quantidade} un</div>
                  {m.custo && <div style={{fontSize:"11px",color:"var(--text3)"}}>R$ {m.custo.toFixed(2)}/un</div>}
                </div>
                <span className="pill" style={{background:s.bg,color:s.cor}}>{s.label}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
