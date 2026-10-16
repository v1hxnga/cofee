import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
const html=await readFile(new URL('dist/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];assert(script,'The inline application script exists');new Script(script);
assert(!/\{\{[a-z-]+\}\}/.test(html),'No unresolved asset tokens');
assert(!/<(?:script|img|link)[^>]+(?:src|href)=["']https?:\/\//.test(html),'No external runtime script, image, or font references');
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
