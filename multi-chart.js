function injectMultiChartStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .chart-panel{grid-template-rows:42px 1fr!important;}
    .multi-chart-grid{height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6px;padding:6px;background:#05070a;}
    .mini-chart-card{position:relative;border:1px solid #1b2530;background:#000;border-radius:8px;overflow:hidden;min-height:0;}
    .mini-chart-title{position:absolute;top:6px;left:8px;z-index:2;border:1px solid #263442;background:rgba(7,11,16,.9);color:#d7ecff;border-radius:999px;padding:3px 8px;font-size:11px;font-weight:900;letter-spacing:.04em;}
    .mini-tv{position:absolute;inset:0;width:100%;height:100%;}
  `;
  document.head.appendChild(style);
}

const jackChartFrames=[
  {id:'tv-5m',label:'5M',interval:'5'},
  {id:'tv-1h',label:'1H',interval:'60'},
  {id:'tv-4h',label:'4H',interval:'240'},
  {id:'tv-1w',label:'1W',interval:'W'}
];

function buildMultiChartShell(){
  const chart=document.querySelector('.chart');
  if(!chart)return;
  chart.innerHTML='<div class="multi-chart-grid">'+jackChartFrames.map(f=>`<div class="mini-chart-card"><div class="mini-chart-title">${f.label}</div><div class="mini-tv" id="${f.id}"></div></div>`).join('')+'</div>';
}

function renderMultiTradingView(symbol){
  const setup=setups[symbol]||setups.GBPJPY;
  if(!document.getElementById('tv-5m')) buildMultiChartShell();
  if(!window.TradingView){setTimeout(()=>renderMultiTradingView(symbol),500);return;}
  jackChartFrames.forEach(f=>{
    const el=document.getElementById(f.id);
    if(!el)return;
    el.innerHTML='';
    new window.TradingView.widget({
      autosize:true,
      symbol:setup.tv,
      interval:f.interval,
      timezone:'Etc/UTC',
      theme:'dark',
      style:'1',
      locale:'en',
      enable_publishing:false,
      allow_symbol_change:false,
      hide_side_toolbar:true,
      hide_top_toolbar:true,
      withdateranges:false,
      save_image:false,
      studies:[],
      container_id:f.id
    });
  });
}

injectMultiChartStyle();
buildMultiChartShell();
window.renderTradingView=renderMultiTradingView;
renderMultiTradingView(currentSymbol||'GBPJPY');