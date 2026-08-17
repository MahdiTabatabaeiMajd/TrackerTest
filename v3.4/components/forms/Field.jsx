// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function Field({label,note,children}){
  return <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:130}}>
    <span style={{fontSize:"0.74rem",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}</span>
    {children}
    {note&&<span style={{fontSize:"0.72rem",color:"var(--text-faint)",marginTop:2}}>{note}</span>}
  </div>;
}
const inputStyle={padding:"7px 10px",border:"1.5px solid var(--border-input)",borderRadius:9,background:"#fff",color:"var(--text-strong)",fontSize:"0.84rem",fontFamily:"inherit",outline:"none"};
export function TextInput(props){
  return <input {...props} style={{...inputStyle,...props.style}} onFocus={e=>e.target.style.borderColor="var(--brand-blue)"} onBlur={e=>e.target.style.borderColor="var(--border-input)"}/>;
}
export function Select({options=[],...props}){
  return <select {...props} style={{...inputStyle,...props.style}} onFocus={e=>e.target.style.borderColor="var(--brand-blue)"} onBlur={e=>e.target.style.borderColor="var(--border-input)"}>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>;
}
