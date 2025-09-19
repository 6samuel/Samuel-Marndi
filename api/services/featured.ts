import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real featured services data
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, name: 'Premium Web Development', featured: true },
      { id: 2, name: 'AI-Powered Marketing', featured: true }
    ]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
