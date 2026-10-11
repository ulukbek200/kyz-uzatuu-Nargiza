import fs from 'node:fs/promises';
await fs.mkdir('public/assets/fonts',{recursive:true});
const url='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant:wght@400;500;600&display=swap';
let css=await(await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'}})).text();
let n=0;
for(const url of [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]){
const file=`font-${++n}.${url.split('.').pop()}`;
const response=await fetch(url);if(!response.ok)throw Error(response.status);
await fs.writeFile('public/assets/fonts/'+file,Buffer.from(await response.arrayBuffer()));
css=css.replaceAll(url,'/assets/fonts/'+file);
}
await fs.writeFile('public/assets/fonts/fonts.css',css);
console.log(css);
