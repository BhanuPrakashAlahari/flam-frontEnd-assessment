# CookMate - AI Fridge-to-Recipe Interactive Studio

Frontend Internship Assessment for Flam
Transform unpredictable AI model output into reliable, interactive, and resilient kitchen UI.

---

## 1. Overview

CookMate is a specialized React web application that converts unstructured kitchen notes (for example, "I have 3 eggs, cheddar cheese, garlic, spinach, and leftover rice") into an interactive culinary tool. 

The application communicates with a secure backend proxy to request structured JSON data conforming to a strict schema. All responses pass through defensive parsing, sanitization, and runtime Zod validation before rendering. The user interface handles all realistic AI failure modes gracefully without crashing, and includes dynamic interactive features such as scalable ingredient servings, smart substitutions, checkable steps with countdown timers, and a focus cooking mode.

---

## 2. Architecture & Design

The project uses a client-server architecture to ensure API keys remain protected while keeping the frontend fast and reactive:

```
flam/
├── src/
│   ├── components/
│   │   ├── ui/                    # Base UI components (navigation, dialog, buttons)
│   │   ├── PromptInput.tsx        # Ingredient input, quick-add pills, dietary filters
│   │   ├── ResultView.tsx         # State router (Loading / Error / Recipe / Empty)
│   │   ├── RecipeView.tsx         # Main recipe display (scalable servings, checkable steps)
│   │   ├── CookingModeModal.tsx   # Focus mode with step navigation & countdown timers
│   │   ├── ErrorState.tsx         # Defensive error UI with retry action and technical traces
│   │   ├── LoadingState.tsx       # Skeleton loaders and status indicators
│   │   ├── FailureSimulator.tsx   # Evaluator toolbar to trigger and verify failure modes
│   │   ├── SavedRecipesModal.tsx  # LocalStorage saved recipe drawer
│   │   └── Navbar.tsx             # Translucent navigation header with route links
│   ├── lib/
│   │   ├── api.ts                 # Backend communication, timeout guards, and request tracking
│   │   ├── validateResult.ts      # Defensive JSON sanitization and Zod schema validation
│   │   └── utils.ts               # Class name merging utility (cn)
│   ├── types/
│   │   └── result.ts              # TypeScript interfaces and Zod runtime schemas
│   ├── App.tsx                    # Top-level state orchestration and race condition protection
│   ├── index.css                  # Modern CSS design system (White & Royal Blue theme)
│   └── main.tsx                   # Application entry point
├── server/
│   ├── generate.ts                # Backend service handling Gemini API calls and mock engine
│   └── index.ts                   # Express server entry point on port 3001
├── .env.example                   # Environment configuration template
├── README.md                      # Project documentation
└── package.json                   # Dependencies and scripts
```

### Key Architectural Decisions:
1. **Protected Backend Proxy**: The Gemini API key is stored exclusively on the server (`server/index.ts` and `server/generate.ts`) and is never exposed to the client bundle.
2. **Defensive Validation Layer**: The client never directly consumes raw LLM responses. Data must pass through `cleanRawJsonString` and `RecipeResultSchema.safeParse` before entering application state.
3. **Built-in Mock Engine**: If no Gemini API key is configured, the server automatically uses an intelligent culinary mock engine to generate realistic responses, allowing full offline testing.

---

## 3. Quick Start & Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Running

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/BhanuPrakashAlahari/flam-frontEnd-assessment.git
cd flam
npm install
```

2. (Optional) Configure Google Gemini API Key:
By default, the application runs out-of-the-box using the built-in mock engine. To enable live AI generation:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

3. Start the application:
```bash
npm start
```
This command concurrently starts:
- The Backend Proxy on `http://localhost:3001`
- The Vite Frontend on `http://localhost:5173`

4. Open `http://localhost:5173` in your browser.

---

## 4. Error Handling Strategy

Handling unpredictability in generative AI output is central to this project. The system addresses all 6 core failure modes:

| Failure Mode | Root Cause | Handling Strategy | User Experience |
| :--- | :--- | :--- | :--- |
| **Malformed JSON** | Model outputs invalid syntax or markdown wrappers | Strips markdown fences (`\`\`\`json`), catches `JSON.parse` errors in `validateResult.ts`, and routes to a clear error state. | Clear error card explaining syntax failure with a "Retry Generation" button. |
| **Wrong Shape / Missing Fields** | Model produces valid JSON but omits mandatory fields or passes wrong types | Validates structure using runtime `Zod` schemas (`RecipeResultSchema.safeParse`). Handles `null` fields defensively with fallback defaults. | Descriptive error message identifying the missing fields without breaking the UI. |
| **Empty Response** | Model returns an empty string or whitespace | Checks for empty string/null data before parsing and routes to an explicit failure state. | Clear notification stating no content was generated, offering an instant retry. |
| **Slow Response / Timeout** | Upstream API hangs or network degrades | Uses an `AbortController` in `api.ts` configured with a 25-second timeout limit. | Request is safely aborted, loading spinner dismisses, and a timeout error with retry appears. |
| **Failed Backend Request** | Server error (HTTP 500), rate limiting (429), or network drop | Wraps all fetch calls in `try/catch` and inspects `response.ok`, extracting error details safely as plain text. | Non-crashing error card detailing the status code and actionable retry prompt. |
| **Stale Response Race Condition** | Older slow request resolves after a newer fast request | Tracks incremental `requestId` counters. Older in-flight responses that do not match the current ID are discarded. | Newer request data is preserved; stale responses never overwrite the latest UI state. |

---

## 5. Core Interactive Features

- **Dynamic Serving Scaler**: Adjust servings (1x, 2x, 4x, or custom 1-12 portions) with real-time recalculation of ingredient quantities and formatted fractions (for example: 1/2 tbsp, 1 3/4 cups, 300g).
- **Smart Ingredient Substitutions**: View realistic alternatives for dietary needs (e.g. dairy-free, vegetarian) and click to swap ingredients in-place.
- **Checkable Steps & Timers**: Cross off completed cooking steps with real-time progress tracking. Steps with durations include interactive countdown timers and audio completion chimes.
- **Focus Cooking Mode**: Distraction-free full-screen modal with large step text, ingredient callouts, and step navigation.
- **Recipe Refinement**: Refine an existing recipe with follow-up instructions (e.g., "Make it spicy", "Under 15 minutes").
- **Cookbook Storage**: Save favorite recipes to browser `localStorage` with options to copy ingredients or print recipe cards.
- **Evaluator Test Bar**: Collapsible toolbar at the bottom of the studio allowing reviewers to trigger all 6 failure modes with one click.

---

## 6. AI Usage Disclosure

In compliance with assessment requirements:
- **AI Coding Tools**: Used for scaffolding TypeScript boilerplate, drafting Zod validation schemas, and accelerating styling structure.
- **Independent Design & Logic**: Architecture, race-condition mitigation (`requestIdRef`), defensive stream handling, Web Audio chime synthesis, fraction scaling algorithms, and failure simulation testing were designed and reviewed by the candidate.

---

## 7. Time Spent Breakdown

- Architecture and Schema Definition: ~45 mins
- Backend Proxy and Gemini Integration: ~1 hour
- Defensive Validation Engine & Error Handling: ~1.5 hours
- Interactive UI Components & Cooking Mode: ~2.5 hours
- Design System, Animations, and Sound Effects: ~1.5 hours
- Testing, Verification, and Documentation: ~1 hour
- **Total Time**: ~8 hours
