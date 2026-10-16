import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const clamp=THREE.MathUtils.clamp;
function noise(x,y,z){return Math.sin(x*16.7+Math.sin(y*7.3))*Math.sin(y*13.1+Math.cos(z*8.1))*Math.sin(z*14.7+Math.cos(x*5.6));}
function beanGeometry(mobile=false){
 const g=new THREE.SphereGeometry(1,mobile?64:112,mobile?44:80);const p=g.attributes.position;const colors=[];
 for(let i=0;i<p.count;i++){
  const ox=p.getX(i),oy=p.getY(i),oz=p.getZ(i);const surface=noise(ox,oy,oz)*.011+noise(ox*3,oy*3,oz*3)*.004;
  let x=ox*.89*(1+surface),y=oy*1.35*(1+surface),z=oz*.58*(1+surface);
  const seam=.085*Math.sin(y*2.1)+.035*Math.sin(y*5.5);
  const groove=Math.exp(-Math.pow((x-seam)/.105,2))*.31*Math.max(0,oz)*Math.pow(Math.max(0,1-oy*oy),.3);
  z-=groove;
  x+=Math.sin(y*2.4)*.045;
  const ridge=Math.sin(y*48+x*28)*Math.sin(y*21-x*19)*.003;
  z+=ridge*Math.max(0,oz);
  p.setXYZ(i,x,y,z);
  const v=.72+noise(ox*1.3,oy*1.3,oz*1.3)*.11+noise(ox*8,oy*8,oz*8)*.045;
  const dark=groove>.14 ? .50:1;
  colors.push(.37*v*dark,.185*v*dark,.082*v*dark);
 }
 g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
}
function makeBump(){
 const size=256,data=new Uint8Array(size*size*4);let seed=9302;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  seed=(seed*1664525+1013904223)>>>0;const random=seed/4294967295;
  const v=clamp(135+(random-.5)*65+Math.sin(x*.4+Math.sin(y*.07)*5)*15+Math.sin(y*.9+x*.25)*10,0,255);const i=(y*size+x)*4;
  data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const texture=new THREE.DataTexture(data,size,size);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.needsUpdate=true;return texture;
}
export function createBeans({motionAllowed}){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return {update(){},resize(){},dispose(){},supported:false};}
 let mobile=matchMedia('(max-width:760px)').matches;
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.7));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
 const hero=document.getElementById('bean-hero');hero.appendChild(renderer.domElement);hero.querySelector('.bean-fallback').hidden=true;
 const study=document.getElementById('bean-study');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,40);camera.position.set(0,0,6.4);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();
 // Broad studio strips give liquids continuous highlights, not point-like glare.
 const stripGeometry=new THREE.PlaneGeometry(1,1),stripMaterials=[];
 for(const [x,y,z,w,h,power] of [[-4,3,2,1.5,7,8],[4,2,-3,.7,5,5],[0,6,0,5,2,3]]){
  const material=new THREE.MeshBasicMaterial({color:0xffebcd,side:THREE.DoubleSide});material.color.multiplyScalar(power);stripMaterials.push(material);
  const strip=new THREE.Mesh(stripGeometry,material);strip.position.set(x,y,z);strip.scale.set(w,h,1);strip.lookAt(0,0,0);room.add(strip);
 }
 const env=pmrem.fromScene(room,.035);stripGeometry.dispose();stripMaterials.forEach(m=>m.dispose());scene.environment=env.texture;room.dispose();pmrem.dispose();
 const material=new THREE.MeshStandardMaterial({color:0x825032,vertexColors:true,roughness:.58,metalness:0,bumpMap:makeBump(),bumpScale:.045,envMapIntensity:.65});
 const geo=beanGeometry(mobile);const group=new THREE.Group();scene.add(group);
 const bean=new THREE.Mesh(geo,material);group.add(bean);bean.rotation.set(-.25,-.32,-.53);bean.scale.setScalar(1.04);
 const key=new THREE.DirectionalLight(0xffe1b0,3.8);key.position.set(-3,4,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0xeec69c,2.4);rim.position.set(3,1,-1.4);scene.add(rim);
 scene.add(new THREE.AmbientLight(0x826548,.5));
 const light=new THREE.PointLight(0xffc286,13);light.position.set(-2,-1,3);scene.add(light);
 const satellites=[];
 for(let i=0;i<3;i++){const m=new THREE.Mesh(geo,material);m.scale.setScalar(i===0?.23:.12);m.position.set(i===0?-1.9:1.8,i===1?1.8:-1.7,-.6);m.rotation.set(.8*i,.6*i,.7+i);group.add(m);satellites.push(m);}
 let currentHost=hero,active=true,pointer={x:0,y:0},smooth={x:0,y:0},lastTime=0,lastW=0,lastH=0,dirty=true,lastMoving=true;
 function resize(){mobile=matchMedia('(max-width:760px)').matches;const r=currentHost.getBoundingClientRect();if(r.width&&r.height&&(r.width!==lastW||r.height!==lastH)){lastW=r.width;lastH=r.height;dirty=true;renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}}
 resize();
 const onPointer=e=>{if(e.pointerType==='touch')return;pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2;};addEventListener('pointermove',onPointer,{passive:true});
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{entry.target.dataset.visible=entry.isIntersecting?'true':'false';});},{rootMargin:'100px'});observer.observe(hero);observer.observe(study);
 function update(time){
  const inStudy=study.dataset.visible==='true';const inHero=hero.dataset.visible!=='false';active=inStudy||inHero;if(!active||document.hidden)return;
  const host=inStudy?study:hero;if(host!==currentHost||renderer.domElement.parentElement!==host){renderer.toneMappingExposure=1.18;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.7));lastW=0;currentHost=host;dirty=true;host.appendChild(renderer.domElement);host.querySelector('.bean-fallback').hidden=true;resize();}
  if(mobile&&time-lastTime<1/30)return;lastTime=time;
  const moving=motionAllowed();if(moving!==lastMoving){dirty=true;lastMoving=moving;}if(!moving&&!dirty)return;smooth.x+=(pointer.x-smooth.x)*.035;smooth.y+=(pointer.y-smooth.y)*.035;
  const heroP=clamp(scrollY/innerHeight,0,1);const studyRect=study.getBoundingClientRect();const studyP=clamp((innerHeight-studyRect.top)/(innerHeight+studyRect.height),0,1);
  bean.rotation.x=-.19+(moving?smooth.y*.12+Math.sin(time*.25)*.06:0);
  bean.rotation.y=inStudy?-.35+(moving?studyP*.9+smooth.x*.23:0):-.35+(moving?smooth.x*.22+Math.sin(time*.17)*.18+heroP*.8:0);
  bean.rotation.z=inStudy?-.3+(moving?studyP*.45:0):-.48+(moving?heroP*.3:0);
  bean.position.y=moving?Math.sin(time*.55)*.055:0;
  bean.scale.setScalar(inStudy?1.02:1.04+heroP*.65);
  group.position.z=inStudy?0:heroP*.48;group.rotation.z=inStudy?0:heroP*-.14;
  satellites.forEach((b,i)=>{b.visible=!inStudy&&!mobile;if(moving){b.rotation.y=time*.1+i;b.position.y=(i===1?1.65:-1.65)+Math.sin(time*.4+i)*.08;}});
  camera.position.z=inStudy?6.4:(mobile?6.6:6.7);renderer.render(scene,camera);dirty=false;
 }
 return {update,resize,supported:true,shared:{renderer,environment:env.texture,beanGeometry:geo,beanMaterial:material},dispose(){observer.disconnect();removeEventListener('pointermove',onPointer);geo.dispose();material.bumpMap.dispose();material.dispose();env.dispose();renderer.dispose();}};
}
