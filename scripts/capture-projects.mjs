/** Real UI capture; never mocks network responses or rewrites application content. */
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const dependencyRoot = process.env.CAPTURE_NODE_MODULES;
const dep = (name) => require(dependencyRoot ? resolve(dependencyRoot, name) : name);
const { chromium } = dep('playwright');
const sharp = dep('sharp');
const plan = JSON.parse(await readFile(new URL('../data/capture-plan.json', import.meta.url)));
const root = resolve(new URL('..', import.meta.url).pathname);
const selected = process.argv.slice(2);
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const previousPath=resolve(root,'data/capture-provenance.json');
let previous=[];try{previous=JSON.parse(await readFile(previousPath));}catch{}
const provenance = [];
try {
 for (const project of plan.filter(p => !selected.length || selected.includes(p.slug))) {
  const base = process.env[project.urlEnv] || project.baseUrl;
  const context = await browser.newContext({viewport:{width:1440,height:960}, deviceScaleFactor:1, reducedMotion:'reduce',locale:'en-US',timezoneId:'America/Denver'});
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let caseUrl;
  for (const shot of project.screenshots) {
   console.log(`Capturing ${project.slug}/${shot.id}`);
   if (shot.path !== undefined) await page.goto(new URL(shot.path, base).href, {waitUntil:'networkidle',timeout:45000});
   if (shot.discoverCase) {
    await page.getByRole('link', {name:/Patient A — Age/}).click();
    await page.getByRole('button', {name:'Overview',exact:true}).waitFor();
    caseUrl = page.url();
   }
   if (shot.casePage) { await page.goto(caseUrl, {waitUntil:'networkidle'}); await page.getByRole('button',{name:'Overview',exact:true}).waitFor(); }
   for (const step of shot.steps || []) {
    if (step.click) await page.locator(step.click).click();
    if (step.button) await page.getByRole('button',{name:step.button,exact:step.exact !== false}).click();
    if (step.select) await page.locator(step.select).selectOption(step.value);
    if (step.scroll) await page.locator(step.scroll).scrollIntoViewIfNeeded();
   }
   if (shot.ready) await page.locator(shot.ready).first().waitFor();
   if (shot.text) await page.getByText(shot.text,{exact:false}).first().waitFor();
   await page.evaluate(() => document.fonts.ready);
   await page.waitForTimeout(project.slug === 'powderline' ? 1800 : 450);
   const body = await page.locator('body').innerText();
   if (/Internal Server Error|Application error:|This site can.t be reached/.test(body)) throw new Error(`Error page for ${project.slug}/${shot.id}`);
   const dir = resolve(root,'assets/projects',project.slug);
   await mkdir(dir,{recursive:true});
   const png = await page.screenshot({animations:'disabled',fullPage:false});
   await sharp(png).webp({quality:86,effort:6}).toFile(resolve(dir,`${shot.id}.webp`));
   await sharp(png).resize({width:720}).webp({quality:84,effort:6}).toFile(resolve(dir,`${shot.id}-720.webp`));
   provenance.push({project:project.slug,id:shot.id,url:page.url(),capturedAt:new Date().toISOString(),viewport:{width:1440,height:960},title:await page.title(),dataNote:project.dataNote,source:project.source,bytes:png.length});
   await writeFile(previousPath,JSON.stringify([...previous.filter(p=>!provenance.some(n=>n.project===p.project && n.id===p.id)),...provenance],null,2)+'\n');
  }
  if(errors.length) throw new Error(`${project.slug} browser errors: ${errors.join('; ')}`);
  await context.close();
 }
} finally { await browser.close(); }
console.log(`Saved ${provenance.length} real UI screenshots and responsive variants.`);
