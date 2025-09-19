import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real featured testimonials data
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, author: 'Client A', text: 'Amazing work!' },
      { id: 2, author: 'Client B', text: 'Highly recommended.' }
    ]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
