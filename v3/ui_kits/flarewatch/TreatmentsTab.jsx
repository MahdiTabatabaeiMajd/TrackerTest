// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {Button,Badge,Field,TextInput,Select}=window.FlareWatchDesignSystem_d30d0f;
const FWd=window.FW;
function swatchSvg(color){return <svg width="14" height="14" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="3" fill={color} fillOpacity="0.25"/><rect x="1" y="1" width="10" height="3.2" rx="1.6" fill={color}/></svg>}
function TreatmentCard({t,idx,onStop,onDel}){
  const topical=t.type==="topical";const color=FWd.treatmentColor(idx);
  return <div style={{borderRadius:14,padding:"13px 16px",marginBottom:10,borderLeft:"4px solid "+color,background:topical?"#eaf3f9":"#e3f7f2"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
      {swatchSvg(color)}
      <Badge kind={topical?"topical":"biologic"}>{topical?"Topical":"Biologic"}</Badge>
      <span style={{fontWeight:600,fontSize:"0.9rem",color:"var(--text-strong)",flex:1}}>{t.drug}</span>
      <button onClick={onDel} style={{background:"none",border:"none",cursor:"pointer",color:"var(--border-input)",fontSize:"0.95rem",padding:"2px 4px"}}>✕</button>
    </div>
    {t.bodyAreas.length>0&&<div style={{fontSize:"0.76rem",color:"var(--text-body)",marginBottom:3}}>Areas: {t.bodyAreas.join(", ")}</div>}
    <div style={{fontSize:"0.76rem",color:"var(--text-muted)",fontStyle:"italic",marginBottom:4}}>Started {t.startDate}{t.stopDate?"  →  Stopped "+t.stopDate:"  →  Ongoing"}</div>
    {t.notes&&<div style={{fontSize:"0.76rem",color:"var(--text-faint)",borderTop:"1px solid var(--border-default)",marginTop:6,paddingTop:5}}>{t.notes}</div>}
    {!t.stopDate&&<Button variant="danger-outline" style={{marginTop:8,fontSize:"0.76rem",padding:"4px 12px"}} onClick={onStop}>Mark as stopped today</Button>}
  </div>;
}
function TreatmentsTab(){
  const [treatments,setTreatments]=React.useState(FWd.treatments);
  const [form,setForm]=React.useState(null); // null | "topical" | "biologic"
  const [areas,setAreas]=React.useState([]);
  const areaOpts=["Scalp","Head","Neck","Torso","L. forearm","R. forearm","L. hand","R. hand","L. knee","R. knee","L. lower leg","R. lower leg"];
  const today=new Date().toISOString().slice(0,10);
  const active=treatments.filter(t=>!t.stopDate),past=treatments.filter(t=>t.stopDate);
  const head=txt=><p style={{fontSize:"0.72rem",fontWeight:700,color:"var(--text-ghost)",textTransform:"uppercase",letterSpacing:"0.5px",margin:"14px 0 8px"}}>{txt}</p>;
  const stop=t=>setTreatments(treatments.map(x=>x===t?{...x,stopDate:today}:x));
  const del=t=>setTreatments(treatments.filter(x=>x!==t));
  const topicalDrugs=FWd.TOPICAL_CLASSES.flatMap(c=>c.drugs),biologicDrugs=FWd.BIOLOGIC_CLASSES.flatMap(c=>c.drugs);
  return <div>
    {!form&&<div style={{display:"flex",gap:10,marginBottom:18}}>
      <Button variant="add" onClick={()=>setForm("topical")}>＋ Topical steroid</Button>
      <Button variant="add" onClick={()=>setForm("biologic")}>＋ Biologic</Button>
    </div>}
    {form&&<div style={{background:"var(--surface-tint-primary)",border:"1.5px solid var(--border-default)",borderRadius:16,padding:"18px 20px",marginBottom:16}}>
      <div style={{display:"flex",gap:16,marginBottom:14}}>
        {["topical","biologic"].map(ty=><label key={ty} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)",cursor:"pointer"}}>
          <input type="radio" checked={form===ty} onChange={()=>setForm(ty)} style={{accentColor:"var(--brand-blue)"}}/>{ty==="topical"?"Topical steroid":"Biologic"}</label>)}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
        <Field label="Drug"><Select options={form==="topical"?topicalDrugs:biologicDrugs}/></Field>
      </div>
      {form==="topical"&&<div style={{marginBottom:12}}>
        <span style={{fontSize:"0.74rem",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px"}}>Body areas</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
          {areaOpts.map(a=><label key={a} style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.76rem",cursor:"pointer",borderRadius:20,padding:"3px 9px",background:areas.includes(a)?"var(--tint-blue-bg)":"var(--surface-rail)",color:areas.includes(a)?"var(--tint-blue-fg)":"var(--text-body)"}}>
            <input type="checkbox" checked={areas.includes(a)} onChange={()=>setAreas(areas.includes(a)?areas.filter(x=>x!==a):[...areas,a])} style={{accentColor:"var(--brand-blue)",width:13,height:13}}/>{a}</label>)}
        </div>
      </div>}
      <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
        <Field label="Start date"><TextInput type="date" defaultValue={today}/></Field>
        <Field label="Stop date (leave blank if ongoing)"><TextInput type="date"/></Field>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <Field label="Notes (optional)"><TextInput type="text" placeholder="Dose, frequency, side effects…"/></Field>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <Button variant="secondary" style={{padding:"9px 20px",fontSize:"0.88rem"}} onClick={()=>setForm(null)}>Cancel</Button>
        <Button variant="primary" style={{flex:1,padding:"9px 0",fontSize:"0.88rem",background:"var(--brand-blue)",boxShadow:"none"}} onClick={()=>setForm(null)}>Save treatment</Button>
      </div>
    </div>}
    {treatments.length===0&&<p style={{textAlign:"center",color:"var(--text-ghost)",fontSize:"0.88rem",padding:"36px 0"}}>No treatments logged yet.</p>}
    {active.length>0&&head("Active")}
    {active.map(t=><TreatmentCard key={t.id} t={t} idx={treatments.indexOf(t)} onStop={()=>stop(t)} onDel={()=>del(t)}/>)}
    {past.length>0&&head("Past")}
    {past.map(t=><TreatmentCard key={t.id} t={t} idx={treatments.indexOf(t)} onStop={()=>stop(t)} onDel={()=>del(t)}/>)}
  </div>;
}
window.TreatmentsTab=TreatmentsTab;
