import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const assets=JSON.parse(await fs.readFile('reference/assets.json','utf8')).filter(a=>!a.file.endsWith('mp3'));
await fs.writeFile('reference/contact-sheet.html',`<html><body style="margin:0;background:#ddd;display:grid;grid-template-columns:repeat(8,180px);gap:6px;font:16px Arial">${assets.map(a=>`<div style="background:#f5f0e6;text-align:center"><b>${a.file}</b><img style="width:180px;height:250px;object-fit:contain;display:block" src="../public/assets/${a.file}"></div>`).join('')}</body></html>`);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1490,height:1400}});
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/reference/contact-sheet.html');
await page.screenshot({path:'reference/contact-sheet.png',fullPage:true});
await browser.close();
