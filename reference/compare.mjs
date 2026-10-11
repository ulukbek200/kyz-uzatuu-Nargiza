import fs from 'node:fs/promises';
import sharp from 'sharp';
const original=JSON.parse(await fs.readFile('reference/computed-mobile.json','utf8'));
const result=JSON.parse(await fs.readFile('reference/verification.json','utf8'));
const differences=result.layout.map(l=>{const o=original.find(o=>Number(o.id.slice(-4))===l.id);return {layer:l.id,dx:l.rect.x-o.rect.x,dy:l.rect.y-o.rect.y,dw:l.rect.width-o.rect.width,dh:l.rect.height-o.rect.height};});
const max=Math.max(...differences.flatMap(d=>[Math.abs(d.dx),Math.abs(d.dy),Math.abs(d.dw),Math.abs(d.dh)]));
await fs.writeFile('reference/geometry-comparison.json',JSON.stringify({preservedLayers:differences.length,maxDifferencePx:max,differences},null,2));
// Full-page images show fixed backgrounds only within the first viewport, as browsers capture them.
await sharp({create:{width:780,height:5180,channels:3,background:'#fff'}}).composite([{input:'screenshots/original-mobile-full.png',left:0,top:0},{input:'screenshots/result-mobile-full.png',left:390,top:0}]).png().toFile('screenshots/comparison-full.png');
console.log({preservedLayers:differences.length,maxDifferencePx:max});
