// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// Real data layer — ports of js/v2/data.js + scoring.js + demo.js.
// Persists to localStorage under the SAME keys as v2, so data logged in
// either version is readable by the other.
(function(){
const bodyPartGroups=[
 {label:"Head & Neck",parts:["Head","Neck","Scalp"]},
 {label:"Arms & Hands",parts:["Left upper arm","Right upper arm","Left forearm","Right forearm","Left hand","Right hand"]},
 {label:"Torso",parts:["Torso","Hips"]},
 {label:"Legs & Feet",parts:["Left thigh","Right thigh","Left knee","Right knee","Left lower leg","Right lower leg","Left foot","Right foot"]}];
const TREATMENT_COLORS=["#2a78d6","#1baf7a","#eda100","#008300","#4a3aa7","#e34948"];
// WMO weather interpretation codes → human-readable label (port of js/v2/data.js)
const WMO={0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Icy fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",61:"Light rain",63:"Moderate rain",65:"Heavy rain",71:"Light snow",73:"Moderate snow",75:"Heavy snow",80:"Light showers",81:"Showers",82:"Heavy showers",95:"Thunderstorm"};
function getSeason(date){const m=date.getMonth()+1;if(m>=3&&m<=5)return"Spring";if(m>=6&&m<=8)return"Summer";if(m>=9&&m<=11)return"Autumn";return"Winter"}
function pearsonR(xs,ys){const n=xs.length;if(n<3)return null;const mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;const num=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0);const dx=Math.sqrt(xs.reduce((s,x)=>s+(x-mx)**2,0)),dy=Math.sqrt(ys.reduce((s,y)=>s+(y-my)**2,0));return dx*dy===0?0:num/(dx*dy)}
function corrClass(r){if(r===null)return"nil";if(r>=0.5)return"sp";if(r>=0.2)return"mp";if(r<=-0.5)return"sn";if(r<=-0.2)return"mn";return"w"}

// ── localStorage layer — keys identical to js/v2/data.js ─────────────────────
const STORAGE_KEY="psotrack_v2",ARCHIVE_KEY="psotrack_v2_archive",TREATMENT_KEY="psotrack_v2_treatments";
const loadLog=()=>JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
const saveLog=e=>localStorage.setItem(STORAGE_KEY,JSON.stringify(e));
const loadArchive=()=>JSON.parse(localStorage.getItem(ARCHIVE_KEY)||"[]");
const saveArchive=e=>localStorage.setItem(ARCHIVE_KEY,JSON.stringify(e));
const loadTreatments=()=>JSON.parse(localStorage.getItem(TREATMENT_KEY)||"[]");
const saveTreatments=t=>localStorage.setItem(TREATMENT_KEY,JSON.stringify(t));

window.FW={bodyPartGroups,TREATMENT_COLORS,treatmentColor:i=>TREATMENT_COLORS[i%TREATMENT_COLORS.length],pearsonR,corrClass,WMO,getSeason,
 // Drug reference data — full lists from js/v2/treatments.js. The v3 UI shows a
 // flat drug list (class dropdowns removed by design); the class is derived from
 // the chosen drug via classForDrug() so records keep the v2 shape.
 TOPICAL_CLASSES:[{label:"Mild — Class VII",note:"Safe for face/skin folds; long-term use",drugs:["Hydrocortisone 1%","Hydrocortisone 2.5%","Hydrocortisone acetate 1%"]},{label:"Low–Moderate — Class V–VI",note:"Thin or sensitive skin; mild psoriasis",drugs:["Desonide 0.05%","Fluocinolone acetonide 0.01%","Alclometasone dipropionate 0.05%"]},{label:"Medium — Class IV–V",note:"Most common for body plaques",drugs:["Mometasone furoate 0.1%","Triamcinolone acetonide 0.1%","Fluticasone propionate 0.05%","Betamethasone valerate 0.12%"]},{label:"High — Class II–III",note:"Thick plaques on trunk/limbs",drugs:["Fluocinonide 0.05%","Betamethasone dipropionate 0.05%","Desoximetasone 0.25%","Halcinonide 0.1%"]},{label:"Ultra-High — Class I",note:"Short-term only; scalp/palms/soles",drugs:["Clobetasol propionate 0.05%","Halobetasol propionate 0.05%","Betamethasone dipropionate (augmented) 0.05%","Diflorasone diacetate 0.05%"]}],
 BIOLOGIC_CLASSES:[{label:"TNF-α inhibitors",note:"Oldest class (2004–); broad immune suppression",drugs:["Adalimumab (Humira)","Etanercept (Enbrel)","Infliximab (Remicade)","Certolizumab (Cimzia)"]},{label:"IL-12/23 inhibitor (anti-p40)",note:"Targets both IL-12 and IL-23 pathways",drugs:["Ustekinumab (Stelara)"]},{label:"IL-17A inhibitors",note:"High PASI 90 rates; rapid onset",drugs:["Secukinumab (Cosentyx)","Ixekizumab (Taltz)"]},{label:"IL-17A/F inhibitor",note:"Dual IL-17A and IL-17F blockade; newest approval (2023)",drugs:["Bimekizumab (Bimzelx)"]},{label:"IL-23 inhibitors (anti-p19)",note:"Highest PASI 90/100 rates; quarterly dosing after loading",drugs:["Guselkumab (Tremfya)","Risankizumab (Skyrizi)","Tildrakizumab (Ilumya)"]}],
 ALCOHOL_LABELS:["None","Light","Moderate","Heavy"],EXERCISE_LABELS:["None","Light","Moderate","Intense"],
 ALCOHOL_TIPS:["No alcohol","≤3 standard drinks/week (~0.1–0.4/day)",["Women: ≤7 drinks/week (≤1/day)","Men: ≤14 drinks/week (≤2/day)"],["Women: 8+ drinks/week or 4+ on any day","Men: 15+ drinks/week or 5+ on any day"]],
 SMOKING_LABELS:["None","Light","Moderate","Heavy"],
 SMOKING_TIPS:["No cigarettes","1–10 cigarettes/day","11–20 cigarettes/day (≤1 pack)","More than 20 cigarettes/day (>1 pack)"]};

window.FW.classForDrug=function(type,drug){
 const classes=type==="topical"?window.FW.TOPICAL_CLASSES:window.FW.BIOLOGIC_CLASSES;
 const cls=classes.find(c=>c.drugs.includes(drug));
 return cls?cls.label:null;
};

// ── Live data + write-through helpers ────────────────────────────────────────
// FW.entries / FW.treatments always mirror localStorage. Every mutation writes
// through and calls FW.onDataChange (set by the app shell) so React re-renders.
window.FW.entries=loadLog();
window.FW.treatments=loadTreatments();
window.FW.onDataChange=null;
function refresh(){window.FW.entries=loadLog();window.FW.treatments=loadTreatments();if(window.FW.onDataChange)window.FW.onDataChange()}
window.FW.addEntry=function(entry){const e=loadLog();e.push(entry);saveLog(e);refresh()};
window.FW.deleteEntry=function(idx){const e=loadLog();e.splice(idx,1);saveLog(e);refresh()};
window.FW.archiveCount=function(){return loadArchive().length};
// Archive-all keeps any existing archive and sorts by date (v2 semantics)
window.FW.archiveAll=function(){const merged=[...loadArchive(),...loadLog()].sort((a,b)=>a.date.localeCompare(b.date));saveArchive(merged);saveLog([]);refresh()};
window.FW.restoreArchive=function(){const merged=[...loadLog(),...loadArchive()].sort((a,b)=>a.date.localeCompare(b.date));saveLog(merged);saveArchive([]);refresh()};
window.FW.addTreatment=function(t){const ts=loadTreatments();ts.push(t);saveTreatments(ts);refresh()};
window.FW.stopTreatment=function(id){const ts=loadTreatments();const t=ts.find(x=>x.id===id);if(t)t.stopDate=new Date().toISOString().split("T")[0];saveTreatments(ts);refresh()};
window.FW.deleteTreatment=function(id){saveTreatments(loadTreatments().filter(x=>x.id!==id));refresh()};

// Port of js/v2/demo.js — 30-day dataset with planted correlations (stress→itch, sleep→itch, infection spike, PM2.5→redness) + 3 staggered treatments
window.FW.generateDemo=function(){
 const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().split("T")[0]};
 const bp={itch:["Scalp","Left forearm"],pain:["Right knee"],redness:["Scalp","Torso"],scaling:["Left forearm"]};
 const WMO_SAMPLE=["Clear sky","Partly cloudy","Overcast","Mainly clear"];
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,Math.round(v)));
 const rand=(lo,hi)=>lo+Math.random()*(hi-lo);
 const randInt=(lo,hi)=>Math.round(rand(lo,hi));
 const entries=[];let itch=4,pain=2,redness=3,scaling=2;
 for(let d=29;d>=0;d--){
  const date=new Date();date.setDate(date.getDate()-d);
  const isStressWeek=d>=18&&d<=22,isInfected=d>=10&&d<=12,isHighAQ=d>=5&&d<=8,isRecovery=d<=4;
  const stress=isStressWeek?randInt(7,10):isInfected?randInt(5,8):randInt(1,5);
  const sleepHours=isStressWeek?rand(4,6):isRecovery?rand(7,9):rand(5.5,8.5);
  const alcohol=d%7===0?2:d%7===6?1:0;
  const exercise=isStressWeek||isInfected?0:randInt(0,2);
  const stressEffect=(stress-3)*0.4,sleepEffect=(7-sleepHours)*0.3,infectEffect=isInfected?3:0,koebner=d===15;
  itch=clamp(itch+stressEffect+sleepEffect+infectEffect+(koebner?2:0)+rand(-1,1),0,10);
  pain=clamp(pain+infectEffect*0.5+rand(-0.5,0.5),0,10);
  redness=clamp(redness+(isHighAQ?1.5:0)+infectEffect*0.4+rand(-0.8,0.8),0,10);
  scaling=clamp(scaling+stressEffect*0.3+rand(-0.6,0.6),0,10);
  if(isRecovery){itch=clamp(itch-rand(0.5,1.5),0,10);redness=clamp(redness-rand(0.3,1.0),0,10)}
  const symptoms=[{name:"Itch",score:itch,parts:itch>3?bp.itch:[]},{name:"Pain",score:pain,parts:pain>3?bp.pain:[]},{name:"Redness",score:redness,parts:redness>3?bp.redness:[]},{name:"Scaling",score:scaling,parts:scaling>3?bp.scaling:[]}];
  entries.push({date:date.toISOString().split("T")[0],symptoms,isFlareDay:symptoms.some(s=>s.score>=7),
   lifestyle:{stress,sleepHours:Math.round(sleepHours*10)/10,alcohol,exercise,smoking:false,infection:isInfected,koebner},
   environment:{temperature:Math.round(rand(isRecovery?22:15,30)*10)/10,humidity:randInt(40,80),weatherDesc:WMO_SAMPLE[randInt(0,3)],pm25:Math.round((isHighAQ?rand(30,55):rand(5,18))*10)/10,pm10:Math.round((isHighAQ?rand(50,80):rand(10,35))*10)/10,no2:Math.round((isHighAQ?rand(30,55):rand(5,20))*10)/10,season:"Summer"}});
 }
 const treatments=[
  {id:"demo-t1",type:"topical",potencyClass:"High — Class II–III",biologicClass:null,drug:"Betamethasone dipropionate 0.05%",bodyAreas:["Scalp","Torso"],startDate:daysAgo(24),stopDate:daysAgo(10),notes:"Demo — initial flare management"},
  {id:"demo-t2",type:"topical",potencyClass:"Ultra-High — Class I",biologicClass:null,drug:"Clobetasol propionate 0.05%",bodyAreas:["Left forearm","Right forearm"],startDate:daysAgo(9),stopDate:daysAgo(4),notes:"Demo — short-course for forearm flare"},
  {id:"demo-t3",type:"biologic",potencyClass:null,biologicClass:"IL-17A inhibitors",drug:"Secukinumab (Cosentyx)",bodyAreas:[],startDate:daysAgo(3),stopDate:null,notes:"Demo — loading dose initiated"}];
 return{entries,treatments};
};
// Generate + persist (v2 demo.js writes straight to storage; confirm() is the caller's job)
window.FW.loadDemo=function(){const d=window.FW.generateDemo();saveLog(d.entries);saveTreatments(d.treatments);refresh()};
})();
