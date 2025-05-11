import { Request, Response } from 'express';
import { initStripe, getStripeStatus, createPaymentIntent, createPaymentIntentDirect, handleWebhook } from './stripe';
import { 
  createOrder as createPaypalOrder, 
  captureOrder as capturePaypalOrder,
  setupClient as setupPaypalClient,
  getPayPalStatus,
  initPayPal
} from './paypal';
import {
  createOrder as createRazorpayOrder,
  verifyPayment as verifyRazorpayPayment,
  getPaymentDetails as getRazorpayPaymentDetails,
  getRazorpayStatus,
  initRazorpay
} from './razorpay';
import { upiHandler } from './upi';

// Initialize all payment gateways
export const initPaymentGateways = () => {
  console.log('🔄 Initializing payment gateways...');
  
  try {
    const stripeInitialized = initStripe();
    console.log('💳 Stripe initialization:', stripeInitialized ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Stripe initialization error:', error);
  }
  
  try {
    const paypalInitialized = initPayPal();
    console.log('💰 PayPal initialization:', paypalInitialized ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ PayPal initialization error:', error);
  }
  
  try {
    const razorpayInitialized = initRazorpay();
    console.log('💸 Razorpay initialization:', razorpayInitialized ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Razorpay initialization error:', error);
  }
  
  // Initialize with error handling
  const stripeInitialized = initStripe();
  const paypalInitialized = initPayPal();
  const razorpayInitialized = initRazorpay();

  console.log('✅ Payment gateway initialization complete');
  
  return {
    stripeInitialized,
    paypalInitialized,
    razorpayInitialized,
    anyInitialized: stripeInitialized || paypalInitialized || razorpayInitialized
  };
};

// Check the status of all payment gateways
export const getPaymentGatewaysStatus = (req: Request, res: Response) => {
  res.json({
    stripe: getStripeStatus(),
    paypal: getPayPalStatus(),
    razorpay: getRazorpayStatus(),
    upi: {
      available: true, // UPI is always available as it doesn't require API keys
      upiId: upiHandler.upiId
    }
  });
};

// Export all payment functions
export {
  // Stripe
  initStripe,
  getStripeStatus,
  createPaymentIntent,
  createPaymentIntentDirect,
  handleWebhook,
  
  // PayPal
  initPayPal,
  getPayPalStatus,
  createPaypalOrder,
  capturePaypalOrder,
  setupPaypalClient,
  
  // Razorpay
  initRazorpay,
  getRazorpayStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPaymentDetails,
  
  // UPI
  upiHandler
};