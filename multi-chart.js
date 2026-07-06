function injectMultiChartStyle(){
  const style=document.createElement('style');
  style.textContent=`
    .chart-panel{grid-template-rows:42px 1fr!important;}
    .multi-chart-grid{height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6px;padding:6px;background:#05070a;}
    .mini-chart-card{position:relative;border:1px solid #1b2530;background:#000;border-radius:8px;overflow:hidden;min-height:0;}
    .mini-tv{position:absolute;inset:0;width:100%;height:100%;}
  `;
  document.head.appendChild(style);
}

const jackChartFrames=[
  {id:'tv-5m',interval:'5'},
  {id:'tv-1h',interval:'60'},
  {id:'tv-4h',interval:'240'},
  {id:'tv-1w',interval:'W'}
];

function buildMultiChartShell(){
  const chart=document.querySelector('.chart');
  if(!chart)return;
  chart.innerHTML='<div class="multi-chart-grid">'+jackChartFrames.map(f=>`<div class="mini-chart-card"><div class="mini-tv" id="${f.id}"></div></div>`).join('')+'</div>';
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