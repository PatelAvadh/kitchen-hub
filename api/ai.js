module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, search = false, tokens = 2000 } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: Math.max(tokens, 4000),
      temperature: 0.7,
    },
  };

  if (search) {
    body.tools = [{ googleSearch: {} }];
  } else {
    body.generationConfig.responseMimeType = "application/json";
  }

  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.error) {
      console.error("Gemini error:", JSON.stringify(data.error));
      return res.status(response.status).json({
        error: data.error.message || "Gemini error",
        details: data.error,
      });
    }

    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts || [])
      .map(p => p.text)
      .filter(Boolean)
      .join("");

    if (!text) {
      console.error("Empty Gemini response:", JSON.stringify(data).slice(0, 1500));
      return res.status(500).json({
        error: `Empty response from Gemini (finishReason: ${candidate?.finishReason || "unknown"}). ${candidate?.finishReason === "SAFETY" ? "Blocked by safety filter." : candidate?.finishReason === "MAX_TOKENS" ? "Hit token limit — try regenerating." : "Try regenerating."}`,
        raw: data,
      });
    }

    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
};
