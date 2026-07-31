// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
import {SeverityKind,SeverityLabel} from "../core/Badge.jsx";
export function SliderRow({label,value,onChange,max=10,severity}){
  const fg={clear:"var(--success)",mild:"#eab308",moderate:"#ea580c",severe:"var(--danger)"};
  return <div style={{display:"grid",gridTemplateColumns:severity?"60px 1fr 70px":"60px 1fr 24px",alignItems:"center",gap:8}}>
    <label style={{fontWeight:600,fontSize:"0.86rem",color:"var(--text-body)"}}>{label}</label>
    <input type="range" min={0} max={max} value={value} onChange={e=>onChange&&onChange(+e.target.value)} style={{width:"100%",accentColor:"var(--brand-blue)",cursor:"pointer"}}/>
    {severity?<span style={{textAlign:"right",whiteSpace:"nowrap"}}><span style={{fontWeight:700,fontSize:"0.95rem",color:"var(--brand-blue-deep)"}}>{value}</span><span style={{fontWeight:600,fontSize:"0.7rem",color:fg[SeverityKind(value)],marginLeft:5}}>{SeverityLabel(value)}</span></span>
    :<span style={{fontWeight:700,fontSize:"0.95rem",color:"var(--brand-blue-deep)",textAlign:"right"}}>{value}</span>}
  </div>;
}
