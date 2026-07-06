function injectPaperTradeStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .paper-panel{margin-top:8px;border-top:1px solid #1b2530;padding-top:8px;}
    .paper-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;}
    .paper-title{font-size:11px;color:#8b98a8;font-weight:900;letter-spacing:.04em;text-transform:uppercase;}
    .paper-btn{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:900;cursor:pointer;}
    .paper-list{display:flex;flex-direction:column;gap:5px;max-height:138px;overflow:auto;}
    .paper-item{border:1px solid #1b2530;background:#070b10;border-radius:7px;padding:6px 7px;color:#c9d1d9;font-size:10.8px;line-height:1.35;}
    .paper-tag{display:inline-flex;padding:2px 6px;border-radius:999px;border:1px solid #263442;color:#b9d8ff;background:#101721;font-size:9px;font-weight:900;margin-right:4px;}
    .paper-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-top:5px;}
    .paper-actions button{background:#0b1320;border:1px solid #263442;color:#9fb0c3;border-radius:6px;padding:4px;font-size:9.5px;font-weight:900;cursor:pointer;}
  `;
  document.head.appendChild(style);
}
function getPaperTrades(){try{return JSON.parse(localStorage.getItem('paperTradeMemory')||'[]')}catch{return[]}}
function savePaperTrades(items){localStorage.setItem('paperTradeMemory',JSON.stringify(items.slice(0,80)))}
function paperSnowball(item){let m=[];try{m=JSON.parse(localStorage.getItem('snowballMemory')||'[]')}catch{}m.unshift(item);localStorage.setItem('snowballMemory',JSON.stringify(m.slice(0,150)))}
function injectPaperPanel(){
  const target=document.getElementById('tmOpenList') || document.getElementById('levelsNote');
  if(!target || document.getElementById('paperPanel'))return;
  const panel=document.createElement('div'); panel.id='paperPanel'; panel.className='paper-panel';
  panel.innerHTML=`<div class="paper-head"><div class="paper-title">Paper Research</div><button class="paper-btn" id="runPaperScan">Run Paper Scan</button></div><div class="paper-list" id="paperList"></div>`;
  target.parentElement.appendChild(panel);
  document.getElementById('runPaperScan')?.addEventListener('click',()=>runPaperScan(currentSymbol||'GBPJPY'));
  renderPaperTrades();
}
function paperFmt(n){const x=Number(n);if(!Number.isFinite(x))return '-';return Math.abs(x)>=10?x.toFixed(2):x.toFixed(4)}
function paperRiskDistance(symbol){if(String(symbol).includes('JPY'))return 0.40;if(symbol==='XAUUSD')return 12;return 0.0040}
function paperPipSize(symbol){const s=String(symbol||'').toUpperCase();if(s.includes('JPY'))return 0.01;if(s==='XAUUSD')return 1;if(s==='DXY'||s==='US10Y')return 0.01;return 0.0001}
function paperPips(symbol,a,b){const x=Number(a),y=Number(b);if(!Number.isFinite(x)||!Number.isFinite(y))return null;return Math.abs(x-y)/paperPipSize(symbol)}
function higherTfWarning(levels,direction,entry,risk){
  const warnings=[];
  ['W1','M1'].forEach(tf=>{
    const l=levels[tf]; if(!l)return;
    const target=direction==='LONG'?Number(l.nextResistance||l.resistance):Number(l.nearestSupport||l.support);
    if(Number.isFinite(target)){
      const rSpace=Math.abs(target-entry)/risk;
      if(rSpace<3) warnings.push(`${tf} major level too close: ${rSpace.toFixed(1)}R`);
    }
    if(direction==='LONG' && l.status==='NEAR RESISTANCE')warnings.push(`${tf} near resistance`);
    if(direction==='SHORT' && l.status==='NEAR SUPPORT')warnings.push(`${tf} near support`);
  });
  return warnings.join(' · ');
}
function pickPaperDirection(data){
  const levels=data.levels||{}; const h1=levels.H1||{}, h4=levels.H4||{}, w1=levels.W1||{}, m1=levels.M1||{};
  const statuses=[h1.status,h4.status,w1.status,m1.status].join(' | ');
  if(h1.status==='BREAKOUT'||h4.status==='BREAKOUT') return {direction:'LONG', base:'BREAKOUT', reason:'short timeframe breakout; must check R space to next resistance'};
  if(h1.status==='BREAKDOWN'||h4.status==='BREAKDOWN') return {direction:'SHORT', base:'BREAKDOWN', reason:'short timeframe breakdown; must check R space to next support'};
  if(h1.status==='NEAR SUPPORT'||h4.status==='NEAR SUPPORT') return {direction:'LONG', base:'NEAR SUPPORT', reason:'near support; wait for reaction and small-stop trigger'};
  if(h1.status==='NEAR RESISTANCE'||h4.status==='NEAR RESISTANCE') return {direction:'SHORT', base:'NEAR RESISTANCE', reason:'near resistance; study rejection, do not chase'};
  return {direction:'WATCH', verdict:'NO PAPER', reason:'middle/range; no clean Abu edge yet: '+statuses};
}
function rSpaceEngine(symbol,data,pick){
  const levels=data.levels||{}; const entry=Number(data.price); const risk=paperRiskDistance(symbol); const dir=pick.direction==='LONG'?1:-1;
  const primary = levels.H4 || levels.H1 || {};
  const secondary = levels.H1 || {};
  let spaceLevel = pick.direction==='LONG' ? Number(primary.nextResistance || secondary.nextResistance || primary.resistance) : Number(primary.nearestSupport || primary.support || secondary.nearestSupport);
  if(!Number.isFinite(spaceLevel)) spaceLevel = entry + dir*risk*3;
  const space=Math.abs(spaceLevel-entry); const potentialR=space/risk; const spacePips=paperPips(symbol,entry,spaceLevel);
  const warning=higherTfWarning(levels,pick.direction,entry,risk);
  let verdict='PAPER WATCH';
  if(potentialR<2) verdict='NO PAPER';
  else if(potentialR<3 || warning) verdict='PAPER ONLY';
  const stop=entry-dir*risk;
  const tp3=entry+dir*Math.min(risk*3, Math.max(risk, space*0.9));
  const tp5=entry+dir*Math.min(risk*5, Math.max(risk, space*0.95));
  let reason=`${pick.reason}. Space to next level ${paperFmt(spaceLevel)} = ${spacePips?spacePips.toFixed(1):'-'} pips / ${potentialR.toFixed(1)}R.`;
  if(warning) reason += ' Higher TF warning: '+warning+'.';
  if(verdict==='NO PAPER') reason += ' Rejected: not enough room before key level.';
  return {entry,risk,stop,tp3,tp5,spaceLevel,spacePips,potentialR,verdict,higherTfWarning:warning,reason};
}
async function runPaperScan(symbol){
  const list=document.getElementById('paperList'); if(list)list.innerHTML='<div class="paper-item">Scanning '+symbol+' R space...</div>';
  try{
    const r=await fetch('/api/levels?symbol='+encodeURIComponent(symbol)); const data=await r.json(); const setup=setups[symbol]||{}; const pick=pickPaperDirection(data);
    if(pick.verdict==='NO PAPER'){ const msg=`${symbol}: NO PAPER · ${pick.reason}`; autoJournal('PAPER SCAN',msg); if(list)list.innerHTML='<div class="paper-item">'+msg+'</div>'; renderPaperTrades(); return; }
    const rs=rSpaceEngine(symbol,data,pick);
    if(rs.verdict==='NO PAPER'){ autoJournal('PAPER R SPACE REJECT',`${symbol} · ${rs.reason}`); if(list)list.innerHTML='<div class="paper-item">NO PAPER · '+rs.reason+'</div>'; renderPaperTrades(); return; }
    const trade={id:Date.now(),time:new Date().toLocaleString(),status:'PAPER OPEN',symbol,direction:pick.direction,entry:rs.entry,stop:rs.stop,tp3:rs.tp3,tp5:rs.tp5,
      verdict:rs.verdict,reason:rs.reason,setup:setup.core||'level + R space paper scan',score:setup.score||'-',levels:data.levels,source:data.source,outcome:'TRACKING',review:'',
      spaceLevel:rs.spaceLevel,spacePips:rs.spacePips,potentialR:rs.potentialR,higherTfWarning:rs.higherTfWarning,riskDistance:rs.risk};
    const items=getPaperTrades();items.unshift(trade);savePaperTrades(items);
    paperSnowball({type:'PAPER_TRADE_OPEN',time:trade.time,symbol,direction:trade.direction,verdict:trade.verdict,potentialR:trade.potentialR,spacePips:trade.spacePips,reason:trade.reason,trade});
    autoJournal('PAPER TRADE',`${symbol} ${trade.direction} ${trade.verdict} entry ${paperFmt(rs.entry)} stop ${paperFmt(rs.stop)} tp3 ${paperFmt(rs.tp3)} · space ${rs.potentialR.toFixed(1)}R · ${rs.reason}`);
    renderPaperTrades(); if(typeof renderPaperPage==='function')renderPaperPage();
  }catch(e){ if(list)list.innerHTML='<div class="paper-item">Paper scan error. Check /api/levels.</div>'; }
}
function updatePaperOutcome(id,outcome){
  const items=getPaperTrades(); const t=items.find(x=>String(x.id)===String(id)); if(!t)return;
  t.status='PAPER CLOSED'; t.outcome=outcome; t.reviewedAt=new Date().toLocaleString();
  if(outcome==='WIN')t.review='Paper setup worked. Study if R space and Abu entry quality were repeatable.';
  if(outcome==='LOSS')t.review='Paper setup failed. Check chase, higher-TF level, trigger quality, and R space.';
  if(outcome==='EXPIRED')t.review='Paper setup expired. Do not keep old idea alive.';
  savePaperTrades(items); paperSnowball({type:'PAPER_TRADE_REVIEW',time:t.reviewedAt,symbol:t.symbol,outcome,review:t.review,trade:t}); autoJournal('PAPER REVIEW',`${t.symbol} ${outcome} · ${t.review}`); renderPaperTrades(); if(typeof renderPaperPage==='function')renderPaperPage();
}
function renderPaperTrades(){
  const list=document.getElementById('paperList');if(!list)return; const items=getPaperTrades().slice(0,4); list.innerHTML=items.length?'':'<div class="paper-item">No paper trades yet.</div>';
  items.forEach(t=>{ const div=document.createElement('div');div.className='paper-item';
    const space=t.potentialR?` · space ${Number(t.potentialR).toFixed(1)}R`:'';
    div.innerHTML=`<span class="paper-tag">${t.status}</span><span class="paper-tag">${t.outcome||'TRACKING'}</span><span class="paper-tag">${t.verdict||''}</span><br>${t.symbol} ${t.direction} · entry ${paperFmt(t.entry)} · stop ${paperFmt(t.stop)} · TP3 ${paperFmt(t.tp3)}${space}<br>${t.reason||''}${t.status==='PAPER OPEN'?`<div class="paper-actions"><button data-out="WIN">Win</button><button data-out="LOSS">Loss</button><button data-out="EXPIRED">Expired</button></div>`:''}`;
    div.querySelectorAll('button[data-out]').forEach(b=>b.addEventListener('click',()=>updatePaperOutcome(t.id,b.dataset.out))); list.appendChild(div); });
}
(function(){ injectPaperTradeStyle(); setTimeout(injectPaperPanel,700); })();