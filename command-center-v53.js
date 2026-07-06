(function(){
  const VERSION = 'V5.3.1 Command Center Clean Layout';
  const STORE_KEY = 'jackCommandWatchlist';
  const priceCache = {};

  function hasSetups(){ return typeof setups !== 'undefined' && setups && typeof setups === 'object'; }
  function symbols(){ return hasSetups() ? Object.keys(setups) : []; }
  function scoreNum(s){ return Number(String(s?.score || '0').split('/')[0]) || 0; }
  function isMacro(sym){ return sym === 'DXY' || sym === 'US10Y'; }
  function normalizedDecision(sym){
    const s = setups[sym] || {};
    const raw = String(s.decision || '').toUpperCase();
    if(isMacro(sym)) return 'MACRO';
    if(raw === 'PAPER') return 'PAPER TEST';
    if(raw === 'STRONG') return 'MACRO';
    if(raw === 'NEUTRAL') return 'WAIT';
    if(raw === 'NO TRADE TODAY') return 'NO TRADE';
    return raw || 'WAIT';
  }
  function normalizedBadge(sym){
    const s = setups[sym] || {};
    if(isMacro(sym)) return 'Macro';
    if(String(s.badge || '').toUpperCase() === 'PAPER') return 'Paper';
    if(String(s.badge || '').toUpperCase() === 'NEUTRAL') return 'Wait';
    return s.badge || 'Watch';
  }
  function priority(sym){
    const s = setups[sym] || {};
    const d = normalizedDecision(sym);
    let p = scoreNum(s);
    if(d === 'TRADE PLAN READY') p += 8;
    if(d === 'WATCH') p += 3;
    if(d === 'PAPER TEST') p += 2;
    if(d === 'WAIT') p += 1;
    if(d === 'REJECT' || d === 'NO TRADE') p -= 12;
    if(isMacro(sym)) p -= 1;
    return p;
  }
  function classFor(sym){
    const d = normalizedDecision(sym);
    if(d === 'REJECT' || d === 'NO TRADE') return 'bad';
    if(d === 'PAPER TEST') return 'neutral';
    if(d === 'WATCH' || isMacro(sym)) return 'watch';
    return 'good';
  }
  function visibleSymbols(){
    let list = [];
    try { list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch {}
    const all = symbols();
    list = list.filter(x => all.includes(x));
    return list.length ? list : all;
  }
  function saveVisible(list){ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }
  function fmtPrice(sym, value){
    const n = Number(value);
    if(!Number.isFinite(n)) return setups[sym]?.price || '-';
    if(sym === 'US10Y') return n.toFixed(2) + '%';
    if(sym.includes('JPY')) return n.toFixed(3);
    if(sym === 'XAUUSD') return n.toFixed(1);
    if(sym === 'DXY') return n.toFixed(2);
    return n.toFixed(5);
  }
  function shortText(text, max){
    const s = String(text || '');
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
  }
  function sortAndRenderTiles(){
    if(!hasSetups()) return;
    const heatmap = document.querySelector('.heatmap');
    if(!heatmap) return;
    const active = (typeof currentSymbol !== 'undefined' ? currentSymbol : 'GBPJPY');
    const list = visibleSymbols().sort((a,b) => priority(b) - priority(a));
    heatmap.innerHTML = '';
    list.forEach(sym => {
      const s = setups[sym] || {};
      const tile = document.createElement('article');
      tile.className = `tile ${classFor(sym)} ${sym === active ? 'selected' : ''}`;
      tile.dataset.symbol = sym;
      tile.title = `${s.marketType || ''}\n${s.core || ''}\n${s.quality || ''}\n${s.reason || ''}`;
      tile.innerHTML = `<div class="tile-line1"><span class="symbol">${sym}</span><span class="score">${s.score || '-'}</span></div><div class="grade">${normalizedBadge(sym)}</div><div class="live-price" data-price-symbol="${sym}">${fmtPrice(sym, priceCache[sym] ?? s.price)}</div><div class="tile-line2"><b>${normalizedDecision(sym)}</b><span>${shortText(s.warning || '', 10)}</span></div>`;
      tile.addEventListener('click', () => window.selectSymbol ? window.selectSymbol(sym) : null);
      heatmap.appendChild(tile);
    });
    updateFxStrength();
  }
  window.updatePairLivePrice = function(sym, price, data){
    if(!hasSetups()) return;
    if(Number.isFinite(Number(price))){
      priceCache[sym] = Number(price);
      if(setups[sym]) setups[sym].price = String(price);
      document.querySelectorAll(`[data-price-symbol="${sym}"]`).forEach(el => el.textContent = fmtPrice(sym, price));
    }
    if(data) window.lastLevelData = Object.assign(window.lastLevelData || {}, {[sym]: data});
  };
  async function refreshCardPrices(){
    if(!hasSetups()) return;
    const list = visibleSymbols();
    for(const sym of list){
      try{
        const r = await fetch('/api/levels?symbol=' + encodeURIComponent(sym));
        const data = await r.json();
        if(data && Number.isFinite(Number(data.price))) window.updatePairLivePrice(sym, data.price, data);
      }catch{}
      await new Promise(res => setTimeout(res, 150));
    }
  }
  function updateFxStrength(){
    if(!hasSetups()) return;
    const points = {};
    function add(ccy, v){ points[ccy] = (points[ccy] || 0) + v; }
    visibleSymbols().forEach(sym => {
      if(sym === 'DXY'){ add('USD', 5); return; }
      if(sym === 'US10Y'){ add('USD', 2); add('JPY', -1); return; }
      if(sym.length === 6){
        const base = sym.slice(0,3), quote = sym.slice(3,6);
        const delta = scoreNum(setups[sym]) - 10;
        add(base, delta); add(quote, -delta);
      }
    });
    const sorted = Object.entries(points).sort((a,b)=>b[1]-a[1]);
    const strong = sorted.slice(0,3).map(x=>x[0]).join('/') || '-';
    const weak = sorted.slice(-3).reverse().map(x=>x[0]).join('/') || '-';
    let el = document.getElementById('fxStrengthBar');
    const topLeft = document.querySelector('.topbar > div:first-child');
    if(!el && topLeft){ el = document.createElement('span'); el.id = 'fxStrengthBar'; topLeft.appendChild(el); }
    if(el) el.innerHTML = ` <span class="fx-label">FX</span> S:<b>${strong}</b> W:<b>${weak}</b>`;
  }
  function setupHeader(){
    const topRight = document.querySelector('.topbar > div:last-child');
    if(topRight){ topRight.innerHTML = `Chart:<b>TradingView</b> · AI:<b>GPT</b> · Auto:<b>OFF</b> <button id="watchlistBtn" class="watchlist-btn">Watchlist</button>`; }
    const topLeft = document.querySelector('.topbar > div:first-child');
    if(topLeft && !document.getElementById('fxStrengthBar')) topLeft.innerHTML = `<b>JACK AI CAPITAL OS</b> // V5.3`;
  }
  function setupWatchlistPanel(){
    if(document.getElementById('watchlistPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'watchlistPanel';
    panel.className = 'watchlist-panel hidden';
    panel.innerHTML = `<div class="wl-head"><b>Watchlist Settings</b><button id="wlClose">×</button></div><div class="wl-note">选择主页顶部显示的 pair / macro。排序会自动从最值得看的放左边。</div><div id="wlChecks" class="wl-checks"></div><button id="wlSave" class="wl-save">Save Watchlist</button>`;
    document.body.appendChild(panel);
    const checks = panel.querySelector('#wlChecks');
    const visible = new Set(visibleSymbols());
    symbols().forEach(sym => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${sym}" ${visible.has(sym) ? 'checked' : ''}> ${sym}`;
      checks.appendChild(label);
    });
    document.getElementById('watchlistBtn')?.addEventListener('click', () => panel.classList.toggle('hidden'));
    document.getElementById('wlClose')?.addEventListener('click', () => panel.classList.add('hidden'));
    document.getElementById('wlSave')?.addEventListener('click', () => {
      const list = [...checks.querySelectorAll('input:checked')].map(x=>x.value);
      saveVisible(list.length ? list : symbols());
      panel.classList.add('hidden');
      sortAndRenderTiles();
      refreshCardPrices();
    });
  }
  function briefText(sym){
    const s = setups[sym] || setups.GBPJPY || {};
    const decision = normalizedDecision(sym);
    const price = fmtPrice(sym, priceCache[sym] ?? s.price);
    if(isMacro(sym)) return `【Macro Filter】\n${sym} 当前价格：${price}\n用途：宏观过滤，不是主要 entry。\n动作：只作为 USD / Gold / JPY 背景。`;
    return `【Daily AI Brief】\n${sym} 价格：${price}\nAction：${decision}\n原因：${s.reason || '等待更清楚结构。'}\n关键：${s.core || '等边缘和小止损。'}\n风险：${s.warning || 'No chase'}\n下一步：等 key zone / H4-H1 结构 / M15-M5 objective stop。`;
  }
  function updateDailyBrief(sym){
    const panel = document.querySelector('.ai-chat-panel');
    if(panel){ const h = panel.querySelector('h3'); if(h) h.textContent = 'JACK AI DAILY BRIEF'; }
    const box = document.getElementById('chatBox');
    if(box){ const first = box.querySelector('.msg.ai'); if(first){ first.textContent = briefText(sym); first.classList.add('daily-brief-msg'); } }
    const input = document.getElementById('aiChatInput');
    if(input) input.placeholder = `问 Jack AI：${sym} 现在是不是追价？`;
  }
  function paperSummary(){
    try{ const items = JSON.parse(localStorage.getItem('paperTradeMemory') || '[]'); const open = items.filter(x => x.status === 'PAPER OPEN').length; const closed = items.filter(x => x.status === 'PAPER CLOSED').length; return `Open ${open} · Closed ${closed}`; }
    catch{return 'Paper waiting';}
  }
  function ensureTodayAction(){
    const rightColumn = document.querySelector('.left');
    if(!rightColumn || document.getElementById('todayActionPanel')) return;
    const panel = document.createElement('section');
    panel.className = 'panel today-action-panel';
    panel.id = 'todayActionPanel';
    const first = rightColumn.querySelector('.panel');
    if(first && first.nextSibling) rightColumn.insertBefore(panel, first.nextSibling); else rightColumn.appendChild(panel);
  }
  function updateTodayAction(sym){
    ensureTodayAction();
    const panel = document.getElementById('todayActionPanel');
    if(!panel || !hasSetups()) return;
    const s = setups[sym] || setups.GBPJPY;
    const d = normalizedDecision(sym);
    const allowed = d === 'WATCH' ? 'Wait trigger' : d === 'PAPER TEST' ? 'Paper only' : d === 'WAIT' ? 'Wait only' : d === 'TRADE PLAN READY' ? 'Plan allowed' : 'No trade';
    panel.innerHTML = `<h3>TODAY ACTION</h3><div class="today-symbol"><b>${sym}</b><span>${fmtPrice(sym, priceCache[sym] ?? s.price)}</span></div><div class="kv"><span>Action</span><b>${d}</b></div><div class="kv"><span>Allowed</span><b>${allowed}</b></div><div class="kv"><span>Forbidden</span><b>No chase</b></div><div class="kv"><span>Paper</span><b>${paperSummary()}</b></div>`;
  }
  function updateSelectedPanel(sym){
    const setup = setups[sym] || setups.GBPJPY || {};
    const decisionEl = document.getElementById('selectedDecision'); if(decisionEl) decisionEl.textContent = normalizedDecision(sym);
    const badge = document.getElementById('setupBadge'); if(badge) badge.textContent = normalizedBadge(sym);
    const warning = document.getElementById('selectedWarning'); if(warning) warning.textContent = setup.warning || '-';
  }
  function injectStyle(){
    const style = document.createElement('style');
    style.textContent = `
      .terminal-shell{grid-template-rows:38px 96px 1fr 150px!important;gap:7px!important;}
      .topbar{gap:10px!important;font-size:12px!important;overflow:hidden!important;}
      .topbar>div:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .topbar>div:last-child{white-space:nowrap;flex-shrink:0;}
      #fxStrengthBar{margin-left:10px;color:#8b98a8;font-size:11px;font-weight:800;}
      #fxStrengthBar b{color:#f2f6fb!important;}
      .fx-label{color:#6cb6ff;font-size:10px;letter-spacing:.08em;margin-right:4px;}
      .watchlist-btn{margin-left:6px;background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:999px;padding:3px 8px;font-size:10px;font-weight:900;cursor:pointer;}
      .watchlist-panel{position:fixed;right:18px;top:54px;width:260px;z-index:9999;border:1px solid #263442;background:#070b10;border-radius:10px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,.55);}
      .watchlist-panel.hidden{display:none;}
      .wl-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#f2f6fb;}
      .wl-head button{background:#111820;color:#d7ecff;border:1px solid #36506b;border-radius:7px;cursor:pointer;}
      .wl-note{color:#8b98a8;font-size:11px;line-height:1.45;margin-bottom:8px;}
      .wl-checks{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;}
      .wl-checks label{border:1px solid #1b2530;background:#060a0f;border-radius:7px;padding:6px;color:#c9d1d9;font-size:12px;}
      .wl-save{width:100%;background:#122033;border:1px solid #36506b;color:#d7ecff;border-radius:7px;font-weight:900;padding:8px;cursor:pointer;}
      .heatmap{grid-template-columns:repeat(auto-fit,minmax(128px,1fr))!important;gap:7px!important;}
      .tile{min-height:96px!important;padding:8px 9px!important;display:grid!important;grid-template-rows:22px 14px 24px 20px!important;gap:2px!important;transition:transform .18s ease,border-color .18s ease;overflow:hidden!important;}
      .tile:hover{transform:translateY(-1px);border-color:#6cb6ff;}
      .tile-line1,.tile-line2{display:flex;justify-content:space-between;align-items:center;gap:5px;min-width:0;}
      .symbol{font-size:18px!important;line-height:1!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .score{font-size:13px!important;line-height:1!important;flex-shrink:0;}
      .grade{font-size:10px!important;margin:0!important;line-height:1.1!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .live-price{margin:0!important;color:#f2f6fb;font-size:17px!important;line-height:1.15!important;font-weight:900;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .tile-line2 b{font-size:11px!important;color:#fff;white-space:nowrap;}
      .tile-line2 span{font-size:10px!important;color:#b7c4d5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .tile::after{display:none!important;content:none!important;}
      .tile .action{display:none!important;}
      .right{grid-template-rows:230px minmax(420px,1fr) 145px!important;}
      .left{grid-template-rows:160px 148px minmax(220px,1fr)!important;gap:7px!important;}
      .today-action-panel{overflow:hidden!important;}
      .today-symbol{display:flex;justify-content:space-between;align-items:center;border:1px solid #1b2530;background:#070b10;border-radius:8px;padding:7px;margin-bottom:5px;}
      .today-symbol b{font-size:20px;color:#f2f6fb;}.today-symbol span{color:#f0b35a;font-weight:900;}
      #tradeMemoryPanel #paperPanel{display:none!important;}
      .daily-brief-msg{white-space:pre-line!important;font-size:13px!important;line-height:1.55!important;}
      .bottom-grid{grid-template-columns:1fr 1.15fr 1.3fr!important;}
      .gate-grid label{font-size:11.5px!important;padding:7px!important;}
      .journal-list{max-height:82px!important;}
      @media(max-width:1280px){.terminal-shell{grid-template-rows:auto!important}.watchlist-panel{left:12px;right:12px;width:auto}.left{grid-template-rows:auto!important}.right{grid-template-rows:auto!important}}
    `;
    document.head.appendChild(style);
  }
  function wrapSelect(){
    const old = window.selectSymbol;
    if(typeof old === 'function' && !old.__v531Wrapped){
      const wrapped = function(sym){
        old(sym);
        document.querySelectorAll('.tile[data-symbol]').forEach(tile => tile.classList.toggle('selected', tile.dataset.symbol === sym));
        updateSelectedPanel(sym);
        updateDailyBrief(sym);
        updateTodayAction(sym);
        sortAndRenderTiles();
        if(typeof window.loadLevels === 'function') window.loadLevels(sym);
      };
      wrapped.__v531Wrapped = true;
      window.selectSymbol = wrapped;
    }
  }
  function init(){
    if(!hasSetups()) return setTimeout(init, 200);
    injectStyle();
    setupHeader();
    setupWatchlistPanel();
    ensureTodayAction();
    wrapSelect();
    sortAndRenderTiles();
    updateFxStrength();
    updateDailyBrief(typeof currentSymbol !== 'undefined' ? currentSymbol : 'GBPJPY');
    updateTodayAction(typeof currentSymbol !== 'undefined' ? currentSymbol : 'GBPJPY');
    refreshCardPrices();
    setInterval(refreshCardPrices, 5 * 60 * 1000);
    console.log(VERSION + ' loaded');
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 300);
})();
