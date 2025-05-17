import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QuickQuoteForm from './quick-quote-form';
import GoogleAdsConversion from '@/components/tracking/google-ads-conversion';
import { MessageSquare } from 'lucide-react';

interface QuickQuoteModalProps {
  triggerClassName?: string;
  triggerText?: string;
  icon?: boolean;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon' | null;
  id?: string;
  selectedService?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function QuickQuoteModal({ 
  triggerClassName, 
  triggerText = "Request a Quote", 
  icon = true,
  buttonVariant = 'default',
  buttonSize = 'default',
  id,
  selectedService,
  children,
  className
}: QuickQuoteModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    // Keep the modal open to show the success message
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    // Reset isSubmitted when the modal is closed
    if (!open) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          className={triggerClassName}
          id={id}
          onClick={() => {
            // Track the button click with Google Ads
            if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
              (window as any).gtag_report_conversion();
            }
          }}
        >
          {icon && <MessageSquare className="mr-2 h-5 w-5" />}
          {triggerText}
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-1">Get a Custom Quote</DialogTitle>
          <DialogDescription>
            Tell me about your project for a personalized quote. I'll respond within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="py-6">
            {/* Google Ads Conversion Tracking */}
            <GoogleAdsConversion 
              conversionId="AW-11484248952"
              conversionLabel="Gyl7CJiG8YwYEJrF8aQD"
            />
            
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-center">Thank You!</h3>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
              Your quote request has been submitted successfully. I'll review it and get back to you as soon as possible.
            </p>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                A confirmation email has been sent to your inbox with the details of your request.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <QuickQuoteForm 
            onSubmitSuccess={handleSubmitSuccess}
            selectedService={selectedService} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}