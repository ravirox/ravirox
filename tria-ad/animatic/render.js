// usage: node render.js <out.mp4> [fps] [start] [end]   |  node render.js --stills t1,t2,...
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto('file://' + path.join(dir, 'trilemma.html'));
  await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
  if (process.argv[2] === '--stills') {
    for (const t of process.argv[3].split(',').map(Number)) {
      const d = await page.evaluate(t => window.frame(t, 0.9), t);
      fs.writeFileSync(path.join(dir, `still_${(t*10).toFixed(0).padStart(3,'0')}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    }
    await browser.close(); return;
  }
  const out = process.argv[2], fps = +(process.argv[3] || 30), t0 = +(process.argv[4] || 0), t1 = +(process.argv[5] || 45);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((t1 - t0) * fps);
  for (let i = 0; i < n; i++) {
    const d = await page.evaluate(t => window.frame(t), t0 + i / fps);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('done', out);
})();
