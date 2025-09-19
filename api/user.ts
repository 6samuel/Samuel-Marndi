import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      // Example: get first user (customize as needed)
      const result = await pool.query('SELECT * FROM users LIMIT 1');
      res.status(200).json(result.rows[0] || {});
    } catch (error) {
      res.status(500).json({ error: 'Database error', details: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
