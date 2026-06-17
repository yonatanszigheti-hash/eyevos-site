function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef
} = React;

/* ============================================================
   Eyevos v4 — social prediction game. Points only, never money.
   All ages (10-90), same 7 subjects for everyone (no gating).
   Google sign-in · monthly seasons (points reset) · streak
   bonuses (3->+4, 5->+5) · pick exact close date+time ·
   smart resolution (auto-verify vs photo proof) · create/join/
   invite groups (WhatsApp) · staged ranks (subject->group->board)
   · per-subject scores · 10 languages, RTL-aware.
   ============================================================ */

/* ---------- inline icons (lucide path data, ISC) ---------- */
const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  arrowleft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  hourglass: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  medal: '<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  tv: '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  newspaper: '<path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13a1 1 0 0 0 1 1h17a2 2 0 0 0 2-2z"/><path d="M10 6h8v4h-8z"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  mute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>'
};
function Icon({
  name,
  size = 18,
  color = "currentColor",
  style,
  cls
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: cls,
    style: {
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: ICONS[name] || ""
    }
  });
}
function GoogleG({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFC107",
    d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FF3D00",
    d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#4CAF50",
    d: "M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2 1.5-4.7 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1976D2",
    d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C41.4 36.3 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"
  }));
}

/* ---------- 7 subjects (researched: span ages 10-90, no gating) ---------- */
const SUBJECTS = {
  sport: {
    c: "#FF8A4D",
    icon: "trophy",
    verifiable: true
  },
  weather: {
    c: "#5BC8FF",
    icon: "cloud",
    verifiable: true
  },
  screen: {
    c: "#FF4D9D",
    icon: "tv",
    verifiable: true
  },
  news: {
    c: "#FFC23C",
    icon: "newspaper",
    verifiable: true
  },
  family: {
    c: "#36D69B",
    icon: "heart",
    verifiable: false
  },
  food: {
    c: "#A78BFF",
    icon: "utensils",
    verifiable: false
  },
  life: {
    c: "#8A6BFF",
    icon: "sparkles",
    verifiable: false
  }
};
const SUBJECT_KEYS = ["sport", "weather", "screen", "news", "family", "food", "life"];
const visibleSubjects = () => SUBJECT_KEYS; // same subjects for everyone

const SUBJECT_KW = {
  sport: ["מכבי", "הפועל", "משחק", "גול", "אליפ", "אלופ", "כדורגל", "כדורסל", "ניצח", "קבוצת", "ליגה", "שחקן", "אימון", "טורניר", "אולימפ", "מדל", "goal", "league", "match", "nba"],
  weather: ["מזג אוויר", "גשם", "שלג", "מעלות", "חום", "קר", "סופה", "שרב", "ברד", "טמפרטור", "מעונן", "rain", "snow", "degrees", "storm", "weather", "heat"],
  screen: ["סדרה", "סרט", "זמר", "שיר", "אירוויזיון", "הופע", "אלבום", "ריאליטי", "הכוכב הבא", "האח הגדול", "נטפליקס", "עונה", "פרק", "אוסקר", "קליפ", "movie", "series", "song", "eurovision", "netflix", "season", "episode"],
  news: ["חדשות", "כותרת", "ראש הממשל", "ראש העיר", "בחירות", "אסון", "הסכם", "מלחמה", "שביתה", "פיגוע", "ועדה", "הכרזה", "headline", "news", "election", "strike"],
  family: ["אמא", "אבא", "הור", "אחות", "סבא", "סבת", "משפח", "דוד ", "דודה", "תינוק", "חתונה", "בר מצווה", "שש בש", "mom", "dad", "parents", "family", "grandma", "grandpa", "wedding"],
  food: ["אוכל", "עוגה", "מתכון", "מסעד", "פיצה", "בישול", "ארוחה", "טעים", "מלוח", "שף", "המבורגר", "קינוח", "cake", "recipe", "restaurant", "pizza", "dinner", "chef"],
  life: []
};
function detectSubject(q) {
  const t = (q || "").toLowerCase();
  let best = null,
    bestN = 0;
  for (const k of SUBJECT_KEYS) {
    if (k === "life") continue;
    let n = 0;
    for (const w of SUBJECT_KW[k]) if (t.includes(w.toLowerCase())) n++;
    if (n > bestN) {
      bestN = n;
      best = k;
    }
  }
  return bestN > 0 ? best : null;
}
// light content filter (the real one lives server-side; this is the front-line guard)
const BANNED = ["מכוער", "מכוערת", "שמן", "שמנה", "טמבל", "מפגר", "מפגרת", "זונה", "שרמוטה", "להתאבד", "שתמות", "תמות", "kill", "kys", "slut", "whore", "retard", "retarded", "ugly", "idiot", "loser"];
function containsBanned(t) {
  t = (t || "").toLowerCase();
  return BANNED.some(w => t.indexOf(w.toLowerCase()) >= 0);
}

/* ---------- resolution method (auto-verify vs photo proof vs group) ---------- */
function resolveMethod(poll) {
  if (poll.forceProof) return "proof";
  if (poll.type === "person") return poll.personal ? "proof" : "group";
  return SUBJECTS[poll.subject] && SUBJECTS[poll.subject].verifiable ? "auto" : "proof";
}

/* ---------- scoring ---------- */
const BASE = 5,
  MINORITY_BONUS = 3,
  BONUS_MIN_VOTERS = 6,
  BONUS_MIN_PER_SIDE = 2;
const STREAK3 = 4,
  STREAK5 = 5;
// correct=5; correct & minority(<50%, gated)=+3; person polls get no minority bonus.
// streak: hitting 3-in-a-row=+4, 5-in-a-row=+5 (only those two milestones).
function payout(poll, streakBefore) {
  const total = poll.yes + poll.no;
  const won = poll.result;
  const winShare = total ? (won === "yes" ? poll.yes : poll.no) / total : 0;
  const myWin = poll.mine === won;
  const minority = winShare < 0.5;
  const gateOK = total >= BONUS_MIN_VOTERS && Math.min(poll.yes, poll.no) >= BONUS_MIN_PER_SIDE;
  const conf = poll.mineConf || 1; // 1 = safe, 2 = sure, 3 = ALL IN
  const base = BASE * conf; // bigger conviction = bigger base win
  const bonus = myWin && minority && poll.type !== "person" && gateOK ? MINORITY_BONUS : 0;
  const streakAfter = myWin ? (streakBefore || 0) + 1 : 0;
  const streakBonus = myWin ? streakAfter === 3 ? STREAK3 : streakAfter === 5 ? STREAK5 : 0 : 0;
  const cost = myWin ? 0 : (conf - 1) * 2; // wrong ALL-IN stings (-4), but floored at 0 elsewhere
  return {
    won,
    winShare,
    myWin,
    minority,
    bonus,
    base,
    conf,
    cost,
    streakAfter,
    streakBonus,
    earned: myWin ? base + bonus + streakBonus : 0,
    agreePct: Math.round(winShare * 100)
  };
}

/* ---------- deadlines & per-group seasons ---------- */
function defaultDeadline() {
  const d = new Date(Date.now() + 86400000);
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function fmtDeadline(s) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d)) return s;
  const p = n => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} · ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ---------- members & per-subject scores ---------- */
const HUES = {
  "עדי": "#FF8A4D",
  "מאיה": "#FF4D6D",
  "דניאל": "#5BA8FF",
  "נועם": "#36D69B",
  "ליאור": "#FFC23C",
  "יונתן": "#2DD4BF",
  "רוני": "#FF6B6B",
  "טל": "#A78BFF",
  "סבתא רותי": "#36D69B"
};
const sumScores = s => SUBJECT_KEYS.reduce((a, k) => a + (s[k] || 0), 0);
const z = (sport, weather, screen, news, family, food, life) => ({
  sport,
  weather,
  screen,
  news,
  family,
  food,
  life
});
const SEED_MEMBERS = [{
  name: "עדי",
  color: HUES["עדי"],
  acc: 78,
  streak: 6,
  g: ["squad"],
  s: z(120, 30, 50, 40, 50, 60, 60)
}, {
  name: "מאיה",
  color: HUES["מאיה"],
  acc: 69,
  streak: 2,
  g: ["squad", "class", "fam"],
  s: z(45, 25, 70, 60, 40, 40, 25)
}, {
  name: "סבתא רותי",
  color: HUES["סבתא רותי"],
  acc: 74,
  streak: 3,
  g: ["fam"],
  s: z(20, 35, 40, 50, 90, 55, 10)
}, {
  name: "דניאל",
  color: HUES["דניאל"],
  acc: 64,
  streak: 0,
  g: ["squad"],
  s: z(55, 20, 30, 25, 25, 20, 15)
}, {
  name: "נועם",
  color: HUES["נועם"],
  acc: 58,
  streak: 1,
  g: ["squad", "class"],
  s: z(40, 15, 20, 10, 15, 10, 10)
}, {
  name: "ליאור",
  color: HUES["ליאור"],
  acc: 55,
  streak: 0,
  g: ["squad"],
  s: z(25, 10, 15, 10, 15, 10, 10)
}, {
  name: "טל",
  color: HUES["טל"],
  acc: 66,
  streak: 2,
  g: ["class"],
  s: z(30, 15, 40, 20, 20, 30, 20)
}, {
  name: "רוני",
  color: HUES["רוני"],
  acc: 61,
  streak: 1,
  g: ["class", "fam"],
  s: z(35, 20, 25, 30, 35, 30, 25)
}];
const ME_SEED = {
  name: "אתה",
  color: "#8A6BFF",
  photo: null,
  me: true,
  acc: 71,
  streak: 4,
  g: ["squad", "class", "fam"],
  s: z(60, 20, 35, 25, 30, 30, 40)
}; // total 240

// each group runs its OWN 30-day season; seasonLeft counts down daily to 0, then resets to 30.
const SEASON_DAYS = 30;
const INIT_GROUPS = [{
  id: "squad",
  name: "החבר'ה",
  code: "K7M2QX",
  count: 12,
  photo: null,
  seasonLeft: 23
}, {
  id: "class",
  name: "כיתה ט'2",
  code: "B9PLRT",
  count: 31,
  photo: null,
  seasonLeft: 12
}, {
  id: "fam",
  name: "משפחה",
  code: "H4XW8N",
  count: 9,
  photo: null,
  seasonLeft: 28
}];

/* ---------- seed polls (subjects: sport/weather/screen/news/family/food/life) ---------- */
const SEED = [{
  id: 1,
  group: "squad",
  subject: "sport",
  type: "event",
  q: "מכבי תנצח את הפועל בשבת?",
  by: "עדי",
  yes: 13,
  no: 7,
  mine: null,
  ends: "ראשון · 18:30",
  status: "live"
}, {
  id: 2,
  group: "squad",
  subject: "news",
  type: "event",
  q: "ראש הממשלה יכריז על בחירות מוקדמות?",
  by: "מאיה",
  yes: 5,
  no: 18,
  mine: null,
  ends: "מחר",
  status: "live"
}, {
  id: 3,
  group: "squad",
  subject: "screen",
  type: "event",
  q: "ישראל תעלה לגמר האירוויזיון?",
  by: "ליאור",
  yes: 21,
  no: 6,
  mine: null,
  ends: "שבת · 22:00",
  status: "live"
}, {
  id: 4,
  group: "squad",
  subject: "weather",
  type: "event",
  q: "יהיו 40 מעלות בשבוע הבא?",
  by: "דניאל",
  yes: 14,
  no: 9,
  mine: "no",
  ends: "שבוע",
  status: "live"
}, {
  id: 5,
  group: "squad",
  subject: "family",
  type: "event",
  q: "אמא תאשר את הטיול בלי הורים?",
  by: "אתה",
  yes: 8,
  no: 9,
  mine: "yes",
  ends: "חמישי",
  status: "live"
}, {
  id: 6,
  group: "squad",
  subject: "sport",
  type: "person",
  personal: false,
  q: "יונתן יקלע 20+ נקודות הערב?",
  by: "מאיה",
  tagged: "יונתן",
  yes: 9,
  no: 14,
  mine: null,
  ends: "היום · 21:00",
  status: "live"
}, {
  id: 7,
  group: "squad",
  subject: "sport",
  type: "person",
  personal: false,
  q: "נועם ייכנס לחמישייה הפותחת השבוע?",
  by: "עדי",
  tagged: "נועם",
  yes: 0,
  no: 0,
  mine: null,
  ends: "שישי",
  status: "pending"
}, {
  id: 8,
  group: "squad",
  subject: "weather",
  type: "event",
  q: "יירד שלג בעיר החורף?",
  by: "דניאל",
  yes: 11,
  no: 9,
  mine: "yes",
  ends: "נסגר",
  status: "locked"
}, {
  id: 9,
  group: "squad",
  subject: "food",
  type: "event",
  q: "העוגה של אמא תצא מושלמת בשישי?",
  by: "מאיה",
  yes: 6,
  no: 17,
  mine: "yes",
  ends: "נסגר",
  status: "resolved",
  result: "yes",
  forceProof: true
}, {
  id: 10,
  group: "class",
  subject: "screen",
  type: "event",
  q: "העונה החדשה תצא החודש?",
  by: "טל",
  yes: 22,
  no: 9,
  mine: null,
  ends: "מחר",
  status: "live"
}, {
  id: 11,
  group: "class",
  subject: "life",
  type: "event",
  q: "הטיול השנתי ייצא לים?",
  by: "רוני",
  yes: 19,
  no: 14,
  mine: null,
  ends: "3 ימים",
  status: "live"
}, {
  id: 12,
  group: "fam",
  subject: "family",
  type: "event",
  q: "סבתא תכין קובה בשישי?",
  by: "סבתא רותי",
  yes: 16,
  no: 2,
  mine: "yes",
  ends: "שישי",
  status: "live",
  forceProof: true
}, {
  id: 13,
  group: "squad",
  subject: "screen",
  type: "event",
  q: "הסדרה תסתיים בקליפהנגר?",
  by: "ליאור",
  yes: 7,
  no: 13,
  mine: null,
  ends: "נסגר",
  status: "locked"
},
// a consent request addressed to YOU (so the consent flow is visible to the target only)
{
  id: 14,
  group: "squad",
  subject: "sport",
  type: "person",
  personal: false,
  q: "אתה תסיים את המשחק במקום הראשון?",
  by: "מאיה",
  tagged: "אתה",
  yes: 0,
  no: 0,
  mine: null,
  ends: "שבת",
  status: "pending"
}];
const pct = (a, b) => a + b === 0 ? 50 : Math.round(a / (a + b) * 100);
const initials = n => (n || "?").slice(0, 2).toUpperCase();
const levelOf = total => Math.floor(total / 50) + 1;
const levelFloor = lvl => (lvl - 1) * 50;

