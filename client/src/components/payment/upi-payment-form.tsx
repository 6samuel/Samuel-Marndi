import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, Copy, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpiPaymentFormProps {
  upiId: string;
  amount?: string;
  paymentReference?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpiPaymentForm({
  upiId,
  amount,
  paymentReference,
  onSuccess,
  onCancel
}: UpiPaymentFormProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Generate UPI payment link
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=SamuelMarndi&cu=INR${amount ? `&am=${amount}` : ''}${paymentReference ? `&tr=${paymentReference}` : ''}&tn=Payment`;

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      toast({
        title: 'UPI ID Copied',
        description: 'The UPI ID has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Handle payment verification submission
  const handleVerifyPayment = () => {
    if (!transactionId) {
      toast({
        title: 'Transaction ID Required',
        description: 'Please enter your UPI transaction ID to verify payment.',
        variant: 'destructive',
      });
      return;
    }

    setVerifying(true);

    // Simulate payment verification - in a real app this would call your backend
    setTimeout(() => {
      setVerifying(false);
      
      // Success feedback
      toast({
        title: 'Payment Verified',
        description: 'Your UPI payment has been successfully verified.',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
          UPI Payment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Pay easily using any UPI app on your smartphone.
          {amount && <span className="font-medium"> Amount: ₹{amount}</span>}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-white rounded-md border inline-block">
                <QRCodeSVG 
                  value={upiPaymentLink} 
                  size={180} 
                  includeMargin={true}
                  level="H"
                />
              </div>
              <p className="text-sm text-center mb-2">Scan QR code with any UPI app</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" alt="BHIM UPI" className="h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="upi-id" className="text-sm font-medium">UPI ID</Label>
              <div className="flex mt-1.5">
                <Input 
                  id="upi-id"
                  readOnly 
                  value={upiId} 
                  className="rounded-r-none" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-l-none border-l-0"
                  onClick={copyUpiId}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Open your UPI app and pay to this UPI ID
              </p>
            </div>

            {paymentReference && (
              <div>
                <Label htmlFor="reference" className="text-sm font-medium">Payment Reference</Label>
                <Input 
                  id="reference"
                  readOnly 
                  value={paymentReference} 
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Include this reference in your payment
                </p>
              </div>
            )}

            <div className="pt-2">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTitle className="text-amber-800">After Payment</AlertTitle>
                <AlertDescription className="text-amber-700 text-sm">
                  Please enter your UPI transaction ID after completing the payment for verification.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <Label htmlFor="transaction-id" className="text-sm font-medium">UPI Transaction ID</Label>
              <Input 
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your 12-digit UPI reference number"
                className="mt-1.5"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1" 
                onClick={handleVerifyPayment}
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Verify Payment'}
              </Button>
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}