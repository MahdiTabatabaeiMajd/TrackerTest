// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function TriggerSlider({label,value,display,onChange,min=0,max=10,step=1,scale=["None","Moderate","Extreme"]}){
  return <div style={{display:"flex",flexDirection:"column",gap:6}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)"}}>
      <span>{label}</span><span style={{fontWeight:700,color:"var(--brand-blue-deep)"}}>{display??value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange&&onChange(+e.target.value)} style={{width:"100%",accentColor:"var(--brand-teal)",cursor:"pointer"}}/>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",color:"var(--text-ghost)",padding:"0 2px"}}>{scale.map(s=><span key={s}>{s}</span>)}</div>
  </div>;
}
