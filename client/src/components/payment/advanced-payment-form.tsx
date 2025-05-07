import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Copy, CheckCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the form schema
const advancedPaymentSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
  pages: z.string().min(1, "Please enter number of pages").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
    { message: "Pages must be a positive number" }
  ),
  features: z.array(z.string()).optional(),
  designComplexity: z.enum(['simple', 'moderate', 'complex']),
  timeline: z.enum(['standard', 'priority', 'urgent']),
  additionalInfo: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  paymentMethod: z.enum(['stripe', 'paypal', 'razorpay']),
});

type AdvancedPaymentFormValues = z.infer<typeof advancedPaymentSchema>;

// Features checkboxes data
const featuresList = [
  { id: 'responsive', label: 'Responsive Design', price: 5000 },
  { id: 'cms', label: 'Content Management System', price: 15000 },
  { id: 'ecommerce', label: 'E-commerce Functionality', price: 25000 },
  { id: 'authentication', label: 'User Authentication', price: 12000 },
  { id: 'payment', label: 'Payment Integration', price: 10000 },
  { id: 'multilingual', label: 'Multilingual Support', price: 8000 },
  { id: 'blog', label: 'Blog System', price: 7000 },
  { id: 'seo', label: 'SEO Optimization', price: 6000 },
  { id: 'analytics', label: 'Analytics Integration', price: 4000 },
  { id: 'forms', label: 'Complex Forms & Validation', price: 6000 },
  { id: 'api', label: 'API Integration', price: 10000 },
  { id: 'social', label: 'Social Media Integration', price: 5000 },
];

// Project type pricing
const projectTypes = [
  { value: 'landing', label: 'Landing Page', basePrice: 10000 },
  { value: 'business', label: 'Business Website', basePrice: 25000 },
  { value: 'ecommerce', label: 'E-commerce Website', basePrice: 50000 },
  { value: 'blog', label: 'Blog/Magazine Website', basePrice: 20000 },
  { value: 'portfolio', label: 'Portfolio Website', basePrice: 15000 },
  { value: 'webapp', label: 'Web Application', basePrice: 75000 },
  { value: 'custom', label: 'Custom Project', basePrice: 30000 },
];

// Timeline multipliers
const timelineMultipliers = {
  standard: 1,
  priority: 1.25,
  urgent: 1.5
};

// Complexity multipliers
const complexityMultipliers = {
  simple: 1,
  moderate: 1.3,
  complex: 1.6
};

interface AdvancedPaymentFormProps {
  gatewayStatus: any;
}

