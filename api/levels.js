const symbolMap = {
  GBPJPY: 'GBP/JPY', USDJPY: 'USD/JPY', XAUUSD: 'XAU/USD', GBPUSD: 'GBP/USD', EURUSD: 'EUR/USD', AUDJPY: 'AUD/JPY', USDCHF: 'USD/CHF', EURGBP: 'EUR/GBP', DXY: 'DXY', US10Y: 'US10Y'
};

const fallbackLevels = {
  GBPJPY: { price: 216.00, levels: { H1:{support:215.20,resistance:216.90}, H4:{support:214.30,resistance:218.20}, W1:{support:211.50,resistance:220.80}, M1:{support:205.00,resistance:225.00} }},
  USDJPY: { price: 161.93, levels: { H1:{support:161.20,resistance:162.60}, H4:{support:160.30,resistance:163.40}, W1:{support:157.80,resistance:165.00}, M1:{support:151.50,resistance:168.00} }},
  XAUUSD: { price: 2360, levels: { H1:{support:2348,resistance:2372}, H4:{support:2325,resistance:2395}, W1:{support:2280,resistance:2450}, M1:{support:2180,resistance:2520} }},
  GBPUSD: { price: 1.3630, levels: { H1:{support:1.3570,resistance:1.3680}, H4:{support:1.3480,resistance:1.3750}, W1:{support:1.3200,resistance:1.3900}, M1:{support:1.2700,resistance:1.4300} }},
  EURUSD: { price: 1.1429, levels: { H1:{support:1.1370,resistance:1.1480}, H4:{support:1.1300,resistance:1.1560}, W1:{support:1.1050,resistance:1.1750}, M1:{support:1.0700,resistance:1.2100} }},
  AUDJPY: { price: 106.20, levels: { H1:{support:105.70,resistance:106.85}, H4:{support:104.80,resistance:107.60}, W1:{support:102.50,resistance:109.80}, M1:{support:98.00,resistance:112.50} }},
  USDCHF: { price: 0.7950, levels: { H1:{support:0.7900,resistance:0.8010}, H4:{support:0.7840,resistance:0.8080}, W1:{support:0.7650,resistance:0.8250}, M1:{support:0.7350,resistance:0.8550} }},
  EURGBP: { price: 0.8400, levels: { H1:{support:0.8360,resistance:0.8440}, H4:{support:0.8300,resistance:0.8500}, W1:{support:0.8150,resistance:0.8650}, M1:{support:0.7900,resistance:0.8900} }}
};

const frames = [
  { key: 'H1', interval: '1h', outputsize: 240, left: 3 },
  { key: 'H4', interval: '4h', outputsize: 240, left: 3 },
  { key: 'W1', interval: '1week', outputsize: 140, left: 2 },
  { key: 'M1', interval: '1month', outputsize: 90, left: 1 }
];

function json(res, status, payload) { res.status(status).setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(payload)); }
function fmt(n) { if (!Number.isFinite(n)) return null; return Math.abs(n) >= 10 ? Number(n.toFixed(2)) : Number(n.toFixed(4)); }

function classifyAdvanced(price, lv) {
  if (!Number.isFinite(price)) return { status:'UNKNOWN', note:'No clean data yet.' };
  const near = Math.abs(price) * 0.0015;
  if (Number.isFinite(lv.nextResistance) && Math.abs(price - lv.nextResistance) <= near) return { status:'NEAR RESISTANCE', note:'Near next resistance. Avoid chasing into upper zone.' };
  if (Number.isFinite(lv.nearestSupport) && Math.abs(price - lv.nearestSupport) <= near) return { status:'NEAR SUPPORT', note:'Near support. Watch reaction and small-stop trigger.' };
  if (Number.isFinite(lv.brokenResistance) && Number.isFinite(lv.nextResistance) && price > lv.brokenResistance) return { status:'BREAKOUT', note:'Above broken resistance. Do not chase; wait retest or objective small stop.' };
  if (Number.isFinite(lv.brokenSupport) && Number.isFinite(lv.nextSupport) && price < lv.brokenSupport) return { status:'BREAKDOWN', note:'Below broken support. Long idea invalid or defensive.' };
  if (Number.isFinite(lv.nearestSupport) && Number.isFinite(lv.nextResistance)) {
    const width = Math.max(Math.abs(lv.nextResistance - lv.nearestSupport), Math.abs(price) * 0.001);
    const pos = (price - lv.nearestSupport) / width;
    if (pos > 0.35 && pos < 0.65) return { status:'MIDDLE PRICE', note:'Middle price. Abu rule: wait, do not force trade.' };
  }
  return { status:'INSIDE RANGE', note:'Inside range. Wait for edge, breakout, or clean retest.' };
}

