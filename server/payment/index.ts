import { Request, Response } from 'express';
import { initStripe, getStripeStatus } from './stripe';
import { initPayPal, getPayPalStatus } from './paypal';
import { initRazorpay, getRazorpayStatus } from './razorpay';

// Initialize all payment gateways
export const initPaymentGateways = () => {
  const stripeInitialized = initStripe();
  const paypalInitialized = initPayPal();
  const razorpayInitialized = initRazorpay();

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
  });
};

// Re-export all payment functions
export * from './stripe';

// Re-export PayPal functions with unique names
import { 
  createOrder as createPaypalOrderOriginal, 
  captureOrder as capturePaypalOrderOriginal,
  setupClient as setupPaypalClientOriginal,
  getPayPalStatus,
  initPayPal
} from './paypal';

export { 
  createPaypalOrderOriginal as createPaypalOrder,
  capturePaypalOrderOriginal as capturePaypalOrder,
  setupPaypalClientOriginal as setupPaypalClient,
  getPayPalStatus,
  initPayPal
};

// Re-export Razorpay functions with unique names
import {
  createOrder as createRazorpayOrderOriginal,
  verifyPayment as verifyRazorpayPaymentOriginal,
  getPaymentDetails as getRazorpayPaymentDetailsOriginal,
  getRazorpayStatus,
  initRazorpay
} from './razorpay';

export {
  createRazorpayOrderOriginal as createRazorpayOrder,
  verifyRazorpayPaymentOriginal as verifyRazorpayPayment,
  getRazorpayPaymentDetailsOriginal as getRazorpayPaymentDetails,
  getRazorpayStatus,
  initRazorpay
};