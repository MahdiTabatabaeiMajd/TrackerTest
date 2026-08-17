// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function Toast({visible=true,children}){
  if(!visible)return null;
  return <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"var(--brand-blue)",color:"#fff",padding:"10px 22px",borderRadius:50,fontSize:"0.88rem",fontWeight:600,boxShadow:"var(--shadow-toast)",zIndex:999,fontFamily:"var(--font-ui)"}}>{children}</div>;
}
