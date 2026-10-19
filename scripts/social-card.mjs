// Dedicated share-card composer. It reuses the site's bean without changing the website.
// Run: node scripts/social-card.mjs; serve /tmp/noir-bean-social on localhost,
// then capture a 1200 x 630 viewport after the bean and fonts have loaded.
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const bundle=await build({stdin:{contents:`import {createBeans} from './src/beans.js';
const beans=createBeans({motionAllowed:()=>false});
if(!beans.supported)throw new Error('WebGL is required to render the share card');
function frame(t){beans.update(t/1000);requestAnimationFrame(frame)}requestAnimationFrame(frame);`,resolveDir:fileURLToPath(root)},bundle:true,write:false,format:'iife',minify:true});
const font=async name=>(await readFile(new URL(name,root))).toString('base64');
const anton=await font('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2');
const dm=await font('node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2');
const html=`<!doctype html><html><head><meta charset="utf-8"><title>NOIR BEAN social card</title><style>
@font-face{font-family:Anton;src:url(data:font/woff2;base64,${anton})} @font-face{font-family:DM;src:url(data:font/woff2;base64,${dm})}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#050505;color:#f0ede5}
.brand{position:absolute;left:72px;top:57px;font:28px DM,sans-serif;letter-spacing:3px}
.accent{position:absolute;left:72px;top:120px;width:54px;height:4px;background:#b8754e}
h1{position:absolute;left:68px;top:164px;margin:0;font:108px/1.07 Anton,sans-serif;letter-spacing:-1px;z-index:2}h1 span{display:block}
#bean-hero{position:absolute;width:1px;height:1px;top:-1000px}#bean-study{position:absolute;left:666px;top:50px;width:490px;height:530px}canvas{display:block}
</style></head><body><div class="brand">NOIR BEAN</div><div class="accent"></div><h1><span>ROASTED</span><span>FOR THE</span><span>OBSESSED.</span></h1><div id="bean-hero"><div class="bean-fallback"></div></div><div id="bean-study"><div class="bean-fallback"></div></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
await mkdir('/tmp/noir-bean-social',{recursive:true});await writeFile('/tmp/noir-bean-social/index.html',html);
console.log('Social card composer: /tmp/noir-bean-social/index.html');
