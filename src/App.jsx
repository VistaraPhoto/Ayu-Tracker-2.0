import { useState, useEffect } from "react";

const STORAGE_KEY = "ayu_tracker_v2";

const MOODS = [
  { id: "happy", emoji: "🌸", label: "Senang" },
  { id: "sad", emoji: "🥺", label: "Sedih" },
  { id: "anxious", emoji: "😟", label: "Cemas" },
  { id: "tired", emoji: "😴", label: "Lelah" },
  { id: "romantic", emoji: "🥰", label: "Romantis" },
  { id: "angry", emoji: "😤", label: "Emosi" },
  { id: "calm", emoji: "☁️", label: "Tenang" },
  { id: "energetic", emoji: "✨", label: "Semangat" },
];

const SYMPTOMS = [
  { id: "cramps", emoji: "🌀", label: "Kram" },
  { id: "headache", emoji: "💫", label: "Sakit Kepala" },
  { id: "bloating", emoji: "🫧", label: "Perut Kembung" },
  { id: "backpain", emoji: "🔅", label: "Sakit Pinggang" },
  { id: "nausea", emoji: "🌿", label: "Mual" },
  { id: "tender", emoji: "🌷", label: "Payudara Nyeri" },
  { id: "acne", emoji: "🌺", label: "Jerawat" },
  { id: "fatigue", emoji: "🍃", label: "Lelah Banget" },
];

const FLOW = [
  { id: "light", label: "Ringan", dots: 1 },
  { id: "medium", label: "Sedang", dots: 2 },
  { id: "heavy", label: "Deras", dots: 3 },
];

const DAILY_MESSAGES = [
  { phase: "period", msg: "Istirahat yang cukup ya sayang 🌸 Tubuhmu lagi kerja keras hari ini.", care: "Coba kompres hangat di perut, minum teh jahe, dan kurangi aktivitas berat 🍵" },
  { phase: "period", msg: "Kamu kuat banget! Haid itu tanda tubuhmu sehat 💪🌺", care: "Perbanyak makan dark chocolate & pisang untuk bantu mood ya 🍫🍌" },
  { phase: "fertile", msg: "Kamu lagi di puncak energimu! Manfaatkan hari ini 🌿✨", care: "Bagus untuk olahraga ringan, jalan pagi, atau aktivitas kreatif 🎨" },
  { phase: "pms", msg: "Kalau lagi sensitif, itu wajar ya 🥺 Kamu tetap dicinta apa adanya 💕", care: "Kurangi kafein & garam, perbanyak sayur & buah segar 🥗" },
  { phase: "normal", msg: "Hari ini adalah hadiah untukmu 🌙 Jalani dengan penuh syukur!", care: "Jaga hidrasi minimal 8 gelas air putih hari ini ya 💧" },
  { phase: "normal", msg: "Senyummu itu investasi terbaik hari ini 😊🌸", care: "Tidur cukup 7-8 jam malam ini untuk menjaga siklus tetap teratur 🌙" },
  { phase: "ovulation", msg: "Tubuhmu sedang bekerja dengan sempurna hari ini ✨", care: "Ini waktu terbaik untuk aktivitas fisik yang kamu suka 🏃‍♀️" },
];

const BOYFRIEND_TRIGGERS = [
  { phase: "period", label: "Saat haid" },
  { phase: "pms", label: "Saat PMS (3-5 hari sebelum)" },
  { phase: "ovulation", label: "Saat masa subur" },
  { phase: "any", label: "Setiap hari" },
];

