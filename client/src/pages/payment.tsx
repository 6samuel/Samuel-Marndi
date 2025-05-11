import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTitle } from '@/components/ui/page-title';
import SimplePaymentForm from '@/components/payment/simple-payment-form';
import AdvancedPaymentForm from '@/components/payment/advanced-payment-form';
import PaymentGatewayStatus from '@/components/payment/payment-gateway-status';
import UpiPayment from '@/components/payment/upi-payment';
import UpiPaymentForm from '@/components/payment/upi-payment-form';

export default function PaymentPage() {
  // Fetch payment gateway status to check which ones are available
  const { data: gatewayStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/payment/status'],
    retry: 1,
  });

  return (
    <>
      <Helmet>
        <title>Make a Payment | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta 
          name="description" 
          content="Secure payment options for web development, digital marketing, and other professional services. Multiple payment methods available." 
        />
      </Helmet>
      
      <PageTitle 
        title="Payment" 
        description="Secure and convenient payment options for my services"
      />

      <div className="container max-w-5xl pb-20 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main payment section - takes up 2/3 of the screen on desktop */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
                <CardDescription>
                  Choose your preferred payment method below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentGatewayStatus 
                  status={gatewayStatus} 
                  isLoading={isStatusLoading} 
                />
                
                <Tabs defaultValue="upi" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upi">UPI Payment</TabsTrigger>
                    <TabsTrigger value="simple">Direct Payment</TabsTrigger>
                    <TabsTrigger value="advanced">Calculator</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upi" className="mt-4">
                    <UpiPaymentForm 
                      upiId="8280320550@axisb" 
                      paymentReference={`Payment_${Date.now()}`}
                      onSuccess={() => {
                        toast({
                          title: "Payment Verified",
                          description: "Your payment has been successfully verified. Thank you!",
                        });
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="simple" className="mt-4">
                    <SimplePaymentForm gatewayStatus={gatewayStatus} />
                  </TabsContent>
                  <TabsContent value="advanced" className="mt-4">
                    <AdvancedPaymentForm gatewayStatus={gatewayStatus} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Payment information sidebar - takes up 1/3 of the screen on desktop */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Payment Security</CardTitle>
                <CardDescription>Information about secure payment processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
                    <p className="text-muted-foreground text-sm">
                      All payment transactions are securely processed through established payment gateways 
                      with industry-standard encryption. Your payment information is never stored on our servers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Multiple Payment Options</h3>
                    <p className="text-muted-foreground text-sm">
                      For your convenience, I offer multiple payment options including credit cards, 
                      debit cards, net banking, UPI, and international payment methods.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Receipt and Invoice</h3>
                    <p className="text-muted-foreground text-sm">
                      You will receive a confirmation email with your payment receipt. 
                      For business payments requiring a GST invoice, please mention this in your 
                      project requirements or contact me directly.
                    </p>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/contact">Have Questions? Contact Me</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}