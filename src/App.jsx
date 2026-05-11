import { useState, useEffect } from "react";

const STORAGE_KEY = "ayu_tracker_v3";

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

// 365 pesan motivasi & afirmasi positif harian
const DAILY_LOVE_MESSAGES = [
  "Hari ini adalah hari baru. Kamu berhak memulainya dengan ringan dan penuh harapan 🌸",
  "Tubuhmu bekerja keras untukmu setiap hari. Hargai dirimu dengan istirahat yang cukup 💆‍♀️",
  "Kamu sudah cukup. Tidak perlu jadi sempurna untuk layak bahagia ✨",
  "Satu langkah kecil hari ini tetap bermakna, meski terasa kecil 👣",
  "Jaga pikiranmu seperti kamu menjaga tubuhmu — hindari hal yang menguras energi 🌿",
  "Minum airmu hari ini. Tubuh yang terhidrasi adalah tubuh yang bahagia 💧",
  "Istirahat bukan kemalasan — itu bagian penting dari merawat dirimu 🛌",
  "Perasaanmu hari ini valid. Boleh sedih, boleh lelah, lalu bangkit lagi 🌤️",
  "Kamu tidak harus produktif setiap saat. Diam dan bernapas pun sudah cukup berarti 🍃",
  "Hal kecil yang kamu syukuri hari ini bisa mengubah perspektif seharian ☀️",
  "Tubuhmu bukan musuhmu. Dengarkan apa yang ia coba sampaikan 💗",
  "Tidur yang cukup adalah investasi terbaikmu untuk hari esok 🌙",
  "Kamu berhak mengatakan tidak tanpa merasa bersalah 🌸",
  "Tersenyumlah pada dirimu sendiri hari ini — kamu sudah berusaha keras ✨",
  "Makan dengan baik bukan hanya tentang tubuh, tapi tentang menghormati dirimu sendiri 🥗",
  "Gerakan kecil — jalan sebentar, stretching ringan — bisa mengubah mood seharian 🚶‍♀️",
  "Kamu tidak perlu membandingkan perjalananmu dengan orang lain 🛤️",
  "Setiap hari kamu masih di sini adalah bukti kekuatanmu 💪",
  "Afirmasi hari ini: Aku cukup baik, aku cukup kuat, aku layak bahagia 🌷",
  "Pernapasan dalam selama 5 detik bisa menenangkan sistem sarafmu 🌬️",
  "Beri dirimu ruang untuk tidak sempurna — itu manusiawi 🤍",
  "Apa satu hal baik yang terjadi kemarin? Bawa energi itu ke hari ini 🌈",
  "Kamu adalah orang yang paling berhak mendapatkan kebaikanmu sendiri 💝",
  "Jika hari ini berat, ingat: badai pasti berlalu 🌦️",
  "Menjaga kesehatan siklus adalah bentuk cinta pada dirimu sendiri 🌸",
  "Satu gelas air putih di pagi hari sudah jadi awal yang baik 💧",
  "Perhatikan sinyal tubuhmu — kelelahan adalah tanda untuk berhenti sejenak 🔔",
  "Kamu tidak perlu menjelaskan alasanmu butuh istirahat kepada siapapun 🛋️",
  "Hari yang sulit pun akan selesai. Kamu akan melewatinya 🌙",
  "Luangkan waktu untuk sesuatu yang membuatmu bahagia hari ini 🎨",
  "Kecemasan yang kamu rasakan nyata, tapi itu bukan keseluruhan ceritamu 💫",
  "Sarapan yang baik adalah fondasi energi seharian. Jangan dilewatkan 🍳",
  "Tubuhmu berubah setiap fase siklus — itu normal dan menakjubkan ✨",
  "Kamu boleh meminta bantuan. Itu bukan kelemahan, itu keberanian 🫂",
  "Satu momen tenang di hari yang sibuk sudah sangat berharga 🍵",
  "Hormon yang berfluktuasi bukan salahmu — rawat dirimu lebih lembut di fase ini 🌺",
  "Progress kecil tetap adalah progress. Bangga dengan dirimu 🏆",
  "Tidur lebih awal malam ini adalah hadiah untuk dirimu besok 🌟",
  "Kamu tidak harus menyelesaikan semua hal hari ini 📋",
  "Tertawa adalah obat. Cari sesuatu yang membuatmu tertawa hari ini 😄",
  "Menghormati batasan dirimu adalah tanda kebijaksanaan 🌿",
  "Hari ini, coba satu hal baru yang kecil — bisa mengubah hidupmu 🗺️",
  "Badanmu membutuhkan magnesium saat PMS — cokelat hitam itu boleh! 🍫",
  "Pikiran positif bukan menyangkal masalah, tapi memilih sudut pandang yang lebih baik 🌤️",
  "Kamu sudah melewati hari-hari yang lebih berat dari ini. Kamu pasti bisa 💪",
  "Jika energimu rendah hari ini, itu bukan kegagalan — itu informasi dari tubuhmu 📊",
  "Catat tiga hal yang kamu syukuri malam ini sebelum tidur 📝",
  "Bergerak sejenak di luar ruangan bisa membantu memperbaiki mood 🌳",
  "Kamu berhak mengambil jeda dari sosial media ketika itu terasa berat 📵",
  "Merawat diri bukan egois — itu perlu agar kamu bisa hadir untuk hal lain 🌸",
  "Siklus yang tidak teratur bukan berarti ada yang salah denganmu — tubuh butuh waktu 💗",
  "Cobalah berterima kasih pada tubuhmu hari ini, sekecil apapun alasannya 🙏",
  "Menangis itu sehat — itu cara tubuh melepaskan tekanan yang menumpuk 💧",
  "Kamu layak mendapatkan makanan enak, tidur nyenyak, dan hari yang tenang 🌼",
  "Satu keputusan baik hari ini sudah cukup. Tidak perlu semuanya sempurna 🎯",
  "Hormon estrogenmu sedang bekerja — ada fase siklus yang memberikanmu energi lebih ✨",
  "Jalan kaki 10 menit setelah makan membantu pencernaan dan mood 🚶‍♀️",
  "Kamu tidak perlu menunggu kondisi sempurna untuk mulai merasa baik 🌈",
  "Tubuhmu melakukan lebih banyak hal untukmu daripada yang kamu sadari 💫",
  "Hari ini, prioritaskan satu hal yang benar-benar penting bagimu 🎯",
  "Mendengarkan musik favoritmu bisa mengangkat energimu dalam hitungan menit 🎵",
  "Kamu boleh berubah pikiran. Itu tanda bahwa kamu tumbuh 🌱",
  "Lakukan sesuatu yang baik untuk tubuhmu hari ini — sekecil apapun itu 💚",
  "Kamu lebih tangguh dari yang kamu kira 🦋",
  "Fase subur adalah waktu ketika energimu biasanya meningkat — manfaatkan itu ✨",
  "Saat lelah, pernapasan 4-7-8 bisa membantu: hirup 4 detik, tahan 7, hembuskan 8 🌬️",
  "Memasak makanan sendiri adalah salah satu bentuk sayang pada diri sendiri 🍲",
  "Kamu tidak perlu memenangkan setiap hari. Yang penting, kamu bertahan 🤍",
  "Cahaya matahari pagi membantu ritme sirkadian dan mood seharian ☀️",
  "Tubuhmu bukan ornamen. Ia adalah rumah tempat jiwamu tinggal 🏡",
  "Ketika kamu merawat dirimu, kamu juga merawat semua hal yang penting bagimu 💗",
  "Perhatikan satu hal indah di sekitarmu hari ini 🌷",
  "Stretching di pagi hari membantu tubuh dan pikiran siap menghadapi hari 🧘‍♀️",
  "Tidak semua hari harus luar biasa. Hari biasa yang tenang pun istimewa 🌿",
  "Kamu pantas dapat ketenangan. Bukan hanya ketika semua selesai 🌙",
  "Konsistensi kecil lebih kuat dari usaha besar yang sesekali 📈",
  "Hari ini, pilih satu kebiasaan sehat yang bisa kamu lakukan selama 5 menit 🕔",
  "Kamu tidak sendirian dalam perjalananmu 🌍",
  "Setiap fase siklus membawa kekuatannya sendiri — kenali dan manfaatkan ✨",
  "Tubuh yang dirawat dengan lembut akan merespons dengan baik 🌸",
  "Kamu berhak merasa bangga dengan dirimu hari ini 🏅",
  "Jika sesuatu terasa terlalu berat, kecilkan skalanya. Satu langkah sudah cukup 👣",
  "Hari ini coba kurangi satu hal yang menguras energimu tanpa hasil yang berarti 🔋",
  "Minuman hangat di pagi hari — teh, jahe, atau air lemon — bisa jadi ritual yang menenangkan ☕",
  "Kamu tidak harus merasa bahagia setiap saat — tapi kamu layak dicari kebahagiaan itu 🌤️",
  "Menjaga catatan siklus adalah hadiah kecil yang besar manfaatnya untukmu 📅",
  "Setiap hari yang kamu jalani menambah pemahaman tentang dirimu sendiri 🌱",
  "Kamu boleh merayakan hal kecil — selesai mengerjakan sesuatu, minum air cukup, tidur lebih awal 🎉",
  "Satu kalimat afirmasi pagi ini: Aku mau merawat diriku dengan sayang hari ini 💗",
  "Tubuhmu bukan mesin. Ia butuh jeda, nutrisi, dan kasih sayang 🌿",
  "Kamu berhak menetapkan standar yang realistis untuk dirimu sendiri 🌸",
  "Olahraga tidak harus intens untuk bermanfaat. Bergerak dengan gembira saja sudah bagus 🕺",
  "Kamu adalah karya yang terus berkembang, bukan hasil akhir yang harus sempurna 🎨",
  "Tidur yang baik adalah reset terbaik yang bisa kamu berikan pada dirimu 🌙",
  "Kalau hari ini kamu hanya bisa melakukan satu hal — pilih yang paling menyenangkanmu 🌈",
  "Siklus haidmu adalah cermin kesehatanmu. Mencatatnya adalah investasi untuk dirimu 📊",
  "Kamu bisa marah, kamu bisa lelah, kamu bisa sedih — lalu pelan-pelan baik lagi 💫",
  "Setiap tubuh berbeda. Perjalananmu tidak harus sama dengan orang lain 🌷",
  "Jika napasmu terasa sesak, coba tarik napas panjang tiga kali. Tubuhmu akan berterima kasih 🌬️",
  "Hari ini, percayai proses tubuhmu 🌸",
  "Kamu sudah berhasil melewati semua hari sebelumnya — hari ini pun bisa 💪",
  "Sayangi dirimu seperti kamu menyayangi orang yang paling kamu cintai 💝",
];

