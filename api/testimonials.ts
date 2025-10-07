import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM testimonials');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Database error', details: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
