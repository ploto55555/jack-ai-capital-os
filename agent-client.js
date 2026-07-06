async function callAgent(question, symbol, context) {
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, symbol, context })
    });
    const data = await response.json();
    return { answer: data.answer || '没有收到 AI 回答。', usage: data.usage || null };
  } catch (error) {
    return { answer: '连接 GPT Agent 失败。请检查 Vercel 部署和 OPENAI_API_KEY。', usage: null };
  }
}
function fallbackChineseAnswer(question, symbol, context) {return symbol + ' 中文检查：\n' +'1. 当前判断：' + (context.decision || 'WAIT') + '\n' +'2. 风险：' + (context.risk || '-') + '\n' +'3. 警告：' + (context.warning || '-') + '\n' +'4. 结构：' + (context.core || '-') + '\n' +'5. 结论：先等清楚位置，不追价，有客观止损才准备交易计划。';}
function improveChatReadability() {const style = document.createElement('style');style.textContent = `.ai-chat-panel{min-height:430px!important;}.chat-box{height:300px!important;max-height:300px!important;overflow-y:auto!important;padding:12px!important;}.chat-box .msg{font-size:14px!important;line-height:1.65!important;white-space:pre-wrap!important;letter-spacing:.01em!important;}.chat-box .msg.ai{padding:14px!important;border-radius:10px!important;}.chat-box .msg.user{font-size:13px!important;}.ai-chat-form{grid-template-columns:1fr 58px 52px!important;}.ai-chat-form input{font-size:14px!important;height:42px!important;}.ai-chat-form button{height:42px!important;}.usage-bubble{height:42px;border:1px solid #263442;background:#070b10;color:#8b98a8;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;cursor:help;white-space:nowrap;}.usage-bubble.thinking{color:#6cb6ff;border-color:#36506b;}.usage-bubble.ok{color:#7ff0ad;border-color:#2f6848;background:#0d2418;}.usage-bubble.warn{color:#f0b35a;border-color:#574018;background:#2c210f;}.usage-bubble.err{color:#ff8a94;border-color:#5a1c25;background:#2b1014;}.journal-list{max-height:150px!important;overflow-y:auto!important;}`;document.head.appendChild(style);}
function formatAgentAnswer(text) {return String(text || '').replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n').trim();}
function compactTokens(n) {if (!n) return '0';if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';return String(n);}
function getMonthKey() {const d = new Date();return 'aiCost-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');}
function getMonthlyCost() {return Number(localStorage.getItem(getMonthKey()) || 0);}
function addMonthlyCost(cost) {const next = getMonthlyCost() + Number(cost || 0);localStorage.setItem(getMonthKey(), String(next));return next;}
function ensureUsageBubble(form) {let bubble = document.getElementById('usageBubble');if (bubble) return bubble;bubble = document.createElement('div');bubble.id = 'usageBubble';bubble.className = 'usage-bubble';bubble.textContent = '◔ 0';bubble.title = 'AI token usage';const button = form.querySelector('button');form.insertBefore(bubble, button);return bubble;}
function updateUsageBubble(usage, state) {const bubble = document.getElementById('usageBubble');if (!bubble) return;bubble.className = 'usage-bubble ' + (state || '');if (!usage) {bubble.textContent = state === 'thinking' ? '◔ ...' : '◔ 0';bubble.title = '等待 AI usage';return;}const month = addMonthlyCost(usage.estimatedCost || 0);bubble.textContent = '◔ ' + compactTokens(usage.totalTokens);if (month >= 8) bubble.className = 'usage-bubble warn';bubble.title = '本次：' + usage.totalTokens + ' tokens\nInput: ' + usage.inputTokens + '\nOutput: ' + usage.outputTokens + '\n估算：$' + Number(usage.estimatedCost || 0).toFixed(4) + '\n本月：$' + month.toFixed(2) + ' / $10';}
function loadScriptOnce(id, src) {if (document.getElementById(id)) return;const s = document.createElement('script');s.id = id;s.src = src;document.body.appendChild(s);}
function loadMultiChartPanel() { loadScriptOnce('multiChartLoader', 'multi-chart.js'); }
function loadLevelsPanel() { loadScriptOnce('levelsPanelLoader', 'levels-panel.js'); }
function loadPaperTradeLoop() { loadScriptOnce('paperTradeLoader', 'paper-trade.js'); }
function loadPaperTradePage() { loadScriptOnce('paperPageLoader', 'paper-page.js'); }
function loadStrategyResearchEngine() { loadScriptOnce('strategyEngineLoader', 'strategy-engine.js'); }
function loadCloudSyncClient() { loadScriptOnce('cloudSyncLoader', 'cloud-sync.js'); }
function enableAgentClient() {
  loadMultiChartPanel();loadLevelsPanel();loadPaperTradeLoop();loadPaperTradePage();loadStrategyResearchEngine();loadCloudSyncClient();improveChatReadability();
  const form = document.getElementById('aiChatForm');const input = document.getElementById('aiChatInput');if (!form || !input) return;
  const bubble = ensureUsageBubble(form);const month = getMonthlyCost();bubble.textContent = '◔ $' + month.toFixed(2);bubble.title = '本月估算：$' + month.toFixed(2) + ' / $10';
  input.placeholder = '中文问 Jack AI...';const title = document.querySelector('.ai-chat-panel h3');if (title) title.textContent = '问 Jack AI';const first = document.querySelector('#chatBox .msg.ai');if (first) first.textContent = '中文 GPT Agent 已接入。直接用中文问我。';
  form.addEventListener('submit', async function(event) {event.preventDefault();event.stopImmediatePropagation();const question = input.value.trim();if (!question) return;addChatMessage('user', question);input.value = '';addChatMessage('ai', '思考中...');updateUsageBubble(null, 'thinking');const context = setups[currentSymbol] || {};const result = await callAgent(question, currentSymbol, context);let answer = result.answer;if (!answer || answer === 'No response.') answer = fallbackChineseAnswer(question, currentSymbol, context);answer = formatAgentAnswer(answer);const box = document.getElementById('chatBox');const messages = box ? box.querySelectorAll('.msg.ai') : [];const last = messages.length ? messages[messages.length - 1] : null;if (last) last.textContent = answer;if (box) box.scrollTop = box.scrollHeight;if (result.usage) updateUsageBubble(result.usage, 'ok');else updateUsageBubble(null, answer.includes('失败') ? 'err' : 'ok');const usageText = result.usage ? (' · tokens ' + result.usage.totalTokens + ' · cost $' + Number(result.usage.estimatedCost || 0).toFixed(4)) : '';autoJournal('GPT AGENT', currentSymbol + ' · ' + question + usageText + ' · ' + answer);}, true);
}
enableAgentClient();