import fs from 'node:fs/promises';
import {load} from 'cheerio/slim';
const html=await fs.readFile('reference/original.html','utf8');
const $=load(html);
await fs.mkdir('public/assets',{recursive:true});
const assets=[...new Set($('[data-original]').map((_,e)=>$(e).attr('data-original')).get())];
assets.push($('audio source').attr('src'));
const manifest=assets.map((url,i)=>({url,file:`asset-${String(i+1).padStart(2,'0')}.${url.includes('.mp3')?'mp3':url.split('.').pop().split('?')[0]}`}));
await fs.writeFile('reference/assets.json',JSON.stringify(manifest,null,2));
const elements=$('.t396__elem').map((_,e)=>({id:e.attribs['data-elem-id'],attrs:e.attribs,asset:manifest.find(a=>a.url===$(e).find('[data-original]').attr('data-original'))?.file,html:$(e).find('.tn-atom').html()})).get();
await fs.writeFile('reference/elements.json',JSON.stringify(elements,null,2));
await fs.writeFile('reference/inline.css',$('style').map((_,e)=>$(e).text()).get().join('\n'));
console.log(elements.map(e=>({id:e.id.slice(-4),type:e.attrs['data-elem-type'],asset:e.asset,x:e.attrs['data-field-left-res-320-value'],y:e.attrs['data-field-top-res-320-value'],w:e.attrs['data-field-width-res-320-value'],h:e.attrs['data-field-height-res-320-value'],animation:e.attrs['data-animate-style']})));
if(process.argv.includes('--download')) {
 let next=0;
 await Promise.all(Array.from({length:5},async()=>{while(next<manifest.length){const a=manifest[next++];const path='public/assets/'+a.file;try{await fs.access(path);continue;}catch{}const r=await fetch(a.url);if(!r.ok)throw Error(`${r.status} ${a.url}`);await fs.writeFile(path,Buffer.from(await r.arrayBuffer()));console.log('Downloaded',a.file);}}));
}
