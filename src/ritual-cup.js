import * as THREE from 'three';
import surfaceURL from '../assets/ritual-surface.jpg';

export function createCup(){
 const group=new THREE.Group();const resources=[];const keep=r=>(resources.push(r),r);
 const profile=[[0,-.64],[.49,-.64],[.57,-.61],[.66,-.52],[.77,-.30],[.88,0],[.99,.39],[1.04,.59],[1.035,.65],[1.00,.68],[.967,.65],[.95,.58],[.90,.38],[.79,.02],[.67,-.30],[.53,-.47],[0,-.47]].map(([x,y])=>new THREE.Vector2(x,y));
 const ceramic=keep(new THREE.MeshPhysicalMaterial({color:0xe4decf,roughness:.25,metalness:0,clearcoat:.9,clearcoatRoughness:.13,envMapIntensity:.65}));
 const body=new THREE.Mesh(keep(new THREE.LatheGeometry(profile,96)),ceramic);group.add(body);
 const handle=new THREE.Mesh(keep(new THREE.TorusGeometry(.39,.095,12,64)),ceramic);handle.position.set(1.02,.05,0);handle.scale.y=1.18;group.add(handle);
 const foot=new THREE.Mesh(keep(new THREE.TorusGeometry(.47,.035,10,64)),ceramic);foot.rotation.x=Math.PI/2;foot.position.y=-.635;group.add(foot);
 const surface=keep(new THREE.TextureLoader().load(surfaceURL));surface.colorSpace=THREE.SRGBColorSpace;surface.anisotropy=2;
 const uniforms={uMilk:{value:0},uSwirl:{value:0},uRitual:{value:0}};
 const coffee=keep(new THREE.MeshPhysicalMaterial({color:0xffffff,map:surface,roughness:.24,metalness:0,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:.65}));
 coffee.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,uniforms);
  shader.fragmentShader='uniform float uMilk;\nuniform float uSwirl;\nuniform float uRitual;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   #ifdef USE_MAP
   vec2 st=vMapUv-.5;
   float radius=length(st);
   float angle=atan(st.y,st.x)+uSwirl*(1.-smoothstep(0.,.72,radius));
   float wave=sin(radius*24.-uRitual*8.+sin(angle*3.))*0.008*uMilk;
   vec2 spun=vec2(cos(angle),sin(angle))*(radius+wave)+.5;
   vec4 crema=texture2D(map,clamp(spun,0.,1.));
   vec3 espresso=vec3(.022,.009,.004);
   diffuseColor*=vec4(mix(espresso,crema.rgb,uMilk),1.);
   #endif
  `);
 };
 const liquid=new THREE.Mesh(keep(new THREE.CircleGeometry(.965,96)),coffee);liquid.rotation.x=-Math.PI/2;liquid.position.y=.594;group.add(liquid);
 const label=document.createElement('canvas');label.width=512;label.height=256;const ctx=label.getContext('2d');ctx.clearRect(0,0,512,256);ctx.fillStyle='#27251e';ctx.textAlign='center';ctx.font='80px Anton, sans-serif';ctx.fillText('NOIR BEAN',256,110);ctx.font='19px DM, sans-serif';ctx.fillText('ROASTED FOR THE OBSESSED.',256,158);
 const ink=keep(new THREE.CanvasTexture(label));ink.colorSpace=THREE.SRGBColorSpace;
 const labelMat=keep(new THREE.MeshBasicMaterial({map:ink,transparent:true,depthWrite:false,toneMapped:false}));
 const signature=new THREE.Mesh(keep(new THREE.PlaneGeometry(.70,.35)),labelMat);signature.position.set(0,-.02,.927);group.add(signature);
 return{group,uniforms,liquid,ceramic,update(progress){const clamp=THREE.MathUtils.clamp;const fill=clamp((progress-.15)/.20,0,1);liquid.position.y=-.37+fill*.964;liquid.scale.setScalar(.6+fill*.4);uniforms.uMilk.value=clamp((progress-.31)/.19,0,1);uniforms.uSwirl.value=clamp((progress-.46)/.24,0,1)*4.8;uniforms.uRitual.value=progress;},dispose(){resources.forEach(r=>r.dispose());}};
}
