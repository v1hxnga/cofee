import * as THREE from 'three';
import {createCup} from './ritual-cup.js';
import {createLiquids} from './ritual-liquids.js';
const lerp=THREE.MathUtils.lerp,clamp=THREE.MathUtils.clamp;
const smooth=(a,b,p)=>{const x=clamp((p-a)/(b-a),0,1);return x*x*(3-2*x);};
export function createRitualScene({shared,host}){
 const {renderer,environment,beanGeometry,beanMaterial}=shared;const scene=new THREE.Scene();scene.environment=environment;
 const camera=new THREE.PerspectiveCamera(35,1,.1,60);const world=new THREE.Group();scene.add(world);
 let mobile=innerWidth<=1000;
 const cup=createCup();world.add(cup.group);const liquids=createLiquids({mobile});world.add(liquids.group);
 const key=new THREE.DirectionalLight(0xfff1d8,2.8);key.position.set(-3,6,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0xffe5bb,3);rim.position.set(4,3,-2);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xe1e7e6,.45);fill.position.set(-3,1,-1);scene.add(fill);scene.add(new THREE.AmbientLight(0xc8c0b4,.2));
 const roastMaterial=beanMaterial.clone();roastMaterial.color.set(0x573722);roastMaterial.roughness=.68;
 const beans=[];for(let i=0;i<(mobile?3:5);i++){const bean=new THREE.Mesh(beanGeometry,roastMaterial);world.add(bean);beans.push(bean);}
 const steamMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uOpacity;void main(){float y=vUv.y;float x=vUv.x-.5;float wave=sin(y*9.-uTime*.33)*.075+sin(y*19.+uTime*.12)*.025;float w=mix(.018,.12,y);float plume=exp(-pow((x-wave)/w,2.));float edge=smoothstep(0.,.12,y)*(1.-smoothstep(.4,1.,y));float filament=.5+.5*sin(y*31.-uTime*.4+x*15.);gl_FragColor=vec4(.92,.89,.80,plume*edge*(.55+filament*.45)*uOpacity);}`});
 const steamGeometry=new THREE.PlaneGeometry(1.1,2.5,1,1);const steam=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(steamGeometry,steamMaterial);m.position.set((i-1)*.27,1.8,.1+i*.06);world.add(m);steam.push(m);}
 const pointer={x:0,y:0};const onPointer=e=>{if(e.pointerType==='touch')return;pointer.x=(e.clientX/innerWidth-.5);pointer.y=(e.clientY/innerHeight-.5);};addEventListener('pointermove',onPointer,{passive:true});
 let lastW=0,lastH=0,lastProgress=-1,lastFrame=0,renderCount=0,lastPointerX=99;
 function update(progress,time){
  mobile=innerWidth<=1000;
  const needsSteam=progress>.68&&progress<.90;
  if(Math.abs(lastProgress-progress)<.00005&&!needsSteam&&Math.abs(pointer.x-lastPointerX)<.003&&renderer.domElement.parentElement===host)return;
  if(time-lastFrame<1/(mobile?30:45))return;lastFrame=time;
  if(renderer.domElement.parentElement!==host){host.appendChild(renderer.domElement);lastW=0;}
  const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;
  if(rect.width!==lastW||rect.height!==lastH){lastW=rect.width;lastH=rect.height;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.2:1.5));renderer.setSize(lastW,lastH);camera.aspect=lastW/lastH;camera.updateProjectionMatrix();}
  renderer.toneMappingExposure=.91;
  const reveal=smooth(.01,.13,progress),overhead=smooth(.46,.62,progress)*(1-smooth(.67,.79,progress)),exit=smooth(.88,.98,progress);
  const angle=lerp(.37,1.49,overhead),distance=mobile?11.6:9.4;
  camera.position.set((mobile?0:pointer.x*.10)+Math.sin(progress*3)*.22,Math.sin(angle)*distance,Math.cos(angle)*distance);camera.lookAt(0,mobile?.05:0,0);
  world.position.set(mobile?-.06:lerp(1.53,1.35,overhead),mobile?-1.12:-.15,0);
  world.position.y-=exit*6.5;world.rotation.y=lerp(-.13,.12,smooth(.65,.85,progress));
  world.scale.setScalar((mobile?1.15:1.32)+overhead*(mobile?.12:.27));
  host.style.opacity=String(smooth(.015,.12,progress));
  scene.environmentIntensity=.28+reveal*.5;
  key.intensity=.12+reveal*1.85;key.position.x=-3+progress*1.5+(mobile?0:pointer.x*.13);rim.intensity=.4+reveal*1.6;
  cup.update(progress);liquids.update(progress);
  beans.forEach((bean,i)=>{const visibility=smooth(.65,.73,progress)*(1-smooth(.88,.94,progress));bean.visible=visibility>.001;const a=i*2.399+progress*1.9;bean.position.set(Math.cos(a)*(1.5+i*.08),Math.sin(a)*1.25+.15,Math.sin(a+.8)*1.2-.4);bean.scale.setScalar((.07+(i%2)*.035)*visibility);bean.rotation.set(i*.7,progress*2+i,a);});
  steamMaterial.uniforms.uTime.value=time;steamMaterial.uniforms.uOpacity.value=smooth(.68,.76,progress)*(1-smooth(.87,.94,progress))*.19;steam.forEach(m=>m.quaternion.copy(camera.quaternion));
  renderer.render(scene,camera);lastProgress=progress;lastPointerX=pointer.x;renderCount++;
 }
 return{update,invalidate(){lastProgress=-1;lastW=0;},dispose(){removeEventListener('pointermove',onPointer);cup.dispose();liquids.dispose();roastMaterial.dispose();steamGeometry.dispose();steamMaterial.dispose();scene.clear();},get renderCount(){return renderCount;}};
}
