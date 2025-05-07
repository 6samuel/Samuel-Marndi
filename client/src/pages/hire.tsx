import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, Check, Calendar, Clock, Briefcase, FileCheck, 
  Users, DollarSign, User, FileCode, BarChart, Cpu
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema for hire request
const hireFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  engagementType: z.string().min(1, "Please select an engagement type"),
  servicesNeeded: z.string().min(5, "Please describe the services needed"),
  budget: z.string().optional(),
  timeframe: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type HireFormValues = z.infer<typeof hireFormSchema>;

const Hire = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("project-based");
  
  // Form setup
  const form = useForm<HireFormValues>({
    resolver: zodResolver(hireFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      engagementType: "project-based",
      servicesNeeded: "",
      budget: "",
      timeframe: "",
      additionalInfo: "",
    },
  });

  // Set engagement type when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("engagementType", value);
  };

  // Form submission handler
  const mutation = useMutation({
    mutationFn: (data: HireFormValues) =>
      apiRequest<{ success: boolean }>("/api/hire-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Thank you for your interest! I'll be in touch soon to discuss your project.",
      });
      form.reset();
      form.setValue("engagementType", activeTab);
      queryClient.invalidateQueries({ queryKey: ["/api/hire-requests"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
      console.error("Submission error:", error);
    },
  });

  const onSubmit = (data: HireFormValues) => {
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

  // Engagement models
  const engagementModels = [
    {
      id: "project-based",
      title: "Project-Based",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      description: "One-time projects with a defined scope and deliverables",
      benefits: [
        "Fixed pricing with clear deliverables",
        "Defined project timeline and milestones",
        "Regular updates and communication",
        "Post-project support period"
      ]
    },
    {
      id: "contract",
      title: "Contract Work",
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      description: "Time-based contracts for ongoing work or specific periods",
      benefits: [
        "Flexible hours based on your needs",
        "Weekly progress reports",
        "Contract length from 1-6 months",
        "Option to extend or convert to retainer"
      ]
    },
    {
      id: "retainer",
      title: "Monthly Retainer",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      description: "Ongoing support with dedicated monthly hours",
      benefits: [
        "Reserved capacity each month",
        "Priority response times",
        "Rollover unused hours (up to 20%)",
        "Simplified billing and administration"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hire Me | Samuel Marndi</title>
        <meta 
          name="description" 
          content="Hire Samuel Marndi for your web development, digital marketing, or IT projects. Choose from project-based, contract, or retainer models to suit your business needs."
        />
        <meta property="og:title" content="Hire Me | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Hire Samuel Marndi for your web development, digital marketing, or IT projects. Choose from project-based, contract, or retainer models to suit your business needs."
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
                Hire Me For Your Project
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                Let's collaborate to bring your digital ideas to life with professional expertise
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* My Expertise Section */}
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
                My Expertise
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Specialized technical knowledge and experience to deliver exceptional results for your business
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4">
                      <FileCode className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Web Development</CardTitle>
                    <CardDescription>
                      Custom websites and applications built with modern technologies and best practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Responsive, mobile-first design</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Frontend and backend development</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">E-commerce and CMS integration</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">API development and integration</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4">
                      <BarChart className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Digital Marketing</CardTitle>
                    <CardDescription>
                      Strategic marketing services to drive traffic, engagement, and conversions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">SEO optimization and strategy</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Content marketing and creation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Social media marketing campaigns</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Analytics and performance reporting</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4">
                      <Cpu className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>IT Services</CardTitle>
                    <CardDescription>
                      Comprehensive IT solutions for business efficiency and innovation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Cloud infrastructure setup</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">System integration and automation</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Database design and management</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Technical consulting and strategy</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Engagement Models */}
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
                How We Can Work Together
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the engagement model that best fits your business needs and project requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {engagementModels.map((model) => (
                <Card key={model.id} className={`h-full cursor-pointer transition-colors ${
                  activeTab === model.id ? 'border-primary border-2' : ''
                }`}
                onClick={() => handleTabChange(model.id)}
                >
                  <CardHeader>
                    <div className="mb-4 flex justify-center">
                      {model.icon}
                    </div>
                    <CardTitle className="text-center">{model.title}</CardTitle>
                    <CardDescription className="text-center">
                      {model.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {model.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button 
                      variant={activeTab === model.id ? "default" : "outline"}
                      onClick={() => handleTabChange(model.id)}
                    >
                      {activeTab === model.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Hire Form Section */}
        <section id="hire-form" className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Request My Services</CardTitle>
                <CardDescription>
                  Fill out the form below to tell me about your project or needs. I'll review your request and get back to you within 48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hidden engagement type field */}
                    <FormField
                      control={form.control}
                      name="engagementType"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Personal Information */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Your Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
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
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company/Organization (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {/* Project Information */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-semibold">Project Details</h3>
                      
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select the type of project" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="web-development">Web Development</SelectItem>
                                <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                                <SelectItem value="seo-optimization">SEO Optimization</SelectItem>
                                <SelectItem value="cloud-computing">Cloud Computing Services</SelectItem>
                                <SelectItem value="cybersecurity">Cybersecurity Services</SelectItem>
                                <SelectItem value="it-consulting">IT Consulting</SelectItem>
                                <SelectItem value="data-analytics">Data Analytics & BI</SelectItem>
                                <SelectItem value="other">Other (Specify in description)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="servicesNeeded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your project, goals, and any specific requirements"
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget Range (Optional)</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your budget range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                                  <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                                  <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                                  <SelectItem value="25000-plus">$25,000+</SelectItem>
                                  <SelectItem value="not-sure">Not sure yet</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeframe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timeframe (Optional)</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your timeframe" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="asap">As soon as possible</SelectItem>
                                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                                  <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                                  <SelectItem value="1-3-months">1-3 months</SelectItem>
                                  <SelectItem value="3-plus-months">3+ months</SelectItem>
                                  <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any other details you'd like to share"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Why Hire Me Section */}
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
                Why Hire Me?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Here's what makes working with me different
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <User className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Personal Attention
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Direct communication with me throughout your project - no account managers or third parties.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Timely Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Respect for deadlines and transparent communication about timelines and progress.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <DollarSign className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Value-Focused
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Focus on delivering solutions that provide real business value and ROI, not just technical deliverables.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Common questions about working with me
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is your hiring process like?</AccordionTrigger>
                <AccordionContent>
                  After submitting your request, I'll review it and get back to you within 48 hours. We'll schedule a consultation call to discuss your project in detail. Then I'll provide a proposal with scope, timeline, and pricing. Once accepted, we'll begin with a kickoff meeting to align on goals and expectations.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do you handle project management?</AccordionTrigger>
                <AccordionContent>
                  I use agile methodologies and professional project management tools to ensure smooth collaboration. You'll receive regular updates and have access to a project dashboard to track progress. For larger projects, we'll establish regular check-in calls and milestone reviews.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What are your payment terms?</AccordionTrigger>
                <AccordionContent>
                  For project-based work, I typically require a 50% deposit to begin, with the remaining balance due upon completion or in milestone payments for larger projects. For contracts and retainers, payment is generally due at the beginning of each month or period. I accept bank transfers, credit cards, and PayPal.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you provide maintenance and support?</AccordionTrigger>
                <AccordionContent>
                  Yes, all projects include a warranty period (typically 30 days) for bug fixes. Beyond that, I offer maintenance packages and support retainers to ensure your project continues to run smoothly. For technical emergencies, priority support is available for clients on maintenance plans.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Can you handle rush projects?</AccordionTrigger>
                <AccordionContent>
                  Yes, depending on my current workload, I can accommodate rush projects for an additional fee. If you have an urgent need, please mention it in your request, and I'll do my best to prioritize your project. For existing clients, I always try to make room for urgent requests.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Do you work with clients internationally?</AccordionTrigger>
                <AccordionContent>
                  Yes, I work with clients globally. I'm comfortable with remote collaboration and have experience working across different time zones. We can schedule meetings at times that work for both of us, and I'm flexible with communication methods to ensure smooth collaboration regardless of location.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
              Ready to Discuss Your Project?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              If you prefer to discuss your project before submitting a formal request, feel free to reach out directly.
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

export default Hire;