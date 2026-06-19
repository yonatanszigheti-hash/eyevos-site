const SUPA = "https://nsnbdgudqtygxaalhjsn.supabase.co";

async function verify(question, key) {
  const prompt =
    "You verify real-world yes/no predictions using current web information. " +
    'Question: "' + question + '". Search the web for the actual outcome. ' +
    "Reply with ONLY ONE WORD: YES, NO, or UNKNOWN (UNKNOWN if future/unverifiable).";
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + key,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: [{ google_search: {} }], contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } }) }
    );
    const j = await r.json();
    let text = ""; try { text = j.candidates[0].content.parts.map((p) => p.text || "").join(" "); } catch (_) {}
    const up = text.toUpperCase();
    if (/\bYES\b/.test(up) && !/\bNO\b/.test(up)) return "yes";
    if (/\bNO\b/.test(up) && !/\bYES\b/.test(up)) return "no";
    return "unknown";
  } catch (e) { return "unknown"; }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const q = ((req.query && req.query.q) || "").toString().trim().slice(0, 300);
  if (!q) return res.status(200).json({ verdict: "unknown", reason: "empty" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(200).json({ verdict: "unknown", reason: "no_key" });
  const verdict = await verify(q, key);
  return res.status(200).json({ verdict });
}
