// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function ToggleGroup({value=0,onChange,labels=["No","Yes"]}){
  const styles=[
    value===0?{background:"var(--surface-rail)",color:"var(--text-slate)",borderColor:"var(--text-faint)"}:{background:"var(--surface-input)",color:"var(--text-muted)",borderColor:"var(--border-input)"},
    value===1?{background:"var(--status-moderate-bg)",color:"var(--status-moderate-fg)",borderColor:"var(--warn-amber)"}:{background:"var(--surface-input)",color:"var(--text-muted)",borderColor:"var(--border-input)"},
  ];
  return <div style={{display:"flex",gap:4}}>
    {labels.map((l,i)=><button key={l} onClick={()=>onChange&&onChange(i)}
      style={{flex:1,padding:"10px 0",border:"1.5px solid",borderRadius:8,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .12s",...styles[i]}}>{l}</button>)}
  </div>;
}
