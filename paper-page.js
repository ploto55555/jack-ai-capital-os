function injectPaperPageStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .paper-view{display:none;grid-column:1/-1;min-height:calc(100vh - 74px);padding:0 0 14px;}
    .paper-view.active{display:block;}
    .paper-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
    .paper-top h2{font-size:16px;letter-spacing:.04em;margin:0;color:#f2f6fb;}
    .paper-page-actions{display:flex;gap:8px;align-items:center;}
    .paper-page-actions button{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:7px 12px;font-size:11px;font-weight:900;cursor:pointer;}
    .paper-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:10px;}
    .paper-stat{border:1px solid #1b2530;background:#070b10;border-radius:10px;padding:10px;}
    .paper-stat span{display:block;color:#8b98a8;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px;}
    .paper-stat b{font-size:18px;color:#f2f6fb;}
    .paper-record-card{border:1px solid #1b2530;background:#080d13;border-radius:12px;box-shadow:0 0 22px rgba(83,65,210,.22);overflow:hidden;margin-bottom:12px;}
    .paper-tabs{display:flex;background:#111622;border-bottom:1px solid #1b2530;}
    .paper-tab{padding:12px 20px;font-size:12px;font-weight:900;color:#8b98a8;border-right:1px solid #1b2530;}
    .paper-tab.active{color:#f2f6fb;border-bottom:2px solid #7c5cff;background:#151a29;}
    .paper-table-wrap{max-height:390px;overflow:auto;}
    .paper-full-table{width:100%;border-collapse:collapse;font-size:12px;min-width:1180px;}
    .paper-full-table th{position:sticky;top:0;background:#10161d;color:#d7ecff;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:10px;border-bottom:1px solid #263442;z-index:1;}
    .paper-full-table td{padding:9px 10px;border-bottom:1px solid #1b2530;color:#c9d1d9;white-space:nowrap;}
    .paper-full-table tr:nth-child(even) td{background:#0d1217;}
    .paper-full-table tr:nth-child(odd) td{background:#080d13;}
    .paper-dot{display:inline-block;width:10px;height:10px;border-radius:999px;margin-right:6px;vertical-align:-1px;}
    .paper-dot.win{background:#4ade80;}.paper-dot.loss{background:#ef4444;}.paper-dot.open{background:#60a5fa;}.paper-dot.expired{background:#f59e0b;}
    .paper-mini-btn{background:#0b1320;border:1px solid #263442;color:#9fb0c3;border-radius:6px;padding:5px 7px;font-size:10px;font-weight:900;cursor:pointer;margin-right:4px;}
    .paper-curve-card{border:1px solid #1b2530;background:#080d13;border-radius:12px;box-shadow:0 0 22px rgba(83,65,210,.18);overflow:hidden;}
    .paper-curve-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#111622;border-bottom:1px solid #1b2530;}
    .paper-curve-head b{font-size:13px;color:#f2f6fb;}.paper-curve-head span{color:#8b98a8;font-size:11px;}
    .paper-chart{height:220px;padding:12px 16px;}
    .paper-chart svg{width:100%;height:100%;display:block;}
    .paper-gridline{stroke:#1f2937;stroke-width:1;}.paper-line{fill:none;stroke:#58a6ff;stroke-width:3;}.paper-area{fill:rgba(88,166,255,.16);}.paper-point{fill:#58a6ff;}
    .paper-empty{padding:28px;color:#8b98a8;text-align:center;font-size:13px;}
  `;
  document.head.appendChild(style);
}

function ensurePaperNav(){
  const rail=document.querySelector('.side-rail');
  if(!rail || document.getElementById('paperNavBtn'))return;
  const btn=document.createElement('button');
  btn.className='rail-btn';
  btn.id='paperNavBtn';
  btn.title='Paper Trade';
  btn.innerHTML='<span>▣</span><small>Paper</small>';
  const after=[...rail.querySelectorAll('.rail-btn')].find(b=>b.title==='Scanner') || rail.children[3];
  if(after) after.insertAdjacentElement('afterend',btn); else rail.appendChild(btn);
  btn.addEventListener('click',showPaperPage);
  const dash=rail.querySelector('.rail-btn[title="Dashboard"]');
  if(dash) dash.addEventListener('click',showDashboardPage);
}

function ensurePaperPage(){
  const shell=document.querySelector('.terminal-shell');
  if(!shell || document.getElementById('paperView'))return;
  const page=document.createElement('section');
  page.id='paperView';
  page.className='paper-view';
  page.innerHTML=`
    <div class="paper-top">
      <h2>PAPER TRADE RESEARCH</h2>
      <div class="paper-page-actions"><button id="paperPageScan">Run Paper Scan</button><button id="paperBackDashboard">Back Dashboard</button></div>
    </div>
    <div class="paper-stats" id="paperStats"></div>
    <div class="paper-record-card">
      <div class="paper-tabs"><div class="paper-tab active">Paper 交易记录</div><div class="paper-tab">Abu 复盘</div><div class="paper-tab">Snowball</div></div>
      <div class="paper-table-wrap"><table class="paper-full-table" id="paperFullTable"></table></div>
    </div>
    <div class="paper-curve-card">
      <div class="paper-curve-head"><b>Paper Equity Curve</b><span>Start capital $500 · default risk 4% per paper trade</span></div>
      <div class="paper-chart" id="paperEquityChart"></div>
    </div>`;
  const main=document.querySelector('.main');
  shell.insertBefore(page,main);
  document.getElementById('paperPageScan')?.addEventListener('click',async()=>{ if(typeof runPaperScan==='function') await runPaperScan(currentSymbol||'GBPJPY'); renderPaperPage(); });
  document.getElementById('paperBackDashboard')?.addEventListener('click',showDashboardPage);
}

function showPaperPage(){
  ensurePaperPage();
  document.querySelectorAll('.side-rail .rail-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('paperNavBtn')?.classList.add('active');
  ['.heatmap','.main','.bottom-grid'].forEach(sel=>{const el=document.querySelector(sel);if(el)el.style.display='none';});
  const page=document.getElementById('paperView'); if(page)page.classList.add('active');
  renderPaperPage();
}

function showDashboardPage(){
  document.querySelectorAll('.side-rail .rail-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.rail-btn[title="Dashboard"]')?.classList.add('active');
  ['.heatmap','.main','.bottom-grid'].forEach(sel=>{const el=document.querySelector(sel);if(el)el.style.display='';});
  document.getElementById('paperView')?.classList.remove('active');
}

function getPaperPageTrades(){try{return JSON.parse(localStorage.getItem('paperTradeMemory')||'[]')}catch{return[]}}
function savePaperPageTrades(items){localStorage.setItem('paperTradeMemory',JSON.stringify(items.slice(0,100)))}
function pageFmt(n){const x=Number(n);if(!Number.isFinite(x))return '-';return Math.abs(x)>=10?x.toFixed(2):x.toFixed(4)}
function money(n){const x=Number(n)||0;return '$'+x.toFixed(2)}

function paperR(trade){
  if(trade.outcome==='LOSS')return -1;
  if(trade.outcome==='WIN')return 3;
  if(trade.outcome==='EXPIRED')return 0;
  return null;
}

function buildEquitySeries(trades){
  let eq=500;
  const closed=trades.slice().reverse().filter(t=>paperR(t)!==null);
  const series=[{i:0,equity:eq,label:'Start'}];
  closed.forEach((t,idx)=>{
    const risk=eq*0.04;
    const r=paperR(t);
    eq=eq+(risk*r);
    series.push({i:idx+1,equity:eq,label:t.symbol+' '+t.outcome,trade:t,r});
  });
  return series;
}

function paperStats(trades){
  const closed=trades.filter(t=>paperR(t)!==null);
  const wins=closed.filter(t=>t.outcome==='WIN').length;
  const losses=closed.filter(t=>t.outcome==='LOSS').length;
  const open=trades.filter(t=>t.status==='PAPER OPEN').length;
  const series=buildEquitySeries(trades);
  const last=series[series.length-1]?.equity||500;
  const winRate=closed.length?Math.round(wins/closed.length*100):0;
  return {total:trades.length,open,closed:closed.length,winRate,last,wins,losses};
}

function renderPaperStats(trades){
  const box=document.getElementById('paperStats'); if(!box)return;
  const s=paperStats(trades);
  box.innerHTML=`
    <div class="paper-stat"><span>Start capital</span><b>$500</b></div>
    <div class="paper-stat"><span>Paper equity</span><b>${money(s.last)}</b></div>
    <div class="paper-stat"><span>Total records</span><b>${s.total}</b></div>
    <div class="paper-stat"><span>Open paper</span><b>${s.open}</b></div>
    <div class="paper-stat"><span>Win rate</span><b>${s.winRate}%</b></div>`;
}

function updatePaperPageOutcome(id,outcome){
  const items=getPaperPageTrades();
  const t=items.find(x=>String(x.id)===String(id));
  if(!t)return;
  t.status='PAPER CLOSED';t.outcome=outcome;t.reviewedAt=new Date().toLocaleString();
  if(outcome==='WIN')t.review='Paper setup worked. Check if Abu entry was clean and repeatable.';
  if(outcome==='LOSS')t.review='Paper setup failed. Check chase, higher timeframe level, trigger quality, and stop logic.';
  if(outcome==='EXPIRED')t.review='Paper setup expired. Do not keep old idea alive.';
  savePaperPageTrades(items);
  try{autoJournal('PAPER PAGE REVIEW',`${t.symbol} ${outcome} · ${t.review}`)}catch{}
  renderPaperPage();
}

function renderPaperTable(trades){
  const table=document.getElementById('paperFullTable'); if(!table)return;
  if(!trades.length){table.innerHTML='<tr><td class="paper-empty">No paper trades yet. Click Run Paper Scan.</td></tr>';return;}
  table.innerHTML=`<thead><tr>
    <th>日期</th><th>Symbol</th><th>方向</th><th>Entry</th><th>Stop</th><th>TP3</th><th>TP5</th><th>状态</th><th>结果</th><th>R</th><th>盈亏$</th><th>Setup Reason</th><th>AI Review</th><th>Action</th>
  </tr></thead><tbody></tbody>`;
  const tbody=table.querySelector('tbody');
  trades.forEach(t=>{
    const r=paperR(t);
    const risk=500*0.04;
    const pnl=r===null?null:r*risk;
    const cls=t.outcome==='WIN'?'win':t.outcome==='LOSS'?'loss':t.outcome==='EXPIRED'?'expired':'open';
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${t.time||'-'}</td><td><b>${t.symbol}</b></td><td>${t.direction||'-'}</td><td>${pageFmt(t.entry)}</td><td>${pageFmt(t.stop)}</td><td>${pageFmt(t.tp3)}</td><td>${pageFmt(t.tp5)}</td><td><span class="paper-dot ${cls}"></span>${t.status||'-'}</td><td>${t.outcome||'TRACKING'}</td><td>${r===null?'-':r+'R'}</td><td>${pnl===null?'-':money(pnl)}</td><td>${t.reason||'-'}</td><td>${t.review||'Waiting review'}</td><td>${t.status==='PAPER OPEN'?'<button class="paper-mini-btn" data-out="WIN">Win</button><button class="paper-mini-btn" data-out="LOSS">Loss</button><button class="paper-mini-btn" data-out="EXPIRED">Expired</button>':'-'}</td>`;
    tr.querySelectorAll('button[data-out]').forEach(b=>b.addEventListener('click',()=>updatePaperPageOutcome(t.id,b.dataset.out)));
    tbody.appendChild(tr);
  });
}

function renderEquityChart(trades){
  const box=document.getElementById('paperEquityChart'); if(!box)return;
  const series=buildEquitySeries(trades);
  if(series.length<2){box.innerHTML='<div class="paper-empty">Equity curve will appear after paper trades are reviewed.</div>';return;}
  const w=900,h=190,p=18;
  const vals=series.map(x=>x.equity); const min=Math.min(...vals), max=Math.max(...vals); const span=Math.max(1,max-min);
  const pts=series.map((d,idx)=>{const x=p+(idx/(series.length-1))*(w-p*2);const y=h-p-((d.equity-min)/span)*(h-p*2);return {...d,x,y};});
  const line=pts.map(p=>`${p.x},${p.y}`).join(' ');
  const area=`${p},${h-p} `+line+` ${w-p},${h-p}`;
  const grid=[0,1,2,3].map(i=>`<line class="paper-gridline" x1="${p}" y1="${p+i*(h-p*2)/3}" x2="${w-p}" y2="${p+i*(h-p*2)/3}"/>`).join('');
  box.innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${grid}<polygon class="paper-area" points="${area}"/><polyline class="paper-line" points="${line}"/>${pts.map(pt=>`<circle class="paper-point" cx="${pt.x}" cy="${pt.y}" r="4"><title>${pt.label}: ${money(pt.equity)}</title></circle>`).join('')}</svg>`;
}

function renderPaperPage(){
  ensurePaperPage();
  const trades=getPaperPageTrades();
  renderPaperStats(trades);renderPaperTable(trades);renderEquityChart(trades);
}

(function(){
  injectPaperPageStyle();ensurePaperNav();ensurePaperPage();renderPaperPage();
})();