# CookMate - AI Fridge-to-Recipe Interactive Studio

> **Frontend Internship Assessment for Flam**  
> Transform unpredictable AI model output into a reliable, interactive, and resilient kitchen UI.

---

## 1. Project Overview

**CookMate** is a specialized React web application that converts unstructured kitchen notes (e.g., *"I have 3 eggs, cheddar cheese, garlic, baby spinach, and leftover rice"*) into an interactive culinary tool.

The application communicates with a secure backend proxy to request structured JSON conforming to a strict recipe schema. All incoming responses pass through defensive parsing, sanitization, and runtime Zod validation before rendering. The user interface gracefully handles all realistic AI failure modes without crashing, offering dynamic features such as scalable servings, interactive ingredient swaps, checkable cooking steps with countdown timers, focus cooking mode, and local cookbook storage.

---

## 2. Architecture & Directory Structure

The project follows the assessment's designated client-server architecture to ensure API keys remain protected while keeping the frontend fast, responsive, and defensive:

```
flam-frontend-assignment/
├── src/
│   ├── components/
│   │   ├── ui/                    # Base UI primitives (buttons, dialogs, sheet, inputs)
│   │   ├── PromptInput.tsx        # Free-form ingredient input, quick-add pills, dietary filters
│   │   ├── ResultView.tsx         # State router (Loading / Error / Recipe / Empty)
│   │   ├── RecipeView.tsx         # Main recipe display (scalable servings, swaps, checkable steps)
│   │   ├── CookingModeModal.tsx   # Focus mode with step navigation, timers & audio chime
│   │   ├── ErrorState.tsx         # Shared defensive error UI with retry action and technical traces
│   │   ├── LoadingState.tsx       # Skeleton loader with progressive culinary status updates
│   │   ├── FailureSimulator.tsx   # Evaluator toolbar to trigger and verify failure modes
│   │   ├── SavedRecipesModal.tsx  # LocalStorage cookbook drawer
│   │   └── Navbar.tsx             # Floating navigation bar with route links
│   ├── lib/
│   │   ├── api.ts                 # ONLY place frontend talks to backend; timeout & stale guards
│   │   ├── validateResult.ts      # Defensive JSON sanitization and Zod runtime schema validation
│   │   ├── culinaryValidation.ts  # Pre-flight culinary dictionary and non-food intent detector
│   │   └── utils.ts               # Class name merging utility (cn)
│   ├── types/
│   │   └── result.ts              # TypeScript interfaces and Zod runtime schemas
│   ├── App.tsx                    # Top-level state orchestration and race condition protection
│   ├── index.css                  # Tailwind CSS design system (White & Royal Blue theme)
│   └── main.tsx                   # Application entry point
├── server/
│   ├── generate.ts                # Backend proxy handling Gemini API calls and mock fallback
│   └── index.ts                   # Express server entry point on port 3001
├── api/
│   ├── generate.ts                # Vercel Serverless Function endpoint for recipe generation
│   └── health.ts                  # Serverless health check endpoint
├── .env.example                   # Environment configuration template
├── vercel.json                    # Vercel deployment and SPA routing configuration
├── README.md                      # Complete project documentation
└── package.json                   # Dependencies and scripts
```

---

## 3. Setup Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Local Installation & Running

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/BhanuPrakashAlahari/flam-frontEnd-assessment.git
   cd flam
   npm install
   ```

2. **Configure Environment Variables (Optional):**
   The application works out-of-the-box in offline testing mode using the built-in Intelligent Culinary Mock Engine. To enable live Google Gemini Flash AI generation:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   ```

3. **Start the Development Environment:**
   ```bash
   npm start
   ```
   This concurrently launches:
   * **Backend Proxy Server** on `http://localhost:3001`
   * **Vite React Frontend** on `http://localhost:5173`

4. Open `http://localhost:5173` in your browser.

### Vercel Production Deployment

* **Framework Preset**: Vite
* **Root Directory**: `./`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add `GEMINI_API_KEY` in your Vercel Project Settings.

---

## 4. Usage Guide

1. **Enter Ingredients**:
   * Type any free-form text into the prompt input (e.g. *"3 eggs, pasta, spinach, parmesan, garlic"*).
   * Click quick-add ingredient tags or select dietary preferences (e.g. *Vegetarian, High Protein, Dairy-Free*).
   * Click **Generate Recipe**.

2. **Adjust Servings & Portions**:
   * Use the `+` and `-` stepper on the recipe card to adjust portions (1–12 portions).
   * Ingredient quantities and fractions automatically recalculate in real-time (e.g. `1/2 tbsp`, `1 1/4 cups`, `300g`).

3. **Interactive Ingredient Substitutions**:
   * Click any highlighted substitution pill under an ingredient to swap it in-place (e.g., swapping *Eggs* for *Silken Tofu* or *Butter* for *Avocado Oil*).

4. **Cooking Mode with Timers**:
   * Click **Start Fullscreen Cooking Mode** for a distraction-free step-by-step view.
   * Cross off steps as you cook.
   * Start built-in countdown timers for simmering/baking steps with synthesized Web Audio chimes upon completion.

