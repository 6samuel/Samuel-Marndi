import React, { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutFormProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({ amount, onSuccess, onCancel }: Omit<StripeCheckoutFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      return;
    }

    setIsProcessing(true);

    // Confirm the payment with the card Element
    const { error } = await stripe.confirmPayment({
      // Elements instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payment-success',
      },
    });

    if (error) {
      setErrorMessage(error.message);
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } else {
      // The payment has been processed!
      toast({
        title: 'Payment successful',
        description: 'Thank you for your payment!',
      });
      onSuccess?.();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      
      <div className="flex justify-between mt-6">
        <div>
          <p className="text-sm text-muted-foreground">Amount to pay</p>
          <p className="text-xl font-bold">₹{amount.toLocaleString()}</p>
        </div>
        
        <div className="space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default function StripeCheckout({ clientSecret, amount, onSuccess, onCancel }: StripeCheckoutFormProps) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Set a small delay to ensure the Stripe Elements are mounted correctly
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady || !clientSecret) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const appearance: { theme: 'flat' | 'stripe' | 'night' } = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
        <CardDescription>
          Complete your payment using our secure payment processor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm 
            amount={amount} 
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}