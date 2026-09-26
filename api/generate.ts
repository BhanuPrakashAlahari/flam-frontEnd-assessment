import { handleGenerateRecipe } from '../server/generate';

async function parseRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return req.body;
      }
    }
    return req.body;
  }

  // Stream fallback if body parser was not triggered
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export default async function handler(req: any, res: any) {
  // CORS Headers
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
    const bodyData = await parseRequestBody(req);
    const { prompt, options } = bodyData || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        error: {
          type: 'INVALID_PROMPT',
          title: 'Empty Prompt',
          message: 'Please enter ingredients or notes in your prompt.',
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
        type: 'SERVER_ERROR',
        title: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred processing your request.',
      },
    });
  }
}
