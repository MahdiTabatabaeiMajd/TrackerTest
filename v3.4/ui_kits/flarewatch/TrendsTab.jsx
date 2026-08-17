// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {TrendChart,CHART_COLORS,Button}=window.FlareWatchDesignSystem_d30d0f;
const FWt=window.FW;
function TrendsTab(){
  // Sort defensively: data saved before addEntry kept the log sorted (or saved
  // by v2) can be in save order, not date order — the x-axis and the treatment
  // band index lookups below both require chronological entries.
  const entries=FWt.entries.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(-14);
  if(entries.length===0)return <div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontWeight:600,fontSize:"0.92rem",color:"var(--text-muted)",marginBottom:4}}>No data to chart yet</div><div style={{fontSize:"0.82rem",color:"var(--text-ghost)"}}>Log a few days in the Log tab — or press "Load 30-day demo" to preview.</div></div>;
  const dates=entries.map(e=>e.date.slice(5));
  const defs=[
    {key:"itch",title:"Itch",cat:"symptom",max:10,color:CHART_COLORS.itch,scores:entries.map(e=>e.symptoms[0]?.score??null)},
    {key:"pain",title:"Pain",cat:"symptom",max:10,color:CHART_COLORS.pain,scores:entries.map(e=>e.symptoms[1]?.score??null)},
    {key:"redness",title:"Redness",cat:"symptom",max:10,color:CHART_COLORS.redness,scores:entries.map(e=>e.symptoms[2]?.score??null)},
    {key:"scaling",title:"Scaling",cat:"symptom",max:10,color:CHART_COLORS.scaling,scores:entries.map(e=>e.symptoms[3]?.score??null)},
    {key:"stress",title:"Stress",cat:"trigger",max:10,color:CHART_COLORS.stress,scores:entries.map(e=>e.lifestyle?.stress??null)},
    {key:"sleep",title:"Sleep (h)",cat:"trigger",max:12,color:CHART_COLORS.sleep,scores:entries.map(e=>e.lifestyle?.sleepHours??null)},
    {key:"pm25",title:"PM2.5",cat:"trigger",max:60,color:CHART_COLORS.pm25,scores:entries.map(e=>e.environment?.pm25??null)},
    {key:"humidity",title:"Humidity (%)",cat:"trigger",max:100,color:CHART_COLORS.humidity,scores:entries.map(e=>e.environment?.humidity??null)}];
  const bands=FWt.treatments.map((t,ti)=>{
    const end=t.stopDate||"9999-12-31";
    let s=entries.findIndex(e=>e.date>=t.startDate);if(s<0)return null;
    let e2=-1;for(let i=entries.length-1;i>=0;i--){if(entries[i].date<=end){e2=i;break}}
    if(e2<0||s>e2)return null;
    return {id:t.id,startIdx:s,endIdx:e2,color:FWt.treatmentColor(ti),fullName:t.drug,isTopical:t.type==="topical",startDate:t.startDate,stopDate:t.stopDate};
  }).filter(Boolean);
  const [metrics,setMetrics]=React.useState(new Set(defs.map(d=>d.key)));
  const [treats,setTreats]=React.useState(new Set(bands.map(b=>b.id)));
  const toggleSet=(set,setFn,k)=>{const n=new Set(set);n.has(k)?n.delete(k):n.add(k);setFn(n)};
  const group=(title,items,set,setFn,hint,dot)=><div style={{padding:"8px 0",borderBottom:"1px solid var(--border-soft)"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
      <span style={{fontSize:"0.72rem",fontWeight:700,color:dot?"var(--brand-teal)":"var(--text-slate)",textTransform:"uppercase",letterSpacing:"0.5px"}}>{title}</span>
      {hint&&<span style={{fontSize:"0.7rem",color:"var(--text-ghost)",fontStyle:"italic",flex:1}}>{hint}</span>}
      <Button variant="mini" style={{marginLeft:hint?0:"auto"}} onClick={()=>setFn(new Set(items.map(i=>i.k)))}>All</Button>
      <Button variant="mini" onClick={()=>setFn(new Set())}>None</Button>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px"}}>
      {items.map(i=><label key={i.k} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:"0.82rem",color:"var(--text-body)",cursor:"pointer"}}>
        <input type="checkbox" checked={set.has(i.k)} onChange={()=>toggleSet(set,setFn,i.k)} style={{accentColor:"var(--brand-blue)",width:14,height:14,cursor:"pointer"}}/>
        {i.color&&<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="3" fill={i.color} fillOpacity="0.25"/><rect x="1" y="1" width="10" height="3.2" rx="1.6" fill={i.color}/></svg>}
        {i.label}</label>)}
    </div>
  </div>;
  const visible=defs.filter(d=>metrics.has(d.key));
  const activeBands=bands.filter(b=>treats.has(b.id));
  const anySymptom=visible.some(d=>d.cat==="symptom");
  return <div>
    <div style={{background:"var(--surface-panel)",border:"1.5px solid var(--border-default)",borderRadius:14,padding:"12px 16px",marginBottom:18}}>
      {group("Symptoms",defs.filter(d=>d.cat==="symptom").map(d=>({k:d.key,label:d.title})),metrics,k=>setMetrics(new Set([...defs.filter(d=>d.cat==="trigger"&&metrics.has(d.key)).map(d=>d.key),...k])))}
      {group("Triggers",defs.filter(d=>d.cat==="trigger").map(d=>({k:d.key,label:d.title})),metrics,k=>setMetrics(new Set([...defs.filter(d=>d.cat==="symptom"&&metrics.has(d.key)).map(d=>d.key),...k])))}
      {bands.length>0&&group("Treatments",bands.map(b=>({k:b.id,label:b.fullName,color:b.color})),treats,setTreats,"shown on symptom charts only",true)}
    </div>
    {visible.length===0?<p style={{textAlign:"center",color:"var(--text-ghost)",fontSize:"0.88rem",padding:"36px 0"}}>Select at least one metric above to see charts.</p>:
    <div style={{display:"grid",gridTemplateColumns:"var(--grid-2col)",gap:14}}>
      {visible.map(d=><TrendChart key={d.key} title={d.title} scores={d.scores} labels={dates} maxVal={d.max} color={d.color} bands={d.cat==="symptom"?activeBands:[]}/>)}
    </div>}
    <p style={{fontSize:"0.74rem",color:"var(--text-ghost)",textAlign:"center",marginTop:14}}>Last {entries.length} logged entries · gaps = no data that day</p>
    {anySymptom&&activeBands.length>0&&<div style={{marginTop:16,padding:"12px 16px",background:"var(--surface-panel)",border:"1.5px solid var(--border-default)",borderRadius:12}}>
      <p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px",margin:"0 0 10px"}}>Treatments shown on charts</p>
      {activeBands.map((b,i)=><div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontSize:"0.8rem",borderBottom:i<activeBands.length-1?"1px solid var(--border-soft)":"none"}}>
        <svg width="26" height="14" viewBox="0 0 26 14"><rect width="26" height="14" rx="3" fill={b.color} fillOpacity="0.18"/><rect width="26" height="3.5" rx="1.5" fill={b.color}/></svg>
        <span style={{fontWeight:600,color:"var(--text-strong)",flex:1}}>{b.fullName}</span>
        <span style={{fontSize:"0.66rem",fontWeight:700,padding:"2px 7px",borderRadius:20,textTransform:"uppercase",letterSpacing:"0.4px",background:"var(--border-soft)",color:"var(--text-slate-mid)"}}>{b.isTopical?"Topical":"Biologic"}</span>
        <span style={{fontSize:"0.74rem",color:"var(--text-faint)"}}>{b.startDate} → {b.stopDate||"ongoing"}</span>
      </div>)}
    </div>}
  </div>;
}
window.TrendsTab=TrendsTab;
