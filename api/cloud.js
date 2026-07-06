function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}
function cfg() { return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY }; }
async function sb(path, options = {}) {
  const { url, key } = cfg();
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  const r = await fetch(`${url}/rest/v1/${path}`, { ...options, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const text = await r.text(); let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) throw new Error(typeof data === 'string' ? data : (data?.message || 'Supabase error'));
  return data;
}
function tradeRow(t) {
  return { id: String(t.id), symbol: t.symbol || null, strategy_id: t.strategyId || null, strategy_name: t.strategyName || null, status: t.status || null, outcome: t.outcome || null, direction: t.direction || null, potential_r: Number.isFinite(Number(t.potentialR)) ? Number(t.potentialR) : null, gpt_tokens: Number.isFinite(Number(t.gptTokens)) ? Number(t.gptTokens) : null, gpt_cost: Number.isFinite(Number(t.gptCost)) ? Number(t.gptCost) : null, payload: t, updated_at: new Date().toISOString() };
}
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const action = body.action;
    if (action === 'health') { const ok = !!(cfg().url && cfg().key); return json(res, 200, { ok, cloud: ok ? 'configured' : 'missing_env' }); }
    if (action === 'listTrades') { const rows = await sb('paper_trades?select=payload&order=created_at.desc&limit=200', { method: 'GET' }); return json(res, 200, { ok: true, trades: (rows || []).map(r => r.payload) }); }
    if (action === 'runnerStatus') {
      const runs = await sb('strategy_runs?select=payload,created_at&order=created_at.desc&limit=5', { method: 'GET' });
      const trades = await sb('paper_trades?select=status,outcome,strategy_id,strategy_name,symbol,potential_r,created_at&order=created_at.desc&limit=200', { method: 'GET' });
      const last = runs?.[0]?.payload || null;
      const open = (trades || []).filter(t => t.status === 'PAPER OPEN').length;
      const closed = (trades || []).filter(t => t.status === 'PAPER CLOSED').length;
      const total = (trades || []).length;
      return json(res, 200, { ok: true, lastRun: last, recentRuns: (runs || []).map(r => r.payload), totals: { total, open, closed }, schedule: 'Every 1 hour' });
    }
    if (action === 'upsertTrade') {
      const trade = body.trade; if (!trade?.id) return json(res, 400, { error: 'trade.id required' });
      const rows = await sb('paper_trades?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([tradeRow(trade)]) });
      return json(res, 200, { ok: true, rows });
    }
    if (action === 'upsertTrades') {
      const trades = Array.isArray(body.trades) ? body.trades.filter(t => t?.id) : [];
      if (!trades.length) return json(res, 200, { ok: true, rows: [] });
      const rows = await sb('paper_trades?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(trades.map(tradeRow)) });
      return json(res, 200, { ok: true, rows });
    }
    if (action === 'saveRun') {
      const run = body.run; if (!run?.id) return json(res, 400, { error: 'run.id required' });
      const row = { id: String(run.id), opened: Number(run.opened || 0), rejected: Number(run.rejected || 0), payload: run };
      const rows = await sb('strategy_runs?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([row]) });
      return json(res, 200, { ok: true, rows });
    }
    if (action === 'saveSnowball') {
      const item = body.item; if (!item) return json(res, 400, { error: 'item required' });
      const row = { id: String(item.id || Date.now()), type: item.type || null, symbol: item.symbol || null, payload: item };
      const rows = await sb('snowball_memory?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([row]) });
      return json(res, 200, { ok: true, rows });
    }
    return json(res, 400, { error: 'Unknown action' });
  } catch (error) { return json(res, 200, { ok: false, error: error.message || 'Cloud API error' }); }
};
