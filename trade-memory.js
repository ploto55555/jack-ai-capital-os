function injectTradeMemoryPanel(){
  const right = document.querySelector('.left');
  if(!right || document.getElementById('tradeMemoryPanel')) return;
  const panel = document.createElement('section');
  panel.className = 'panel trade-memory-panel';
  panel.id = 'tradeMemoryPanel';
  panel.innerHTML = `<h3>TRADE MEMORY INPUT</h3>
    <div class="tm-grid">
      <label>Symbol<select id="tmSymbol"></select></label>
      <label>Direction<select id="tmDirection"><option>LONG</option><option>SHORT</option></select></label>
      <label>Entry<input id="tmEntry" type="number" step="0.0001" placeholder="Entry" /></label>
    </div>
    <button class="tm-btn" id="tmGenerate">Generate Abu Plan</button>
    <div class="tm-result" id="tmResult">输入 symbol / direction / entry 后生成 stop、3R、5R、10R、setup。</div>
    <div class="tm-actions"><button id="tmSave">Save Plan</button><button id="tmOpen">Mark Open</button></div>
    <div class="tm-open" id="tmOpenList"></div>`;
  right.appendChild(panel);
  const sel = panel.querySelector('#tmSymbol');
  Object.keys(setups).forEach(sym=>{const o=document.createElement('option');o.value=sym;o.textContent=sym;sel.appendChild(o)});
  sel.value = currentSymbol || 'GBPJPY';
  document.getElementById('tmGenerate').addEventListener('click',generateTradePlanMemory);
  document.getElementById('tmSave').addEventListener('click',()=>saveTradeMemory('PLAN'));
  document.getElementById('tmOpen').addEventListener('click',()=>saveTradeMemory('OPEN'));
  renderOpenTrades();
}

function injectTradeMemoryStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .left{grid-template-rows:190px 1fr!important;gap:8px!important;}
    .trade-memory-panel{overflow:auto!important;}
    .tm-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:8px;}
    .tm-grid label{font-size:10.5px;color:#8b98a8;text-transform:uppercase;display:flex;flex-direction:column;gap:4px;}
    .tm-grid label:nth-child(3){grid-column:1/3;}
    .tm-grid input,.tm-grid select{background:#060a0f;border:1px solid #263442;border-radius:7px;color:#f2f6fb;padding:8px;font-size:12px;outline:none;}
    .tm-btn,.tm-actions button{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:7px;font-weight:800;padding:8px;cursor:pointer;width:100%;}
    .tm-result{border:1px solid #1b2530;background:#070b10;border-radius:7px;padding:8px;margin:8px 0;color:#c9d1d9;font-size:12px;line-height:1.45;white-space:pre-line;}
    .tm-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
    .tm-open{margin-top:8px;display:flex;flex-direction:column;gap:5px;max-height:120px;overflow:auto;}
    .tm-item{border:1px solid #1b2530;background:#070b10;border-radius:6px;padding:6px 8px;color:#c9d1d9;font-size:11.5px;line-height:1.35;}
  `;
  document.head.appendChild(style);
}

function getTradeDraft(){
  const symbol=document.getElementById('tmSymbol')?.value || currentSymbol || 'GBPJPY';
  const direction=document.getElementById('tmDirection')?.value || 'LONG';
  const entry=Number(document.getElementById('tmEntry')?.value || 0);
  const s=setups[symbol] || setups.GBPJPY;
  if(!entry) return null;
  const riskDistance = symbol.includes('JPY') ? 0.40 : symbol === 'XAUUSD' ? 12 : 0.0040;
  const dir = direction === 'LONG' ? 1 : -1;
  const stop = entry - dir * riskDistance;
  const tp3 = entry + dir * riskDistance * 3;
  const tp5 = entry + dir * riskDistance * 5;
  const tp10 = entry + dir * riskDistance * 10;
  const chaseRisk = (s.warning || '').includes('CHASE') || (s.warning || '').includes('EXTENDED');
  const decision = chaseRisk ? 'WAIT' : (Number(String(s.score).split('/')[0]) >= 17 ? 'TRADE PLAN READY' : s.decision);
  const mistake = chaseRisk ? 'Mid-price / chase risk. Wait for objective stop.' : 'No chase. Need objective stop confirmation.';
  return {id:Date.now(),time:new Date().toLocaleString(),status:'PLAN',symbol,direction,entry,stop,tp3,tp5,tp10,setup:s.core,marketType:s.marketType,score:s.score,risk:s.risk,warning:s.warning,decision,mistake,resultR:null};
}

function generateTradePlanMemory(){
  const d=getTradeDraft();
  const box=document.getElementById('tmResult');
  if(!d){box.textContent='先输入 Entry。';return;}
  box.textContent=`${d.symbol} ${d.direction}\nEntry: ${fmt(d.entry)}\nStop: ${fmt(d.stop)}\nTP 3R: ${fmt(d.tp3)}\nTP 5R: ${fmt(d.tp5)}\nTP 10R: ${fmt(d.tp10)}\nSetup: ${d.setup}\nDecision: ${d.decision}\nMistake: ${d.mistake}`;
}

function fmt(n){return Math.abs(n)>=10 ? n.toFixed(2) : n.toFixed(4)}
function getTrades(){try{return JSON.parse(localStorage.getItem('tradeMemory')||'[]')}catch{return[]}}
function saveTrades(items){localStorage.setItem('tradeMemory',JSON.stringify(items.slice(0,50)))}
function saveSnowball(item){let m=[];try{m=JSON.parse(localStorage.getItem('snowballMemory')||'[]')}catch{}m.unshift(item);localStorage.setItem('snowballMemory',JSON.stringify(m.slice(0,80)))}

function saveTradeMemory(status){
  const d=getTradeDraft();
  const box=document.getElementById('tmResult');
  if(!d){box.textContent='先输入 Entry。';return;}
  d.status=status;
  const items=getTrades();items.unshift(d);saveTrades(items);
  saveSnowball({type:'TRADE_'+status,time:d.time,symbol:d.symbol,decision:d.decision,setup:d.setup,mistake:d.mistake,trade:d});
  autoJournal('TRADE '+status,`${d.symbol} ${d.direction} entry ${fmt(d.entry)} stop ${fmt(d.stop)} tp5 ${fmt(d.tp5)} · ${d.decision} · ${d.mistake}`);
  box.textContent='已保存到 Trade Memory + Snowball Memory。';
  renderOpenTrades();
}

function renderOpenTrades(){
  const list=document.getElementById('tmOpenList');if(!list)return;
  const open=getTrades().filter(x=>x.status==='OPEN').slice(0,4);
  list.innerHTML=open.length?'':'<div class="tm-item">No open trades yet.</div>';
  open.forEach(t=>{const div=document.createElement('div');div.className='tm-item';div.textContent=`${t.symbol} ${t.direction} · entry ${fmt(t.entry)} · stop ${fmt(t.stop)} · TP5 ${fmt(t.tp5)} · ${t.decision}`;list.appendChild(div)});
}

injectTradeMemoryStyle();
injectTradeMemoryPanel();