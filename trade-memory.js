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
    <div class="tm-actions"><button id="tmSave">Save Plan</button><button id="tmOpen">Mark Open</button><button id="tmCancel">Cancel</button></div>
    <div class="tm-open" id="tmOpenList"></div>`;
  right.appendChild(panel);
  const sel = panel.querySelector('#tmSymbol');
  Object.keys(setups).forEach(sym=>{const o=document.createElement('option');o.value=sym;o.textContent=sym;sel.appendChild(o)});
  sel.value = currentSymbol || 'GBPJPY';
  document.getElementById('tmGenerate').addEventListener('click',generateTradePlanMemory);
  document.getElementById('tmSave').addEventListener('click',()=>saveTradeMemory('PLAN'));
  document.getElementById('tmOpen').addEventListener('click',()=>saveTradeMemory('OPEN'));
  document.getElementById('tmCancel').addEventListener('click',clearTradeInput);
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
    .tm-btn,.tm-actions button,.tm-review button{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:7px;font-weight:800;padding:8px;cursor:pointer;width:100%;font-size:11px;}
    .tm-result{border:1px solid #1b2530;background:#070b10;border-radius:7px;padding:8px;margin:8px 0;color:#c9d1d9;font-size:12px;line-height:1.45;white-space:pre-line;}
    .tm-verdict{display:inline-flex;padding:3px 8px;border-radius:99px;font-size:11px;font-weight:900;margin-bottom:6px;}
    .tm-go{background:#0d2418;border:1px solid #2f6848;color:#7ff0ad;}
    .tm-wait{background:#2c210f;border:1px solid #574018;color:#f0b35a;}
    .tm-notrade{background:#2b1014;border:1px solid #5a1c25;color:#ff8a94;}
    .tm-paper{background:#101721;border:1px solid #263442;color:#b9d8ff;}
    .tm-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;}
    .tm-open{margin-top:8px;display:flex;flex-direction:column;gap:5px;max-height:170px;overflow:auto;}
    .tm-item{border:1px solid #1b2530;background:#070b10;border-radius:6px;padding:6px 8px;color:#c9d1d9;font-size:11.5px;line-height:1.35;}
    .tm-review{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px;}
    .tm-review button{padding:6px;font-size:10px;}
  `;
  document.head.appendChild(style);
}

function tradeVerdict(s){
  const score = Number(String(s.score || '0').split('/')[0]);
  const warn = String(s.warning || '').toUpperCase();
  const badge = String(s.badge || '').toUpperCase();
  const decision = String(s.decision || '').toUpperCase();
  if(badge.includes('PAPER') || badge.includes('MACRO') || s.risk === 'INFO' || decision === 'PAPER') return 'PAPER';
  if(score < 10 || warn.includes('NO EDGE') || warn.includes('NO SPACE') || decision === 'REJECT') return 'NO TRADE';
  if(score >= 17 && !warn.includes('CHASE') && !warn.includes('EXTENDED') && !warn.includes('WAIT')) return 'GO';
  return 'WAIT';
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
  const verdict = tradeVerdict(s);
  const chaseRisk = (s.warning || '').includes('CHASE') || (s.warning || '').includes('EXTENDED');
  const decision = verdict === 'GO' ? 'TRADE PLAN READY' : verdict;
  const mistake = chaseRisk ? 'Mid-price / chase risk. Wait for objective stop.' : verdict === 'NO TRADE' ? 'Low edge. Do not force trade.' : verdict === 'PAPER' ? 'Paper only. Macro/filter or unclear money setup.' : 'No chase. Need objective stop confirmation.';
  return {id:Date.now(),time:new Date().toLocaleString(),status:'PLAN',planOutcome:'PENDING',symbol,direction,entry,stop,tp3,tp5,tp10,setup:s.core,marketType:s.marketType,score:s.score,risk:s.risk,warning:s.warning,verdict,decision,mistake,resultR:null};
}

function generateTradePlanMemory(){
  const d=getTradeDraft();
  const box=document.getElementById('tmResult');
  if(!d){box.textContent='先输入 Entry。';return;}
  box.innerHTML=`<span class="tm-verdict tm-${d.verdict.toLowerCase().replace(' ','')}">${d.verdict}</span>\n${d.symbol} ${d.direction}\nEntry: ${fmt(d.entry)}\nStop: ${fmt(d.stop)}\nTP 3R: ${fmt(d.tp3)}\nTP 5R: ${fmt(d.tp5)}\nTP 10R: ${fmt(d.tp10)}\nSetup: ${d.setup}\nDecision: ${d.decision}\nMistake: ${d.mistake}`;
}

