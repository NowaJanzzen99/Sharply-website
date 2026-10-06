// Screenshots of a page at given scroll positions, through a headless Chrome.
// For checking scroll choreography when the in-app browser will not paint
// scrolled frames. Usage:
//   node snap.mjs <url> <out-prefix> <width>x<height> <y1,y2,...> [wait-ms]
// A y may be written as "sel:<css>+<offset>" to scroll relative to an element.

import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, prefix, size, ys, waitArg] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const wait = Number(waitArg ?? 1600);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9341;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  "--hide-scrollbars",
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "snap-"))}`,
  "about:blank",
]);

let ws;
for (let i = 0; i < 40 && !ws; i += 1) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
  await sleep(250);
}
// The socket can open during the wait above, before anyone listens for it.
if (ws.readyState !== WebSocket.OPEN) {
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
}
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    id += 1;
    const mine = id;
    const t = setTimeout(() => reject(new Error(`timeout ${method}`)), 30000);
    pending.set(mine, (m) => {
      clearTimeout(t);
      resolve(m);
    });
    ws.send(JSON.stringify({ id: mine, method, params }));
  });
const js = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result
    ?.value;

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: Number(process.env.DSF ?? 1), mobile: width < 700 });
  // A returning visitor, so the loading screen stays out of the shots.
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: "try{sessionStorage.setItem('sharply:intro-seen','1')}catch(e){}",
  });
  // Headless Chrome inherits the Mac's "reduce motion" setting, which turns
  // scroll scenes into their static fallback. Pass NOMOTION=0 to see the real thing.
  if (process.env.MOTION === "1") {
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  }
  await send("Page.navigate", { url });
  await sleep(5000);
  let n = 0;
  for (const raw of ys.split(",")) {
    let y = raw;
    if (raw.startsWith("sel:")) {
      const [sel, off] = raw.slice(4).split("+");
      y = await js(
        `(()=>{const e=document.querySelector(${JSON.stringify(sel)});return e?Math.round(e.getBoundingClientRect().top+scrollY+${Number(off ?? 0)}):0})()`,
      );
    }
    await js(`window.scrollTo({top:${Number(y)},behavior:'instant'})`);
    await sleep(wait);
    const res = await send("Page.captureScreenshot", { format: "png" });
    const file = `${prefix}-${String(n).padStart(2, "0")}.png`;
    writeFileSync(file, Buffer.from(res.result.data, "base64"));
    console.log("saved", file, "at", y);
    n += 1;
  }
} finally {
  ws.close();
  chrome.kill();
}
