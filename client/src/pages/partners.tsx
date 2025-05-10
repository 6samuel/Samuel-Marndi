import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Building2, 
  BarChart3, 
  PieChart, 
  Rocket, 
  Globe, 
  Users, 
  Share2, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trackConversion } from '@/components/tracking/tracking-scripts';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SEO } from '@/lib/seo-utils';

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  contactName: z.string().min(2, {
    message: 'Contact name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(6, {
    message: 'Please enter a valid phone number.',
  }).optional(),
  website: z.string().url({
    message: 'Please enter a valid website URL.',
  }).optional().or(z.literal('')),
  businessType: z.string().min(2, {
    message: 'Please specify your business type.',
  }),
  services: z.string().min(5, {
    message: 'Please describe the services you\'re interested in.',
  }),
  expectations: z.string().min(5, {
    message: 'Please describe your expectations from the partnership.',
  }),
});

const PartnerCard = ({ 
  icon: Icon,
  title,
  description,
  color
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) => (
  <div className={`bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow`}>
    <div className={`h-2 ${color}`}></div>
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="ml-3 font-bold text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {description}
      </p>
    </div>
  </div>
);

const BenefitCard = ({ 
  title,
  description,
  icon: Icon,
  delay = 0
}: { 
  title: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
  >
    <div className="bg-primary/10 p-3 w-fit rounded-full mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </motion.div>
);

const PartnerPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Define form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      businessType: '',
      services: '',
      expectations: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Submit form data to the API
      await apiRequest('POST', '/api/partner-applications', values);
      
      // Track conversion
      trackConversion.googleAnalytics('conversion', 'form_submission', 'partner_application');
      
      // Show success message
      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your partnership application and contact you soon.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Partnership Opportunities | Samuel Marndi"
        description="Partner with Samuel Marndi for commission-based business growth. Service integration, IT company collaboration, and product promotion opportunities available."
        keywords={[
          "business partnership", 
          "commission based partnership", 
          "IT company collaboration", 
          "service integration", 
          "product promotion", 
          "marketing partnership",
          "digital growth partnership",
          "business collaboration",
          "revenue sharing"
        ]}
        ogType="website"
        canonical="/partners"
      />

      <main>
        {/* Hero section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Strategic Partnerships for Growth
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                  Join forces with me to unlock new revenue streams through commission-based partnerships.
                  Leverage my expertise in digital marketing and web development to expand your business reach.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                  <Button size="lg" asChild>
                    <a href="#apply">Apply for Partnership</a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="#benefits">Learn More</a>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <PartnerCard 
                  icon={Globe}
                  title="Service Integration"
                  description="Partner your services with my client projects. I integrate your services into my clients' websites and systems for a commission."
                  color="bg-gradient-to-r from-blue-400 to-blue-600"
                />
                
                <PartnerCard 
                  icon={Building2}
                  title="IT Company Collaboration"
                  description="I bring high-value clients to your IT company for large-scale projects that require extensive resources, and earn commission on successful referrals."
                  color="bg-gradient-to-r from-purple-400 to-purple-600"
                />
                
                <PartnerCard 
                  icon={Rocket}
                  title="Product Promotion"
                  description="I promote your software, apps, or digital products through my marketing channels to grow your business while earning commission on sales."
                  color="bg-gradient-to-r from-green-400 to-green-600"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="benefits" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">Partnership Benefits</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Discover how a strategic partnership can drive mutual growth and create new opportunities for your business.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <BenefitCard 
                icon={BarChart3}
                title="Increased Revenue"
                description="Generate additional income streams through commission-based partnerships without any upfront costs or investments."
                delay={0.1}
              />
              <BenefitCard 
                icon={Users}
                title="Expanded Audience"
                description="Access a broader customer base through cross-promotion and targeted marketing to relevant prospects."
                delay={0.2}
              />
              <BenefitCard 
                icon={Share2}
                title="Market Credibility"
                description="Enhance your brand reputation by associating with established services and proven expertise in the digital space."
                delay={0.3}
              />
              <BenefitCard 
                icon={PieChart}
                title="Performance Tracking"
                description="Receive detailed reports on partnership performance with transparent metrics and analytics."
                delay={0.4}
              />
              <BenefitCard 
                icon={Handshake}
                title="Flexible Arrangements"
                description="Custom partnership agreements tailored to your specific business needs and goals."
                delay={0.5}
              />
              <BenefitCard 
                icon={Rocket}
                title="Growth Acceleration"
                description="Leverage combined resources and expertise to achieve faster market penetration and business growth."
                delay={0.6}
              />
            </div>

            <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-indigo-600/10 dark:from-primary/20 dark:to-indigo-600/20 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Why businesses choose to partner with me:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Zero upfront costs with commission-based model</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Expertise in digital marketing and conversion optimization</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Professional client management and handoffs</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Transparent reporting and performance metrics</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Flexible partnership terms to suit your business</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Proactive communication and collaboration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Find answers to common questions about our partnership opportunities.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How does the commission structure work?</AccordionTrigger>
                    <AccordionContent>
                      Commission structures vary based on the partnership type and are typically percentage-based on 
                      the value delivered. For service integrations, commissions range from 10-30% depending on the 
                      service. For IT company collaborations, referral fees are usually 10-15% of project value. 
                      For product promotions, commissions typically range from 20-40% of sales generated.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is there any upfront cost to becoming a partner?</AccordionTrigger>
                    <AccordionContent>
                      No, there are no upfront costs to becoming a partner. Our partnerships operate on a 
                      commission-based model, meaning you only pay when results are delivered. This ensures 
                      our interests are aligned and focused on mutual success.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How long does the application process take?</AccordionTrigger>
                    <AccordionContent>
                      The partnership application process typically takes 5-7 business days. After submission, 
                      I'll review your application and contact you to discuss the partnership in more detail. 
                      If approved, we'll finalize the terms and begin our collaboration promptly.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What kinds of businesses make good partners?</AccordionTrigger>
                    <AccordionContent>
                      Ideal partners include software/SaaS companies, digital service providers, IT companies, 
                      marketing agencies, hosting providers, payment processors, content creators, and businesses 
                      with complementary services to web development and digital marketing. The key is having 
                      services or products that provide value to my client base.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do you handle client handovers for IT collaborations?</AccordionTrigger>
                    <AccordionContent>
                      For IT company collaborations, I provide comprehensive project briefs, including client 
                      requirements, expectations, and any relevant technical details. I can participate in initial 
                      client meetings to ensure a smooth transition and remain available for consultation throughout 
                      the project as needed to maintain client satisfaction.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>What marketing channels do you use for product promotion?</AccordionTrigger>
                    <AccordionContent>
                      For product promotions, I leverage multiple channels including my website, email newsletter, 
                      social media platforms, content marketing (blog posts, tutorials), client recommendations, 
                      and targeted digital advertising when appropriate. I create a customized promotion strategy 
                      based on your product and target audience.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Apply for Partnership</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Ready to grow together? Fill out the application form below to start the partnership process.
                    I'll review your submission and contact you to discuss potential collaboration opportunities.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
              >
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for your interest in partnering with me. I'll review your application and contact you 
                      within 5-7 business days to discuss the next steps.
                    </p>
                    <Button onClick={() => setIsSuccess(false)}>Submit Another Application</Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
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
                                <Input placeholder="your@email.com" type="email" {...field} />
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
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your business type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="service_provider">Service Provider</SelectItem>
                                  <SelectItem value="it_company">IT Company</SelectItem>
                                  <SelectItem value="software_company">Software/SaaS Company</SelectItem>
                                  <SelectItem value="digital_agency">Digital/Marketing Agency</SelectItem>
                                  <SelectItem value="ecommerce">E-Commerce Business</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="companyDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description of your company and the services/products you offer" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="partnershipGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partnership Goals</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What do you hope to achieve through this partnership?" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="text-center pt-4">
                        <Button 
                          type="submit" 
                          size="lg"
                          disabled={isSubmitting}
                          className="px-8"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          By submitting this form, you agree to be contacted regarding partnership opportunities.
                        </p>
                      </div>
                    </form>
                  </Form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Ready to Grow Together?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  The most successful businesses aren't built alone. They're created through strategic 
                  partnerships that multiply reach, expertise, and opportunities. Take the first step 
                  towards exponential growth today.
                </p>
                <Button size="lg" asChild>
                  <a href="#apply">Apply for Partnership</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PartnerPage;