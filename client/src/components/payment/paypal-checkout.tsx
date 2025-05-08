import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PayPalButton from '@/components/PayPalButton';

interface PayPalCheckoutProps {
  orderId: string;
  amount: number;
  currency?: string;
  intent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PayPalCheckout({ 
  orderId, 
  amount, 
  currency = 'INR', 
  intent = 'CAPTURE',
  onSuccess, 
  onCancel 
}: PayPalCheckoutProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading PayPal SDK
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PayPal Checkout</CardTitle>
        <CardDescription>
          Complete your payment securely with PayPal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Amount to pay</p>
          <p className="text-xl font-bold">₹{amount.toLocaleString()}</p>
        </div>
        
        <div className="w-full flex flex-col items-center">
          <PayPalButton
            amount={amount.toString()}
            currency={currency}
            intent={intent}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Click the PayPal button above to complete your payment
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}