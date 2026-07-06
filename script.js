const setups = {
  GBPJPY: { badge: "A+ SETUP", decision: "WAIT", score: "18/20", risk: "4%", warning: "NO CHASE", price: "216.00", reason: "Structure is bullish, but current price is late. Wait for pullback into clean zone or H1 compression break. No mid-price entry." },
  USDJPY: { badge: "A SETUP", decision: "WATCH", score: "14/20", risk: "2%", warning: "EXTENDED", price: "161.93", reason: "Trend exists but price is extended. Watch only. Wait for clean pullback before considering risk." },
  XAUUSD: { badge: "PAPER", decision: "PAPER", score: "13/20", risk: "0%", warning: "USD CONFLICT", price: "2360", reason: "Gold setup is mixed because USD and yields context are not clean. Paper track only until macro direction clears." },
  GBPUSD: { badge: "REJECT", decision: "REJECT", score: "08/20", risk: "0%", warning: "NO EDGE", price: "1.3630", reason: "Insufficient structure and no clean target space. No trade." },
  EURUSD: { badge: "NEUTRAL", decision: "WAIT", score: "10/20", risk: "1%", warning: "RANGE", price: "1.1429", reason: "Average setup inside range. Need stronger direction and cleaner zone before planning a trade." },
  AUDJPY: { badge: "A SETUP", decision: "WATCH", score: "16/20", risk: "3%", warning: "WAIT TRIGGER", price: "106.20", reason: "Good structure and cleaner zone than most pairs, but wait for trigger confirmation." },
  USDCHF: { badge: "WATCH", decision: "WAIT", score: "12/20", risk: "1%", warning: "NO TRIGGER", price: "0.7950", reason: "Market is watchable, but there is no valid Abu entry trigger yet." },
  DXY: { badge: "MACRO", decision: "STRONG", score: "15/20", risk: "INFO", warning: "USD CHECK", price: "100.97", reason: "USD strength is relevant for all USD pairs and gold. Use this as macro filter, not direct trade signal." },
  US10Y: { badge: "MACRO", decision: "WATCH", score: "14/20", risk: "INFO", warning: "GOLD RISK", price: "4.30%", reason: "US yields can affect gold and USD direction. Watch before taking XAUUSD setups." },
  EURGBP: { badge: "WEAK", decision: "REJECT", score: "07/20", risk: "0%", warning: "NO SPACE", price: "0.8400", reason: "Weak setup and limited target space. Reject." }
};

let currentSymbol = "GBPJPY";

function selectSymbol(symbol) {
  currentSymbol = symbol;
  const setup = setups[symbol] || setups.GBPJPY;
  document.querySelectorAll(".tile").forEach(tile => tile.classList.toggle("selected", tile.dataset.symbol === symbol));
  document.getElementById("chartSymbol").textContent = symbol;
  document.getElementById("selectedSymbol").textContent = symbol;
  document.getElementById("setupBadge").textContent = setup.badge;
  document.getElementById("selectedDecision").textContent = setup.decision;
  document.getElementById("selectedScore").textContent = setup.score;
  document.getElementById("selectedRisk").textContent = setup.risk;
  document.getElementById("selectedWarning").textContent = setup.warning;
  document.getElementById("selectedReason").textContent = setup.reason;
  const price = document.querySelector(".price-tag");
  if (price) price.textContent = setup.price;
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
    return `${currentSymbol}: current allowed risk is ${setup.risk}. For small-account stage, only use high risk when setup is A+ or S and entry is clean.`;
  }
  if (q.includes("why") || q.includes("wait") || q.includes("为什么") || q.includes("等")) {
    return `${currentSymbol}: ${setup.reason}`;
  }
  if (q.includes("plan") || q.includes("entry") || q.includes("交易计划") || q.includes("入场")) {
    return `${currentSymbol} trade plan: wait for clean zone, define stop first, check target space, then calculate risk. No mid-price entry.`;
  }
  return `${currentSymbol}: decision is ${setup.decision}, score ${setup.score}, warning ${setup.warning}. This is mock AI now; later it will connect to real AI API.`;
}

document.querySelectorAll(".tile[data-symbol]").forEach(tile => {
  tile.addEventListener("click", () => selectSymbol(tile.dataset.symbol));
});

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

selectSymbol("GBPJPY");
