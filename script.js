const setups = {
  GBPJPY: { name: "British Pound / Japanese Yen", tv: "FX:GBPJPY", badge: "A+ SETUP", decision: "WAIT", score: "18/20", risk: "4%", warning: "NO CHASE", price: "216.00", reason: "Structure is bullish, but current price is late. Wait for pullback into clean zone or H1 compression break. No mid-price entry." },
  USDJPY: { name: "US Dollar / Japanese Yen", tv: "FX:USDJPY", badge: "A SETUP", decision: "WATCH", score: "14/20", risk: "2%", warning: "EXTENDED", price: "161.93", reason: "Trend exists but price is extended. Watch only. Wait for clean pullback before considering risk." },
  XAUUSD: { name: "Gold / US Dollar", tv: "OANDA:XAUUSD", badge: "PAPER", decision: "PAPER", score: "13/20", risk: "0%", warning: "USD CONFLICT", price: "2360", reason: "Gold setup is mixed because USD and yields context are not clean. Paper track only until macro direction clears." },
  GBPUSD: { name: "British Pound / US Dollar", tv: "FX:GBPUSD", badge: "REJECT", decision: "REJECT", score: "08/20", risk: "0%", warning: "NO EDGE", price: "1.3630", reason: "Insufficient structure and no clean target space. No trade." },
  EURUSD: { name: "Euro / US Dollar", tv: "FX:EURUSD", badge: "NEUTRAL", decision: "WAIT", score: "10/20", risk: "1%", warning: "RANGE", price: "1.1429", reason: "Average setup inside range. Need stronger direction and cleaner zone before planning a trade." },
  AUDJPY: { name: "Australian Dollar / Japanese Yen", tv: "FX:AUDJPY", badge: "A SETUP", decision: "WATCH", score: "16/20", risk: "3%", warning: "WAIT TRIGGER", price: "106.20", reason: "Good structure and cleaner zone than most pairs, but wait for trigger confirmation." },
  USDCHF: { name: "US Dollar / Swiss Franc", tv: "FX:USDCHF", badge: "WATCH", decision: "WAIT", score: "12/20", risk: "1%", warning: "NO TRIGGER", price: "0.7950", reason: "Market is watchable, but there is no valid Abu entry trigger yet." },
  DXY: { name: "US Dollar Index", tv: "TVC:DXY", badge: "MACRO", decision: "STRONG", score: "15/20", risk: "INFO", warning: "USD CHECK", price: "100.97", reason: "USD strength is relevant for all USD pairs and gold. Use this as macro filter, not direct trade signal." },
  US10Y: { name: "US 10Y Yield", tv: "TVC:US10Y", badge: "MACRO", decision: "WATCH", score: "14/20", risk: "INFO", warning: "GOLD RISK", price: "4.30%", reason: "US yields can affect gold and USD direction. Watch before taking XAUUSD setups." },
  EURGBP: { name: "Euro / British Pound", tv: "FX:EURGBP", badge: "WEAK", decision: "REJECT", score: "07/20", risk: "0%", warning: "NO SPACE", price: "0.8400", reason: "Weak setup and limited target space. Reject." }
};

let currentSymbol = "GBPJPY";
let tvRetry = 0;

function renderTradingView(symbol) {
  const container = document.getElementById("tv-chart");
  if (!container) return;
  const setup = setups[symbol] || setups.GBPJPY;
  container.innerHTML = "<div class='tv-loading'>Loading TradingView...</div>";
  if (!window.TradingView) {
    if (tvRetry < 8) {
      tvRetry += 1;
      setTimeout(() => renderTradingView(symbol), 500);
    } else {
      container.innerHTML = "<div class='tv-loading'>TradingView failed to load. Refresh the page.</div>";
    }
    return;
  }
  tvRetry = 0;
  container.innerHTML = "";
  new window.TradingView.widget({
    autosize: true,
    symbol: setup.tv,
    interval: "60",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    enable_publishing: false,
    allow_symbol_change: true,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    container_id: "tv-chart"
  });
}

