// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const FWi=window.FW;
function InsightsTab(){
  const entries=FWi.entries;
  if(entries.length<3)return <div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontWeight:600,fontSize:"0.92rem",color:"var(--text-muted)",marginBottom:4}}>Not enough data for insights</div><div style={{fontSize:"0.82rem",color:"var(--text-ghost)"}}>Correlations need at least 3 logged days — or press "Load 30-day demo" to preview.</div></div>;
  const triggers=[
    {label:"Stress",get:e=>e.lifestyle.stress},{label:"Sleep (h)",get:e=>e.lifestyle.sleepHours},
    {label:"Alcohol",get:e=>e.lifestyle.alcohol},{label:"Exercise",get:e=>e.lifestyle.exercise},
    {label:"Smoking",get:e=>e.lifestyle.smoking?1:0,binary:true},{label:"Infection",get:e=>e.lifestyle.infection?1:0,binary:true},
    {label:"Skin trauma",get:e=>e.lifestyle.koebner?1:0,binary:true},
    {label:"Temperature",get:e=>e.environment.temperature},{label:"Humidity",get:e=>e.environment.humidity},
    {label:"PM2.5",get:e=>e.environment.pm25},{label:"PM10",get:e=>e.environment.pm10},{label:"NO₂",get:e=>e.environment.no2}];
  const symptoms=["Itch","Pain","Redness","Scaling","Flare"];
  const score=(e,n)=>n==="Flare"?(e.isFlareDay?1:0):e.symptoms.find(s=>s.name===n)?.score??null;
  const cells=[];
  triggers.forEach(t=>symptoms.forEach(sym=>{
    const pairs=entries.map(e=>({x:t.get(e),y:score(e,sym)})).filter(p=>p.x!=null&&p.y!=null);
    const r=pairs.length>=3?FWi.pearsonR(pairs.map(p=>p.x),pairs.map(p=>p.y)):null;
    cells.push({trig:t,sym,r,n:pairs.length});
  }));
  const corrStyles={sp:{background:"#fee2e2",color:"#991b1b"},mp:{background:"#fef3c7",color:"#92400e"},w:{background:"#f1f5f9",color:"#64748b"},mn:{background:"#dcfce7",color:"#166534"},sn:{background:"#bbf7d0",color:"#14532d"},nil:{background:"#f8fafc",color:"#cbd5e0"}};
  const findings=cells.filter(c=>c.r!==null&&Math.abs(c.r)>=0.3).sort((a,b)=>Math.abs(b.r)-Math.abs(a.r));
  const per={},chosen=[];
  for(const f of findings){if((per[f.trig.label]||0)>=2)continue;per[f.trig.label]=(per[f.trig.label]||0)+1;chosen.push(f);if(chosen.length>=5)break}
  const flareDays=entries.filter(e=>e.isFlareDay),calmDays=entries.filter(e=>!e.isFlareDay);
  const avg=(days,get)=>{const v=days.map(get).filter(x=>x!=null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null};
  const flareR={};cells.forEach(c=>{if(c.sym==="Flare")flareR[c.trig.label]=c.r});
  const fcRows=triggers.map(t=>{const f=avg(flareDays,t.get),c=avg(calmDays,t.get);if(f==null||c==null)return null;
    const all=entries.map(t.get).filter(x=>x!=null);const dataMax=all.length?Math.max(...all,0.0001):1;
    return {trig:t,f,c,dataMax,rank:Math.abs(flareR[t.label]||0)}})
    .filter(Boolean).filter(r=>Math.abs(r.f-r.c)>0.001).sort((a,b)=>b.rank-a.rank).slice(0,6);
  const secTitle=(t,sub)=><React.Fragment><h4 style={{fontSize:"0.9rem",fontWeight:700,color:"var(--text-strong)",margin:"0 0 3px"}}>{t}</h4><p style={{fontSize:"0.76rem",color:"var(--text-faint)",lineHeight:1.5,margin:"0 0 12px"}}>{sub}</p></React.Fragment>;
  const meter=r=>{const w=Math.max(Math.min(Math.abs(r),1)*120,2);return <svg width="120" height="8" style={{flexShrink:0,display:"block"}}><rect width="120" height="8" rx="4" fill="#eef2f6"/><rect width={w} height="8" rx="4" fill={r>=0?"#ef4444":"#10b981"}/></svg>};
  const hbar=(v,max,color)=>{const w=v>0?Math.max((v/max)*150,3):0;return <svg width="150" height="12" style={{flexShrink:0,display:"block"}}><rect width="150" height="12" rx="6" fill="#eef2f6"/><rect width={w} height="12" rx="6" fill={color}/></svg>};
  const fmt=(t,v)=>t.binary?Math.round(v*100)+"% of days":String(Math.round(v*10)/10);
  const dLabel=n=>n+" day"+(n===1?"":"s");
  return <div>
    <div style={{background:"var(--warn-bg)",border:"1.5px solid var(--warn-border)",borderRadius:12,padding:"10px 16px",fontSize:"0.78rem",color:"var(--status-moderate-fg)",marginBottom:18,lineHeight:1.6}}>
      ⚠️ These are statistical patterns in <em>your own data</em>, not clinical findings. Correlation does not prove causation. Discuss any concerns with your dermatologist.
    </div>
    <div style={{marginBottom:26}}>
      {secTitle("What your data suggests","Your strongest day-to-day patterns, in plain language.")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {chosen.map((f,i)=>{const pos=f.r>0;const strong=Math.abs(f.r)>=0.5;
          return <div key={i} style={{border:"1.5px solid var(--border-default)",borderRadius:14,padding:"14px 16px",background:"#fff"}}>
            <p style={{fontSize:"0.86rem",color:"var(--text-strong)",lineHeight:1.5,margin:"0 0 10px"}}>
              {f.sym==="Flare"
                ?<span>On days with more <b>{f.trig.label}</b>, you tend {pos?"":"not "}to have a <b>flare</b>.</span>
                :<span>On days with more <b>{f.trig.label}</b>, your <b>{f.sym.toLowerCase()}</b> tends to be {pos?"higher":"lower"}.</span>}
            </p>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              {meter(f.r)}
              <span style={{fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3px",color:pos?"#dc2626":"#059669"}}>{strong?"strong link":"moderate link"}</span>
            </div>
            <p style={{fontSize:"0.72rem",color:"var(--text-ghost)",margin:0}}>Seen across {f.n} logged days</p>
          </div>})}
      </div>
    </div>
    {fcRows.length>0&&<div style={{marginBottom:26}}>
      {secTitle("Flare days vs calm days",`Your average trigger levels on the ${dLabel(flareDays.length)} you flared, compared with the ${dLabel(calmDays.length)} you didn’t.`)}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <span style={{fontSize:"0.72rem",fontWeight:600,padding:"3px 12px",borderRadius:20,background:"#fee2e2",color:"#991b1b"}}>Flare days</span>
        <span style={{fontSize:"0.72rem",fontWeight:600,padding:"3px 12px",borderRadius:20,background:"#dcfce7",color:"#166534"}}>Calm days</span>
      </div>
      {fcRows.map((r,i)=><div key={i} style={{border:"1.5px solid var(--border-default)",borderRadius:14,background:"var(--surface-flat)",padding:"12px 16px",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <span style={{fontSize:"0.84rem",fontWeight:700,color:"var(--text-body)"}}>{r.trig.label}</span>
          <span style={{fontSize:"0.68rem",fontWeight:600,padding:"2px 10px",borderRadius:20,background:r.f>r.c?"#fef2f2":"#f0fdf4",color:r.f>r.c?"#dc2626":"#059669"}}>{r.f>r.c?"higher on flare days":"higher on calm days"}</span>
        </div>
        {[["Flare",r.f,"#ef4444"],["Calm",r.c,"#10b981"]].map(([k,v,col])=><div key={k} style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
          <span style={{fontSize:"0.74rem",color:"var(--text-muted)",width:38,flexShrink:0}}>{k}</span>{hbar(v,r.dataMax,col)}
          <span style={{fontSize:"0.78rem",fontWeight:600,color:"var(--text-body)"}}>{fmt(r.trig,v)}</span>
        </div>)}
      </div>)}
    </div>}
    <div>
      {secTitle("Full correlation matrix","Every trigger against every symptom. Each number is a correlation from −1 to +1 — the further from 0, the stronger the link; red = symptom rises with the trigger, green = symptom falls.")}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,fontSize:"0.74rem"}}>
        {[["Strong +","sp"],["Moderate +","mp"],["Weak / none","w"],["Moderate −","mn"],["Strong −","sn"]].map(([l,c])=><span key={c} style={{padding:"3px 10px",borderRadius:20,fontWeight:600,...corrStyles[c]}}>{l}</span>)}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
          <thead><tr>{["Trigger",...symptoms].map(h=><th key={h} style={{padding:"8px 10px",fontSize:"0.72rem",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",background:"var(--surface-panel)",borderBottom:"2px solid var(--border-default)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{triggers.map(t=><tr key={t.label}>
            <td style={{padding:"8px 10px",borderBottom:"1px solid var(--border-hair)",fontWeight:500,color:"var(--text-body)",whiteSpace:"nowrap"}}>{t.label}</td>
            {symptoms.map(sym=>{const c=cells.find(x=>x.trig===t&&x.sym===sym);const cls=FWi.corrClass(c.r);
              return <td key={sym} style={{padding:"8px 10px",borderBottom:"1px solid var(--border-hair)",fontWeight:600,textAlign:"center",whiteSpace:"nowrap",...corrStyles[cls]}}>{c.r!==null?c.r.toFixed(2):"—"}</td>})}
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  </div>;
}
window.InsightsTab=InsightsTab;
