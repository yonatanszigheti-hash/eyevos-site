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
  const secret = process.env.CRON_SECRET;
  const given = (req.query && req.query.key) || (req.headers.authorization || "").replace("Bearer ", "");
  if (secret && given !== secret) return res.status(401).json({ error: "unauthorized" });
  const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY, GK = process.env.GEMINI_API_KEY;
  if (!SRK || !GK) return res.status(200).json({ error: "missing_env", service_key: !!SRK, gemini_key: !!GK });
  const H = { apikey: SRK, Authorization: "Bearer " + SRK, "Content-Type": "application/json" };
  const now = new Date().toISOString();
  const url =
    SUPA + "/rest/v1/polls?select=id,question&status=eq.open&type=eq.event&force_proof=eq.false" +
    "&subject=in.(sport,weather,screen,news)&closes_at=lte." + encodeURIComponent(now) + "&limit=25";
  let due = [];
  try { due = await (await fetch(url, { headers: H })).json(); } catch (e) { return res.status(200).json({ error: "fetch_due" }); }
  if (!Array.isArray(due)) return res.status(200).json({ error: "bad_due", due });
  const results = [];
  for (const p of due) {
    const verdict = await verify(p.question, GK);
    if (verdict === "yes" || verdict === "no") {
      let st = 0;
      try { st = (await fetch(SUPA + "/rest/v1/rpc/auto_resolve_poll", { method: "POST", headers: H, body: JSON.stringify({ p_poll: p.id, p_outcome: verdict }) })).status; } catch (e) {}
      results.push({ id: p.id, verdict, http: st });
    } else { results.push({ id: p.id, verdict: "unknown" }); }
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ checked: due.length, resolved: results.filter((r) => r.verdict !== "unknown").length, results });
}
