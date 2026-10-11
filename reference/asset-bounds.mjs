import sharp from 'sharp';
import fs from 'node:fs/promises';
const assets=JSON.parse(await fs.readFile('reference/assets.json','utf8'));
const elements=JSON.parse(await fs.readFile('reference/elements.json','utf8'));
const out=[];
for(const a of assets.filter(a=>a.file.endsWith('.png'))){
const {data,info}=await sharp('public/assets/'+a.file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
let x0=info.width,y0=info.height,x1=0,y1=0;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>40){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
const e=elements.find(e=>e.asset===a.file);const w=Number(e?.attrs['data-field-width-res-320-value']||0),x=Number(e?.attrs['data-field-left-res-320-value']||0),y=Number(e?.attrs['data-field-top-res-320-value']||0);
out.push({file:a.file,width:info.width,height:info.height,bounds:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},visible:{x:Math.round(x+x0*w/info.width),y:Math.round(y+y0*w/info.width),w:Math.round((x1-x0+1)*w/info.width),h:Math.round((y1-y0+1)*w/info.width)}});
}
await fs.writeFile('reference/asset-bounds.json',JSON.stringify(out,null,2));console.log(out.map(a=>({file:a.file,visible:a.visible})));
