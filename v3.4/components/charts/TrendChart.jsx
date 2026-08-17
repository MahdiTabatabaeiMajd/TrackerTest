// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
// Port of buildLineChart from js/v2/trends.js — same geometry, colors, and band treatment.
export function TrendChart({scores,labels,maxVal=10,color="#e11d48",bands=[],title}){
  const W=280,H=120,padL=24,padB=24,padT=14,padR=6;
  const cW=W-padL-padR,cH=H-padT-padB,n=scores.length;
  const xOf=i=>padL+(n===1?cW/2:(i/(n-1))*cW);
  const yOf=v=>padT+cH-(v/maxVal)*cH;
  const segments=[];let cur=null;
  scores.forEach((v,i)=>{if(v!==null&&v!==undefined){if(!cur){cur=[];segments.push(cur)}cur.push({i,v})}else cur=null});
  return <div style={{border:"1.5px solid var(--border-default)",borderRadius:14,padding:"12px 14px",background:"var(--surface-flat)"}}>
    {title&&<h4 style={{fontSize:"0.82rem",fontWeight:600,color:"var(--text-body)",margin:"0 0 6px"}}>{title}</h4>}
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",overflow:"visible"}} preserveAspectRatio="xMidYMid meet">
      {bands.map((b,k)=>{const x1=xOf(b.startIdx),x2=xOf(b.endIdx),bw=Math.max(x2-x1,4);return <g key={k}>
        <rect x={x1} y={padT} width={bw} height={cH} fill={b.color} fillOpacity="0.13"/>
        <rect x={x1} y={padT} width={bw} height={3} fill={b.color}/>
        <line x1={x1} y1={padT} x2={x1} y2={padT+cH} stroke={b.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
        <line x1={x2} y1={padT} x2={x2} y2={padT+cH} stroke={b.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/></g>})}
      {[0,Math.round(maxVal/2),maxVal].map(v=><g key={v}>
        <line x1={padL} y1={yOf(v)} x2={W-padR} y2={yOf(v)} stroke="var(--chart-grid)" strokeWidth="1"/>
        <text x={padL-3} y={yOf(v)+3} textAnchor="end" fontSize="8" fill="var(--text-ghost)">{v}</text></g>)}
      {segments.map((seg,k)=>seg.length<2?null:<polyline key={k} points={seg.map(p=>`${xOf(p.i)},${yOf(p.v)}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>)}
      {scores.map((v,i)=>(v===null||v===undefined)?null:<g key={i}>
        <circle cx={xOf(i)} cy={yOf(v)} r="3" fill="white" stroke={color} strokeWidth="1.5"/>
        {v>0&&<text x={xOf(i)} y={yOf(v)-5} textAnchor="middle" fontSize="7.5" fill="var(--text-body)">{v}</text>}</g>)}
      {scores.map((_,i)=>(n>8&&i%2!==0)?null:<text key={i} x={xOf(i)} y={padT+cH+14} textAnchor="middle" fontSize="7.5" fill="var(--text-ghost)">{labels?.[i]||""}</text>)}
      <line x1={padL} y1={padT} x2={padL} y2={padT+cH} stroke="var(--chart-axis)" strokeWidth="1"/>
      <line x1={padL} y1={padT+cH} x2={W-padR} y2={padT+cH} stroke="var(--chart-axis)" strokeWidth="1"/>
    </svg>
  </div>;
}
export const CHART_COLORS={itch:"#e11d48",pain:"#ea580c",redness:"#db2777",scaling:"#9333ea",stress:"#4f46e5",sleep:"#0d9488",pm25:"#64748b",humidity:"#0284c7"};
export const TREATMENT_COLORS=["#2a78d6","#1baf7a","#eda100","#008300","#4a3aa7","#e34948"];
