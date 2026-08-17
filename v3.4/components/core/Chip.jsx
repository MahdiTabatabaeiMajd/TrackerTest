// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
const tones={neutral:{background:"var(--surface-rail)",color:"var(--text-slate)"},good:{background:"var(--status-good-bg)",color:"var(--status-good-fg)"},moderate:{background:"var(--status-moderate-bg)",color:"var(--status-moderate-fg)"},poor:{background:"var(--status-poor-bg)",color:"var(--status-poor-fg)"}};
export function Chip({variant="part",tone="neutral",selected=false,onRemove,onClick,children}){
  if(variant==="env")return <span style={{display:"inline-flex",alignItems:"center",gap:4,borderRadius:20,padding:"5px 12px",fontSize:"0.78rem",fontWeight:500,...tones[tone]}}>{children}</span>;
  if(variant==="area")return <label onClick={onClick} style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.76rem",cursor:"pointer",borderRadius:20,padding:"6px 11px",background:selected?"var(--tint-blue-bg)":"var(--surface-rail)",color:selected?"var(--tint-blue-fg)":"var(--text-body)"}}><input type="checkbox" readOnly checked={selected} style={{accentColor:"var(--brand-blue)",width:13,height:13,cursor:"pointer"}}/>{children}</label>;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--tint-chip-bg)",color:"var(--tint-chip-fg)",borderRadius:20,padding:"4px 10px 4px 11px",fontSize:"0.74rem",fontWeight:500}}>{children}
    {onRemove&&<button onClick={onRemove} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tint-chip-fg)",fontSize:"0.78rem",padding:0,lineHeight:1,display:"flex",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.color="var(--danger)"} onMouseLeave={e=>e.currentTarget.style.color="var(--tint-chip-fg)"}>✕</button>}</span>;
}
