import { useState, useEffect, useRef } from "react";

const MONTH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b?w=800", fallback: "❄️", label: "January", gradient: "linear-gradient(135deg, #1a3a4a 0%, #2d6a8a 50%, #4a9aba 100%)", accent: "#4a9aba", bg: "#0a1a2a" },
  { url: null, fallback: "🌸", label: "February", gradient: "linear-gradient(135deg, #4a1a3a 0%, #8a3a6a 50%, #c46a9a 100%)", accent: "#c46a9a", bg: "#1a0a14" },
  { url: null, fallback: "🌱", label: "March", gradient: "linear-gradient(135deg, #1a3a1a 0%, #3a7a3a 50%, #6aaa6a 100%)", accent: "#6aaa6a", bg: "#0a140a" },
  { url: null, fallback: "🌷", label: "April", gradient: "linear-gradient(135deg, #3a2a1a 0%, #8a6a3a 50%, #c49a6a 100%)", accent: "#c49a6a", bg: "#140e08" },
  { url: null, fallback: "☀️", label: "May", gradient: "linear-gradient(135deg, #3a3a1a 0%, #8a8a2a 50%, #c4c44a 100%)", accent: "#c4c44a", bg: "#14140a" },
  { url: null, fallback: "🏖️", label: "June", gradient: "linear-gradient(135deg, #1a2a4a 0%, #2a5a9a 50%, #4a8aca 100%)", accent: "#4a8aca", bg: "#0a1020" },
  { url: null, fallback: "🌞", label: "July", gradient: "linear-gradient(135deg, #4a2a0a 0%, #9a5a1a 50%, #d48a3a 100%)", accent: "#d48a3a", bg: "#200e04" },
  { url: null, fallback: "🍦", label: "August", gradient: "linear-gradient(135deg, #3a1a4a 0%, #7a3a9a 50%, #ba6aca 100%)", accent: "#ba6aca", bg: "#140a1c" },
  { url: null, fallback: "🍂", label: "September", gradient: "linear-gradient(135deg, #3a2a0a 0%, #8a5a1a 50%, #c4843a 100%)", accent: "#c4843a", bg: "#14100a" },
  { url: null, fallback: "🎃", label: "October", gradient: "linear-gradient(135deg, #3a1a0a 0%, #8a3a0a 50%, #c45a1a 100%)", accent: "#c45a1a", bg: "#180800" },
  { url: null, fallback: "🍁", label: "November", gradient: "linear-gradient(135deg, #2a1a1a 0%, #6a3a2a 50%, #9a5a3a 100%)", accent: "#9a5a3a", bg: "#100808" },
  { url: null, fallback: "⛄", label: "December", gradient: "linear-gradient(135deg, #1a2a3a 0%, #2a4a6a 50%, #4a6a9a 100%)", accent: "#4a6a9a", bg: "#0a1018" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const HOLIDAYS_BY_YEAR = {
  2025: {
    "1-1": "New Year's Day",
    "1-14": "Makar Sankranti",
    "1-26": "Republic Day",
    "2-26": "Maha Shivratri",
    "3-13": "Holika Dahan",
    "3-14": "Holi 🎨",
    "4-6": "Ram Navami",
    "4-14": "Dr. Ambedkar Jayanti",
    "4-18": "Good Friday",
    "5-12": "Buddha Purnima",
    "8-15": "Independence Day 🇮🇳",
    "8-16": "Janmashtami",
    "10-2": "Gandhi Jayanti",
    "10-20": "Diwali 🪔",
    "11-5": "Guru Nanak Jayanti",
    "12-25": "Christmas 🎄",
  },
  2026: {
    "1-1": "New Year's Day",
    "1-14": "Makar Sankranti",
    "1-26": "Republic Day",
    "2-15": "Maha Shivratri",
    "3-3": "Holika Dahan",
    "3-4": "Holi 🎨",
    "3-27": "Good Friday",
    "4-14": "Dr. Ambedkar Jayanti",
    "4-25": "Ram Navami",
    "8-15": "Independence Day 🇮🇳",
    "9-4": "Janmashtami",
    "10-2": "Gandhi Jayanti",
    "10-8": "Dussehra",
    "10-28": "Diwali 🪔",
    "11-24": "Guru Nanak Jayanti",
    "12-25": "Christmas 🎄",
  },
};
function getHolidays(year) {
  return HOLIDAYS_BY_YEAR[year] || HOLIDAYS_BY_YEAR[2026];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.y === b.y && a.m === b.m && a.d === b.d;
}
function isInRange(date, start, end) {
  if (!start || !end || !date) return false;
  const d = date.y * 10000 + date.m * 100 + date.d;
  const s = start.y * 10000 + start.m * 100 + start.d;
  const e = end.y * 10000 + end.m * 100 + end.d;
  return d > Math.min(s, e) && d < Math.max(s, e);
}
function formatDate(d) {
  if (!d) return "";
  return `${MONTHS[d.m].slice(0, 3)} ${d.d}, ${d.y}`;
}
function dayKey(m, d) { return `${m + 1}-${d}`; }

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [activeNote, setActiveNote] = useState("range");
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const [theme, setTheme] = useState("dark");
  const [showHolidays, setShowHolidays] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const noteRef = useRef();

  const monthInfo = MONTH_IMAGES[month];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wallcal_notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  function saveNotes(n) {
    setNotes(n);
    try { localStorage.setItem("wallcal_notes", JSON.stringify(n)); } catch {}
  }

  function changeMonth(dir) {
    setFlipDir(dir);
    setFlipping(true);
    setSelectedHoliday(null);
    setTimeout(() => {
      setMonth(prev => {
        let m = prev + dir;
        if (m < 0) { setYear(y => y - 1); return 11; }
        if (m > 11) { setYear(y => y + 1); return 0; }
        return m;
      });
      setFlipping(false);
    }, 320);
  }

  function handleDayClick(d) {
    const clicked = { y: year, m: month, d };
    // Show holiday in hero panel when that day is clicked
    const hk = dayKey(month, d);
    const festivalName = getHolidays(year)[hk];
    setSelectedHoliday(festivalName || null);

    if (!selecting || !startDate) {
      setStartDate(clicked);
      setEndDate(null);
      setSelecting(true);
    } else {
      if (isSameDay(clicked, startDate)) {
        setSelecting(false);
        return;
      }
      setEndDate(clicked);
      setSelecting(false);
    }
  }

  function handleDayHover(d) {
    if (selecting) setHoverDate({ y: year, m: month, d });
  }

  function getDayState(d) {
    const date = { y: year, m: month, d };
    const effectiveEnd = selecting && hoverDate ? hoverDate : endDate;
    if (isSameDay(date, startDate)) return "start";
    if (effectiveEnd && isSameDay(date, effectiveEnd)) return "end";
    if (isInRange(date, startDate, effectiveEnd)) return "range";
    return "none";
  }

  function saveNote() {
    if (!noteInput.trim()) return;
    const key = activeNote === "range"
      ? `${formatDate(startDate)}_${formatDate(endDate)}`
      : activeNote;
    const updated = { ...notes, [key]: [...(notes[key] || []), { text: noteInput.trim(), time: Date.now() }] };
    saveNotes(updated);
    setNoteInput("");
  }

  function deleteNote(key, idx) {
    const updated = { ...notes };
    updated[key] = updated[key].filter((_, i) => i !== idx);
    if (!updated[key].length) delete updated[key];
    saveNotes(updated);
  }

  const rangeKey = `${formatDate(startDate)}_${formatDate(endDate)}`;
  const currentNotes = notes[activeNote === "range" ? rangeKey : activeNote] || [];
  const allNoteKeys = Object.keys(notes).filter(k => notes[k]?.length > 0);

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? monthInfo.bg : "#f8f5f0",
    surface: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    surfaceHover: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    text: isDark ? "#e8e0d8" : "#1a1208",
    textMuted: isDark ? "rgba(232,224,216,0.5)" : "rgba(26,18,8,0.45)",
    accent: monthInfo.accent,
    accentRgb: monthInfo.accent,
    today: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${colors.bg};min-height:100vh;font-family:'DM Sans',sans-serif;transition:background 0.5s;}
    .cal-root{min-height:100vh;background:${colors.bg};padding:24px 16px;transition:background 0.5s;}
    .cal-wrap{max-width:1100px;margin:0 auto;}
    .cal-card{background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)"};border:1px solid ${colors.border};border-radius:24px;overflow:hidden;backdrop-filter:blur(20px);box-shadow:${isDark ? "0 32px 80px rgba(0,0,0,0.5)" : "0 16px 48px rgba(0,0,0,0.12)"};transition:all 0.5s;}
    .cal-top{display:grid;grid-template-columns:340px 1fr;min-height:480px;}
    @media(max-width:768px){.cal-top{grid-template-columns:1fr;min-height:auto;}}
    .cal-hero{position:relative;background:${monthInfo.gradient};display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:32px;min-height:300px;overflow:hidden;}
    .cal-hero::before{content:'';position:absolute;inset:0;background:${monthInfo.gradient};opacity:0.9;}
    .cal-hero-emoji{position:absolute;top:40px;left:50%;transform:translateX(-50%);font-size:96px;opacity:0.25;filter:blur(2px);}
    .cal-hero-emoji2{position:relative;font-size:80px;line-height:1;margin-bottom:16px;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.4));}
    .cal-hero-month{position:relative;font-family:'Playfair Display',serif;font-size:48px;font-weight:700;color:#fff;letter-spacing:-1px;line-height:1;text-shadow:0 2px 16px rgba(0,0,0,0.4);}
    .cal-hero-year{position:relative;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;color:rgba(255,255,255,0.7);letter-spacing:4px;margin-top:6px;}
    .cal-rings{position:absolute;top:0;left:0;right:0;height:28px;display:flex;justify-content:space-evenly;align-items:center;padding:0 40px;}
    .ring{width:18px;height:28px;border:2.5px solid rgba(255,255,255,0.3);border-top:none;border-radius:0 0 12px 12px;background:rgba(255,255,255,0.1);}
    .cal-body{padding:28px 24px 28px;display:flex;flex-direction:column;}
    .cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
    .nav-btn{background:${colors.surface};border:1px solid ${colors.border};color:${colors.text};width:38px;height:38px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all 0.2s;}
    .nav-btn:hover{background:${colors.surfaceHover};transform:scale(1.05);}
    .nav-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:${colors.text};}
    .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
    .cal-dow{text-align:center;font-size:11px;font-weight:500;color:${colors.textMuted};padding:6px 0;letter-spacing:1.5px;text-transform:uppercase;}
    .cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:400;color:${colors.text};border-radius:10px;cursor:pointer;position:relative;transition:all 0.15s;user-select:none;}
    .cal-day:hover{background:${colors.surfaceHover};}
    .cal-day.today{background:${colors.today};font-weight:500;}
    .cal-day.start,.cal-day.end{background:${monthInfo.accent};color:#fff;font-weight:600;box-shadow:0 4px 16px ${monthInfo.accent}66;}
    .cal-day.range{background:${monthInfo.accent}22;color:${isDark ? "#fff" : colors.text};}
    .cal-day.start{border-radius:10px 10px 10px 10px;}
    .cal-day.end{border-radius:10px 10px 10px 10px;}
    .cal-day .holiday-dot{position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:${monthInfo.accent};opacity:0.8;}
    .cal-day.start .holiday-dot,.cal-day.end .holiday-dot{background:#fff;}
    .cal-day .holiday-tip{display:none;position:absolute;bottom:110%;left:50%;transform:translateX(-50%);background:${isDark ? "#1a1a2e" : "#1a1208"};color:#fff;font-size:10px;padding:4px 8px;border-radius:6px;white-space:nowrap;z-index:10;pointer-events:none;}
    .cal-day:hover .holiday-tip{display:block;}
    .cal-bottom{border-top:1px solid ${colors.border};display:grid;grid-template-columns:1fr 1fr;}
    @media(max-width:640px){.cal-bottom{grid-template-columns:1fr;}}
    .notes-panel{padding:24px;border-right:1px solid ${colors.border};}
    @media(max-width:640px){.notes-panel{border-right:none;border-bottom:1px solid ${colors.border};}}
    .notes-title{font-family:'Playfair Display',serif;font-size:16px;color:${colors.text};margin-bottom:12px;display:flex;align-items:center;gap:8px;}
    .notes-tabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
    .notes-tab{font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid ${colors.border};background:transparent;color:${colors.textMuted};cursor:pointer;transition:all 0.2s;}
    .notes-tab.active{background:${monthInfo.accent};color:#fff;border-color:${monthInfo.accent};}
    .notes-input-row{display:flex;gap:8px;margin-bottom:12px;}
    .notes-input{flex:1;background:${colors.surface};border:1px solid ${colors.border};border-radius:10px;padding:8px 12px;font-size:13px;color:${colors.text};font-family:'DM Sans',sans-serif;outline:none;resize:none;}
    .notes-input:focus{border-color:${monthInfo.accent}88;}
    .notes-save{background:${monthInfo.accent};color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;white-space:nowrap;}
    .notes-save:hover{opacity:0.85;transform:scale(1.02);}
    .note-item{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid ${colors.border};}
    .note-item:last-child{border-bottom:none;}
    .note-dot{width:6px;height:6px;border-radius:50%;background:${monthInfo.accent};margin-top:6px;flex-shrink:0;}
    .note-text{font-size:13px;color:${colors.text};flex:1;line-height:1.5;}
    .note-del{background:transparent;border:none;color:${colors.textMuted};cursor:pointer;font-size:14px;padding:0 4px;opacity:0.5;transition:opacity 0.2s;}
    .note-del:hover{opacity:1;color:#e25;}
    .info-panel{padding:24px;}
    .info-label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.textMuted};margin-bottom:6px;}
    .info-val{font-family:'Playfair Display',serif;font-size:15px;color:${colors.text};margin-bottom:16px;}
    .range-display{background:${colors.surface};border-radius:12px;padding:14px;margin-bottom:16px;border:1px solid ${colors.border};}
    .range-bar{height:4px;background:${colors.border};border-radius:2px;margin:10px 0;overflow:hidden;}
    .range-fill{height:100%;background:linear-gradient(90deg,${monthInfo.accent},${monthInfo.accent}88);border-radius:2px;transition:width 0.3s;}
    .settings-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
    .toggle{position:relative;display:inline-block;width:38px;height:22px;}
    .toggle input{opacity:0;width:0;height:0;}
    .toggle-slider{position:absolute;inset:0;background:${colors.border};border-radius:11px;cursor:pointer;transition:0.3s;}
    .toggle-slider:before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:0.3s;}
    input:checked + .toggle-slider{background:${monthInfo.accent};}
    input:checked + .toggle-slider:before{transform:translateX(16px);}
    .theme-btn{background:${colors.surface};border:1px solid ${colors.border};color:${colors.text};border-radius:20px;padding:5px 14px;font-size:12px;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
    .theme-btn:hover{background:${colors.surfaceHover};}
    .flip-enter{animation:flipIn 0.32s ease-out;}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    @keyframes flipIn{from{opacity:0;transform:rotateX(-${flipDir > 0 ? "12" : "-12"}deg) translateY(${flipDir > 0 ? "8" : "-8"}px);}to{opacity:1;transform:rotateX(0) translateY(0);}}
    .empty{color:${colors.textMuted};font-size:13px;font-style:italic;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${colors.border};border-radius:2px;}
  `;

  const rangeLength = (() => {
    if (!startDate || !endDate) return 0;
    const a = new Date(startDate.y, startDate.m, startDate.d);
    const b = new Date(endDate.y, endDate.m, endDate.d);
    return Math.abs(Math.round((b - a) / 86400000)) + 1;
  })();

  return (
    <>
      <style>{css}</style>
      <div className="cal-root">
        <div className="cal-wrap">
          <div className="cal-card" key={`${month}-${year}-${theme}`}>

            {/* TOP: Hero + Grid */}
            <div className={`cal-top ${flipping ? "flip-enter" : ""}`}>
              {/* Hero Panel */}
              <div className="cal-hero">
                <div className="cal-rings">
                  {[...Array(8)].map((_, i) => <div key={i} className="ring" />)}
                </div>
                <div className="cal-hero-emoji">{monthInfo.fallback}</div>
                <div className="cal-hero-emoji2">{selectedHoliday ? "" : monthInfo.fallback}</div>
                <div className="cal-hero-month">{MONTHS[month]}</div>
                <div className="cal-hero-year">{year}</div>
                {selectedHoliday && (
                  <div style={{
                    position: "relative",
                    marginTop: 12,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.25)",
                    animation: "fadeSlideUp 0.3s ease-out"
                  }}>
                    <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>Festival</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'Playfair Display', serif" }}>{selectedHoliday}</div>
                  </div>
                )}
              </div>

              <div className="cal-body">
                {/* Nav */}
                <div className="cal-nav">
                  <button className="nav-btn" onClick={() => changeMonth(-1)}>‹</button>
                  <span className="nav-title">{MONTHS[month].slice(0,3)} {year}</span>
                  <button className="nav-btn" onClick={() => changeMonth(1)}>›</button>
                </div>

                {/* Day of Week Headers */}
                <div className="cal-grid">
                  {DAYS.map(d => <div key={d} className="cal-dow">{d}</div>)}

                  {/* Empty cells */}
                  {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}

                  {/* Days */}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const state = getDayState(d);
                    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                    const hk = dayKey(month, d);
                    const holiday = showHolidays && getHolidays(year)[hk];
                    return (
                      <div
                        key={d}
                        className={`cal-day ${state !== "none" ? state : ""} ${isToday ? "today" : ""}`}
                        onClick={() => handleDayClick(d)}
                        onMouseEnter={() => handleDayHover(d)}
                        onMouseLeave={() => setHoverDate(null)}
                        title={holiday || ""}
                      >
                        {d}
                        {holiday && <><div className="holiday-dot" /><div className="holiday-tip">{holiday}</div></>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BOTTOM: Notes + Info */}
            <div className="cal-bottom">
              {/* Notes Panel */}
              <div className="notes-panel">
                <div className="notes-title">
                  <span>✎</span> Notes
                </div>

                {/* Tabs */}
                <div className="notes-tabs">
                  <button
                    className={`notes-tab ${activeNote === "range" ? "active" : ""}`}
                    onClick={() => setActiveNote("range")}
                  >
                    {startDate && endDate ? `${formatDate(startDate).split(",")[0]} – ${formatDate(endDate).split(",")[0]}` : "Selected Range"}
                  </button>
                  <button
                    className={`notes-tab ${activeNote === "month" ? "active" : ""}`}
                    onClick={() => setActiveNote("month")}
                  >
                    {MONTHS[month]}
                  </button>
                  {allNoteKeys.filter(k => k !== rangeKey && k !== "month").slice(0,2).map(k => (
                    <button key={k} className={`notes-tab ${activeNote === k ? "active" : ""}`} onClick={() => setActiveNote(k)}>
                      {k.length > 20 ? k.slice(0,20) + "…" : k}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="notes-input-row">
                  <textarea
                    ref={noteRef}
                    className="notes-input"
                    placeholder={
                      activeNote === "range" && (!startDate || !endDate)
                        ? "Select a date range first…"
                        : "Add a note…"
                    }
                    rows={2}
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveNote(); } }}
                    disabled={activeNote === "range" && (!startDate || !endDate)}
                  />
                  <button className="notes-save" onClick={saveNote}>Save</button>
                </div>

                {/* Notes list */}
                <div style={{ maxHeight: 160, overflowY: "auto" }}>
                  {currentNotes.length === 0
                    ? <div className="empty">No notes yet.</div>
                    : currentNotes.map((n, i) => (
                      <div key={i} className="note-item">
                        <div className="note-dot" />
                        <div className="note-text">{n.text}</div>
                        <button className="note-del" onClick={() => deleteNote(activeNote === "range" ? rangeKey : activeNote, i)}>×</button>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Info Panel */}
              <div className="info-panel">
                {/* Range info */}
                <div className="range-display">
                  <div className="info-label">Selected Range</div>
                  {startDate
                    ? <>
                      <div className="info-val">{formatDate(startDate)}{endDate ? ` → ${formatDate(endDate)}` : " → …"}</div>
                      {endDate && <>
                        <div className="range-bar">
                          <div className="range-fill" style={{ width: `${Math.min(100, rangeLength * 3)}%` }} />
                        </div>
                        <div style={{ fontSize: 12, color: colors.textMuted }}>{rangeLength} day{rangeLength > 1 ? "s" : ""} selected</div>
                      </>}
                    </>
                    : <div className="empty">Click a day to start selecting</div>
                  }
                </div>

                {/* Settings */}
                <div className="info-label">Options</div>
                <div className="settings-row">
                  <span style={{ fontSize: 13, color: colors.text }}>Show holidays</span>
                  <label className="toggle">
                    <input type="checkbox" checked={showHolidays} onChange={e => setShowHolidays(e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-row">
                  <span style={{ fontSize: 13, color: colors.text }}>Dark mode</span>
                  <label className="toggle">
                    <input type="checkbox" checked={isDark} onChange={e => setTheme(e.target.checked ? "dark" : "light")} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
                  <div className="info-label">Month</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="theme-btn" onClick={() => { setStartDate(null); setEndDate(null); setSelecting(false); }}>Clear selection</button>
                    <button className="theme-btn" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>Today</button>
                  </div>
                </div>

                {/* Holiday for today */}
                {showHolidays && getHolidays(year)[dayKey(month, today.getDate())] && year === today.getFullYear() && month === today.getMonth() && (
                  <div style={{ marginTop: 16, padding: 10, background: `${monthInfo.accent}22`, borderRadius: 10, border: `1px solid ${monthInfo.accent}44` }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Today's Holiday</div>
                    <div style={{ fontSize: 13, color: colors.text }}>🎉{getHolidays(year)[dayKey(month, today.getDate())]}</div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", letterSpacing: "2px" }}>
            WALL CALENDAR · {year}
          </div>
        </div>
      </div>
    </>
  );
}