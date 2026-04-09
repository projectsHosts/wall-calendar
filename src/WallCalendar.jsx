import { useState, useEffect, useRef } from "react";
import { Sun1, Moon } from "iconsax-react";
import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  Note,
  Trash,
  Add,
  TickCircle,
  InfoCircle,
  CloseCircle,
} from "iconsax-react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const HOLIDAYS_BY_YEAR = {
  2025: {
    "1-1":  "New Year's Day",
    "1-14": "Makar Sankranti",
    "1-26": "Republic Day",
    "2-26": "Maha Shivratri",
    "3-13": "Holika Dahan",
    "3-14": "Holi",
    "4-6":  "Ram Navami",
    "4-14": "Dr. Ambedkar Jayanti",
    "4-18": "Good Friday",
    "5-12": "Buddha Purnima",
    "8-15": "Independence Day",
    "8-16": "Janmashtami",
    "10-2": "Gandhi Jayanti",
    "10-20":"Diwali",
    "11-5": "Guru Nanak Jayanti",
    "12-25":"Christmas",
  },
  2026: {
    "1-1":  "New Year's Day",
    "1-14": "Makar Sankranti",
    "1-26": "Republic Day",
    "2-15": "Maha Shivratri",
    "3-3":  "Holika Dahan",
    "3-4":  "Holi",
    "3-27": "Good Friday",
    "4-14": "Dr. Ambedkar Jayanti",
    "4-25": "Ram Navami",
    "8-15": "Independence Day",
    "9-4":  "Janmashtami",
    "10-2": "Gandhi Jayanti",
    "10-8": "Dussehra",
    "10-28":"Diwali",
    "11-24":"Guru Nanak Jayanti",
    "12-25":"Christmas",
  },
};

