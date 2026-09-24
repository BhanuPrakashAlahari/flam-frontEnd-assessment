# 🍳 CulinaryCraft — AI Fridge-to-Recipe Interactive Studio
> **Frontend Internship Assignment for Flam**  
> *Transform unpredictable AI model output into reliable, interactive, and resilient kitchen UI.*

---

## 🌟 1. Overview & Objective

**CulinaryCraft** is a specialized React application that takes unstructured, free-form kitchen notes (e.g. *"I have 3 eggs, half a block of cheddar, some baby spinach, garlic, and leftover rice"*) and converts them into an interactive culinary tool — **never a raw chatbot window**.

The application communicates with a secure backend proxy to request strict, structured JSON data conforming to an enforced schema, passes all responses through defensive parsing and runtime Zod validation before rendering, and handles every realistic failure mode gracefully without crashing.

---

## 🚀 2. Quick Start

Running the entire full-stack app (Backend Proxy + Vite Frontend) requires only a single command:

```bash
# 1. Install dependencies
npm install

# 2. Start both Backend Proxy (:3001) and Frontend (:5173)
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 🔑 Environment Variables (`.env`)
By default, the application runs out-of-the-box using the built-in **Intelligent Culinary Mock Engine** (no API key required for immediate review and testing!).

To use a live Google Gemini API key:
1. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   ```

---

## 🛠️ 3. Core Architecture & Project Structure

The project strictly follows the architecture outlined in the assignment brief, separating API proxying, shape validation, and interactive UI components:

```
flam/
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx        # Free-form input, quick-add pills, surprise combos, dietary filters
│   │   ├── ResultView.tsx         # State router (Loading / Error / Recipe / Empty)
│   │   ├── RecipeView.tsx         # Main interactive view (scalable servings, checkable steps, swaps)
│   │   ├── CookingModeModal.tsx   # Fullscreen focus mode with step-by-step navigation & timers
│   │   ├── ErrorState.tsx         # Shared defensive error UI with technical diagnostic trace
│   │   ├── LoadingState.tsx       # Animated culinary loading tips & skeleton shimmers
│   │   ├── FailureSimulator.tsx   # Evaluator toolbar to trigger & verify failure modes on demand
│   │   ├── SavedRecipesModal.tsx  # LocalStorage saved recipe drawer
│   │   └── Navbar.tsx             # Header with live server health badge & bookmarks count
│   ├── lib/
│   │   ├── api.ts                 # Talks ONLY to backend proxy; includes stale request guards
│   │   └── validateResult.ts      # Strict defensive JSON cleaning & Zod schema validation
│   ├── types/
│   │   └── result.ts              # TypeScript interfaces & Zod runtime validation schemas
│   ├── App.tsx                    # Main state orchestration & race-condition mitigation
│   ├── index.css                  # Modern CSS design system with glassmorphism & animations
│   └── main.tsx
├── server/
│   ├── generate.ts                # Protected backend proxy holding API key, Gemini caller & mock engine
│   └── index.ts                   # Express server entry point on port 3001
├── .env.example
├── README.md
└── package.json
```

---

## ✨ 4. Interactive Features

### ⚖️ 1. Dynamic Scalable Servings
- Allows scaling portion sizes (1x, 2x, 4x, or custom 1–12 portions).
- Dynamically recalculates all ingredient amounts with fraction formatting (e.g. `½ tbsp`, `1 ¾ cups`, `300g`).

### 🔄 2. Smart Ingredient Swaps
- The AI provides realistic substitutions (e.g., *Cheddar Cheese ➔ Nutritional Yeast for Dairy-Free*, or *Chicken ➔ Crispy Tofu*).
- Clicking any swap pill updates the ingredient item in-place with its replacement ratio and highlights dietary benefits.

### ☑️ 3. Checkable Steps & Active Timers
- Interactive checklist to cross off completed cooking steps with real-time progress bar.
- Steps with cooking durations include built-in countdown timers with audio chimes (synthesized via Web Audio API).

