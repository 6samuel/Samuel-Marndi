import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { QRCodeSVG } from 'qrcode.react';
import { Separator } from '@/components/ui/separator';
import { Loader2, Copy, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpiPaymentProps {
  upiId: string;
}

export default function UpiPayment({ upiId }: UpiPaymentProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Format UPI deep link
  const getUpiLink = () => {
    // Base UPI intent URL
    let upiUrl = `upi://pay?pa=${upiId}`;
    
    // Add optional parameters if they exist
    if (amount) upiUrl += `&am=${amount}`;
    if (name) upiUrl += `&pn=${encodeURIComponent(name)}`;
    if (note) upiUrl += `&tn=${encodeURIComponent(note)}`;
    
    // Add merchant code and currency (INR is standard for Indian payments)
    upiUrl += `&cu=INR`;
    
    return upiUrl;
  };

  const handlePayClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create UPI deep link and redirect
    const upiLink = getUpiLink();
    
    // Small delay to show loading state
    setTimeout(() => {
      window.location.href = upiLink;
      setIsSubmitting(false);
    }, 500);
  };
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({
      title: "UPI ID copied",
      description: "UPI ID copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Direct UPI Payment</CardTitle>
          <CardDescription>
            Pay directly using any UPI app installed on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-amount">Amount (₹)</Label>
                <Input
                  id="upi-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="upi-name">Your Name (Optional)</Label>
                <Input
                  id="upi-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="upi-note">Payment Note (Optional)</Label>
                <Textarea
                  id="upi-note"
                  placeholder="Add a note about this payment"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handlePayClick}
                className="w-full"
                disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to UPI App...
                  </>
                ) : (
                  'Pay via UPI App'
                )}
              </Button>
            </div>
            
            <div className="border-l pl-6 hidden md:block">
              <div className="text-center space-y-4">
                <div className="bg-white p-3 rounded-lg inline-block">
                  <QRCodeSVG
                    value={getUpiLink()}
                    size={180}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Scan with any UPI app</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">UPI ID:</p>
              <div className="flex items-center mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm">{upiId}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={copyUpiId}
                >
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              You can also manually enter this UPI ID in your payment app
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}