// Drives a local headless Chrome over the DevTools protocol to capture
// liveweddingpaintings.nl the way a visitor sees it: scrolled for real, with
// every scroll reveal given time to finish. No dependencies: Node's built-in
// fetch and WebSocket are enough.
//
// Usage: node capture.mjs
// Output: section shots, a stitched full page, and mobile shots, in this folder.

import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9337;
const URL = "https://liveweddingpaintings.nl/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "lwp-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  // A headless tab counts as backgrounded; without these it stops painting,
  // and a screenshot waits forever for a frame that never comes.
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "about:blank",
]);

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not come up");
}

const ws = new WebSocket(await target());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    id += 1;
    const mine = id;
    const timer = setTimeout(() => reject(new Error(`timeout: ${method}`)), 30000);
    pending.set(mine, (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
    ws.send(JSON.stringify({ id: mine, method, params }));
  });
const js = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }))
    .result?.result?.value;
const shot = async (file) => {
  await clean();
  await sleep(300);
  const res = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(file, Buffer.from(res.result.data, "base64"));
  console.log("saved", file);
};

/*
  The live site greets a first visit with a newsletter popup and a cookie note.
  Both are dismissed per visitor, and this throwaway profile is always a first
  visit, so they are hidden with a stylesheet instead of clicked: nothing is
  submitted, nothing is accepted, the site itself is untouched.
*/
// Attribute selectors, so Tailwind's bracketed class names need no escaping.
const CLEAN =
  '[class~="z-[998]"], [class~="z-[997]"] { display: none !important; } ' +
  "html, body { overflow: auto !important; }";

/** Removes the popup and the cookie note from the page, rather than styling them away. */
async function clean() {
  await js(`(()=>{document.querySelectorAll('[class~="z-[998]"], [class~="z-[997]"]').forEach(e=>e.remove()); document.documentElement.style.overflow=''; document.body.style.overflow='';})()`);
}

async function load(width, height, scale, mobile) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: scale,
    mobile,
  });
  if (mobile) {
    await send("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  }
  await send("Page.enable");
  await send("Page.navigate", { url: URL });
  await sleep(6000);
  await clean();
}

/** Scrolls through the whole page once, slowly, so every reveal has fired. */
async function warm() {
  const total = await js("document.documentElement.scrollHeight");
  for (let y = 0; y < total; y += 300) {
    await js(`window.scrollTo({top:${y},behavior:'instant'})`);
    await sleep(160);
  }
  await js("window.scrollTo({top:0,behavior:'instant'})");
  await sleep(1500);
}

async function sectionShots(prefix, ids) {
  for (const section of ids) {
    await js(
      `(()=>{const el=document.getElementById('${section}'); if(!el) return; window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 0, behavior:'instant'});})()`,
    );
    await sleep(2600);
    await shot(`${prefix}-${section}.png`);
  }
}

/** Viewport tiles from top to bottom, to be stitched into one long page. */
async function tiles(prefix, height) {
  await js("window.scrollTo({top:0,behavior:'instant'})");
  await sleep(1800);
  const total = await js("document.documentElement.scrollHeight");
  let n = 0;
  for (let y = 0; y < total; y += height) {
    await js(`window.scrollTo({top:${y},behavior:'instant'})`);
    await sleep(1400);
    if (n === 1) {
      // The fixed header belongs at the top of the page only, not on every tile.
      await js(
        `(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(
          'nav.fixed, [class~="h-[3px]"] { visibility: hidden !important; }',
        )};document.head.appendChild(s)})()`,
      );
      await sleep(200);
    }
    await shot(`${prefix}-tile-${String(n).padStart(2, "0")}.png`);
    n += 1;
  }
  writeFileSync(`${prefix}-tiles.json`, JSON.stringify({ total, height, count: n }));
}

try {
  console.log("connected");
  await load(1440, 900, 1, false);
  console.log("loaded desktop");
  await warm();
  await shot("d-hero.png");
  await sectionShots("d", ["over", "formaten", "reviews", "boeken", "faq"]);
  await tiles("d", 900);

  await load(390, 844, 2, true);
  await warm();
  await shot("m-hero.png");
  await sectionShots("m", ["over", "formaten", "boeken"]);
} finally {
  ws.close();
  chrome.kill();
}