/* ---------- i18n ---------- */
const LANGS = [{
  code: "he",
  label: "עברית",
  flag: "🇮🇱",
  dir: "rtl"
}, {
  code: "en",
  label: "English",
  flag: "🇬🇧",
  dir: "ltr"
}, {
  code: "es",
  label: "Español",
  flag: "🇪🇸",
  dir: "ltr"
}, {
  code: "ar",
  label: "العربية",
  flag: "🇸🇦",
  dir: "rtl"
}, {
  code: "hi",
  label: "हिन्दी",
  flag: "🇮🇳",
  dir: "ltr"
}, {
  code: "pt",
  label: "Português",
  flag: "🇧🇷",
  dir: "ltr"
}, {
  code: "ru",
  label: "Русский",
  flag: "🇷🇺",
  dir: "ltr"
}, {
  code: "fr",
  label: "Français",
  flag: "🇫🇷",
  dir: "ltr"
}, {
  code: "de",
  label: "Deutsch",
  flag: "🇩🇪",
  dir: "ltr"
}, {
  code: "zh",
  label: "中文",
  flag: "🇨🇳",
  dir: "ltr"
}];
const STR = {
  en: {
    tagline: "The social prediction game. Points only, never money.",
    continueGoogle: "Continue with Google",
    signInPriv: "No money, no DMs. For all ages.",
    group: "Group",
    headline1: "Call it before",
    headline2: "everyone else does.",
    boardHeadline: "Who's on top of the arena?",
    feed: "Feed",
    ranks: "Ranks",
    createNav: "New",
    rules: "Rules",
    you: "You",
    all: "All",
    sport: "Sport",
    weather: "Weather",
    screen: "Screen & Stage",
    news: "News",
    family: "Family",
    food: "Food",
    life: "Life",
    emptyT: "Nothing here yet",
    emptyS: "Be the first to call something.",
    tapCall: "Place your bet — pick a side",
    yes: "YES",
    no: "NO",
    votes: n => `${n} bets`,
    minorityYou: "You're the brave minority",
    crowd: "You're with the crowd",
    lockedIn: "Locked in",
    live: "LIVE",
    resolvedTag: "Resolved",
    awaiting: "Awaiting consent",
    lockedTag: "Closed",
    hot: "HOT",
    autoTag: "Auto-verified",
    proofTag: "Photo",
    asked: n => `${n} asked`,
    hiddenUntil: t => `Hidden until @${t} approves`,
    reviewAs: t => `Review as @${t}`,
    resolveBtn: "Resolve",
    seeResult: "See result",
    targetCantVote: "You can't vote — it's about you",
    voteToReveal: "Bet to reveal the odds",
    inVotes: n => `${n} bets in`,
    report: "Report",
    reported: "Reported — sent for review.",
    reportUnkind: "This feels unkind — report",
    voidBtn: "Can't tell / void it",
    voidedTag: "Void",
    voidedToast: "Voided — 0 points, streaks kept.",
    cantResolveStaked: "You voted here — only members with no stake can resolve.",
    onlyAuthorResolves: by => `Only @${by}, who posted it, can answer this`,
    resolvedByAuto: "Resolved automatically",
    resolvedByGroup: "Resolved by the group",
    shareBtn: "Share the win",
    shareCopied: "Copied! Paste it anywhere.",
    shareText: (q, side, earned) => `I called it on Eyevos 🎯 "${q}" → ${side}${earned ? ` (+${earned})` : ""}. Points only, never money. Join my group:`,
    emptyBoard: "No members in this group yet.",
    emptyBoardSub: "Invite friends with the group code.",
    createT: "What are we calling?",
    createS: "Pick the kind of question.",
    cancel: "Cancel",
    back: "Back",
    pickGroup: "Which group?",
    eventT: "About an event",
    eventD: "A game, the weather, a show, news — verifiable.",
    personT: "About someone",
    personD: "Tag a friend — they approve before it goes live.",
    safeNote: "Questions about a person stay hidden until they say yes. Only fair calls — never to put someone down.",
    personalOrGeneral: "Is this personal or general?",
    personalT: "Personal",
    personalD: "A private matter — needs approval + a photo proof.",
    generalT: "General",
    generalD: "Something the group can observe — the group decides.",
    whoAbout: "Who's it about?",
    writeQ: "Write the question",
    onlyMembers: "Only members of this group can be tagged.",
    phPerson: t => `Will ${t || "they"} make it this week?`,
    phEvent: "Will it rain on Saturday's trip?",
    subjectLabel: "Subject",
    deadlineLabel: "When does voting close?",
    mismatch: s => `This looks like ${s}. Pick a matching subject.`,
    methodAuto: "Eyevos will verify the result automatically from public sources.",
    methodGroup: "The group decides what happened.",
    methodProof: "A photo proof will be required at resolution.",
    notOnline: "Can't be found online — require a photo",
    sendApprove: t => t ? `Send to @${t} for approval` : "Pick a friend & write a question",
    consentT: "A question about you",
    consentS: by => `${by} wants to open this to the group. Hidden unless you approve.`,
    approve: "Approve — open voting",
    decline: "Decline & delete",
    resolveT: "What actually happened?",
    resolveProofBtn: "Attach proof photo",
    proofNeeded: "A proof photo is required for this one.",
    confirm: "Confirm result",
    verifyingTitle: "Eyevos is checking the result",
    verifyingNote: "(demo — a real results API plugs in here)",
    itWas: s => `It was ${s === "yes" ? "YES" : "NO"}`,
    yourPick: "Your pick",
    actualWas: "What happened",
    correctCall: "Correct call",
    minorityBonus: "Minority bonus",
    streakBonusL: "Streak bonus",
    earned: "You won",
    braveLine: "You bet against the crowd — and nailed it. Minority bonus!",
    streakLine: n => `${n} in a row! 🔥 You're on fire.`,
    nice: "Let's go! 🎉",
    winBang: "YOU WON! 🎉",
    postCall: "Place the bet 🎰",
    howSure: "How sure?",
    conf1: "Safe",
    conf2: "Sure",
    conf3: "ALL IN",
    stakeL: "Stake",
    convLine: c => c === 3 ? "🔥 ALL IN — triple base!" : c === 2 ? "Sure bet — double base" : "Safe bet",
    lostBang: "Not this time",
    costRow: "All-in sting",
    dailyT: "Daily bonus! 🎁",
    dailyS: n => `Welcome back — here's +${n} on the house.`,
    dailyClaim: "Claim it",
    points: "Points",
    rankL: "Rank",
    accuracy: "Accuracy",
    streak: "Streak",
    level: "Level",
    toNext: n => `${n} pts to level up`,
    levelHelp: "every 50 pts = a level",
    totalPts: "Total points",
    perSubject: "Points by subject",
    profileSub: lvl => `Level ${lvl} · all ages welcome`,
    editProfile: "Edit profile",
    nameL: "Name",
    photoL: "Photo",
    save: "Save",
    signOut: "Sign out",
    choosePhoto: "Choose from gallery",
    recent: "Recent calls",
    me: "You",
    pointsOnly: "Points only · never real money · all ages",
    rankPickSubject: "1 · Pick a subject",
    rankPickGroup: "2 · Pick your group",
    rankBoard: "3 · The board",
    seasonLeft: n => `Season resets in ${n} days`,
    seasonRule: "Each group runs its own 30-day season — then points reset to 0.",
    potd: "Prediction of the day",
    reactions: "Reactions",
    rulesT: "Rules",
    rulesScoreT: "Scoring",
    rulesAllowedT: "Allowed",
    rulesForbiddenT: "Not allowed",
    rulesScore: [["Correct call", "+5"], ["Correct & you were the minority (≤49%)", "+3"], ["3 correct in a row", "+4"], ["5 correct in a row", "+5"], ["Wrong", "0 — never below zero"], ["Each group: a 30-day season, then points reset", "↻"], ["Each subject keeps its own score & rank", "★"]],
    rulesAllowed: ["Verifiable events (game, weather, show, news) — Eyevos checks them automatically", "Private outcomes — confirmed with a photo proof + the group", "Person questions — only with that person's approval", "Up to 40 members per group · you pick the exact closing date & time"],
    rulesForbidden: ["Anything degrading, slurs, body-shaming", "A subject that doesn't match the text (sport ≠ food)", "Voting on a poll that is about you", "Resolving a poll you voted on", "Real money — there is none, ever"],
    langT: "Language",
    membersOf: n => `${n}/40`,
    createGroup: "Create a group",
    joinGroup: "Join with a code",
    groupName: "Group name",
    inviteWa: "Invite on WhatsApp",
    enterCode: "Invite code",
    createBtn: "Create",
    joinBtn: "Join",
    inviteText: (name, code, url) => `Join my group "${name}" on Eyevos! Code: ${code}. ${url}`,
    groupCreated: "Group created! Share the code.",
    joinedGroup: "Joined the group!",
    badCode: "No group with that code.",
    voteClosed: "Voting closed.",
    already: "You already called this.",
    declined: "Question deleted.",
    approved: "Approved — voting is open.",
    created: "Your call is posted!",
    sent: "Sent for approval.",
    needLong: "Write a slightly longer question.",
    needDeadline: "Pick a closing date & time.",
    savedProfile: "Profile saved.",
    needFuture: "Pick a closing time in the future.",
    blocked: "That question was blocked — keep it fair.",
    pickSubjectStep: "1 · Pick a subject",
    pickGroupStep: "2 · Which group?",
    writeStep: "3 · Write the call",
    noNotifs: "No new requests.",
    awaitingApproval: t => `Waiting for @${t} to approve`,
    shareGroupT: "Group created! 🎉",
    shareGroupS: "Invite your people to start playing.",
    copyLink: "Copy invite link",
    doneBtn: "Done",
    noGroups: "You're not in any group yet — create one first.",
    resolvedToast: "Resolved — points paid out.",
    proofMissing: "Attach a proof photo first.",
    pickOutcome: "Pick what happened first.",
    cantVoteSelf: "You can't vote on a poll about you."
  },
  he: {
    tagline: "משחק הניחושים החברתי. נקודות בלבד, אף פעם לא כסף.",
    continueGoogle: "המשך עם Google",
    signInPriv: "בלי כסף, בלי הודעות פרטיות. לכל הגילאים.",
    group: "קבוצה",
    headline1: "תנחש את זה",
    headline2: "לפני כל השאר.",
    boardHeadline: "מי המלך של הזירה?",
    feed: "פיד",
    ranks: "דירוג",
    createNav: "חדש",
    rules: "חוקים",
    you: "אני",
    all: "הכל",
    sport: "ספורט",
    weather: "מזג אוויר",
    screen: "מסך ובמה",
    news: "חדשות",
    family: "משפחה",
    food: "אוכל",
    life: "חיים",
    emptyT: "עדיין אין כאן כלום",
    emptyS: "היה הראשון לנחש משהו.",
    tapCall: "שים הימור — בחר צד",
    yes: "כן",
    no: "לא",
    votes: n => `${n} הימרו`,
    minorityYou: "אתה במיעוט האמיץ",
    crowd: "אתה עם הרוב",
    lockedIn: "ננעל",
    live: "חי",
    resolvedTag: "הוכרע",
    awaiting: "ממתין לאישור",
    lockedTag: "נסגר",
    hot: "חם",
    autoTag: "אימות אוטומטי",
    proofTag: "תמונה",
    asked: n => `${n} שאל/ה`,
    hiddenUntil: t => `מוסתר עד ש־@${t} מאשר/ת`,
    reviewAs: t => `בדוק בתור @${t}`,
    resolveBtn: "הכרע",
    seeResult: "ראה תוצאה",
    targetCantVote: "אי אפשר להצביע — השאלה עליך",
    voteToReveal: "הַמֵּר כדי לחשוף את הסיכויים",
    inVotes: n => `${n} כבר הימרו`,
    report: "דווח",
    reported: "דווח — יישלח לבדיקה.",
    reportUnkind: "זה לא הוגן — דווח",
    voidBtn: "אי אפשר להכריע / בטל",
    voidedTag: "בוטל",
    voidedToast: "בוטל — אפס נקודות, הרצף נשמר.",
    cantResolveStaked: "הצבעת כאן — רק מי שאין לו ניקוד בניחוש יכול להכריע.",
    onlyAuthorResolves: by => `רק @${by}, שפתח את השאלה, יכול לענות`,
    resolvedByAuto: "הוכרע אוטומטית",
    resolvedByGroup: "הוכרע ע\"י הקבוצה",
    shareBtn: "שתף את הניצחון",
    shareCopied: "הועתק! אפשר להדביק בכל מקום.",
    shareText: (q, side, earned) => `ניחשתי נכון ב־Eyevos 🎯 "${q}" ← ${side}${earned ? ` (+${earned})` : ""}. נקודות בלבד, אף פעם לא כסף. בוא לקבוצה שלי:`,
    emptyBoard: "אין עדיין חברים בקבוצה הזו.",
    emptyBoardSub: "הזמן חברים עם קוד הקבוצה.",
    createT: "על מה אנחנו מנחשים?",
    createS: "בחר את סוג השאלה.",
    cancel: "ביטול",
    back: "חזרה",
    pickGroup: "לאיזו קבוצה?",
    eventT: "על אירוע",
    eventD: "משחק, מזג אוויר, תוכנית, חדשות — כל דבר שאפשר לאמת.",
    personT: "על מישהו",
    personD: "תייג חבר — הוא מאשר לפני שזה עולה.",
    safeNote: "שאלות על אדם נשארות מוסתרות עד שהוא מאשר. רק ניחושים הוגנים — אף פעם לא משהו שנועד להשפיל.",
    personalOrGeneral: "זה אישי או כללי?",
    personalT: "אישי",
    personalD: "עניין פרטי — צריך אישור + תמונת הוכחה.",
    generalT: "כללי",
    generalD: "משהו שהקבוצה יכולה לראות — הקבוצה מכריעה.",
    whoAbout: "על מי מדובר?",
    writeQ: "כתוב את השאלה",
    onlyMembers: "רק חברים בקבוצה הזו ניתנים לתיוג.",
    phPerson: t => `${t || "הוא/היא"} יעשה/תעשה את זה השבוע?`,
    phEvent: "ירד גשם בטיול בשבת?",
    subjectLabel: "נושא",
    deadlineLabel: "מתי ההצבעה נסגרת?",
    mismatch: s => `נראה שזה שייך ל${s}. בחר נושא מתאים.`,
    methodAuto: "Eyevos יאמת את התוצאה אוטומטית ממקורות פומביים.",
    methodGroup: "הקבוצה מכריעה מה קרה.",
    methodProof: "בעת ההכרעה תידרש תמונת הוכחה.",
    notOnline: "אי אפשר למצוא את זה ברשת — דרוש תמונה",
    sendApprove: t => t ? `שלח ל־@${t} לאישור` : "בחר חבר וכתוב שאלה",
    consentT: "שאלה עליך",
    consentS: by => `${by} רוצה לפתוח את זה לקבוצה. מוסתר אלא אם תאשר.`,
    approve: "אשר — פתח הצבעה",
    decline: "דחה ומחק",
    resolveT: "מה קרה באמת?",
    resolveProofBtn: "צרף תמונת הוכחה",
    proofNeeded: "לניחוש הזה צריך תמונת הוכחה.",
    confirm: "אשר תוצאה",
    verifyingTitle: "Eyevos בודק את התוצאה",
    verifyingNote: "(דמו — כאן מתחבר API תוצאות אמיתי)",
    itWas: s => `התשובה: ${s === "yes" ? "כן" : "לא"}`,
    yourPick: "הניחוש שלך",
    actualWas: "מה שקרה באמת",
    correctCall: "ניחוש נכון",
    minorityBonus: "בונוס מיעוט",
    streakBonusL: "בונוס רצף",
    earned: "נכנס לקופה",
    braveLine: "הימרת נגד הזרם — וקלעת בול! בונוס מיעוט.",
    streakLine: n => `${n} ברצף! 🔥 אתה בוער.`,
    nice: "יאללה! 🎉",
    winBang: "קלעת בול! 🎉",
    postCall: "שים את ההימור 🎰",
    howSure: "כמה בטוח?",
    conf1: "רגיל",
    conf2: "בטוח",
    conf3: "בכל הקופה",
    stakeL: "סיכון",
    convLine: c => c === 3 ? "🔥 בכל הקופה — פי 3 על הבסיס!" : c === 2 ? "הימור בטוח — בסיס כפול" : "הימור בטוח",
    lostBang: "לא הפעם",
    costRow: "מחיר ה'בכל הקופה'",
    dailyT: "בונוס יומי! 🎁",
    dailyS: n => `טוב לראות אותך — קח +${n} על חשבון הבית.`,
    dailyClaim: "קח את זה",
    points: "נקודות",
    rankL: "דירוג",
    accuracy: "דיוק",
    streak: "רצף",
    level: "רמה",
    toNext: n => `עוד ${n} נק' לרמה הבאה`,
    levelHelp: "כל 50 נק' = רמה",
    totalPts: "סך הנקודות",
    perSubject: "ניקוד לפי נושא",
    profileSub: lvl => `רמה ${lvl} · לכל הגילאים`,
    editProfile: "ערוך פרופיל",
    nameL: "שם",
    photoL: "תמונה",
    save: "שמור",
    signOut: "התנתק",
    choosePhoto: "בחר מהגלריה",
    recent: "ניחושים אחרונים",
    me: "אתה",
    pointsOnly: "נקודות בלבד · אף פעם לא כסף · לכל הגילאים",
    rankPickSubject: "1 · בחר נושא",
    rankPickGroup: "2 · בחר קבוצה",
    rankBoard: "3 · הדירוג",
    seasonLeft: n => `העונה מתאפסת בעוד ${n} ימים`,
    seasonRule: "לכל קבוצה עונה משלה של 30 ימים — בסוף הנקודות מתאפסות ל־0.",
    potd: "ניחוש היום",
    reactions: "תגובות",
    rulesT: "חוקים",
    rulesScoreT: "ניקוד",
    rulesAllowedT: "מה מותר",
    rulesForbiddenT: "מה אסור",
    rulesScore: [["ניחוש נכון", "+5"], ["נכון ואתה היית במיעוט (49% ומטה)", "+3"], ["3 נכונים ברצף", "+4"], ["5 נכונים ברצף", "+5"], ["טעות", "0 — אף פעם לא מתחת לאפס"], ["לכל קבוצה עונה של 30 יום, ואז הנקודות מתאפסות", "↻"], ["לכל נושא ניקוד ודירוג משלו", "★"]],
    rulesAllowed: ["אירועים שאפשר לאמת (משחק, מזג אוויר, תוכנית, חדשות) — Eyevos בודק אוטומטית", "תוצאות פרטיות — מאשרים עם תמונת הוכחה + הקבוצה", "שאלות על אדם — רק באישור אותו אדם", "עד 40 חברים בקבוצה · אתם בוחרים תאריך ושעת סגירה מדויקים"],
    rulesForbidden: ["כל דבר משפיל, קללות, ביוש גוף", "נושא שלא תואם את התוכן (ספורט ≠ אוכל)", "הצבעה על ניחוש שהוא עליך", "הכרעת ניחוש שהצבעת בו", "כסף אמיתי — אין כזה, אף פעם"],
    langT: "שפה",
    membersOf: n => `${n}/40`,
    createGroup: "צור קבוצה",
    joinGroup: "הצטרף עם קוד",
    groupName: "שם הקבוצה",
    inviteWa: "הזמן בוואטסאפ",
    enterCode: "קוד הזמנה",
    createBtn: "צור",
    joinBtn: "הצטרף",
    inviteText: (name, code, url) => `בוא לקבוצה "${name}" ב־Eyevos! קוד: ${code}. ${url}`,
    groupCreated: "הקבוצה נוצרה! שתף את הקוד.",
    joinedGroup: "הצטרפת לקבוצה!",
    badCode: "אין קבוצה עם הקוד הזה.",
    voteClosed: "ההצבעה נסגרה.",
    already: "כבר ניחשת את זה.",
    declined: "השאלה נמחקה.",
    approved: "אושר — ההצבעה נפתחה.",
    created: "הניחוש פורסם!",
    sent: "נשלח לאישור.",
    needLong: "כתוב שאלה קצת יותר ארוכה.",
    needDeadline: "בחר תאריך ושעת סגירה.",
    savedProfile: "הפרופיל נשמר.",
    needFuture: "בחר זמן סגירה עתידי.",
    blocked: "השאלה נחסמה — שמור על זה הוגן.",
    pickSubjectStep: "1 · בחר נושא",
    pickGroupStep: "2 · לאיזו קבוצה?",
    writeStep: "3 · כתוב את הניחוש",
    noNotifs: "אין בקשות חדשות.",
    awaitingApproval: t => `ממתין שֶׁ־@${t} יאשר/ת`,
    shareGroupT: "הקבוצה נוצרה! 🎉",
    shareGroupS: "הזמן את החבר'ה כדי להתחיל לשחק.",
    copyLink: "העתק קישור הזמנה",
    doneBtn: "סיום",
    noGroups: "אתה עדיין לא בקבוצה — צור קבוצה קודם.",
    resolvedToast: "הוכרע — הנקודות חולקו.",
    proofMissing: "צרף קודם תמונת הוכחה.",
    pickOutcome: "בחר קודם מה קרה.",
    cantVoteSelf: "אי אפשר להצביע על שאלה שהיא עליך."
  },
  es: {
    sport: "Deporte",
    weather: "Clima",
    screen: "Pantalla",
    news: "Noticias",
    family: "Familia",
    food: "Comida",
    life: "Vida",
    feed: "Inicio",
    ranks: "Ranking",
    createNav: "Nuevo",
    rules: "Reglas",
    you: "Tú",
    all: "Todo",
    yes: "SÍ",
    no: "NO",
    tapCall: "Toca un lado",
    continueGoogle: "Continuar con Google",
    tagline: "El juego social de predicciones. Solo puntos, nunca dinero.",
    signInPriv: "Sin dinero, sin mensajes. Para todas las edades.",
    headline1: "Adivínalo antes",
    headline2: "que los demás.",
    boardHeadline: "¿Quién lee mejor la jugada?",
    postCall: "Publicar",
    resolveBtn: "Resolver",
    seeResult: "Ver resultado",
    points: "Puntos",
    level: "Nivel",
    langT: "Idioma",
    voteToReveal: "Vota para ver el reparto",
    createGroup: "Crear grupo",
    joinGroup: "Unirse con código",
    inviteWa: "Invitar por WhatsApp"
  },
  ar: {
    sport: "رياضة",
    weather: "الطقس",
    screen: "شاشة",
    news: "أخبار",
    family: "عائلة",
    food: "طعام",
    life: "حياة",
    feed: "الرئيسية",
    ranks: "الترتيب",
    createNav: "جديد",
    rules: "القواعد",
    you: "أنت",
    all: "الكل",
    yes: "نعم",
    no: "لا",
    tapCall: "اختر جهة",
    continueGoogle: "المتابعة عبر Google",
    tagline: "لعبة التوقعات الاجتماعية. نقاط فقط، لا مال.",
    signInPriv: "بلا مال، بلا رسائل. لكل الأعمار.",
    headline1: "توقّعها قبل",
    headline2: "أي شخص آخر.",
    boardHeadline: "من يقرأ الموقف أفضل؟",
    postCall: "انشر",
    resolveBtn: "احسم",
    seeResult: "النتيجة",
    points: "نقاط",
    level: "مستوى",
    langT: "اللغة",
    voteToReveal: "صوّت لكشف النتيجة",
    createGroup: "إنشاء مجموعة",
    joinGroup: "انضم برمز",
    inviteWa: "دعوة عبر واتساب"
  },
  fr: {
    sport: "Sport",
    weather: "Météo",
    screen: "Écran",
    news: "Actu",
    family: "Famille",
    food: "Cuisine",
    life: "Vie",
    feed: "Accueil",
    ranks: "Classement",
    createNav: "Nouveau",
    rules: "Règles",
    you: "Toi",
    all: "Tout",
    yes: "OUI",
    no: "NON",
    tapCall: "Touche un côté",
    continueGoogle: "Continuer avec Google",
    tagline: "Le jeu social de pronostics. Que des points, jamais d'argent.",
    signInPriv: "Sans argent, sans messages. Pour tous les âges.",
    headline1: "Devine-le avant",
    headline2: "tous les autres.",
    boardHeadline: "Qui lit le mieux la situation ?",
    postCall: "Publier",
    resolveBtn: "Résoudre",
    seeResult: "Résultat",
    points: "Points",
    level: "Niveau",
    langT: "Langue",
    voteToReveal: "Vote pour voir le partage",
    createGroup: "Créer un groupe",
    joinGroup: "Rejoindre avec un code",
    inviteWa: "Inviter sur WhatsApp"
  },
  de: {
    sport: "Sport",
    weather: "Wetter",
    screen: "Bildschirm",
    news: "Nachrichten",
    family: "Familie",
    food: "Essen",
    life: "Leben",
    feed: "Feed",
    ranks: "Rang",
    createNav: "Neu",
    rules: "Regeln",
    you: "Du",
    all: "Alle",
    yes: "JA",
    no: "NEIN",
    tapCall: "Tippe eine Seite",
    continueGoogle: "Mit Google fortfahren",
    tagline: "Das soziale Tippspiel. Nur Punkte, niemals Geld.",
    signInPriv: "Kein Geld, keine DMs. Für jedes Alter.",
    headline1: "Sag es voraus, bevor",
    headline2: "es alle anderen tun.",
    boardHeadline: "Wer liest die Lage am besten?",
    postCall: "Veröffentlichen",
    resolveBtn: "Auflösen",
    seeResult: "Ergebnis",
    points: "Punkte",
    level: "Level",
    langT: "Sprache",
    voteToReveal: "Stimme ab, um zu sehen",
    createGroup: "Gruppe erstellen",
    joinGroup: "Mit Code beitreten",
    inviteWa: "Per WhatsApp einladen"
  },
  pt: {
    sport: "Esporte",
    weather: "Clima",
    screen: "Telinha",
    news: "Notícias",
    family: "Família",
    food: "Comida",
    life: "Vida",
    feed: "Início",
    ranks: "Ranking",
    createNav: "Novo",
    rules: "Regras",
    you: "Você",
    all: "Tudo",
    yes: "SIM",
    no: "NÃO",
    tapCall: "Toque num lado",
    continueGoogle: "Continuar com Google",
    tagline: "O jogo social de palpites. Só pontos, nunca dinheiro.",
    signInPriv: "Sem dinheiro, sem mensagens. Para todas as idades.",
    headline1: "Adivinhe antes",
    headline2: "de todo mundo.",
    boardHeadline: "Quem lê melhor a jogada?",
    postCall: "Publicar",
    resolveBtn: "Resolver",
    seeResult: "Ver resultado",
    points: "Pontos",
    level: "Nível",
    langT: "Idioma",
    voteToReveal: "Vote para ver a divisão",
    createGroup: "Criar grupo",
    joinGroup: "Entrar com código",
    inviteWa: "Convidar no WhatsApp"
  },
  ru: {
    sport: "Спорт",
    weather: "Погода",
    screen: "Экран",
    news: "Новости",
    family: "Семья",
    food: "Еда",
    life: "Жизнь",
    feed: "Лента",
    ranks: "Рейтинг",
    createNav: "Новый",
    rules: "Правила",
    you: "Ты",
    all: "Все",
    yes: "ДА",
    no: "НЕТ",
    tapCall: "Нажми сторону",
    continueGoogle: "Войти через Google",
    tagline: "Социальная игра-прогноз. Только очки, никогда не деньги.",
    signInPriv: "Без денег, без сообщений. Для всех возрастов.",
    headline1: "Угадай раньше,",
    headline2: "чем все остальные.",
    boardHeadline: "Кто лучше читает ситуацию?",
    postCall: "Опубликовать",
    resolveBtn: "Решить",
    seeResult: "Результат",
    points: "Очки",
    level: "Уровень",
    langT: "Язык",
    voteToReveal: "Проголосуй, чтобы увидеть",
    createGroup: "Создать группу",
    joinGroup: "Войти по коду",
    inviteWa: "Пригласить в WhatsApp"
  },
  hi: {
    sport: "खेल",
    weather: "मौसम",
    screen: "स्क्रीन",
    news: "खबरें",
    family: "परिवार",
    food: "खाना",
    life: "जीवन",
    feed: "फ़ीड",
    ranks: "रैंक",
    createNav: "नया",
    rules: "नियम",
    you: "आप",
    all: "सभी",
    yes: "हाँ",
    no: "नहीं",
    tapCall: "एक तरफ़ चुनें",
    continueGoogle: "Google से जारी रखें",
    tagline: "सोशल प्रेडिक्शन गेम। सिर्फ़ पॉइंट, कभी पैसा नहीं।",
    signInPriv: "कोई पैसा नहीं, कोई DM नहीं। हर उम्र के लिए।",
    headline1: "सबसे पहले",
    headline2: "अंदाज़ा लगाओ।",
    boardHeadline: "सबसे अच्छा कौन भांपता है?",
    postCall: "पोस्ट करें",
    resolveBtn: "तय करें",
    seeResult: "नतीजा",
    points: "पॉइंट",
    level: "स्तर",
    langT: "भाषा",
    voteToReveal: "बँटवारा देखने के लिए वोट करें",
    createGroup: "समूह बनाएँ",
    joinGroup: "कोड से जुड़ें",
    inviteWa: "WhatsApp पर बुलाएँ"
  },
  zh: {
    sport: "体育",
    weather: "天气",
    screen: "影视",
    news: "新闻",
    family: "家庭",
    food: "美食",
    life: "生活",
    feed: "动态",
    ranks: "排行",
    createNav: "新建",
    rules: "规则",
    you: "我",
    all: "全部",
    yes: "是",
    no: "否",
    tapCall: "点一边",
    continueGoogle: "使用 Google 继续",
    tagline: "社交预测游戏。只有积分，永远没有金钱。",
    signInPriv: "没有金钱，没有私信。适合所有年龄。",
    headline1: "抢在所有人之前",
    headline2: "做出预测。",
    boardHeadline: "谁最懂局势？",
    postCall: "发布",
    resolveBtn: "揭晓",
    seeResult: "看结果",
    points: "积分",
    level: "等级",
    langT: "语言",
    voteToReveal: "投票后查看分布",
    createGroup: "创建群组",
    joinGroup: "用代码加入",
    inviteWa: "用 WhatsApp 邀请"
  }
};
function dict(lang) {
  return {
    ...STR.en,
    ...(STR[lang] || {})
  };
}

