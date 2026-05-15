"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const nav = [
    { label: "Painel", path: "/painel", icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></> },
    { label: "Financeiro", path: "/financeiro", icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></> },
    { label: "NFS-e", path: "/nfse", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
    { label: "Materiais", path: "/materiais", icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></> },
    { label: "Clientes", path: "/clientes", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
    { label: "DAS-MEI", path: "/das", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
  ];

  return (
    <div style={{display:"flex",height:"100vh",background:"var(--bg)",fontFamily:"var(--font)"}}>
      <aside style={{width:"240px",minWidth:"240px",background:"var(--surface)",borderRight:"0.5px solid var(--border)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"26px 24px 22px",borderBottom:"0.5px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"var(--logo-bg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg viewBox="0 0 22 22" fill="none" width="22" height="22">
                <path d="M3 15 L7 9 L11 13 L16 5" stroke="#5B8EF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="5" r="2" fill="#5B8EF0"/>
                <rect x="3" y="17" width="2.5" height="2.5" rx="0.5" fill="#3D5FAF" opacity=".7"/>
                <rect x="7" y="15" width="2.5" height="4.5" rx="0.5" fill="#3D5FAF" opacity=".8"/>
                <rect x="11" y="16" width="2.5" height="3.5" rx="0.5" fill="#4A72CF" opacity=".9"/>
                <rect x="15" y="13" width="2.5" height="6.5" rx="0.5" fill="#5B8EF0"/>
              </svg>
            </div>
            <div>
              <div style={{fontSize:"18px",fontWeight:"700",color:"var(--text)",letterSpacing:"-0.4px"}}>MeuFluxo</div>
              <div style={{fontSize:"10px",color:"var(--text3)",letterSpacing:"0.7px",textTransform:"uppercase"}}>ERP para MEI</div>
            </div>
          </div>
        </div>

        <nav style={{flex:1,padding:"16px 0",overflowY:"auto"}}>
          {[
            { group: "Principal", items: nav.slice(0,4) },
            { group: "Relacionamento", items: [nav[4]] },
            { group: "Fiscal", items: [nav[5]] },
          ].map(({ group, items }) => (
            <div key={group}>
              <div style={{fontSize:"10px",color:"var(--text3)",letterSpacing:"0.7px",textTransform:"uppercase",padding:"10px 24px 4px"}}>{group}</div>
              {items.map(item => (
                <div key={item.path} onClick={() => router.push(item.path)}
                  style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 24px",fontSize:"14px",color:pathname===item.path?"var(--accent)":"var(--text2)",cursor:"pointer",background:pathname===item.path?"var(--accent-bg)":"transparent",borderRight:pathname===item.path?"2px solid var(--accent)":"none",fontWeight:pathname===item.path?"600":"400"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    {item.icon}
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div style={{padding:"16px 24px",borderTop:"0.5px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"var(--accent-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"600",color:"var(--accent)",flexShrink:0}}>JS</div>
            <div>
              <div style={{fontSize:"13px",fontWeight:"600",color:"var(--text)"}}>Meu MEI</div>
              <div style={{fontSize:"11px",color:"var(--text3)"}}>Guarapari/ES</div>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} style={{marginLeft:"auto",fontSize:"11px",color:"var(--text3)",background:"none",border:"none",cursor:"pointer"}}>Sair</button>
          </div>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <div style={{background:"var(--surface)",borderBottom:"0.5px solid var(--border)",height:"60px",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"12px",flexShrink:0}}>
          <div onClick={() => setDark(!dark)}
            style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 14px",borderRadius:"8px",border:"0.5px solid var(--border)",background:"var(--surface)",cursor:"pointer",userSelect:"none"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {dark
                ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                : <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>}
            </svg>
            <span style={{fontSize:"12px",color:"var(--text2)",fontWeight:"500"}}>{dark ? "Modo claro" : "Modo escuro"}</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",background:"var(--bg)"}}>
          {children}
        </div>
      </div>
    </div>
  );
}
