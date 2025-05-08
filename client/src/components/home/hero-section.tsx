import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BarChart2, Palette, Brain, Smartphone, Link2 } from "lucide-react";
import QuickQuoteForm from "@/components/forms/quick-quote-form";

// Wrapper component to handle form state
const QuickQuoteFormWrapper = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (isSubmitted) {
    return (
      <div className="w-full p-6">
        <div className="glass-effect relative rounded-lg p-8 text-center border border-gray-200/30 dark:border-gray-700/30">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Thank You!</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Your quote request has been submitted successfully. I'll review it and get back to you as soon as possible.
            </p>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6 mx-auto max-w-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A confirmation email has been sent to your inbox with the details of your request.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  Explore My Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline">
                  View My Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <QuickQuoteForm onSubmitSuccess={() => setIsSubmitted(true)} />;
};

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
          
          {/* Quick Quote Form */}
          <motion.div 
            className="flex-1"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Advanced Background Animation */}
              <div className="absolute inset-0 overflow-hidden z-0">
                {/* Animated gradients */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-green-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
                
                {/* Animated particles */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/40 rounded-full"
                      initial={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        opacity: Math.random() * 0.5 + 0.3
                      }}
                      animate={{ 
                        x: [
                          Math.random() * 100 + '%', 
                          Math.random() * 100 + '%',
                          Math.random() * 100 + '%'
                        ],
                        y: [
                          Math.random() * 100 + '%', 
                          Math.random() * 100 + '%',
                          Math.random() * 100 + '%'
                        ]
                      }}
                      transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Quick Quote Form - Translucent and stylish */}
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-800/50 overflow-hidden"
                >
                  <QuickQuoteFormWrapper />
                </motion.div>
              </div>
            </div>
            
            {/* Floating Service Elements - Now with Animation */}
            <motion.div 
              className="absolute top-5 -left-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Web Development</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-5 -right-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <BarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium">Digital Marketing</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 -right-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">UI/UX Design</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/3 -translate-y-1/2 -left-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">AI Integration</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-medium">Mobile Apps</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-2/3 -right-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 hidden md:block"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-sky-100 dark:bg-sky-900 rounded-full">
                  <Link2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <span className="font-medium">API Integration</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