/* ---------- shared bits ---------- */
function Avatar({
  name,
  photo,
  size = 30,
  ring
}) {
  const col = HUES[name] || "#8A6BFF";
  if (photo) {
    return /*#__PURE__*/React.createElement("img", {
      src: photo,
      alt: name,
      style: {
        width: size,
        height: size,
        borderRadius: 10,
        objectFit: "cover",
        flexShrink: 0,
        border: ring ? `2px solid ${col}` : "none"
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 10,
      flexShrink: 0,
      background: col + "26",
      color: col,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: size * 0.34,
      border: ring ? `2px solid ${col}` : "none"
    }
  }, initials(name));
}
function SubjectTag({
  subject,
  L
}) {
  const C = SUBJECTS[subject];
  return /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: C.c + "1f",
      color: C.c
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: C.icon,
    size: 11,
    color: C.c
  }), " ", L[subject]);
}

/* ---------- VS vote bar (split hidden until you vote) ---------- */
function VoteBar({
  poll,
  onVote,
  isTarget,
  L
}) {
  const [pending, setPending] = useState(null); // side chosen, awaiting conviction ("how sure?")
  const total = poll.yes + poll.no;
  const y = pct(poll.yes, poll.no);
  const voted = poll.mine;
  const reveal = !!voted || poll.status !== "live";
  const wy = reveal ? y : 50;
  const yesBg = voted === "yes" ? "var(--yes)" : !reveal && pending === "yes" ? "var(--yes)" : "var(--yes-soft)";
  const noBg = voted === "no" ? "var(--no)" : !reveal && pending === "no" ? "var(--no)" : "var(--no-soft)";
  const conf = [[1, L.conf1], [2, L.conf2], [3, L.conf3]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bar" + (reveal ? " locked" : ""),
    role: "group",
    "aria-label": "VS"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side",
    style: {
      width: `${wy}%`,
      background: yesBg
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "side",
    style: {
      width: `${100 - wy}%`,
      background: noBg
    }
  }), reveal ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "lab",
    style: {
      insetInlineStart: 0,
      color: voted === "yes" ? "#fff" : "var(--yes)"
    }
  }, voted === "yes" && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "#fff"
  }), " ", L.yes, " ", /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      opacity: .9
    }
  }, y, "%")), /*#__PURE__*/React.createElement("span", {
    className: "lab",
    style: {
      insetInlineEnd: 0,
      color: voted === "no" ? "#06302b" : "var(--no)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      opacity: .9
    }
  }, 100 - y, "%"), " ", L.no, " ", voted === "no" && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "#06302b"
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "lab",
    style: {
      insetInlineStart: 0,
      color: pending === "yes" ? "#fff" : "var(--yes)"
    },
    disabled: isTarget,
    onClick: () => !isTarget && setPending("yes"),
    "aria-label": L.yes
  }, L.yes), /*#__PURE__*/React.createElement("button", {
    className: "lab",
    style: {
      insetInlineEnd: 0,
      color: pending === "no" ? "#06302b" : "var(--no)"
    },
    disabled: isTarget,
    onClick: () => !isTarget && setPending("no"),
    "aria-label": L.no
  }, L.no))), !reveal && pending && !isTarget && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 800,
      color: "var(--muted)",
      whiteSpace: "nowrap"
    }
  }, L.howSure), conf.map(([c, label]) => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "chip",
    style: {
      flex: 1,
      justifyContent: "center",
      padding: "9px 6px",
      borderColor: c === 3 ? "rgba(255,194,60,.5)" : "var(--line)",
      color: c === 3 ? "var(--gold)" : "var(--text)"
    },
    onClick: () => onVote(pending, c)
  }, c === 3 ? "🔥 " : "", label, " ", /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      opacity: .7
    }
  }, "\xD7", c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 9,
      fontSize: 12,
      color: "var(--muted)",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum"
  }, reveal ? L.votes(total) : L.inVotes(total)), isTarget ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-2)",
      fontWeight: 700,
      display: "inline-flex",
      gap: 4,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12,
    color: "var(--brand-2)"
  }), " ", L.targetCantVote) : !reveal ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-2)",
      fontWeight: 700
    }
  }, pending ? L.howSure : L.voteToReveal) : voted && poll.type !== "person" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 12,
    color: "var(--gold)"
  }), (voted === "yes" ? y : 100 - y) < 50 ? L.minorityYou : L.crowd) : /*#__PURE__*/React.createElement("span", null, L.lockedIn)));
}

