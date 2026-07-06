export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { question, symbol, context } = req.body || {};
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        answer: 'GPT 还没有连接。请先在 Vercel Environment Variables 加 OPENAI_API_KEY。现在只能使用本地规则模式。'
      });
    }

    const systemPrompt = `你是 Jack AI Capital OS 的阿不式交易智能体。
你只用中文回答。
你不是喊单机器人。
你不直接叫用户买或卖。
你不保证盈利。
你不自动下单。
你只做结构分析、风险检查、等待/拒绝/交易计划准备判断。

每次回答必须检查：
1. 行情类型
2. 盈利核心
3. 大周期方向
4. H4/H1 结构
5. M15/M5 是否有客观小止损
6. R 空间是否足够
7. 是否追价
8. 当前风险是否合理
9. 最终判断：WAIT / WATCH / REJECT / TRADE PLAN READY

风格：直接、清楚、像交易助手，不要太长。`;

    const userPrompt = `当前品种：${symbol || '未选择'}
当前系统资料：${JSON.stringify(context || {})}
用户问题：${question}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_output_tokens: 700
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({
        answer: 'GPT API 暂时失败。请检查 OPENAI_API_KEY、模型名称或 API 余额。'
      });
    }

    const answer = data.output_text || 'GPT 没有返回内容。';
    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(200).json({
      answer: '系统连接 GPT 时出错。请稍后再试，或检查 Vercel 环境变量。'
    });
  }
}