### ⏱️ 4. Fullscreen Focus Cooking Mode
- Distraction-free kitchen display designed for cooking at the stove.
- Large legible fonts, ingredients needed for the active step, step-by-step navigation, and celebratory confetti upon completion.

### 🔁 5. Dynamic Recipe Refinement Loop
- Refine existing recipes without starting from scratch (e.g., *"Make it spicy"*, *"Convert to air fryer"*, *"Under 15 minutes"*).

### 💾 6. LocalStorage Bookmarks & Export
- Save favorite generated recipes to browser storage.
- One-click ingredient copy to clipboard and print-optimized recipe cards (`@media print`).

---

## 🛡️ 5. Defensive Data Handling & Realistic Failure Modes

Handling unpredictability in AI output is the primary core of this assignment. The app includes dedicated mechanisms for every failure scenario:

| Failure Mode | How It Is Handled | Verification in App |
| :--- | :--- | :--- |
| **Malformed JSON** | `validateResult.ts` catches parse errors in a `try/catch` block, sanitizes markdown fences, and routes to `ErrorState` with the exact syntax exception. | Click **"Malformed JSON"** in the top Evaluator Bar. |
| **Wrong Shape / Missing Fields** | `validateResult.ts` runs strict runtime **Zod schema validation**. Missing fields or wrong types trigger actionable diagnostics without UI crashes. | Click **"Wrong Shape / Missing Fields"** in the Evaluator Bar. |
| **Empty AI Response** | Checks for null/empty/blank string responses and renders a descriptive error explaining that the AI provided no data. | Click **"Empty Response"** in the Evaluator Bar. |
| **Slow Response / Timeout** | `lib/api.ts` uses an `AbortController` with a 25-second timeout guard to prevent silent hangs, displaying a timeout error state. | Click **"Slow Response (Timeout)"** in the Evaluator Bar. |
| **Failed Backend Request (500)** | Gracefully captures server errors and HTTP gateway failures, displaying a friendly error with retry capabilities. | Click **"Server 500 Error"** in the Evaluator Bar. |
| **Stale Response Race Condition** | `requestId` tracking ensures that if a user fires a fast request while a slower request is in-flight, the older response is safely discarded. | Click **"Stale Request Guard Test"** in the Evaluator Bar. |

---

## 🧪 6. Evaluator Bar (Testing Failure Modes)

To make evaluating and grading as straightforward as possible, a collapsible **"Assignment Evaluator Bar"** is built into the top of the interface. 

You can trigger any error state with a single click and observe how the application handles it and recovers seamlessly when you click **"Retry Generation"**.

---

## 🤖 7. AI Usage Disclosure

In adherence to Section 8 of the assignment guidelines:
- **AI Coding Assistant**: Used for accelerating boilerplate scaffolding, drafting strict Zod validation schemas, and refining CSS styling tokens.
- **Independent Design & Implementation**: The architecture, stale response guard mechanics (`requestId.current`), custom Web Audio chime synthesis, fraction scaling algorithms, and failure simulation harness were designed and reviewed by the candidate.

---

## ⏱️ 8. Time Spent Breakdown

- **Architecture & JSON Schema Design (Step 1)**: ~45 mins
- **Backend Proxy & Gemini/Mock Integration (Step 2 & 3)**: ~1 hour
- **Validation Engine & Error Handling (`validateResult.ts`, `api.ts`)**: ~1.5 hours
- **Interactive UI Components (Scalable Servings, Swaps, Focus Mode)**: ~2.5 hours
- **Styling, Animations, Confetti & Sound Effects**: ~1.5 hours
- **Testing, Failure Simulation Bar & Documentation**: ~1 hour
- **Total Time**: ~8 hours

---

## 📦 9. Known Limitations & Next Steps

1. **Voice Control**: Integrating Web Speech API for hands-free *"Next step"* voice commands while cooking.
2. **Multi-Recipe Comparison**: Generating 2-3 variations (e.g. Quick vs Gourmet) from the same ingredients.
3. **Pantry Inventory Sync**: Persisting full kitchen stock in IndexedDB.
