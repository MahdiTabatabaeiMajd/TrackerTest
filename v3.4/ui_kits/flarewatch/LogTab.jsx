// FlareWatch v3.4 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// v3.4 change: an oversized INIA dolphin peeks from the dialog's bottom-right corner as a
// low-opacity watermark, cropped by the card edge for a layered/3D feel. Otherwise v3.3:
// the Log flow lives in a pop-up dialog. The tab shows a start screen with a
// "Log your day" button; the modal steps through date → affected body parts (picked once for
// the whole entry) → all four severity sliders (Continue gated until each is moved) →
// lifestyle + context + environment → summary with Save. Closing the popup keeps progress.
// Body parts are saved onto every symptom scoring above 0, so the stored entry shape is
// unchanged from v2/v3.
const {Button,Chip,Badge,SectionHeader,SliderRow,TriggerSlider,StepGroup,ToggleGroup,SeverityKind,SeverityLabel}=window.FlareWatchDesignSystem_d30d0f;
const FW=window.FW;
const FieldMark=({req})=><span style={{display:"inline-block",verticalAlign:"middle",marginLeft:10,padding:"1px 8px",borderRadius:10,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.4px",textTransform:"uppercase",background:req?"var(--tint-blue-bg)":"var(--surface-rail)",color:req?"var(--tint-blue-fg)":"var(--text-faint)"}}>{req?"Required":"Optional"}</span>;
const card={background:"#fff",border:"1px solid var(--border-soft)",borderRadius:14,padding:"16px 18px",display:"flex",flexDirection:"column",gap:10};
const panel=(bg)=>({padding:"14px 16px",border:"1px solid var(--border-soft)",borderRadius:16,background:bg});

// Chunky Duolingo-style action button: solid face + darker 4px bottom edge that
// collapses on press (see the .fw-big:active rule in the injected stylesheet).
const BIG={
  continue:{background:"var(--brand-blue)",color:"#fff",boxShadow:"0 4px 0 var(--brand-blue-deep)"},
  save:{background:"var(--grad-action)",color:"#fff",boxShadow:"0 4px 0 var(--brand-teal-deep)"},
};
function BigBtn({variant="continue",disabled,onClick,children}){
  return <button className="fw-big" disabled={disabled} onClick={onClick}
    style={{display:"inline-flex",alignItems:"center",justifyContent:"center",flex:"1 1 0",maxWidth:340,padding:"13px 20px",borderRadius:16,fontSize:"0.95rem",fontWeight:800,letterSpacing:"0.5px",textTransform:"uppercase",fontFamily:"inherit",border:"none",transition:"transform .06s,opacity .15s",cursor:disabled?"default":"pointer",opacity:disabled?0.45:1,...BIG[variant]}}>{children}</button>;
}

function LogTab({onSaved}){
  const names=["Itch","Pain","Redness","Scaling"];
  const [open,setOpen]=React.useState(false);
  const [qi,setQi]=React.useState(0);
  const [dir,setDir]=React.useState(1);
  const [scores,setScores]=React.useState([0,0,0,0]);
  const [symTouched,setSymTouched]=React.useState([false,false,false,false]);
  const [partsSel,setPartsSel]=React.useState([]);
  const [stress,setStress]=React.useState(0);
  const [sleep,setSleep]=React.useState(7);
  const [alcohol,setAlcohol]=React.useState(0);
  const [exercise,setExercise]=React.useState(0);
  const [smoking,setSmoking]=React.useState(0);
  const [infection,setInfection]=React.useState(0);
  const [koebner,setKoebner]=React.useState(0);
  const [env,setEnv]=React.useState(null);
  const [envError,setEnvError]=React.useState(null);
  const [fetching,setFetching]=React.useState(false);
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=React.useState(today);
  const flare=Math.max(...scores)>=7;
  const TOTAL=4;                        // form steps; qi === TOTAL is the summary
  const next=()=>{setDir(1);setQi(q=>Math.min(q+1,TOTAL))};
  const back=()=>{setDir(-1);setQi(q=>Math.max(q-1,0))};
  const touch=i=>setSymTouched(t=>t[i]?t:t.map((x,j)=>j===i?true:x));
  const togglePart=p=>setPartsSel(ps=>ps.includes(p)?ps.filter(x=>x!==p):[...ps,p]);
  // Day streak: consecutive logged days immediately before the date being logged, plus this one.
  const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const streak=React.useMemo(()=>{
    const have=new Set(FW.entries.map(e=>e.date));
    let n=1;const d=new Date(date+"T00:00:00");
    for(;;){d.setDate(d.getDate()-1);if(have.has(iso(d)))n++;else break}
    return n;
  },[date]);
  const lastLogged=FW.entries.length?FW.entries[FW.entries.length-1].date:null;
  // Escape closes the dialog; page scroll is locked while it is open.
  React.useEffect(()=>{
    if(!open)return;
    const h=e=>{if(e.key==="Escape")setOpen(false)};
    window.addEventListener("keydown",h);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",h);document.body.style.overflow=""};
  },[open]);
  // Real geolocation + Open-Meteo fetch — port of js/v2/environment.js.
  // Coordinates are rounded to 1 decimal (~11 km) and never stored.
  const fetchEnv=()=>{
    if(!navigator.geolocation){setEnvError("Geolocation not supported by this browser.");return}
    setFetching(true);setEnvError(null);
    navigator.geolocation.getCurrentPosition(async pos=>{
      const lat=Math.round(pos.coords.latitude*10)/10,lon=Math.round(pos.coords.longitude*10)/10;
      try{
        const [wRes,aqRes]=await Promise.all([
          fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,relative_humidity_2m,weather_code,precipitation"),
          fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude="+lat+"&longitude="+lon+"&current=pm2_5,pm10,nitrogen_dioxide")]);
        const w=await wRes.json(),aqd=await aqRes.json();
        setEnv({temperature:w.current.temperature_2m,humidity:w.current.relative_humidity_2m,weatherCode:w.current.weather_code,weatherDesc:FW.WMO[w.current.weather_code]||"Unknown",precipitation:w.current.precipitation,
          pm25:Math.round(aqd.current.pm2_5*10)/10,pm10:Math.round(aqd.current.pm10*10)/10,no2:Math.round(aqd.current.nitrogen_dioxide*10)/10,season:FW.getSeason(new Date(date))});
      }catch(_e){setEnvError("Fetch failed — check your connection.")}
      setFetching(false);
    },_e=>{setEnvError("Location access denied.");setFetching(false)},{timeout:10000});
  };
  const aq=(v,g,m)=>v<=g?"good":v<=m?"moderate":"poor";
  // Save — same entry shape as js/v2/log.js; the shared body-part list is applied to
  // every symptom scoring above 0 (a "Clear" symptom carries no affected areas).
  const save=()=>{
    FW.addEntry({date,
      symptoms:names.map((n,i)=>({name:n,score:scores[i],parts:scores[i]>0?[...partsSel]:[]})),
      isFlareDay:scores.some(s=>s>=7),
      lifestyle:{stress,sleepHours:sleep,alcohol,exercise,smoking,infection,koebner},
      environment:env?{...env}:null});
    onSaved();setOpen(false);
  };
  const clearAll=()=>{setScores([0,0,0,0]);setSymTouched([false,false,false,false]);setPartsSel([]);setStress(0);setSleep(7);setAlcohol(0);setExercise(0);setSmoking(0);setInfection(0);setKoebner(0);setEnv(null);setEnvError(null);setDate(today);setDir(-1);setQi(0)};

  const pill=on=>({display:"inline-flex",alignItems:"center",gap:4,padding:"7px 12px",borderRadius:20,fontSize:"0.74rem",fontWeight:500,cursor:"pointer",fontFamily:"inherit",border:"1px solid",borderColor:on?"var(--brand-teal)":"var(--border-default)",background:on?"var(--tint-teal-bg)":"var(--surface-rail)",color:on?"var(--tint-teal-fg)":"var(--text-slate)",transition:"background 0.12s"});
  const stepLabel=(t,v)=><div><div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)",marginBottom:6}}>{t}</div>{v}</div>;
  const ratedCount=symTouched.filter(Boolean).length;
  const steps=[
    {q:"Which day are you logging?",req:true,body:
      <div style={{display:"flex",justifyContent:"center",paddingTop:8}}>
        <input type="date" value={date} max={today} onChange={e=>setDate(e.target.value)} style={{fontSize:"1.05rem",padding:"12px 18px",borderRadius:14,border:"1.5px solid var(--border-input)",background:"var(--surface-input)",color:"var(--text-strong)",cursor:"pointer",fontFamily:"inherit"}}/>
      </div>},
    {q:"Where is your skin affected today?",req:false,body:
      <div style={{...card,gap:12}}>
        {FW.bodyPartGroups.map(g=><div key={g.label}>
          <div style={{fontSize:"0.66rem",fontWeight:700,color:"var(--text-ghost)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:5}}>{g.label}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{g.parts.map(p=>{const on=partsSel.includes(p);return <button key={p} onClick={()=>togglePart(p)} style={pill(on)}>{on?"✓ ":""}{p}</button>})}</div>
        </div>)}
        <p style={{fontSize:"0.72rem",color:"var(--text-faint)",margin:0,fontStyle:"italic"}}>{partsSel.length?partsSel.length+" selected — these areas are saved with every symptom you rate above 0.":"Tap the areas with active psoriasis, or continue if none stand out."}</p>
      </div>},
    {q:"Rate all four symptoms",req:true,body:
      <React.Fragment>
        <div style={{display:"grid",gridTemplateColumns:"var(--grid-2col)",gap:12}}>
          {names.map((n,i)=><div key={n} style={card} onPointerDownCapture={()=>touch(i)}>
            <SliderRow label={n} value={scores[i]} onChange={v=>{setScores(sc=>sc.map((x,j)=>j===i?v:x));touch(i)}} severity/>
          </div>)}
        </div>
        {ratedCount<4&&<p style={{fontSize:"0.74rem",color:"var(--text-faint)",fontStyle:"italic",textAlign:"center",margin:"12px 0 0"}}>Move each slider to continue — {ratedCount} of 4 rated (0 still counts, just touch it).</p>}
      </React.Fragment>},
    {q:"Lifestyle, context & environment",req:false,body:
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={panel("var(--surface-tint-sky)")}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:6}}>
            <SectionHeader style={{margin:0}}>Environment</SectionHeader>
            <Button variant="fetch" disabled={fetching} onClick={fetchEnv}>{fetching?"Fetching…":"📍 Fetch weather & air quality"}</Button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
            {env?<React.Fragment>
              <Chip variant="env">{env.weatherDesc}</Chip><Chip variant="env">🌡️ {env.temperature}°C</Chip><Chip variant="env">💧 {env.humidity}% RH</Chip>
              <Chip variant="env" tone={aq(env.pm25,15,35)}>PM2.5 {env.pm25}</Chip><Chip variant="env" tone={aq(env.pm10,45,75)}>PM10 {env.pm10}</Chip><Chip variant="env" tone={aq(env.no2,25,50)}>NO₂ {env.no2}</Chip><Chip variant="env">{env.season}</Chip>
            </React.Fragment>:envError?<span style={{fontSize:"0.82rem",color:"var(--danger-soft)",fontWeight:600}}>{envError}</span>:<span style={{fontSize:"0.78rem",color:"var(--text-faint)",fontStyle:"italic"}}>Optional — location is rounded to ~10 km and never stored.</span>}
          </div>
        </div>
        <div style={panel("var(--surface-tint-teal)")}>
          <SectionHeader>Lifestyle &amp; Context</SectionHeader>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <TriggerSlider label="Stress level" value={stress} display={stress+" / 10"} onChange={setStress}/>
            <TriggerSlider label="Sleep last night" value={sleep} display={sleep+" h"} min={2} max={12} step={0.5} scale={["2 h","7 h","12 h"]} onChange={setSleep}/>
            <div style={{display:"grid",gridTemplateColumns:"var(--grid-2col)",gap:12}}>
              {stepLabel("Alcohol",<StepGroup options={FW.ALCOHOL_LABELS} value={alcohol} onChange={setAlcohol} tips={FW.ALCOHOL_TIPS} ramp="risk"/>)}
              {stepLabel("Smoking",<StepGroup options={FW.SMOKING_LABELS} value={smoking} onChange={setSmoking} tips={FW.SMOKING_TIPS} ramp="risk"/>)}
              {stepLabel("Exercise",<StepGroup options={FW.EXERCISE_LABELS} value={exercise} onChange={setExercise} ramp="good"/>)}
            </div>
            <div style={{border:"1px solid var(--border-default)",borderRadius:12,background:"#fff",overflow:"hidden"}}>
              {[["Infection",infection,setInfection],["Skin trauma",koebner,setKoebner]].map(([l,v,f],i)=><div key={l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"9px 14px",borderTop:i?"1px solid var(--border-hair)":"none"}}><span style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text-body)"}}>{l}</span><div style={{width:132,flexShrink:0}}><ToggleGroup value={v} onChange={f}/></div></div>)}
            </div>
          </div>
        </div>
      </div>},
  ];

  const summary=<React.Fragment>
    <div className="fw-pop" style={{background:"var(--surface-tint-primary)",border:"1px solid var(--border-soft)",borderRadius:16,padding:"16px 22px",marginBottom:14}}>
      <h3 style={{fontSize:"0.8rem",fontWeight:700,color:"var(--brand-blue-deep)",textTransform:"uppercase",letterSpacing:"0.5px",margin:"0 0 12px"}}>Summary — {date}</h3>
      {names.map((n,i)=><div key={n} style={{display:"grid",gridTemplateColumns:"72px 48px 1fr auto",alignItems:"start",gap:9,padding:"8px 0",borderBottom:i<3?"1px solid var(--border-default)":"none",fontSize:"0.86rem"}}>
        <span style={{fontWeight:600,color:"var(--text-body)"}}>{n}</span>
        <span style={{color:"var(--text-muted)"}}>{scores[i]}/10</span>
        <span style={{color:"var(--text-strong)",lineHeight:1.6}}>{scores[i]>0?partsSel.join(", ")||"—":"—"}</span>
        <Badge kind={SeverityKind(scores[i])}>{SeverityLabel(scores[i])}</Badge>
      </div>)}
      <p style={{fontSize:"0.78rem",color:"var(--text-muted)",margin:"10px 0 0",lineHeight:1.7}}>Stress {stress}/10 · Sleep {sleep} h · Alcohol: {FW.ALCOHOL_LABELS[alcohol]} · Exercise: {FW.EXERCISE_LABELS[exercise]}{smoking?" · Smoking: "+FW.SMOKING_LABELS[smoking]:""}{infection?" · Infection":""}{koebner?" · Skin trauma":""}</p>
    </div>
    {streak>=2&&<div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:"var(--tint-teal-bg)",color:"var(--tint-teal-fg)",fontSize:"0.82rem",fontWeight:700}}>🔥 {streak}-day streak — keep it up!</span>
    </div>}
    {flare&&<div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
      <p style={{display:"flex",alignItems:"center",gap:8,background:"var(--warn-bg)",border:"1.5px solid var(--warn-border)",borderRadius:12,padding:"9px 16px",color:"var(--warn-fg)",fontWeight:600,fontSize:"0.86rem",margin:0}}>
        <img src="../../assets/warning.png" alt="Warning" style={{width:20}}/>High severity today — this will be marked as a flare day.</p>
    </div>}
  </React.Fragment>;

  const onSummary=qi===TOTAL,cur=onSummary?null:steps[qi];
  const pct=Math.round(qi/TOTAL*100);
  const canContinue=qi!==2||symTouched.every(Boolean);
  const dialog=!open?null:ReactDOM.createPortal(
    <div className="fw-fade" onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(19,42,49,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <div role="dialog" aria-modal="true" aria-label="Log your day" className="fw-pop" style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:560,maxHeight:"min(88vh, 780px)",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 24px 64px rgba(15,50,70,.35)",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:"var(--grad-brand)"}}/>
        <img src="../../assets/INIA_logo.png" alt="" aria-hidden="true" style={{position:"absolute",right:-58,bottom:-62,width:280,height:280,objectFit:"cover",objectPosition:"left center",opacity:.09,transform:"rotate(-14deg)",pointerEvents:"none",zIndex:0,userSelect:"none"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"18px 18px 12px",position:"relative",zIndex:1}}>
          <button onClick={back} disabled={qi===0} aria-label="Back" style={{width:34,height:34,borderRadius:12,border:"none",background:qi===0?"transparent":"var(--surface-rail)",color:qi===0?"transparent":"var(--text-slate)",fontSize:"1rem",cursor:qi===0?"default":"pointer",fontFamily:"inherit",flexShrink:0}}>↩</button>
          <div style={{flex:1,height:14,borderRadius:8,background:"var(--surface-rail)",overflow:"hidden"}}>
            <div style={{height:"100%",width:pct+"%",borderRadius:8,background:"var(--grad-brand)",transition:"width .4s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <span style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text-faint)",minWidth:34,textAlign:"right",flexShrink:0}}>{Math.min(qi+1,TOTAL)+" / "+TOTAL}</span>
          <button onClick={()=>setOpen(false)} aria-label="Close" style={{width:34,height:34,borderRadius:12,border:"none",background:"var(--surface-rail)",color:"var(--text-slate)",fontSize:"0.95rem",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>✕</button>
        </div>
        <div key={qi} data-fw-slide style={{animation:(dir>0?"fwSlideInR":"fwSlideInL")+" 0.28s ease both",flex:1,overflowY:"auto",padding:"4px 22px 16px",position:"relative",zIndex:1}}>
          <h2 style={{fontSize:"1.15rem",fontWeight:800,color:"var(--text-strong)",margin:"0 0 16px",lineHeight:1.35}}>
            {onSummary?"Nice work — here's your day":cur.q}{!onSummary&&<FieldMark req={cur.req}/>}
          </h2>
          {onSummary?summary:cur.body}
        </div>
        <div style={{padding:"12px 22px 18px",borderTop:"1px solid var(--border-hair)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"center",width:"100%",gap:12}}>
            {onSummary?<BigBtn variant="save" onClick={save}>Save entry</BigBtn>
              :<BigBtn disabled={!canContinue} onClick={next}>Continue</BigBtn>}
          </div>
          {onSummary&&<button onClick={clearAll} style={{background:"transparent",border:"none",color:"var(--text-faint)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>Clear and start over</button>}
        </div>
      </div>
    </div>,document.body);

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"var(--panel-min-h)",textAlign:"center",gap:6}}>
    <style>{"@keyframes fwSlideInR{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:translateX(0)}}@keyframes fwSlideInL{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:translateX(0)}}@keyframes fwPop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}@keyframes fwFade{from{opacity:0}to{opacity:1}}.fw-pop{animation:fwPop .3s ease both}.fw-fade{animation:fwFade .2s ease both}.fw-big:active:not(:disabled){transform:translateY(4px)!important;box-shadow:none!important}@media(prefers-reduced-motion:reduce){[data-fw-slide],.fw-pop,.fw-fade{animation:none!important}}"}</style>
    <h2 style={{fontSize:"1.3rem",fontWeight:800,color:"var(--text-strong)",margin:0}}>Track your skin. See what matters.</h2>
    <p style={{fontSize:"0.85rem",color:"var(--text-muted)",margin:"0 0 6px"}}>Log today in four quick steps — it takes under a minute.</p>
    {streak>=2&&<span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:"var(--tint-teal-bg)",color:"var(--tint-teal-fg)",fontSize:"0.82rem",fontWeight:700,marginBottom:4}}>🔥 {streak}-day streak</span>}
    <div style={{display:"flex",justifyContent:"center",width:"100%",maxWidth:340,marginTop:8}}>
      <BigBtn onClick={()=>setOpen(true)}>＋ Log your day</BigBtn>
    </div>
    {lastLogged&&<p style={{fontSize:"0.72rem",color:"var(--text-faint)",margin:"10px 0 0"}}>Last logged: {lastLogged}</p>}
    {dialog}
  </div>;
}
window.LogTab=LogTab;
