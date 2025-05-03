// This is a placeholder file.
// You can remove it if you don't need any API routes.
// Or replace it with your actual API routes.

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'MediShop API is running' });
}