/* ---------- win celebration ---------- */
function Confetti() {
  const colors = ["#FF4D6D", "#2DD4BF", "#FFC23C", "#8A6BFF", "#5BC8FF", "#FF8A4D"];
  return /*#__PURE__*/React.createElement("div", {
    className: "confetti",
    "aria-hidden": "true"
  }, Array.from({
    length: 18
  }, (_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      left: Math.round(Math.random() * 100) + "%",
      background: colors[i % colors.length],
      animationDelay: (Math.random() * 0.35).toFixed(2) + "s",
      transform: `scale(${(0.7 + Math.random() * 0.7).toFixed(2)})`
    }
  })));
}

/* ---------- sound + haptics (WebAudio, default-on, muteable) ----------
   ETHICAL RULE: a "win" sound/vibe fires ONLY on a real point gain. A wrong
   call gets a calm neutral tone — never a win sound (no "loss disguised as a win"). */
const SOUND = (() => {
  let ctx = null,
    on = true;
  try {
    on = localStorage.getItem("eyevos_sound") !== "off";
  } catch (e) {}
  function ac() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    return ctx;
  }
  function tone(freq, dur, when, type, gain) {
    const c = ac();
    if (!c) return;
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    o.connect(g);
    g.connect(c.destination);
    const t = c.currentTime + (when || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.03);
  }
  return {
    get on() {
      return on;
    },
    toggle() {
      on = !on;
      try {
        localStorage.setItem("eyevos_sound", on ? "on" : "off");
      } catch (e) {}
      if (on) tone(660, 0.1, 0, "triangle", 0.1);
      return on;
    },
    tick() {
      if (!on) return;
      tone(440, 0.05, 0, "triangle", 0.07);
      try {
        navigator.vibrate && navigator.vibrate(8);
      } catch (e) {}
    },
    win(tier) {
      if (!on) return;
      [523, 659, 784, 1047, 1319].slice(0, 2 + (tier || 1)).forEach((f, i) => tone(f, 0.2, i * 0.085, "triangle", 0.14));
      try {
        navigator.vibrate && navigator.vibrate([0, 30, 45, 30]);
      } catch (e) {}
    },
    lose() {
      if (!on) return;
      tone(240, 0.14, 0, "sine", 0.05);
    }
  };
})();

/* count-up a number for the casino "rolling odds/points" feel */
function CountUp({
  to,
  dur = 650,
  prefix = ""
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, t0;
    const tick = t => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, prefix, n);
}

/* ---------- emoji reactions (fixed, age-safe palette — no free text) ---------- */
const REACTIONS = ["🔥", "😮", "😂", "👏", "🎯"];
function ReactionBar({
  poll,
  onReact
}) {
  const r = poll.reactions || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid var(--line)"
    }
  }, REACTIONS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    onClick: () => onReact(poll.id, e),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: r[e] ? "var(--brand-soft)" : "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 999,
      padding: "5px 10px",
      cursor: "pointer",
      fontSize: 15,
      fontFamily: "inherit",
      color: "var(--text)",
      transition: ".15s"
    }
  }, /*#__PURE__*/React.createElement("span", null, e), r[e] ? /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 12,
      color: "var(--brand-2)",
      fontWeight: 800
    }
  }, r[e]) : null)));
}

/* ---------- poll card ---------- */
function PollCard({
  poll,
  meName,
  onVote,
  onOpenConsent,
  onReveal,
  onResolve,
  onReport,
  onReact,
  L
}) {
  const isTarget = poll.tagged && poll.tagged === meName;
  if (poll.status === "pending") {
    return /*#__PURE__*/React.createElement("div", {
      className: "card row-pop",
      style: {
        borderStyle: "dashed",
        borderColor: "var(--line-2)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(SubjectTag, {
      subject: poll.subject,
      L: L
    }), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--gold-soft)",
        color: "var(--gold)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hourglass",
      size: 11,
      color: "var(--gold)"
    }), " ", L.awaiting)), /*#__PURE__*/React.createElement("p", {
      className: "disp",
      style: {
        fontSize: 18,
        fontWeight: 700,
        margin: "11px 0 6px",
        lineHeight: 1.25
      }
    }, poll.q), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 14,
      color: "var(--brand-2)"
    }), " ", isTarget ? L.consentT : L.awaitingApproval(poll.tagged)), isTarget ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn-pri",
      style: {
        marginTop: 13
      },
      onClick: () => onOpenConsent(poll)
    }, L.reviewAs(poll.tagged), " ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 16,
      cls: "flip-x"
    })) : null);
  }
  const resolved = poll.status === "resolved";
  const isVoid = poll.status === "void";
  const locked = poll.status === "locked";
  const method = resolveMethod(poll);
  const hot = poll.status === "live" && poll.yes + poll.no >= 20;
  // auto = the app checks public sources (anyone can trigger). proof/group = ONLY the author who
  // posted the question may answer / send the photo — nobody else.
  const canResolve = method === "auto" ? true : poll.by === meName;
  return /*#__PURE__*/React.createElement("div", {
    className: "card row-pop" + (hot ? " hotcard" : ""),
    style: isVoid ? {
      opacity: .6
    } : null
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(SubjectTag, {
    subject: poll.subject,
    L: L
  }), poll.type === "person" && /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--brand-soft)",
      color: "var(--brand-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 11,
    color: "var(--brand-2)"
  }), " @", poll.tagged), method === "auto" ? /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "rgba(45,212,191,.12)",
      color: "var(--no)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 11,
    color: "var(--no)"
  }), " ", L.autoTag) : method === "proof" ? /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "rgba(255,194,60,.12)",
      color: "var(--gold)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 11,
    color: "var(--gold)"
  }), " ", L.proofTag) : null, hot && /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--yes-soft)",
      color: "var(--yes)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 11,
    color: "var(--yes)"
  }), " ", L.hot)), poll.status === "live" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      fontWeight: 800,
      color: "var(--yes)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " ", L.live) : resolved ? /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--gold-soft)",
      color: "var(--gold)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 11,
    color: "var(--gold)"
  }), " ", L.resolvedTag) : isVoid ? /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--ink-3)",
      color: "var(--faint)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 11
  }), " ", L.voidedTag) : /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--ink-3)",
      color: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11
  }), " ", L.lockedTag)), /*#__PURE__*/React.createElement("p", {
    className: "disp",
    style: {
      fontSize: 19,
      fontWeight: 700,
      margin: "0 0 14px",
      lineHeight: 1.25
    }
  }, poll.q), /*#__PURE__*/React.createElement(VoteBar, {
    poll: poll,
    onVote: (s, c) => onVote(poll.id, s, c),
    isTarget: isTarget,
    L: L
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
      paddingTop: 13,
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: poll.by,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)",
      fontWeight: 600
    }
  }, L.asked(poll.by)), /*#__PURE__*/React.createElement("button", {
    onClick: () => onReport(poll),
    "aria-label": L.report,
    title: L.report,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--faint)",
      padding: 4,
      display: "inline-flex",
      marginInlineStart: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag",
    size: 13
  }))), resolved ? /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn",
    style: {
      width: "auto",
      padding: "8px 13px",
      fontSize: 13
    },
    onClick: () => onReveal(poll)
  }, L.seeResult, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14,
    color: "var(--gold)"
  })) : locked ? canResolve ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    style: {
      width: "auto",
      padding: "8px 14px",
      fontSize: 13
    },
    onClick: () => onResolve(poll)
  }, L.resolveBtn, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "scale",
    size: 14,
    color: "#fff"
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--faint)",
      display: "inline-flex",
      gap: 5,
      alignItems: "center",
      maxWidth: 190,
      textAlign: "end"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), " ", L.onlyAuthorResolves(poll.by)) : isVoid ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--faint)"
    }
  }, L.voidedTag) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--faint)",
      display: "inline-flex",
      gap: 5,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12
  }), " ", poll.ends)), resolved && onReact && /*#__PURE__*/React.createElement(ReactionBar, {
    poll: poll,
    onReact: onReact
  }));
}

