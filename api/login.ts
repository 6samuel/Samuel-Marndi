import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Example: get data from request body
  const { username, password } = req.body;

  // TODO: Replace with your actual login logic
  if (username === 'admin' && password === 'password') {
    res.status(200).json({ success: true, token: 'your-jwt-token' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
}
