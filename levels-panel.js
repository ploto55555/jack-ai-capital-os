function injectLevelsStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .levels-panel h3{display:flex;align-items:center;justify-content:space-between;gap:8px;}
    .levels-price{font-size:12px;color:#8b98a8;margin:4px 0 8px;}
    .levels-grid{display:grid;grid-template-columns:1fr;gap:6px;}
    .level-row{border:1px solid #1b2530;background:#070b10;border-radius:8px;padding:7px 8px;display:grid;grid-template-columns:38px 1fr;gap:8px;align-items:start;}
    .level-tf{font-size:12px;font-weight:900;color:#d7ecff;letter-spacing:.05em;}
    .level-data{font-size:11.5px;color:#c9d1d9;line-height:1.45;}
    .level-status{display:inline-flex;margin-top:4px;padding:2px 7px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.04em;}
    .level-breakout{background:#0d2418;border:1px solid #2f6848;color:#7ff0ad;}
    .level-breakdown{background:#2b1014;border:1px solid #5a1c25;color:#ff8a94;}
    .level-near{background:#2c210f;border:1px solid #574018;color:#f0b35a;}
    .level-middle{background:#101721;border:1px solid #263442;color:#b9d8ff;}
    .levels-note{margin-top:8px;border:1px solid #263442;background:#060a0f;border-radius:8px;padding:8px;font-size:11.5px;line-height:1.45;color:#9fb0c3;}
    .levels-refresh{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:900;cursor:pointer;}
  `;
  document.head.appendChild(style);
}

function replaceSelectedSymbolPanel(){
  const panel=document.querySelector('.selected-symbol-panel') || document.querySelector('.right .panel');
  if(!panel)return;
  panel.classList.add('levels-panel');
  panel.innerHTML=`<h3>SUPPORT / RESISTANCE <button class="levels-refresh" id="levelsRefresh">Refresh</button></h3>
    <div class="levels-price" id="levelsPrice">Loading levels...</div>
    <div class="levels-grid" id="levelsGrid"></div>
    <div class="levels-note" id="levelsNote">等待行情 API。</div>`;
  document.getElementById('levelsRefresh')?.addEventListener('click',()=>loadLevels(currentSymbol||'GBPJPY'));
}

function fmtLevel(n){
  const x=Number(n);
  if(!Number.isFinite(x))return '-';
  return Math.abs(x)>=10 ? x.toFixed(2) : x.toFixed(4);
}

function statusClass(status){
  const s=String(status||'').toUpperCase();
  if(s.includes('BREAKOUT'))return 'level-breakout';
  if(s.includes('BREAKDOWN'))return 'level-breakdown';
  if(s.includes('NEAR'))return 'level-near';
  if(s.includes('MIDDLE'))return 'level-middle';
  return 'level-middle';
}

function abuLevelSummary(data){
  const levels=data.levels||{};
  const order=['H1','H4','W1','M1'];
  const alerts=[];
  order.forEach(tf=>{
    const l=levels[tf];
    if(!l)return;
    if(l.status==='BREAKOUT')alerts.push(`${tf}: 突破阻力，不能追，等回踩或5M小止损。`);
    if(l.status==='BREAKDOWN')alerts.push(`${tf}: 跌破支撑，原本多单计划要防守。`);
    if(l.status==='NEAR RESISTANCE')alerts.push(`${tf}: 靠近阻力，不要中间价追高。`);
    if(l.status==='NEAR SUPPORT')alerts.push(`${tf}: 靠近支撑，等反应和小止损触发。`);
  });
  if(alerts.length)return alerts[0];
  return '没有明显突破。阿布规则：等边缘、等结构、等客观小止损。';
}

async function loadLevels(symbol){
  const price=document.getElementById('levelsPrice');
  const grid=document.getElementById('levelsGrid');
  const note=document.getElementById('levelsNote');
  if(!grid)return;
  price.textContent=`${symbol} · loading support / resistance...`;
  grid.innerHTML='';
  note.textContent='正在计算 1H / 4H / 1W / 1M levels...';
  try{
    const r=await fetch('/api/levels?symbol='+encodeURIComponent(symbol));
    const data=await r.json();
    price.textContent=`${data.symbol} · Price ${fmtLevel(data.price)} · ${data.source}`;
    const labels={H1:'1H',H4:'4H',W1:'1W',M1:'1M'};
    ['H1','H4','W1','M1'].forEach(tf=>{
      const l=data.levels?.[tf];
      if(!l)return;
      const row=document.createElement('div');
      row.className='level-row';
      row.innerHTML=`<div class="level-tf">${labels[tf]}</div><div class="level-data">S: ${fmtLevel(l.support)} / R: ${fmtLevel(l.resistance)}<br><span class="level-status ${statusClass(l.status)}">${l.status}</span></div>`;
      grid.appendChild(row);
    });
    note.textContent='ABU NOTE: '+abuLevelSummary(data)+' · '+(data.note||'');
  }catch(e){
    price.textContent=`${symbol} · levels error`;
    note.textContent='Levels API 暂时不能读取。检查 Vercel 部署或 API key。';
  }
}

(function(){
  injectLevelsStyle();
  replaceSelectedSymbolPanel();
  const oldSelect=window.selectSymbol;
  if(typeof oldSelect==='function'){
    window.selectSymbol=function(symbol){
      oldSelect(symbol);
      loadLevels(symbol);
    };
  }
  setTimeout(()=>loadLevels(window.currentSymbol||currentSymbol||'GBPJPY'),500);
})();