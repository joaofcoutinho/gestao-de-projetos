"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const resultado = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (resultado?.error) {
      setErro("Email ou senha incorretos");
      setCarregando(false);
    } else {
      router.push("/painel");
    }
  }

  return (
    <div style={{minHeight:"100vh",background:"#F7F8FA",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:"16px",border:"0.5px solid #E8EAF0",padding:"40px",width:"100%",maxWidth:"400px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"32px"}}>
          <div style={{width:"40px",height:"40px",borderRadius:"10px",background:"#1A1F36",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 22 22" fill="none" width="24" height="24">
              <path d="M3 15 L7 9 L11 13 L16 5" stroke="#5B8EF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="5" r="2" fill="#5B8EF0"/>
              <rect x="3" y="17" width="2.5" height="2.5" rx="0.5" fill="#3D5FAF" opacity=".7"/>
              <rect x="7" y="15" width="2.5" height="4.5" rx="0.5" fill="#3D5FAF" opacity=".8"/>
              <rect x="11" y="16" width="2.5" height="3.5" rx="0.5" fill="#4A72CF" opacity=".9"/>
              <rect x="15" y="13" width="2.5" height="6.5" rx="0.5" fill="#5B8EF0"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:"20px",fontWeight:"600",color:"#141417",letterSpacing:"-0.4px"}}>MeuFluxo</div>
            <div style={{fontSize:"11px",color:"#A0A3AE",letterSpacing:"0.7px",textTransform:"uppercase"}}>ERP para MEI</div>
          </div>
        </div>

        <h1 style={{fontSize:"18px",fontWeight:"600",color:"#141417",marginBottom:"6px"}}>Entrar na sua conta</h1>
        <p style={{fontSize:"13px",color:"#6B6F7E",marginBottom:"24px"}}>Digite seu email e senha para acessar</p>

        {erro && (
          <div style={{background:"#FFF2F2",border:"0.5px solid #E05252",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",fontSize:"13px",color:"#E05252"}}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:"16px"}}>
            <label style={{fontSize:"12px",fontWeight:"500",color:"#484C5E",display:"block",marginBottom:"6px"}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{width:"100%",padding:"10px 14px",borderRadius:"8px",border:"0.5px solid #E8EAF0",fontSize:"13px",color:"#141417",outline:"none",background:"#fff"}}
            />
          </div>
          <div style={{marginBottom:"24px"}}>
            <label style={{fontSize:"12px",fontWeight:"500",color:"#484C5E",display:"block",marginBottom:"6px"}}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              style={{width:"100%",padding:"10px 14px",borderRadius:"8px",border:"0.5px solid #E8EAF0",fontSize:"13px",color:"#141417",outline:"none",background:"#fff"}}
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            style={{width:"100%",padding:"11px",borderRadius:"8px",background:"#3B6BE8",color:"#fff",fontSize:"13px",fontWeight:"500",border:"none",cursor:"pointer"}}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"#6B6F7E"}}>
          Não tem conta?{" "}
          <Link href="/cadastro" style={{color:"#3B6BE8",fontWeight:"500",textDecoration:"none"}}>
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
