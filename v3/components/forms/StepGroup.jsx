// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function StepGroup({options,value,onChange,tips,ramp}){
  const [tip,setTip]=React.useState(-1);
  const RAMPS={risk:["var(--ramp-neutral)","var(--ramp-risk-1)","var(--ramp-risk-2)","var(--ramp-risk-3)"],good:["var(--ramp-good-0)","var(--ramp-good-1)","var(--ramp-good-2)","var(--ramp-good-3)"]};
  const sel=(i)=>ramp&&RAMPS[ramp]?RAMPS[ramp][Math.min(i,RAMPS[ramp].length-1)]:"var(--brand-teal)";
  return <div style={{display:"flex",gap:4,position:"relative"}}>
    {options.map((o,i)=><button key={o} onClick={()=>onChange&&onChange(i)}
      onMouseEnter={()=>tips&&setTip(i)} onMouseLeave={()=>setTip(-1)}
      style={{flex:1,padding:"10px 0",border:"1.5px solid",borderColor:i===value?sel(i):"var(--border-input)",borderRadius:8,background:i===value?sel(i):"var(--surface-input)",color:i===value?"#fff":"var(--text-muted)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"background .12s",position:"relative"}}>{o}
      {tips&&tip===i&&<span style={{position:"absolute",bottom:"calc(100% + 7px)",...(i===0?{left:0}:i===options.length-1?{right:0}:{left:"50%",transform:"translateX(-50%)"}),zIndex:30,width:200,padding:"8px 10px",borderRadius:9,background:"var(--splash-bg)",color:"#fff",fontSize:"0.72rem",fontWeight:500,lineHeight:1.5,textAlign:"left",boxShadow:"0 6px 18px rgba(19,42,49,.35)",pointerEvents:"none",whiteSpace:"normal"}}>{Array.isArray(tips[i])?tips[i].map(t=><span key={t} style={{display:"block"}}>{t}</span>):tips[i]}<span style={{position:"absolute",top:"100%",...(i===0?{left:18}:i===options.length-1?{right:18}:{left:"50%",transform:"translateX(-50%)"}),border:"5px solid transparent",borderTopColor:"var(--splash-bg)"}}></span></span>}
    </button>)}
  </div>;
}
