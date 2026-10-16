import * as THREE from 'three';
const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const smooth=(a,b,p)=>{const x=clamp((p-a)/(b-a),0,1);return x*x*(3-2*x);};

// A changing spline is sampled into a reusable mesh. Scroll, never elapsed time,
// drives the liquid's shape so every frame can be revisited in either direction.
function createStream(material,radialSegments=10,segments=84){
 const geometry=new THREE.BufferGeometry();const positions=new Float32Array((segments+1)*(radialSegments+1)*3);const indices=[];
 for(let i=0;i<segments;i++)for(let j=0;j<radialSegments;j++){const a=i*(radialSegments+1)+j,b=a+radialSegments+1;indices.push(a,b,a+1,b,b+1,a+1);}
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(indices);
 const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
 const axis=new THREE.Vector3(0,0,1),tangent=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3();
 function update(curve,radius,growth,phase){
  mesh.visible=growth>.004;if(!mesh.visible)return;
  for(let i=0;i<=segments;i++){
   const t=i/segments*growth,center=curve(t),ahead=curve(Math.min(1,t+.002)),behind=curve(Math.max(0,t-.002));
   tangent.subVectors(ahead,behind).normalize();normal.crossVectors(axis,tangent).normalize();if(normal.lengthSq()<.01)normal.set(1,0,0);binormal.crossVectors(tangent,normal).normalize();
   const taper=Math.min(1,Math.sqrt(Math.max(.001,growth-t))*8)*(.61+Math.sin(t*Math.PI)*.30);const r=radius*taper*(1+Math.sin(t*24+phase*5)*.19+Math.sin(t*53-phase*3)*.055);
   for(let j=0;j<=radialSegments;j++){const a=j/radialSegments*Math.PI*2,idx=(i*(radialSegments+1)+j)*3;const ripple=1+Math.sin(a*3+t*31+phase*8)*.045;positions[idx]=center.x+(normal.x*Math.cos(a)+binormal.x*Math.sin(a)*(.55+Math.sin(t*7)*.18))*r*ripple;positions[idx+1]=center.y+(normal.y*Math.cos(a)+binormal.y*Math.sin(a)*(.55+Math.sin(t*7)*.18))*r*ripple;positions[idx+2]=center.z+(normal.z*Math.cos(a)+binormal.z*Math.sin(a)*(.55+Math.sin(t*7)*.18))*r*ripple;}
  }
  geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
 }
 return{mesh,update,dispose:()=>geometry.dispose()};
}
function createSplash(material,offset){
 const rows=10,cols=100,g=new THREE.BufferGeometry(),p=new Float32Array((rows+1)*(cols+1)*3),indices=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;indices.push(a,b,a+1,b,b+1,a+1);}
 g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setIndex(indices);const mesh=new THREE.Mesh(g,material);mesh.frustumCulled=false;
 function update(energy,collapse,phase){mesh.visible=energy>.005;if(!mesh.visible)return;for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
  const u=x/cols,v=y/rows,a=offset+u*Math.PI*.76,edge=Math.pow(Math.sin(u*Math.PI),.4),radius=.92+v*(.20+Math.sin(a*3+phase)*.05)*energy;
  const h=Math.pow(v,1.7)*(.06+Math.pow(.5+.5*Math.sin(a*7+Math.sin(a*13)),5)*.19)*energy*edge*(1-collapse);
  const i=(y*(cols+1)+x)*3;p[i]=Math.cos(a)*radius;p[i+1]=.61+h+.04*Math.sin(a*4+phase)*v;p[i+2]=Math.sin(a)*radius;
 }g.attributes.position.needsUpdate=true;g.computeVertexNormals();}
 return{mesh,update,dispose:()=>g.dispose()};
}
export function createLiquids({mobile=false}){
 const group=new THREE.Group();
 const coffee=new THREE.MeshPhysicalMaterial({color:0x251005,roughness:.22,metalness:0,clearcoat:.85,clearcoatRoughness:.13,envMapIntensity:.85,side:THREE.DoubleSide});
 const cream=new THREE.MeshPhysicalMaterial({color:0xd4c5a7,roughness:.3,metalness:0,clearcoat:1,clearcoatRoughness:.14,envMapIntensity:.8,side:THREE.DoubleSide});
 const espresso=createStream(coffee,mobile?8:12,mobile?56:96),milk=createStream(cream,mobile?8:12,mobile?56:96);group.add(espresso.mesh,milk.mesh);
 const splashes=[createSplash(coffee,0),createSplash(cream,Math.PI)];splashes.forEach(s=>group.add(s.mesh));
 const dropletGeo=new THREE.SphereGeometry(1,12,8);const count=mobile?14:32;const darkDrops=new THREE.InstancedMesh(dropletGeo,coffee,count),lightDrops=new THREE.InstancedMesh(dropletGeo,cream,count);darkDrops.frustumCulled=lightDrops.frustumCulled=false;group.add(darkDrops,lightDrops);const dummy=new THREE.Object3D();
 const pourCurve=new THREE.CubicBezierCurve3(new THREE.Vector3(-1.45,3.55,-.45),new THREE.Vector3(-2,2.6,.25),new THREE.Vector3(-.48,1.25,.5),new THREE.Vector3(-.12,.60,.05));
 const milkCurve=new THREE.CubicBezierCurve3(new THREE.Vector3(2.05,3.1,.1),new THREE.Vector3(2.25,1.8,.6),new THREE.Vector3(.85,1.7,.2),new THREE.Vector3(.16,.62,.02));
 function update(p){
  const pour=smooth(.115,.215,p)*(1-smooth(.49,.57,p)),milkAmount=smooth(.275,.35,p)*(1-smooth(.49,.59,p)),orbit=smooth(.30,.45,p),collapse=smooth(.46,.57,p);
  const morph=(base,sign)=>(t)=>{const point=base.getPoint(t),angle=t*Math.PI*1.55*sign+p*1.5;const radius=.82+t*.32+Math.sin(t*9+p*4)*.10;const ring=new THREE.Vector3(Math.cos(angle)*radius,.62+Math.sin(t*Math.PI)*(.78+sign*.12)+Math.sin(t*7)*.08,Math.sin(angle)*(.82+t*.12));return point.lerp(ring,orbit*.96).lerp(new THREE.Vector3(point.x*.45,.61,point.z*.45),collapse);};
  espresso.update(morph(pourCurve,1),.095*(1-collapse*.65),pour,p);milk.update(morph(milkCurve,-1),.115*(1-collapse*.65),milkAmount,p);
  const energy=smooth(.30,.40,p)*(1-smooth(.48,.59,p));splashes.forEach(s=>s.update(energy,collapse,p*4));
  darkDrops.visible=lightDrops.visible=energy>.005;
  if(energy>.005){[darkDrops,lightDrops].forEach((mesh,kind)=>{for(let i=0;i<count;i++){
   const seed=i*2.39996+kind*.9,a=seed+orbit*1.8,r=(1.05+(i%7)/7*.9)*energy;dummy.position.set(Math.cos(a)*r,.65+Math.sin(i*1.72)*.35+Math.abs(Math.sin(seed))*1.05*energy,Math.sin(a)*r*.8);
   const s=(.025+(i%5)*.009)*energy;dummy.scale.set(s,s*(1.1+(i%3)*.35),s);dummy.rotation.set(.3,a,Math.sin(seed));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  }mesh.instanceMatrix.needsUpdate=true;});}
 }
 return{group,update,dispose(){espresso.dispose();milk.dispose();splashes.forEach(s=>s.dispose());dropletGeo.dispose();coffee.dispose();cream.dispose();}};
}
