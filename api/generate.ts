import { handleGenerateRecipe } from '../server/generate';

export default async function handler(req: any, res: any) {
  // Enable CORS for Vercel deployment
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  try {
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch {
        // use as-is
      }
    }

    const { prompt, options } = bodyData || {};

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
    console.error('Unhandled Vercel serverless error:', err);
    res.status(500).json({
      error: {
        title: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred processing your request.',
      },
    });
  }
}
