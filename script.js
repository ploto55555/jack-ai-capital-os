const output = document.getElementById("terminalOutput");
const form = document.getElementById("commandForm");
const input = document.getElementById("commandInput");
const ruleStatus = document.getElementById("ruleStatus");

const decisions = {
  GBPJPY: { action: "WAIT", mode: "DEFENSE", symbol: "GBPJPY", risk: "4%", score: "18/20", warning: "NO CHASE", note: "High score, but entry is not clean. Wait for pullback or compression break with small stop." },
  USDJPY: { action: "WATCH", mode: "NORMAL", symbol: "USDJPY", risk: "2%", score: "14/20", warning: "EXTENDED", note: "Trend exists but price is extended. Watch only. Do not enter mid-price." },
  XAUUSD: { action: "PAPER", mode: "NORMAL", symbol: "XAUUSD", risk: "0%", score: "13/20", warning: "USD CONFLICT", note: "Gold setup is not clean because USD/yields context is mixed. Paper track only." },
  GBPUSD: { action: "REJECT", mode: "DEFENSE", symbol: "GBPUSD", risk: "0%", score: "08/20", warning: "NO EDGE", note: "Insufficient structure. No trade." },
  EURUSD: { action: "NEUTRAL", mode: "WAIT", symbol: "EURUSD", risk: "1%", score: "10/20", warning: "WAIT", note: "Average setup. Need stronger direction and cleaner zone." }
};

function setDecision(symbol) {
  const d = decisions[symbol] || decisions.GBPJPY;
  document.getElementById("decisionAction").textContent = d.action;
  document.getElementById("decisionMode").textContent = d.mode;
  document.getElementById("decisionSymbol").textContent = d.symbol;
  document.getElementById("decisionRisk").textContent = d.risk;
  document.getElementById("decisionScore").textContent = d.score;
  document.getElementById("decisionWarning").textContent = d.warning;
  setOutput(`SCAN RESULT: ${d.symbol}\n\nACTION: ${d.action}\nMODE: ${d.mode}\nSCORE: ${d.score}\nRISK: ${d.risk}\nWARNING: ${d.warning}\n\nREASON:\n${d.note}\n\nRULE:\nUser decides execution. AI does not auto-trade.`);
}

function setOutput(text) {
  output.textContent = text;
}

function riskCalc(parts) {
  const equity = Number(parts[1]);
  const riskPercent = Number(parts[2]);
  const stopPips = Number(parts[3]);
  if (!equity || !riskPercent || !stopPips) {
    setOutput("RISK COMMAND FORMAT:\n\nrisk 500 4 50\n\nMeaning:\nequity = 500\nrisk = 4%\nstop = 50 pips");
    return;
  }
  const riskAmount = equity * (riskPercent / 100);
  const perPip = riskAmount / stopPips;
  setOutput(`RISK CALCULATION\n\nEquity: $${equity.toFixed(2)}\nRisk: ${riskPercent}%\nRisk amount: $${riskAmount.toFixed(2)}\nStop size: ${stopPips} pips\nApprox value per pip: $${perPip.toFixed(2)}\n\nCHECK:\nOnly use this when setup is A+ or S and structure is clean.`);
}

function runCommand(raw) {
  const command = raw.trim().toLowerCase();
  const parts = command.split(/\s+/);

  if (!command) return;
  if (command === "clear") return setOutput("TERMINAL CLEARED.");
  if (command === "help") {
    return setOutput("AVAILABLE COMMANDS:\n\nscan gbpjpy\nscan usdjpy\nscan xauusd\nscan gbpusd\nscan eurusd\nrisk 500 4 50\nmistakes\nrules\nclear\n\nV1 is mock data only. Real API and database come later.");
  }
  if (parts[0] === "scan") return setDecision((parts[1] || "GBPJPY").toUpperCase());
  if (parts[0] === "risk") return riskCalc(parts);
  if (command === "mistakes") {
    return setOutput("MISTAKE MEMORY\n\n1. Chasing after breakout candle.\n2. Entering mid-price without zone.\n3. Stop too large for account stage.\n4. Trading before high-impact news.\n5. Increasing risk after loss.\n\nNEXT BUILD:\nSave each mistake into journal and count repeated mistakes.");
  }
  if (command === "rules") {
    return setOutput("RULE QUEUE\n\nCurrent rule policy:\nAI can suggest rule updates, but user must approve before the system changes rules.\n\nMock suggestion:\nIf price is extended after breakout, change action from ATTACK to WAIT unless a pullback entry appears.");
  }

  setOutput(`UNKNOWN COMMAND: ${raw}\n\nType help to see available commands.`);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});

document.querySelectorAll("[data-symbol]").forEach((button) => {
  button.addEventListener("click", () => setDecision(button.dataset.symbol));
});

document.getElementById("approveRule").addEventListener("click", () => {
  ruleStatus.textContent = "Status: mock rule approved";
});

document.getElementById("rejectRule").addEventListener("click", () => {
  ruleStatus.textContent = "Status: mock rule rejected";
});
