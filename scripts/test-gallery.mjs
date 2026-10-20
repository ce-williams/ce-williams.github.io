import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CAPTURE_NODE_MODULES?resolve(process.env.CAPTURE_NODE_MODULES,'playwright'):'playwright');
const url=process.env.GALLERY_URL||'http://127.0.0.1:4314';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const checks=[];const errors=[];
await mkdir('.capture/qa',{recursive:true});
const check=(name,fn)=>async()=>{await fn();checks.push(name);console.log('PASS '+name);};
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto(url,{waitUntil:'networkidle'});
 await page.waitForSelector('.ps-enhanced');
 await check('All five projects render without horizontal page overflow',async()=>{
  assert.equal(await page.locator('.ps-card:visible').count(),5);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 })();
 const card=page.locator('.ps-card').first();
 const track=card.locator('.ps-track');
 const index=()=>track.evaluate(el=>Math.round(el.scrollLeft/el.clientWidth));
 await check('Professional experience, career disclosures and CV download work',async()=>{
  assert.equal(await page.locator('.career-timeline .career-role').count(),4);
  assert.match(await page.locator('.career-timeline').innerText(),/Fivetran/);
  assert.match(await page.locator('.career-timeline').innerText(),/Transcarent/);
  await page.locator('.career-earlier summary').click();assert.equal(await page.locator('.career-earlier .career-role:visible').count(),2);await page.locator('.career-earlier summary').click();
  const cv=await page.request.get(new URL(await page.locator('.experience-actions a[download]').getAttribute('href'),url).href);assert.equal(cv.status(),200);assert.equal((await cv.body()).subarray(0,4).toString(),'%PDF');
 })();
 await check('All 19 original screenshots load with descriptive alt text',async()=>{
  const imgs=page.locator('.ps-slide img');assert.equal(await imgs.count(),19);
  for(let i=0;i<await imgs.count();i++){const img=imgs.nth(i);assert((await img.getAttribute('alt')).length>25);const src=await img.getAttribute('src');const response=await page.request.get(new URL(src,url).href);assert.equal(response.status(),200);}
 })();
 await check('Arrows, dots, keyboard and slide wrapping work',async()=>{
  await card.locator('[data-next]').click();assert.equal(await index(),1);
  await card.locator('[data-slide="3"]').click();assert.equal(await index(),3);
  await card.locator('[data-next]').click();assert.equal(await index(),0);
  await card.locator('.ps-carousel').focus();await page.keyboard.press('ArrowRight');assert.equal(await index(),1);
  await page.keyboard.press('End');assert.equal(await index(),3);await page.keyboard.press('Home');assert.equal(await index(),0);
 })();
 await check('Mouse drag changes slides without opening the gallery',async()=>{
  await track.scrollIntoViewIfNeeded();const box=await track.boundingBox();const x=box.x+box.width*.8,y=box.y+box.height*.4;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-box.width*.65,y,{steps:12});await page.mouse.up();
  await page.waitForFunction(()=>{const t=document.querySelector('.ps-track');return Math.round(t.scrollLeft/t.clientWidth)===1;});
  assert.equal(await page.locator('dialog[open]').count(),0);
 })();
 await check('Expanded gallery supports arrows, focus containment, Escape and focus return',async()=>{
  const opener=card.locator('.ps-expand');await opener.click();const dialog=page.locator('dialog');
  assert.equal(await dialog.getAttribute('open'),'');
  await page.keyboard.press('ArrowRight');assert.match(await dialog.locator('.ps-dialog-caption').innerText(),/3 \/ 4/);
  for(let i=0;i<10;i++){await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));}
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);assert(await opener.evaluate(el=>el===document.activeElement));
 })();
 await check('Project filters and case study disclosure remain functional',async()=>{
  await page.getByRole('button',{name:'AI & workflows',exact:true}).click();assert.equal(await page.locator('.ps-card:visible').count(),2);
  await page.getByRole('button',{name:'Commerce',exact:true}).click();assert.equal(await page.locator('.ps-card:visible').count(),1);
  await page.getByRole('button',{name:'All projects',exact:true}).click();assert.equal(await page.locator('.ps-card:visible').count(),5);
  await card.locator('summary').click();assert.equal(await card.locator('details').getAttribute('open'),'');await card.locator('summary').click();
 })();
 await page.screenshot({path:'.capture/qa/desktop.png',fullPage:true});
 await check('Responsive layouts at 320, 390, 768 and 1024 pixels have no page overflow',async()=>{
  for(const width of [320,390,768,1024]){await page.setViewportSize({width,height:900});await page.waitForTimeout(80);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);}
 })();
 await check('Mobile gallery and resized carousel stay aligned',async()=>{
  await page.setViewportSize({width:390,height:844});await card.locator('[data-slide="2"]').click();assert.equal(await index(),2);
  await page.setViewportSize({width:430,height:932});await page.waitForTimeout(100);assert.equal(await index(),2);
  await card.locator('.ps-expand').click();assert(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.capture/qa/mobile.png',fullPage:true});
 })();
 await context.close();
 await check('Touch swipe navigates the mobile carousel',async()=>{
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const p=await touch.newPage();await p.goto(url);await p.waitForSelector('.ps-enhanced');await p.locator('.ps-track').first().scrollIntoViewIfNeeded();
  const box=await p.locator('.ps-track').first().boundingBox();const cdp=await touch.newCDPSession(p);const y=box.y+Math.min(box.height/2,100);const start=box.x+box.width*.9;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});
  for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start-box.width*.75*i/8,y}]});await p.waitForTimeout(25);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForFunction(()=>document.querySelector('.ps-track').scrollLeft>100);
  await touch.close();
 })();
 await check('Without JavaScript all cards, screenshots, source links and details remain available',async()=>{
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(url);
  assert.equal(await p.locator('.ps-card').count(),5);assert.equal(await p.locator('.ps-slide a').count(),19);assert.equal(await p.locator('.ps-filters:visible').count(),0);assert.equal(await p.locator('.ps-controls:visible').count(),0);
  await p.locator('summary').first().click();assert.equal(await p.locator('details').first().getAttribute('open'),'');await p.screenshot({path:'.capture/qa/no-js.png',fullPage:true});await nojs.close();
 })();
 assert.deepEqual(errors,[]);
 const projects=JSON.parse(await readFile('data/projects.json'));let bytes=0;
 for(const p of projects)for(const s of p.screenshots){bytes+=(await stat(`assets/projects/${p.slug}/${s.id}.webp`)).size;bytes+=(await stat(`assets/projects/${p.slug}/${s.id}-720.webp`)).size;}
 assert(bytes<4*1024*1024,'Screenshot asset budget exceeded');
 const result={checks,errors,screenshots:19,totalScreenshotBytes:bytes,viewportCoverage:[320,390,430,768,1024,1440],automatedAccessibility:'Semantic labels, keyboard navigation, native dialog focus, focus return, reduced motion, no-JS fallback. Not a formal WCAG audit.'};
 await writeFile('.capture/qa/report.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