const HEALTH_TIPS = {
  period: [
    { emoji: "🌡️", title: "Kompres Hangat", tip: "Tempelkan botol air hangat atau heating pad di perut bawah selama 15-20 menit untuk meredakan kram." },
    { emoji: "🍵", title: "Teh Jahe & Chamomile", tip: "Minum teh jahe atau chamomile hangat 2-3x sehari. Kandungan anti-inflamasinya membantu meredakan nyeri dan kram." },
    { emoji: "🍫", title: "Dark Chocolate", tip: "Konsumsi dark chocolate 70%+ untuk meningkatkan endorfin dan kadar magnesium yang membantu meredakan kram." },
    { emoji: "🏃‍♀️", title: "Gerak Ringan", tip: "Jalan kaki santai 10-15 menit atau yoga ringan bisa membantu mengurangi nyeri lebih baik dari berbaring terus." },
    { emoji: "💧", title: "Hidrasi Ekstra", tip: "Minum minimal 8-10 gelas air putih per hari. Dehidrasi dapat memperburuk kram dan sakit kepala saat haid." },
    { emoji: "🥗", title: "Anti-Inflamasi", tip: "Perbanyak omega-3 (ikan salmon, kacang-kacangan) dan kurangi makanan asin & berlemak untuk mengurangi peradangan." },
  ],
  pms: [
    { emoji: "🧘‍♀️", title: "Kelola Stres", tip: "Praktikkan napas dalam 5-5-5: hirup 5 detik, tahan 5 detik, hembuskan 5 detik. Lakukan 5 kali saat PMS menyerang." },
    { emoji: "🌙", title: "Tidur Teratur", tip: "Kurang tidur memperburuk gejala PMS. Usahakan tidur 7-9 jam pada waktu yang sama setiap malam." },
    { emoji: "☕", title: "Kurangi Kafein", tip: "Kafein bisa memperburuk nyeri payudara dan kecemasan. Ganti kopi dengan teh herbal atau air lemon hangat." },
    { emoji: "🍌", title: "Magnesium & B6", tip: "Konsumsi pisang, alpukat, dan kacang-kacangan. Magnesium dan vitamin B6 terbukti mengurangi gejala PMS." },
    { emoji: "🚶‍♀️", title: "Olahraga Ringan", tip: "Jalan santai 20-30 menit melepaskan endorfin yang membantu mengatasi mood swing dan kecemasan saat PMS." },
    { emoji: "💆‍♀️", title: "Pijat & Relaksasi", tip: "Pijat lembut area perut bawah, punggung bawah, dan kaki bisa sangat membantu meredakan ketidaknyamanan PMS." },
  ],
  fertile: [
    { emoji: "🥦", title: "Nutrisi Folat", tip: "Konsumsi sayuran hijau gelap (bayam, brokoli) yang kaya folat. Penting untuk kesehatan reproduksi dan hormonal." },
    { emoji: "🏋️‍♀️", title: "Olahraga Optimal", tip: "Fase subur adalah waktu terbaik untuk olahraga intensitas sedang-tinggi karena energi dan daya tahan tubuh sedang puncaknya." },
    { emoji: "🫐", title: "Antioksidan", tip: "Perbanyak buah beri, kacang-kacangan, dan sayuran berwarna. Antioksidan mendukung kualitas hormon di fase subur." },
    { emoji: "😴", title: "Kualitas Tidur", tip: "Kualitas tidur mempengaruhi kesehatan hormonal. Buat rutinitas tidur yang konsisten untuk siklus yang lebih sehat." },
  ],
  ovulation: [
    { emoji: "✨", title: "Puncak Energi", tip: "Hari ovulasi biasanya adalah saat energi dan mood paling tinggi. Manfaatkan untuk aktivitas kreatif atau produktif." },
    { emoji: "🩸", title: "Kenali Tandanya", tip: "Lendir serviks jernih dan elastis seperti putih telur mentah adalah tanda ovulasi yang normal dan sehat." },
    { emoji: "🌡️", title: "Suhu Basal", tip: "Suhu tubuh naik sedikit (0.2-0.5°C) saat ovulasi. Mengukur suhu basal setiap pagi bisa membantu memahami siklus." },
  ],
  normal: [
    { emoji: "🔄", title: "Jaga Siklus Teratur", tip: "Tidur cukup, makan teratur, dan kelola stres adalah tiga pilar utama menjaga siklus haid yang sehat dan teratur." },
    { emoji: "⚖️", title: "Berat Badan Sehat", tip: "Berat badan terlalu rendah atau terlalu tinggi bisa mengganggu siklus. Jaga pola makan seimbang dan olahraga rutin." },
    { emoji: "📱", title: "Catat Siklusmu", tip: "Mencatat siklus membantu mengenali pola dan perubahan. Konsistenlah mencatat agar prediksi semakin akurat." },
    { emoji: "🩺", title: "Periksa Rutin", tip: "Jika siklus sering tidak teratur (< 21 hari atau > 35 hari), konsultasikan dengan dokter untuk pemeriksaan hormonal." },
  ],
};

