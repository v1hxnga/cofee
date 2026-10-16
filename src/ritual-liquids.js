import * as THREE from 'three';
const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const smooth=(a,b,p)=>{const x=clamp((p-a)/(b-a),0,1);return x*x*(3-2*x);};
const TAU=Math.PI*2;

// Reusable meshes, evaluated from scroll position. No time integration means
// the impact, ligaments and ballistic droplets remain exactly reversible.
function createStream(material,radialSegments=12,segments=80){
 const geometry=new THREE.BufferGeometry(),positions=new Float32Array((segments+1)*(radialSegments+1)*3),indices=[];
 for(let i=0;i<segments;i++)for(let j=0;j<radialSegments;j++){const a=i*(radialSegments+1)+j,b=a+radialSegments+1;indices.push(a,b,a+1,b,b+1,a+1);}
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setIndex(indices);
 const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
 const tangent=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3(),axis=new THREE.Vector3(0,0,1);
 function update(curve,radius,growth,phase){
  mesh.visible=growth>.004;if(!mesh.visible)return;
  for(let i=0;i<=segments;i++){
   const t=i/segments*growth,center=curve(t),ahead=curve(Math.min(1,t+.002)),behind=curve(Math.max(0,t-.002));
   tangent.subVectors(ahead,behind).normalize();normal.crossVectors(axis,tangent).normalize();if(normal.lengthSq()<.01)normal.set(1,0,0);binormal.crossVectors(tangent,normal).normalize();
   // Gravity draws the jet thinner; compressed necks end in heavier beads.
   const neck=1-.12*Math.pow(.5+.5*Math.sin(t*19+phase*11),4);
   const tip=Math.min(1,Math.sqrt(Math.max(.0001,growth-t))*13);
   const r=radius*(1.12-t*.30)*neck*tip*(1+.035*Math.sin(t*43-phase*13));
   for(let j=0;j<=radialSegments;j++){
    const a=j/radialSegments*TAU,idx=(i*(radialSegments+1)+j)*3;
    const wrinkle=1+.065*Math.sin(a*3+t*22)+.025*Math.sin(a*7-t*39);
    const squash=.83+.13*Math.sin(t*13+phase*8),c=Math.cos(a)*r*wrinkle,s=Math.sin(a)*r*squash*wrinkle;
    positions[idx]=center.x+normal.x*c+binormal.x*s;positions[idx+1]=center.y+normal.y*c+binormal.y*s;positions[idx+2]=center.z+normal.z*c+binormal.z*s;
   }
  }
  geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
 }
 return{mesh,update,dispose:()=>geometry.dispose()};
}
function createSplash(material,offset,mobile){
 const rows=mobile?9:16,cols=mobile?56:100,g=new THREE.BufferGeometry(),p=new Float32Array((rows+1)*(cols+1)*3),indices=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);}
 g.setAttribute('position',new THREE.BufferAttribute(p,3).setUsage(THREE.DynamicDrawUsage));g.setIndex(indices);
 const mesh=new THREE.Mesh(g,material);mesh.frustumCulled=false;
 function update(energy,collapse,phase){
  mesh.visible=energy>.005;if(!mesh.visible)return;
  for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
   const u=x/cols,v=y/rows,a=offset+u*Math.PI*1.22,edge=Math.pow(Math.sin(u*Math.PI),.42);
   const lobes=Math.pow(.5+.5*Math.sin(a*7.3+Math.sin(a*3.7)*1.2),3);
   const serration=Math.sin(a*23+.9)*.027+Math.sin(a*41)*.014;
   const spread=.30+v*(.56+lobes*.18+serration)*energy;
   const curl=Math.sin(v*Math.PI*.88)*(1-collapse);
   const radius=spread-.11*Math.pow(v,4)*energy;
   const h=(curl*(.13+lobes*.23)+Math.pow(v,5)*lobes*.10)*energy*edge;
   // Settle beneath the rippling coffee surface instead of intersecting it.
   const i=(y*(cols+1)+x)*3;p[i]=Math.cos(a)*radius;p[i+1]=.594+h+serration*v*energy-collapse*.09;p[i+2]=Math.sin(a)*radius;
  }
  g.attributes.position.needsUpdate=true;g.computeVertexNormals();
 }
 return{mesh,update,dispose:()=>g.dispose()};
}
export function createLiquids({mobile=false}={}){
 const group=new THREE.Group();
 const coffee=new THREE.MeshPhysicalMaterial({color:0x341306,roughness:.23,metalness:0,ior:1.33,clearcoat:.2,clearcoatRoughness:.14,envMapIntensity:.8,side:THREE.DoubleSide});
 const cream=new THREE.MeshPhysicalMaterial({color:0xe7dbc4,roughness:.24,metalness:0,ior:1.36,clearcoat:.2,clearcoatRoughness:.17,envMapIntensity:.8,side:THREE.DoubleSide});
 const espresso=createStream(coffee,mobile?9:14,mobile?52:88),milk=createStream(cream,mobile?9:14,mobile?52:88);group.add(espresso.mesh,milk.mesh);
 const splashes=[createSplash(coffee,-.8,mobile),createSplash(cream,2.3,mobile)];splashes.forEach(s=>group.add(s.mesh));
 const dropletGeo=new THREE.SphereGeometry(1,mobile?8:12,mobile?6:9),count=mobile?22:48;
 const darkDrops=new THREE.InstancedMesh(dropletGeo,coffee,count),lightDrops=new THREE.InstancedMesh(dropletGeo,cream,count);darkDrops.frustumCulled=lightDrops.frustumCulled=false;group.add(darkDrops,lightDrops);const dummy=new THREE.Object3D();
 function update(p){
  const pour=smooth(.105,.205,p)*(1-smooth(.43,.51,p)),milkAmount=smooth(.275,.345,p)*(1-smooth(.46,.54,p));
  const collision=smooth(.29,.40,p),collapse=smooth(.43,.57,p);
  const curve=(kind)=>t=>{
   const sign=kind?1:-1,impact=kind?.24:-.23;
   const x=lerp(sign*(kind?1.55:1.15),impact,t)+Math.sin(t*4.4+kind)*.16*Math.sin(t*Math.PI);
   const y=3.65-Math.pow(t,.79)*3.05;
   const z=.03+Math.sin(t*3.8+kind)*.16+Math.sin(t*17+p*11)*.018;
   // The lower jet spreads into the impact instead of morphing into a perfect ring.
   return new THREE.Vector3(x+Math.sin(t*7.7+p*9)*.025*collision,y,z);
  };
  espresso.update(curve(0),.075,pour,p);milk.update(curve(1),.105,milkAmount,p);
  const energy=smooth(.28,.38,p)*(1-smooth(.47,.59,p));splashes.forEach(s=>s.update(energy,collapse,p));
  darkDrops.visible=lightDrops.visible=energy>.005;
  if(energy>.005)[darkDrops,lightDrops].forEach((mesh,kind)=>{
   for(let i=0;i<count;i++){
    const seed=i*2.399963+kind*1.1,a=seed+.14*Math.sin(i*6.7);
    const launch=.292+(i%9)*.006,age=clamp((p-launch)*5.4,0,1.5),life=smooth(0,.055,age)*(1-smooth(.92,1.45,age));
    const speed=.65+(i%7)*.18,r=.44+speed*age;
    const vertical=1.65+(i%5)*.26,y=.66+vertical*age-2.4*age*age;
    const size=(i%4===0?.038:.014)+(i%6)*.004;
    const visible=life*energy*(y>.60?1:0);const stretch=1+Math.abs(vertical-4.8*age)*.24;
    dummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r);dummy.scale.set(size*visible,size*stretch*visible,size*visible);
    dummy.rotation.set(Math.cos(a)*.4,0,-Math.sin(a)*.4);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   }
   mesh.instanceMatrix.needsUpdate=true;
  });
 }
 return{group,update,dispose(){espresso.dispose();milk.dispose();splashes.forEach(s=>s.dispose());dropletGeo.dispose();coffee.dispose();cream.dispose();}};
}
