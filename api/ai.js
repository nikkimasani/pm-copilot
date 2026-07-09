// PM Copilot — server-side Anthropic proxy.
// Auth: 'x-access-code' header must match process.env.ACCESS_CODE.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS_CAP = 2048;
const DEFAULT_MAX_TOKENS = 1024;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return res.status(503).json({ error: 'AI proxy is not configured (ANTHROPIC_API_KEY missing)' });
  }

  const accessCode = process.env.ACCESS_CODE;
  if (!accessCode) {
    return res.status(503).json({ error: 'AI proxy is not configured (ACCESS_CODE missing)' });
  }

  const provided = req.headers['x-access-code'];
  if (!provided || provided !== accessCode) {
    return res.status(401).json({ error: 'Invalid or missing access code' });
  }

  const { model, max_tokens, messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const payload = {
    model: typeof model === 'string' && model ? model : DEFAULT_MODEL,
    max_tokens: Math.min(Number(max_tokens) || DEFAULT_MAX_TOKENS, MAX_TOKENS_CAP),
    messages,
  };
  if (system) payload.system = system;

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json().catch(() => ({ error: { message: 'Invalid response from Anthropic' } }));
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ error: 'Failed to reach Anthropic API' });
  }
}
