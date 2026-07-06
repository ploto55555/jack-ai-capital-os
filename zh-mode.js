function applyZhMode(){
  const top = document.querySelector('.topbar div');
  if(top) top.innerHTML = '<b>JACK AI CAPITAL OS</b> // 中文模式';
  const title = document.querySelector('.ai-chat-panel h3');
  if(title) title.textContent = '问 Jack AI';
  const first = document.querySelector('#chatBox .msg.ai');
  if(first) first.textContent = '中文模式已开启。你可以直接用中文问我，我会用中文回答。';
  const input = document.getElementById('aiChatInput');
  if(input) input.placeholder = '用中文问 AI...';
  const out = document.getElementById('workflowOutput');
  if(out) out.textContent = '中文模式已准备。';
}
applyZhMode();
