const setups = {
  GBPJPY:{name:'British Pound / Japanese Yen',tv:'FX:GBPJPY',badge:'A+ SETUP',decision:'WAIT',score:'18/20',risk:'4%',warning:'NO CHASE',price:'-',marketType:'Migration / new space',core:'H4 breakout + M5 small stop',quality:'5.2 : 1',reason:'Structure is strong, but current price is late. Wait for pullback into clean zone or H1 compression break. No mid-price entry.'},
  AUDJPY:{name:'Australian Dollar / Japanese Yen',tv:'FX:AUDJPY',badge:'A SETUP',decision:'WATCH',score:'16/20',risk:'3%',warning:'WAIT TRIGGER',price:'-',marketType:'Trend with clean zone',core:'pullback trigger',quality:'4.3 : 1',reason:'Good structure and cleaner zone than most pairs, but wait for trigger confirmation.'},
  USDJPY:{name:'US Dollar / Japanese Yen',tv:'FX:USDJPY',badge:'A SETUP',decision:'WATCH',score:'14/20',risk:'2%',warning:'EXTENDED',price:'-',marketType:'Trend continuation',core:'objective small stop',quality:'3.1 : 1',reason:'Trend exists but price is extended. Watch only. Wait for clean pullback before considering risk.'},
  XAUUSD:{name:'Gold / US Dollar',tv:'OANDA:XAUUSD',badge:'PAPER',decision:'PAPER TEST',score:'13/20',risk:'0%',warning:'USD CONFLICT',price:'-',marketType:'Macro conflict',core:'paper review',quality:'2.4 : 1',reason:'Gold setup is mixed because USD and yields context are not clean. Paper track only until macro direction clears.'},
  USDCHF:{name:'US Dollar / Swiss Franc',tv:'FX:USDCHF',badge:'WATCH',decision:'WAIT',score:'12/20',risk:'1%',warning:'NO TRIGGER',price:'-',marketType:'Watch only',core:'no trigger',quality:'2.0 : 1',reason:'Market is watchable, but there is no valid Abu entry trigger yet.'},
  EURUSD:{name:'Euro / US Dollar',tv:'FX:EURUSD',badge:'NEUTRAL',decision:'WAIT',score:'10/20',risk:'1%',warning:'RANGE',price:'-',marketType:'Range / balance',core:'wait at edge',quality:'2.1 : 1',reason:'Average setup inside range. Need stronger direction and cleaner zone before planning.'},
  GBPUSD:{name:'British Pound / US Dollar',tv:'FX:GBPUSD',badge:'REJECT',decision:'REJECT',score:'08/20',risk:'0%',warning:'NO EDGE',price:'-',marketType:'No clear edge',core:'none',quality:'1.2 : 1',reason:'Insufficient structure and no clean target space. No decision setup.'},
  EURGBP:{name:'Euro / British Pound',tv:'FX:EURGBP',badge:'WEAK',decision:'REJECT',score:'07/20',risk:'0%',warning:'NO SPACE',price:'-',marketType:'Weak range',core:'none',quality:'0.9 : 1',reason:'Weak setup and limited target space. Reject.'},
  DXY:{name:'US Dollar Index',tv:'TVC:DXY',badge:'MACRO',decision:'MACRO',score:'15/20',risk:'INFO',warning:'USD CHECK',price:'-',marketType:'Macro filter',core:'USD context',quality:'info',reason:'USD strength is relevant for all USD pairs and gold. Use this as macro filter, not direct setup.'},
  US10Y:{name:'US 10Y Yield',tv:'TVC:US10Y',badge:'MACRO',decision:'MACRO',score:'14/20',risk:'INFO',warning:'GOLD RISK',price:'-',marketType:'Macro filter',core:'yield context',quality:'info',reason:'US yields can affect gold and USD direction. Watch before taking XAUUSD setups.'}
};
let currentSymbol='GBPJPY';
let tvRetry=0;
function renderTradingView(symbol){
  currentSymbol=symbol;
  const container=document.getElementById('tv-chart');
  if(!container)return;
  const setup=setups[symbol]||setups.GBPJPY;
  container.innerHTML="<div class='tv-loading'>Loading TradingView...</div>";
  if(!window.TradingView){
    if(tvRetry<8){tvRetry+=1;setTimeout(()=>renderTradingView(symbol),500);}
    else container.innerHTML="<div class='tv-loading'>TradingView failed to load. Refresh the page.</div>";
    return;
  }
  tvRetry=0;
  container.innerHTML='';
  new window.TradingView.widget({autosize:true,symbol:setup.tv,interval:'60',timezone:'Etc/UTC',theme:'dark',style:'1',locale:'en',enable_publishing:false,allow_symbol_change:true,hide_side_toolbar:false,hide_top_toolbar:false,container_id:'tv-chart'});
}
function calculateRisk(){
  const e=Number(document.getElementById('equityInput')?.value||500);
  const r=Number(document.getElementById('riskInput')?.value||4);
  const s=Number(document.getElementById('stopInput')?.value||50);
  const out=document.getElementById('riskResult');
  if(out)out.innerHTML='Risk amount: <b>$'+(e*r/100).toFixed(2)+'</b> · Approx pip value: <b>$'+((e*r/100)/s).toFixed(2)+'</b> · 5R target: <b>$'+(e*r/100*5).toFixed(2)+'</b>';
}
