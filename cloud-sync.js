const CLOUD_SYNC_VERSION='v4.0.0';
let cloudReady=false;
let cloudLoading=false;
let cloudLastSync=null;

async function cloudApi(action,payload={}){
  try{
    const r=await fetch('/api/cloud',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})});
    return await r.json();
  }catch(e){return{ok:false,error:e.message||'cloud request failed'}}
}
async function cloudHealth(){const res=await cloudApi('health');cloudReady=!!res.ok;renderCloudStatus();return cloudReady}
function cloudTrades(){try{return JSON.parse(localStorage.getItem('paperTradeMemory')||'[]')}catch{return[]}}
function cloudSaveLocalTrades(items){localStorage.setItem('paperTradeMemory',JSON.stringify(items.slice(0,200)))}
async function cloudLoadTrades(){
  if(cloudLoading)return;cloudLoading=true;renderCloudStatus('loading cloud trades...');
  const res=await cloudApi('listTrades');
  if(res.ok&&Array.isArray(res.trades)){
    const local=cloudTrades();const map=new Map();[...res.trades,...local].forEach(t=>{if(t&&t.id)map.set(String(t.id),t)});
    const merged=[...map.values()].sort((a,b)=>Number(b.id||0)-Number(a.id||0));cloudSaveLocalTrades(merged);cloudLastSync=new Date().toLocaleString();
    if(typeof renderPaperPage==='function')renderPaperPage();if(typeof renderStrategyLab==='function')renderStrategyLab();renderCloudStatus('cloud loaded');
  }else{renderCloudStatus('cloud not configured');}
  cloudLoading=false;
}
async function cloudPushTrades(){
  const trades=cloudTrades();if(!trades.length)return;const res=await cloudApi('upsertTrades',{trades});cloudLastSync=new Date().toLocaleString();renderCloudStatus(res.ok?'cloud synced':'cloud sync failed');
}
async function cloudUpsertTrade(t){if(!t||!t.id)return;const res=await cloudApi('upsertTrade',{trade:t});cloudLastSync=new Date().toLocaleString();renderCloudStatus(res.ok?'cloud saved':'cloud save failed')}
async function cloudSaveRun(run){if(!run||!run.id)return;const res=await cloudApi('saveRun',{run});cloudLastSync=new Date().toLocaleString();renderCloudStatus(res.ok?'run saved cloud':'run cloud failed')}
async function cloudSaveSnowball(item){if(!item)return;await cloudApi('saveSnowball',{item:{id:item.id||Date.now(),...item}})}
function injectCloudStyle(){if(document.getElementById('cloudSyncStyle'))return;const s=document.createElement('style');s.id='cloudSyncStyle';s.textContent=`.cloud-status{display:inline-flex;align-items:center;gap:6px;border:1px solid #263442;background:#070b10;color:#8b98a8;border-radius:999px;padding:5px 9px;font-size:10.5px;font-weight:900}.cloud-status.ok{color:#7ff0ad;border-color:#2f6848;background:#0d2418}.cloud-status.warn{color:#f0b35a;border-color:#574018;background:#2c210f}.cloud-status button{background:transparent;border:0;color:inherit;font-weight:900;cursor:pointer;padding:0}`;document.head.appendChild(s)}
function ensureCloudStatus(){injectCloudStyle();const actions=document.querySelector('.paper-page-actions');if(!actions||document.getElementById('cloudStatus'))return;const el=document.createElement('span');el.id='cloudStatus';el.className='cloud-status warn';el.innerHTML='Cloud: checking';actions.insertBefore(el,actions.firstChild);el.addEventListener('click',()=>cloudLoadTrades())}
function renderCloudStatus(text){ensureCloudStatus();const el=document.getElementById('cloudStatus');if(!el)return;el.className='cloud-status '+(cloudReady?'ok':'warn');el.textContent=text||(cloudReady?('Cloud ON'+(cloudLastSync?' · '+cloudLastSync:'')):'Cloud OFF');}
function patchLocalStorageCloud(){
  const oldSet=localStorage.setItem.bind(localStorage);let timer=null;
  localStorage.setItem=function(k,v){oldSet(k,v);if(k==='paperTradeMemory'){clearTimeout(timer);timer=setTimeout(()=>{if(cloudReady)cloudPushTrades()},1200)}};
}
(function(){patchLocalStorageCloud();setInterval(renderCloudStatus,2500);setTimeout(async()=>{ensureCloudStatus();const ok=await cloudHealth();if(ok){await cloudLoadTrades();await cloudPushTrades();}},2500);window.cloudApi=cloudApi;window.cloudLoadTrades=cloudLoadTrades;window.cloudPushTrades=cloudPushTrades;window.cloudUpsertTrade=cloudUpsertTrade;window.cloudSaveRun=cloudSaveRun;window.cloudSaveSnowball=cloudSaveSnowball;})();
