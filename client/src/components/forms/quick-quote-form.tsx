import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
    <div className="w-full bg-card rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Get a Free Quote</h3>
      <p className="text-muted-foreground mb-6">
        Fill out this quick form and I'll get back to you with a custom quote for your project
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Your Name *" {...field} />
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
                    <Input placeholder="Email Address *" type="email" {...field} />
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
                    <Input placeholder="Phone Number *" {...field} />
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
                    className="min-h-[100px]"
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
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Get Quote'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}