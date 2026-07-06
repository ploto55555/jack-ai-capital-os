const STRATEGY_RESEARCH_VERSION='v3.6.0';
const STRATEGY_WATCHLIST=['GBPJPY','USDJPY','XAUUSD','GBPUSD','EURUSD','AUDJPY','USDCHF','EURGBP'];
const STRATEGIES=[
  {id:'S1_BREAKOUT_RSPACE',name:'Breakout + R Space',entry:'H1/H4 breakout, do not chase, need room to next level',exit:'Stop or TP3, expire 72h',market:'trend / breakout'},
  {id:'S2_SUPPORT_REJECTION',name:'Support Rejection',entry:'Near H1/H4 support, wait reaction, paper only',exit:'Stop or TP3 to next resistance',market:'range / pullback'},
  {id:'S3_RESIST_REJECTION',name:'Resistance Rejection',entry:'Near H1/H4 resistance, study rejection short',exit:'Stop or TP3 to support',market:'range / rejection'},
  {id:'S4_TREND_CONTINUATION',name:'Trend Continuation',entry:'H4 and H1 both show breakout with >4R room',exit:'TP3 first, later test trailing exit',market:'strong trend'},
  {id:'S5_NO_MIDDLE_PRICE',name:'Middle Price Filter',entry:'Reject middle price, no paper trade',exit:'No trade',market:'filter'}
];
function seTrades(){try{return JSON.parse(localStorage.getItem('paperTradeMemory')||'[]')}catch{return[]}}
function seSaveTrades(items){localStorage.setItem('paperTradeMemory',JSON.stringify(items.slice(0,160)))}
function seSnowball(item){try{let m=JSON.parse(localStorage.getItem('snowballMemory')||'[]');m.unshift(item);localStorage.setItem('snowballMemory',JSON.stringify(m.slice(0,200)))}catch{}}
function seFmt(n){const x=Number(n);if(!Number.isFinite(x))return '-';return Math.abs(x)>=10?x.toFixed(2):x.toFixed(4)}
function seRisk(symbol){if(String(symbol).includes('JPY'))return 0.40;if(symbol==='XAUUSD')return 12;return 0.0040}
function sePipSize(symbol){const s=String(symbol||'').toUpperCase();if(s.includes('JPY'))return 0.01;if(s==='XAUUSD')return 1;if(s==='DXY'||s==='US10Y')return 0.01;return 0.0001}
function sePips(symbol,a,b){const x=Number(a),y=Number(b);if(!Number.isFinite(x)||!Number.isFinite(y))return null;return Math.abs(x-y)/sePipSize(symbol)}
function seRResult(t){if(t.outcome==='WIN')return 3;if(t.outcome==='LOSS')return -1;if(t.outcome==='EXPIRED')return 0;return null}
function seHasOpenDuplicate(symbol,strategyId,direction){return seTrades().some(t=>t.status==='PAPER OPEN'&&t.symbol===symbol&&t.strategyId===strategyId&&t.direction===direction)}
function seNearMajor(levels,direction,entry,risk){const w=[];['W1','M1'].forEach(tf=>{const l=levels?.[tf];if(!l)return;const target=direction==='LONG'?Number(l.nextResistance||l.resistance):Number(l.nearestSupport||l.support);if(Number.isFinite(target)){const r=Math.abs(target-entry)/risk;if(r<3)w.push(`${tf} major level ${r.toFixed(1)}R`)}if(direction==='LONG'&&l.status==='NEAR RESISTANCE')w.push(`${tf} near resistance`);if(direction==='SHORT'&&l.status==='NEAR SUPPORT')w.push(`${tf} near support`)});return w.join(' · ')}
function seBuildCandidate(symbol,data,strategy,direction,levelTarget,reason,baseVerdict='PAPER WATCH'){
  const entry=Number(data.price),risk=seRisk(symbol),dir=direction==='LONG'?1:-1,levels=data.levels||{};
  const target=Number(levelTarget);const spaceLevel=Number.isFinite(target)?target:entry+dir*risk*3;
  const space=Math.abs(spaceLevel-entry);const potentialR=space/risk;const warning=seNearMajor(levels,direction,entry,risk);
  let verdict=baseVerdict;if(potentialR<2)verdict='NO PAPER';else if(potentialR<3||warning)verdict='PAPER ONLY';
  const stop=entry-dir*risk;const tp3=entry+dir*Math.min(risk*3,Math.max(risk,space*0.9));const tp5=entry+dir*Math.min(risk*5,Math.max(risk,space*0.95));
  return {symbol,direction,strategyId:strategy.id,strategyName:strategy.name,entry,stop,tp3,tp5,spaceLevel,spacePips:sePips(symbol,entry,spaceLevel),potentialR,higherTfWarning:warning,verdict,reason:`${strategy.name}: ${reason}. Space ${potentialR.toFixed(1)}R${warning?' · HTF '+warning:''}.`,marketType:strategy.market,exitStrategyId:'E1_TP3_STOP_72H'};
}
function evaluateStrategies(symbol,data){
  const l=data.levels||{},h1=l.H1||{},h4=l.H4||{};const out=[];
  const nextR=Number(h4.nextResistance||h1.nextResistance||h4.resistance||h1.resistance);
  const nearS=Number(h4.nearestSupport||h1.nearestSupport||h4.support||h1.support);
  if(h1.status==='BREAKOUT'||h4.status==='BREAKOUT') out.push(seBuildCandidate(symbol,data,STRATEGIES[0],'LONG',nextR,'breakout detected; test only if R space is enough'));
  if(h1.status==='NEAR SUPPORT'||h4.status==='NEAR SUPPORT') out.push(seBuildCandidate(symbol,data,STRATEGIES[1],'LONG',nextR,'near support; testing support reaction strategy','PAPER ONLY'));
  if(h1.status==='NEAR RESISTANCE'||h4.status==='NEAR RESISTANCE') out.push(seBuildCandidate(symbol,data,STRATEGIES[2],'SHORT',nearS,'near resistance; testing rejection strategy','PAPER ONLY'));
  if(h1.status==='BREAKOUT'&&h4.status==='BREAKOUT') out.push(seBuildCandidate(symbol,data,STRATEGIES[3],'LONG',nextR,'H1 and H4 breakout alignment; trend continuation test'));
  if(!out.length) out.push({symbol,strategyId:'S5_NO_MIDDLE_PRICE',strategyName:'Middle Price Filter',verdict:'NO PAPER',reason:'middle/range; no clean Abu edge',marketType:'filter'});
  return out.sort((a,b)=>(Number(b.potentialR||0)-Number(a.potentialR||0)));
}
function seOpenTrade(candidate,data){
  if(candidate.verdict==='NO PAPER')return null;if(seHasOpenDuplicate(candidate.symbol,candidate.strategyId,candidate.direction))return null;
  const setup=(window.setups&&window.setups[candidate.symbol])||{};
  const t={id:Date.now()+Math.floor(Math.random()*999),time:new Date().toLocaleString(),status:'PAPER OPEN',outcome:'TRACKING',review:'',source:data.source,levels:data.levels,score:setup.score||'-',setup:setup.core||candidate.strategyName,
    researchVersion:STRATEGY_RESEARCH_VERSION,autoGenerated:true,learningMode:true,...candidate};
  const items=seTrades();items.unshift(t);seSaveTrades(items);seSnowball({type:'AI_STRATEGY_PAPER_OPEN',time:t.time,symbol:t.symbol,strategyId:t.strategyId,strategyName:t.strategyName,potentialR:t.potentialR,verdict:t.verdict,trade:t});try{autoJournal('AI STRATEGY OPEN',`${t.symbol} ${t.strategyName} ${t.direction} · ${t.verdict} · ${Number(t.potentialR||0).toFixed(1)}R`)}catch{}return t;
}
async function runStrategyResearchCycle(){
  const note=document.getElementById('strategyLabNote');if(note)note.textContent='AI Strategy Engine scanning watchlist...';
  const results=[];let opened=0,rejected=0;
  for(const symbol of STRATEGY_WATCHLIST){
    try{const r=await fetch('/api/levels?symbol='+encodeURIComponent(symbol));const data=await r.json();const candidates=evaluateStrategies(symbol,data);const best=candidates[0];results.push({symbol,best,candidates});if(best&&best.verdict!=='NO PAPER'){const t=seOpenTrade(best,data);if(t)opened++;else rejected++;}else rejected++;}
    catch(e){results.push({symbol,error:true,best:{verdict:'ERROR',reason:'levels api error'}})}
  }
  const run={id:Date.now(),time:new Date().toLocaleString(),opened,rejected,results};localStorage.setItem('lastStrategyResearchRun',JSON.stringify(run));seSnowball({type:'AI_STRATEGY_RESEARCH_RUN',...run});try{autoJournal('AI STRATEGY CYCLE',`opened ${opened}, rejected ${rejected}`)}catch{}
  renderStrategyLab();if(typeof renderPaperPage==='function')renderPaperPage();return run;
}
function strategyPerformance(){
  const closed=seTrades().filter(t=>t.strategyId&&seRResult(t)!==null);const map={};
  closed.forEach(t=>{const id=t.strategyId;if(!map[id])map[id]={id,name:t.strategyName||id,total:0,wins:0,losses:0,expired:0,rSum:0,symbols:{}};const m=map[id];const r=seRResult(t);m.total++;m.rSum+=r;if(t.outcome==='WIN')m.wins++;if(t.outcome==='LOSS')m.losses++;if(t.outcome==='EXPIRED')m.expired++;m.symbols[t.symbol]=(m.symbols[t.symbol]||0)+1});
  return Object.values(map).map(m=>{const best=Object.entries(m.symbols).sort((a,b)=>b[1]-a[1])[0]?.[0]||'-';const winRate=m.total?Math.round(m.wins/m.total*100):0;const avgR=m.total?m.rSum/m.total:0;let status='KEEP TESTING';if(m.total>=10&&avgR>0.5)status='PROMISING';if(m.total>=10&&avgR<0)status='REJECT / REVIEW';return {...m,bestSymbol:best,winRate,avgR,expectancy:avgR,status}}).sort((a,b)=>b.expectancy-a.expectancy);
}
function injectStrategyLabStyle(){if(document.getElementById('strategyLabStyle'))return;const s=document.createElement('style');s.id='strategyLabStyle';s.textContent=`
.strategy-lab{border:1px solid #1b2530;background:#080d13;border-radius:12px;padding:12px;margin:0 0 12px;box-shadow:0 0 22px rgba(83,65,210,.18)}.strategy-lab-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.strategy-lab-head b{color:#f2f6fb;font-size:13px}.strategy-lab-actions{display:flex;gap:8px;align-items:center}.strategy-lab button{background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;cursor:pointer}.strategy-lab-note{color:#8b98a8;font-size:11px}.strategy-grid{display:grid;grid-template-columns:1.5fr .55fr .55fr .65fr .8fr .9fr;gap:0;border:1px solid #1b2530;border-radius:8px;overflow:hidden}.strategy-grid div{padding:8px 9px;border-bottom:1px solid #1b2530;color:#c9d1d9;font-size:11.5px}.strategy-grid .h{background:#10161d;color:#d7ecff;font-weight:900;text-transform:uppercase;font-size:10px}.strategy-grid div:nth-last-child(-n+6){border-bottom:0}.strategy-good{color:#7ff0ad!important}.strategy-bad{color:#ff8a94!important}.strategy-wait{color:#f0b35a!important}`;document.head.appendChild(s)}
function ensureStrategyLab(){injectStrategyLabStyle();const view=document.getElementById('paperView');const stats=document.getElementById('paperStats');if(!view||!stats||document.getElementById('strategyLab'))return;const lab=document.createElement('div');lab.id='strategyLab';lab.className='strategy-lab';lab.innerHTML=`<div class="strategy-lab-head"><b>AI STRATEGY RESEARCH LAB</b><div class="strategy-lab-actions"><span class="strategy-lab-note" id="strategyLabNote">Auto research ready.</span><button id="strategyRunBtn">Run Strategy Cycle</button><button id="strategyAutoBtn"></button></div></div><div class="strategy-grid" id="strategyGrid"></div>`;stats.insertAdjacentElement('afterend',lab);document.getElementById('strategyRunBtn')?.addEventListener('click',runStrategyResearchCycle);document.getElementById('strategyAutoBtn')?.addEventListener('click',()=>{const on=localStorage.getItem('strategyAuto')!=='off';localStorage.setItem('strategyAuto',on?'off':'on');renderStrategyLab()});}
function renderStrategyLab(){ensureStrategyLab();const grid=document.getElementById('strategyGrid');const autoBtn=document.getElementById('strategyAutoBtn');const note=document.getElementById('strategyLabNote');if(autoBtn)autoBtn.textContent=(localStorage.getItem('strategyAuto')==='off')?'Auto OFF':'Auto ON';if(!grid)return;const perf=strategyPerformance();let last=null;try{last=JSON.parse(localStorage.getItem('lastStrategyResearchRun')||'null')}catch{}if(note&&last)note.textContent=`Last scan ${last.time}: opened ${last.opened}, rejected ${last.rejected}`;grid.innerHTML='<div class="h">Strategy</div><div class="h">Trades</div><div class="h">Win%</div><div class="h">Avg R</div><div class="h">Best Symbol</div><div class="h">Status</div>';if(!perf.length){grid.insertAdjacentHTML('beforeend','<div>Waiting closed paper trades</div><div>-</div><div>-</div><div>-</div><div>-</div><div class="strategy-wait">LEARNING</div>');return}perf.forEach(p=>{const cls=p.expectancy>0?'strategy-good':p.expectancy<0?'strategy-bad':'strategy-wait';grid.insertAdjacentHTML('beforeend',`<div>${p.name}</div><div>${p.total}</div><div>${p.winRate}%</div><div class="${cls}">${p.avgR.toFixed(2)}R</div><div>${p.bestSymbol}</div><div class="${cls}">${p.status}</div>`)});}
let strategyTimer=null;function startStrategyAuto(){if(strategyTimer)return;strategyTimer=setInterval(()=>{if(localStorage.getItem('strategyAuto')==='off')return;runStrategyResearchCycle()},30*60*1000);setTimeout(()=>{renderStrategyLab();if(localStorage.getItem('strategyAuto')!=='off'){const last=Number(localStorage.getItem('lastStrategyAutoTs')||0);if(Date.now()-last>30*60*1000){localStorage.setItem('lastStrategyAutoTs',String(Date.now()));runStrategyResearchCycle()}}},3500)}
(function(){setInterval(renderStrategyLab,2500);startStrategyAuto();window.runStrategyResearchCycle=runStrategyResearchCycle;window.renderStrategyLab=renderStrategyLab;})();