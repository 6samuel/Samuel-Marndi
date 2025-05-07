import { PortfolioItem as PortfolioItemType } from "@shared/schema";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Calendar, Blocks } from "lucide-react";

interface PortfolioItemProps {
  item: PortfolioItemType;
}

const PortfolioItem = ({ item }: PortfolioItemProps) => {
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
      className="space-y-16"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 py-16 rounded-2xl overflow-hidden"
      >
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <Link href="/portfolio">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Portfolio
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{item.category}</Badge>
                {item.completionDate && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="inline-block mr-1 h-4 w-4" />
                    Completed: {item.completionDate}
                  </span>
                )}
              </div>
            </div>
            {item.websiteUrl && (
              <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Button className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Visit Website
                </Button>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Content - Main Image and Description */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="mb-10">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-lg mb-8"
              />
              
              {/* Project Description */}
              <div className="prose dark:prose-invert prose-lg max-w-none">
                <h2>Project Overview</h2>
                <p>{item.description}</p>
                
                {/* Additional content sections could be added here */}
                <h2>Challenge</h2>
                <p>
                  Working closely with {item.client}, we identified several key challenges that needed to be addressed to ensure the project's success and deliver a solution that would meet their specific needs.
                </p>
                
                <h2>Solution</h2>
                <p>
                  After thorough analysis and planning, I developed a comprehensive solution that addressed all the client's requirements while maintaining a focus on user experience, performance, and scalability.
                </p>
                
                <h2>Results</h2>
                <p>
                  The completed project successfully achieved the client's objectives, providing them with a powerful tool to enhance their business operations and improve customer engagement.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
            {/* Client Info */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Client Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Client:</span> {item.client}
              </p>
              {item.completionDate && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-medium">Completed:</span> {item.completionDate}
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Category:</span> {item.category}
              </p>
            </div>
            
            {/* Technologies Used */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Blocks className="mr-2 h-5 w-5" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.technologies?.map((tech, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Other Projects */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Other Projects
              </h3>
              <div className="space-y-4">
                <Link href="/portfolio/eco-friendly-ecommerce" className="block group">
                  <div className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                        alt="E-commerce Project" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">Eco-Friendly E-commerce Platform</span>
                  </div>
                </Link>
                <Link href="/portfolio/financial-advisor-website" className="block group">
                  <div className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                        alt="Financial Website" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">Financial Advisory Firm Website</span>
                  </div>
                </Link>
              </div>
              <div className="mt-4">
                <Link href="/portfolio">
                  <Button variant="outline" className="w-full">
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* CTA */}
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Need a similar project?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Let's discuss how I can help you achieve your goals with a custom solution.
              </p>
              <Link href="/contact">
                <Button className="w-full">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioItem;