const SELFCARE = {
  period: [
    { emoji: "🍫", tip: "Dark chocolate bantu mood & kram" },
    { emoji: "🍵", tip: "Teh jahe atau chamomile hangat" },
    { emoji: "🛁", tip: "Mandi air hangat untuk relaksasi" },
    { emoji: "🌡️", tip: "Kompres hangat di perut bawah" },
    { emoji: "😴", tip: "Istirahat lebih banyak dari biasanya" },
  ],
  fertile: [
    { emoji: "🏃‍♀️", tip: "Waktu terbaik untuk olahraga" },
    { emoji: "🥗", tip: "Perbanyak sayuran hijau & protein" },
    { emoji: "💧", tip: "Hidrasi ekstra hari ini" },
    { emoji: "🧘‍♀️", tip: "Yoga atau stretching pagi" },
  ],
  pms: [
    { emoji: "🍌", tip: "Pisang & magnesium bantu mood" },
    { emoji: "☕", tip: "Kurangi kafein & gula" },
    { emoji: "🚶‍♀️", tip: "Jalan santai 20 menit" },
    { emoji: "💆‍♀️", tip: "Pijat ringan atau meditasi" },
    { emoji: "🫂", tip: "Cerita ke orang yang dipercaya" },
  ],
  normal: [
    { emoji: "💧", tip: "Minum 8 gelas air putih" },
    { emoji: "😴", tip: "Tidur 7-8 jam malam ini" },
    { emoji: "🌞", tip: "Paparan sinar matahari pagi" },
    { emoji: "🥦", tip: "Makan sayur & buah beragam" },
  ],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
      periods: [], logs: {}, cycleLength: 28,
      boyfriendMessages: [], partnerName: "Sayang"
    };
  } catch {
    return { periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "Sayang" };
  }
}