5. **Recipe Refinement**:
   * Use the refinement bar to tweak the current recipe (e.g., *"Make it spicy"*, *"Air fryer version"*, *"Under 15 minutes"*).

6. **Cookbook Storage**:
   * Click **Save** to persist the recipe to browser `localStorage`.
   * Click **Cookbook** in the navbar to browse, view, or delete saved recipes.
   * Click **Print** to export a clean printable recipe card or **Copy** to copy formatted ingredients to your clipboard.

7. **Evaluator Simulation Toolbar**:
   * Click **Assignment Evaluator: Live AI Failure Simulation Toolbar** at the bottom of the Studio page to trigger and verify the 6 failure scenarios with 1 click.

---

## 5. Error Handling Strategy

The system defends against all 6 core failure modes without crashing the React render tree:

| Failure Mode | Root Cause | Handling Strategy | User Experience |
| :--- | :--- | :--- | :--- |
| **Malformed JSON** | Model outputs invalid syntax or unclosed brackets | Strips markdown fences (`\`\`\`json`), wraps `JSON.parse` in defensive try/catch in `validateResult.ts`. | Displays `MALFORMED_JSON` error card with collapsible technical diagnostics and a Retry button. |
| **Wrong Shape / Missing Fields** | Model produces valid JSON missing required schema properties | Validates structure using runtime `Zod` schemas (`RecipeResultSchema.safeParse`) with fallbacks. | Displays `WRONG_SHAPE` error card listing exact field violations without breaking UI. |
| **Empty Response** | Model returns empty string, whitespace, or null payload | Boundary checks before parsing route immediately to explicit empty failure handler. | Displays `EMPTY_RESPONSE` error card offering instant retry or sample recipe loading. |
| **Slow Response / Timeout** | Upstream model hangs or network latency exceeds limit | Uses an `AbortController` in `src/lib/api.ts` with a strict 25-second timeout limit. | Request aborts safely, cancels loading state, and displays `SLOW_TIMEOUT` error card. |
| **Backend Server Error (500)** | Gateway error, rate limit (429), or proxy failure | Wraps all fetch calls in defensive handlers, extracting error details as plain text. | Displays `SERVER_ERROR` card detailing HTTP status code with actionable retry prompt. |
| **Stale Response Race Condition** | Older slow request resolves after a newer fast request | Uses monotonic `requestId` counters and active `AbortController` abort signals. | Older in-flight response is discarded; only the latest request updates the UI. |

---

## 6. AI Usage Note

In accordance with assessment transparency guidelines:

* **AI Coding Assistants**: AI tools (such as Claude / Gemini / ChatGPT) were used to accelerate initial boilerplate generation (e.g. preliminary Tailwind utility classes and baseline TypeScript interface declarations).
* **Independent Architecture & Logic**:
  * The dual-layer defensive validation architecture (`validateCulinaryInput` &rarr; `validateResult` &rarr; `Zod schema safeParse`) was architected and verified independently.
  * Stale request race condition prevention using monotonic ID refs (`requestId !== staleRequestIdRef.current`) and `AbortController` signal abortion was custom-built.
  * Fraction scaling algorithms (`formatAmount`), synthesized Web Audio timer chimes, and the 1-click Evaluator Failure Simulation toolbar were custom-designed and implemented for this assessment.

---

## 7. Known Limitations

1. **LLM Nutrition Estimation**: Nutritional values (calories, protein, carbs, fats) are estimates calculated by generative AI models and should not be used as certified medical or dietary advice.
2. **Single Recipe Output**: The model generates one curated recipe per prompt rather than multi-recipe comparison matrices.
3. **Local Storage Cookbook**: Saved recipes are persisted in browser `localStorage` (client-side only), meaning they are device-specific and will clear if browser storage is reset.
4. **Offline Lexicon Boundaries**: The offline culinary lexicon contains ~150+ common ingredients and dishes; highly obscure regional ingredients may require live Gemini AI mode for optimal recognition.

---

## 8. Time Spent Breakdown

| Phase | Description | Time Spent |
| :--- | :--- | :--- |
| **Phase 1: Architecture & Schema Design** | Defining `RecipeResult` data model, Zod runtime schemas, and client-server boundaries | ~45 mins |
| **Phase 2: Backend Proxy & Gemini Integration** | Express proxy on port 3001, Vercel serverless functions, prompt engineering, and smart mock fallback | ~1 hour |
| **Phase 3: Defensive Validation & Error Pipeline** | Building `validateResult.ts`, culinary input validator, and the 6-mode failure handling system | ~1.5 hours |
| **Phase 4: Interactive UI Components** | Building `RecipeView`, serving scaler, ingredient swaps, checkable steps, and focus cooking mode modal | ~2.5 hours |
| **Phase 5: Design System, Polish & Sound** | Styling design system (White & Royal Blue), animations, Web Audio chime synthesis, and responsive layouts | ~1.5 hours |
| **Phase 6: Testing, Edge Cases & Documentation** | Evaluator toolbar, stale race condition verification, Vercel production deployment, and README | ~1 hour |
| **Total Development Time** | | **~8 hours** |
