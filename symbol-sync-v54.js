(function(){
  const VERSION='V5.4 Symbol Sync';
  let lastSymbol='';
  function getSetup(sym){try{return setups[sym]||setups.GBPJPY||{};}catch{return {};}}
  function syncDom(sym){
    const s=getSetup(sym);
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
    set('chartSymbol',sym);
    set('selectedSymbol',sym);
    set('selectedName',s.name||'');
    set('setupBadge',s.badge||'');
    set('selectedScore',s.score||'-');
    set('selectedRisk',s.risk||'-');
    set('selectedWarning',s.warning||'-');
    const dec=document.getElementById('selectedDecision');if(dec)dec.textContent=s.decision||'WAIT';
    const tm=document.getElementById('tmSymbol');if(tm)tm.value=sym;
    document.querySelectorAll('.tile[data-symbol]').forEach(t=>t.classList.toggle('selected',t.dataset.symbol===sym));
  }
  function syncChart(sym){
    if(typeof window.renderTradingView==='function'){
      try{window.renderTradingView(sym);return;}catch(e){console.warn('chart sync failed',e);}
    }
    if(typeof renderTradingView==='function'){
      try{renderTradingView(sym);return;}catch(e){console.warn('chart sync failed',e);}
    }
  }
  function syncLevels(sym){
    if(typeof window.loadLevels==='function'){
      try{window.loadLevels(sym);return;}catch(e){console.warn('levels sync failed',e);}
    }
    if(typeof loadLevels==='function'){
      try{loadLevels(sym);return;}catch(e){console.warn('levels sync failed',e);}
    }
  }
  window.forceSymbolSync=function(sym){
    if(!sym) return;
    lastSymbol=sym;
    try{window.currentSymbol=sym;}catch{}
    syncDom(sym);
    syncChart(sym);
    syncLevels(sym);
    setTimeout(()=>syncLevels(sym),300);
    setTimeout(()=>syncChart(sym),450);
  };
  function installTileDelegation(){
    const heatmap=document.querySelector('.heatmap');
    if(!heatmap||heatmap.__syncInstalled)return;
    heatmap.__syncInstalled=true;
    heatmap.addEventListener('click',function(e){
      const tile=e.target.closest('.tile[data-symbol]');
      if(!tile)return;
      const sym=tile.dataset.symbol;
      setTimeout(()=>window.forceSymbolSync(sym),0);
      setTimeout(()=>window.forceSymbolSync(sym),250);
      setTimeout(()=>window.forceSymbolSync(sym),800);
    },true);
  }
  function wrapSelect(){
    const original=window.selectSymbol;
    if(typeof original==='function'&&!original.__symbolSyncWrapped){
      const wrapped=function(sym){
        const r=original.apply(this,arguments);
        setTimeout(()=>window.forceSymbolSync(sym),0);
        setTimeout(()=>window.forceSymbolSync(sym),350);
        return r;
      };
      wrapped.__symbolSyncWrapped=true;
      window.selectSymbol=wrapped;
    }
  }
  function init(){
    installTileDelegation();
    wrapSelect();
    const initial=(typeof currentSymbol!=='undefined'&&currentSymbol)||window.currentSymbol||'GBPJPY';
    window.forceSymbolSync(initial);
    setInterval(()=>{installTileDelegation();wrapSelect();},1000);
    console.log(VERSION+' loaded');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500));else setTimeout(init,500);
})();