/* ---------- Feed ---------- */
function Feed({
  polls,
  meName,
  members,
  filter,
  setFilter,
  subjects,
  season,
  onVote,
  onOpenConsent,
  onReveal,
  onResolve,
  onReport,
  onReact,
  L
}) {
  const list = polls.filter(p => filter === "all" || p.subject === filter);
  // Prediction of the day = the hottest LIVE poll (most votes) — always something to open
  const potd = list.filter(p => p.status === "live").sort((a, b) => b.yes + b.no - (a.yes + a.no))[0];
  const rest = list.filter(p => !potd || p.id !== potd.id);
  const cardProps = {
    meName,
    onVote,
    onOpenConsent,
    onReveal,
    onResolve,
    onReport,
    onReact,
    L
  };
  // live activity ticker — makes a quiet group feel alive (all derived, no backend)
  const ticker = [];
  (members || []).forEach(m => {
    if (!m.me && m.streak >= 3) ticker.push({
      i: "flame",
      t: `${m.name} · ${m.streak} ${L.streak}`
    });
  });
  polls.filter(p => p.status === "live").slice(0, 5).forEach(p => ticker.push({
    i: "plus",
    t: `${p.by}: ${p.q.length > 24 ? p.q.slice(0, 24) + "…" : p.q}`
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      padding: "4px 0 10px"
    }
  }, ["all", ...subjects].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "chip" + (filter === c ? " on" : ""),
    onClick: () => setFilter(c)
  }, L[c]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: "var(--faint)",
      fontSize: 11.5,
      fontWeight: 700,
      margin: "0 0 10px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hourglass",
    size: 12,
    color: "var(--gold)"
  }), " ", L.seasonLeft(season)), ticker.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ticker",
    style: {
      margin: "0 0 13px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-track"
  }, [...ticker, ...ticker].map((it, idx) => /*#__PURE__*/React.createElement("span", {
    className: "tick-item",
    key: idx
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.i,
    size: 12,
    color: it.i === "flame" ? "var(--gold)" : "var(--brand-2)"
  }), " ", it.t)))), potd && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      margin: "0 2px 7px",
      fontSize: 12,
      fontWeight: 800,
      color: "var(--gold)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 13,
    color: "var(--gold)"
  }), " ", L.potd), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 22,
      padding: 1.5,
      background: "linear-gradient(120deg, var(--gold), var(--brand))"
    }
  }, /*#__PURE__*/React.createElement(PollCard, _extends({
    poll: potd
  }, cardProps)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 13
    }
  }, rest.map(p => /*#__PURE__*/React.createElement(PollCard, _extends({
    key: p.id,
    poll: p
  }, cardProps))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--faint)",
      padding: "48px 0"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "help",
    size: 30,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      color: "var(--muted)"
    }
  }, L.emptyT), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13
    }
  }, L.emptyS))));
}

/* ---------- Create flow: subject -> group -> write ---------- */
function CreateFlow({
  onCreate,
  onCancel,
  onOpenGroups,
  myGroups,
  members,
  subjects,
  L
}) {
  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState(null);
  const [grp, setGrp] = useState(null);
  const [type, setType] = useState("event");
  const [personal, setPersonal] = useState(null);
  const [q, setQ] = useState("");
  const [tagged, setTagged] = useState(null);
  const [deadline, setDeadline] = useState(defaultDeadline());
  const [forceProof, setForceProof] = useState(false);

  // only members of the chosen group can be tagged (matches the on-screen promise)
  const people = (members || []).filter(m => !m.me && (m.g || []).indexOf(grp) >= 0).map(m => m.name);
  const detected = detectSubject(q);
  const mismatch = subject && subject !== "life" && detected && detected !== subject && subjects.indexOf(detected) >= 0;
  const banned = containsBanned(q);
  const futureOk = deadline && new Date(deadline) > new Date();
  const canSubmit = q.trim().length > 4 && futureOk && !mismatch && !banned && (type === "event" || tagged && personal !== null);
  const method = resolveMethod({
    type,
    subject,
    personal,
    forceProof
  });
  const back = step === 0 ? onCancel : () => setStep(step - 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 18px 24px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: back,
    style: {
      background: "none",
      border: "none",
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 16,
      fontFamily: "inherit",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowleft",
    size: 17,
    cls: "flip-x"
  }), " ", step === 0 ? L.cancel : L.back), step === 0 && /*#__PURE__*/React.createElement("div", {
    className: "row-pop"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: "var(--brand-2)",
      margin: "0 0 4px"
    }
  }, L.pickSubjectStep), /*#__PURE__*/React.createElement("h2", {
    className: "disp",
    style: {
      fontSize: 24,
      fontWeight: 800,
      margin: "0 0 18px"
    }
  }, L.createT), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, subjects.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "card",
    onClick: () => {
      setSubject(c);
      setStep(1);
    },
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 15,
      textAlign: "start",
      borderColor: subject === c ? "var(--brand)" : "var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 11,
      background: SUBJECTS[c].c + "1f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: SUBJECTS[c].icon,
    size: 19,
    color: SUBJECTS[c].c
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14.5
    }
  }, L[c]))))), step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "row-pop"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: "var(--brand-2)",
      margin: "0 0 12px"
    }
  }, L.pickGroupStep), myGroups.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      padding: "30px 0"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 28,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700
    }
  }, L.noGroups), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    style: {
      marginTop: 14
    },
    onClick: onOpenGroups
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " ", L.createGroup)) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, myGroups.map(g => /*#__PURE__*/React.createElement("button", {
    key: g.id,
    className: "card",
    onClick: () => {
      setGrp(g.id);
      setStep(2);
    },
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 14,
      textAlign: "start"
    }
  }, g.photo ? /*#__PURE__*/React.createElement("img", {
    src: g.photo,
    alt: g.name,
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 20,
    color: "var(--brand-2)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, g.name), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 12,
      color: "var(--muted)"
    }
  }, L.membersOf(g.count))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 16,
    color: "var(--faint)",
    cls: "flip-x"
  }))))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "row-pop"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: "var(--brand-2)",
      margin: "0 0 10px",
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, L.writeStep, " \xB7 ", /*#__PURE__*/React.createElement(SubjectTag, {
    subject: subject,
    L: L
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip" + (type === "event" ? " on" : ""),
    style: {
      flex: 1,
      justifyContent: "center",
      padding: "11px"
    },
    onClick: () => {
      setType("event");
      setPersonal(null);
      setTagged(null);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 14,
    color: type === "event" ? "#D9CDFF" : "var(--muted)"
  }), " ", L.eventT), /*#__PURE__*/React.createElement("button", {
    className: "chip" + (type === "person" ? " on" : ""),
    style: {
      flex: 1,
      justifyContent: "center",
      padding: "11px"
    },
    onClick: () => setType("person")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 14,
    color: type === "person" ? "#D9CDFF" : "var(--muted)"
  }), " ", L.personT)), type === "person" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, people.map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: "chip" + (tagged === p ? " on" : ""),
    onClick: () => setTagged(p)
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p,
    size: 18
  }), " ", p))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--faint)",
      marginTop: 9,
      display: "flex",
      gap: 5,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    color: "var(--no)"
  }), " ", L.onlyMembers), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--muted)",
      margin: "14px 0 9px"
    }
  }, L.personalOrGeneral), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "card",
    onClick: () => setPersonal(true),
    style: {
      flex: 1,
      cursor: "pointer",
      textAlign: "start",
      borderColor: personal === true ? "var(--brand)" : "var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center",
      fontWeight: 700,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14,
    color: "var(--gold)"
  }), " ", L.personalT), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      marginTop: 4
    }
  }, L.personalD)), /*#__PURE__*/React.createElement("button", {
    className: "card",
    onClick: () => setPersonal(false),
    style: {
      flex: 1,
      cursor: "pointer",
      textAlign: "start",
      borderColor: personal === false ? "var(--brand)" : "var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center",
      fontWeight: 700,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 14,
    color: "var(--no)"
  }), " ", L.generalT), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      marginTop: 4
    }
  }, L.generalD)))), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: type === "person" ? L.phPerson(tagged) : L.phEvent,
    rows: 3,
    "aria-label": L.writeQ,
    style: {
      width: "100%",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 14,
      padding: 14,
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 16,
      resize: "none",
      outline: "none"
    }
  }), mismatch && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 9,
      fontSize: 12.5,
      color: "var(--yes)",
      fontWeight: 700,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "var(--yes)"
  }), " ", L.mismatch(L[detected])), banned && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 9,
      fontSize: 12.5,
      color: "var(--yes)",
      fontWeight: 700,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 13,
    color: "var(--yes)"
  }), " ", L.blocked), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--muted)",
      margin: "20px 0 9px",
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 14
  }), " ", L.deadlineLabel), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: deadline,
    onChange: e => setDeadline(e.target.value),
    "aria-label": L.deadlineLabel,
    style: {
      width: "100%",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 13,
      padding: "13px 14px",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 15,
      outline: "none",
      colorScheme: "dark"
    }
  }), deadline && !futureOk && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: "var(--yes)",
      fontWeight: 700
    }
  }, L.needFuture), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 18,
      display: "flex",
      gap: 11,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: method === "auto" ? "search" : method === "group" ? "users" : "camera",
    size: 20,
    color: method === "auto" ? "var(--no)" : method === "group" ? "var(--brand-2)" : "var(--gold)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, method === "auto" ? L.methodAuto : method === "group" ? L.methodGroup : L.methodProof), method !== "proof" && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center",
      marginTop: 9,
      fontSize: 12,
      color: "var(--muted)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: forceProof,
    onChange: e => setForceProof(e.target.checked)
  }), L.notOnline))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    style: {
      marginTop: 22
    },
    disabled: !canSubmit,
    onClick: () => onCreate({
      group: grp,
      type,
      q: q.trim(),
      subject,
      tagged,
      personal: !!personal,
      forceProof,
      ends: fmtDeadline(deadline)
    })
  }, type === "person" ? /*#__PURE__*/React.createElement(React.Fragment, null, L.sendApprove(tagged), " ", /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 17,
    color: "#fff"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, L.postCall, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 17,
    color: "#fff"
  })))));
}

/* ---------- Board: staged subject -> group -> ranking ---------- */
function RankRow({
  m,
  place,
  scoreOf,
  L
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 13,
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderColor: m.me ? "var(--brand)" : "var(--line)",
      background: m.me ? "var(--brand-soft)" : "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      width: 22,
      fontWeight: 800,
      color: place <= 3 ? "var(--gold)" : "var(--faint)"
    }
  }, place), /*#__PURE__*/React.createElement(Avatar, {
    name: m.name,
    photo: m.photo,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5
    }
  }, m.name, m.me ? ` (${L.me})` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      display: "flex",
      gap: 10,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 11
  }), " ", m.acc, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 11,
    color: "var(--gold)"
  }), " ", m.streak, " ", L.streak))), /*#__PURE__*/React.createElement("span", {
    className: "tnum disp",
    style: {
      fontWeight: 800,
      fontSize: 17,
      color: m.me ? "var(--brand-2)" : "var(--text)"
    }
  }, scoreOf(m)));
}
function Board({
  members,
  groups,
  subjects,
  currentGroup,
  L
}) {
  const [step, setStep] = useState(0);
  const [sub, setSub] = useState(null);
  const [grp, setGrp] = useState(null);
  const myGroups = groups.filter(g => members.some(m => m.me && (m.g || []).indexOf(g.id) >= 0));
  const season = (groups.find(x => x.id === grp) || {}).seasonLeft || SEASON_DAYS;
  const scoreOf = m => sub === "total" ? sumScores(m.s) : m.s[sub] || 0;
  if (step === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 16px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: "var(--brand-2)",
        margin: "2px 0 12px"
      }
    }, L.rankPickSubject), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "card",
      onClick: () => {
        setSub("total");
        setStep(1);
      },
      style: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 16,
        gridColumn: "1 / -1"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 11,
        background: "var(--gold-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trophy",
      size: 19,
      color: "var(--gold)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 15
      }
    }, L.totalPts)), subjects.map(c => /*#__PURE__*/React.createElement("button", {
      key: c,
      className: "card",
      onClick: () => {
        setSub(c);
        setStep(1);
      },
      style: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 11,
        background: SUBJECTS[c].c + "1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: SUBJECTS[c].icon,
      size: 18,
      color: SUBJECTS[c].c
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 14
      }
    }, L[c])))));
  }
  if (step === 1) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 16px 20px"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setStep(0),
      style: {
        background: "none",
        border: "none",
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 700,
        cursor: "pointer",
        marginBottom: 14,
        fontFamily: "inherit",
        fontSize: 14
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrowleft",
      size: 17,
      cls: "flip-x"
    }), " ", L.back), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        color: "var(--brand-2)",
        margin: "2px 0 12px"
      }
    }, L.rankPickGroup), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, myGroups.map(g => /*#__PURE__*/React.createElement("button", {
      key: g.id,
      className: "card",
      onClick: () => {
        setGrp(g.id);
        setStep(2);
      },
      style: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 14,
        textAlign: "start"
      }
    }, g.photo ? /*#__PURE__*/React.createElement("img", {
      src: g.photo,
      alt: g.name,
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        objectFit: "cover"
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "var(--brand-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 20,
      color: "var(--brand-2)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 15
      }
    }, g.name), /*#__PURE__*/React.createElement("div", {
      className: "tnum",
      style: {
        fontSize: 12,
        color: "var(--muted)",
        display: "flex",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", null, L.membersOf(g.count)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color: "var(--gold)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hourglass",
      size: 10,
      color: "var(--gold)"
    }), " ", g.seasonLeft))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 16,
      color: "var(--faint)",
      cls: "flip-x"
    })))));
  }
  // step 2: the board
  const groupMembers = members.filter(m => (m.g || []).indexOf(grp) >= 0);
  const ranked = [...groupMembers].sort((a, b) => scoreOf(b) - scoreOf(a));
  const podiumColor = ["#FFC23C", "#C7CBD6", "#E0915B"];
  const g = groups.find(x => x.id === grp);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 16px 20px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(1),
    style: {
      background: "none",
      border: "none",
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 10,
      fontFamily: "inherit",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowleft",
    size: 17,
    cls: "flip-x"
  }), " ", L.back), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontWeight: 800,
      fontSize: 15
    }
  }, sub !== "total" && /*#__PURE__*/React.createElement(Icon, {
    name: SUBJECTS[sub].icon,
    size: 16,
    color: SUBJECTS[sub].c
  }), sub === "total" ? L.totalPts : L[sub], " \xB7 ", g && g.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      margin: "4px 0 16px",
      padding: "9px 14px",
      borderRadius: 13,
      background: "var(--gold-soft)",
      border: "1px solid rgba(255,194,60,.32)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hourglass",
    size: 15,
    color: "var(--gold)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 13.5,
      color: "var(--gold)"
    }
  }, L.seasonLeft(season))), ranked.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--faint)",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 28,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      color: "var(--muted)"
    }
  }, L.emptyBoard), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13
    }
  }, L.emptyBoardSub)) : ranked.length < 3 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, ranked.map((m, i) => /*#__PURE__*/React.createElement(RankRow, {
    key: m.name,
    m: m,
    place: i + 1,
    scoreOf: scoreOf,
    L: L
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 10,
      margin: "6px 0 22px"
    }
  }, [ranked[1], ranked[0], ranked[2]].map((m, i) => {
    const place = i === 1 ? 0 : i === 0 ? 1 : 2;
    const h = place === 0 ? 92 : place === 1 ? 70 : 58;
    return /*#__PURE__*/React.createElement("div", {
      key: m.name,
      style: {
        flex: 1,
        textAlign: "center"
      }
    }, place === 0 && /*#__PURE__*/React.createElement(Icon, {
      name: "crown",
      size: 20,
      color: "var(--gold)",
      style: {
        marginBottom: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      photo: m.photo,
      size: place === 0 ? 46 : 38,
      ring: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "disp",
      style: {
        fontWeight: 700,
        fontSize: 14,
        marginTop: 6
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      className: "tnum",
      style: {
        color: podiumColor[place],
        fontWeight: 800,
        fontSize: 15
      }
    }, scoreOf(m)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: h,
        marginTop: 8,
        borderRadius: "12px 12px 0 0",
        background: `linear-gradient(180deg, ${podiumColor[place]}33, ${podiumColor[place]}08)`,
        border: `1px solid ${podiumColor[place]}44`,
        borderBottom: "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "disp tnum",
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: podiumColor[place]
      }
    }, place + 1)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, ranked.slice(3).map((m, i) => /*#__PURE__*/React.createElement(RankRow, {
    key: m.name,
    m: m,
    place: i + 4,
    scoreOf: scoreOf,
    L: L
  })))));
}

