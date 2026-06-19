<div align="center">
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/VITE-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/TAILWIND_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/FRAMER_MOTION-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <br/>
  <h1 align="center">Ecotrace AI</h1>
  <p align="center">
    <strong>Built to trace, not judge. A beautiful, formula-powered carbon footprint baseline calculator.</strong>
  </p>
</div>

---

## ⚡ Overview

Ecotrace AI is a premium, interactive SaaS web application designed to help users baseline their monthly carbon footprint without guilt trips. It guides users through transport, energy, food, waste, and shopping habits, then calculates a transparent estimate with deterministic formulas.

## ✨ Key Features

- **White and Green UI**: Light surfaces, green accents, pill controls, bold typography, and refined cards.
- **Guided Split-Screen Flow**: The brand story stays visible while the questionnaire transitions through each lifestyle category.
- **Deterministic Formula Engine**: No API keys, no LLM calls, and no hidden inference. The calculator uses explicit monthly emission factors.
- **Transparent Recommendations**: The dashboard generates four targeted actions from the user's highest-impact categories.
- **Interactive Dashboard**: As you select recommended actions, the "Future Footprint" calculator updates monthly CO2e savings in real time.

## 🚀 Quick Start

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Spin up the local dev server**
   ```bash
   npm run dev
   ```

3. **Configure Firebase and Supabase**
   Firebase handles Google OAuth. Supabase stores private footprint history through the `footprints` Edge Function.

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_FOOTPRINTS_FUNCTION_URL=https://your-project-ref.supabase.co/functions/v1/footprints
   ```

   Run `supabase-schema.sql` in the Supabase SQL editor, then deploy `supabase/functions/footprints`.

4. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

   For production:
   ```bash
   npm run deploy:prod
   ```

   The app uses deterministic formula-based calculations, so no AI API key is required.

## Calculation Engine

The app calculates monthly kg CO2e locally in `src/services/aiService.js` using:

- Weekly transport distances converted to monthly totals.
- Annual short-haul and long-haul flights converted to monthly averages.
- Electricity kWh, solar offset, LPG cylinders, and appliance toggles.
- Diet, waste, shopping, and second-hand behavior bands.

The returned object feeds the dashboard with `total`, `biggest`, `breakdown`, and four tailored actions.

## 🎨 Design Philosophy

"Built to trace, not judge." The application deliberately avoids the overused "eco-friendly green-and-white leaf" design. Instead, it leans into a "hacker/cyber" aesthetic with deep dark modes, implying precision, data, and technology, empowering the user to make data-driven decisions.

## 🎯 Hackathon Problem Statement Alignment

This project directly addresses the hackathon problem statement:

- **Meaningful Actionability** — Breaks complex global carbon emission problems into relatable, everyday user habits. The deterministic engine provides baseline measurements and identifies the user's largest carbon contributor.
- **Context-Aware Recommendations** — The formula engine uses the user's lifestyle profile to recommend targeted emission-reduction strategies with monthly kilogram savings.
- **Transparent Coaching** — EcoTrace avoids hallucinated AI math. Calculations and assumptions are formula-based and inspectable.
- **Private Saved History** — Firebase verifies identity, while Supabase stores each user's footprint history behind a token-verified Edge Function.