function uniqueSorted(levels, asc=true) {
  const clean = levels.filter(Number.isFinite).sort((a,b)=>asc?a-b:b-a);
  const out = [];
  for (const x of clean) {
    const tol = Math.max(Math.abs(x) * 0.0008, 0.0001);
    if (!out.some(y => Math.abs(x-y) <= tol)) out.push(x);
  }
  return out;
}

function advancedLevels(values, left = 3) {
  const highs = [], lows = [];
  for (let i = left; i < values.length - left; i++) {
    const c = values[i];
    if (!Number.isFinite(c.high) || !Number.isFinite(c.low)) continue;
    let isHigh = true, isLow = true;
    for (let j = i - left; j <= i + left; j++) {
      if (j === i) continue;
      if (values[j].high >= c.high) isHigh = false;
      if (values[j].low <= c.low) isLow = false;
    }
    if (isHigh) highs.push(c.high);
    if (isLow) lows.push(c.low);
  }
  const last = values[values.length - 1]?.close;
  const recent = values.slice(-40);
  const highList = uniqueSorted([...highs, Math.max(...recent.map(x=>x.high))], true);
  const lowList = uniqueSorted([...lows, Math.min(...recent.map(x=>x.low))], true);
  const supportsBelow = lowList.filter(x => x < last).sort((a,b)=>b-a);
  const supportsAbove = lowList.filter(x => x > last).sort((a,b)=>a-b);
  const resistAbove = highList.filter(x => x > last).sort((a,b)=>a-b);
  const resistBelow = highList.filter(x => x < last).sort((a,b)=>b-a);
  const lv = {
    nearestSupport: fmt(supportsBelow[0] ?? Math.min(...recent.map(x=>x.low))),
    nextSupport: fmt(supportsBelow[1] ?? null),
    nextResistance: fmt(resistAbove[0] ?? Math.max(...recent.map(x=>x.high))),
    brokenResistance: fmt(resistBelow[0] ?? null),
    brokenSupport: fmt(supportsAbove[0] ?? null)
  };
  lv.support = lv.nearestSupport;
  lv.resistance = lv.nextResistance;
  return { ...lv, ...classifyAdvanced(last, lv) };
}

function classifyFallback(price, support, resistance) {
  const lv = { nearestSupport:support, nextResistance:resistance, support, resistance, brokenResistance:null, nextSupport:null, brokenSupport:null };
  return { ...lv, ...classifyAdvanced(price, lv) };
}

async function fetchTwelve(symbol, interval, outputsize, apikey) {
  const qs = new URLSearchParams({ symbol, interval, outputsize: String(outputsize), apikey });
  const r = await fetch(`https://api.twelvedata.com/time_series?${qs.toString()}`);
  const data = await r.json();
  if (!data || !Array.isArray(data.values)) throw new Error(data?.message || 'No values');
  return data.values.reverse().map(v => ({ high:Number(v.high), low:Number(v.low), close:Number(v.close) })).filter(v => Number.isFinite(v.high) && Number.isFinite(v.low) && Number.isFinite(v.close));
}

module.exports = async function handler(req, res) {
  const rawSymbol = String(req.query.symbol || 'GBPJPY').toUpperCase();
  const symbol = symbolMap[rawSymbol] || symbolMap.GBPJPY;
  const apikey = process.env.TWELVE_DATA_API_KEY;
  const fallback = fallbackLevels[rawSymbol] || fallbackLevels.GBPJPY;

  if (!apikey) {
    const levels = {};
    for (const key of Object.keys(fallback.levels)) {
      const l = fallback.levels[key];
      levels[key] = { ...classifyFallback(fallback.price, l.support, l.resistance), source:'fallback' };
    }
    return json(res, 200, { symbol:rawSymbol, price:fallback.price, source:'fallback_no_api_key', levels, note:'Add TWELVE_DATA_API_KEY in Vercel for live calculation.' });
  }

  try {
    const result = {}; let lastPrice = null;
    for (const f of frames) {
      const values = await fetchTwelve(symbol, f.interval, f.outputsize, apikey);
      if (!values.length) throw new Error('Empty candles');
      lastPrice = values[values.length - 1].close;
      const lv = advancedLevels(values, f.left);
      result[f.key] = { ...lv, source:'twelvedata' };
    }
    return json(res, 200, { symbol:rawSymbol, price:fmt(lastPrice), source:'twelvedata', levels:result, note:'Advanced S/R: nearest support, broken resistance/support, next resistance. Use as zone reference, not signal.' });
  } catch (error) {
    const levels = {};
    for (const key of Object.keys(fallback.levels)) {
      const l = fallback.levels[key];
      levels[key] = { ...classifyFallback(fallback.price, l.support, l.resistance), source:'fallback_error' };
    }
    return json(res, 200, { symbol:rawSymbol, price:fallback.price, source:'fallback_error', levels, note:error.message || 'API error. Showing fallback levels.' });
  }
};