# Wall Calendar — Interactive React Component

A polished, fully interactive wall‑calendar component built with **React + Vite**.  
It recreates a physical wall‑calendar aesthetic with a hero image, range selection, notes, holidays, and theme switching — all frontend‑only.

---

## ✨ Features

- **Wall Calendar Aesthetic**  
  Hero image + clean calendar layout that mimics a real wall calendar.

- **Day Range Selection**  
  Select start/end dates with clear visual states and hover preview.

- **Integrated Notes**  
  Notes are saved per month or range and stored in **localStorage**.

- **Festival / Holiday Highlights**  
  Indian public holidays (2025 & 2026) with tooltips and festival banner.

- **Dark / Light Mode**  
  Toggle theme instantly — colors, borders, and UI adapt.

- **Flip Animation**  
  Smooth month navigation with forward/back page‑flip style animation.

- **Fully Responsive**  
  Desktop side‑by‑side layout + mobile stacked layout.

---

## 🧰 Tech Stack

- React 18  
- Vite  
- CSS‑in‑JS (template literal style injection)  
- Google Fonts: **Syne** + **Inter**  
- localStorage for persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/your-username/wall-calendar.git
cd wall-calendar
npm install
```

### Run locally

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

### Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
wall-calendar/
  src/
    App.jsx            Entry — renders WallCalendar
    WallCalendar.jsx   Main component (logic + styles)
    main.jsx           React DOM root
  public/
  index.html
  package.json
  README.md
```

---

## 🧠 Design Decisions

- **Single‑file component**  
  The component is intentionally self‑contained for easier review.

- **No backend**  
  Per requirements, everything runs on the client with localStorage.

- **Year‑aware holidays**  
  Holiday data is stored per year to reflect correct festival dates.

---

## 📹 Demo

- **Video demo:** https://wall-calendar-sandy-ten.vercel.app/  

---

## 👤 Author

Built by **Yogesh Nayak**  
for the **takeUforward SWE Internship Frontend Challenge**.