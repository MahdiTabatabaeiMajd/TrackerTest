// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
const base={fontFamily:"var(--font-ui)",cursor:"pointer",fontWeight:600,transition:"opacity .15s,transform .1s,background .12s,color .12s,border-color .12s"};
const variants={
primary:{...base,fontSize:"0.92rem",borderRadius:50,padding:"10px 26px",border:"none",background:"var(--grad-action)",color:"#fff",boxShadow:"var(--shadow-action)"},
secondary:{...base,fontSize:"0.92rem",borderRadius:50,padding:"10px 26px",border:"none",background:"#e2e8f0",color:"var(--text-body)"},
outline:{...base,fontSize:"0.92rem",borderRadius:50,padding:"10px 26px",background:"transparent",color:"var(--brand-blue)",border:"2px solid var(--brand-blue)"},
fetch:{...base,fontSize:"0.82rem",borderRadius:50,padding:"6px 14px",background:"transparent",color:"var(--brand-blue)",border:"1.5px solid var(--brand-blue)"},
add:{...base,fontSize:"0.84rem",borderRadius:12,padding:"9px 18px",background:"transparent",color:"var(--text-muted)",border:"2px dashed var(--border-input)",width:"100%"},
"danger-outline":{...base,fontSize:"0.78rem",borderRadius:20,padding:"6px 14px",background:"#fff",color:"var(--danger)",border:"1.5px solid var(--danger-border)"},
"success-outline":{...base,fontSize:"0.78rem",borderRadius:20,padding:"6px 14px",background:"#fff",color:"var(--success)",border:"1.5px solid var(--success-border)"},
ghost:{...base,fontSize:"0.72rem",borderRadius:20,padding:"4px 12px",background:"transparent",color:"var(--text-faint)",border:"1px dashed var(--border-input)"},
mini:{...base,fontSize:"0.66rem",borderRadius:20,padding:"2px 8px",background:"#fff",color:"var(--text-slate-mid)",border:"1px solid var(--border-input)"},
};
export function Button({variant="primary",disabled=false,fullWidth=false,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const [press,setPress]=React.useState(false);
  const v=variants[variant]||variants.primary;
  const lift=["primary","secondary","outline"].includes(variant);
  const hoverStyle=hover&&!disabled?(lift?{opacity:.85,transform:press?"translateY(0)":"translateY(-1px)"}:variant==="fetch"?{background:"var(--tint-hover)"}:variant==="add"?{borderColor:"var(--brand-blue)",color:"var(--brand-blue)"}:variant==="danger-outline"?{background:"var(--danger-bg)"}:variant==="success-outline"?{background:"var(--success-bg)"}:variant==="mini"?{borderColor:"var(--brand-blue)",color:"var(--brand-blue)"}:{opacity:.85}):{};
  return <button disabled={disabled} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setPress(false)}} onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
    style={{...v,...(fullWidth?{width:"100%"}:{}),...(disabled?{opacity:.5,cursor:"default"}:{}),...hoverStyle,...style}} {...rest}>{children}</button>;
}