const WATER_GOAL = 8;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      periods: [], logs: {}, cycleLength: 28,
      boyfriendMessages: [], partnerName: "Mas Bhakti",
      waterToday: { date: "", count: 0 },
      vitamins: { date: "", taken: false },
    };
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return { periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "Mas Bhakti", waterToday: { date: "", count: 0 }, vitamins: { date: "", taken: false } };
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
    status = "normal"; conclusion = "Siklus haidmu sangat teratur! 🌸";
    suggestion = "Pertahankan pola tidur & makan yang sehat ya.";
  } else if (diff > 3 && diff <= 7) {
    status = "late"; conclusion = `Siklus terakhir lebih panjang ${diff} hari dari biasanya.`;
    suggestion = "Bisa karena stres, kurang tidur, atau perubahan pola makan. Jangan terlalu khawatir ya 💕";
  } else if (diff > 7) {
    status = "very_late"; conclusion = `Siklus terakhir terlambat ${diff} hari dari biasanya.`;
    suggestion = "Kalau sudah lebih dari 45 hari, ada baiknya konsultasi ke dokter ya sayang 🩺";
  } else if (diff < -3 && diff >= -7) {
    status = "early"; conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Siklus yang lebih pendek bisa karena aktivitas fisik intens atau perubahan hormonal ringan.";
  } else {
    status = "very_early"; conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Kalau terus berlanjut, ada baiknya dicatat dan dikonsultasikan ke dokter 🩺";
  }
  return { avg, last, diff, status, conclusion, suggestion, total: periods.length };
}

