import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentGatewayStatusProps {
  status: any;
  isLoading: boolean;
}

export default function PaymentGatewayStatus({ status, isLoading }: PaymentGatewayStatusProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // If no gateways are configured, show warning message
  if (!status || (!status.stripe.available && !status.paypal.available && !status.razorpay.available)) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment Gateways Unavailable</AlertTitle>
        <AlertDescription>
          Our payment systems are currently being configured. Please try again later or contact us directly to discuss payment options.
        </AlertDescription>
      </Alert>
    );
  }

  // If at least one gateway is available, show available options
  return (
    <Alert>
      <Check className="h-4 w-4" />
      <AlertTitle>Payment Gateways Available</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p className="mb-2">The following payment methods are available:</p>
          <div className="flex flex-wrap gap-2">
            {status.stripe.available && (
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-200">
                <Check className="mr-1 h-3 w-3" /> Stripe
              </span>
            )}
            {status.paypal.available && (
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                <Check className="mr-1 h-3 w-3" /> PayPal
              </span>
            )}
            {status.razorpay.available && (
              <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900 px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-200">
                <Check className="mr-1 h-3 w-3" /> Razorpay
              </span>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}