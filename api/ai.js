module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, search = false, tokens = 2000 } = req.body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const body = {
    model: "claude-sonnet-4-5",
    max_tokens: Math.max(tokens, 2000),
    messages: [{ role: "user", content: prompt }],
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };

  if (search) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    headers["anthropic-beta"] = "web-search-2025-03-05";
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.type === "error" || data.error) {
      const msg = data.error?.message || data.message || "Anthropic error";
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(response.status).json({ error: msg });
    }

    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("");

    if (!text) {
      console.error("Empty Anthropic response:", JSON.stringify(data).slice(0, 1500));
      return res.status(500).json({
        error: `Empty response (stop_reason: ${data.stop_reason || "unknown"}). Try regenerating.`,
      });
    }

    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
};
