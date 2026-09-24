import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleGenerateRecipe } from './generate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health & Status endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    provider: hasGeminiKey ? 'Gemini 1.5 Flash (Live API)' : 'Intelligent Culinary Mock Engine (Offline Mode)',
    hasApiKey: hasGeminiKey,
  });
});

// Recipe Generation Proxy endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, options } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        error: {
          title: 'Empty Prompt',
          message: 'Please provide ingredients or notes in your prompt.',
        },
      });
    }

    const { status, body } = await handleGenerateRecipe({ prompt, options });

    if (typeof body === 'string') {
      res.status(status).setHeader('Content-Type', 'text/plain').send(body);
    } else {
      res.status(status).json(body);
    }
  } catch (err: any) {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      error: {
        title: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred inside the backend proxy.',
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`🍳 Culinary AI Backend Proxy listening at http://localhost:${PORT}`);
  console.log(`📡 Ready to safely forward requests without exposing API keys to the browser.`);
});
