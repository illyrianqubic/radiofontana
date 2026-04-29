import { chromium } from 'playwright';
const url = process.argv[2] || 'https://radiofontana.org/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const msgs = [], fails = [];
page.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', r => fails.push(`${r.method()} ${r.url()} → ${r.failure()?.errorText}`));
console.log('GOTO', url);
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
const btn = await page.$('button[aria-label="Luaj"]');
console.log('btn found:', !!btn);
if (btn) {
  const box = await btn.boundingBox();
  console.log('box:', JSON.stringify(box));
  // Check what element is actually at the play button center
  const at = await page.evaluate(({x,y}) => {
    const els = document.elementsFromPoint(x, y).slice(0, 4).map(e =>
      `${e.tagName}.${(e.className||'').toString().slice(0,80)} z=${getComputedStyle(e).zIndex} pe=${getComputedStyle(e).pointerEvents}`);
    return els;
  }, { x: box.x + box.width/2, y: box.y + box.height/2 });
  console.log('elementsFromPoint:', JSON.stringify(at, null, 2));
  try {
    await btn.click({ timeout: 5000 });
    console.log('clicked OK');
    await page.waitForTimeout(2500);
    const label = await btn.getAttribute('aria-label');
    console.log('label after click:', label);
  } catch (e) {
    console.log('click FAILED:', e.message.split('\n')[0]);
  }
}
console.log('--- console ---');
msgs.forEach(m => console.log(m));
console.log('--- failed requests ---');
fails.slice(0, 10).forEach(f => console.log(f));
await browser.close();
