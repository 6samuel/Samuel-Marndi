import { Service } from "@shared/schema";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import ServiceRequestForm from "@/components/forms/service-request-form";
import TechIcons from "./tech-icons";

interface ServiceDetailProps {
  service: Service;
}

const ServiceDetail = ({ service }: ServiceDetailProps) => {
  // Create an array of paragraphs from the fullDescription
  const paragraphs = service.fullDescription.split('\n\n').filter(p => p.trim() !== '');

  // Find sections that look like lists (starting with - or *)
  const processList = [];
  const benefitsList = [];

  // Simple check for list items starting with - or * 
  // and categorizing them based on their preceding headings
  let currentList: string[] = [];
  let isInProcessSection = false;
  let isInBenefitsSection = false;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    
    // Check if this is a heading indicating a list section
    if (paragraph.toLowerCase().includes("process") || 
        paragraph.toLowerCase().includes("steps") ||
        paragraph.toLowerCase().includes("includes")) {
      isInProcessSection = true;
      isInBenefitsSection = false;
      continue;
    } 
    else if (paragraph.toLowerCase().includes("benefits") ||
             paragraph.toLowerCase().includes("features")) {
      isInProcessSection = false;
      isInBenefitsSection = true;
      continue;
    }
    
    // Check if this paragraph contains list items
    if (paragraph.includes('- ') || paragraph.includes('* ')) {
      currentList = paragraph.split(/\n- |\n\* |-|\*/).filter(item => item.trim() !== '');
      
      if (isInProcessSection) {
        processList.push(...currentList);
      } else if (isInBenefitsSection) {
        benefitsList.push(...currentList);
      }
    }
  }

  // If we didn't find explicit lists, create generic ones based on content length
  if (processList.length === 0 && benefitsList.length === 0) {
    // Use first paragraph as description and split remaining content for lists
    const remainingParagraphs = paragraphs.slice(1);
    
    // Split the remaining content between process and benefits
    const midpoint = Math.floor(remainingParagraphs.length / 2);
    
    for (let i = 0; i < midpoint && processList.length < 4; i++) {
      const sentences = remainingParagraphs[i].split('. ');
      processList.push(...sentences.slice(0, 2).map(s => s.trim() + '.'));
    }
    
    for (let i = midpoint; i < remainingParagraphs.length && benefitsList.length < 4; i++) {
      const sentences = remainingParagraphs[i].split('. ');
      benefitsList.push(...sentences.slice(0, 2).map(s => s.trim() + '.'));
    }
  }

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative bg-primary/5 dark:bg-primary/10 py-16 rounded-2xl overflow-hidden"
      >
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              {service.shortDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => {
                  const formSection = document.getElementById('request-service');
                  if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Request This Service
              </Button>
              <Link href="/portfolio">
                <Button variant="outline" size="lg">
                  View Related Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 hidden md:block">
          <img 
            src={service.imageUrl || 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
            alt={service.title}
            className="w-full h-full object-cover blur-sm"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {/* Service Description */}
            <div className="prose dark:prose-invert prose-lg max-w-none mb-10">
              <h2>Overview</h2>
              <p>{paragraphs[0]}</p>
              
              {paragraphs.length > 1 && (
                <>
                  <h2>Details</h2>
                  {paragraphs.slice(1, 3).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </>
              )}
            </div>

            {/* Process Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                My Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processList.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-4 p-5 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">{item}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefitsList.slice(0, 6).map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants} 
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Related Services - Placeholders */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Related Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/services/web-development" className="block group">
                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Web Development</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Custom websites designed for your specific business needs.</p>
                  </div>
                </Link>
                <Link href="/services/digital-marketing" className="block group">
                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Digital Marketing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Strategic marketing services to grow your online presence.</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Service Image */}
            <div className="mb-8">
              <img 
                src={service.imageUrl || 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
                alt={service.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            {/* Service Info Card */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Service Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Typical Timeline: 2-4 weeks
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Priority support included
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <a href="tel:+1234567890" className="block w-full">
                  <Button variant="outline" className="w-full mb-3">
                    Call for Inquiry
                  </Button>
                </a>
                <Button 
                  className="w-full"
                  onClick={() => {
                    const formSection = document.getElementById('request-service');
                    if (formSection) {
                      formSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Request Quote
                </Button>
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm mb-4">
                "Samuel delivered exceptional results with our project. The process was smooth, communication was excellent, and the final result exceeded our expectations."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Client Name</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Company Inc.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Request Form */}
      <div id="request-service" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 mx-auto">
          <motion.div 
            variants={itemVariants}
            className="max-w-3xl mx-auto text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Request This Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fill out the form below to request a quote for {service.title}. I'll get back to you within 24 hours.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="max-w-3xl mx-auto"
          >
            <ServiceRequestForm serviceId={service.id.toString()} serviceName={service.title} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;
