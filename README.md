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

## EcoTrace AI - Sustainability Coach

EcoTrace AI is an AI-powered sustainability coach with transparent carbon calculations. Most people want to reduce their carbon footprint but have no idea where to start. EcoTrace transforms everyday habits into a measurable carbon baseline and provides a practical, interactive action plan to help you reduce your impact.

![EcoTrace AI preview](./src/assets/hero.png)

## Why This Matters
Climate action often feels overwhelming. Generic advice like "eat less meat" or "drive less" is hard to quantify. EcoTrace AI takes a different approach: it calculates a personalized baseline using rigorous scientific factors, then acts as an interactive coach to highlight the exact choices that will yield the biggest reductions for *your* specific lifestyle.

## Impact
- **Visibility:** Understand exactly what drives your emissions.
- **Actionability:** Get a prioritized list of practical changes, from switching to local cuisine (e.g., Dal/Rajma) to modifying transit habits.
- **Benchmarking:** Compare your monthly footprint to Indian, Global, and Paris Agreement targets.
- **Simulation:** Use the interactive What-If Simulator to preview how small habit changes affect your projected footprint.

## Carbon Methodology
To ensure maximum trust and reliability, EcoTrace AI uses a **deterministic engine** for its core footprint calculations, rather than relying on AI to guess raw emission numbers. 

### Scientific Sources
| Category | Source | Usage |
|----------|--------|-------|
| **Transport** | DEFRA | Per-km emissions for passenger vehicles and public transit. |
| **Energy** | EPA / IEA | Grid electricity averages and LPG emissions. |
| **Food** | IPCC | Dietary archetypes and lifecycle emissions. |
| **Waste** | Global Carbon Project | Household waste and consumer spending intensity. |

The AI layer is strictly used for **sustainability coaching**: interpreting the deterministic breakdown, generating personalized advice, and guiding the user through interactive chat.

## Sustainability Metrics (Score)
Users receive a visual **Carbon Health Score (0-100)** calculated against the Paris Agreement target (approx 170 kg CO₂e / month per capita). 

## Future Roadmap
- Deeper localization for city-specific grid emission factors.
- Integration with smart-home APIs for automatic electricity logging.
- Community challenges and leaderboards for collective impact tracking.

## Technical Stack
- React 19 + Vite
- Tailwind CSS 4 + Framer Motion
- Firebase (Auth) + Supabase (PostgreSQL History)
- Groq AI (Llama-3 / Qwen) for rapid coaching inference

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
