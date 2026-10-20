import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const port=Number(process.env.PORT||4314);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.pdf':'application/pdf'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const path=decodeURIComponent(url.pathname);
  const safe=path==='/'?'index.html':path.replace(/^\//,'');
  // Preview serves only review artifacts, never source copies or databases.
  if(!/^(index\.html|projects-section\.html|assets\/[^.][^\0]*|data\/projects\.json)$/.test(safe))throw Error();
  const file=resolve(root,safe);if(!file.startsWith(root+sep)||!(await stat(file)).isFile())throw Error();
  res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.statusCode=404;res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Project gallery review: http://127.0.0.1:${port}`));
