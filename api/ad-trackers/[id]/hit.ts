import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real ad tracker logic
  if (req.method === 'POST') {
    const { id } = req.query;
    res.status(200).json({ message: `Ad tracker ${id} hit recorded.` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
