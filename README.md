<div align="center">
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/VITE-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/TAILWIND_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/FRAMER_MOTION-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <br/>
  <h1 align="center">Ecotrace AI 🌍</h1>
  <p align="center">
    <strong>Built to trace, not judge. A beautiful, AI-powered carbon footprint baseline calculator.</strong>
  </p>
</div>

---

## ⚡ Overview

Ecotrace AI is a premium, interactive SaaS web application designed to help users accurately baseline their monthly carbon footprint without the guilt trips. Built with a stunning **Dark Glassmorphism** aesthetic, it features a highly dynamic, global split-screen architecture that guides users through their transport, energy, and food habits.

Instead of relying on static mock data, Ecotrace AI is supercharged by **Groq / xAI** inference models. It securely processes your exact lifestyle inputs to generate a personalized climate action plan with real-time future impact calculations.

## ✨ Key Features

- 🔮 **Dark Glassmorphism UI**: High-end visual aesthetic featuring glowing neon-green accents, translucent bento-grid cards, and deep blacks.
- 📱 **Global Split-Screen Architecture**: The "Brand Story" stays sticky on the left while the interactive questionnaire seamlessly transitions on the right, providing a premium SaaS onboarding experience.
- 🤖 **Dynamic AI Integration**: Powered by blazing-fast open-source LLMs (Llama 3.3 70B, Qwen 3). The dashboard isn't hardcoded; the AI analyzes your inputs and streams back highly tailored JSON recommendations.
- 🔁 **Resilient Fallback Engine**: Built-in API service that accepts an array of API keys and fallback models. If a key gets rate-limited (`429`), it instantly and silently pivots to the next available key or model.
- 📊 **Interactive Dashboard**: As you select recommended actions (like "Switch to LEDs"), the "Future Footprint" calculator dynamically updates your monthly CO2e savings in real-time.

## 🚀 Quick Start

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Configure your AI Environment**
   Create a `.env` file in the root directory. You can supply multiple Groq/xAI API keys separated by commas. The built-in fallback engine will handle rate-limits automatically!
   ```env
   VITE_AI_API_KEYS=gsk_key_1,gsk_key_2,gsk_key_3
   ```

3. **Spin up the local dev server**
   ```bash
   npm run dev
   ```

## 🧠 The AI Fallback Architecture

To ensure flawless execution during live demos and prompt wars, the `aiService.js` implements a robust retry mechanism:

```javascript
// Example Fallback Logic
for (const key of apiKeys) {
  for (const model of FALLBACK_MODELS) {
    try {
      // Attempt inference
      const response = await fetch(API_URL, { ... });
      if (response.status === 429) continue; // Rate limited, try next!
      return await response.json();
    } catch (e) {
      // Handle errors silently and pivot
    }
  }
}
```

## 🎨 Design Philosophy

"Built to trace, not judge." The application deliberately avoids the overused "eco-friendly green-and-white leaf" design. Instead, it leans into a "hacker/cyber" aesthetic with deep dark modes, implying precision, data, and technology, empowering the user to make data-driven decisions.

## 🎯 Hackathon Problem Statement Alignment

This project directly addresses the hackathon problem statement:

- **Meaningful Actionability** — Breaks complex global carbon emission problems into relatable, everyday user habits. The deterministic engine provides baseline measurements and identifies the user's largest carbon contributor.
- **Context-Aware Recommendations** — The AI leverages the user's specific lifestyle profile (diet, travel, energy) to recommend targeted emission-reduction strategies, calculating precise monthly kilogram savings for each tip.
- **Transparent Coaching** — EcoCoach avoids hallucinated "AI math." Calculations and assumptions are explicitly presented. The AI layer acts strictly as a coach to explain data and provide actionable advice.
- **Resiliency & Fallbacks** — The system features a local fallback rule-engine. If the AI fails or times out, the app gracefully degrades to deterministic recommendations using a prioritised model hierarchy.
