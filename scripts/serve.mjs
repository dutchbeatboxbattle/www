import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const base=process.env.NEXT_PUBLIC_BASE_PATH || '';
const port=Number(process.argv[2] || 4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.ico':'image/x-icon','.woff2':'font/woff2','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(base) {
      if(pathname!==base&&!pathname.startsWith(base+'/')) {res.writeHead(404);res.end();return;}
      pathname=pathname.slice(base.length)||'/';
    }
    let file=path.resolve(root,'.'+pathname);
    if(file!==root&&!file.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    if((await stat(file)).isDirectory()) file=path.join(file,'index.html');
    const contents=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(contents);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`DBB preview: http://127.0.0.1:${port}${base}/`));
