export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: req.method !== "GET" && req.body ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get("content-type");
    const data = await response.text();

    res.status(response.status);
    if (contentType?.includes("application/json")) {
      res.setHeader("Content-Type", "application/json");
    }
    res.send(data);

  } catch (err) {
    res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}