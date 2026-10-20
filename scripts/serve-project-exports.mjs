/** Serve existing static exports at their original base paths. No source files change. */
import http from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const mounts={"market-intelligence":process.env.MARKET_SOURCE,referral:process.env.REFERRAL_EXPORT,EasyEcom:process.env.EASYECOM_EXPORT,powderline:process.env.POWDERLINE_SOURCE};
for(const [name,path]of Object.entries(mounts))if(path)mounts[name]=await realpath(path);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');const [mount,...parts]=decodeURIComponent(url.pathname).slice(1).split('/');const root=mounts[mount];if(!root)throw Error();
 let file=resolve(root,...parts);if(file!==root&&!file.startsWith(root+sep))throw Error();
 try{if((await stat(file)).isDirectory())file=resolve(file,'index.html');}catch{if(!extname(file))file+='.html';else throw Error();}
 if(!file.startsWith(root+sep)||!(await stat(file)).isFile())throw Error();
 res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.statusCode=404;res.end('Not found');}}).listen(Number(process.env.CAPTURE_PORT||4310),'127.0.0.1',()=>console.log('Static capture previews: http://127.0.0.1:'+(process.env.CAPTURE_PORT||4310)));
