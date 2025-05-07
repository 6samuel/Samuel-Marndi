import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Will be initialized when the key credentials are available
let razorpay: Razorpay | null = null;

// Initialize Razorpay with the key credentials
export const initRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    
    console.log('Razorpay payment gateway initialized');
    return true;
  } else {
    console.warn('Razorpay payment gateway not initialized: Missing key credentials');
    return false;
  }
};

// Create a Razorpay order
export const createOrder = async (req: Request, res: Response) => {
  if (!razorpay) {
    return res.status(503).json({ 
      error: 'Razorpay payment gateway not available',
      configured: false
    });
  }

  try {
    const { amount, currency = 'INR', receipt = 'order_receipt', notes = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify a Razorpay payment
export const verifyPayment = (req: Request, res: Response) => {
  if (!razorpay) {
    return res.status(503).json({ error: 'Razorpay payment gateway not available' });
  }

  try {
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ error: 'Missing required payment data' });
    }

    // Verify the payment signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: 'Missing key secret' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Payment is valid
      res.json({ verified: true });
    } else {
      res.status(400).json({ error: 'Invalid payment signature', verified: false });
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment details
export const getPaymentDetails = async (req: Request, res: Response) => {
  if (!razorpay) {
    return res.status(503).json({ error: 'Razorpay payment gateway not available' });
  }

  try {
    const { payment_id } = req.params;
    const payment = await razorpay.payments.fetch(payment_id);
    res.json(payment);
  } catch (error: any) {
    console.error('Error fetching Razorpay payment details:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check if Razorpay is configured
export const getRazorpayStatus = () => {
  return {
    available: !!razorpay,
    keyId: process.env.RAZORPAY_KEY_ID || null
  };
};