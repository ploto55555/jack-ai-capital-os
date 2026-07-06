export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { question, symbol, context } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question is required' });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        answer: 'GPT 还没有连接。请先在 Vercel 加 OPENAI_API_KEY。'
      });
    }

    const systemPrompt = `你是 Jack AI Capital OS 的阿不式交易智能体。
你只用中文回答。
你不是喊单机器人。
你不直接叫用户买或卖。
你不保证盈利。
你不自动下单。
你只做结构分析、风险检查、等待/拒绝/交易计划准备判断。

每次回答必须检查：行情类型、盈利核心、大周期方向、H4/H1 结构、M15/M5 客观小止损、R 空间、是否追价、风险是否合理。
最终判断只能是 WAIT / WATCH / REJECT / TRADE PLAN READY。
风格：直接、清楚、像交易助手，不要太长。`;

    const userPrompt = `当前品种：${symbol || '未选择'}\n当前系统资料：${JSON.stringify(context || {})}\n用户问题：${question}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 700
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data?.error?.message || '未知错误';
      return res.status(200).json({ answer: 'GPT API 连接失败：' + msg });
    }

    const answer = data?.choices?.[0]?.message?.content || 'GPT 没有返回内容。';
    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(200).json({ answer: '系统连接 GPT 时出错：' + String(error?.message || error) });
  }
}
