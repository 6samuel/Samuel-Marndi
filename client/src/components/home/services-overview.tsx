import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Service } from "@shared/schema";
import { 
  Code, 
  BarChart2, 
  Palette, 
  Search, 
  ShoppingCart, 
  Smartphone,
  ChevronRight,
  Brain,
  Link2,
  Copy,
  Wrench,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import ServiceRequestModal from "@/components/modals/service-request-modal";

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

const ServicesOverview = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  
  const openRequestModal = (serviceId: number) => {
    setSelectedServiceId(serviceId.toString());
    setIsRequestModalOpen(true);
  };
  
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services/featured'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/services/featured', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured services: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching featured services:", error);
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
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Comprehensive Digital Services for Projects of All Sizes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I offer a complete range of fast, reliable, and cutting-edge solutions to help your business thrive in the digital landscape.
            From stunning websites and AI integration to mobile apps and strategic marketing campaigns.
            All delivered with a focus on reliability, speed, and competitive pricing for every budget.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border border-gray-200 dark:border-gray-800 bg-card animate-pulse h-72">
                <div className="p-6 flex flex-col h-full">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="mt-auto h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </Card>
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
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services?.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Card className="border border-gray-200 dark:border-gray-800 bg-card h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <ServiceIcon name={service.iconName} />
                    </div>
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    <CardDescription>{service.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                    {/* Display a truncated version of the full description */}
                    {service.fullDescription.split(' ').slice(0, 20).join(' ')}...
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <div className="flex justify-between w-full">
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary dark:text-primary-foreground">
                          Learn more <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary border-primary/30 hover:bg-primary/5"
                        onClick={() => openRequestModal(service.id)}
                      >
                        Request this service
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        serviceId={selectedServiceId}
      />
    </section>
  );
};

export default ServicesOverview;
