import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real user authentication logic
  if (req.method === 'GET') {
    res.status(200).json({
      id: 1,
      username: 'admin',
      name: 'Samuel Marndi',
      role: 'admin'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
