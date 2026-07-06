async function callAgent(question, symbol, context) {
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, symbol, context })
    });
    const data = await response.json();
    return data.answer || '没有收到 AI 回答。';
  } catch (error) {
    return '连接 GPT Agent 失败。请检查 Vercel 部署和 OPENAI_API_KEY。';
  }
}

function fallbackChineseAnswer(question, symbol, context) {
  return symbol + ' 中文检查：\n' +
    '1. 当前判断：' + (context.decision || 'WAIT') + '\n' +
    '2. 风险：' + (context.risk || '-') + '\n' +
    '3. 警告：' + (context.warning || '-') + '\n' +
    '4. 结构：' + (context.core || '-') + '\n' +
    '5. 结论：先等清楚位置，不追价，有客观止损才准备交易计划。';
}

function improveChatReadability() {
  const style = document.createElement('style');
  style.textContent = `
    .ai-chat-panel{min-height:430px!important;}
    .chat-box{height:300px!important;max-height:300px!important;overflow-y:auto!important;padding:12px!important;}
    .chat-box .msg{font-size:14px!important;line-height:1.65!important;white-space:pre-wrap!important;letter-spacing:.01em!important;}
    .chat-box .msg.ai{padding:14px!important;border-radius:10px!important;}
    .chat-box .msg.user{font-size:13px!important;}
    .ai-chat-form input{font-size:14px!important;height:42px!important;}
    .ai-chat-form button{height:42px!important;}
    .journal-list{max-height:150px!important;overflow-y:auto!important;}
  `;
  document.head.appendChild(style);
}

function formatAgentAnswer(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function enableAgentClient() {
  improveChatReadability();

  const form = document.getElementById('aiChatForm');
  const input = document.getElementById('aiChatInput');
  if (!form || !input) return;

  input.placeholder = '中文问 Jack AI...';
  const title = document.querySelector('.ai-chat-panel h3');
  if (title) title.textContent = '问 Jack AI';
  const first = document.querySelector('#chatBox .msg.ai');
  if (first) first.textContent = '中文 GPT Agent 已接入。直接用中文问我。';

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const question = input.value.trim();
    if (!question) return;

    addChatMessage('user', question);
    input.value = '';
    addChatMessage('ai', '思考中...');

    const context = setups[currentSymbol] || {};
    let answer = await callAgent(question, currentSymbol, context);

    if (!answer || answer === 'No response.') {
      answer = fallbackChineseAnswer(question, currentSymbol, context);
    }

    answer = formatAgentAnswer(answer);

    const box = document.getElementById('chatBox');
    const messages = box ? box.querySelectorAll('.msg.ai') : [];
    const last = messages.length ? messages[messages.length - 1] : null;
    if (last) last.textContent = answer;
    if (box) box.scrollTop = box.scrollHeight;

    autoJournal('GPT AGENT', currentSymbol + ' · ' + question + ' · ' + answer);
  }, true);
}

enableAgentClient();