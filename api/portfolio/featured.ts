import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real featured portfolio data
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, title: 'E-commerce Platform', featured: true },
      { id: 2, title: 'AI Dashboard', featured: true }
    ]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
