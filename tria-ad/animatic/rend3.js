// node rend3.js stills 7.6,12.2   |   node rend3.js video out.mp4 0 60   (serve this folder on :8765 first)
const {chromium}=require('playwright');const fs=require('fs');const {spawn}=require('child_process');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('E',e.message));
await p.goto('http://127.0.0.1:8765/final.html');await p.waitForFunction(()=>window.ready,null,{timeout:120000});
if(process.argv[2]==='stills'){for(const t of process.argv[3].split(',').map(Number)){const d=await p.evaluate(t=>window.frame(t,0.85),t);fs.writeFileSync(`st_${String(Math.round(t*10)).padStart(3,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'));}await b.close();return;}
const out=process.argv[3],t0=+process.argv[4],t1=+process.argv[5],FPS=24;
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
const n=Math.round((t1-t0)*FPS);for(let i=0;i<n;i++){const d=await p.evaluate(t=>window.frame(t),t0+i/FPS);
 if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));if(i%96==0)console.log('f',i,'/',n);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out);})();
