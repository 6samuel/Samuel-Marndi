import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Define form schema
const quickQuoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please describe your project (min 10 characters)'),
});

type QuickQuoteFormValues = z.infer<typeof quickQuoteSchema>;

interface QuickQuoteFormProps {
  onSubmitSuccess?: () => void;
}

export default function QuickQuoteForm({ onSubmitSuccess }: QuickQuoteFormProps = {}) {
  const { toast } = useToast();
  
  // Form definition
  const form = useForm<QuickQuoteFormValues>({
    resolver: zodResolver(quickQuoteSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  // Mutation for form submission
  const { mutate: submitQuote, isPending } = useMutation({
    mutationFn: async (data: QuickQuoteFormValues) => {
      const response = await apiRequest(
        'POST', 
        '/api/contact/submit', 
        { 
          ...data,
          type: 'quick-quote',
          subject: 'Quick Quote Request'
        }
      );
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Quote Request Submitted!',
        description: 'I will get back to you as soon as possible.',
      });
      
      // Reset form
      form.reset();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error Submitting Quote',
        description: error.message || 'Please try again later.',
      });
    },
  });

  function onSubmit(data: QuickQuoteFormValues) {
    submitQuote(data);
  }

  return (
    <div className="w-full p-6">
      <div className="glass-effect relative rounded-lg p-6 border border-gray-200/30 dark:border-gray-700/30 overflow-hidden shadow-xl">
        {/* Samuel's image in the background */}
        <div 
          className="absolute z-0"
          style={{
            backgroundImage: `url('@assets/samuel_png_2.png')`,
            backgroundSize: '120%',
            backgroundPosition: 'right -10px top -120px',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            width: '150%',
            height: '180%',
            right: '-10%',
            top: '-40%',
          }}
        ></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white relative z-10">Get a Free Quote</h3>
        <div className="w-20 h-1 bg-primary mb-4 rounded-full"></div>
        <p className="text-muted-foreground mb-6 relative z-10">
          Fill out this quick form and I'll get back to you with a custom quote for your project
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Your Name *" 
                      {...field} 
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Email Address *" 
                        type="email" 
                        {...field} 
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800" 
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
                    <FormControl>
                      <div className="phone-input-container">
                        <Controller
                          name="phone"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <PhoneInput
                              country={'in'} // Default to India
                              value={value}
                              onChange={onChange}
                              inputClass="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 w-full h-10 rounded-md"
                              containerClass="phone-input"
                              buttonClass="phone-select-button"
                              dropdownClass="phone-select-dropdown"
                              enableSearch={true}
                              placeholder="Phone Number *"
                              searchPlaceholder="Search countries..."
                            />
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe your project or requirements *" 
                      className="min-h-[100px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Get Your Free Quote'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}