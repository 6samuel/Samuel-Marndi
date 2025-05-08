import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  ArrowRight, 
  Code, 
  BarChart2, 
  Palette, 
  Search, 
  ShoppingCart, 
  Smartphone,
  Brain,
  Link2,
  Copy,
  Wrench,
  Share2
} from "lucide-react";
import ServiceRequestModal from "@/components/modals/service-request-modal";

// Service icon mapping
const ServiceIcon = ({ name }: { name: string }) => {
  const icons = {
    "Code": <Code className="h-5 w-5" />,
    "BarChart": <BarChart2 className="h-5 w-5" />,
    "Palette": <Palette className="h-5 w-5" />,
    "Search": <Search className="h-5 w-5" />,
    "ShoppingCart": <ShoppingCart className="h-5 w-5" />,
    "Smartphone": <Smartphone className="h-5 w-5" />,
    "Brain": <Brain className="h-5 w-5" />,
    "Link": <Link2 className="h-5 w-5" />,
    "Copy": <Copy className="h-5 w-5" />,
    "Wrench": <Wrench className="h-5 w-5" />,
    "Share2": <Share2 className="h-5 w-5" />
  };
  
  return icons[name as keyof typeof icons] || <Code className="h-5 w-5" />;
};

const Services = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  
  const openRequestModal = (serviceId: number) => {
    setSelectedServiceId(serviceId.toString());
    setIsRequestModalOpen(true);
  };
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 2
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  return (
    <>
      <Helmet>
        <title>Services | Web Development & Digital Marketing | Samuel Marndi</title>
        <meta 
          name="description" 
          content="Explore professional web development, digital marketing, UI/UX design, and SEO services offered by Samuel Marndi to help your business thrive online."
        />
        <meta property="og:title" content="Services | Web Development & Digital Marketing | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Explore professional web development, digital marketing, UI/UX design, and SEO services offered by Samuel Marndi to help your business thrive online."
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
                My Services
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                Comprehensive digital solutions tailored to help your business succeed online.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container px-4 mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400">Failed to load services. Please try again later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {services?.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-md transition-shadow duration-300 flex flex-col">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <ServiceIcon name={service.iconName} />
                      </div>
                      <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                      <CardDescription>{service.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {/* Display a truncated version of the full description */}
                        {service.fullDescription.split(' ').slice(0, 30).join(' ')}...
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/services/${service.slug}`}>
                        <Button className="w-full">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Process Overview */}
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
                My Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                A structured approach to deliver exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Discovery & Planning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I start by understanding your business, goals, and requirements to create a strategic roadmap.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center justify-center mb-4">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Design & Development
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Creating intuitive designs and building robust solutions using the latest technologies and best practices.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Testing & Launch
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Thorough testing ensures quality, followed by a smooth launch and continued support for your success.
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
                Answers to common questions about my services
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  How long does a typical project take?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while more complex applications could take 2-3 months. I provide a detailed timeline during the planning phase.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  What is your payment structure?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I typically work with a 50% upfront deposit, with the remaining balance due upon project completion. For larger projects, I offer milestone-based payment schedules.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Do you provide ongoing maintenance?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, I offer monthly maintenance packages to keep your website secure, updated, and performing optimally. These can be tailored to your specific needs.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Can you help with existing websites?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely! I offer services for redesigns, optimizations, and improvements to existing websites. I'll assess your current site and recommend the best approach.
                </p>
              </div>
            </div>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help you achieve your digital goals and create a solution tailored to your business needs.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Services;
