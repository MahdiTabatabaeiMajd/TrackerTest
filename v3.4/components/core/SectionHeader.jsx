// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function SectionHeader({align="left",children,style}){
  return <p style={{fontSize:"0.78rem",fontWeight:700,color:"var(--brand-blue-deep)",textTransform:"uppercase",letterSpacing:"0.6px",margin:"0 0 12px",textAlign:align,...style}}>{children}</p>;
}
