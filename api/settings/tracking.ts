import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: Replace with real tracking settings data
  if (req.method === 'GET') {
    res.status(200).json({
      googleAnalyticsId: 'UA-XXXXXX-X',
      facebookPixelId: '1234567890',
      hotjarId: '987654',
      snapchatPixelId: 'SNAP-1234'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
