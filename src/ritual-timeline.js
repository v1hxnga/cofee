const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,p)=>{const x=clamp((p-a)/(b-a));return x*x*(3-2*x);};
const lerp=(a,b,t)=>a+(b-a)*t;
const PHASES=[
 {start:0,end:.145,caption:'FROM FIRST LIGHT.<br>TO THE LAST DROP.'},
 {start:.12,end:.32,caption:'ESPRESSO, UNINTERRUPTED.<br>ONE CONTINUOUS POUR.'},
 {start:.295,end:.50,caption:'TWO ELEMENTS.<br>ONE BEAUTIFUL COLLISION.'},
 {start:.475,end:.69,caption:'NOTHING TO ADD.<br>EVERYTHING IN BALANCE.'},
 {start:.665,end:.88,caption:'SINGLE ORIGIN.<br>TAKE YOUR TIME.'},
 {start:.855,end:1.1,caption:'THE NEXT OBSESSION.<br>NIGHT BLOOM / ETHIOPIA.'}
];

export function createRitual({gsap,ScrollTrigger,motionAllowed,beans,scrollToPosition}){
 const section=document.querySelector('#ritual'),stage=section.querySelector('.ritual-stage'),host=section.querySelector('.ritual-canvas');
 const disc=section.querySelector('.ritual-disc'),titles=[...section.querySelectorAll('.ritual-title')],labels=[...section.querySelectorAll('.ritual-chapters span')],caption=section.querySelector('#ritual-caption'),handoff=section.querySelector('.ritual-handoff');
 const bag=document.querySelector('.product-one .coffee-package').cloneNode(true);handoff.appendChild(bag);
 const state={progress:0};let timeline,scene,loading=false,near=false,disposed=false,lastApplied=-1,lastPhase=-1,resizeTimer,stableWidth=innerWidth,stableHeight=innerHeight,stableProgress=0,stableActive=false;
 const fine=matchMedia('(hover:hover) and (pointer:fine)');const cursor=document.querySelector('#cursor');
 const enter=()=>{if(fine.matches&&motionAllowed())cursor.classList.add('ritual-ring');},leave=()=>cursor.classList.remove('ritual-ring');
 stage.addEventListener('pointerenter',enter);stage.addEventListener('pointerleave',leave);
 async function prepare(){
  if(loading||scene||disposed||!motionAllowed())return;
  if(!beans.supported){section.classList.add('ritual-fallback');return;}
  loading=true;
  try{const{createRitualScene}=await import('./ritual-scene.js');if(disposed)return;scene=createRitualScene({shared:beans.shared,host});scene.invalidate();}
  catch(error){section.classList.add('ritual-fallback');console.warn('The ritual is using its photographic fallback.',error.message);}
 }
 const observer=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near)prepare();},{rootMargin:'120% 0px'});observer.observe(section);
 function apply(){
  const p=state.progress;if(p===lastApplied)return;lastApplied=p;
  section.dataset.progress=p.toFixed(4);
  const mobile=innerWidth<=1000&&innerHeight>innerWidth*.8,reveal=.12+.88*smooth(0,.13,p),opening=smooth(.85,.98,p);
  section.querySelector('.ritual-darkness').style.opacity=String(1-smooth(0,.085,p));
  const scale=lerp(.035,1,reveal)*(1+opening*(mobile?9:6));disc.style.transform=`translate(-50%,-50%) scale(${scale})`;disc.style.left=`${lerp(58,mobile?53:69,reveal)}%`;disc.style.top=`${lerp(5,mobile?62:46,reveal)}%`;disc.style.opacity=String(lerp(.12,1,reveal));
  titles.forEach((title,i)=>{const phase=PHASES[i],on=i===0?1:smooth(phase.start,phase.start+.035,p),off=smooth(phase.end-.04,phase.end,p);title.style.setProperty('--split',String((1-on)+off));title.style.opacity=String(on*(1-off));title.style.transform=`translate3d(${(1-on)*2-off*1.5}vw,${(1-on)*28-off*20}px,0)`;title.style.clipPath=`inset(${(1-on)*100}% 0 ${off*100}% 0)`;});
  let index=0;for(let i=1;i<PHASES.length;i++)if(p>=PHASES[i].start+.018)index=i;
  if(index!==lastPhase){lastPhase=index;labels.forEach((label,i)=>{label.classList.toggle('current',i===index);label.setAttribute('aria-current',i===index?'step':'false');});caption.innerHTML=PHASES[index].caption;section.dataset.phase=String(index+1);section.querySelector('.ritual-counter').textContent=String(index+1).padStart(2,'0');
   // A future optional sound layer may subscribe; no audio loads or autoplays.
   section.dispatchEvent(new CustomEvent('ritual:phase',{detail:{phase:index+1,progress:p}}));
  }
  section.style.color=p>.92?'#171714':'#eeebe2';
  section.querySelector('.ritual-caption').style.opacity=String(1-smooth(.83,.87,p)+smooth(.95,.99,p));
  section.querySelector('.ritual-ghost').style.transform=`translateX(${-6*p}%)`;
  section.querySelector('.ritual-meter>span').style.transform=`scaleX(${p})`;
  section.querySelector('.ritual-percent').textContent=String(Math.round(p*100)).padStart(2,'0')+'—100';
  handoff.style.opacity=String(smooth(.91,.96,p));handoff.style.transform=`translateY(${lerp(110,0,smooth(.885,.99,p))}%) rotate(${lerp(7,0,smooth(.885,.99,p))}deg)`;
  section.style.setProperty('--poster-scale',String(1+p*.16));section.style.setProperty('--poster-light',String(.4+reveal*.6));section.classList.toggle('is-ending',p>.87);
 }
 function setup(){
  timeline?.scrollTrigger?.kill(true);timeline?.kill();timeline=null;lastApplied=-1;lastPhase=-1;
  section.classList.toggle('ritual-static',!motionAllowed());section.style.color='';
  if(!motionAllowed()){leave();return;}
  state.progress=0;apply();if(near)prepare();
  // CSS owns the sticky stage and scroll space. The timeline only choreographs
  // its children: no fixed-position swap, transformed pin spacer, or pin refresh.
  section.style.setProperty('--ritual-vh',innerHeight+'px');
  section.style.setProperty('--ritual-travel',innerHeight*(innerWidth<=1000?4.4:6.2)+'px');
  timeline=gsap.timeline({scrollTrigger:{id:'coffee-ritual',trigger:section,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,refreshPriority:2,onRefresh:()=>{lastApplied=-1;scene?.invalidate();apply();}}});
  timeline.to(state,{progress:1,duration:1,ease:'none',onUpdate:apply});
 }
 function update(time){
  if(!motionAllowed()||document.hidden||!scene)return false;
  const rect=stage.getBoundingClientRect();
  if(innerWidth===stableWidth&&innerHeight===stableHeight){stableProgress=state.progress;stableActive=!!timeline?.scrollTrigger?.isActive;}
  if(rect.bottom<=0||rect.top>=innerHeight)return false;
  scene.update(state.progress,time);if(scene.renderCount>0)section.classList.add('ritual-ready');return true;
 }
 function resize(){
  // Mobile browser chrome is not a composition resize. Keep its scroll distance.
  if(innerWidth===stableWidth&&Math.abs(innerHeight-stableHeight)<stableHeight*.2&&matchMedia('(pointer:coarse)').matches)return;
  const p=stableProgress,preserve=stableActive;
  section.style.setProperty('--ritual-vh',innerHeight+'px');
  section.style.setProperty('--ritual-travel',innerHeight*(innerWidth<=1000?4.4:6.2)+'px');
  lastApplied=-1;scene?.invalidate();if(motionAllowed())apply();
  clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(disposed)return;ScrollTrigger.refresh();if(preserve&&timeline?.scrollTrigger){const trigger=timeline.scrollTrigger;scrollToPosition(trigger.start+(trigger.end-trigger.start)*p);timeline.progress(p,true);state.progress=p;lastApplied=-1;apply();}stableWidth=innerWidth;stableHeight=innerHeight;},280);
 }
 return{setup,update,resize,dispose(){disposed=true;clearTimeout(resizeTimer);observer.disconnect();timeline?.scrollTrigger?.kill(true);timeline?.kill();scene?.dispose();stage.removeEventListener('pointerenter',enter);stage.removeEventListener('pointerleave',leave);leave();}};
}
