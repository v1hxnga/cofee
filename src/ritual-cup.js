import * as THREE from 'three';
import surfaceURL from '../assets/ritual-surface.jpg';

export function createCup({mobile=false}={}){
 const group=new THREE.Group();const resources=[];const keep=r=>(resources.push(r),r);
 const profile=[[0,-.64],[.49,-.64],[.57,-.61],[.66,-.52],[.77,-.30],[.88,0],[.99,.39],[1.04,.59],[1.035,.65],[1.00,.68],[.967,.65],[.95,.58],[.90,.38],[.79,.02],[.67,-.30],[.53,-.47],[0,-.47]].map(([x,y])=>new THREE.Vector2(x,y));
 const ceramic=keep(new THREE.MeshPhysicalMaterial({color:0xe4decf,roughness:.28,metalness:0,clearcoat:.5,clearcoatRoughness:.13,envMapIntensity:.45}));
 const body=new THREE.Mesh(keep(new THREE.LatheGeometry(profile,mobile?56:96)),ceramic);group.add(body);
 const handle=new THREE.Mesh(keep(new THREE.TorusGeometry(.39,.095,mobile?8:12,mobile?40:64)),ceramic);handle.position.set(1.02,.05,0);handle.scale.y=1.18;group.add(handle);
 const foot=new THREE.Mesh(keep(new THREE.TorusGeometry(.47,.035,8,mobile?40:64)),ceramic);foot.rotation.x=Math.PI/2;foot.position.y=-.635;group.add(foot);
 const surface=keep(new THREE.TextureLoader().load(surfaceURL));surface.colorSpace=THREE.SRGBColorSpace;surface.anisotropy=2;
 const uniforms={uMilk:{value:0},uSwirl:{value:0},uRitual:{value:0}};
 const coffee=keep(new THREE.MeshPhysicalMaterial({color:0xffffff,map:surface,roughness:.27,metalness:0,clearcoat:.3,clearcoatRoughness:.08,envMapIntensity:.45}));
 coffee.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,uniforms);
  shader.vertexShader='uniform float uRitual;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   float r=length(position.xy);float wave=sin(r*42.-uRitual*65.)*exp(-r*2.5)*.008;
   transformed.z+=wave*sin(clamp((uRitual-.2)*4.,0.,1.)*3.14159);`);
  shader.fragmentShader='uniform float uMilk;\nuniform float uSwirl;\nuniform float uRitual;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   #ifdef USE_MAP
   vec2 st=vMapUv-.5;
   float radius=length(st);
   float angle=atan(st.y,st.x)+uSwirl*(1.-smoothstep(0.,.72,radius));
   float wave=(sin(radius*39.-uRitual*14.+sin(angle*4.))*0.006+sin(angle*7.+radius*31.)*.004)*uMilk;
   vec2 spun=vec2(cos(angle),sin(angle))*(radius+wave)+.5;
   vec4 crema=texture2D(map,clamp(spun,0.,1.));
   vec3 espresso=vec3(.022,.009,.004);
   float diffusion=smoothstep(radius-.14,radius+.2,uMilk*.85);
   diffuseColor*=vec4(mix(espresso,crema.rgb,diffusion),1.);
   #endif
  `);
 };
 const liquid=new THREE.Mesh(keep(new THREE.CircleGeometry(.965,mobile?64:112)),coffee);liquid.rotation.x=-Math.PI/2;liquid.position.y=.594;group.add(liquid);
 const label=document.createElement('canvas');label.width=512;label.height=256;const ctx=label.getContext('2d');ctx.clearRect(0,0,512,256);ctx.fillStyle='#27251e';ctx.textAlign='center';ctx.font='80px Anton, sans-serif';ctx.fillText('NOIR BEAN',256,110);ctx.font='19px DM, sans-serif';ctx.fillText('ROASTED FOR THE OBSESSED.',256,158);
 const ink=keep(new THREE.CanvasTexture(label));ink.colorSpace=THREE.SRGBColorSpace;
 const labelMat=keep(new THREE.MeshBasicMaterial({map:ink,transparent:true,depthWrite:false,toneMapped:false}));
 const signature=new THREE.Mesh(keep(new THREE.PlaneGeometry(.70,.35)),labelMat);signature.position.set(0,-.02,.927);group.add(signature);
 const bubbleGeo=keep(new THREE.SphereGeometry(1,8,6));
 const bubbleMat=keep(new THREE.MeshPhysicalMaterial({color:0xa26d37,roughness:.19,clearcoat:1,envMapIntensity:.7}));
 const bubbles=new THREE.InstancedMesh(bubbleGeo,bubbleMat,mobile?32:72);group.add(bubbles);const dot=new THREE.Object3D();
 for(let i=0;i<bubbles.count;i++){const a=i*2.399963,r=.73+Math.sin(i*4.17)*.18,size=.005+(i%7)*.0014;dot.position.set(Math.cos(a)*r,.598,Math.sin(a)*r);dot.scale.set(size,size*.5,size);dot.updateMatrix();bubbles.setMatrixAt(i,dot.matrix);}
 return{group,uniforms,liquid,ceramic,update(progress){const clamp=THREE.MathUtils.clamp;const fill=clamp((progress-.15)/.20,0,1);liquid.position.y=-.37+fill*.964;liquid.scale.setScalar(.6+fill*.4);uniforms.uMilk.value=clamp((progress-.31)/.19,0,1);uniforms.uSwirl.value=clamp((progress-.46)/.24,0,1)*2.4;uniforms.uRitual.value=progress;bubbles.visible=progress>.37;},dispose(){resources.forEach(r=>r.dispose());}};
}
