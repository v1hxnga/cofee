import {build} from 'esbuild';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const result=await build({entryPoints:[path.join(root,'src/main.js')],bundle:true,minify:true,format:'iife',target:['safari16','chrome110'],write:false,loader:{'.jpg':'dataurl'},legalComments:'eof'});
let css=await readFile(path.join(root,'src/styles.css'),'utf8');css+='\n'+await readFile(path.join(root,'src/ritual.css'),'utf8');css+='\n'+await readFile(path.join(root,'src/editorial.css'),'utf8');let html=await readFile(path.join(root,'src/index.html'),'utf8');
const assets={'ritual-poster':['assets/ritual-poster.jpg','image/jpeg'],origin:['assets/origin.jpg','image/jpeg'],cafe:['assets/cafe.jpg','image/jpeg'],'font-anton':['node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2','font/woff2'],'font-dm':['node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2','font/woff2'],'font-serif':['node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2','font/woff2']};
for(const[key,[file,mime]]of Object.entries(assets)){const data=`data:${mime};base64,${(await readFile(path.join(root,file))).toString('base64')}`;html=html.replaceAll(`{{${key}}}`,data);css=css.replaceAll(`{{${key}}}`,data);}
html=html.replace('/*STYLES*/',css).replace('/*SCRIPT*/',()=>result.outputFiles[0].text.replaceAll('</script','<\\/script'));
await mkdir(path.join(root,'dist'),{recursive:true});await writeFile(path.join(root,'dist/index.html'),html);console.log(`Built standalone website: ${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB`);