function getHolidays(year) {
  return HOLIDAYS_BY_YEAR[year] || {};
}

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }
function sameDay(a, b)        { return a && b && a.y === b.y && a.m === b.m && a.d === b.d; }
function inRange(date, s, e) {
  if (!s || !e || !date) return false;
  const d = date.y * 10000 + date.m * 100 + date.d;
  const a = s.y * 10000 + s.m * 100 + s.d;
  const b = e.y * 10000 + e.m * 100 + e.d;
  return d > Math.min(a, b) && d < Math.max(a, b);
}
function fmtDate(d) {
  if (!d) return "";
  return `${MONTHS[d.m].slice(0,3)} ${String(d.d).padStart(2,"0")}, ${d.y}`;
}
function dayKey(m, d) { return `${m + 1}-${d}`; }

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function WallCalendar() {
  const today = new Date();
  const [year,      setYear]      = useState(today.getFullYear());
  const [month,     setMonth]     = useState(today.getMonth());
  const [start,     setStart]     = useState(null);
  const [end,       setEnd]       = useState(null);
  const [hover,     setHover]     = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes,     setNotes]     = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [dark,      setDark]      = useState(true);
  const [showHol,   setShowHol]   = useState(true);
  const [selHol,    setSelHol]    = useState(null);
  const [flipping,  setFlipping]  = useState(false);
  const [flipDir,   setFlipDir]   = useState(1);
  const [toast,     setToast]     = useState(null);
  const lordRef = useRef(null);

  /* Load notes */
  useEffect(() => {
    try {
      const s = localStorage.getItem("wc_notes_v2");
      if (s) setNotes(JSON.parse(s));
    } catch {}
  }, []);

  /* Lordicon CDN script */
  useEffect(() => {
    if (document.getElementById("lordicon-script")) return;
    const s = document.createElement("script");
    s.id  = "lordicon-script";
    s.src = "https://cdn.lordicon.com/lordicon.js";
    document.head.appendChild(s);
  }, []);

  /* Sync lord-icon colors with theme */
  useEffect(() => {
    const icons = document.querySelectorAll("lord-icon");
    icons.forEach(el => {
      el.setAttribute("colors", dark
        ? "primary:#a78bfa,secondary:#7c3aed"
        : "primary:#6d28d9,secondary:#4c1d95");
    });
  }, [dark]);

  function persistNotes(n) {
    setNotes(n);
    try { localStorage.setItem("wc_notes_v2", JSON.stringify(n)); } catch {}
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function changeMonth(dir) {
    setFlipDir(dir);
    setFlipping(true);
    setSelHol(null);
    setTimeout(() => {
      setMonth(p => {
        let m = p + dir;
        if (m < 0)  { setYear(y => y - 1); return 11; }
        if (m > 11) { setYear(y => y + 1); return 0;  }
        return m;
      });
      setFlipping(false);
    }, 300);
  }

  function clickDay(d) {
    const clicked = { y: year, m: month, d };
    const hk      = dayKey(month, d);
    const festival = getHolidays(year)[hk];
    setSelHol(festival || null);

    if (!selecting || !start) {
      setStart(clicked); setEnd(null); setSelecting(true);
    } else {
      if (sameDay(clicked, start)) { setSelecting(false); return; }
      setEnd(clicked); setSelecting(false);
    }
  }

  function dayState(d) {
    const date  = { y: year, m: month, d };
    const effEnd = selecting && hover ? hover : end;
    if (sameDay(date, start))         return "start";
    if (effEnd && sameDay(date, effEnd)) return "end";
    if (inRange(date, start, effEnd)) return "range";
    return "none";
  }

  const noteKey = start && end ? `${fmtDate(start)}__${fmtDate(end)}` : `month__${year}_${month}`;
  const currentNotes = notes[noteKey] || [];

  function saveNote() {
    if (!noteInput.trim()) return;
    const updated = { ...notes, [noteKey]: [...currentNotes, { text: noteInput.trim(), ts: Date.now() }] };
    persistNotes(updated);
    setNoteInput("");
    showToast("Note saved");
  }

  function deleteNote(idx) {
    const updated = { ...notes };
    updated[noteKey] = updated[noteKey].filter((_, i) => i !== idx);
    if (!updated[noteKey].length) delete updated[noteKey];
    persistNotes(updated);
    showToast("Note deleted", "error");
  }

  const rangeLen = (() => {
    if (!start || !end) return 0;
    const a = new Date(start.y, start.m, start.d);
    const b = new Date(end.y, end.m, end.d);
    return Math.abs(Math.round((b - a) / 86400000)) + 1;
  })();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const holidays    = getHolidays(year);

  /* Upcoming Holidays (dynamic for displayed month) */
  const upcomingHolidays = Object.entries(holidays)
    .map(([key, name]) => {
      const [m, d] = key.split("-").map(Number);
      return { m: m - 1, d, name };
    })
    .filter(h => h.m === month)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);

  /* ── THEME TOKENS ── */
  const T = dark ? {
    bg:          "#0f0f13",
    card:        "#16161e",
    surface:     "#1e1e2a",
    surfaceHov:  "#252534",
    border:      "rgba(255,255,255,0.07)",
    borderHov:   "rgba(255,255,255,0.14)",
    text:        "#e2e0f0",
    textMuted:   "rgba(226,224,240,0.45)",
    textFaint:   "rgba(226,224,240,0.25)",
    accent:      "#a78bfa",
    accentDeep:  "#7c3aed",
    accentGlow:  "rgba(167,139,250,0.18)",
    success:     "#34d399",
    danger:      "#f87171",
    headerBg:    "#12121a",
  } : {
    bg:          "#f4f3ff",
    card:        "#ffffff",
    surface:     "#f0effe",
    surfaceHov:  "#e8e6fd",
    border:      "rgba(0,0,0,0.07)",
    borderHov:   "rgba(0,0,0,0.14)",
    text:        "#1e1b3a",
    textMuted:   "rgba(30,27,58,0.5)",
    textFaint:   "rgba(30,27,58,0.25)",
    accent:      "#6d28d9",
    accentDeep:  "#4c1d95",
    accentGlow:  "rgba(109,40,217,0.12)",
    success:     "#059669",
    danger:      "#dc2626",
    headerBg:    "#faf9ff",
  };

  /* ── CSS ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${T.bg}; font-family: 'Inter', sans-serif; min-height: 100vh; transition: background 0.4s; }
    .wc-root { min-height: 100vh; width: 100%; background: ${T.bg}; display: flex; flex-direction: column; transition: background 0.4s; }

    .wc-header {
      width: 100%; background: ${T.headerBg}; border-bottom: 1px solid ${T.border};
      display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 60px;
      position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);
    }
    .wc-header-brand { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; color: ${T.text}; }
    .wc-header-brand span { color: ${T.accent}; }
    .wc-header-right { display: flex; align-items: center; gap: 8px; }

    .wc-theme-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${T.border}; background: ${T.surface}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; overflow: hidden; }
    .wc-theme-btn:hover { background: ${T.surfaceHov}; border-color: ${T.borderHov}; }

    .wc-hol-toggle { display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${T.textMuted}; font-weight: 500; letter-spacing: 0.3px; }
    .toggle-pill {
      position: relative; width: 36px; height: 20px; border-radius: 10px;
      background: ${showHol ? T.accent : T.surface}; border: 1px solid ${showHol ? T.accent : T.border};
      cursor: pointer; transition: all 0.25s;
    }
    .toggle-pill::after {
      content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff;
      top: 2px; left: ${showHol ? "18px" : "2px"}; transition: left 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }

    .wc-main {
      flex: 1; width: 100%; max-width: none; margin: 0; padding: 24px 20px;
      display: grid; grid-template-columns: 1fr 340px; gap: 20px;
    }
    @media (max-width: 1024px) {
      .wc-main { grid-template-columns: 1fr; }
      .wc-sidebar { order: 2; }
      .wc-cal-card { order: 1; }
    }
    @media (max-width: 600px) {
      .wc-main { padding: 16px 12px; gap: 14px; }
      .wc-header { padding: 0 16px; }
    }

    .wc-hero {
      width: 100%; height: 220px; overflow: hidden; border-radius: 20px; margin-bottom: 12px;
      border: 1px solid ${T.border}; box-shadow: ${dark ? "0 12px 30px rgba(0,0,0,0.18)" : "0 10px 24px rgba(0,0,0,0.08)"};
    }
    .wc-hero img { width: 100%; height: 100%; object-fit: cover; }
    .wc-hero-caption { margin: 8px 4px 16px; font-size: 13px; color: ${T.textMuted}; letter-spacing: 0.3px; }

    .wc-cal-card, .wc-range-card, .wc-notes-card, .wc-mini-card {
      background: ${T.card}; border: 1px solid ${T.border}; border-radius: 20px;
      box-shadow: ${dark ? "0 12px 30px rgba(0,0,0,0.18)" : "0 10px 24px rgba(0,0,0,0.08)"};
    }
    .wc-cal-card { overflow: hidden; }

    .wc-month-bar { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid ${T.border}; }
    .wc-month-name { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: ${T.text}; display: flex; align-items: baseline; gap: 10px; }
    .wc-month-year { font-size: 14px; font-weight: 400; color: ${T.textMuted}; }
    .wc-nav-group { display: flex; align-items: center; gap: 8px; }
    .wc-nav-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid ${T.border}; background: ${T.surface}; color: ${T.text}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; }
    .wc-nav-btn:hover { background: ${T.accentGlow}; border-color: ${T.accent}; color: ${T.accent}; }
    .wc-today-btn { height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid ${T.border}; background: ${T.surface}; color: ${T.textMuted}; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
    .wc-today-btn:hover { background: ${T.accentGlow}; border-color: ${T.accent}; color: ${T.accent}; }

    .wc-festival-bar { margin: 0 24px 0; padding: 10px 16px; border-radius: 12px; background: ${T.accentGlow}; border: 1px solid ${T.accent}33; display: flex; align-items: center; gap: 10px; margin-top: 14px; }
    .wc-festival-label { font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: ${T.textMuted}; }
    .wc-festival-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: ${T.accent}; }
    .wc-festival-close { margin-left: auto; background: transparent; border: none; color: ${T.textMuted}; cursor: pointer; }

    .wc-grid-wrap { padding: 16px 24px 24px; }
    .wc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
    .wc-dow { text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${T.textFaint}; padding: 6px 0 10px; }
    .wc-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 13px; color: ${T.text}; border-radius: 10px; cursor: pointer; transition: all 0.15s; user-select: none; }
    .wc-day:hover { background: ${T.surfaceHov}; }
    .wc-day.is-today { background: ${T.surface}; font-weight: 600; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
    .wc-day.is-start, .wc-day.is-end { background: ${T.accent}; color: #fff; font-weight: 600; box-shadow: 0 4px 16px ${T.accent}44; }
    .wc-day.is-range { background: ${T.accentGlow}; color: ${T.text}; border-radius: 0; }
    .wc-day.is-start { border-radius: 10px 0 0 10px; }
    .wc-day.is-end   { border-radius: 0 10px 10px 0; }
    .wc-day.is-start.is-solo { border-radius: 10px; }
    .wc-hol-dot { width: 4px; height: 4px; border-radius: 50%; background: ${T.accent}; opacity: 0.7; margin-top: 3px; }

    .wc-sidebar { display: flex; flex-direction: column; gap: 16px; }
    .wc-range-card { padding: 20px; }
    .wc-notes-card { padding: 20px; flex: 1; }
    .wc-mini-card { padding: 16px 18px; }
    .wc-mini-item { font-size: 12px; color: ${T.text}; margin-top: 8px; }
    .wc-mini-sub { font-size: 11px; color: ${T.textMuted}; }

    .wc-card-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
   letter-spacing: 1px; text-transform: uppercase; color: #facc15; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .wc-range-dates { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: ${T.text}; line-height: 1.3; margin-bottom: 10px; }
    .wc-range-sep { display: block; font-size: 11px; color: ${T.textMuted}; margin: 2px 0; }
    .wc-range-chip { display: inline-flex; align-items: center; gap: 5px; background: ${T.accentGlow}; color: ${T.accent}; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid ${T.accent}33; }
    .wc-empty-hint { font-size: 13px; color: ${T.textMuted}; line-height: 1.6; }
    .wc-clear-btn { margin-top: 12px; width: 100%; padding: 9px; border-radius: 10px; border: 1px solid ${T.border}; background: ${T.surface}; color: ${T.textMuted}; font-size: 12px; cursor: pointer; }
    .wc-clear-btn:hover { border-color: ${T.danger}; color: ${T.danger}; background: ${T.danger}11; }

    .wc-notes-context { font-size: 11px; color: ${T.accent}; font-weight: 500; background: ${T.accentGlow}; border: 1px solid ${T.accent}33; border-radius: 8px; padding: 6px 10px; margin-bottom: 14px; }
    .wc-note-input-wrap { display: flex; gap: 8px; margin-bottom: 14px; }
    .wc-note-input { flex: 1; background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 10px; padding: 9px 12px; font-size: 13px; color: ${T.text}; resize: none; }
    .wc-note-save { width: 38px; height: 38px; border-radius: 10px; border: none; background: ${T.accent}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .wc-notes-list { display: flex; flex-direction: column; gap: 8px; max-height: 260px; overflow-y: auto; }
    .wc-note-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 10px; }
    .wc-note-bullet { width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; margin-top: 5px; }
    .wc-note-text { flex: 1; font-size: 13px; color: ${T.text}; line-height: 1.5; }
    .wc-note-del { background: transparent; border: none; color: ${T.textFaint}; cursor: pointer; }

    .wc-no-notes { text-align: center; padding: 24px 0; font-size: 13px; color: ${T.textFaint}; line-height: 1.7; }
    .wc-no-note-sub { font-size: 11px; color: ${T.textMuted}; margin-top: 6px; }

    .wc-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 40px; font-size: 13px; font-weight: 500; z-index: 999; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); background: ${T.card}; border: 1px solid ${T.border}; color: ${T.text}; }
  `;

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div className="wc-toast">
          {toast.type === "success"
            ? <TickCircle size={16} color={T.success} variant="Bold" />
            : <InfoCircle size={16} color={T.danger} variant="Bold" />}
          {toast.msg}
        </div>
      )}

      <div className="wc-root">

        <header className="wc-header">
          <div className="wc-header-brand">
            <Calendar size={20} color={T.accent} variant="Bulk" />
            Wall<span>Calendar</span>
          </div>

          <div className="wc-header-right">
            <label className="wc-hol-toggle" style={{ cursor: "pointer" }}>
              <span>Holidays</span>
              <div className="toggle-pill" onClick={() => setShowHol(p => !p)} />
            </label>

           <button
  className="wc-theme-btn"
  onClick={() => setDark(p => !p)}
  title={dark ? "Switch to light mode" : "Switch to dark mode"}
>
  {dark ? (
    <Sun1 size={20} color={T.accent} variant="Bold" />
  ) : (
    <Moon size={20} color={T.accent} variant="Bold" />
  )}
</button>
          </div>
        </header>

        <main className="wc-main">

          <div>
            <div className="wc-hero">
              <img
                src="https://images.pexels.com/photos/9403177/pexels-photo-9403177.jpeg?cs=srgb&dl=pexels-lucaspezeta-9403177.jpg&fm=jpg"
                alt="Calendar hero"
              />
            </div>
            <div className="wc-hero-caption">
              Plan your month. Track your tasks. Never miss a festival. All in one place.
            </div>

            <div className="wc-cal-card">
              <div className="wc-month-bar">
                <div className="wc-month-name">
                  {MONTHS[month]}
                  <span className="wc-month-year">{year}</span>
                </div>
                <div className="wc-nav-group">
                  <button className="wc-today-btn" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>Today</button>
                  <button className="wc-nav-btn" onClick={() => changeMonth(-1)}><ArrowLeft2 size={16} color={T.text} /></button>
                  <button className="wc-nav-btn" onClick={() => changeMonth(1)}><ArrowRight2 size={16} color={T.text} /></button>
                </div>
              </div>

              {selHol && showHol && (
                <div className="wc-festival-bar">
                  <lord-icon src="https://cdn.lordicon.com/dxjqoygy.json" trigger="loop" colors={`primary:${T.accent},secondary:${T.accentDeep}`} style={{ width: 28, height: 28 }} />
                  <div>
                    <div className="wc-festival-label">Festival</div>
                    <div className="wc-festival-name">{selHol}</div>
                  </div>
                  <button className="wc-festival-close" onClick={() => setSelHol(null)}>
                    <CloseCircle size={18} color={T.textMuted} />
                  </button>
                </div>
              )}

              <div className="wc-grid-wrap">
                <div className="wc-grid">
                  {DAYS_SHORT.map(d => (<div key={d} className="wc-dow">{d}</div>))}
                  {[...Array(firstDay)].map((_, i) => (<div key={`e${i}`} />))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const state = dayState(d);
                    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                    const hk = dayKey(month, d);
                    const festival = showHol && holidays[hk];
                    const isSolo = state === "start" && !end && !hover;

                    return (
                      <div
                        key={d}
                        className={["wc-day", state !== "none" ? `is-${state}` : "", isToday ? "is-today" : "", isSolo ? "is-solo" : ""].filter(Boolean).join(" ")}
                        onClick={() => clickDay(d)}
                        onMouseEnter={() => { if (selecting) setHover({ y: year, m: month, d }); }}
                        onMouseLeave={() => setHover(null)}
                        title={festival || ""}
                      >
                        {d}
                        {festival && <div className="wc-hol-dot" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="wc-sidebar">
            <div className="wc-range-card">
              <div className="wc-card-title"><Calendar size={14} color={T.textFaint} /> Selected Range</div>
              {start ? (
                <>
                  <div className="wc-range-dates">
                    {fmtDate(start)}
                    {(end || (selecting && hover)) && (
                      <>
                        <span className="wc-range-sep">to</span>
                        {fmtDate(end || (selecting && hover ? { ...hover } : null))}
                      </>
                    )}
                  </div>
                  {end && (
                    <div className="wc-range-chip"><TickCircle size={12} variant="Bold" />{rangeLen} day{rangeLen !== 1 ? "s" : ""} selected</div>
                  )}
                  {!end && <div className="wc-empty-hint">Click another day to set end date.</div>}
                  <button className="wc-clear-btn" onClick={() => { setStart(null); setEnd(null); setSelecting(false); setSelHol(null); }}>Clear selection</button>
                </>
              ) : (
                <div className="wc-empty-hint">Click any day on the calendar to start selecting a date range.</div>
              )}
            </div>

            <div className="wc-mini-card">
              <div className="wc-card-title">Upcoming Holidays</div>
              {upcomingHolidays.length === 0 ? (
                <div className="wc-mini-sub">No holidays this month.</div>
              ) : (
                upcomingHolidays.map((h, i) => (
                  <div key={i} className="wc-mini-item">
                    {MONTHS[h.m].slice(0,3)} {String(h.d).padStart(2,"0")} — {h.name}
                  </div>
                ))
              )}
            </div>

            <div className="wc-notes-card">
              <div className="wc-card-title"><Note size={14} color={T.textFaint} variant="Bulk" /> Notes</div>
              <div className="wc-notes-context">
                {start && end ? `${fmtDate(start)} — ${fmtDate(end)}` : `${MONTHS[month]} ${year}`}
              </div>

              <div className="wc-note-input-wrap">
                <textarea
                  className="wc-note-input"
                  rows={2}
                  placeholder="Add a note… (Enter to save)"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveNote();
                    }
                  }}
                />
                <button className="wc-note-save" onClick={saveNote} disabled={!noteInput.trim()} title="Save note">
                  <Add size={18} color="#fff" />
                </button>
              </div>

              <div className="wc-notes-list">
                {currentNotes.length === 0 ? (
                  <div className="wc-no-notes">
                    <Note size={28} color={T.textFaint} />
                    <br />
                    No notes yet
                    <div className="wc-no-note-sub">Tip: Add reminders for birthdays & tasks.</div>
                  </div>
                ) : (
                  currentNotes.map((n, i) => (
                    <div key={i} className="wc-note-item">
                      <div className="wc-note-bullet" />
                      <div className="wc-note-text">{n.text}</div>
                      <button className="wc-note-del" onClick={() => deleteNote(i)} title="Delete note">
                        <Trash size={15} color={T.textFaint} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}