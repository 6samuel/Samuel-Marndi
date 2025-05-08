import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

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

// Define available time slots for consultation (9 AM to 7 PM)
const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 9;
  const formattedHour = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? "PM" : "AM";
  return {
    value: `${hour}:00`,
    label: `${formattedHour}:00 ${period}`
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
  time: z.string({
    required_error: "Please select a time slot",
  }),
  topic: z.string().min(5, "Please provide a brief description of your consultation topic"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConsultationForm() {
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);

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

  // Create consultation mutation
  const { toast } = useToast();
  
  const createConsultationMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("POST", "/api/consultations", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        topic: values.topic,
        additionalInfo: values.additionalInfo || null,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: null,
        meetingLink: null,
        notes: null
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
    createConsultationMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Book a Consultation</CardTitle>
        <CardDescription>
          Fill in the details below to schedule a 1-hour consultation (₹1000)
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
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
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
              </div>
              
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

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Consultation Fee
        </h3>
        <p className="text-lg font-semibold">₹1000 per hour</p>
      </div>
      
      <div className="space-y-2">
        <FormLabel>Select Payment Method</FormLabel>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectedPaymentMethod === "stripe" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("stripe")}
            className="justify-start"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                 alt="Stripe" 
                 className="h-6 mr-2" />
            Card Payment
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "paypal" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("paypal")}
            className="justify-start"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" 
                 alt="PayPal" 
                 className="h-6 mr-2" />
            PayPal
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "razorpay" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("razorpay")}
            className="justify-start"
          >
            <img src="https://razorpay.com/assets/razorpay-logo.svg" 
                 alt="Razorpay" 
                 className="h-6 mr-2" />
            Razorpay
          </Button>
          
          <Button
            type="button"
            variant={selectedPaymentMethod === "upi" ? "default" : "outline"}
            onClick={() => setSelectedPaymentMethod("upi")}
            className="justify-start"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
                 alt="UPI" 
                 className="h-6 mr-2" />
            UPI / QR Code
          </Button>
        </div>
      </div>
      
      {paymentError && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {paymentError}
        </div>
      )}
      
      {paymentData && (
        <div className="bg-primary/5 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <div className="text-sm">
            {selectedPaymentMethod === "stripe" && paymentData.clientSecret && (
              <div>
                <p className="mb-3">Proceed to Stripe checkout to complete your payment:</p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // Open Stripe checkout in a new window
                    window.open(
                      `https://checkout.stripe.com/pay/${paymentData.clientSecret}`,
                      "_blank"
                    );
                  }}
                >
                  Open Stripe Checkout
                </Button>
              </div>
            )}
            
            {selectedPaymentMethod === "paypal" && paymentData.id && (
              <div>
                <p className="mb-3">Proceed to PayPal to complete your payment:</p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // Open PayPal checkout
                    window.open(
                      `https://www.paypal.com/checkoutnow?token=${paymentData.id}`,
                      "_blank"
                    );
                  }}
                >
                  Open PayPal Checkout
                </Button>
              </div>
            )}
            
            {selectedPaymentMethod === "razorpay" && paymentData.id && (
              <div>
                <p className="mb-3">Proceed to Razorpay to complete your payment:</p>
                <Button 
                  className="w-full"
                  onClick={() => {
                    // In a real implementation, you would use the Razorpay JS SDK here
                    alert("Razorpay integration will open the payment window");
                  }}
                >
                  Open Razorpay Checkout
                </Button>
              </div>
            )}
            
            {selectedPaymentMethod === "upi" && paymentData.upiInfo && (
              <div className="text-center">
                <p className="mb-2">Scan the QR code or use the UPI ID below:</p>
                <div className="bg-white p-4 mb-2 inline-block">
                  {/* Using QRCodeSVG component for a real QR code */}
                  {paymentData.upiInfo.upiId && (
                    <QRCodeSVG 
                      value={`upi://pay?pa=${paymentData.upiInfo.upiId}&am=1000&cu=INR&tn=Consultation`}
                      size={128}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"L"}
                      includeMargin={false}
                    />
                  )}
                </div>
                <p className="font-medium">UPI ID: {paymentData.upiInfo.upiId}</p>
                <p className="mt-1 text-xs">Reference: {paymentData.referenceId}</p>
                <p className="mt-2 text-xs">Amount: ₹1000</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handlePayment}
        className="w-full"
        disabled={paymentProcessing || !!paymentData}
      >
        {paymentProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : paymentData ? (
          "Payment Initiated"
        ) : (
          "Pay Now - ₹1000"
        )}
      </Button>
      
      {paymentData && (
        <div className="text-xs text-center text-gray-500">
          After completing payment, you will receive a confirmation email with the meeting details.
        </div>
      )}
    </div>
  );
}