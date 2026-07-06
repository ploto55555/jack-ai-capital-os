function injectRunnerStatusStyle(){
  if(document.getElementById('runnerStatusStyle'))return;
  const s=document.createElement('style');
  s.id='runnerStatusStyle';
  s.textContent=`
    .runner-status-card{border:1px solid #1b2530;background:#080d13;border-radius:12px;padding:12px;margin:0 0 12px;box-shadow:0 0 22px rgba(83,65,210,.16)}
    .runner-status-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
    .runner-status-head b{color:#f2f6fb;font-size:13px}
    .runner-status-head button{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:900;cursor:pointer}
    .runner-status-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
    .runner-box{border:1px solid #1b2530;background:#070b10;border-radius:9px;padding:9px}
    .runner-box span{display:block;color:#8b98a8;font-size:9.5px;font-weight:900;text-transform:uppercase;margin-bottom:5px}
    .runner-box b{font-size:15px;color:#f2f6fb}
    .runner-on{color:#7ff0ad!important}.runner-warn{color:#f0b35a!important}.runner-bad{color:#ff8a94!important}
    .runner-note{color:#8b98a8;font-size:11px;margin-top:8px;line-height:1.4}
  `;
  document.head.appendChild(s);
}
async function fetchRunnerStatus(){
  const r=await fetch('/api/cloud',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'runnerStatus'})});
  return r.json();
}
function ensureRunnerStatusCard(){
  injectRunnerStatusStyle();
  const view=document.getElementById('paperView');
  const strategy=document.getElementById('strategyLab');
  const stats=document.getElementById('paperStats');
  if(!view||document.getElementById('runnerStatusCard'))return;
  const card=document.createElement('div');
  card.id='runnerStatusCard';
  card.className='runner-status-card';
  card.innerHTML='<div class="runner-status-head"><b>CLOUD AUTO STATUS</b><button id="runnerRefreshBtn">Refresh</button></div><div class="runner-status-grid" id="runnerStatusGrid"></div><div class="runner-note" id="runnerStatusNote">Loading cloud status...</div>';
  if(strategy)strategy.insertAdjacentElement('beforebegin',card);else if(stats)stats.insertAdjacentElement('afterend',card);else view.prepend(card);
  document.getElementById('runnerRefreshBtn')?.addEventListener('click',loadRunnerStatus);
}
function renderRunnerStatus(data){
  ensureRunnerStatusCard();
  const grid=document.getElementById('runnerStatusGrid');
  const note=document.getElementById('runnerStatusNote');
  if(!grid)return;
  if(!data||!data.ok){
    grid.innerHTML='<div class="runner-box"><span>Status</span><b class="runner-bad">OFF</b></div>';
    if(note)note.textContent=data?.error||'Cloud status unavailable.';
    return;
  }
  const run=data.lastRun||{};
  const totals=data.totals||{};
  const active=run.time?'Active':'Waiting';
  grid.innerHTML='<div class="runner-box"><span>Status</span><b class="runner-on">'+active+'</b></div>'+
    '<div class="runner-box"><span>Last run</span><b>'+String(run.time||'-')+'</b></div>'+
    '<div class="runner-box"><span>Opened</span><b>'+String(run.opened??'-')+'</b></div>'+
    '<div class="runner-box"><span>Rejected</span><b class="runner-warn">'+String(run.rejected??'-')+'</b></div>'+
    '<div class="runner-box"><span>Closed</span><b>'+String(run.closed??0)+'</b></div>'+
    '<div class="runner-box"><span>Cloud open</span><b>'+String(totals.open??'-')+'</b></div>';
  if(note)note.textContent='Schedule: '+(data.schedule||'Every 1 hour')+' · Cloud trades total: '+String(totals.total??0)+' · Source: '+String(run.source||'cloud');
}
async function loadRunnerStatus(){
  ensureRunnerStatusCard();
  const note=document.getElementById('runnerStatusNote');
  if(note)note.textContent='Loading latest cloud status...';
  try{const data=await fetchRunnerStatus();renderRunnerStatus(data)}catch(e){renderRunnerStatus({ok:false,error:e.message})}
}
(function(){
  setInterval(function(){if(document.getElementById('paperView')?.classList.contains('active'))loadRunnerStatus()},60000);
  setTimeout(loadRunnerStatus,3500);
  window.loadRunnerStatus=loadRunnerStatus;
})();
