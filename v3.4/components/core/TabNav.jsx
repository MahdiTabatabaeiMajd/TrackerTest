// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
import React from "react";
export function TabNav({tabs,active,onChange}){
  const refs=React.useRef({});
  const navRef=React.useRef(null);
  const [ind,setInd]=React.useState(null);
  const measure=React.useCallback(()=>{
    const el=refs.current[active];
    if(el)setInd({left:el.offsetLeft,width:el.offsetWidth,height:el.offsetHeight});
  },[active]);
  React.useLayoutEffect(measure,[measure,tabs.join()]);
  React.useLayoutEffect(()=>{
    const ro=new ResizeObserver(measure);
    if(navRef.current)ro.observe(navRef.current);
    return()=>ro.disconnect();
  },[measure]);
  return <nav ref={navRef} style={{display:"flex",gap:5,background:"var(--surface-rail)",borderRadius:14,padding:5,position:"relative",overflowX:"auto",scrollbarWidth:"none"}}>
    {ind&&<span style={{position:"absolute",top:5,left:0,transform:`translateX(${ind.left}px)`,width:ind.width,height:ind.height,borderRadius:10,background:"#fff",boxShadow:"var(--shadow-indicator)",transition:"transform .3s cubic-bezier(0.4,0,0.2,1),width .3s cubic-bezier(0.4,0,0.2,1)",pointerEvents:"none"}}/>}
    {tabs.map(t=><button key={t} ref={el=>refs.current[t]=el} onClick={()=>onChange&&onChange(t)}
      style={{position:"relative",zIndex:1,flex:1,padding:"var(--tab-pad)",border:"none",borderRadius:10,background:"transparent",color:t===active?"var(--brand-blue-deep)":"var(--text-muted)",fontSize:"var(--tab-font)",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",fontFamily:"inherit",transition:"color .2s"}}
      onMouseEnter={e=>{if(t!==active)e.currentTarget.style.color="var(--text-body)"}}
      onMouseLeave={e=>{if(t!==active)e.currentTarget.style.color="var(--text-muted)"}}>{t}</button>)}
  </nav>;
}