/* ---------- Rules ---------- */
function RulesScreen({
  L
}) {
  const Section = ({
    icon,
    color,
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: color + "1f"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: color
  })), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      margin: 0,
      fontSize: 17,
      fontWeight: 800
    }
  }, title)), children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 16px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "linear-gradient(135deg, var(--gold-soft), transparent)",
      borderColor: "rgba(255,194,60,.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hourglass",
    size: 20,
    color: "var(--gold)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 700
    }
  }, L.seasonRule)), /*#__PURE__*/React.createElement(Section, {
    icon: "scale",
    color: "var(--gold)",
    title: L.rulesScoreT
  }, (L.rulesScore || []).map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: i < L.rulesScore.length - 1 ? "1px solid var(--line)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: "var(--muted)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 800,
      color: v && v !== "★" && v !== "↻" ? "var(--gold)" : "var(--brand-2)",
      whiteSpace: "nowrap"
    }
  }, v || "—")))), /*#__PURE__*/React.createElement(Section, {
    icon: "check",
    color: "var(--no)",
    title: L.rulesAllowedT
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingInlineStart: 18,
      color: "var(--muted)",
      fontSize: 13.5,
      lineHeight: 1.9
    }
  }, (L.rulesAllowed || []).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement(Section, {
    icon: "x",
    color: "var(--yes)",
    title: L.rulesForbiddenT
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingInlineStart: 18,
      color: "var(--muted)",
      fontSize: 13.5,
      lineHeight: 1.9
    }
  }, (L.rulesForbidden || []).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--faint)",
      fontSize: 11.5,
      fontWeight: 700,
      marginTop: 8,
      display: "flex",
      gap: 6,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 13,
    color: "var(--faint)"
  }), " ", L.pointsOnly));
}

/* ---------- Profile ---------- */
function Profile({
  me,
  subjects,
  L,
  onEdit,
  onSignOut
}) {
  const total = sumScores(me.s);
  const lvl = levelOf(total);
  const toNext = lvl * 50 - total;
  const lvlPct = Math.round((total - levelFloor(lvl)) / 50 * 100);
  const history = [{
    q: "העוגה של אמא יצאה מושלמת?",
    win: true,
    pts: "+8",
    minority: true
  }, {
    q: "מכבי תנצח את הפועל?",
    win: null,
    pts: L.live
  }, {
    q: "אמא תאשר את הטיול?",
    win: null,
    pts: L.live
  }, {
    q: "ירד גשם בטיול?",
    win: false,
    pts: "0"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: me.name,
    photo: me.photo,
    size: 58,
    ring: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 22,
      fontWeight: 800
    }
  }, me.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--muted)"
    }
  }, L.profileSub(lvl))), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    onClick: onEdit,
    "aria-label": L.editProfile
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 14
  }), " ", L.editProfile)), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)",
      fontWeight: 700
    }
  }, L.totalPts), /*#__PURE__*/React.createElement("div", {
    className: "disp tnum",
    style: {
      fontSize: 32,
      fontWeight: 900,
      color: "var(--gold)"
    }
  }, total)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    },
    title: L.levelHelp
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 50,
      height: 50,
      borderRadius: 15,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(138,107,255,.4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "disp tnum",
    style: {
      fontWeight: 900,
      fontSize: 22,
      color: "var(--brand-2)"
    }
  }, lvl)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)",
      fontWeight: 700,
      marginTop: 3
    }
  }, L.level))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 99,
      background: "var(--ink-3)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${lvlPct}%`,
      height: "100%",
      background: "linear-gradient(90deg,var(--brand),var(--brand-2))"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--faint)",
      marginTop: 6,
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 11,
    color: "var(--no)"
  }), " ", me.acc, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 11,
    color: "var(--yes)"
  }), " ", me.streak, " ", L.streak)), /*#__PURE__*/React.createElement("span", null, L.toNext(toNext)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: "var(--muted)",
      textTransform: "uppercase",
      letterSpacing: ".05em",
      marginBottom: 10
    }
  }, L.perSubject), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 22
    }
  }, subjects.map(k => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "card",
    style: {
      padding: 14,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 11,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: SUBJECTS[k].c + "1f"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: SUBJECTS[k].icon,
    size: 18,
    color: SUBJECTS[k].c
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "disp tnum",
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: SUBJECTS[k].c
    }
  }, me.s[k]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      fontWeight: 600
    }
  }, L[k]))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: "var(--muted)",
      textTransform: "uppercase",
      letterSpacing: ".05em",
      marginBottom: 11
    }
  }, L.recent), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      marginBottom: 18
    }
  }, history.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: 13,
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: h.win === true ? "var(--no-soft)" : h.win === false ? "var(--yes-soft)" : "var(--ink-3)"
    }
  }, h.win === true ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "var(--no)"
  }) : h.win === false ? /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16,
    color: "var(--yes)"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15,
    color: "var(--faint)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13.5,
      fontWeight: 600
    }
  }, h.q), h.minority && /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 13,
    color: "var(--gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 800,
      fontSize: 13,
      color: h.win === true ? "var(--no)" : h.win === false ? "var(--faint)" : "var(--brand-2)"
    }
  }, h.pts)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: onSignOut
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 16,
    color: "var(--muted)",
    cls: "flip-x"
  }), " ", L.signOut));
}

/* ---------- overlays ---------- */
function ConsentSheet({
  poll,
  onApprove,
  onDecline,
  onReport,
  onClose,
  L
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: 16,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 28,
    color: "var(--brand-2)"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 6px"
    }
  }, L.consentT), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      fontSize: 13.5,
      margin: "0 0 16px"
    }
  }, L.consentS(poll.by)), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(SubjectTag, {
    subject: poll.subject,
    L: L
  }), /*#__PURE__*/React.createElement("p", {
    className: "disp",
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: "10px 0 0",
      lineHeight: 1.3
    }
  }, poll.q)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    onClick: () => onApprove(poll),
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    color: "#fff"
  }), " ", L.approve), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => onDecline(poll),
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 17,
    color: "var(--text)"
  }), " ", L.decline), /*#__PURE__*/React.createElement("button", {
    onClick: () => onReport(poll),
    style: {
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--yes)",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag",
    size: 14,
    color: "var(--yes)"
  }), " ", L.reportUnkind)));
}
function ResolveSheet({
  poll,
  onConfirm,
  onClose,
  L
}) {
  const [outcome, setOutcome] = useState(null);
  const [proof, setProof] = useState(null);
  const fileRef = useRef(null);
  const method = resolveMethod(poll);
  const onFile = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setProof(r.result);
    r.readAsDataURL(f);
  };
  const ready = outcome && (method !== "proof" || proof);
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "86%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), method === "auto" && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: "rgba(45,212,191,.12)",
      color: "var(--no)",
      padding: "7px 13px",
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: "var(--no)"
  }), " ", L.verifyingTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--faint)",
      marginTop: 6
    }
  }, L.verifyingNote)), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 6px"
    }
  }, L.resolveT), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      fontSize: 13,
      margin: "0 0 16px"
    }
  }, poll.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setOutcome("yes"),
    style: {
      background: outcome === "yes" ? "var(--yes)" : "var(--ink-3)",
      border: "1px solid var(--line)",
      color: outcome === "yes" ? "#fff" : "var(--yes)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 17,
    color: outcome === "yes" ? "#fff" : "var(--yes)"
  }), " ", L.yes), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setOutcome("no"),
    style: {
      background: outcome === "no" ? "var(--no)" : "var(--ink-3)",
      border: "1px solid var(--line)",
      color: outcome === "no" ? "#06302b" : "var(--no)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 17,
    color: outcome === "no" ? "#06302b" : "var(--no)"
  }), " ", L.no)), method === "proof" && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 16,
      textAlign: "center",
      borderStyle: "dashed",
      borderColor: "var(--line-2)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)",
      margin: "0 0 11px",
      display: "flex",
      gap: 6,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 14,
    color: "var(--gold)"
  }), " ", L.proofNeeded), proof ? /*#__PURE__*/React.createElement("img", {
    src: proof,
    alt: "proof",
    style: {
      maxWidth: "100%",
      maxHeight: 160,
      borderRadius: 12,
      marginBottom: 8
    }
  }) : null, /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    onChange: onFile,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => fileRef.current && fileRef.current.click()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 16,
    color: "var(--brand-2)"
  }), " ", L.resolveProofBtn)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    disabled: !ready,
    onClick: () => onConfirm(poll, outcome, proof)
  }, L.confirm, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 17,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onConfirm(poll, "void"),
    style: {
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--faint)",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: 13,
      marginTop: 12,
      padding: 4
    }
  }, L.voidBtn)));
}
function ResultSheet({
  poll,
  streakBefore,
  onClose,
  onShare,
  onReact,
  L
}) {
  const p0 = poll.result && poll.result !== "void" ? payout(poll, streakBefore) : null;
  useEffect(() => {
    if (!p0) return;
    if (p0.myWin) SOUND.win(p0.streakBonus > 0 ? 3 : p0.bonus > 0 ? 2 : 1);else SOUND.lose();
  }, []);
  if (poll.result === "void") {
    return /*#__PURE__*/React.createElement("div", {
      className: "sheet",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "sheetcard",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      className: "grab"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 17,
        background: "var(--ink-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 28,
      color: "var(--faint)"
    }))), /*#__PURE__*/React.createElement("h3", {
      className: "disp",
      style: {
        textAlign: "center",
        fontSize: 21,
        fontWeight: 800,
        margin: "0 0 6px"
      }
    }, L.voidedTag), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        color: "var(--muted)",
        fontSize: 13.5,
        margin: "0 0 18px"
      }
    }, poll.q), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        color: "var(--faint)",
        fontSize: 13,
        margin: "0 0 18px"
      }
    }, L.voidedToast), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-pri",
      onClick: onClose
    }, L.nice)));
  }
  const p = p0;
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "90%",
      overflowY: "auto",
      position: "relative"
    }
  }, p.myWin && /*#__PURE__*/React.createElement(Confetti, null), /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spark",
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 17,
      background: "var(--gold-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 28,
    color: "var(--gold)"
  }))), p.myWin ? /*#__PURE__*/React.createElement("div", {
    className: "disp jackpot",
    style: {
      textAlign: "center",
      fontSize: 32,
      fontWeight: 900,
      margin: "0 0 2px",
      lineHeight: 1.05
    }
  }, L.winBang) : null, !p.myWin && /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: 900,
      margin: "0 0 2px",
      color: "var(--faint)"
    }
  }, L.lostBang), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: p.myWin ? 16 : 16,
      fontWeight: 800,
      margin: "0 0 4px",
      color: "var(--muted)"
    }
  }, L.itWas(p.won)), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      fontSize: 13.5,
      margin: "0 0 12px"
    }
  }, poll.q), p.conf > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: "var(--gold-soft)",
      color: "var(--gold)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 11,
    color: "var(--gold)"
  }), " ", L.convLine(p.conf))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      flex: 1,
      textAlign: "center",
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      fontWeight: 700,
      marginBottom: 4
    }
  }, L.yourPick), /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: poll.mine === "yes" ? "var(--yes)" : poll.mine === "no" ? "var(--no)" : "var(--faint)"
    }
  }, poll.mine ? poll.mine === "yes" ? L.yes : L.no : "—")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      flex: 1,
      textAlign: "center",
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--muted)",
      fontWeight: 700,
      marginBottom: 4
    }
  }, L.actualWas), /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: p.won === "yes" ? "var(--yes)" : "var(--no)"
    }
  }, p.won === "yes" ? L.yes : L.no))), poll.proof && /*#__PURE__*/React.createElement("img", {
    src: poll.proof,
    alt: "proof",
    style: {
      width: "100%",
      maxHeight: 180,
      objectFit: "cover",
      borderRadius: 14,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(PayRow, {
    label: L.correctCall,
    val: "+" + p.base,
    on: p.myWin
  }), /*#__PURE__*/React.createElement(PayRow, {
    label: L.minorityBonus,
    val: "+" + p.bonus,
    on: p.myWin && p.bonus > 0,
    gold: true
  }), /*#__PURE__*/React.createElement(PayRow, {
    label: L.streakBonusL,
    val: "+" + p.streakBonus,
    on: p.myWin && p.streakBonus > 0,
    gold: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--line)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, L.earned), /*#__PURE__*/React.createElement("span", {
    className: "disp tnum" + (p.myWin ? " win-num goldglow" : ""),
    style: {
      fontWeight: 900,
      fontSize: p.myWin ? 34 : 26,
      color: p.myWin ? "var(--gold)" : p.cost > 0 ? "var(--yes)" : "var(--faint)"
    }
  }, p.myWin ? /*#__PURE__*/React.createElement(CountUp, {
    to: p.earned,
    prefix: "+"
  }) : p.cost > 0 ? "−" + p.cost : "0"))), p.myWin && p.streakBonus > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      alignItems: "center",
      padding: 13,
      borderRadius: 14,
      background: "var(--yes-soft)",
      marginBottom: 12,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 18,
    color: "var(--yes)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#FFD0DA"
    }
  }, L.streakLine(p.streakAfter))), p.myWin && p.bonus > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      alignItems: "center",
      padding: 13,
      borderRadius: 14,
      background: "var(--gold-soft)",
      marginBottom: 12,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 18,
    color: "var(--gold)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#FFE0A6"
    }
  }, L.braveLine)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 11.5,
      color: "var(--faint)",
      marginBottom: 14,
      display: "flex",
      gap: 5,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: resolveMethod(poll) === "auto" ? "search" : "users",
    size: 12
  }), resolveMethod(poll) === "auto" ? L.resolvedByAuto : L.resolvedByGroup), onReact && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(ReactionBar, {
    poll: poll,
    onReact: onReact
  })), p.myWin && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      marginBottom: 10
    },
    onClick: () => onShare(poll, p)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 16,
    color: "var(--brand-2)"
  }), " ", L.shareBtn), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    onClick: onClose
  }, L.nice, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16,
    color: "#fff"
  }))));
}
function PayRow({
  label,
  val,
  on,
  gold
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      opacity: on ? 1 : .4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, gold ? /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 14,
    color: "var(--gold)"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "var(--no)"
  }), label), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 800,
      color: gold ? "var(--gold)" : "var(--no)"
    }
  }, val));
}
function EditProfileSheet({
  me,
  onSave,
  onClose,
  L
}) {
  const [name, setName] = useState(me.name);
  const [photo, setPhoto] = useState(me.photo);
  const fileRef = useRef(null);
  const onFile = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "88%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 18px"
    }
  }, L.editProfile), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    photo: photo,
    size: 84,
    ring: true
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current && fileRef.current.click(),
    "aria-label": L.choosePhoto,
    style: {
      position: "absolute",
      bottom: -4,
      insetInlineEnd: -4,
      width: 32,
      height: 32,
      borderRadius: 10,
      border: "2px solid var(--ink-2)",
      background: "var(--brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 15,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    onChange: onFile,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      marginBottom: 16
    },
    onClick: () => fileRef.current && fileRef.current.click()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 16,
    color: "var(--brand-2)"
  }), " ", L.choosePhoto), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--muted)",
      margin: "0 0 7px"
    }
  }, L.nameL), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    "aria-label": L.nameL,
    style: {
      width: "100%",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 13,
      padding: "13px 14px",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 16,
      outline: "none",
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    disabled: !name.trim(),
    onClick: () => onSave({
      name: name.trim(),
      photo
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 17,
    color: "#fff"
  }), " ", L.save)));
}
function LangSheet({
  lang,
  onPick,
  onClose,
  L
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "80%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 18px"
    }
  }, L.langT), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, LANGS.map(lg => /*#__PURE__*/React.createElement("button", {
    key: lg.code,
    className: "card",
    onClick: () => onPick(lg.code),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      padding: 14,
      textAlign: "start",
      borderColor: lang === lg.code ? "var(--brand)" : "var(--line)",
      background: lang === lg.code ? "var(--brand-soft)" : "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, lg.flag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14.5,
      flex: 1
    }
  }, lg.label), lang === lg.code && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "var(--brand-2)"
  }))))));
}