export default function AdvancedPaymentForm({ gatewayStatus }: AdvancedPaymentFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [copiedEstimate, setCopiedEstimate] = useState(false);
  
  // Form definition
  const form = useForm<AdvancedPaymentFormValues>({
    resolver: zodResolver(advancedPaymentSchema),
    defaultValues: {
      projectType: 'landing',
      pages: '1',
      features: [],
      designComplexity: 'simple',
      timeline: 'standard',
      additionalInfo: '',
      name: '',
      email: '',
      paymentMethod: 'stripe',
    },
  });

  // Recalculate price whenever form values change
  const formValues = form.watch();
  
  useEffect(() => {
    // Find the base price for the selected project type
    const selectedProject = projectTypes.find(pt => pt.value === formValues.projectType);
    let basePrice = selectedProject ? selectedProject.basePrice : 10000;
    
    // Add per-page price (1000 per page after the first page)
    const pages = parseInt(formValues.pages) || 1;
    if (pages > 1) {
      basePrice += (pages - 1) * 1000;
    }
    
    // Add features costs
    let featuresPrice = 0;
    if (formValues.features && formValues.features.length > 0) {
      featuresPrice = formValues.features.reduce((sum, featureId) => {
        const feature = featuresList.find(f => f.id === featureId);
        return sum + (feature ? feature.price : 0);
      }, 0);
    }
    
    // Apply complexity and timeline multipliers
    const complexityMultiplier = complexityMultipliers[formValues.designComplexity];
    const timelineMultiplier = timelineMultipliers[formValues.timeline];
    
    // Calculate the total
    const calculatedTotal = Math.round((basePrice + featuresPrice) * complexityMultiplier * timelineMultiplier);
    setTotalAmount(calculatedTotal);
  }, [
    formValues.projectType, 
    formValues.pages, 
    formValues.features, 
    formValues.designComplexity, 
    formValues.timeline
  ]);

  // Handle copy estimate to clipboard
  const copyEstimateToClipboard = () => {
    const estimateText = `
Project Estimate for ${formValues.name}:
- Project Type: ${projectTypes.find(pt => pt.value === formValues.projectType)?.label}
- Pages: ${formValues.pages}
- Design Complexity: ${formValues.designComplexity}
- Timeline: ${formValues.timeline}
- Features: ${formValues.features?.map(
      featureId => featuresList.find(f => f.id === featureId)?.label
    ).join(', ') || 'None'}
- Total Estimated Cost: ₹${totalAmount.toLocaleString()}
    `.trim();
    
    navigator.clipboard.writeText(estimateText)
      .then(() => {
        setCopiedEstimate(true);
        setTimeout(() => setCopiedEstimate(false), 2000);
      })
      .catch(err => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy estimate',
          description: 'Please try again or select and copy manually.',
        });
      });
  };

  // Mutation for payment initialization
  const { mutate: initializePayment, isPending } = useMutation({
    mutationFn: async (data: AdvancedPaymentFormValues & { amount: number }) => {
      let response;
      
      switch (data.paymentMethod) {
        case 'stripe':
          response = await apiRequest(
            'POST', 
            '/api/payment/stripe/create-intent', 
            { 
              amount: data.amount,
              description: `${data.projectType} project with ${data.features?.length || 0} features`,
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
              amount: data.amount.toString(),
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
              amount: data.amount,
              currency: 'INR',
              receipt: `project_${Date.now()}`,
              notes: {
                projectType: data.projectType,
                name: data.name,
                email: data.email
              }
            }
          );
          break;
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Payment Initialized',
        description: 'Redirecting to payment gateway...',
      });
      
      // Here you would handle the specific payment gateway response
      console.log('Payment initialized:', data);
      
      // In a production app, specific gateway handling would go here
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Payment initialization failed',
        description: error.message || 'Please try again or use a different payment method.',
      });
    },
  });

  function onSubmit(data: AdvancedPaymentFormValues) {
    if (currentStep === 1) {
      setCurrentStep(2); // Move to contact info step
    } else if (currentStep === 2) {
      setCurrentStep(3); // Move to review step
    } else {
      // Submit payment with calculated amount
      initializePayment({
        ...data,
        amount: totalAmount
      });
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

  // Project details step
  if (currentStep === 1) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} (Base: ₹{type.basePrice.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of project determines the base price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Pages</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  Each additional page adds ₹1,000 to the base price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Features</FormLabel>
                  <FormDescription>
                    Select the features you need for your project
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {featuresList.map((feature) => (
                    <FormField
                      key={feature.id}
                      control={form.control}
                      name="features"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={feature.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], feature.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== feature.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {feature.label} (+₹{feature.price.toLocaleString()})
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="designComplexity"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Design Complexity</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <Label htmlFor="simple" className="font-normal">
                        Simple (Standard pricing)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="font-normal">
                        Moderate (+30% cost)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complex" id="complex" />
                      <Label htmlFor="complex" className="font-normal">
                        Complex (+60% cost)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Higher complexity means more custom design elements and animations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Timeline</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal">
                        Standard (Regular pricing)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="priority" id="priority" />
                      <Label htmlFor="priority" className="font-normal">
                        Priority (+25% cost)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="font-normal">
                        Urgent (+50% cost)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Faster delivery requires prioritization of your project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements or details about your project..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  
  // Contact & payment method step
  if (currentStep === 2) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={copyEstimateToClipboard}
              className="flex items-center gap-1"
            >
              {copiedEstimate ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Estimate
                </>
              )}
            </Button>
          </div>
          
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
                    {availableGateways.stripe && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stripe" id="stripe-method" />
                        <Label htmlFor="stripe-method" className="font-normal">
                          Credit/Debit Card (Stripe)
                        </Label>
                      </div>
                    )}
                    
                    {availableGateways.paypal && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal-method" />
                        <Label htmlFor="paypal-method" className="font-normal">
                          PayPal
                        </Label>
                      </div>
                    )}
                    
                    {availableGateways.razorpay && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="razorpay" id="razorpay-method" />
                        <Label htmlFor="razorpay-method" className="font-normal">
                          Razorpay (UPI, Netbanking, Wallets)
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
            <Button type="submit">
              Review Order
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  
  // Review step
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Project Details</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-muted-foreground">Project Type</p>
                  <p>{projectTypes.find(pt => pt.value === formValues.projectType)?.label}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p>{formValues.pages}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Design Complexity</p>
                  <p className="capitalize">{formValues.designComplexity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="capitalize">{formValues.timeline}</p>
                </div>
                {formValues.features && formValues.features.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Selected Features</p>
                    <ul className="list-disc list-inside">
                      {formValues.features.map(featureId => {
                        const feature = featuresList.find(f => f.id === featureId);
                        return feature && (
                          <li key={featureId}>{feature.label}</li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {formValues.additionalInfo && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Additional Information</p>
                    <p className="whitespace-pre-line">{formValues.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-lg">Contact Information</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{formValues.name}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{formValues.email}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-lg">Payment Method</h3>
              <p className="mt-2">
                {formValues.paymentMethod === 'stripe' && 'Credit/Debit Card (Stripe)'}
                {formValues.paymentMethod === 'paypal' && 'PayPal'}
                {formValues.paymentMethod === 'razorpay' && 'Razorpay (UPI, Netbanking, Wallets)'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
            <Button 
              onClick={() => {
                form.handleSubmit((data) => {
                  initializePayment({
                    ...data,
                    amount: totalAmount
                  });
                })();
              }} 
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
        </CardFooter>
      </Card>
    </div>
  );
}