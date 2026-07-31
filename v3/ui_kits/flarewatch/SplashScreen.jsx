// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// Port of js/v2/splash.js — trend-line splash, recolored to the FlareWatch two-tone wordmark (white + teal on deep navy).
function SplashScreen({onDone}){
  const ref=React.useRef(null),canvasRef=React.useRef(null),done=React.useRef(false);
  const dismiss=React.useCallback(()=>{if(done.current)return;done.current=true;const el=ref.current;if(el){el.style.opacity="0";setTimeout(()=>onDone&&onDone(),1000)}else onDone&&onDone()},[onDone]);
  React.useEffect(()=>{
    const canvas=canvasRef.current,host=ref.current,ctx=canvas.getContext("2d");
    let W,H,raf;
    const resize=()=>{W=canvas.width=host.offsetWidth;H=canvas.height=host.offsetHeight};
    resize();window.addEventListener("resize",resize);
    const series=[0.30,0.42,0.55,0.68,0.80,0.72,0.60,0.66,0.48,0.34,0.26,0.20,0.14,0.12],n=series.length;
    const geom=()=>{const padX=W*0.12,chartW=W-padX*2,baseY=H*0.62,amp=Math.min(H*0.17,150);return{padX,chartW,baseY,amp}};
    const xOf=(i,g)=>g.padX+(i/(n-1))*g.chartW;
    const yOf=(v,g)=>g.baseY-(v-0.5)*2*g.amp;
    const easeInOut=t=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    // Catmull-Rom smoothing: sample a dense smooth curve through the data points
    const sampleCurve=(g,M)=>{const P=series.map((v,i)=>({x:xOf(i,g),y:yOf(v,g)}));const out=[];for(let s=0;s<M;s++){const t=s/(M-1)*(n-1),i=Math.min(Math.floor(t),n-2),u=t-i;const p0=P[Math.max(i-1,0)],p1=P[i],p2=P[i+1],p3=P[Math.min(i+2,n-1)];const u2=u*u,u3=u2*u;out.push({x:0.5*((2*p1.x)+(-p0.x+p2.x)*u+(2*p0.x-5*p1.x+4*p2.x-p3.x)*u2+(-p0.x+3*p1.x-3*p2.x+p3.x)*u3),y:0.5*((2*p1.y)+(-p0.y+p2.y)*u+(2*p0.y-5*p1.y+4*p2.y-p3.y)*u2+(-p0.y+3*p1.y-3*p2.y+p3.y)*u3)})}return out};
    const DRAW_DUR=3.2;let start=null;
    function frame(ts){
      if(start===null)start=ts;
      const p=easeInOut(Math.min((ts-start)/1000/DRAW_DUR,1)),g=geom();
      ctx.clearRect(0,0,W,H);
      ctx.lineWidth=1;ctx.strokeStyle="rgba(255,255,255,0.07)";
      for(let k=0;k<=4;k++){const y=g.baseY-g.amp+(k/4)*(2*g.amp);ctx.beginPath();ctx.moveTo(g.padX,y);ctx.lineTo(g.padX+g.chartW,y);ctx.stroke()}
      for(let i=0;i<n;i++){const x=xOf(i,g);ctx.beginPath();ctx.moveTo(x,g.baseY-g.amp);ctx.lineTo(x,g.baseY+g.amp);ctx.stroke()}
      const fIndex=p*(n-1),whole=Math.floor(fIndex);
      const M=240,curve=sampleCurve(g,M),drawn=Math.max(2,Math.round(p*M));
      const pts=curve.slice(0,drawn);
      const tipX=pts[pts.length-1].x,tipY=pts[pts.length-1].y;
      if(pts.length>1){
        const areaGrad=ctx.createLinearGradient(0,g.baseY-g.amp,0,g.baseY+g.amp);
        areaGrad.addColorStop(0,"rgba(110,216,204,0.22)");areaGrad.addColorStop(1,"rgba(46,115,150,0.02)");
        ctx.beginPath();ctx.moveTo(pts[0].x,g.baseY+g.amp);pts.forEach(pt=>ctx.lineTo(pt.x,pt.y));ctx.lineTo(pts[pts.length-1].x,g.baseY+g.amp);ctx.closePath();
        ctx.fillStyle=areaGrad;ctx.fill();
        const lineGrad=ctx.createLinearGradient(g.padX,0,g.padX+g.chartW,0);
        lineGrad.addColorStop(0,"#8ec9dd");lineGrad.addColorStop(0.5,"#7fdcd2");lineGrad.addColorStop(1,"#aef0e6");
        ctx.save();ctx.shadowColor="rgba(33,166,149,0.55)";ctx.shadowBlur=16;
        ctx.strokeStyle=lineGrad;ctx.lineWidth=3.5;ctx.lineJoin=ctx.lineCap="round";
        ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.stroke();ctx.restore();
      }
      for(let i=0;i<=whole&&i<n;i++){const x=xOf(i,g),y=yOf(series[i],g);ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.lineWidth=2;ctx.strokeStyle="rgba(58,183,191,0.8)";ctx.stroke()}
      const pulse=1+0.35*Math.sin(ts/180);
      ctx.beginPath();ctx.arc(tipX,tipY,9*pulse,0,Math.PI*2);ctx.fillStyle="rgba(110,216,204,0.25)";ctx.fill();
      ctx.beginPath();ctx.arc(tipX,tipY,5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
    const t=setTimeout(dismiss,5000);
    return()=>{cancelAnimationFrame(raf);clearTimeout(t);window.removeEventListener("resize",resize)};
  },[dismiss]);
  return <div ref={ref} style={{position:"fixed",inset:0,zIndex:100,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--splash-bg)",transition:"opacity 1s ease"}}>
    <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",zIndex:1}}></canvas>
    <div style={{position:"relative",zIndex:10,textAlign:"center",pointerEvents:"none",marginTop:"-9vh",animation:"splashFadeUp 1.1s ease 0.4s both"}}>
      <div style={{fontSize:"clamp(2.4rem,8vw,4.2rem)",fontWeight:700,letterSpacing:"-0.02em",textShadow:"0 0 40px rgba(255,255,255,0.2), 0 0 90px rgba(58,183,191,0.4)"}}><span style={{color:"#fff"}}>Flare</span><span style={{color:"var(--brand-teal-bright)"}}>Watch</span></div>
      <div style={{marginTop:"0.55em",fontSize:"clamp(0.9rem,2.4vw,1.2rem)",color:"#b9e6e3",fontWeight:500}}>Know your triggers. Prevent the flare.</div>
      <div style={{marginTop:"1.7em",fontSize:"0.68rem",letterSpacing:"0.16em",color:"#7f929a",textTransform:"uppercase",fontWeight:600}}>By INIA Biosciences · Mahdi Tabatabaei</div>
    </div>
    <div style={{position:"absolute",bottom:0,left:0,height:2,width:"100%",transformOrigin:"left",transform:"scaleX(0)",background:"linear-gradient(90deg,#2e7396,#6ed8cc)",animation:"splashProg 5s linear forwards"}}></div>
    <button onClick={dismiss} style={{position:"absolute",top:18,right:18,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.45)",padding:"5px 14px",borderRadius:20,fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.05em",zIndex:20,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.45)"}}>Skip →</button>
  </div>;
}
window.SplashScreen=SplashScreen;