function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
function toDateKey(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function predictNextPeriods(periods, cycleLength) {
  if (!periods.length) return [];
  const sorted = [...periods].sort((a, b) => new Date(a) - new Date(b));
  const last = new Date(sorted[sorted.length - 1]);
  return [1, 2, 3].map(i => { const d = new Date(last); d.setDate(d.getDate() + cycleLength * i); return d; });
}

function getPeriodDates(periods) {
  const set = new Set();
  periods.forEach(p => {
    for (let i = 0; i < 5; i++) {
      const d = new Date(p); d.setDate(d.getDate() + i);
      set.add(d.toISOString().split("T")[0]);
    }
  });
  return set;
}

function analyzeCycle(periods, cycleLength) {
  if (periods.length < 2) return null;
  const sorted = [...periods].sort((a, b) => new Date(a) - new Date(b));
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / (1000 * 60 * 60 * 24)));
  }
  const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  const last = gaps[gaps.length - 1];
  const diff = last - cycleLength;
  let status = "normal", conclusion = "", suggestion = "";
  if (Math.abs(diff) <= 3) {
    status = "normal";
    conclusion = "Siklus haidmu sangat teratur! 🌸";
    suggestion = "Pertahankan pola tidur & makan yang sehat ya.";
  } else if (diff > 3 && diff <= 7) {
    status = "late";
    conclusion = `Siklus terakhir lebih panjang ${diff} hari dari biasanya.`;
    suggestion = "Bisa karena stres, kurang tidur, atau perubahan pola makan. Jangan terlalu khawatir ya 💕";
  } else if (diff > 7) {
    status = "very_late";
    conclusion = `Siklus terakhir terlambat ${diff} hari dari biasanya.`;
    suggestion = "Kalau sudah lebih dari 45 hari, ada baiknya konsultasi ke dokter ya sayang 🩺";
  } else if (diff < -3 && diff >= -7) {
    status = "early";
    conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Siklus yang lebih pendek bisa karena aktivitas fisik intens atau perubahan hormonal ringan.";
  } else {
    status = "very_early";
    conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Kalau terus berlanjut, ada baiknya dicatat dan dikonsultasikan ke dokter 🩺";
  }
  return { avg, last, diff, status, conclusion, suggestion, total: periods.length };
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("home");
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [logModal, setLogModal] = useState(false);
  const [logDate, setLogDate] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bfModal, setBfModal] = useState(false);
  const [newMsg, setNewMsg] = useState({ text: "", phase: "period", emoji: "💕" });
  const [notification, setNotification] = useState(null);

  useEffect(() => { saveData(data); }, [data]);

  const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 2500); };

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const periodDates = getPeriodDates(data.periods);
  const predictions = predictNextPeriods(data.periods, data.cycleLength);
  const predDates = getPeriodDates(predictions.map(d => d.toISOString()));

  const sorted = [...data.periods].sort((a, b) => new Date(b) - new Date(a));
  const lastPeriod = sorted[0] ? new Date(sorted[0]) : null;
  const nextPeriod = predictions[0];
  const daysUntilNext = nextPeriod ? Math.ceil((nextPeriod - today) / 86400000) : null;
  const isOnPeriod = periodDates.has(todayKey);
  const dayOfCycle = lastPeriod ? Math.floor((today - lastPeriod) / 86400000) + 1 : null;

  // Phase detection
  let phase = "normal";
  if (isOnPeriod) phase = "period";
  else if (dayOfCycle) {
    const half = data.cycleLength / 2;
    if (dayOfCycle >= half - 3 && dayOfCycle <= half + 1) phase = "fertile";
    else if (dayOfCycle === Math.floor(half)) phase = "ovulation";
    else if (daysUntilNext && daysUntilNext <= 5) phase = "pms";
  }

  const phaseConfig = {
    period: { emoji: "🌸", label: "Lagi Haid", color: "#e91e8c", bg: "linear-gradient(135deg,#f06292,#e91e8c)" },
    fertile: { emoji: "🌿", label: "Masa Subur", color: "#43a047", bg: "linear-gradient(135deg,#a5d6a7,#43a047)" },
    ovulation: { emoji: "✨", label: "Ovulasi", color: "#7b1fa2", bg: "linear-gradient(135deg,#ce93d8,#7b1fa2)" },
    pms: { emoji: "🌺", label: "Hampir Haid", color: "#f06292", bg: "linear-gradient(135deg,#f8bbd0,#f06292)" },
    normal: { emoji: "🌙", label: "Hari Biasa", color: "#e91e8c", bg: "linear-gradient(135deg,#f48fb1,#e91e8c)" },
  };
  const pc = phaseConfig[phase];

  // Daily message
  const todayMsgs = DAILY_MESSAGES.filter(m => m.phase === phase || m.phase === "normal");
  const dailyMsg = todayMsgs[today.getDate() % todayMsgs.length];

  // Boyfriend messages for today's phase
  const bfMsgs = (data.boyfriendMessages || []).filter(m => m.phase === phase || m.phase === "any");

  // Mood predictor
  const tomorrowCycleDay = dayOfCycle ? dayOfCycle + 1 : null;
  let tomorrowMood = "Hari normal 😊";
  if (tomorrowCycleDay) {
    const half = data.cycleLength / 2;
    if (tomorrowCycleDay >= 1 && tomorrowCycleDay <= 2) tomorrowMood = "Mungkin masih lemas, butuh istirahat 😴";
    else if (tomorrowCycleDay >= 3 && tomorrowCycleDay <= 5) tomorrowMood = "Mulai membaik, semangat pelan-pelan ✨";
    else if (tomorrowCycleDay >= half - 2 && tomorrowCycleDay <= half + 1) tomorrowMood = "Energi tinggi, mood bagus! 🌿";
    else if (daysUntilNext && daysUntilNext <= 6) tomorrowMood = "Mungkin agak sensitif, butuh lebih banyak perhatian 🥺";
    else tomorrowMood = "Mood stabil dan menyenangkan 🌸";
  }

  const analysis = analyzeCycle(data.periods, data.cycleLength);
  const selfCare = SELFCARE[phase] || SELFCARE.normal;

  const togglePeriod = (dateKey) => {
    const exists = data.periods.includes(dateKey);
    setData(d => ({ ...d, periods: exists ? d.periods.filter(p => p !== dateKey) : [...d.periods, dateKey] }));
    showNotif(exists ? "Tanda haid dihapus 🌿" : "Hari pertama haid ditandai 🌸");
  };

  const updateLog = (field, value) => {
    setData(d => ({ ...d, logs: { ...d.logs, [logDate]: { ...(d.logs[logDate] || {}), [field]: value } } }));
  };
  const toggleArrayLog = (field, value) => {
    const cur = (data.logs[logDate] || {})[field] || [];
    updateLog(field, cur.includes(value) ? cur.filter(x => x !== value) : [...cur, value]);
  };
  const currentLog = logDate ? data.logs[logDate] || {} : {};

  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const getDayStatus = (key) => {
    if (periodDates.has(key)) return "period";
    if (predDates.has(key)) return "predicted";
    const d = new Date(key + "T00:00:00");
    if (lastPeriod) {
      const diff = Math.floor((d - lastPeriod) / 86400000);
      const half = data.cycleLength / 2;
      if (diff === Math.floor(half)) return "ovulation";
      if (diff >= half - 3 && diff <= half + 1) return "fertile";
    }
    return null;
  };

  const addBfMessage = () => {
    if (!newMsg.text.trim()) return;
    setData(d => ({ ...d, boyfriendMessages: [...(d.boyfriendMessages || []), { ...newMsg, id: Date.now() }] }));
    setNewMsg({ text: "", phase: "period", emoji: "💕" });
    showNotif("Pesan tersimpan 💕");
  };

  const deleteBfMsg = (id) => {
    setData(d => ({ ...d, boyfriendMessages: d.boyfriendMessages.filter(m => m.id !== id) }));
  };

  const s = {
    app: { minHeight: "100vh", width: "100%", maxWidth: "100vw", background: "linear-gradient(160deg,#fff0f5,#fce4ec,#f8bbd0)", fontFamily: "'Nunito',sans-serif", paddingBottom: 72, boxSizing: "border-box", overflowX: "hidden" },
    header: { background: "linear-gradient(135deg,#f48fb1,#e91e8c)", padding: "16px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(233,30,140,.25)", position: "sticky", top: 0, zIndex: 50 },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: 800 },
    headerSub: { color: "rgba(255,255,255,.85)", fontSize: 11, marginTop: 2 },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", border: "2px solid rgba(255,255,255,.5)", flexShrink: 0 },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #fce4ec", display: "flex", zIndex: 100, boxShadow: "0 -4px 20px rgba(244,143,177,.15)" },
    navBtn: (a) => ({ flex: 1, padding: "8px 0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "none", border: "none", cursor: "pointer", color: a ? "#e91e8c" : "#bbb", fontSize: 9, fontWeight: a ? 700 : 500, fontFamily: "'Nunito',sans-serif" }),
    card: { background: "#fff", borderRadius: 20, padding: "16px", margin: "10px 12px", boxShadow: "0 4px 20px rgba(244,143,177,.15)" },
    cardTitle: { fontSize: 11, color: "#e91e8c", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: .8 },
    circle: { width: 120, height: 120, borderRadius: "50%", background: pc.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: `0 8px 30px ${pc.color}66` },
    chip: (a) => ({ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${a ? "#e91e8c" : "#fce4ec"}`, background: a ? "linear-gradient(135deg,#fce4ec,#f8bbd0)" : "#fff", color: a ? "#c2185b" : "#aaa", fontSize: 12, fontWeight: a ? 700 : 500, cursor: "pointer" }),
    btn: (v) => ({ padding: "11px 24px", borderRadius: 14, border: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer", background: v === "primary" ? "linear-gradient(135deg,#f06292,#e91e8c)" : v === "danger" ? "linear-gradient(135deg,#ef9a9a,#e57373)" : "#fce4ec", color: v === "ghost" ? "#e91e8c" : "#fff" }),
    modal: { position: "fixed", inset: 0, background: "rgba(194,24,91,.15)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
    modalBox: { background: "#fff", borderRadius: "24px 24px 0 0", padding: "22px 16px 36px", width: "100%", maxWidth: "100vw", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" },
    sLabel: { fontSize: 12, fontWeight: 700, color: "#e91e8c", marginBottom: 8, marginTop: 14 },
    notif: { position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#f06292,#e91e8c)", color: "#fff", padding: "9px 20px", borderRadius: 20, fontWeight: 700, fontSize: 13, zIndex: 300, boxShadow: "0 4px 20px rgba(233,30,140,.3)", whiteSpace: "nowrap" },
    row: { display: "flex", gap: 8 },
    insightCard: (c) => ({ flex: 1, background: c, borderRadius: 14, padding: "12px 10px", textAlign: "center" }),
    statusBadge: (c) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 10, background: c, color: "#fff", fontSize: 11, fontWeight: 700 }),
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.app}>
        {/* HEADER */}
        <div style={s.header}>
          <div>
            <div style={s.headerTitle}>🌸 Halo, Ayu!</div>
            <div style={s.headerSub}>Tracker haid cantikmu 💕</div>
          </div>
          <div style={s.avatar} onClick={() => setSettingsOpen(true)}>⚙️</div>
        </div>

        {notification && <div style={s.notif}>{notification}</div>}

        {/* ===== HOME ===== */}
        {tab === "home" && (
          <>
            <div style={{ ...s.card, textAlign: "center", paddingTop: 20 }}>
              <div style={s.circle}>
                <div style={{ fontSize: 32 }}>{pc.emoji}</div>
                {dayOfCycle && <><div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{dayOfCycle}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Hari ke</div></>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#c2185b" }}>{pc.label}</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginTop: 4 }}>
                {daysUntilNext != null ? daysUntilNext > 0 ? `Haid berikutnya dalam ${daysUntilNext} hari` : "Waktunya haid nih! 🌸" : "Tandai haid pertamamu di Kalender"}
              </div>
              <button style={{ ...s.btn("ghost"), marginTop: 12, width: "100%" }} onClick={() => { setLogDate(todayKey); setLogModal(true); }}>
                📝 Catat Hari Ini
              </button>
            </div>

            {/* Daily message */}
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#f8bbd0)" }}>
              <div style={s.cardTitle}>💌 Pesan Harian</div>
              <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 600, lineHeight: 1.5 }}>{dailyMsg?.msg}</div>
              <div style={{ fontSize: 12, color: "#e91e8c", marginTop: 8, padding: "8px 12px", background: "rgba(255,255,255,.6)", borderRadius: 10 }}>
                💡 {dailyMsg?.care}
              </div>
            </div>

            {/* Boyfriend message */}
            {bfMsgs.length > 0 && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)", border: "1.5px solid #f8bbd0" }}>
                <div style={s.cardTitle}>💝 Dari {data.partnerName || "Sayang"}</div>
                {bfMsgs.map((m, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#c2185b", fontWeight: 600, padding: "8px 0", borderBottom: i < bfMsgs.length - 1 ? "1px solid #fce4ec" : "none" }}>
                    {m.emoji} {m.text}
                  </div>
                ))}
              </div>
            )}

            {/* Mood predictor */}
            <div style={s.card}>
              <div style={s.cardTitle}>🔮 Prediksi Mood Besok</div>
              <div style={{ fontSize: 13, color: "#888", padding: "8px 12px", background: "#fce4ec", borderRadius: 12 }}>
                {tomorrowMood}
              </div>
            </div>

            {/* Self care */}
            <div style={s.card}>
              <div style={s.cardTitle}>🌿 Self-Care Hari Ini</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selfCare.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#fce4ec", borderRadius: 10, fontSize: 13, color: "#c2185b" }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span> {c.tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div style={s.card}>
              <div style={s.cardTitle}>📊 Ringkasan</div>
              <div style={s.row}>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{data.cycleLength}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Panjang Siklus</div></div>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{data.periods.length}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Total Haid</div></div>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{daysUntilNext != null ? Math.max(0, daysUntilNext) : "-"}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Hari Lagi</div></div>
              </div>
            </div>
          </>
        )}

        {/* ===== KALENDER ===== */}
        {tab === "calendar" && (
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 10, padding: "5px 12px", fontSize: 16, cursor: "pointer" }}>‹</button>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#c2185b" }}>{MONTHS[calMonth]} {calYear}</div>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 10, padding: "5px 12px", fontSize: 16, cursor: "pointer" }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#f48fb1", padding: "3px 0" }}>{d}</div>)}
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const key = toDateKey(calYear, calMonth, day);
                const st = getDayStatus(key);
                const isToday = key === todayKey;
                const hasLog = !!data.logs[key];
                const bg = st === "period" ? "linear-gradient(135deg,#f06292,#e91e8c)" : st === "predicted" ? "linear-gradient(135deg,#f8bbd0,#f48fb1)" : st === "ovulation" ? "linear-gradient(135deg,#ce93d8,#ab47bc)" : st === "fertile" ? "linear-gradient(135deg,#c8e6c9,#66bb6a)" : isToday ? "#fce4ec" : "transparent";
                const color = st ? "#fff" : isToday ? "#e91e8c" : "#555";
                return (
                  <div key={day} style={{ position: "relative" }} onClick={() => { setLogDate(key); setLogModal(true); }}>
                    <div style={{ aspectRatio: "1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: isToday ? 800 : 500, background: bg, color, border: isToday && !st ? "2px solid #f48fb1" : "2px solid transparent", cursor: "pointer" }}>{day}</div>
                    {hasLog && <div style={{ position: "absolute", bottom: 1, right: 1, width: 5, height: 5, borderRadius: "50%", background: "#e91e8c" }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {[["#e91e8c","Haid"],["#f48fb1","Prediksi"],["#ab47bc","Ovulasi"],["#66bb6a","Subur"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
                </div>
              ))}
            </div>
            <button style={{ ...s.btn("primary"), width: "100%", marginTop: 14 }} onClick={() => togglePeriod(todayKey)}>
              {periodDates.has(todayKey) ? "❌ Hapus Haid Hari Ini" : "🌸 Tandai Haid Hari Ini"}
            </button>
            {predictions.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={s.cardTitle}>Prediksi Berikutnya</div>
                {predictions.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #fce4ec", fontSize: 13, color: "#888" }}>
                    <span>Siklus {i + 1}</span>
                    <span style={{ fontWeight: 700, color: "#e91e8c" }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ANALISA ===== */}
        {tab === "analysis" && (
          <>
            {analysis ? (
              <>
                <div style={s.card}>
                  <div style={s.cardTitle}>📊 Analisa Siklus</div>
                  <div style={s.row}>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.avg}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Rata-rata Siklus</div></div>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.last}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Siklus Terakhir</div></div>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.total}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Total Data</div></div>
                  </div>
                  <div style={{ marginTop: 14, padding: "12px", background: analysis.status === "normal" ? "#e8f5e9" : analysis.status.includes("late") ? "#fff3e0" : "#fce4ec", borderRadius: 14 }}>
                    <div style={{ fontWeight: 800, color: "#c2185b", fontSize: 14, marginBottom: 6 }}>
                      {analysis.status === "normal" && "✅ "}
                      {analysis.status === "late" && "⚠️ "}
                      {analysis.status === "very_late" && "🔴 "}
                      {analysis.status === "early" && "💙 "}
                      {analysis.status === "very_early" && "💙 "}
                      {analysis.conclusion}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{analysis.suggestion}</div>
                  </div>
                </div>

                {/* Cycle history */}
                <div style={s.card}>
                  <div style={s.cardTitle}>📅 Riwayat Haid</div>
                  {[...data.periods].sort((a, b) => new Date(b) - new Date(a)).slice(0, 6).map((p, i, arr) => {
                    const prev = arr[i + 1];
                    const gap = prev ? Math.round((new Date(p) - new Date(prev)) / 86400000) : null;
                    return (
                      <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #fce4ec" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>{new Date(p + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                          {gap && <div style={{ fontSize: 11, color: "#aaa" }}>Jarak: {gap} hari</div>}
                        </div>
                        {gap && <div style={s.statusBadge(Math.abs(gap - data.cycleLength) <= 3 ? "#66bb6a" : Math.abs(gap - data.cycleLength) <= 7 ? "#ffa726" : "#ef5350")}>
                          {Math.abs(gap - data.cycleLength) <= 3 ? "Normal" : gap > data.cycleLength ? `+${gap - data.cycleLength}` : `${gap - data.cycleLength}`}
                        </div>}
                      </div>
                    );
                  })}
                </div>

                {/* Mood report */}
                {Object.keys(data.logs).length > 0 && (
                  <div style={s.card}>
                    <div style={s.cardTitle}>💕 Laporan Mood Bulan Ini</div>
                    {(() => {
                      const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
                      const monthLogs = Object.entries(data.logs).filter(([k]) => k.startsWith(thisMonth));
                      const moodCount = {};
                      monthLogs.forEach(([, l]) => { if (l.mood) moodCount[l.mood] = (moodCount[l.mood] || 0) + 1; });
                      const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
                      return topMoods.length ? topMoods.map(([id, count]) => {
                        const m = MOODS.find(x => x.id === id);
                        return <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #fce4ec", fontSize: 13 }}>
                          <span>{m?.emoji} {m?.label}</span>
                          <span style={{ fontWeight: 700, color: "#e91e8c" }}>{count}x</span>
                        </div>;
                      }) : <div style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>Belum ada data mood bulan ini 🌸</div>;
                    })()}
                  </div>
                )}
              </>
            ) : (
              <div style={{ ...s.card, textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#c2185b", marginTop: 12 }}>Belum ada data cukup</div>
                <div style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>Tandai minimal 2 siklus haid untuk melihat analisa lengkap ya Ayu 🌸</div>
              </div>
            )}
          </>
        )}

        {/* ===== DARI PACAR ===== */}
        {tab === "boyfriend" && (
          <>
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)" }}>
              <div style={s.cardTitle}>💝 Pesan Dari {data.partnerName || "Sayang"}</div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Pesan ini akan muncul otomatis di beranda sesuai fase siklus Ayu 🌸</div>
              <div style={s.sLabel}>Nama Panggilan</div>
              <input value={data.partnerName || ""} onChange={e => setData(d => ({ ...d, partnerName: e.target.value }))}
                placeholder="misal: Sayang, Ayang, dll"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #fce4ec", fontFamily: "'Nunito',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              <div style={s.sLabel}>Tulis Pesan Baru</div>
              <textarea value={newMsg.text} onChange={e => setNewMsg(m => ({ ...m, text: e.target.value }))}
                placeholder="Tulis pesan penyemangat untuk Ayu 💕"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #fce4ec", fontFamily: "'Nunito',sans-serif", fontSize: 13, resize: "none", height: 70, outline: "none", boxSizing: "border-box" }} />
              <div style={s.sLabel}>Tampilkan Saat</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {BOYFRIEND_TRIGGERS.map(t => (
                  <button key={t.phase} style={s.chip(newMsg.phase === t.phase)} onClick={() => setNewMsg(m => ({ ...m, phase: t.phase }))}>{t.label}</button>
                ))}
              </div>
              <div style={s.sLabel}>Emoji</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["💕","🌸","🥰","💖","✨","🌹","🫂","💝"].map(e => (
                  <button key={e} onClick={() => setNewMsg(m => ({ ...m, emoji: e }))}
                    style={{ fontSize: 20, background: newMsg.emoji === e ? "#fce4ec" : "transparent", border: `2px solid ${newMsg.emoji === e ? "#e91e8c" : "transparent"}`, borderRadius: 10, padding: 4, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
              <button style={{ ...s.btn("primary"), width: "100%", marginTop: 14 }} onClick={addBfMessage}>💾 Simpan Pesan</button>
            </div>

            {(data.boyfriendMessages || []).length > 0 && (
              <div style={s.card}>
                <div style={s.cardTitle}>Pesan Tersimpan</div>
                {(data.boyfriendMessages || []).map(m => (
                  <div key={m.id} style={{ padding: "10px 0", borderBottom: "1px solid #fce4ec", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 600 }}>{m.emoji} {m.text}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{BOYFRIEND_TRIGGERS.find(t => t.phase === m.phase)?.label}</div>
                    </div>
                    <button onClick={() => deleteBfMsg(m.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#f48fb1" }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== CATATAN ===== */}
        {tab === "log" && (
          <div style={s.card}>
            <div style={s.cardTitle}>Riwayat Catatan</div>
            {Object.keys(data.logs).length === 0 ? (
              <div style={{ textAlign: "center", color: "#f48fb1", padding: "30px 0" }}>
                <div style={{ fontSize: 40 }}>🌸</div>
                <div style={{ marginTop: 8, fontSize: 13 }}>Belum ada catatan. Mulai dari beranda ya!</div>
              </div>
            ) : Object.entries(data.logs).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, log]) => (
              <div key={date} onClick={() => { setLogDate(date); setLogModal(true); }} style={{ padding: "10px 0", borderBottom: "1px solid #fce4ec", cursor: "pointer" }}>
                <div style={{ fontWeight: 700, color: "#c2185b", fontSize: 13 }}>{new Date(date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                  {log.mood && <span style={{ background: "#fce4ec", borderRadius: 8, padding: "2px 7px", fontSize: 11, color: "#e91e8c" }}>{MOODS.find(m => m.id === log.mood)?.emoji} {MOODS.find(m => m.id === log.mood)?.label}</span>}
                  {log.symptoms?.map(s => <span key={s} style={{ background: "#fce4ec", borderRadius: 8, padding: "2px 7px", fontSize: 11, color: "#e91e8c" }}>{SYMPTOMS.find(x => x.id === s)?.emoji}</span>)}
                </div>
                {log.note && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>"{log.note}"</div>}
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav style={s.nav}>
          {[
            { id: "home", emoji: "🏠", label: "Beranda" },
            { id: "calendar", emoji: "📅", label: "Kalender" },
            { id: "analysis", emoji: "📊", label: "Analisa" },
            { id: "boyfriend", emoji: "💝", label: "Dari Kamu" },
            { id: "log", emoji: "📝", label: "Catatan" },
          ].map(t => (
            <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
              <span style={{ fontSize: 20 }}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* LOG MODAL */}
        {logModal && logDate && (
          <div style={s.modal} onClick={() => setLogModal(false)}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#c2185b", marginBottom: 2 }}>Catatan 📝</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginBottom: 16 }}>{new Date(logDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
              <div style={s.sLabel}>🌸 Tandai Haid</div>
              <button style={{ ...s.btn(data.periods.includes(logDate) ? "danger" : "primary"), width: "100%" }} onClick={() => togglePeriod(logDate)}>
                {data.periods.includes(logDate) ? "❌ Hapus Tanda Haid" : "🌸 Ini Hari Pertama Haid"}
              </button>
              {(data.periods.includes(logDate) || periodDates.has(logDate)) && <>
                <div style={s.sLabel}>💧 Aliran Darah</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {FLOW.map(f => <button key={f.id} style={s.chip(currentLog.flow === f.id)} onClick={() => updateLog("flow", currentLog.flow === f.id ? null : f.id)}>{"●".repeat(f.dots)} {f.label}</button>)}
                </div>
              </>}
              <div style={s.sLabel}>💕 Mood</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.map(m => <button key={m.id} style={s.chip(currentLog.mood === m.id)} onClick={() => updateLog("mood", currentLog.mood === m.id ? null : m.id)}>{m.emoji} {m.label}</button>)}
              </div>
              <div style={s.sLabel}>🌿 Gejala</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SYMPTOMS.map(sym => <button key={sym.id} style={s.chip((currentLog.symptoms || []).includes(sym.id))} onClick={() => toggleArrayLog("symptoms", sym.id)}>{sym.emoji} {sym.label}</button>)}
              </div>
              <div style={s.sLabel}>✍️ Catatan</div>
              <textarea value={currentLog.note || ""} onChange={e => updateLog("note", e.target.value)}
                placeholder="Mau tulis apa hari ini, Ayu? 💕"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #fce4ec", fontFamily: "'Nunito',sans-serif", fontSize: 13, resize: "none", height: 70, outline: "none", boxSizing: "border-box" }} />
              <button style={{ ...s.btn("primary"), width: "100%", marginTop: 14 }} onClick={() => { setLogModal(false); showNotif("Catatan disimpan! 💕"); }}>Simpan 💾</button>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {settingsOpen && (
          <div style={s.modal} onClick={() => setSettingsOpen(false)}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#c2185b", marginBottom: 4 }}>⚙️ Pengaturan</div>
              <div style={s.sLabel}>📅 Panjang Siklus (hari)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setData(d => ({ ...d, cycleLength: Math.max(21, d.cycleLength - 1) }))} style={{ ...s.btn("ghost"), padding: "8px 16px" }}>−</button>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#e91e8c", flex: 1, textAlign: "center" }}>{data.cycleLength}</span>
                <button onClick={() => setData(d => ({ ...d, cycleLength: Math.min(40, d.cycleLength + 1) }))} style={{ ...s.btn("ghost"), padding: "8px 16px" }}>+</button>
              </div>
              <div style={s.sLabel}>🗑️ Hapus Semua Data</div>
              <button style={{ ...s.btn("danger"), width: "100%" }} onClick={() => { if (confirm("Yakin mau hapus semua data? 🥺")) { setData({ periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "" }); setSettingsOpen(false); showNotif("Data dihapus 🌿"); } }}>Hapus Semua Data</button>
              <button style={{ ...s.btn("ghost"), width: "100%", marginTop: 10 }} onClick={() => setSettingsOpen(false)}>Tutup</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}