export const maxDuration = 30;

async function ask(model, useSearch, prompt, key) {
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 8000);
  try {
    const body = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } };
    if (useSearch) body.tools = [{ google_search: {} }];
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key),
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal }
    );
    const j = await r.json();
    let text = ""; try { text = j.candidates[0].content.parts.map((p) => p.text || "").join(" "); } catch (_) {}
    return { ok: r.status === 200 && !!text.trim(), status: r.status, text: text.trim().slice(0, 80), err: j && j.error ? String(j.error.message || "").slice(0, 160) : null, model, search: useSearch };
  } catch (e) { return { ok: false, err: String(e).slice(0, 160), model, search: useSearch }; }
  finally { clearTimeout(to); }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const q = ((req.query && req.query.q) || "").toString().trim().slice(0, 300);
  if (!q) return res.status(200).json({ verdict: "unknown", reason: "empty" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(200).json({ verdict: "unknown", reason: "no_key" });
  const prompt = 'Answer this real-world yes/no question with ONLY one word — YES, NO, or UNKNOWN. Question: "' + q + '"';
  const attempts = [["gemini-2.0-flash", true], ["gemini-2.0-flash", false], ["gemini-1.5-flash", false]];
  const debug = [];
  for (const [m, s] of attempts) {
    const a = await ask(m, s, prompt, key);
    debug.push(a);
    if (a.ok) {
      const up = a.text.toUpperCase();
      let v = "unknown";
      if (/\bYES\b/.test(up) && !/\bNO\b/.test(up)) v = "yes";
      else if (/\bNO\b/.test(up) && !/\bYES\b/.test(up)) v = "no";
      return res.status(200).json({ verdict: v, model: m, search: s, raw: a.text });
    }
  }
  return res.status(200).json({ verdict: "unknown", debug });
}
