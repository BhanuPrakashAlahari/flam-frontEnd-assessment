export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    provider: hasGeminiKey ? 'Gemini 3 Flash (Live AI)' : 'Intelligent Culinary Mock Engine (Offline Mode)',
    hasApiKey: hasGeminiKey,
  });
}