function fmt(n){return Math.abs(n)>=10 ? n.toFixed(2) : n.toFixed(4)}
function getTrades(){try{return JSON.parse(localStorage.getItem('tradeMemory')||'[]')}catch{return[]}}
function saveTrades(items){localStorage.setItem('tradeMemory',JSON.stringify(items.slice(0,80)))}
function saveSnowball(item){let m=[];try{m=JSON.parse(localStorage.getItem('snowballMemory')||'[]')}catch{}m.unshift(item);localStorage.setItem('snowballMemory',JSON.stringify(m.slice(0,120)))}

function saveTradeMemory(status){
  const d=getTradeDraft();
  const box=document.getElementById('tmResult');
  if(!d){box.textContent='先输入 Entry。';return;}
  d.status=status;
  if(status === 'OPEN') d.planOutcome = 'EXECUTED';
  const items=getTrades();items.unshift(d);saveTrades(items);
  saveSnowball({type:'TRADE_'+status,time:d.time,symbol:d.symbol,verdict:d.verdict,decision:d.decision,setup:d.setup,mistake:d.mistake,trade:d});
  autoJournal('TRADE '+status,`${d.symbol} ${d.direction} entry ${fmt(d.entry)} stop ${fmt(d.stop)} tp5 ${fmt(d.tp5)} · ${d.verdict} · ${d.mistake}`);
  box.textContent='已保存到 Trade Memory + Snowball Memory。';
  renderOpenTrades();
}

function clearTradeInput(){
  const e=document.getElementById('tmEntry');if(e)e.value='';
  const box=document.getElementById('tmResult');if(box)box.textContent='已取消。没有保存。';
}

function updatePlanOutcome(id,outcome){
  const items=getTrades();
  const t=items.find(x=>String(x.id)===String(id));
  if(!t)return;
  t.planOutcome=outcome;
  t.reviewedAt=new Date().toLocaleString();
  let lesson='';
  if(outcome==='MISSED WIN') lesson='Plan worked but no entry. Study hesitation and next GO execution.';
  if(outcome==='GOOD AVOID') lesson='No entry avoided loss. This setup needs stricter confirmation.';
  if(outcome==='EXPIRED') lesson='Plan expired. Do not keep old setups alive.';
  if(outcome==='CANCELLED') lesson='Cancelled by Jack. No execution.';
  t.lesson=lesson;
  saveTrades(items);
  saveSnowball({type:'PLAN_OUTCOME',time:t.reviewedAt,symbol:t.symbol,outcome,verdict:t.verdict,setup:t.setup,mistake:t.mistake,lesson,trade:t});
  autoJournal('PLAN OUTCOME',`${t.symbol} · ${outcome} · ${lesson}`);
  renderOpenTrades();
}

function renderOpenTrades(){
  const list=document.getElementById('tmOpenList');if(!list)return;
  const items=getTrades().filter(x=>x.status==='OPEN' || x.status==='PLAN').slice(0,6);
  list.innerHTML=items.length?'':'<div class="tm-item">No trade memory yet.</div>';
  items.forEach(t=>{
    const div=document.createElement('div');div.className='tm-item';
    const base=`${t.status} · ${t.symbol} ${t.direction} · ${t.verdict || t.decision} · entry ${fmt(t.entry)} · TP5 ${fmt(t.tp5)}`;
    if(t.status==='PLAN'){
      div.innerHTML=`${base}<br>Outcome: ${t.planOutcome || 'PENDING'}<div class="tm-review"><button data-out="MISSED WIN">Missed Win</button><button data-out="GOOD AVOID">Good Avoid</button><button data-out="EXPIRED">Expired</button><button data-out="CANCELLED">Cancel</button></div>`;
      div.querySelectorAll('button[data-out]').forEach(b=>b.addEventListener('click',()=>updatePlanOutcome(t.id,b.dataset.out)));
    } else {
      div.textContent=base;
    }
    list.appendChild(div);
  });
}

injectTradeMemoryStyle();
injectTradeMemoryPanel();