/* ---------- Group sheet: switch / create / join / invite ---------- */
function GroupSheet({
  groups,
  current,
  onPick,
  onCreate,
  onJoin,
  onInvite,
  onClose,
  L
}) {
  const [mode, setMode] = useState("list");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [code, setCode] = useState("");
  const fileRef = useRef(null);
  const onFile = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "86%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 16px"
    }
  }, L.group), mode === "list" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 14
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "card",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderColor: current === g.id ? "var(--brand)" : "var(--line)",
      background: current === g.id ? "var(--brand-soft)" : "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onPick(g.id),
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "none",
      border: "none",
      cursor: "pointer",
      textAlign: "start",
      padding: 0
    }
  }, g.photo ? /*#__PURE__*/React.createElement("img", {
    src: g.photo,
    alt: g.name,
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 20,
    color: "var(--brand-2)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15,
      color: "var(--text)"
    }
  }, g.name), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 12,
      color: "var(--muted)",
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, L.membersOf(g.count), " \xB7 ", g.code), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      color: "var(--gold)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hourglass",
    size: 10,
    color: "var(--gold)"
  }), " ", g.seasonLeft))), current === g.id && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    color: "var(--brand-2)"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onInvite(g),
    "aria-label": L.inviteWa,
    title: L.inviteWa,
    style: {
      background: "rgba(37,211,102,.14)",
      border: "none",
      borderRadius: 11,
      width: 38,
      height: 38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 16,
    color: "#25D366"
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    style: {
      marginBottom: 10
    },
    onClick: () => setMode("create")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 17,
    color: "#fff"
  }), " ", L.createGroup), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => setMode("join")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 16,
    color: "var(--text)"
  }), " ", L.joinGroup)), mode === "create" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("list"),
    style: {
      background: "none",
      border: "none",
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 14,
      fontFamily: "inherit",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowleft",
    size: 17,
    cls: "flip-x"
  }), " ", L.back), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      width: 76,
      height: 76,
      borderRadius: 18,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 76,
      height: 76,
      borderRadius: 18,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 34,
    color: "var(--brand-2)"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      position: "absolute",
      bottom: -4,
      insetInlineEnd: -4,
      width: 30,
      height: 30,
      borderRadius: 9,
      border: "2px solid var(--ink-2)",
      background: "var(--brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 14,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    onChange: onFile,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--muted)",
      margin: "0 0 7px"
    }
  }, L.groupName), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: L.groupName,
    "aria-label": L.groupName,
    style: {
      width: "100%",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 13,
      padding: "13px 14px",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 16,
      outline: "none",
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    disabled: !name.trim(),
    onClick: () => onCreate(name.trim(), photo)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 17,
    color: "#fff"
  }), " ", L.createBtn)), mode === "join" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("list"),
    style: {
      background: "none",
      border: "none",
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 14,
      fontFamily: "inherit",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowleft",
    size: 17,
    cls: "flip-x"
  }), " ", L.back), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--muted)",
      margin: "0 0 7px"
    }
  }, L.enterCode), /*#__PURE__*/React.createElement("input", {
    value: code,
    onChange: e => setCode(e.target.value.toUpperCase()),
    placeholder: "K7M2QX",
    "aria-label": L.enterCode,
    style: {
      width: "100%",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 13,
      padding: "13px 14px",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 18,
      letterSpacing: "2px",
      textAlign: "center",
      outline: "none",
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    disabled: code.trim().length < 4,
    onClick: () => onJoin(code.trim())
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 17,
    color: "#fff"
  }), " ", L.joinBtn))));
}
function GroupCreatedSheet({
  group,
  onInvite,
  onCopy,
  onClose,
  L
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spark",
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 12
    }
  }, group.photo ? /*#__PURE__*/React.createElement("img", {
    src: group.photo,
    alt: "",
    style: {
      width: 64,
      height: 64,
      borderRadius: 18,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 18,
      background: "var(--brand-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 30,
    color: "var(--brand-2)"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      textAlign: "center",
      fontSize: 21,
      fontWeight: 800,
      margin: "0 0 4px"
    }
  }, L.shareGroupT), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      fontSize: 13.5,
      margin: "0 0 14px"
    }
  }, L.shareGroupS), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: "center",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 16
    }
  }, group.name), /*#__PURE__*/React.createElement("div", {
    className: "tnum disp",
    style: {
      fontSize: 26,
      fontWeight: 900,
      letterSpacing: "3px",
      color: "var(--brand-2)",
      marginTop: 4
    }
  }, group.code)), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      background: "#25D366",
      marginBottom: 10
    },
    onClick: () => onInvite(group)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 17,
    color: "#fff"
  }), " ", L.inviteWa), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      marginBottom: 10
    },
    onClick: () => onCopy(group)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image",
    size: 16,
    color: "var(--brand-2)"
  }), " ", L.copyLink), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    onClick: onClose
  }, L.doneBtn, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "#fff"
  }))));
}

/* ---------- Sign-in gate (Google) ---------- */
function SignIn({
  onSignIn,
  lang,
  onLang,
  L
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "hunch-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "device",
    style: {
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    onClick: onLang,
    "aria-label": L.langT,
    style: {
      position: "absolute",
      top: 18,
      insetInlineEnd: 18,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 14
  }), " ", LANGS.find(l => l.code === lang).label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
      position: "relative",
      zIndex: 2,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: 22,
      background: "linear-gradient(180deg,var(--brand-2),var(--brand))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 22,
      boxShadow: "0 16px 40px rgba(138,107,255,.45)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 38,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontWeight: 900,
      fontSize: 40,
      letterSpacing: "-.04em",
      marginBottom: 10
    }
  }, "Eyevos", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--yes)"
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--muted)",
      fontSize: 15,
      maxWidth: 280,
      margin: "0 0 36px",
      lineHeight: 1.5
    }
  }, L.tagline), /*#__PURE__*/React.createElement("button", {
    onClick: onSignIn,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 11,
      width: "100%",
      maxWidth: 320,
      background: "#fff",
      color: "#1f1f1f",
      border: "none",
      borderRadius: 14,
      padding: "15px",
      fontFamily: "inherit",
      fontWeight: 800,
      fontSize: 15.5,
      cursor: "pointer",
      boxShadow: "0 8px 22px rgba(0,0,0,.3)"
    }
  }, /*#__PURE__*/React.createElement(GoogleG, {
    size: 20
  }), " ", L.continueGoogle), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--faint)",
      fontSize: 12,
      marginTop: 18,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 13,
    color: "var(--faint)"
  }), " ", L.signInPriv)))));
}

