import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
await page.goto('https://priglasi-diamond.com/tancholpon',{waitUntil:'networkidle',timeout:60000});
await page.screenshot({path:'screenshots/original-mobile-initial.png'});
const height=await page.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<height;y+=600){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(160);}
await page.waitForTimeout(6500);
await page.evaluate(()=>window.scrollTo(0,0));
await page.waitForTimeout(500);
await page.screenshot({path:'screenshots/original-mobile-full.png',fullPage:true});
await fs.writeFile('reference/computed-mobile.json',JSON.stringify(await page.locator('.t396__elem').evaluateAll(es=>es.map(e=>({id:e.dataset.elemId,rect:e.getBoundingClientRect().toJSON(),style:getComputedStyle(e).cssText,atom:{...Object.fromEntries(['transform','borderRadius','backgroundSize','backgroundPosition','border','boxShadow','filter'].map(k=>[k,getComputedStyle(e.querySelector('.tn-atom'))[k]]))}}))),null,2));
console.log('Mobile screenshot height',height);
await page.setViewportSize({width:1440,height:1000});
await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(6500);
await page.screenshot({path:'screenshots/original-desktop.png',fullPage:true});
await browser.close();
