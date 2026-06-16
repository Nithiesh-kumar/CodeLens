// In-memory rate limiting store (per deployment instance)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 AI requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment before trying again.' });
  }

  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ error: 'Missing systemPrompt or userPrompt in request body.' });
  }

  // Enforce payload size limits to prevent abuse
  const MAX_PROMPT_LENGTH = 60000; // ~50k code + system prompt overhead
  if (systemPrompt.length + userPrompt.length > MAX_PROMPT_LENGTH) {
    return res.status(413).json({ error: 'Payload too large. Code input must be under 50,000 characters.' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
  }

  const GEMINI_MODEL = "gemini-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Input:\n${userPrompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error?.message || "Failed to communicate with Gemini API" });
    }

    const data = await response.json();
    const textResult = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ result: textResult });
  } catch (error) {
    console.error("Serverless Function Gemini API Error:", error);
    return res.status(500).json({ error: "Internal server error connecting to AI service." });
  }
}
