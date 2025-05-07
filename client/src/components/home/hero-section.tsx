import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BarChart2, Palette, Brain, Smartphone, Link2 } from "lucide-react";

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Websites", "Apps", "AI Solutions", "E-commerce", "Experiences"];
  const colors = ["#3b82f6", "#10b981", "#6366f1", "#f97316", "#8b5cf6"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative py-20 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 select-none pointer-events-none">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 800" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="grid" 
              width="50" 
              height="50" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 50 0 L 0 0 0 50" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              Creating Exceptional Digital{" "}
              <span 
                className="relative inline-block transition-colors duration-500" 
                style={{ color: colors[currentWord] }}
              >
                {words[currentWord]}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Hi, I'm Samuel Marndi. I help businesses establish a powerful online presence through 
              fast, reliable, and cutting-edge web development, AI integration, mobile apps, and strategic 
              digital marketing solutions for all project sizes and budgets.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Link href="/services">
                <Button size="lg" className="font-medium">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="font-medium">
                  View My Work
                </Button>
              </Link>
            </motion.div>
            
            {/* Featured In */}
            <motion.div 
              className="mt-12 space-y-3"
              variants={itemVariants}
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                TRUSTED BY BUSINESSES WORLDWIDE
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                <img 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/microsoft.svg" 
                  alt="Microsoft" 
                  className="h-6 w-auto opacity-50 dark:invert"
                />
                <img 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/adobe.svg" 
                  alt="Adobe" 
                  className="h-6 w-auto opacity-50 dark:invert"
                />
                <img 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/shopify.svg" 
                  alt="Shopify" 
                  className="h-6 w-auto opacity-50 dark:invert"
                />
                <img 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/slack.svg" 
                  alt="Slack" 
                  className="h-6 w-auto opacity-50 dark:invert"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Hero Image */}
          <motion.div 
            className="flex-1"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Professional web developer" 
                className="rounded-lg shadow-2xl relative z-10 w-full h-auto"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-5 -left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Web Development</span>
                </div>
              </div>
              
              <div className="absolute bottom-5 -right-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <BarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium">Digital Marketing</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 -right-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">UI/UX Design</span>
                </div>
              </div>
              
              <div className="absolute top-1/3 -translate-y-1/2 -left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">AI Integration</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                    <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium">Mobile Apps</span>
                </div>
              </div>
              
              <div className="absolute top-2/3 right-1/2 translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-sky-100 dark:bg-sky-900 rounded-full">
                    <Link2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="font-medium">API Integration</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
