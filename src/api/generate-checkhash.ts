import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { merchantId, returnUrlSuccess, returnUrlSuccessServer, orderId, amount, currency } = req.body;

    // Validate input
    if (!merchantId || !returnUrlSuccess || !returnUrlSuccessServer || !orderId || !amount || !currency) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const secretKey = process.env.TEYA_SECRET_KEY;
    if (!secretKey) {
      throw new Error('TEYA_SECRET_KEY is not set in environment variables');
    }

    // Create the message string
    const message = `${merchantId}|${returnUrlSuccess}|${returnUrlSuccessServer}|${orderId}|${amount}|${currency}`;

    // Generate the HMAC SHA256 hash
    const checkhash = crypto.createHmac('sha256', secretKey)
                            .update(message)
                            .digest('hex');

    res.status(200).json({ checkhash });
  } catch (error) {
    console.error('Error generating checkhash:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}