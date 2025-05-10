import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BarChart2, BrainCircuit, Smartphone, Link2, Rocket } from "lucide-react";
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
      {/* Cool Animated Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Animated grid pattern */}
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
        
        {/* Animated floating circles */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-300/10 dark:bg-blue-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-300/10 dark:bg-purple-500/10 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-green-300/10 dark:bg-green-500/10 rounded-full blur-2xl animate-float-slower" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-orange-300/10 dark:bg-orange-500/10 rounded-full blur-2xl animate-float" />
        
        {/* Animated gradient motion */}
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3), transparent 30%), radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.3), transparent 30%), radial-gradient(circle at 30% 70%, rgba(249, 115, 22, 0.3), transparent 25%), radial-gradient(circle at 80% 30%, rgba(99, 102, 241, 0.3), transparent 25%)',
            backgroundSize: '200% 200%',
            animation: 'gradientMotion 30s ease infinite'
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: Math.random() * 0.3 + 0.1,
                backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#6366f1', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}
              animate={{ 
                x: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ]
              }}
              transition={{
                duration: 20 + Math.random() * 30,
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
          
          {/* Profile Image and Quick Quote Form */}
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
              
              {/* Profile Image - Added above the form */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative z-10 mb-6 max-w-[200px] mx-auto"
              >
                <img 
                  src="/samuel-suit-transparent.png" 
                  alt="Samuel Marndi" 
                  className="w-full h-auto object-contain"
                />
              </motion.div>
              
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
            
            {/* Smaller and Better Positioned Floating Feature Bubbles */}
            {/* Top Left Feature Bubble */}
            <motion.div 
              className="absolute -top-14 -left-5 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                <Code className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium">Web Development</span>
            </motion.div>
            
            {/* Bottom Right Feature Bubble */}
            <motion.div 
              className="absolute -bottom-10 -right-6 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                <BarChart2 className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs font-medium">Digital Marketing</span>
            </motion.div>
            
            {/* Top Feature Bubble - Outside Form Collision Area */}
            <motion.div 
              className="absolute -top-12 right-1/4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                <Rocket className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-medium">UI/UX Design</span>
            </motion.div>
            
            {/* Right Side Feature Bubble */}
            <motion.div 
              className="absolute top-1/3 -right-12 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-full">
                <BrainCircuit className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium">AI Integration</span>
            </motion.div>
            
            {/* Left Side Feature Bubble */}
            <motion.div 
              className="absolute top-2/3 -left-14 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                <Smartphone className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium">Mobile Apps</span>
            </motion.div>
            
            {/* Bottom Left Feature Bubble */}
            <motion.div 
              className="absolute -bottom-8 left-1/4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg z-20 hidden lg:flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
            >
              <div className="p-1.5 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                <Link2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="text-xs font-medium">API Integration</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
