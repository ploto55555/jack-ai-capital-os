const symbolMap = {
  GBPJPY: 'GBP/JPY',
  USDJPY: 'USD/JPY',
  XAUUSD: 'XAU/USD',
  GBPUSD: 'GBP/USD',
  EURUSD: 'EUR/USD',
  AUDJPY: 'AUD/JPY',
  USDCHF: 'USD/CHF',
  EURGBP: 'EUR/GBP',
  DXY: 'DXY',
  US10Y: 'US10Y'
};

const fallbackLevels = {
  GBPJPY: { price: 216.00, levels: {
    H1: { support: 215.20, resistance: 216.90 },
    H4: { support: 214.30, resistance: 218.20 },
    W1: { support: 211.50, resistance: 220.80 },
    M1: { support: 205.00, resistance: 225.00 }
  }},
  USDJPY: { price: 161.93, levels: {
    H1: { support: 161.20, resistance: 162.60 },
    H4: { support: 160.30, resistance: 163.40 },
    W1: { support: 157.80, resistance: 165.00 },
    M1: { support: 151.50, resistance: 168.00 }
  }},
  XAUUSD: { price: 2360, levels: {
    H1: { support: 2348, resistance: 2372 },
    H4: { support: 2325, resistance: 2395 },
    W1: { support: 2280, resistance: 2450 },
    M1: { support: 2180, resistance: 2520 }
  }},
  GBPUSD: { price: 1.3630, levels: {
    H1: { support: 1.3570, resistance: 1.3680 },
    H4: { support: 1.3480, resistance: 1.3750 },
    W1: { support: 1.3200, resistance: 1.3900 },
    M1: { support: 1.2700, resistance: 1.4300 }
  }},
  EURUSD: { price: 1.1429, levels: {
    H1: { support: 1.1370, resistance: 1.1480 },
    H4: { support: 1.1300, resistance: 1.1560 },
    W1: { support: 1.1050, resistance: 1.1750 },
    M1: { support: 1.0700, resistance: 1.2100 }
  }},
  AUDJPY: { price: 106.20, levels: {
    H1: { support: 105.70, resistance: 106.85 },
    H4: { support: 104.80, resistance: 107.60 },
    W1: { support: 102.50, resistance: 109.80 },
    M1: { support: 98.00, resistance: 112.50 }
  }},
  USDCHF: { price: 0.7950, levels: {
    H1: { support: 0.7900, resistance: 0.8010 },
    H4: { support: 0.7840, resistance: 0.8080 },
    W1: { support: 0.7650, resistance: 0.8250 },
    M1: { support: 0.7350, resistance: 0.8550 }
  }},
  EURGBP: { price: 0.8400, levels: {
    H1: { support: 0.8360, resistance: 0.8440 },
    H4: { support: 0.8300, resistance: 0.8500 },
    W1: { support: 0.8150, resistance: 0.8650 },
    M1: { support: 0.7900, resistance: 0.8900 }
  }}
};

const frames = [
  { key: 'H1', interval: '1h', outputsize: 180, left: 3 },
  { key: 'H4', interval: '4h', outputsize: 180, left: 3 },
  { key: 'W1', interval: '1week', outputsize: 120, left: 2 },
  { key: 'M1', interval: '1month', outputsize: 80, left: 1 }
];

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function fmt(n) {
  if (!Number.isFinite(n)) return null;
  return Math.abs(n) >= 10 ? Number(n.toFixed(2)) : Number(n.toFixed(4));
}

