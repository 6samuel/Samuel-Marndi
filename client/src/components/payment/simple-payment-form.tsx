import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import StripeCheckout from './stripe-checkout';
import PayPalCheckout from './paypal-checkout';
import RazorpayCheckout from './razorpay-checkout';
import UpiPayment from './upi-payment';

// Define form schema
const simplePaymentSchema = z.object({
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  paymentFor: z.string().min(5, 'Please describe what this payment is for'),
  paymentMethod: z.enum(['stripe', 'paypal', 'razorpay', 'upi']),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
});

type SimplePaymentFormValues = z.infer<typeof simplePaymentSchema>;

interface SimplePaymentFormProps {
  gatewayStatus: any;
}

export default function SimplePaymentForm({ gatewayStatus }: SimplePaymentFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Form definition
  const form = useForm<SimplePaymentFormValues>({
    resolver: zodResolver(simplePaymentSchema),
    defaultValues: {
      amount: '',
      paymentFor: '',
      paymentMethod: 'stripe',
      name: '',
      email: '',
    },
  });

  // Mutation for payment initialization
  const { mutate: initializePayment, isPending } = useMutation({
    mutationFn: async (data: SimplePaymentFormValues) => {
      let response;
      
      switch (data.paymentMethod) {
        case 'stripe':
          response = await apiRequest(
            'POST', 
            '/api/payment/stripe/create-intent', 
            { 
              amount: parseFloat(data.amount),
              description: data.paymentFor,
              name: data.name,
              email: data.email
            }
          );
          break;
        case 'paypal':
          response = await apiRequest(
            'POST', 
            '/api/payment/paypal/create-order', 
            { 
              amount: data.amount,
              currency: 'INR',
              intent: 'CAPTURE'
            }
          );
          break;
        case 'razorpay':
          response = await apiRequest(
            'POST', 
            '/api/payment/razorpay/create-order', 
            { 
              amount: parseFloat(data.amount),
              currency: 'INR',
              receipt: `payment_${Date.now()}`,
              notes: {
                paymentFor: data.paymentFor,
                name: data.name,
                email: data.email
              }
            }
          );
          break;
        case 'upi':
          // For UPI, just get UPI info from server
          response = await apiRequest(
            'GET', 
            '/api/payment/upi/info', 
            {}
          );
          
          // Also record this payment attempt
          await apiRequest(
            'POST', 
            '/api/payment/upi/record', 
            { 
              amount: parseFloat(data.amount),
              description: data.paymentFor,
              name: data.name,
              email: data.email,
              status: 'initiated'
            }
          ).catch(err => console.error('Error recording UPI payment:', err));
          
          break;
      }
      
      // If response is undefined (shouldn't happen), return an empty object
      return response ? await response.json() : {};
    },
    onSuccess: (data) => {
      toast({
        title: 'Payment Initialized',
        description: 'Payment gateway ready',
      });
      
      // Save the payment data for the checkout components
      setPaymentData(data);
      
      // Move to payment step
      setCurrentStep(3);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Payment initialization failed',
        description: error.message || 'Please try again or use a different payment method.',
      });
    },
  });

  function onSubmit(data: SimplePaymentFormValues) {
    if (currentStep === 1) {
      setCurrentStep(2); // Move to review step
    } else if (currentStep === 2) {
      initializePayment(data);
    }
  }

  const availableGateways = gatewayStatus ? {
    stripe: gatewayStatus.stripe.available,
    paypal: gatewayStatus.paypal.available,
    razorpay: gatewayStatus.razorpay.available
  } : { stripe: false, paypal: false, razorpay: false };

  // If no gateways are available, show an instruction
  if (!availableGateways.stripe && !availableGateways.paypal && !availableGateways.razorpay) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/50">
        <p>Payment gateways are currently unavailable. Please contact me directly to discuss payment options.</p>
        <Button className="mt-4" asChild>
          <a href="/contact">Contact Me</a>
        </Button>
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-auto max-w-md">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="1000.00" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the amount you'd like to pay in Indian Rupees (INR)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Purpose</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Website development project, SEO services" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe what this payment is for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  Receipt will be sent to this email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {/* Make UPI first and most prominent */}
                    <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-900">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="font-medium flex flex-col">
                        <span className="flex items-center">UPI Payment <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded">Recommended</span></span>
                        <span className="text-xs text-muted-foreground">Pay directly using any UPI app (PhonePe, Google Pay, BHIM, Paytm)</span>
                      </Label>
                    </div>
                    
                    {availableGateways.stripe && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="font-normal">
                          Credit/Debit Card (Stripe)
                        </Label>
                      </div>
                    )}
                    
                    {availableGateways.paypal && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="font-normal">
                          PayPal
                        </Label>
                      </div>
                    )}
                    
                    {availableGateways.razorpay && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="font-normal">
                          Razorpay (Cards, Netbanking, Wallets)
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">
            Review Payment
          </Button>
        </form>
      </Form>
    );
  }
  
  // Check if we're in the payment step (step 3)
  if (currentStep === 3 && paymentData) {
    const formValues = form.getValues();
    const amount = parseFloat(formValues.amount);
    
    // Show appropriate payment component based on selected method
    if (formValues.paymentMethod === 'stripe' && paymentData.clientSecret) {
      return (
        <div className="space-y-6">
          <StripeCheckout 
            clientSecret={paymentData.clientSecret} 
            amount={amount}
            onCancel={() => setCurrentStep(2)}
          />
        </div>
      );
    }
    
    if (formValues.paymentMethod === 'paypal' && paymentData.id) {
      return (
        <div className="space-y-6">
          <PayPalCheckout 
            orderId={paymentData.id} 
            amount={amount}
            onCancel={() => setCurrentStep(2)}
          />
        </div>
      );
    }
    
    if (formValues.paymentMethod === 'razorpay' && paymentData.id) {
      return (
        <div className="space-y-6">
          <RazorpayCheckout
            orderId={paymentData.id}
            amount={amount}
            name={formValues.name}
            email={formValues.email}
            onCancel={() => setCurrentStep(2)}
          />
        </div>
      );
    }
    
    if (formValues.paymentMethod === 'upi' && paymentData.upiId) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">UPI Payment</h3>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
              Go Back
            </Button>
          </div>
          
          {/* Use the existing UPI payment component */}
          <UpiPayment 
            upiId={paymentData.upiId} 
          />
          
          <div className="p-4 bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800 rounded-md mt-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-medium">Important:</span> After making the payment, please contact us with your payment details for verification.
            </p>
          </div>
        </div>
      );
    }
    
    // Fallback if something went wrong
    return (
      <div className="space-y-6">
        <div className="text-center p-8 border rounded-md">
          <p className="text-red-500 mb-4">There was an issue initializing the payment gateway.</p>
          <Button onClick={() => setCurrentStep(2)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Review step (step 2)
  const formValues = form.getValues();
  return (
    <div className="space-y-6 mx-auto max-w-md">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Amount:</span>
              <span>₹{formValues.amount}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Payment Purpose:</span>
              <span>{formValues.paymentFor}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Name:</span>
              <span>{formValues.name}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Email:</span>
              <span>{formValues.email}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span>
                {formValues.paymentMethod === 'stripe' && 'Credit/Debit Card (Stripe)'}
                {formValues.paymentMethod === 'paypal' && 'PayPal'}
                {formValues.paymentMethod === 'razorpay' && 'Razorpay (UPI, Netbanking, Wallets)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex space-x-4 justify-center">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </div>
    </div>
  );
}