/* ---------- root ---------- */
const STORE = "hunch_user_v4";
function genCode(taken) {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s;
  do {
    s = "";
    for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)];
  } while (taken && taken.indexOf(s) >= 0);
  return s;
}
function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("hunch_lang") || "he";
    } catch (e) {
      return "he";
    }
  });
  const embedded = (() => {
    try {
      return document.body.classList.contains("embed");
    } catch (e) {
      return false;
    }
  })();
  const [signedIn, setSignedIn] = useState(embedded);
  const [me, setMe] = useState(ME_SEED);
  const [tab, setTab] = useState("feed");
  const [group, setGroup] = useState("squad");
  const [groups, setGroups] = useState(INIT_GROUPS);
  const [polls, setPolls] = useState(SEED);
  const [filter, setFilter] = useState("all");
  const [consent, setConsent] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [resolveP, setResolveP] = useState(null);
  const [editing, setEditing] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [sharedGroup, setSharedGroup] = useState(null);
  const [soundOn, setSoundOn] = useState(SOUND.on);
  const [daily, setDaily] = useState(0);
  const [toast, setToast] = useState(null);
  const L = dict(lang);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const u = JSON.parse(raw);
        setMe(m => ({
          ...m,
          name: u.name || m.name,
          photo: u.photo || null
        }));
        setSignedIn(true);
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = (LANGS.find(l => l.code === lang) || {}).dir || "ltr";
    try {
      localStorage.setItem("hunch_lang", lang);
    } catch (e) {}
  }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  // daily login bonus — once per day, points only, a small celebration (never below zero, no purchase)
  useEffect(() => {
    if (!signedIn || embedded) return;
    let today, last;
    try {
      today = new Date().toISOString().slice(0, 10);
    } catch (e) {
      return;
    }
    try {
      last = localStorage.getItem("eyevos_daily");
    } catch (e) {}
    if (last !== today) {
      const t = setTimeout(() => setDaily(5), 600);
      return () => clearTimeout(t);
    }
  }, [signedIn]);
  const claimDaily = () => {
    setMe(m => ({
      ...m,
      s: {
        ...m.s,
        life: (m.s.life || 0) + daily
      }
    }));
    try {
      localStorage.setItem("eyevos_daily", new Date().toISOString().slice(0, 10));
    } catch (e) {}
    SOUND.win(2);
    setDaily(0);
    setToast(L.dailyT);
  };
  const subjects = SUBJECT_KEYS;
  const members = [me, ...SEED_MEMBERS];
  const groupPolls = polls.filter(p => p.group === group);
  // a pending (consent) person-poll is visible ONLY to its author and the tagged person
  const visiblePolls = groupPolls.filter(p => p.status !== "pending" || p.by === me.name || p.tagged === me.name);
  const pendingForMe = groupPolls.filter(p => p.status === "pending" && p.tagged === me.name);
  const pendingCount = pendingForMe.length;
  const curGroup = groups.find(g => g.id === group) || groups[0];
  const signIn = () => {
    setSignedIn(true);
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: me.name,
        photo: me.photo
      }));
    } catch (e) {}
  };
  const signOut = () => {
    try {
      localStorage.removeItem(STORE);
    } catch (e) {}
    setSignedIn(false);
    setTab("feed");
  };
  const vote = (id, side, conf) => {
    const p = polls.find(x => x.id === id);
    if (!p) return;
    if (p.tagged && p.tagged === me.name) return setToast(L.cantVoteSelf);
    if (p.status !== "live") return setToast(L.voteClosed);
    if (p.mine) return setToast(L.already);
    setPolls(ps => ps.map(x => x.id === id ? {
      ...x,
      mine: side,
      mineConf: conf || 1,
      [side]: x[side] + 1
    } : x));
    SOUND.tick();
  };
  const create = d => {
    if (d.q.trim().length <= 4) return setToast(L.needLong);
    const id = Date.now();
    const ends = d.ends || "בקרוב";
    if (d.type === "person") {
      setPolls(ps => [{
        id,
        ...d,
        by: me.name,
        yes: 0,
        no: 0,
        mine: null,
        ends,
        status: "pending"
      }, ...ps]);
      setToast(L.sent);
    } else {
      setPolls(ps => [{
        id,
        ...d,
        by: me.name,
        yes: 0,
        no: 0,
        mine: null,
        ends,
        status: "live"
      }, ...ps]);
      setToast(L.created);
    }
    setGroup(d.group);
    setTab("feed");
  };

  // only the tagged person may approve/decline a poll about them
  const approve = poll => {
    if (poll.tagged !== me.name) return setToast(L.cantVoteSelf);
    setPolls(ps => ps.map(p => p.id === poll.id ? {
      ...p,
      status: "live"
    } : p));
    setConsent(null);
    setTab("feed");
    setToast(L.approved);
  };
  const decline = poll => {
    if (poll.tagged !== me.name) return;
    setPolls(ps => ps.filter(p => p.id !== poll.id));
    setConsent(null);
    setToast(L.declined);
  };
  const confirmResolve = (poll, outcome, proof) => {
    if (outcome === "void") {
      setPolls(ps => ps.map(p => p.id === poll.id ? {
        ...p,
        status: "void",
        result: "void"
      } : p));
      setResolveP(null);
      setToast(L.voidedToast);
      return;
    }
    if (!outcome) return setToast(L.pickOutcome);
    if (resolveMethod(poll) === "proof" && !proof) return setToast(L.proofMissing);
    setPolls(ps => ps.map(p => p.id === poll.id ? {
      ...p,
      status: "resolved",
      result: outcome,
      proof: proof || null
    } : p));
    setResolveP(null);
    setToast(L.resolvedToast);
    revealAndCredit({
      ...poll,
      status: "resolved",
      result: outcome,
      proof: proof || null
    });
  };

  // open the result AND actually pay the points into your account (once) — the real game loop
  const revealAndCredit = poll => {
    const before = poll._sb != null ? poll._sb : me.streak; // streak captured at credit time (stable on re-open)
    if (poll.result && poll.result !== "void" && poll.mine && !poll.credited) {
      const p = payout(poll, before);
      if (p.myWin) {
        setMe(m => ({
          ...m,
          s: {
            ...m.s,
            [poll.subject]: (m.s[poll.subject] || 0) + p.earned
          },
          streak: p.streakAfter
        }));
      } else if (p.cost > 0) {
        // wrong high-conviction bet costs points — but NEVER below zero (no debt, ever)
        setMe(m => ({
          ...m,
          s: {
            ...m.s,
            [poll.subject]: Math.max(0, (m.s[poll.subject] || 0) - p.cost)
          },
          streak: 0
        }));
      } else {
        setMe(m => ({
          ...m,
          streak: 0
        }));
      }
      setPolls(ps => ps.map(x => x.id === poll.id ? {
        ...x,
        credited: true,
        _sb: before
      } : x));
    }
    setReveal({
      ...poll,
      _streakBefore: before
    });
  };
  const react = (id, emoji) => {
    setPolls(ps => ps.map(p => {
      if (p.id !== id) return p;
      const r = {
        ...(p.reactions || {})
      };
      r[emoji] = (r[emoji] || 0) + 1;
      return {
        ...p,
        reactions: r
      };
    }));
  };
  const report = () => {
    setConsent(null);
    setToast(L.reported);
  };
  const share = (poll, p) => {
    const side = p.won === "yes" ? L.yes : L.no;
    const url = (typeof location !== "undefined" ? location.origin : "") + "/";
    const text = L.shareText(poll.q, side, p.earned) + " " + url;
    try {
      if (navigator.share) {
        navigator.share({
          title: "Eyevos",
          text
        });
        return;
      }
    } catch (e) {}
    let ok = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) {}
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) {}
    }
    setToast(L.shareCopied);
  };
  const saveProfile = d => {
    setMe(m => ({
      ...m,
      name: d.name,
      photo: d.photo
    }));
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: d.name,
        photo: d.photo
      }));
    } catch (e) {}
    setEditing(false);
    setToast(L.savedProfile);
  };
  const createGroup = (name, photo) => {
    const id = "g" + Date.now();
    const code = genCode(groups.map(g => g.code));
    const g = {
      id,
      name,
      code,
      count: 1,
      photo: photo || null,
      seasonLeft: SEASON_DAYS
    };
    setGroups(gs => [...gs, g]);
    setMe(m => ({
      ...m,
      g: [...(m.g || []), id]
    }));
    setGroup(id);
    setGroupOpen(false);
    setSharedGroup(g); // -> share/invite step
  };
  const copyInvite = g => {
    const url = (typeof location !== "undefined" ? location.origin : "") + "/";
    const text = L.inviteText(g.name, g.code, url);
    let ok = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) {}
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) {}
    }
    setToast(L.shareCopied);
  };
  const joinGroup = code => {
    const g = groups.find(x => x.code.toUpperCase() === code.toUpperCase());
    if (!g) return setToast(L.badCode);
    setMe(m => ({
      ...m,
      g: (m.g || []).indexOf(g.id) >= 0 ? m.g : [...(m.g || []), g.id]
    }));
    setGroups(gs => gs.map(x => x.id === g.id ? {
      ...x,
      count: x.count + 1
    } : x));
    setGroup(g.id);
    setGroupOpen(false);
    setToast(L.joinedGroup);
  };
  const inviteGroup = g => {
    const url = (typeof location !== "undefined" ? location.origin : "") + "/";
    const text = L.inviteText(g.name, g.code, url);
    const wa = "https://wa.me/?text=" + encodeURIComponent(text);
    try {
      window.open(wa, "_blank");
    } catch (e) {}
  };
  if (!signedIn) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SignIn, {
      onSignIn: signIn,
      lang: lang,
      onLang: () => setLangOpen(true),
      L: L
    }), langOpen && /*#__PURE__*/React.createElement(LangSheet, {
      lang: lang,
      onPick: c => {
        setLang(c);
        setLangOpen(false);
      },
      onClose: () => setLangOpen(false),
      L: L
    }));
  }
  const total = sumScores(me.s);
  return /*#__PURE__*/React.createElement("div", {
    className: "hunch-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "device"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow"
  }), tab !== "create" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 8px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "disp",
    style: {
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: "-.03em"
    }
  }, "Eyevos", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--yes)"
    }
  }, ".")), tab === "feed" && /*#__PURE__*/React.createElement("button", {
    className: "chip",
    style: {
      padding: "4px 10px",
      fontSize: 12
    },
    onClick: () => setGroupOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 12
  }), " ", curGroup.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      opacity: .65
    }
  }, L.membersOf(curGroup.count)), " ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 12,
    cls: "flip-x"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip",
    style: {
      padding: "6px 8px"
    },
    onClick: () => setSoundOn(SOUND.toggle()),
    "aria-label": "sound"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: soundOn ? "volume" : "mute",
    size: 13,
    color: soundOn ? "var(--brand-2)" : "var(--faint)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    style: {
      padding: "6px 9px",
      fontSize: 11.5
    },
    onClick: () => setLangOpen(true),
    "aria-label": L.langT
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 13
  }), " ", (LANGS.find(l => l.code === lang) || {}).flag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "var(--gold-soft)",
      padding: "6px 11px",
      borderRadius: 999,
      boxShadow: "0 0 16px rgba(255,194,60,.25)"
    },
    title: L.totalPts
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 14,
    color: "var(--gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tnum goldglow",
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: "var(--gold)"
    }
  }, total)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (pendingForMe[0]) setConsent(pendingForMe[0]);else setToast(L.noNotifs);
    },
    style: {
      position: "relative",
      background: "var(--ink-3)",
      border: "1px solid var(--line)",
      borderRadius: 12,
      width: 38,
      height: 38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "var(--text)"
    },
    "aria-label": "notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17
  }), pendingCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -4,
      insetInlineEnd: -4,
      background: "var(--yes)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      borderRadius: 99,
      minWidth: 17,
      height: 17,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4px"
    }
  }, pendingCount)))), tab === "feed" && /*#__PURE__*/React.createElement("p", {
    className: "disp",
    style: {
      fontSize: 26,
      fontWeight: 800,
      margin: "14px 0 0",
      lineHeight: 1.1
    }
  }, L.headline1, /*#__PURE__*/React.createElement("br", null), L.headline2), tab === "board" && /*#__PURE__*/React.createElement("p", {
    className: "disp",
    style: {
      fontSize: 24,
      fontWeight: 800,
      margin: "12px 0 2px"
    }
  }, L.boardHeadline), tab === "rules" && /*#__PURE__*/React.createElement("p", {
    className: "disp",
    style: {
      fontSize: 24,
      fontWeight: 800,
      margin: "12px 0 2px"
    }
  }, L.rulesT)), /*#__PURE__*/React.createElement("div", {
    className: "scroll"
  }, tab === "feed" && /*#__PURE__*/React.createElement(Feed, {
    polls: visiblePolls,
    meName: me.name,
    members: members.filter(m => (m.g || []).indexOf(group) >= 0),
    filter: filter,
    setFilter: setFilter,
    subjects: subjects,
    season: curGroup.seasonLeft,
    onVote: vote,
    onOpenConsent: setConsent,
    onReveal: revealAndCredit,
    onResolve: setResolveP,
    onReport: report,
    onReact: react,
    L: L
  }), tab === "create" && /*#__PURE__*/React.createElement(CreateFlow, {
    onCreate: create,
    onCancel: () => setTab("feed"),
    onOpenGroups: () => setGroupOpen(true),
    myGroups: groups.filter(g => (me.g || []).indexOf(g.id) >= 0),
    members: members,
    subjects: subjects,
    L: L
  }), tab === "board" && /*#__PURE__*/React.createElement(Board, {
    members: members,
    groups: groups,
    subjects: subjects,
    currentGroup: group,
    L: L
  }), tab === "rules" && /*#__PURE__*/React.createElement(RulesScreen, {
    L: L
  }), tab === "profile" && /*#__PURE__*/React.createElement(Profile, {
    me: me,
    subjects: subjects,
    L: L,
    onEdit: () => setEditing(true),
    onSignOut: signOut
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "navb" + (tab === "feed" ? " on" : ""),
    onClick: () => setTab("feed")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home",
    size: 21
  }), " ", L.feed), /*#__PURE__*/React.createElement("button", {
    className: "navb" + (tab === "board" ? " on" : ""),
    onClick: () => setTab("board")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 21
  }), " ", L.ranks), /*#__PURE__*/React.createElement("button", {
    className: "fab",
    onClick: () => setTab("create"),
    "aria-label": L.createNav
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 26,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "navb" + (tab === "rules" ? " on" : ""),
    onClick: () => setTab("rules")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 21
  }), " ", L.rules), /*#__PURE__*/React.createElement("button", {
    className: "navb" + (tab === "profile" ? " on" : ""),
    onClick: () => setTab("profile")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 21
  }), " ", L.you)), consent && /*#__PURE__*/React.createElement(ConsentSheet, {
    poll: consent,
    onApprove: approve,
    onDecline: decline,
    onReport: report,
    onClose: () => setConsent(null),
    L: L
  }), resolveP && /*#__PURE__*/React.createElement(ResolveSheet, {
    poll: resolveP,
    onConfirm: confirmResolve,
    onClose: () => setResolveP(null),
    L: L
  }), reveal && /*#__PURE__*/React.createElement(ResultSheet, {
    poll: reveal,
    streakBefore: reveal._streakBefore != null ? reveal._streakBefore : me.streak,
    onClose: () => setReveal(null),
    onShare: share,
    onReact: react,
    L: L
  }), editing && /*#__PURE__*/React.createElement(EditProfileSheet, {
    me: me,
    onSave: saveProfile,
    onClose: () => setEditing(false),
    L: L
  }), langOpen && /*#__PURE__*/React.createElement(LangSheet, {
    lang: lang,
    onPick: c => {
      setLang(c);
      setLangOpen(false);
    },
    onClose: () => setLangOpen(false),
    L: L
  }), groupOpen && /*#__PURE__*/React.createElement(GroupSheet, {
    groups: groups.filter(g => (me.g || []).indexOf(g.id) >= 0),
    current: group,
    onPick: id => {
      setGroup(id);
      setGroupOpen(false);
    },
    onCreate: createGroup,
    onJoin: joinGroup,
    onInvite: inviteGroup,
    onClose: () => setGroupOpen(false),
    L: L
  }), sharedGroup && /*#__PURE__*/React.createElement(GroupCreatedSheet, {
    group: sharedGroup,
    onInvite: inviteGroup,
    onCopy: copyInvite,
    onClose: () => setSharedGroup(null),
    L: L
  }), daily > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: claimDaily
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheetcard",
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Confetti, null), /*#__PURE__*/React.createElement("div", {
    className: "grab"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      margin: "4px 0 2px"
    }
  }, "\uD83C\uDF81"), /*#__PURE__*/React.createElement("h3", {
    className: "disp jackpot",
    style: {
      fontSize: 26,
      fontWeight: 900,
      margin: "0 0 4px"
    }
  }, L.dailyT), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--muted)",
      fontSize: 13.5,
      margin: "0 0 6px"
    }
  }, L.dailyS(daily)), /*#__PURE__*/React.createElement("div", {
    className: "disp tnum win-num goldglow",
    style: {
      fontSize: 42,
      fontWeight: 900,
      color: "var(--gold)",
      margin: "2px 0 18px"
    }
  }, "+", daily), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-pri",
    onClick: claimDaily
  }, L.dailyClaim, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16,
    color: "#fff"
  })))), toast && /*#__PURE__*/React.createElement("div", {
    className: "toast"
  }, toast))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));