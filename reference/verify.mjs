import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage();const errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
await page.goto('http://127.0.0.1:5174/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(4200);
await page.screenshot({path:'screenshots/result-mobile-initial.png'});
for(let y=0;y<5110;y+=500){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120);}
await page.waitForTimeout(6500);await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:'screenshots/result-mobile-full.png',fullPage:true});
for(const [name,y] of [['invitation',900],['calendar',1400],['address',2030],['schedule',2660],['form',3600],['hosts',4170]]){
 await page.evaluate(y=>window.scrollTo(0,y),y);await page.screenshot({path:`screenshots/result-${name}.png`});
}
const layout=await page.locator('[data-layer]').evaluateAll(es=>es.map(e=>({id:Number(e.dataset.layer),rect:{x:e.offsetLeft,y:e.offsetTop,width:e.offsetWidth,height:e.offsetHeight}})));
await page.getByLabel('Атыңызды жазыңыз…').fill('Текшерүү');
await page.getByLabel('Ооба, сөзсүз келем…').check();
await page.getByRole('button',{name:'ЖИБЕР',exact:true}).click();
const status=await page.getByRole('status').textContent();
const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('nargiza-rsvp')));
await page.getByRole('button',{name:'Музыканы токтотуу'}).click();
const paused=await page.locator('audio').evaluate(a=>a.paused);
await page.getByRole('button',{name:'Музыканы ойнотуу'}).click();await page.waitForTimeout(350);
const music=await page.locator('audio').evaluate(a=>({paused:a.paused,duration:a.duration,readyState:a.readyState}));
const responsive=[];
for(const width of [320,375,430,768,1440]){
 await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));
 responsive.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),copyOverflow:document.querySelector('.invitation-copy .layer-content').scrollHeight>document.querySelector('.invitation-copy').clientHeight})));
 if(width===320||width===1440)await page.screenshot({path:`screenshots/result-${width}.png`});
}
await sharp({create:{width:780,height:844,channels:3,background:'#fff'}}).composite([{input:'screenshots/original-mobile-initial.png',left:0,top:0},{input:'screenshots/result-mobile-initial.png',left:390,top:0}]).png().toFile('screenshots/comparison-mobile.png');
await fs.writeFile('reference/verification.json',JSON.stringify({errors,externalRequests:requests.filter(u=>!u.startsWith('http://127.0.0.1:5174')),layout,status,saved,paused,music,responsive},null,2));
console.log(JSON.stringify({errors,status,saved,paused,music,responsive,externalRequests:requests.filter(u=>!u.startsWith('http://127.0.0.1:5174'))},null,2));
await browser.close();
