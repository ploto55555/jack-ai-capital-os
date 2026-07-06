function injectLevelsStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .levels-panel{max-height:240px!important;min-height:220px!important;overflow:hidden!important;padding-bottom:8px!important;}
    .levels-panel h3{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px!important;font-size:13px!important;}
    .levels-price{font-size:11.5px;color:#8b98a8;margin:2px 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .levels-table{display:grid;grid-template-columns:34px 1.25fr 1.25fr 72px;gap:0;border:1px solid #1b2530;border-radius:8px;overflow:hidden;background:#070b10;}
    .levels-head,.levels-cell{padding:5px 5px;border-bottom:1px solid #151d26;font-size:10.5px;line-height:1.2;white-space:nowrap;}
    .levels-head{color:#8b98a8;background:#060a0f;font-weight:900;text-transform:uppercase;font-size:9px;letter-spacing:.04em;}
    .levels-cell{color:#c9d1d9;font-weight:700;overflow:hidden;text-overflow:ellipsis;}
    .levels-table div:nth-last-child(-n+4){border-bottom:0;}
    .level-tf{color:#d7ecff;font-weight:900;}
    .level-distance{color:#8b98a8;font-size:9.5px;font-weight:800;margin-left:3px;}
    .level-status{display:inline-flex;padding:2px 6px;border-radius:999px;font-size:9.2px;font-weight:900;letter-spacing:.02em;max-width:66px;overflow:hidden;text-overflow:ellipsis;}
    .level-breakout{background:#0d2418;border:1px solid #2f6848;color:#7ff0ad;}
    .level-breakdown{background:#2b1014;border:1px solid #5a1c25;color:#ff8a94;}
    .level-near{background:#2c210f;border:1px solid #574018;color:#f0b35a;}
    .level-middle{background:#101721;border:1px solid #263442;color:#b9d8ff;}
    .levels-note{margin-top:6px;border:1px solid #263442;background:#060a0f;border-radius:8px;padding:6px 7px;font-size:10.8px;line-height:1.35;color:#9fb0c3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .levels-refresh{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:3px 8px;font-size:10px;font-weight:900;cursor:pointer;}
    .right{grid-template-rows:240px minmax(430px,1fr) 150px!important;}
  `;
  document.head.appendChild(style);
}

function replaceSelectedSymbolPanel(){
  const panel=document.querySelector('.selected-symbol-panel') || document.querySelector('.right .panel');
  if(!panel)return;
  panel.classList.add('levels-panel');
  panel.innerHTML=`<h3>SUPPORT / RESISTANCE <button class="levels-refresh" id="levelsRefresh">Refresh</button></h3>
    <div class="levels-price" id="levelsPrice">Loading levels...</div>
    <div class="levels-table" id="levelsGrid"></div>
    <div class="levels-note" id="levelsNote">等待行情 API。</div>`;
  document.getElementById('levelsRefresh')?.addEventListener('click',()=>loadLevels(currentSymbol||'GBPJPY'));
}

function fmtLevel(n){
  const x=Number(n);
  if(!Number.isFinite(x))return '-';
  return Math.abs(x)>=10 ? x.toFixed(2) : x.toFixed(4);
}

function pipSize(symbol){
  const s=String(symbol||'').toUpperCase();
  if(s.includes('JPY'))return 0.01;
  if(s==='XAUUSD')return 1;
  if(s==='DXY' || s==='US10Y')return 0.01;
  return 0.0001;
}

function distanceLabel(symbol, price, level){
  const p=Number(price), l=Number(level);
  if(!Number.isFinite(p)||!Number.isFinite(l))return '';
  const size=pipSize(symbol);
  const dist=Math.abs(p-l)/size;
  if(symbol==='XAUUSD')return `${dist.toFixed(1)}pt`;
  if(symbol==='DXY' || symbol==='US10Y')return `${dist.toFixed(1)}`;
  return `${dist.toFixed(1)}p`;
}

function levelWithDistance(symbol, price, level){
  return `${fmtLevel(level)} <span class="level-distance">/ ${distanceLabel(symbol,price,level)}</span>`;
}

function shortStatus(status){
  const s=String(status||'').toUpperCase();
  if(s==='NEAR RESISTANCE')return 'NEAR R';
  if(s==='NEAR SUPPORT')return 'NEAR S';
  if(s==='MIDDLE PRICE')return 'MID';
  if(s==='INSIDE RANGE')return 'RANGE';
  return s;
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
  price.textContent=`${symbol} · loading levels...`;
  grid.innerHTML='';
  note.textContent='正在计算 1H / 4H / 1W / 1M levels...';
  try{
    const r=await fetch('/api/levels?symbol='+encodeURIComponent(symbol));
    const data=await r.json();
    const livePrice=Number(data.price);
    price.textContent=`${data.symbol} · ${fmtLevel(livePrice)} · ${data.source}`;
    const labels={H1:'1H',H4:'4H',W1:'1W',M1:'1M'};
    grid.innerHTML='<div class="levels-head">TF</div><div class="levels-head">Support</div><div class="levels-head">Resist</div><div class="levels-head">Status</div>';
    ['H1','H4','W1','M1'].forEach(tf=>{
      const l=data.levels?.[tf];
      if(!l)return;
      grid.insertAdjacentHTML('beforeend',`<div class="levels-cell level-tf">${labels[tf]}</div><div class="levels-cell" title="Distance from price">${levelWithDistance(data.symbol,livePrice,l.support)}</div><div class="levels-cell" title="Distance from price">${levelWithDistance(data.symbol,livePrice,l.resistance)}</div><div class="levels-cell"><span class="level-status ${statusClass(l.status)}" title="${l.status}">${shortStatus(l.status)}</span></div>`);
    });
    note.textContent='ABU: '+abuLevelSummary(data);
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