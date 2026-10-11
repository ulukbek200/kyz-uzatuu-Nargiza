import fs from 'node:fs/promises';
const source=JSON.parse(await fs.readFile('reference/elements.json','utf8'));
const computed=JSON.parse(await fs.readFile('reference/computed-mobile.json','utf8'));
const styles=await fs.readFile('reference/inline.css','utf8');
await fs.mkdir('src',{recursive:true});
const layers=source.map(e=>{
 const a=e.attrs, c=computed.find(c=>c.id===e.id);
 const key=Number(e.id.slice(-4));
 const rule=styles.split(`[data-elem-id="${e.id}"]{`)[1]?.split('}')[0];
 return {key,asset:e.asset,type:a['data-elem-type'],x:Number(a['data-field-left-res-320-value']),y:Number(a['data-field-top-res-320-value']),width:Number(a['data-field-width-res-320-value']),height:c?.rect.height||Number(a['data-field-height-res-320-value'])||0,z:Number(rule?.match(/z-index:(\d+)/)?.[1]||3),animation:a['data-animate-style-res-320']||a['data-animate-style'],duration:Number(a['data-animate-duration']||3),distance:Number(a['data-animate-distance']||100),spin:!!a['data-animate-sbs-loop'],transform:c?.atom.transform==='none'?undefined:c?.atom.transform};
});
await fs.writeFile('src/layers.json',JSON.stringify(layers,null,2));
console.log('Prepared',layers.length,'independent React layers');
