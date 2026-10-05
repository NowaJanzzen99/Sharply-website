// Films the loading screen and the flight, frame by frame. Usage: node introfilm.mjs <url> <prefix> <WxH> <ms,ms,...>
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [url,out,size,list]=process.argv.slice(2); const [w,h]=size.split("x").map(Number);
const PORT=9353; const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const chrome=spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",["--headless=new","--hide-scrollbars",`--remote-debugging-port=${PORT}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"if-"))}`,"about:blank"]);
let ws;for(let i=0;i<40&&!ws;i+=1){await sleep(250);try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const p=l.find(t=>t.type==="page");if(p)ws=new WebSocket(p.webSocketDebuggerUrl);}catch{}}
await new Promise(r=>(ws.readyState===1?r():(ws.onopen=r)));
let id=0;const pending=new Map();const logs=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}else if(m.method==="Runtime.exceptionThrown")logs.push(m.params.exceptionDetails.exception?.description?.slice(0,200));else if(m.method==="Runtime.consoleAPICalled"&&m.params.type==="error")logs.push(m.params.args.map(a=>a.value??a.description).join(" ").slice(0,200));};
const send=(m,p={})=>new Promise(res=>{const n=++id;pending.set(n,res);ws.send(JSON.stringify({id:n,method:m,params:p}));});
await send("Page.enable");await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride",{width:w,height:h,deviceScaleFactor:1,mobile:w<700});
await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"no-preference"}]});
await send("Page.navigate",{url});
// Start the clock when the document has painted something.
for(let i=0;i<100;i++){const r=await send("Runtime.evaluate",{expression:"!!document.querySelector('[data-intro]')",returnByValue:true});if(r.result?.value)break;await sleep(30);}
const t0=Date.now();
for(const at of list.split(",").map(Number)){ while(Date.now()-t0<at) await sleep(10); const s=await send("Page.captureScreenshot",{format:"jpeg",quality:75}); writeFileSync(`${out}-${String(at).padStart(4,"0")}.jpg`,Buffer.from(s.data,"base64")); }
console.log("errors:",JSON.stringify(logs));
chrome.kill();process.exit(0);
