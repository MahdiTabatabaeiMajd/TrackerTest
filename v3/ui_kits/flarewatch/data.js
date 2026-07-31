// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// Demo dataset + pure helpers (ports of js/v2/data.js + scoring.js)
(function(){
const bodyPartGroups=[
 {label:"Head & Neck",parts:["Head","Neck","Scalp"]},
 {label:"Arms & Hands",parts:["Left upper arm","Right upper arm","Left forearm","Right forearm","Left hand","Right hand"]},
 {label:"Torso",parts:["Torso","Hips"]},
 {label:"Legs & Feet",parts:["Left thigh","Right thigh","Left knee","Right knee","Left lower leg","Right lower leg","Left foot","Right foot"]}];
const TREATMENT_COLORS=["#2a78d6","#1baf7a","#eda100","#008300","#4a3aa7","#e34948"];
function pearsonR(xs,ys){const n=xs.length;if(n<3)return null;const mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;const num=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0);const dx=Math.sqrt(xs.reduce((s,x)=>s+(x-mx)**2,0)),dy=Math.sqrt(ys.reduce((s,y)=>s+(y-my)**2,0));return dx*dy===0?0:num/(dx*dy)}
function corrClass(r){if(r===null)return"nil";if(r>=0.5)return"sp";if(r>=0.2)return"mp";if(r<=-0.5)return"sn";if(r<=-0.2)return"mn";return"w"}
// 14-day demo log removed — app starts empty; FW.generateDemo() below provides demo data on demand
// Start EMPTY — users enter their own data; "Load 30-day demo" fills it on demand
const entries=[];
const treatments=[];
window.FW={bodyPartGroups,TREATMENT_COLORS,treatmentColor:i=>TREATMENT_COLORS[i%TREATMENT_COLORS.length],pearsonR,corrClass,entries,treatments,
 TOPICAL_CLASSES:[{label:"Mild — Class VII",note:"Safe for face/skin folds; long-term use",drugs:["Hydrocortisone 1%","Hydrocortisone 2.5%"]},{label:"Low–Moderate — Class V–VI",note:"Thin or sensitive skin; mild psoriasis",drugs:["Desonide 0.05%","Fluocinolone acetonide 0.01%"]},{label:"Medium — Class IV–V",note:"Most common for body plaques",drugs:["Mometasone furoate 0.1%","Triamcinolone acetonide 0.1%","Fluticasone propionate 0.05%"]},{label:"High — Class II–III",note:"Thick plaques on trunk/limbs",drugs:["Fluocinonide 0.05%","Betamethasone dipropionate 0.05%"]},{label:"Ultra-High — Class I",note:"Short-term only; scalp/palms/soles",drugs:["Clobetasol propionate 0.05%","Halobetasol propionate 0.05%"]}],
 BIOLOGIC_CLASSES:[{label:"TNF-α inhibitors",drugs:["Adalimumab (Humira)","Etanercept (Enbrel)"]},{label:"IL-12/23 inhibitor (anti-p40)",drugs:["Ustekinumab (Stelara)"]},{label:"IL-17A inhibitors",drugs:["Secukinumab (Cosentyx)","Ixekizumab (Taltz)"]},{label:"IL-17A/F inhibitor",drugs:["Bimekizumab (Bimzelx)"]},{label:"IL-23 inhibitors (anti-p19)",drugs:["Guselkumab (Tremfya)","Risankizumab (Skyrizi)"]}],
 ALCOHOL_LABELS:["None","Light","Moderate","Heavy"],EXERCISE_LABELS:["None","Light","Moderate","Intense"],
 ALCOHOL_TIPS:["No alcohol","≤3 standard drinks/week (~0.1–0.4/day)",["Women: ≤7 drinks/week (≤1/day)","Men: ≤14 drinks/week (≤2/day)"],["Women: 8+ drinks/week or 4+ on any day","Men: 15+ drinks/week or 5+ on any day"]],
 SMOKING_LABELS:["None","Light","Moderate","Heavy"],
 SMOKING_TIPS:["No cigarettes","1–10 cigarettes/day","11–20 cigarettes/day (≤1 pack)","More than 20 cigarettes/day (>1 pack)"]};
// Port of js/v2/demo.js — 30-day dataset with planted correlations (stress→itch, sleep→itch, infection spike, PM2.5→redness) + 3 staggered treatments
window.FW.generateDemo=function(){
 const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().split("T")[0]};
 const bp={itch:["Scalp","Left forearm"],pain:["Right knee"],redness:["Scalp","Torso"],scaling:["Left forearm"]};
 const WMO=["Clear sky","Partly cloudy","Overcast","Mainly clear"];
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
   environment:{temperature:Math.round(rand(isRecovery?22:15,30)*10)/10,humidity:randInt(40,80),weatherDesc:WMO[randInt(0,3)],pm25:Math.round((isHighAQ?rand(30,55):rand(5,18))*10)/10,pm10:Math.round((isHighAQ?rand(50,80):rand(10,35))*10)/10,no2:Math.round((isHighAQ?rand(30,55):rand(5,20))*10)/10,season:"Summer"}});
 }
 const treatments=[
  {id:"demo-t1",type:"topical",potencyClass:"High — Class II–III",biologicClass:null,drug:"Betamethasone dipropionate 0.05%",bodyAreas:["Scalp","Torso"],startDate:daysAgo(24),stopDate:daysAgo(10),notes:"Demo — initial flare management"},
  {id:"demo-t2",type:"topical",potencyClass:"Ultra-High — Class I",biologicClass:null,drug:"Clobetasol propionate 0.05%",bodyAreas:["Left forearm","Right forearm"],startDate:daysAgo(9),stopDate:daysAgo(4),notes:"Demo — short-course for forearm flare"},
  {id:"demo-t3",type:"biologic",potencyClass:null,biologicClass:"IL-17A inhibitors",drug:"Secukinumab (Cosentyx)",bodyAreas:[],startDate:daysAgo(3),stopDate:null,notes:"Demo — loading dose initiated"}];
 return{entries,treatments};
};
})();
