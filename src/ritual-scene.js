import * as THREE from 'three';
import {createCup} from './ritual-cup.js';
import {createLiquids} from './ritual-liquids.js';
const lerp=THREE.MathUtils.lerp,clamp=THREE.MathUtils.clamp;
const smooth=(a,b,p)=>{const x=clamp((p-a)/(b-a),0,1);return x*x*(3-2*x);};
export function createRitualScene({shared,host}){
 const {renderer,environment,beanGeometry,beanMaterial}=shared;const scene=new THREE.Scene();scene.environment=environment;
 const camera=new THREE.PerspectiveCamera(35,1,.1,60);const world=new THREE.Group();scene.add(world);
 let mobile=innerWidth<=1000;
 const cup=createCup({mobile});world.add(cup.group);const liquids=createLiquids({mobile});world.add(liquids.group);
 const key=new THREE.DirectionalLight(0xfff1d8,2.8);key.position.set(-3,6,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0xffe5bb,3);rim.position.set(4,3,-2);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xe1e7e6,.45);fill.position.set(-3,1,-1);scene.add(fill);scene.add(new THREE.AmbientLight(0xc8c0b4,.2));
 const roastMaterial=beanMaterial.clone();roastMaterial.color.set(0x885c38);roastMaterial.roughness=.52;
 const beans=[];for(let i=0;i<(mobile?3:5);i++){const bean=new THREE.Mesh(beanGeometry,roastMaterial);world.add(bean);beans.push(bean);}
 const steamMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uOpacity;void main(){float y=vUv.y;float x=vUv.x-.5;float wave=sin(y*9.-uTime*.33)*.075+sin(y*19.+uTime*.12)*.025;float w=mix(.018,.12,y);float plume=exp(-pow((x-wave)/w,2.));float edge=smoothstep(0.,.12,y)*(1.-smoothstep(.4,1.,y));float filament=.5+.5*sin(y*31.-uTime*.4+x*15.);gl_FragColor=vec4(.92,.89,.80,plume*edge*(.55+filament*.45)*uOpacity);}`});
 const steamGeometry=new THREE.PlaneGeometry(1.1,2.5,1,1);const steam=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(steamGeometry,steamMaterial);m.position.set((i-1)*.27,1.8,.1+i*.06);world.add(m);steam.push(m);}
 const pointer={x:0,y:0};const onPointer=e=>{if(e.pointerType==='touch')return;pointer.x=(e.clientX/innerWidth-.5);pointer.y=(e.clientY/innerHeight-.5);};addEventListener('pointermove',onPointer,{passive:true});
 const dustGeo=new THREE.BufferGeometry(),dustPositions=[];for(let i=0;i<(mobile?20:48);i++)dustPositions.push(Math.sin(i*12.7)*3.8,Math.cos(i*6.3)*2.8,Math.sin(i*3.1)*2-2);
 dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));
 const dustMat=new THREE.PointsMaterial({color:0xc6a879,size:.015,transparent:true,opacity:.24,depthWrite:false,sizeAttenuation:true});const dust=new THREE.Points(dustGeo,dustMat);world.add(dust);
 let lastW=0,lastH=0,lastProgress=-1,lastFrame=0,renderCount=0,lastPointerX=99,lastPointerY=99,smoothX=0,smoothY=0;
 function update(progress,time){
  mobile=innerWidth<=1000;const portrait=mobile&&innerHeight>innerWidth*.8;
  const needsSteam=progress>.68&&progress<.90;
  if(Math.abs(lastProgress-progress)<.00005&&!needsSteam&&Math.abs(pointer.x-smoothX)<.003&&Math.abs(pointer.y-smoothY)<.003&&renderer.domElement.parentElement===host)return;
  if(time-lastFrame<1/(mobile?30:45))return;lastFrame=time;
  if(renderer.domElement.parentElement!==host){host.appendChild(renderer.domElement);lastW=0;}
  const rect=lastW?{width:lastW,height:lastH}:host.getBoundingClientRect();if(!rect.width||!rect.height)return;
  if(rect.width!==lastW||rect.height!==lastH){lastW=rect.width;lastH=rect.height;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.2:1.5));renderer.setSize(lastW,lastH);camera.aspect=lastW/lastH;camera.updateProjectionMatrix();}
  renderer.toneMappingExposure=.98;smoothX+=(pointer.x-smoothX)*.16;smoothY+=(pointer.y-smoothY)*.16;
  const reveal=smooth(.01,.13,progress),overhead=smooth(.46,.62,progress)*(1-smooth(.67,.79,progress)),exit=smooth(.88,.98,progress);
  const angle=lerp(.34,1.50,overhead),distance=portrait?11.6:lerp(9.5,8.8,overhead);
  const fov=portrait?35:lerp(35,32,overhead);if(camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix();}
  camera.position.set((portrait?0:smoothX*.18)+Math.sin(progress*5)*.32,Math.sin(angle)*distance,Math.cos(angle)*distance);camera.lookAt(0,portrait?.05:0,0);
  world.position.set(portrait?-.06:lerp(1.53,1.35,overhead),portrait?-1.12:-.15,0);
  world.position.y-=exit*6.5;world.rotation.y=lerp(-.20,.16,smooth(.65,.85,progress));world.rotation.z=Math.sin(progress*Math.PI*2)*.035;
  dust.rotation.y=progress*.8;dustMat.opacity=reveal*(1-exit)*.22;
  world.scale.setScalar((portrait?1.15:1.32)+overhead*(portrait?.12:.23));
  host.style.opacity=String(.22+.78*smooth(0,.095,progress));
  scene.environmentIntensity=.18+reveal*.44;
  key.intensity=.12+reveal*1.85;key.position.x=-3+progress*1.5+(mobile?0:smoothX*.4);rim.intensity=.4+reveal*1.6;
  cup.update(progress);liquids.update(progress);
  beans.forEach((bean,i)=>{const visibility=smooth(.65,.73,progress)*(1-smooth(.88,.94,progress));bean.visible=visibility>.001;const a=i*2.399+progress*2.3;bean.position.set(Math.cos(a)*(1.5+i*.08),Math.sin(a)*1.25+.15,Math.sin(a+.8)*1.2-.4+(i===0?Math.sin(smooth(.70,.89,progress)*Math.PI)*2.6:0));bean.scale.setScalar((.09+(i%2)*.055+(i===0?.055:0))*visibility);bean.rotation.set(i*.7,progress*2+i,a);});
  steamMaterial.uniforms.uTime.value=time;steamMaterial.uniforms.uOpacity.value=smooth(.68,.76,progress)*(1-smooth(.87,.94,progress))*.19;steam.forEach(m=>m.quaternion.copy(camera.quaternion));
  renderer.render(scene,camera);lastProgress=progress;lastPointerX=pointer.x;lastPointerY=pointer.y;renderCount++;
 }
 return{update,invalidate(){lastProgress=-1;lastW=0;},dispose(){removeEventListener('pointermove',onPointer);cup.dispose();liquids.dispose();roastMaterial.dispose();steamGeometry.dispose();steamMaterial.dispose();dustGeo.dispose();dustMat.dispose();scene.clear();},get renderCount(){return renderCount;}};
}
