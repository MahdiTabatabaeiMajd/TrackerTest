// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {Button,Badge,SeverityKind,SeverityLabel}=window.FlareWatchDesignSystem_d30d0f;
function HistoryTab(){
  const [entries,setEntries]=React.useState(window.FW.entries);
  const [archived,setArchived]=React.useState(0);
  const del=i=>setEntries(entries.filter((_,j)=>j!==i));
  return <div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
      {entries.length>0&&<Button variant="danger-outline" onClick={()=>{setArchived(archived+entries.length);setEntries([])}}>Archive all entries</Button>}
      {archived>0&&<Button variant="success-outline" onClick={()=>{setEntries(window.FW.entries);setArchived(0)}}>↩ Restore {archived} archived entries</Button>}
    </div>
    {entries.length===0&&<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontWeight:600,fontSize:"0.92rem",color:"var(--text-muted)",marginBottom:4}}>{archived>0?"No active entries":"No entries yet"}</div><div style={{fontSize:"0.82rem",color:"var(--text-ghost)"}}>{archived>0?`${archived} entries are archived — restore them above.`:"Open the Log tab to record your first day."}</div></div>}
    {entries.slice().reverse().map((e,ri)=>{
      const i=entries.length-1-ri;const l=e.lifestyle,ev=e.environment;
      return <div key={e.date} style={{border:"1px solid var(--border-soft)",borderRadius:16,padding:"14px 18px",marginBottom:12,background:"var(--surface-flat)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:"0.92rem",color:"var(--text-strong)",flex:1}}>{e.date}</span>
          {e.isFlareDay&&<Badge kind="flare">Flare day</Badge>}
          <button onClick={()=>del(i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--border-input)",fontSize:"0.95rem",padding:"2px 4px",borderRadius:6}} onMouseEnter={ev2=>{ev2.currentTarget.style.color="var(--danger-soft)";ev2.currentTarget.style.background="#fff1f1"}} onMouseLeave={ev2=>{ev2.currentTarget.style.color="var(--border-input)";ev2.currentTarget.style.background=""}}>✕</button>
        </div>
        {e.symptoms.map((s,si)=><div key={s.name} style={{display:"grid",gridTemplateColumns:"70px 46px 1fr auto",alignItems:"start",gap:9,padding:"5px 0",borderBottom:si<3?"1px solid var(--border-default)":"none",fontSize:"0.83rem"}}>
          <span style={{fontWeight:600,color:"var(--text-body)"}}>{s.name}</span>
          <span style={{color:"var(--text-muted)"}}>{s.score}/10</span>
          <span style={{color:"var(--text-strong)",lineHeight:1.6}}>{s.parts.join(", ")||"—"}</span>
          <Badge kind={SeverityKind(s.score)}>{SeverityLabel(s.score)}</Badge>
        </div>)}
        <div style={{fontSize:"0.74rem",color:"var(--text-muted)",marginTop:8,lineHeight:1.7,paddingTop:8,borderTop:"1px solid var(--border-hair)",whiteSpace:"pre-line"}}>
          {"🌤 "+ev.weatherDesc+" · "+ev.temperature+"°C · "+ev.humidity+"% RH · PM2.5 "+ev.pm25+" · PM10 "+ev.pm10+" · NO₂ "+ev.no2+" · "+ev.season+"\nStress "+l.stress+"/10 · Sleep "+l.sleepHours+" h · Alcohol: "+window.FW.ALCOHOL_LABELS[l.alcohol]+" · Exercise: "+window.FW.EXERCISE_LABELS[l.exercise]+(l.smoking?" · Smoking":"")+(l.infection?" · Infection":"")+(l.koebner?" · Skin trauma":"")}
        </div>
      </div>})}
  </div>;
}
window.HistoryTab=HistoryTab;
