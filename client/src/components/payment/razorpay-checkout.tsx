import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  onCancel: () => void;
  name?: string;
  email?: string;
  onSuccess?: () => void;
}

export default function RazorpayCheckout({
  orderId,
  amount,
  onCancel,
  name = '',
  email = '',
  onSuccess
}: RazorpayCheckoutProps) {
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
          toast({
            title: 'Error',
            description: 'Failed to load Razorpay. Please try another payment method.',
            variant: 'destructive',
          });
        };
        document.body.appendChild(script);
      });
    };

    // Load script only if not already loaded
    if (!window.Razorpay) {
      loadRazorpayScript();
    }
  }, [toast]);

  const openRazorpayCheckout = async () => {
    if (!window.Razorpay) {
      toast({
        title: 'Error',
        description: 'Razorpay is not loaded yet. Please wait or refresh the page.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Fetch key ID from the server
      const keyResponse = await fetch('/api/payment/status');
      const keyData = await keyResponse.json();
      const keyId = keyData.razorpay.keyId;

      if (!keyId) {
        throw new Error('Razorpay key not available');
      }

      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Samuel Marndi',
        description: 'Payment for services',
        order_id: orderId,
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: '#3182ce',
        },
        handler: function (response: any) {
          // Handle successful payment
          toast({
            title: 'Payment Successful',
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });

          // Verify payment on the server
          fetch('/api/payment/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.verified) {
                // Invalidate any related queries
                queryClient.invalidateQueries();
                
                if (onSuccess) {
                  onSuccess();
                }
              } else {
                toast({
                  title: 'Verification Failed',
                  description: 'Payment verification failed. Please contact support.',
                  variant: 'destructive',
                });
              }
            })
            .catch(err => {
              console.error('Verification error:', err);
              toast({
                title: 'Verification Error',
                description: 'There was an error verifying your payment.',
                variant: 'destructive',
              });
            });
        },
        modal: {
          ondismiss: function () {
            toast({
              title: 'Payment Cancelled',
              description: 'You have cancelled the payment process.',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to open Razorpay checkout. Please try another payment method.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-md bg-blue-50 border border-blue-100">
        <h3 className="text-lg font-medium mb-2">Complete Your Payment</h3>
        <p className="text-sm text-gray-600 mb-4">
          Pay ₹{amount.toFixed(2)} securely through Razorpay's payment gateway.
        </p>
        <div className="flex space-x-4">
          <Button 
            onClick={openRazorpayCheckout} 
            className="w-full"
          >
            Pay Now
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secured by Razorpay</span>
      </div>
    </div>
  );
}