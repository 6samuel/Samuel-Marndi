import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real data source
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, name: 'Web Development', description: 'Fast, responsive websites.' },
      { id: 2, name: 'AI Integration', description: 'Innovative AI solutions.' },
      { id: 3, name: 'Digital Marketing', description: 'Growth strategies.' }
    ]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
