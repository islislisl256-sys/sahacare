import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const message = req.query.message?.toString() ?? 'Unknown';
  res.status(500).json({
    error: 'Authentication error',
    message,
  });
}
