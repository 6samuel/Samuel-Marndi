import React, { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import RazorpayCheckout from "@/components/payment/razorpay-checkout";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define available time slots (9 AM to 8 PM)
const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  const formattedHour = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? "PM" : "AM";
  const value = hour.toString().padStart(2, '0');
  return {
    value,
    label: `${formattedHour}:00 ${period}`,
    hour
  };
});

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  date: z.date({
    required_error: "Please select a date for your consultation",
  }),
  fromHour: z.string({
    required_error: "Please select a start time",
  }),
  toHour: z.string({
    required_error: "Please select an end time",
  }),
  topic: z.string().min(5, "Please provide a brief description of your consultation topic"),
  additionalInfo: z.string().optional(),
}).refine((data) => {
  // Validate that toHour is greater than fromHour
  return parseInt(data.toHour) > parseInt(data.fromHour);
}, {
  message: "End time must be after start time",
  path: ["toHour"]
});

type FormValues = z.infer<typeof formSchema>;

// Price per hour for consultation (in INR)
const HOURLY_RATE = 1000;

export default function ConsultationForm() {
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  
  // State to track the consultation duration and price
  const [duration, setDuration] = useState<number>(1);
  const [price, setPrice] = useState<number>(HOURLY_RATE);

  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      additionalInfo: "",
    },
  });

  // Update duration and price when from/to hours change
  const fromHour = form.watch("fromHour");
  const toHour = form.watch("toHour");

  // Calculate duration and price when from/to hours change
  useEffect(() => {
    if (fromHour && toHour) {
      const from = parseInt(fromHour);
      const to = parseInt(toHour);
      if (to > from) {
        const newDuration = to - from;
        setDuration(newDuration);
        setPrice(newDuration * HOURLY_RATE);
      }
    }
  }, [fromHour, toHour]);

  // Create consultation mutation
  const { toast } = useToast();
  
  const createConsultationMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const timeSlot = `${values.fromHour}:00-${values.toHour}:00`;
      
      const response = await apiRequest("POST", "/api/consultations", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        date: format(values.date, "yyyy-MM-dd"),
        timeSlot,
        topic: values.topic,
        additionalInfo: values.additionalInfo || null,
        paymentStatus: "unpaid",
        paymentAmount: price,
        duration: duration
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book consultation");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      console.log("Consultation booked:", data);
      toast({
        title: "Booking Successful",
        description: "Your consultation has been booked. Please proceed to payment.",
        variant: "default",
      });
      setConsultationId(data.id);
      setIsPaymentStep(true);
    },
    onError: (error: any) => {
      console.error("Error booking consultation:", error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to book consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  const onSubmit = (values: FormValues) => {
    // Call Google Ads conversion tracking
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }
    
    createConsultationMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Book a Consultation</CardTitle>
        <CardDescription>
          Fill in the details below to schedule your consultation (₹{HOURLY_RATE} per hour)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isPaymentStep ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+91 9876543210" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || 
                            date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="From" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hours.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="To" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hours.map((slot) => (
                            <SelectItem 
                              key={slot.value} 
                              value={slot.value}
                              disabled={typeof fromHour === 'string' && parseInt(slot.value) <= parseInt(fromHour)}
                            >
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Price display */}
              {fromHour && toHour && toHour > fromHour && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Consultation Duration:</p>
                      <p className="text-lg font-semibold">{duration} {duration === 1 ? "hour" : "hours"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Price:</p>
                      <p className="text-lg font-semibold">₹{price}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of what you'd like to discuss"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional details or questions you'd like to share"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createConsultationMutation.isPending}
              >
                {createConsultationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <ConsultationPayment consultationId={consultationId} />
        )}
      </CardContent>
    </Card>
  );
}

// Payment component for consultation
function ConsultationPayment({ consultationId }: { consultationId: number | null }) {
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Process payment mutation with error handling
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentMethod: string) => {
      try {
        if (!consultationId) {
          throw new Error("Consultation ID is missing");
        }
        
        const response = await apiRequest(
          "POST", 
          `/api/consultations/${consultationId}/process-payment`,
          { paymentMethod }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Payment processing failed");
        }
        
        return await response.json();
      } catch (error) {
        console.error("API request error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Payment initiated:", data);
      setPaymentData(data.paymentData);
      setPaymentProcessing(false);
      toast({
        title: "Payment Initiated",
        description: "Your payment has been initiated successfully. Please complete the payment process.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error("Payment error:", error);
      const errorMessage = error.message || "Failed to process payment. Please try again.";
      setPaymentError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      setPaymentProcessing(false);
    },
  });

  // Function to process payment
  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      const errorMessage = "Please select a payment method";
      setPaymentError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    setPaymentProcessing(true);
    setPaymentError(null);
    processPaymentMutation.mutate(selectedPaymentMethod);
  };

  // Fetch consultation details to display correct amount
  const [consultation, setConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (consultationId) {
      const fetchConsultation = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/consultations/${consultationId}`);
          if (response.ok) {
            const data = await response.json();
            setConsultation(data.consultation);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch consultation details",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching consultation:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchConsultation();
    }
  }, [consultationId, toast]);

  return (
    <div className="space-y-5">
      {/* Consultation fee card */}
      <div className="bg-primary/5 p-5 rounded-lg border border-primary/10">
        <h3 className="font-semibold flex items-center text-lg mb-2">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Consultation Fee
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : consultation ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">₹{consultation.paymentAmount || 1000}</p>
              <p className="text-sm text-muted-foreground">
                for {consultation.duration || 1} hour{consultation.duration !== 1 ? 's' : ''} consultation
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Professional consultation</p>
              <p>• Personalized solutions</p>
              <p>• Follow-up recommendations</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">₹1000</p>
              <p className="text-sm text-muted-foreground">per 1-hour session</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Professional consultation</p>
              <p>• Personalized solutions</p>
              <p>• Follow-up recommendations</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Payment method selection */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            type="button"
            variant={selectedPaymentMethod === "stripe" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("stripe")}
            className="justify-start h-14 px-4"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                 alt="Stripe" 
                 className="h-7 mr-3" />
            <div className="text-left">
              <p className="font-medium">Card Payment</p>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
            </div>
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "paypal" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("paypal")}
            className="justify-start h-14 px-4"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" 
                 alt="PayPal" 
                 className="h-7 mr-3" />
            <div className="text-left">
              <p className="font-medium">PayPal</p>
              <p className="text-xs text-muted-foreground">Pay with PayPal account</p>
            </div>
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "razorpay" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("razorpay")}
            className="justify-start h-14 px-4"
          >
            <img src="https://razorpay.com/assets/razorpay-logo.svg" 
                 alt="Razorpay" 
                 className="h-7 mr-3" />
            <div className="text-left">
              <p className="font-medium">Razorpay</p>
              <p className="text-xs text-muted-foreground">Indian payment gateway</p>
            </div>
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "upi" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("upi")}
            className="justify-start h-14 px-4"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
                 alt="UPI" 
                 className="h-7 mr-3" />
            <div className="text-left">
              <p className="font-medium">UPI Payment</p>
              <p className="text-xs text-muted-foreground">Google Pay, PhonePe, etc.</p>
            </div>
          </Button>
        </div>
      </div>
      
      {/* Error message display */}
      {paymentError && (
        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-100">
          <p className="font-medium">Payment Error</p>
          <p>{paymentError}</p>
        </div>
      )}
      
      {/* Payment info display after initiation */}
      {paymentData && (
        <div className="bg-primary/5 p-5 rounded-lg border border-primary/10">
          <h3 className="font-semibold mb-3 text-lg">Payment Information</h3>
          
          {selectedPaymentMethod === "stripe" && paymentData.clientSecret && (
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-md border">
                <p className="mb-2 font-medium">Secure Card Payment</p>
                <p className="text-sm mb-4">Complete your payment through Stripe's secure checkout:</p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    window.open(
                      `https://checkout.stripe.com/pay/${paymentData.clientSecret}`,
                      "_blank"
                    );
                  }}
                >
                  Open Stripe Checkout
                </Button>
              </div>
            </div>
          )}
          
          {selectedPaymentMethod === "paypal" && paymentData.id && (
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-md border">
                <p className="mb-2 font-medium">PayPal Payment</p>
                <p className="text-sm mb-4">Complete your payment through PayPal's secure checkout:</p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    window.open(
                      `https://www.paypal.com/checkoutnow?token=${paymentData.id}`,
                      "_blank"
                    );
                  }}
                >
                  Open PayPal Checkout
                </Button>
              </div>
            </div>
          )}
          
          {selectedPaymentMethod === "razorpay" && paymentData.id && (
            <div className="space-y-3">
              <RazorpayCheckout
                orderId={paymentData.id}
                amount={consultation?.paymentAmount || 1000}
                name={consultation?.name || ''}
                email={consultation?.email || ''}
                onCancel={() => setPaymentData(null)}
                onSuccess={() => {
                  toast({
                    title: "Payment Successful",
                    description: "Your consultation booking is confirmed. You will receive an email confirmation shortly.",
                  });
                  // Update consultation payment status in UI
                  if (consultation && consultation.id) {
                    queryClient.invalidateQueries({ queryKey: [`/api/consultations/${consultation.id}`] });
                  }
                }}
              />
            </div>
          )}
          
          {selectedPaymentMethod === "upi" && paymentData.upiInfo && (
            <div className="flex flex-col md:flex-row gap-5 p-3 bg-white rounded-md border">
              <div className="flex-1 text-center md:text-left">
                <p className="font-medium mb-2">UPI Payment Details</p>
                <p className="text-sm mb-1">Scan the QR code with any UPI app:</p>
                <ul className="text-xs mb-3 list-disc list-inside text-muted-foreground">
                  <li>Google Pay</li>
                  <li>PhonePe</li>
                  <li>Paytm</li>
                  <li>BHIM UPI</li>
                  <li>Banking UPI apps</li>
                </ul>
                <div className="space-y-1">
                  <p className="text-sm font-medium">UPI ID:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">{paymentData.upiInfo.upiId}</code>
                  <p className="text-sm mt-2">Reference: <span className="font-medium">{paymentData.referenceId}</span></p>
                  <p className="text-sm">Amount: <span className="font-medium">₹{consultation?.paymentAmount || 1000}</span></p>
                </div>
              </div>
              <div className="flex justify-center items-center">
                {paymentData.upiInfo.upiId && (
                  <div className="bg-white p-3 border rounded-md inline-block shadow-sm">
                    <QRCodeSVG 
                      value={`upi://pay?pa=${paymentData.upiInfo.upiId}&am=${consultation?.paymentAmount || 1000}&cu=INR&tn=Consultation ${consultation?.duration || 1}hr`}
                      size={150}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"L"}
                      includeMargin={false}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <p className="mt-4 text-sm text-center text-muted-foreground">
            After completing payment, you will receive a confirmation email with the meeting details.
          </p>
        </div>
      )}
      
      {/* Payment button */}
      <Button 
        onClick={handlePayment}
        className="w-full py-6 text-lg"
        disabled={paymentProcessing || !!paymentData || isLoading}
      >
        {paymentProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : paymentData ? (
          "Payment Initiated"
        ) : (
          `Pay Now - ₹${consultation?.paymentAmount || 1000}`
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground px-4">
        By proceeding with the payment, you agree to our terms of service and privacy policy.
        All payments are secured with industry-standard encryption.
      </p>
    </div>
  );
}