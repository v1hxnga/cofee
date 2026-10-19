import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
const html=await readFile(new URL('dist/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];assert(script,'The inline application script exists');new Script(script);
assert(!/\{\{[a-z-]+\}\}/.test(html),'No unresolved asset tokens');
assert(!/<(?:script|img|link)[^>]+(?:src|href)=["']https?:\/\//.test(html.replace(/<link rel="canonical" href="https:\/\/coffee-ecru-rho\.vercel\.app\/">/,'')),'No external runtime script, image, or font references');
for(const id of ['home','story','origin','bean','roast','ritual','collection','cafe','visit','menu','product-dialog','info-dialog'])assert(html.includes(`id="${id}"`),`Section ${id} exists`);
assert((html.match(/class="product product-/g)||[]).length===3,'Three product scenes');
assert(html.includes('prefers-reduced-motion'),'Reduced motion support');
assert(html.includes('Skip to content'),'Skip link exists');
console.log('PASS — inline JavaScript parses; embedded assets resolved; no remote runtime asset URLs; all sections and products present; accessibility hooks present.');

assert((html.match(/class="ritual-title"/g)||[]).length===6,'Six cinematic phases');
assert(html.indexOf('id="roast"')<html.indexOf('id="ritual"')&&html.indexOf('id="ritual"')<html.indexOf('id="collection"'),'Ritual sits between roast and collection');
const {createLiquids}=await import('./src/ritual-liquids.js');
for(const mobile of [false,true]){
 const liquid=createLiquids({mobile});
 const snapshot=()=>{const values=[];liquid.group.traverse(object=>{if(object.geometry?.attributes.position)values.push(...object.geometry.attributes.position.array);if(object.instanceMatrix)values.push(...object.instanceMatrix.array);});return values;};
 for(let i=0;i<=100;i++){liquid.update(i/100);assert(snapshot().every(Number.isFinite),'All liquid mesh coordinates stay finite throughout the timeline');}
 liquid.update(.38);const forward=snapshot();liquid.update(.72);liquid.update(.38);assert.deepEqual(snapshot(),forward,'Reversing scroll returns to the same liquid geometry');liquid.dispose();
}
console.log('PASS — six-phase placement; finite desktop/mobile liquid geometry; deterministic reverse scrubbing.');

// Metadata must exist in raw HTML, with no client-side rendering required.
const expectedSocial={"og:type": "website", "og:site_name": "NOIR BEAN", "og:title": "NOIR BEAN — Roasted for the obsessed.", "og:description": "Independent specialty coffee. Small lots, big character. Roasted for the obsessed.", "og:url": "https://coffee-ecru-rho.vercel.app/", "og:image": "https://coffee-ecru-rho.vercel.app/social-preview-v2.jpg", "og:image:type": "image/jpeg", "og:image:width": "1200", "og:image:height": "630", "og:image:alt": "NOIR BEAN — Roasted for the obsessed.", "twitter:card": "summary_large_image", "twitter:title": "NOIR BEAN — Roasted for the obsessed.", "twitter:description": "Independent specialty coffee. Small lots, big character. Roasted for the obsessed.", "twitter:image": "https://coffee-ecru-rho.vercel.app/social-preview-v2.jpg", "twitter:image:alt": "NOIR BEAN — Roasted for the obsessed."};
for(const [key,value] of Object.entries(expectedSocial)){
 const attribute=key.startsWith('og:')?'property':'name';
 const expected=`<meta ${attribute}="${key}" content="${value}">`;
 assert.equal(html.split(expected).length-1,1,`Exactly one correct ${key} tag`);
}
assert.equal((html.match(/rel="canonical"/g)||[]).length,1,'Exactly one canonical');
assert(html.includes('<link rel="canonical" href="https://coffee-ecru-rho.vercel.app/">'),'Production canonical');
assert.equal(await readFile(new URL('NOIR BEAN.html',import.meta.url),'utf8'),html,'Standalone export matches production HTML');
const image=await readFile(new URL('dist/social-preview-v2.jpg',import.meta.url));
assert.deepEqual(image,await readFile(new URL('assets/social-preview-v2.jpg',import.meta.url)),'Public image copied byte-for-byte');
assert.equal(image.readUInt16BE(0),0xffd8,'Actual JPEG signature');
let dimensions;
for(let offset=2;offset<image.length;){
 assert.equal(image[offset],0xff,'Valid JPEG marker');
 const marker=image[offset+1],length=image.readUInt16BE(offset+2);
 if([0xc0,0xc1,0xc2].includes(marker)){dimensions=[image.readUInt16BE(offset+7),image.readUInt16BE(offset+5)];break;}
 offset+=length+2;
}
assert.deepEqual(dimensions,[1200,630],'Social image is exactly 1200 x 630');
assert(image.length<500_000,'Social JPEG is below 500 KB');
console.log(`PASS — raw social metadata, canonical, standalone export, public JPEG (1200×630; ${Math.round(image.length/1024)} KB).`);
