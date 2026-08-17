// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
const kinds={
clear:{background:"var(--severity-clear-bg)",color:"var(--severity-clear-fg)"},
mild:{background:"var(--severity-mild-bg)",color:"var(--severity-mild-fg)"},
moderate:{background:"var(--severity-moderate-bg)",color:"var(--severity-moderate-fg)"},
severe:{background:"var(--severity-severe-bg)",color:"var(--severity-severe-fg)"},
flare:{background:"var(--severity-severe-bg)",color:"var(--severity-severe-fg)",fontWeight:600,fontSize:"0.76rem"},
topical:{background:"var(--tint-blue-bg)",color:"var(--tint-blue-fg)",fontWeight:700,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.4px"},
biologic:{background:"var(--tint-teal-bg)",color:"var(--tint-teal-fg)",fontWeight:700,fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.4px"},
type:{background:"var(--border-soft)",color:"var(--text-slate-mid)",fontWeight:700,fontSize:"0.66rem",textTransform:"uppercase",letterSpacing:"0.4px"},
};
export function Badge({kind="clear",children}){
  return <span style={{padding:"2px 10px",borderRadius:20,fontSize:"0.78rem",whiteSpace:"nowrap",...kinds[kind]}}>{children}</span>;
}
export function SeverityKind(score){if(score===0)return"clear";if(score<=3)return"mild";if(score<=5)return"moderate";return"severe"}
export function SeverityLabel(score){if(score===0)return"Clear";if(score<=3)return"Mild";if(score<=5)return"Moderate";return"Severe"}
