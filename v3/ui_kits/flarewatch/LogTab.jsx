// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {Button,Chip,Badge,SectionHeader,SliderRow,TriggerSlider,StepGroup,ToggleGroup,SeverityKind,SeverityLabel}=window.FlareWatchDesignSystem_d30d0f;
const FW=window.FW;
const panel=(bg)=>({padding:"16px 20px",border:"1px solid var(--border-soft)",borderRadius:18,background:bg,marginBottom:16});
const FieldMark=({req})=><span style={{display:"inline-block",verticalAlign:"middle",marginLeft:8,padding:"1px 8px",borderRadius:10,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.4px",textTransform:"uppercase",background:req?"var(--tint-blue-bg)":"var(--surface-rail)",color:req?"var(--tint-blue-fg)":"var(--text-faint)"}}>{req?"Required":"Optional"}</span>;

function SymptomCard({name,value,onChange,parts,setParts}){
  const [open,setOpen]=React.useState(false);
  const toggle=p=>setParts(parts.includes(p)?parts.filter(x=>x!==p):[...parts,p]);
  const pill=on=>({display:"inline-flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:20,fontSize:"0.72rem",fontWeight:500,cursor:"pointer",fontFamily:"inherit",border:"1px solid",borderColor:on?"var(--brand-teal)":"var(--border-default)",background:on?"var(--tint-teal-bg)":"var(--surface-rail)",color:on?"var(--tint-teal-fg)":"var(--text-slate)",transition:"background 0.12s"});
  return <div style={{background:"#fff",border:"1px solid var(--border-soft)",borderRadius:14,padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
    <SliderRow label={name} value={value} onChange={onChange} severity/>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
      {!open&&parts.map(p=><Chip key={p} variant="part" onRemove={()=>toggle(p)}>{p}</Chip>)}
      <button onClick={()=>setOpen(!open)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,fontSize:"0.72rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:open?"1px solid var(--brand-teal)":"1px dashed var(--border-input)",background:open?"var(--tint-teal-bg)":"transparent",color:open?"var(--tint-teal-fg)":"var(--text-muted)"}}>{open?"Done":parts.length?"Edit body parts":"+ Add body parts"}</button>
    </div>
    {open&&<div style={{borderTop:"1px solid var(--border-hair)",paddingTop:8,display:"flex",flexDirection:"column",gap:7}}>
      {FW.bodyPartGroups.map(g=><div key={g.label}>
        <div style={{fontSize:"0.64rem",fontWeight:700,color:"var(--text-ghost)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3}}>{g.label}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{g.parts.map(p=>{const on=parts.includes(p);return <button key={p} onClick={()=>toggle(p)} style={pill(on)}>{on?"✓ ":""}{p}</button>})}</div>
      </div>)}
    </div>}
  </div>;
}

function LogTab({onSaved}){
  const names=["Itch","Pain","Redness","Scaling"];
  const [scores,setScores]=React.useState([0,0,0,0]);
  const [parts,setPartsAll]=React.useState([[],[],[],[]]);
  const [stress,setStress]=React.useState(0);
  const [sleep,setSleep]=React.useState(7);
  const [alcohol,setAlcohol]=React.useState(0);
  const [exercise,setExercise]=React.useState(0);
  const [smoking,setSmoking]=React.useState(0);
  const [infection,setInfection]=React.useState(0);
  const [koebner,setKoebner]=React.useState(0);
  const [env,setEnv]=React.useState(null);
  const [fetching,setFetching]=React.useState(false);
  const [reviewed,setReviewed]=React.useState(false);
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=React.useState(today);
  const flare=Math.max(...scores)>=7;
  const fetchEnv=()=>{setFetching(true);setTimeout(()=>{setEnv({weatherDesc:"Partly cloudy",temperature:24,humidity:58,pm25:12.4,pm10:28,no2:18,season:"Summer"});setFetching(false)},900)};
  const aq=(v,g,m)=>v<=g?"good":v<=m?"moderate":"poor";
  const save=()=>{onSaved();setReviewed(false)};
  return <div>
    <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{fontSize:"0.92rem",padding:"8px 14px",borderRadius:10,border:"1.5px solid var(--border-input)",background:"var(--surface-input)",color:"var(--text-strong)",cursor:"pointer",fontFamily:"inherit"}}/>
    </div>
    <div style={panel("var(--surface-tint-primary)")}>
      <SectionHeader>Symptom Severity<FieldMark req/></SectionHeader>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {names.map((n,i)=><SymptomCard key={n} name={n} value={scores[i]} onChange={v=>setScores(scores.map((s,j)=>j===i?v:s))} parts={parts[i]} setParts={p=>setPartsAll(parts.map((x,j)=>j===i?p:x))}/>)}
      </div>
    </div>
    <div style={panel("var(--surface-tint-sky)")}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <SectionHeader style={{margin:0}}>Environment<FieldMark/></SectionHeader>
        <Button variant="fetch" disabled={fetching} onClick={fetchEnv}>{fetching?"Fetching…":"📍 Fetch weather & air quality"}</Button>
      </div>
      <p style={{fontSize:"0.72rem",color:"var(--text-faint)",margin:"0 0 10px",lineHeight:1.5}}>Your location is rounded to ~10 km before being sent to Open-Meteo (open-source API). Only the fetched measurements are saved — your coordinates are never stored.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        {env?<React.Fragment>
          <Chip variant="env">{env.weatherDesc}</Chip><Chip variant="env">🌡️ {env.temperature}°C</Chip><Chip variant="env">💧 {env.humidity}% RH</Chip>
          <Chip variant="env" tone={aq(env.pm25,15,35)}>PM2.5 {env.pm25}</Chip><Chip variant="env" tone={aq(env.pm10,45,75)}>PM10 {env.pm10}</Chip><Chip variant="env" tone={aq(env.no2,25,50)}>NO₂ {env.no2}</Chip><Chip variant="env">{env.season}</Chip>
        </React.Fragment>:<span style={{fontSize:"0.82rem",color:"var(--text-faint)",fontStyle:"italic"}}>Click Fetch to load today's conditions</span>}
      </div>
    </div>
    <div style={panel("var(--surface-tint-teal)")}>
      <SectionHeader>Lifestyle &amp; Context<FieldMark/></SectionHeader>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <TriggerSlider label="Stress level" value={stress} display={stress+" / 10"} onChange={setStress}/>
        <TriggerSlider label="Sleep last night" value={sleep} display={sleep+" h"} min={2} max={12} step={0.5} scale={["2 h","7 h","12 h"]} onChange={setSleep}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)",marginBottom:6}}>Alcohol</div><StepGroup options={FW.ALCOHOL_LABELS} value={alcohol} onChange={setAlcohol} tips={FW.ALCOHOL_TIPS} ramp="risk"/></div>
          <div><div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)",marginBottom:6}}>Smoking</div><StepGroup options={FW.SMOKING_LABELS} value={smoking} onChange={setSmoking} tips={FW.SMOKING_TIPS} ramp="risk"/></div>
          <div><div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)",marginBottom:6}}>Exercise</div><StepGroup options={FW.EXERCISE_LABELS} value={exercise} onChange={setExercise} ramp="good"/></div>
        </div>
        <div style={{border:"1px solid var(--border-default)",borderRadius:12,background:"#fff",overflow:"hidden"}}>
          {[["Infection",infection,setInfection],["Skin trauma",koebner,setKoebner]].map(([l,v,f],i)=><div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"9px 14px",borderTop:i?"1px solid var(--border-hair)":"none"}}><span style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)"}}>{l}</span><div style={{width:132}}><ToggleGroup value={v} onChange={f}/></div></div>)}
        </div>
      </div>
    </div>
    {reviewed&&<React.Fragment>
      <div style={{background:"var(--surface-tint-primary)",border:"1px solid var(--border-soft)",borderRadius:16,padding:"16px 22px",marginBottom:16}}>
        <h3 style={{fontSize:"0.8rem",fontWeight:700,color:"var(--brand-blue-deep)",textTransform:"uppercase",letterSpacing:"0.5px",margin:"0 0 12px"}}>Summary — {date}</h3>
        {names.map((n,i)=><div key={n} style={{display:"grid",gridTemplateColumns:"72px 48px 1fr auto",alignItems:"start",gap:9,padding:"8px 0",borderBottom:i<3?"1px solid var(--border-default)":"none",fontSize:"0.86rem"}}>
          <span style={{fontWeight:600,color:"var(--text-body)"}}>{n}</span>
          <span style={{color:"var(--text-muted)"}}>{scores[i]}/10</span>
          <span style={{color:"var(--text-strong)",lineHeight:1.6}}>{parts[i].join(", ")||"—"}</span>
          <Badge kind={SeverityKind(scores[i])}>{SeverityLabel(scores[i])}</Badge>
        </div>)}
        <p style={{fontSize:"0.78rem",color:"var(--text-muted)",margin:"10px 0 0",lineHeight:1.7}}>Stress {stress}/10 · Sleep {sleep} h · Alcohol: {FW.ALCOHOL_LABELS[alcohol]} · Exercise: {FW.EXERCISE_LABELS[exercise]}{smoking?" · Smoking: "+FW.SMOKING_LABELS[smoking]:""}{infection?" · Infection":""}{koebner?" · Skin trauma":""}</p>
      </div>
      {flare&&<div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
        <p style={{display:"flex",alignItems:"center",gap:8,background:"var(--warn-bg)",border:"1.5px solid var(--warn-border)",borderRadius:12,padding:"9px 16px",color:"var(--warn-fg)",fontWeight:600,fontSize:"0.86rem",margin:0}}>
          <img src="../../assets/warning.png" alt="Warning" style={{width:20}}/>High severity today — this will be marked as a flare day.</p>
      </div>}
    </React.Fragment>}
    <div style={{position:"sticky",bottom:0,zIndex:20,display:"flex",justifyContent:"center",gap:12,padding:"12px 0",margin:"18px -2px 0",background:"rgba(255,255,255,.92)",backdropFilter:"blur(6px)",borderTop:"1px solid var(--border-default)"}}>
      {!reviewed&&<Button variant="outline" onClick={()=>setReviewed(true)}>Review Entry</Button>}
      {reviewed&&<React.Fragment><Button variant="secondary" onClick={()=>setReviewed(false)}>Clear</Button><Button variant="primary" onClick={save}>Save</Button></React.Fragment>}
    </div>
  </div>;
}
window.LogTab=LogTab;