function classify(price, support, resistance) {
  if (!Number.isFinite(price) || !Number.isFinite(support) || !Number.isFinite(resistance)) return { status: 'UNKNOWN', note: 'No clean data yet.' };
  const width = Math.max(Math.abs(resistance - support), Math.abs(price) * 0.001);
  const near = Math.abs(price) * 0.0015;
  if (price > resistance) return { status: 'BREAKOUT', note: 'Breakout above resistance. Do not chase. Wait for retest or objective small stop.' };
  if (price < support) return { status: 'BREAKDOWN', note: 'Breakdown below support. Long idea invalid or defensive. Wait for new structure.' };
  if (Math.abs(price - support) <= near) return { status: 'NEAR SUPPORT', note: 'Near support. Watch for reaction and small-stop trigger.' };
  if (Math.abs(price - resistance) <= near) return { status: 'NEAR RESISTANCE', note: 'Near resistance. Avoid chasing into upper zone.' };
  if ((price - support) / width > 0.35 && (price - support) / width < 0.65) return { status: 'MIDDLE PRICE', note: 'Middle price. Abu rule: wait, do not force trade.' };
  return { status: 'INSIDE RANGE', note: 'Inside range. Wait for edge, breakout, or clean retest.' };
}

function swingLevels(values, left = 3) {
  const highs = [];
  const lows = [];
  for (let i = left; i < values.length - left; i++) {
    const c = values[i];
    if (!Number.isFinite(c.high) || !Number.isFinite(c.low)) continue;
    let isHigh = true;
    let isLow = true;
    for (let j = i - left; j <= i + left; j++) {
      if (j === i) continue;
      if (values[j].high >= c.high) isHigh = false;
      if (values[j].low <= c.low) isLow = false;
    }
    if (isHigh) highs.push(c.high);
    if (isLow) lows.push(c.low);
  }
  const last = values[values.length - 1]?.close;
  const below = lows.filter(x => x < last).sort((a, b) => b - a);
  const above = highs.filter(x => x > last).sort((a, b) => a - b);
  const allLows = lows.sort((a, b) => b - a);
  const allHighs = highs.sort((a, b) => a - b);
  return {
    support: fmt(below[0] ?? allLows[0] ?? Math.min(...values.slice(-30).map(x => x.low))),
    resistance: fmt(above[0] ?? allHighs[0] ?? Math.max(...values.slice(-30).map(x => x.high)))
  };
}

async function fetchTwelve(symbol, interval, outputsize, apikey) {
  const qs = new URLSearchParams({ symbol, interval, outputsize: String(outputsize), apikey });
  const url = `https://api.twelvedata.com/time_series?${qs.toString()}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!data || !Array.isArray(data.values)) throw new Error(data?.message || 'No values');
  return data.values.reverse().map(v => ({
    high: Number(v.high),
    low: Number(v.low),
    close: Number(v.close)
  })).filter(v => Number.isFinite(v.high) && Number.isFinite(v.low) && Number.isFinite(v.close));
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
      levels[key] = { ...l, ...classify(fallback.price, l.support, l.resistance), source: 'fallback' };
    }
    return json(res, 200, { symbol: rawSymbol, price: fallback.price, source: 'fallback_no_api_key', levels, note: 'Add TWELVE_DATA_API_KEY in Vercel for live calculation.' });
  }

  try {
    const result = {};
    let lastPrice = null;
    for (const f of frames) {
      const values = await fetchTwelve(symbol, f.interval, f.outputsize, apikey);
      if (!values.length) throw new Error('Empty candles');
      lastPrice = values[values.length - 1].close;
      const lv = swingLevels(values, f.left);
      result[f.key] = { ...lv, ...classify(lastPrice, lv.support, lv.resistance), source: 'twelvedata' };
    }
    return json(res, 200, { symbol: rawSymbol, price: fmt(lastPrice), source: 'twelvedata', levels: result, note: 'Swing high/low levels. Use as zone reference, not signal.' });
  } catch (error) {
    const levels = {};
    for (const key of Object.keys(fallback.levels)) {
      const l = fallback.levels[key];
      levels[key] = { ...l, ...classify(fallback.price, l.support, l.resistance), source: 'fallback_error' };
    }
    return json(res, 200, { symbol: rawSymbol, price: fallback.price, source: 'fallback_error', levels, note: error.message || 'API error. Showing fallback levels.' });
  }
};