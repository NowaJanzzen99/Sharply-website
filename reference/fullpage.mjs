// Full-page screenshot through headless Chrome.
// Usage: node fullpage.mjs <url> <out.png> <width> [wait-ms] [extra-css]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, widthArg, waitArg, vhArg] = process.argv.slice(2);
const width = Number(widthArg);
const wait = Number(waitArg ?? 2500);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9342;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars",
  "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "fp-"))}`, "about:blank"]);

let ws;
for (let i = 0; i < 40 && !ws; i += 1) {
  await sleep(250);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
}
await new Promise((r) => (ws.readyState === 1 ? r() : (ws.onopen = r)));

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
};
const send = (method, params = {}) =>
  new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height: Number(vhArg ?? 1000), deviceScaleFactor: 1, mobile: width < 700 });
await send("Page.navigate", { url });
await sleep(wait);
// Let every scroll-triggered thing run, then return to the top.
await send("Runtime.evaluate", { expression: `(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}window.scrollTo(0,0);})()`, awaitPromise: true });
await sleep(1200);
const { result } = await send("Runtime.evaluate", { expression: "JSON.stringify({h:document.body.scrollHeight,s:[...document.querySelectorAll('section')].map(s=>({id:s.id,top:Math.round(s.offsetTop)}))})", returnByValue: true });
const info = JSON.parse(result.value);
const height = Math.ceil(info.h);
console.log(JSON.stringify(info.s));
const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height, scale: 1 },
});
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("saved", out, width + "x" + height);
chrome.kill();
process.exit(0);
