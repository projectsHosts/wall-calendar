# Wall Calendar — Interactive React Component

A polished, fully interactive wall calendar component built with React and Vite. Inspired by the aesthetic of a physical wall calendar, this component blends clean visual design with practical scheduling functionality.

---

## Overview

This project was built as part of the takeUforward Frontend Engineering Challenge. The goal was to translate a static wall calendar design concept into a highly functional, responsive, and user-friendly React component — without any backend or external data dependencies.

---

## Features

**Wall Calendar Aesthetic**
The UI is designed to resemble a physical wall calendar. A prominent hero panel on the left displays the current month name, year, and a decorative motif. Each month carries its own color theme and gradient, giving the calendar a distinct identity as you navigate through the year.

**Day Range Selection**
Users can select a start date and an end date directly on the calendar grid. The component provides clear visual differentiation between the start date, end date, and all days falling within the selected range. A hover preview shows the potential range before the user confirms the end date.

**Festival Display on Click**
When a user clicks on a day that has a festival or public holiday, the festival name appears in the hero panel with a smooth animation. This makes holiday awareness a natural part of the interaction rather than an afterthought.

**Integrated Notes**
A dedicated notes panel allows users to attach written notes to a selected date range or to the current month as a whole. Notes are saved to localStorage, so they persist across page refreshes without requiring any backend or database.

**Month Themes**
Each of the twelve months has a unique gradient palette and accent color. As the user navigates between months, the entire UI recolors itself to match — including the calendar grid highlights, notes save button, and toggle controls.

**Page Flip Animation**
Navigating forward or backward between months triggers a subtle rotateX animation that mimics the feel of turning a physical calendar page. The direction of the animation is aware of whether the user is going forward or backward.

**Indian Public Holidays**
The calendar includes year-aware Indian public holidays for 2025 and 2026. Holiday dates are accurate to the actual lunar-calendar-based dates for festivals like Holi, Diwali, and Janmashtami, not hardcoded approximations. Holiday days display a small accent dot on the grid, and a tooltip appears on hover.

**Dark and Light Mode**
A toggle in the information panel switches between dark and light themes. The entire component adapts, including backgrounds, text, borders, and surface colors.

**Fully Responsive**
On desktop, the layout presents a side-by-side arrangement with the hero panel on the left and the calendar grid on the right. On mobile, the layout stacks vertically and remains fully usable with touch-friendly tap targets.

---

## Tech Stack

- React 18
- Vite
- CSS-in-JS via template literals (no external styling library)
- Google Fonts — Playfair Display and DM Sans
- localStorage for note persistence

No external component libraries or UI frameworks were used. All styling and layout logic is written from scratch.

---

## Getting Started

**Prerequisites**

Node.js version 18 or higher is required.

**Installation**

Clone the repository:

```bash
git clone https://github.com/your-username/wall-calendar.git
cd wall-calendar
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

**Build for Production**

```bash
npm run build
```

---

## Project Structure

```
wall-calendar/
  src/
    App.jsx            Entry point — renders the WallCalendar component
    WallCalendar.jsx   Main component — all logic, state, and styles
    main.jsx           React DOM root
  public/
  index.html
  package.json
  README.md
```

The component is intentionally written as a single self-contained file. This was a deliberate choice for the assessment context — it keeps the submission easy to review and requires zero configuration to drop into any React project.

---

## Design Decisions

**Single file architecture**
The entire component lives in one file. For a production application, this would be broken into smaller components and separate style files. For an assessment submission, a single file allows the reviewer to read the entire implementation without jumping between files.

**CSS-in-JS with template literals**
Rather than reaching for Tailwind or a component library, all styles are written as a CSS string injected via a style tag. This approach keeps the component fully portable and dependency-free while still supporting dynamic theming based on the selected month.

**Year-aware holidays**
Indian festivals like Holi and Diwali fall on different dates each year based on the Hindu lunar calendar. Rather than hardcoding a fixed date like March 25 for Holi every year, the component maintains a lookup table per year so the dates are actually correct.

**No backend, no API**
The assessment brief explicitly required a frontend-only solution. All data persistence is handled through localStorage. The component works entirely offline after the initial load.

---

## Live Demo

Deployed on Vercel: [your-vercel-link-here]

---

## Author

Built by [Your Name] as part of the takeUforward SWE Internship Frontend Challenge.