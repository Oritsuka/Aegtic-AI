export default async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://your-project.vercel.app' // เปลี่ยนเป็นโดเมนจริงของคุณ
  ];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: 'POST',
      received: req.method
    });
  }

  try {
    const AI_API_URL =
      process.env.AI_API_URL ;

    const AI_API_KEY =
      process.env.AI_API_KEY ;
 
    const AI_MODEL =
      process.env.AI_MODEL || 'llama-3.1-8b-instant';

    if (!AI_API_KEY) {
      return res.status(500).json({
        error: 'AI_API_KEY missing in environment variables'
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error:
          'body ต้องเป็น JSON: { "messages": [ { "role":"user", "content":"..." } ] }'
      });
    }

    const payload = {
      model: AI_MODEL,
      messages,
      temperature: 0.7
    };

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: 'AI API Error',
        details: errText
      });
    }

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content ||
      data?.output_text ||
      data?.candidates?.[0]?.content?.[0]?.text ||
      '';

    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
}
