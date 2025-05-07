import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building, ArrowRight, Check, Handshake, Users, Briefcase, 
  DollarSign, Award, PieChart, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema for partner application
const partnerFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional(),
  businessType: z.string().min(2, "Please specify your business type"),
  services: z.string().min(5, "Please describe the services you're interested in"),
  expectations: z.string().min(5, "Please describe your expectations from the partnership"),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

const Partners = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("become-partner");
  
  // Form setup
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      services: "",
      expectations: "",
    },
  });

  // Form submission handler
  const mutation = useMutation({
    mutationFn: async (data: PartnerFormValues) => {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit partner application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! I'll be in touch soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/partner-applications"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    },
  });

  const onSubmit = (data: PartnerFormValues) => {
    mutation.mutate(data);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Partnership types
  const partnershipTypes = [
    {
      title: "Referral Partners",
      icon: <Handshake className="h-8 w-8 text-primary" />,
      description: "Earn commissions by referring clients to my services. Perfect for agencies and individual professionals who want to offer additional services to their clients.",
      benefits: [
        "15-25% commission on each successful referral",
        "Dedicated partnership manager",
        "Regular updates on referred projects",
        "Marketing materials and support"
      ]
    },
    {
      title: "Agency Partners",
      icon: <Building className="h-8 w-8 text-primary" />,
      description: "For digital agencies looking to expand their service offerings without increasing overhead. Partner with me to handle specialized technical projects.",
      benefits: [
        "White-label service options",
        "Priority project scheduling",
        "Customized pricing structures",
        "Joint marketing opportunities"
      ]
    },
    {
      title: "Technology Partners",
      icon: <Network className="h-8 w-8 text-primary" />,
      description: "For technology companies looking to integrate their products or platforms with custom development solutions or extend their implementation services.",
      benefits: [
        "Technical integration expertise",
        "Joint solution development",
        "Co-branded case studies",
        "Specialized training and support"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partnership Programs | Samuel Marndi</title>
        <meta 
          name="description" 
          content="Explore partnership opportunities with Samuel Marndi. Join our referral, agency, or technology partner programs to grow your business and deliver exceptional solutions to clients."
        />
        <meta property="og:title" content="Partnership Programs | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Explore partnership opportunities with Samuel Marndi. Join our referral, agency, or technology partner programs to grow your business and deliver exceptional solutions to clients."
        />
      </Helmet>

      <div className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pb-16">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
                variants={itemVariants}
              >
                Partner With Me
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                Join forces to deliver exceptional digital solutions and grow together
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="container px-4 mx-auto">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Partnership Programs
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the partnership model that fits your business needs and start growing with high-quality technical expertise and service delivery.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnershipTypes.map((type, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-4">
                        {type.icon}
                      </div>
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setActiveTab("become-partner");
                          document.getElementById("partnership-tabs")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Why Partner Section */}
        <section className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Why Partner With Me?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Build a mutually beneficial partnership that helps us both deliver exceptional value to clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <DollarSign className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Revenue Growth
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create new revenue streams through commissions and expanded service offerings.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Client Satisfaction
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Provide comprehensive solutions that meet all your clients' digital needs.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <Briefcase className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Expertise Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tap into specialized technical knowledge without hiring additional staff.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <Award className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Quality Assurance
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Deliver consistently high-quality work backed by professional expertise.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Partner Application Tabs */}
        <section id="partnership-tabs" className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="become-partner">Become a Partner</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="become-partner" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Partner Application</CardTitle>
                    <CardDescription>
                      Fill out the form below to apply for a partnership. I'll review your application and get back to you within 2 business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="your.email@example.com" {...field} />
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
                                <FormLabel>Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://your-website.com" {...field} />
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
                                <FormControl>
                                  <Input placeholder="Agency, Consultant, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Services You're Interested In</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="What services are you interested in partnering on?"
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
                          name="expectations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Partnership Expectations</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="What are your goals and expectations from this partnership?"
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
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faqs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Common questions about the partnership program
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How does the referral commission work?</AccordionTrigger>
                        <AccordionContent>
                          Referral partners earn 15-25% commission on the first project with a referred client, depending on project size and scope. Commissions are paid after the client's first payment is received, typically within 30 days.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What kind of projects can I refer?</AccordionTrigger>
                        <AccordionContent>
                          You can refer clients for any of my services including web development, digital marketing, UI/UX design, SEO optimization, e-commerce solutions, and mobile app development. If you're unsure if a project is a good fit, feel free to reach out for a quick consultation.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How does the agency partnership model work?</AccordionTrigger>
                        <AccordionContent>
                          Agency partnerships allow you to offer my services as part of your own service offerings. This can be done either as a white-label service (where I work under your brand) or as a collaborative partner. We establish a service agreement with clear terms on pricing, communication, and project management.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Do you provide marketing materials for partners?</AccordionTrigger>
                        <AccordionContent>
                          Yes, I provide partners with marketing materials including service descriptions, case studies, presentation templates, and other collateral to help you promote the services to your clients or prospects.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How long does the application process take?</AccordionTrigger>
                        <AccordionContent>
                          After submitting your application, I'll review it within 2 business days. If there's a good fit, I'll schedule a call to discuss the partnership in more detail. The entire process typically takes 1-2 weeks from application to formalized agreement.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-6">
                        <AccordionTrigger>Is there an exclusivity requirement?</AccordionTrigger>
                        <AccordionContent>
                          No, my partnership programs don't require exclusivity. You're free to work with other providers. However, I do offer enhanced benefits for partners who choose to work exclusively with me for certain service categories.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button 
                      onClick={() => setActiveTab("become-partner")}
                      variant="outline"
                    >
                      Apply for Partnership
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-12 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Have Questions About Partnering?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              If you'd like to discuss partnership opportunities in more detail before applying, I'm happy to schedule a consultation.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Partners;