function getDaysUntil(month, day) {
  const now = new Date();
  const target = new Date(now.getFullYear(), month - 1, day);
  if (target < now) target.setFullYear(now.getFullYear() + 1);
  return Math.ceil((target - now) / 86400000);
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("home");
  const today = new Date();
  const todayStr = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [logModal, setLogModal] = useState(false);
  const [logDate, setLogDate] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({ text: "", phase: "period", emoji: "💕" });
  const [notification, setNotification] = useState(null);

  useEffect(() => { saveData(data); }, [data]);

  // Reset water & vitamin daily
  useEffect(() => {
    if (data.waterToday.date !== todayStr) {
      setData(d => ({ ...d, waterToday: { date: todayStr, count: 0 } }));
    }
    if (data.vitamins.date !== todayStr) {
      setData(d => ({ ...d, vitamins: { date: todayStr, taken: false } }));
    }
  }, []);

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

  let phase = "normal";
  if (isOnPeriod) phase = "period";
  else if (dayOfCycle) {
    const half = data.cycleLength / 2;
    if (dayOfCycle >= half - 3 && dayOfCycle <= half + 1) phase = "fertile";
    if (dayOfCycle === Math.floor(half)) phase = "ovulation";
    if (daysUntilNext && daysUntilNext <= 5) phase = "pms";
  }

  const phaseConfig = {
    period: { emoji: "🌸", label: "Lagi Haid", color: "#e91e8c", bg: "linear-gradient(135deg,#f06292,#e91e8c)" },
    fertile: { emoji: "🌿", label: "Masa Subur", color: "#43a047", bg: "linear-gradient(135deg,#a5d6a7,#43a047)" },
    ovulation: { emoji: "✨", label: "Ovulasi", color: "#7b1fa2", bg: "linear-gradient(135deg,#ce93d8,#7b1fa2)" },
    pms: { emoji: "🌺", label: "Hampir Haid", color: "#f06292", bg: "linear-gradient(135deg,#f8bbd0,#f06292)" },
    normal: { emoji: "🌙", label: "Hari Biasa", color: "#e91e8c", bg: "linear-gradient(135deg,#f48fb1,#e91e8c)" },
  };
  const pc = phaseConfig[phase];

  // Daily love message - unique per day of year
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const dailyLoveMsg = DAILY_LOVE_MESSAGES[dayOfYear % DAILY_LOVE_MESSAGES.length];

  const analysis = analyzeCycle(data.periods, data.cycleLength);
  const healthTips = HEALTH_TIPS[phase] || HEALTH_TIPS.normal;

  // Birthdays
  const daysToAyuBday = getDaysUntil(12, 28);
  const daysToBhaktiBday = getDaysUntil(2, 22);
  const isAyuBday = today.getMonth() === 11 && today.getDate() === 28;
  const isBhaktiBday = today.getMonth() === 1 && today.getDate() === 22;

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
    // Birthday markers
    const d = new Date(key + "T00:00:00");
    if (d.getMonth() === 11 && d.getDate() === 28) return "birthday_ayu";
    if (d.getMonth() === 1 && d.getDate() === 22) return "birthday_bhakti";
    if (periodDates.has(key)) return "period";
    if (predDates.has(key)) return "predicted";
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
  const deleteBfMsg = (id) => setData(d => ({ ...d, boyfriendMessages: d.boyfriendMessages.filter(m => m.id !== id) }));

  const addWater = () => {
    if (data.waterToday.count >= WATER_GOAL) return;
    setData(d => ({ ...d, waterToday: { date: todayStr, count: d.waterToday.count + 1 } }));
    if (data.waterToday.count + 1 === WATER_GOAL) showNotif("🎉 Target minum air tercapai!");
  };
  const removeWater = () => {
    if (data.waterToday.count <= 0) return;
    setData(d => ({ ...d, waterToday: { date: todayStr, count: d.waterToday.count - 1 } }));
  };
  const toggleVitamin = () => {
    setData(d => ({ ...d, vitamins: { date: todayStr, taken: !d.vitamins.taken } }));
    showNotif(data.vitamins.taken ? "Vitamin belum diminum 🌿" : "Vitamin sudah diminum! 💊");
  };

  const s = {
    app: { minHeight: "100vh", width: "100%", maxWidth: "100vw", background: "linear-gradient(160deg,#fff0f5,#fce4ec,#f8bbd0)", fontFamily: "'Nunito',sans-serif", paddingBottom: 76, boxSizing: "border-box", overflowX: "hidden" },
    header: { background: "linear-gradient(135deg,#f48fb1,#e91e8c)", padding: "16px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(233,30,140,.25)", position: "sticky", top: 0, zIndex: 50 },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: 800 },
    headerSub: { color: "rgba(255,255,255,.85)", fontSize: 11, marginTop: 2 },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", border: "2px solid rgba(255,255,255,.5)", flexShrink: 0 },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #fce4ec", display: "flex", zIndex: 100, boxShadow: "0 -4px 20px rgba(244,143,177,.15)" },
    navBtn: (a) => ({ flex: 1, padding: "8px 0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: a ? "#e91e8c" : "#bbb", fontSize: 11, fontWeight: a ? 700 : 500, fontFamily: "'Nunito',sans-serif" }),
    card: { background: "#fff", borderRadius: 20, padding: "16px", margin: "10px 12px", boxShadow: "0 4px 20px rgba(244,143,177,.15)" },
    cardTitle: { fontSize: 11, color: "#e91e8c", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: .8 },
    circle: { width: 110, height: 110, borderRadius: "50%", background: pc.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: `0 8px 30px ${pc.color}66` },
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

  const BOYFRIEND_TRIGGERS = [
    { phase: "period", label: "Saat haid" },
    { phase: "pms", label: "Saat PMS" },
    { phase: "ovulation", label: "Masa subur" },
    { phase: "any", label: "Setiap hari" },
  ];

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
            {/* Birthday banners */}
            {isAyuBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#ff6b9d,#c44569)", textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 40 }}>🎂🎉</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 8 }}>Selamat Ulang Tahun, Ayu!</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.9)", marginTop: 6 }}>Semoga hari ini jadi hari paling indah. Mas Bhakti cinta kamu sepenuh hati 💕</div>
              </div>
            )}
            {isBhaktiBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)", textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 40 }}>🎂✨</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 8 }}>Hari ini Ulang Tahun Mas Bhakti!</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.9)", marginTop: 6 }}>Semoga Mas selalu sehat, bahagia, dan terus menyayangi Ayu 💗</div>
              </div>
            )}

            {/* Countdown birthdays */}
            {!isAyuBday && !isBhaktiBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)" }}>
                <div style={s.cardTitle}>🎂 Countdown Hari Spesial</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, background: "linear-gradient(135deg,#f06292,#e91e8c)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{daysToAyuBday}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>hari lagi</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>🎂 Ultah Ayu</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>28 Desember</div>
                  </div>
                  <div style={{ flex: 1, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{daysToBhaktiBday}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>hari lagi</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>🎂 Ultah Mas Bhakti</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>22 Februari</div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase card */}
            <div style={{ ...s.card, textAlign: "center", paddingTop: 20 }}>
              <div style={s.circle}>
                <div style={{ fontSize: 30 }}>{pc.emoji}</div>
                {dayOfCycle && <><div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{dayOfCycle}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Hari ke</div></>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#c2185b" }}>{pc.label}</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginTop: 4 }}>
                {daysUntilNext != null ? daysUntilNext > 0 ? `Haid berikutnya dalam ${daysUntilNext} hari` : "Waktunya haid nih! 🌸" : "Tandai haid pertamamu di Kalender"}
              </div>
              <button style={{ ...s.btn("ghost"), marginTop: 12, width: "100%" }} onClick={() => { setLogDate(todayKey); setLogModal(true); }}>
                📝 Catat Hari Ini
              </button>
            </div>

            {/* Daily motivational message */}
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)", border: "1.5px solid #f8bbd0" }}>
              <div style={s.cardTitle}>🌸 Pengingat Hari Ini</div>
              <div style={{ fontSize: 14, color: "#c2185b", fontWeight: 600, lineHeight: 1.6 }}>
                {dailyLoveMsg}
              </div>
            </div>

            {/* Nasihat Kesehatan Siklus */}
            <div style={{ ...s.card }}>
              <div style={s.cardTitle}>🩺 Nasihat Kesehatan Siklus</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginBottom: 10, fontWeight: 600 }}>
                {phase === "period" && "🌸 Kamu sedang haid — ini tips untukmu:"}
                {phase === "pms" && "🌺 Kamu hampir haid (PMS) — jaga dirimu:"}
                {phase === "fertile" && "🌿 Kamu di masa subur — optimalkan kesehatanmu:"}
                {phase === "ovulation" && "✨ Kamu sedang ovulasi — ketahui tandanya:"}
                {phase === "normal" && "🌙 Hari biasa — jaga kesehatan siklus:"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {healthTips.map((tip, i) => (
                  <div key={i} style={{ background: "#fce4ec", borderRadius: 12, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#c2185b", marginBottom: 2 }}>{tip.title}</div>
                      <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{tip.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water & Vitamin tracker */}
            <div style={s.card}>
              <div style={s.cardTitle}>💧 Pengingat Harian</div>
              {/* Water */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>💧 Minum Air Putih</div>
                  <div style={{ fontSize: 12, color: "#f48fb1", fontWeight: 600 }}>{data.waterToday.count}/{WATER_GOAL} gelas</div>
                </div>
                <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                  {Array(WATER_GOAL).fill(null).map((_, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: i < data.waterToday.count ? "linear-gradient(135deg,#64b5f6,#1565c0)" : "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
                      {i < data.waterToday.count ? "💧" : "○"}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btn("primary"), flex: 1, padding: "9px", fontSize: 13 }} onClick={addWater}>+ Minum Segelas</button>
                  <button style={{ ...s.btn("ghost"), padding: "9px 14px", fontSize: 13 }} onClick={removeWater}>−</button>
                </div>
                {data.waterToday.count >= WATER_GOAL && (
                  <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: "#1565c0", fontWeight: 700 }}>🎉 Target minum air hari ini tercapai!</div>
                )}
              </div>
              {/* Vitamin */}
              <div style={{ borderTop: "1px solid #fce4ec", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>💊 Vitamin Harian</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                      {data.vitamins.taken ? "✅ Sudah diminum hari ini!" : "Belum minum vitamin hari ini"}
                    </div>
                  </div>
                  <button onClick={toggleVitamin} style={{ padding: "8px 16px", borderRadius: 12, border: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", background: data.vitamins.taken ? "#e8f5e9" : "linear-gradient(135deg,#f06292,#e91e8c)", color: data.vitamins.taken ? "#2e7d32" : "#fff" }}>
                    {data.vitamins.taken ? "✓ Done" : "Tandai"}
                  </button>
                </div>
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
          <div style={{ ...s.card, padding: "16px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 12, padding: "8px 18px", fontSize: 20, cursor: "pointer", color: "#e91e8c", fontWeight: 700 }}>‹</button>
              <div style={{ fontWeight: 900, fontSize: 18, color: "#c2185b" }}>{MONTHS[calMonth]} {calYear}</div>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 12, padding: "8px 18px", fontSize: 20, cursor: "pointer", color: "#e91e8c", fontWeight: 700 }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
              {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: "#f48fb1", padding: "4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const key = toDateKey(calYear, calMonth, day);
                const st = getDayStatus(key);
                const isToday = key === todayKey;
                const hasLog = !!data.logs[key];

                let bg = "transparent";
                let color = "#555";
                let border = "2px solid transparent";
                let extraEmoji = null;

                if (st === "birthday_ayu") { bg = "linear-gradient(135deg,#ff6b9d,#c44569)"; color = "#fff"; extraEmoji = "🎂"; }
                else if (st === "birthday_bhakti") { bg = "linear-gradient(135deg,#a18cd1,#fbc2eb)"; color = "#fff"; extraEmoji = "🎂"; }
                else if (st === "period") { bg = "linear-gradient(135deg,#f06292,#e91e8c)"; color = "#fff"; }
                else if (st === "predicted") { bg = "linear-gradient(135deg,#f8bbd0,#f48fb1)"; color = "#fff"; }
                else if (st === "ovulation") { bg = "linear-gradient(135deg,#ce93d8,#ab47bc)"; color = "#fff"; }
                else if (st === "fertile") { bg = "linear-gradient(135deg,#c8e6c9,#66bb6a)"; color = "#fff"; }
                else if (isToday) { bg = "#fce4ec"; color = "#e91e8c"; border = "2px solid #f48fb1"; }

                return (
                  <div key={day} style={{ position: "relative" }} onClick={() => { setLogDate(key); setLogModal(true); }}>
                    <div style={{
                      width: "100%",
                      paddingBottom: "100%",
                      position: "relative",
                      borderRadius: "50%",
                      background: bg,
                      border,
                      cursor: "pointer",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        fontSize: extraEmoji ? 10 : 14,
                        fontWeight: isToday ? 900 : 600,
                        color,
                        lineHeight: 1,
                      }}>
                        {extraEmoji ? (
                          <>
                            <span style={{ fontSize: 12 }}>{extraEmoji}</span>
                            <span style={{ fontSize: 10 }}>{day}</span>
                          </>
                        ) : day}
                      </div>
                    </div>
                    {hasLog && <div style={{ position: "absolute", bottom: 1, right: 1, width: 6, height: 6, borderRadius: "50%", background: "#e91e8c" }} />}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {[["#e91e8c","Haid"],["#f48fb1","Prediksi"],["#ab47bc","Ovulasi"],["#66bb6a","Subur"],["#c44569","Ultah Ayu"],["#a18cd1","Ultah Mas"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />{l}
                </div>
              ))}
            </div>

            <button style={{ ...s.btn("primary"), width: "100%", marginTop: 16, padding: "13px 24px", fontSize: 15 }} onClick={() => togglePeriod(todayKey)}>
              {periodDates.has(todayKey) ? "❌ Hapus Haid Hari Ini" : "🌸 Tandai Haid Hari Ini"}
            </button>

            {predictions.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ ...s.cardTitle, fontSize: 13, marginBottom: 10 }}>📅 Prediksi Berikutnya</div>
                {predictions.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #fce4ec", fontSize: 14, color: "#888" }}>
                    <span>Siklus {i + 1}</span>
                    <span style={{ fontWeight: 800, color: "#e91e8c" }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
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
                      {analysis.status === "normal" && "✅ "}{analysis.status === "late" && "⚠️ "}{analysis.status === "very_late" && "🔴 "}{analysis.status === "early" && "💙 "}{analysis.status === "very_early" && "💙 "}
                      {analysis.conclusion}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{analysis.suggestion}</div>
                  </div>
                </div>
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

        {/* ===== CATATAN ===== */}
        {tab === "log" && (
          <div style={{ ...s.card, minHeight: "calc(100vh - 130px)", boxSizing: "border-box" }}>
            <div style={{ ...s.cardTitle, fontSize: 13, marginBottom: 14 }}>📝 Riwayat Catatan</div>
            {Object.keys(data.logs).length === 0 ? (
              <div style={{ textAlign: "center", color: "#f48fb1", padding: "60px 0" }}>
                <div style={{ fontSize: 56 }}>🌸</div>
                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: "#c2185b" }}>Belum ada catatan</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#aaa" }}>Mulai catat dari tab Beranda ya!</div>
              </div>
            ) : Object.entries(data.logs).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, log]) => (
              <div key={date} onClick={() => { setLogDate(date); setLogModal(true); }} style={{ padding: "14px 0", borderBottom: "1px solid #fce4ec", cursor: "pointer" }}>
                <div style={{ fontWeight: 800, color: "#c2185b", fontSize: 15 }}>{new Date(date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  {log.mood && <span style={{ background: "#fce4ec", borderRadius: 10, padding: "3px 10px", fontSize: 13, color: "#e91e8c", fontWeight: 600 }}>{MOODS.find(m => m.id === log.mood)?.emoji} {MOODS.find(m => m.id === log.mood)?.label}</span>}
                  {log.symptoms?.map(sym => <span key={sym} style={{ background: "#fce4ec", borderRadius: 10, padding: "3px 10px", fontSize: 13, color: "#e91e8c" }}>{SYMPTOMS.find(x => x.id === sym)?.emoji}</span>)}
                </div>
                {log.note && <div style={{ fontSize: 13, color: "#aaa", marginTop: 6, fontStyle: "italic" }}>"{log.note}"</div>}
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
            { id: "log", emoji: "📝", label: "Catatan" },
          ].map(t => (
            <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
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
              <button style={{ ...s.btn("danger"), width: "100%" }} onClick={() => { if (confirm("Yakin mau hapus semua data? 🥺")) { setData({ periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "Mas Bhakti", waterToday: { date: "", count: 0 }, vitamins: { date: "", taken: false } }); setSettingsOpen(false); showNotif("Data dihapus 🌿"); } }}>Hapus Semua Data</button>
              <button style={{ ...s.btn("ghost"), width: "100%", marginTop: 10 }} onClick={() => setSettingsOpen(false)}>Tutup</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}