function selectSymbol(symbol) {
  currentSymbol = symbol;
  const setup = setups[symbol] || setups.GBPJPY;
  document.querySelectorAll(".tile").forEach(tile => tile.classList.toggle("selected", tile.dataset.symbol === symbol));
  document.getElementById("chartSymbol").textContent = symbol;
  document.getElementById("selectedSymbol").textContent = symbol;
  const name = document.getElementById("selectedName");
  if (name) name.textContent = setup.name;
  document.getElementById("setupBadge").textContent = setup.badge;
  document.getElementById("selectedDecision").textContent = setup.decision;
  document.getElementById("selectedScore").textContent = setup.score;
  document.getElementById("selectedRisk").textContent = setup.risk;
  document.getElementById("selectedWarning").textContent = setup.warning;
  document.getElementById("selectedReason").textContent = setup.reason;
  document.getElementById("planTitle").textContent = `${symbol} Plan:`;
  document.getElementById("tradePlanText").textContent = setup.decision === "REJECT" ? "No trade. Record why this setup is rejected." : "Wait for clean zone, define stop first, check target space, then decide risk.";
  renderTradingView(symbol);
}

function addChatMessage(type, text) {
  const chatBox = document.getElementById("chatBox");
  if (!chatBox) return;
  const msg = document.createElement("div");
  msg.className = `msg ${type}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function mockAiAnswer(question) {
  const setup = setups[currentSymbol] || setups.GBPJPY;
  const q = question.toLowerCase();
  if (q.includes("risk") || q.includes("lot") || q.includes("仓")) {
    return `${currentSymbol}: allowed risk is ${setup.risk}. Use high risk only when setup is A+ or S and entry is clean. Calculate stop first.`;
  }
  if (q.includes("why") || q.includes("wait") || q.includes("为什么") || q.includes("等")) {
    return `${currentSymbol}: ${setup.reason}`;
  }
  if (q.includes("plan") || q.includes("entry") || q.includes("交易计划") || q.includes("入场")) {
    return `${currentSymbol} plan: ${setup.decision === "REJECT" ? "No trade." : "wait for clean zone, compression break, small stop, then calculate R."}`;
  }
  return `${currentSymbol}: decision ${setup.decision}, score ${setup.score}, warning ${setup.warning}. Mock AI is running today; real API comes in V2.`;
}

function calculateRisk() {
  const equity = Number(document.getElementById("equityInput")?.value || 0);
  const risk = Number(document.getElementById("riskInput")?.value || 0);
  const stop = Number(document.getElementById("stopInput")?.value || 0);
  const result = document.getElementById("riskResult");
  if (!equity || !risk || !stop) {
    result.textContent = "Enter equity, risk %, and stop pips.";
    return;
  }
  const riskAmount = equity * risk / 100;
  const pipValue = riskAmount / stop;
  const target5R = riskAmount * 5;
  result.innerHTML = `Risk amount: <b>$${riskAmount.toFixed(2)}</b> · Approx pip value: <b>$${pipValue.toFixed(2)}</b> · 5R target: <b>$${target5R.toFixed(2)}</b>`;
  const eq = document.getElementById("accountEquity");
  const maxRisk = document.getElementById("accountMaxRisk");
  if (eq) eq.textContent = `$${equity.toFixed(0)}`;
  if (maxRisk) maxRisk.textContent = `${risk}%`;
}

function getJournal() {
  try { return JSON.parse(localStorage.getItem("jackCapitalJournal") || "[]"); } catch { return []; }
}

function saveJournal(items) {
  localStorage.setItem("jackCapitalJournal", JSON.stringify(items.slice(0, 12)));
}

function renderJournal() {
  const list = document.getElementById("journalList");
  if (!list) return;
  const items = getJournal();
  list.innerHTML = items.length ? "" : "<div class='journal-item'>No journal yet. Save your first setup note.</div>";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "journal-item";
    div.textContent = item;
    list.appendChild(div);
  });
}

document.querySelectorAll(".tile[data-symbol]").forEach(tile => tile.addEventListener("click", () => selectSymbol(tile.dataset.symbol)));

const chatForm = document.getElementById("aiChatForm");
const chatInput = document.getElementById("aiChatInput");
if (chatForm && chatInput) {
  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    addChatMessage("user", question);
    addChatMessage("ai", mockAiAnswer(question));
    chatInput.value = "";
  });
}

const riskForm = document.getElementById("riskForm");
if (riskForm) riskForm.addEventListener("submit", event => { event.preventDefault(); calculateRisk(); });

const journalForm = document.getElementById("journalForm");
const journalInput = document.getElementById("journalInput");
if (journalForm && journalInput) {
  journalForm.addEventListener("submit", event => {
    event.preventDefault();
    const note = journalInput.value.trim();
    if (!note) return;
    const stamp = new Date().toLocaleString();
    const items = getJournal();
    items.unshift(`${stamp} · ${currentSymbol} · ${note}`);
    saveJournal(items);
    journalInput.value = "";
    renderJournal();
  });
}

calculateRisk();
renderJournal();
selectSymbol("GBPJPY");
