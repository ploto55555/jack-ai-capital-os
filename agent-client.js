async function callAgent(question, symbol, context) {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, symbol, context })
  });
  const data = await response.json();
  return data.answer || 'No response.';
}

function enableAgentClient() {
  const form = document.getElementById('aiChatForm');
  const input = document.getElementById('aiChatInput');
  if (!form || !input) return;

  input.placeholder = '中文问 Jack AI...';

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    addChatMessage('user', question);
    input.value = '';
    addChatMessage('ai', '思考中...');

    const context = setups[currentSymbol] || {};
    const answer = await callAgent(question, currentSymbol, context);

    const box = document.getElementById('chatBox');
    const last = box ? box.querySelector('.msg.ai:last-child') : null;
    if (last) last.textContent = answer;
    autoJournal('GPT AGENT', currentSymbol + ' · ' + question + ' · ' + answer);
  });
}

enableAgentClient();
