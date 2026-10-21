import {mkdir,copyFile,rm,readFile,cp} from 'node:fs/promises';
import {resolve} from 'node:path';
// Publish only public page assets; source copies, provenance and databases stay out.
const out=resolve('_site');await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const projects=JSON.parse(await readFile('data/projects.json'));
const paths=['index.html','assets/portfolio.css','assets/project-gallery.css','assets/project-gallery.js','assets/favicon.svg','assets/curtis-williams.webp','assets/curtis-williams-cv.pdf'];
for(const p of projects)for(const s of p.screenshots){
 if(s.asset)paths.push(`assets/projects/${p.slug}/${s.asset}`);
 else paths.push(`assets/projects/${p.slug}/${s.id}.webp`,`assets/projects/${p.slug}/${s.id}-720.webp`);
}
for(const path of paths){const target=resolve(out,path);await mkdir(resolve(target,'..'),{recursive:true});await copyFile(path,target);}
console.log(`Packaged ${paths.length} public files in _site/`);

const legacy=JSON.parse(await readFile('data/legacy-paths.json'));
for(const path of legacy){if(!/^[^./][^/]*$/.test(path))throw Error('Invalid legacy directory');await cp(path,resolve(out,path),{recursive:true,errorOnExist:true,force:false});}
console.log('Preserved legacy site directories: '+legacy.length);
