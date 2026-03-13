export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  try {
    const { messages, max_tokens } = req.body;
 
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://lecnote-api.vercel.app',
        'X-Title': 'LecNote',
      },
      body: JSON.stringify({
        model: 'openrouter/free',  // 사용 가능한 무료 모델 중 자동 선택
        max_tokens: max_tokens || 1000,
        messages,
      }),
    });
 
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
 
    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
 
