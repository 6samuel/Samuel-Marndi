import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackConversion } from "@/components/tracking/tracking-scripts";
import { useConversionTracking } from "@/components/tracking/conversion-tracker";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  serviceInterest: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  // Get conversion tracking function
  const { trackEvent } = useConversionTracking(); // Fixed hook usage
  const [phoneValue, setPhoneValue] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      serviceInterest: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiRequest("POST", "/api/contact", values),
    onSuccess: () => {
      // Send success toast notification
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // Track form submission as conversion in all platforms
      // Use the trackEvent from useConversionTracking hook
      trackEvent(
        'contact_form_submission', 
        'lead_generation',
        'contact_form'
      );
      
      // Track in Google Analytics
      trackConversion.googleAnalytics(
        'generate_lead', 
        'conversion', 
        'contact_form', 
      );

      // Track in Facebook Pixel
      trackConversion.facebookPixel('Lead', {
        content_category: 'contact',
        content_name: form.getValues().serviceInterest || 'general',
      });
      
      // Reset form and show success message
      form.reset();
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 px-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your message has been received. I'll get back to you as soon as possible.
        </p>
        <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="phone-input-container">
                  <PhoneInput
                    country={'in'}
                    value={phoneValue}
                    onChange={(phone) => {
                      setPhoneValue(phone);
                      field.onChange(phone);
                    }}
                    inputClass="phone-input"
                    containerClass="phone-container w-full"
                    buttonClass="country-dropdown"
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      fontSize: '16px',
                      paddingLeft: '48px',
                      borderRadius: '0.375rem',
                      borderColor: 'hsl(var(--input))',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                    }}
                    buttonStyle={{
                      borderRadius: '0.375rem 0 0 0.375rem',
                      borderColor: 'hsl(var(--input))',
                      backgroundColor: 'hsl(var(--background))',
                    }}
                    dropdownStyle={{
                      color: 'hsl(var(--foreground))',
                      backgroundColor: 'hsl(var(--background))',
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter your phone number with country code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Interest</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service you're interested in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                  <SelectItem value="mobile-app-development">Mobile App Development</SelectItem>
                  <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                  <SelectItem value="ai-integration">AI Integration</SelectItem>
                  <SelectItem value="web-maintenance">Website Maintenance</SelectItem>
                  <SelectItem value="ecommerce-solutions">E-commerce Solutions</SelectItem>
                  <SelectItem value="clone-app-development">Clone App Development</SelectItem>
                  <SelectItem value="api-integration">API Integration</SelectItem>
                  <SelectItem value="seo-optimization">SEO Optimization</SelectItem>
                  <SelectItem value="other">Other Service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project or inquiry. Include any details about your budget, timeline, or specific requirements."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Get Quote"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
