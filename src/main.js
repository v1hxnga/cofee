import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {createBeans} from './beans.js';
import {createRitual} from './ritual-timeline.js';
import {createEditorialMotion} from './editorial-motion.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduceQuery=matchMedia('(prefers-reduced-motion:reduce)');let userPaused=false;try{userPaused=localStorage.getItem('noir-motion')==='off';}catch{}
const motionAllowed=()=>!reduceQuery.matches&&!userPaused;
let lenis,mm,editorial,collectionTrigger,closing=false;
const track=$('.product-track');
function syncMotionButton(){const off=!motionAllowed();$('#motion-toggle').textContent=`MOTION: ${off?'OFF':'ON'}`;$('#motion-toggle').setAttribute('aria-pressed',String(off));document.body.classList.toggle('motion-off',off);}
function setIndex(i){$$('.product').forEach((p,j)=>{p.inert=motionAllowed()&&innerWidth>760&&j!==i;});$('.collection-count').textContent=`0${i+1} / 03`;$$('[data-slide]').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-current',i===j?'true':'false');});}
function setupMotion(){
 editorial?.dispose();editorial=null;mm?.revert();lenis?.destroy();lenis=null;collectionTrigger=null;gsap.set(track,{clearProps:'transform'});syncMotionButton();
 if(!motionAllowed()){ritual.setup();setIndex(0);ScrollTrigger.refresh();return;}
 lenis=new Lenis({duration:1.12,smoothWheel:true,syncTouch:false,anchors:false});lenis.on('scroll',ScrollTrigger.update);
 ritual.setup();
 mm=gsap.matchMedia();
 mm.add('(min-width:761px)',()=>{
  gsap.to('.hero-line:nth-child(1)',{xPercent:-14,rotation:-3,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.hero-line:nth-child(2)',{xPercent:20,rotation:2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.hero-line:nth-child(3)',{xPercent:-10,scaleX:1.13,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  const tween=gsap.to(track,{xPercent:-66.666666,ease:'none',scrollTrigger:{trigger:'.collection',start:'top top',end:()=>'+='+innerWidth*2.3,pin:'.collection-sticky',scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:s=>setIndex(Math.round(s.progress*2))}});collectionTrigger=tween.scrollTrigger;
  $$('.product .coffee-package').forEach((bag,i)=>{gsap.fromTo(bag,{rotation:i===1?14:-15},{rotation:i===1?4:2,ease:'none',scrollTrigger:{trigger:'.collection',start:'top top',end:()=>'+='+innerWidth*2.3,scrub:1}});});
 });
 mm.add('(min-width:1px)',()=>{
  gsap.to('.origin-image',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.origin',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.manifesto h2',{clipPath:'inset(0 0 100% 0)',y:45,duration:1.25,ease:'power3.out',scrollTrigger:{trigger:'.manifesto h2',start:'top 85%',once:true}});
  gsap.to('.giant-asterisk',{rotation:100,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.roast h2 span:nth-child(1)',{xPercent:6,ease:'none',scrollTrigger:{trigger:'.roast',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.roast h2 span:nth-child(3)',{xPercent:-3,ease:'none',scrollTrigger:{trigger:'.roast',start:'top bottom',end:'bottom top',scrub:1}});
  const temp={v:196};gsap.to(temp,{v:204,ease:'none',scrollTrigger:{trigger:'.roast',start:'top 65%',end:'bottom 50%',scrub:1},onUpdate(){const value=Math.round(temp.v);$('#temperature').textContent=value;$('#roast-phase').textContent=value<200?'01 / FIRST CRACK':value<203?'02 / DEVELOPMENT':'03 / THE PERFECT DROP';}});
  const path=$('.graph-curve'),length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.roast',start:'top 60%',end:'bottom 70%',scrub:1}});
  gsap.from('.bean-note',{y:20,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.anatomy',start:'top 40%',once:true}});
 });
 editorial=createEditorialMotion({gsap,ScrollTrigger});setIndex(0);ScrollTrigger.refresh();
}
const beans=createBeans({motionAllowed});
const ritual=createRitual({gsap,ScrollTrigger,motionAllowed,beans,scrollToPosition:top=>{if(lenis)lenis.scrollTo(top,{immediate:true,force:true});else scrollTo({top,behavior:'instant'});}});
gsap.ticker.add(time=>{lenis?.raf(time*1000);if(!ritual.update(time))beans.update(time);});gsap.ticker.lagSmoothing(0);
setupMotion();reduceQuery.addEventListener('change',setupMotion);
document.fonts.ready.then(()=>ScrollTrigger.refresh());
addEventListener('pageshow',()=>ScrollTrigger.refresh());
$('#motion-toggle').addEventListener('click',()=>{userPaused=!userPaused;if(reduceQuery.matches&&!userPaused){toast('Reduced motion is enabled in your device settings.');}try{localStorage.setItem('noir-motion',userPaused?'off':'on');}catch{}setupMotion();});
let introDone=false;
function endIntro(){if(introDone)return;introDone=true;introTimeline?.kill();gsap.to('.intro',{yPercent:-105,duration:motionAllowed()?.9:0,ease:'power4.inOut',onComplete(){ $('.intro').remove();$('#skip-intro')?.remove(); }});if(motionAllowed())gsap.from('.hero-line',{yPercent:110,stagger:.1,duration:1.1,ease:'power4.out',delay:.25});}
let introTimeline;
if(motionAllowed()){
 const progress={v:0};introTimeline=gsap.timeline({onComplete:endIntro});introTimeline.from('.intro-word',{y:90,opacity:0,duration:1,ease:'power3.out'}).to('.intro-star',{rotation:180,duration:2.5,ease:'power2.inOut'},0).to(progress,{v:100,duration:3,ease:'power1.inOut',onUpdate:()=>{$('#load-percent').textContent=String(Math.floor(progress.v)).padStart(2,'0');}},0).to('.intro-progress',{width:'100%',duration:3,ease:'power1.inOut'},0).to('.intro-word',{scale:1.03,duration:.5},3);
 $('#skip-intro').tabIndex=0;$('#skip-intro').addEventListener('click',endIntro);addEventListener('keydown',e=>{if(e.key==='Escape')endIntro();},{once:true});
}else{introDone=true;$('.intro').remove();}
setTimeout(()=>{if(!introDone)endIntro();},6500);
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200);}
function goTo(id,{instant=false}={}){const element=$(id);if(!element)return;if(lenis)lenis.scrollTo(element,{duration:1.25,immediate:instant,force:true});else element.scrollIntoView({behavior:'instant',block:'start'});}
async function transitionTo(id){if(closing)return;closing=true;const menu=$('#menu');const isOpen=menu.open;if(isOpen)closeDialog(menu);if(!motionAllowed()){goTo(id,{instant:true});closing=false;return;}lenis?.stop();const tl=gsap.timeline({onComplete:()=>{lenis?.start();closing=false;}});tl.set('.curtain',{yPercent:0,y:'101%'}).to('.curtain',{y:'0%',duration:.42,ease:'power3.inOut'}).call(()=>goTo(id,{instant:true})).to('.curtain',{y:'-101%',duration:.48,ease:'power3.inOut'},'+=.08').set('.curtain',{y:'101%'});}
$$('a[href^="#"]:not(.skip-link)').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!$(id))return;e.preventDefault();if(a.closest('#menu'))transitionTo(id);else goTo(id);}));
let previousFocus;
function openDialog(dialog){previousFocus=document.activeElement;lenis?.stop();dialog.showModal();if(motionAllowed())gsap.fromTo(dialog,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.6,ease:'power3.inOut'});dialog.querySelector('button,a')?.focus({preventScroll:true});}
function closeDialog(dialog){dialog.close();dialog.style.clipPath='';lenis?.start();if(dialog.id==='menu')$('#menu-toggle').setAttribute('aria-expanded','false');previousFocus?.focus({preventScroll:true});}
$('#menu-toggle').addEventListener('click',()=>{openDialog($('#menu'));$('#menu-toggle').setAttribute('aria-expanded','true');if(motionAllowed())gsap.fromTo('.menu-links a',{y:35,opacity:0},{y:0,opacity:1,stagger:.055,duration:.7,delay:.15});});
$('.menu-close').addEventListener('click',()=>closeDialog($('#menu')));
$$('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});$('.dialog-close',d)?.addEventListener('click',()=>closeDialog(d));d.addEventListener('click',e=>{if(e.target===d&&d.id!=='menu'){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});});
const imageSources={origin:$('.origin-image').src,cafe:$('.cafe-photo img').src};
$$('.menu-links a').forEach(a=>{const preview=()=>{const src=imageSources[a.dataset.preview];$('.menu-preview img').src=src;};a.addEventListener('pointerenter',preview);a.addEventListener('focus',preview);});
const products=[
{name:'NIGHT BLOOM.',origin:'ETHIOPIA / SIDAMA / NATURAL',copy:'Jasmine on the nose. Ripe peach in the cup. A lingering cacao finish. An expressive coffee for slow mornings.',notes:['JASMINE','PEACH','CACAO'],title:'V60 / A bright, unhurried cup',specs:[['Coffee','15 g'],['Water','250 g at 93°C'],['Grind','Medium-fine'],['Total time','2:45–3:15']],method:'Rinse your filter. Add the coffee and bloom with 45 g of water for 40 seconds. Pour slowly to 150 g, then to 250 g. Let it draw down. Sip as it cools.'},
{name:'SLOW BURN.',origin:'COLOMBIA / HUILA / WASHED',copy:'Round caramel sweetness, a lift of orange, and a cocoa finish. Quietly confident. Very good company.',notes:['CARAMEL','ORANGE','COCOA'],title:'French press / Give it a moment',specs:[['Coffee','30 g'],['Water','500 g at 94°C'],['Grind','Medium-coarse'],['Steep time','4 minutes']],method:'Add coffee, then all the water. Leave for four minutes. Gently break the crust and skim the foam. Wait another two minutes. Lower the filter just below the surface and pour slowly.'},
{name:'AFTER HOURS.',origin:'BRAZIL / CERRADO / NATURAL',copy:'Dark chocolate and toasted hazelnut. Full-bodied, familiar, and a little mysterious. Made to hold its own in milk.',notes:['DARK CHOCOLATE','HAZELNUT'],title:'Espresso / The short version',specs:[['Coffee','18 g'],['Yield','36 g espresso'],['Water','92°C'],['Shot time','27–32 seconds']],method:'Grind fine. Distribute evenly and tamp level. Pull a 36 g shot in roughly 30 seconds. Taste, then adjust the grind a little finer for more sweetness or coarser for more brightness.'}
];let selectedProduct=0;
$$('[data-product]').forEach(button=>button.addEventListener('click',()=>{selectedProduct=Number(button.dataset.product);const p=products[selectedProduct];$('#detail-name').textContent=p.name;$('#detail-origin').textContent=p.origin;$('#detail-copy').textContent=p.copy;$('#detail-notes').replaceChildren(...p.notes.map(note=>{const span=document.createElement('span');span.textContent=note;return span;}));$('#brew-title').textContent=p.title;$('#brew-specs').replaceChildren(...p.specs.flatMap(([key,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;return[dt,dd];}));$('#brew-method').textContent=p.method;const recipe=`NOIR BEAN — ${p.name}\n${p.origin}\n\n${p.title}\n\n${p.specs.map(s=>s.join(': ')).join('\n')}\n\n${p.method}\n\nTasting notes: ${p.notes.join(' / ')}\n\nA fictional NOIR BEAN collection. Brew to taste.\n`;$('#save-recipe').href='data:text/plain;charset=utf-8,'+encodeURIComponent(recipe);$('#save-recipe').download=`NOIR-BEAN-${p.name.replace('.','').replaceAll(' ','-')}-Brew-Recipe.txt`;openDialog($('#product-dialog'));$('#product-dialog').scrollTop=0;}));
$('#save-recipe').addEventListener('click',()=>toast('Your brew recipe is ready.'));
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.slide);if(collectionTrigger){const target=collectionTrigger.start+(collectionTrigger.end-collectionTrigger.start)*(index/2);if(lenis)lenis.scrollTo(target,{duration:1.1});else scrollTo({top:target,behavior:'smooth'});}else if(motionAllowed()&&innerWidth<=760){track.scrollTo({left:track.clientWidth*index,behavior:'smooth'});}else{$$('.product')[index].scrollIntoView({block:'start'});}setIndex(index);}));
track.addEventListener('scroll',()=>{if(innerWidth<=760&&motionAllowed())setIndex(Math.round(track.scrollLeft/track.clientWidth));},{passive:true});
function activatePhoto(button){$$('.cafe-photo').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});}
$$('.cafe-photo').forEach(button=>{button.addEventListener('click',()=>activatePhoto(button));button.addEventListener('pointerenter',()=>{if(innerWidth>760)activatePhoto(button);});button.addEventListener('focus',()=>activatePhoto(button));});
function showInfo(title,html){$('#info-title').textContent=title;$('#info-content').innerHTML=html;openDialog($('#info-dialog'));}
$('#visit-details').addEventListener('click',()=>showInfo('A PLACE TO SLOW DOWN.','<p>A long walnut bar. A little afternoon sun. Something remarkable in your cup.</p><p>The NOIR BEAN coffee house is part of this fictional brand concept. Its location and opening date are intentionally unannounced.</p><p><strong>Planned hours</strong><br>Monday–Friday: 07:00–18:00<br>Saturday–Sunday: 08:00–17:00</p>'));
$('#colophon').addEventListener('click',()=>showInfo('INDEPENDENT BY DESIGN.','<p>NOIR BEAN is an original, fictional specialty coffee concept. Products, tasting profiles, prices, and the future café are editorial demonstrations. This edition does not take orders or payments.</p><p>Original generated imagery, custom procedural 3D coffee beans, and a typographic identity built from Anton, DM Sans, and Instrument Serif.</p><p>Built with Three.js, GSAP, and Lenis. Every asset lives inside this file. No trackers. No cookies. Your motion preference is saved only on this device.</p>'));
const cursor=$('#cursor');const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
if(finePointer.matches){let cx=-100,cy=-100,tx=-100,ty=-100;cursor.style.display='flex';addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;},{passive:true});gsap.ticker.add(()=>{cx+=(tx-cx)*.3;cy+=(ty-cy)*.3;cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;});$$('button,a').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.add('expanded');$('span',cursor).textContent='';});el.addEventListener('pointerleave',()=>{cursor.classList.remove('expanded');$('span',cursor).textContent='';});});}
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('.page-progress').style.transform=`scaleX(${max?scrollY/max:0})`;}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',()=>{beans.resize();ritual.resize();updateProgress();if(innerWidth<=760)setIndex(Math.round(track.scrollLeft/track.clientWidth));},{passive:true});
document.fonts.ready.then(()=>ScrollTrigger.refresh());addEventListener('load',()=>{ScrollTrigger.refresh();updateProgress();});
window.NOIR={version:'1.2.0',webgl:beans.supported,motionAllowed,products:products.map(p=>p.name),ready:true};

addEventListener("pagehide",event=>{if(!event.persisted){editorial?.dispose();ritual.dispose();beans.dispose();lenis?.destroy();}});
