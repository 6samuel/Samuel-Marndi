import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BarChart2, BrainCircuit, Globe, Database } from "lucide-react";
import QuickQuoteForm from "@/components/forms/quick-quote-form";

// Import the image directly
import samuelImage from "../../../public/samuel-transparent.png";

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

// Tech icons with their original colors
const techIcons = [
  { name: "React", color: "#61DAFB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Angular", color: "#DD0031", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "Vue", color: "#4FC08D", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Node.js", color: "#339933", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", color: "#3776AB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", color: "#F7DF1E", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", color: "#3178C6", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "PHP", color: "#777BB4", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Java", color: "#007396", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Swift", color: "#F05138", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { name: "Flutter", color: "#02569B", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  // Fixed AWS icon by using plain version instead of original
  { name: "AWS", color: "#FF9900", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
  { name: "Firebase", color: "#FFCA28", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "MongoDB", color: "#47A248", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "MySQL", color: "#4479A1", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "PostgreSQL", color: "#4169E1", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Docker", color: "#2496ED", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", color: "#326CE5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "TensorFlow", color: "#FF6F00", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "GraphQL", color: "#E10098", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
];

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
      {/* Enhanced Animated Background */}
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
        
        {/* Improved animated floating circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-green-300/20 dark:bg-green-500/20 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-orange-300/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-10 right-1/3 w-40 h-40 bg-pink-300/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-32 left-20 w-56 h-56 bg-indigo-300/20 dark:bg-indigo-500/20 rounded-full blur-3xl animate-float-slower" />
        
        {/* Animated gradient motion - enhanced */}
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.4), transparent 40%), radial-gradient(circle at 75% 65%, rgba(16, 185, 129, 0.4), transparent 40%), radial-gradient(circle at 25% 75%, rgba(249, 115, 22, 0.4), transparent 35%), radial-gradient(circle at 75% 25%, rgba(99, 102, 241, 0.4), transparent 35%), radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 45%)',
            backgroundSize: '200% 200%',
            animation: 'gradientMotion 30s ease infinite'
          }}
        />
        
        {/* Distributed tech stacks floating throughout the hero section - bigger and better distributed */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {techIcons.map((tech, i) => {
            // Improved distribution with guaranteed spacing
            const sectionWidth = 100 / 5; // Divide screen into 5 columns
            const sectionHeight = 100 / 4; // Divide screen into 4 rows
            
            // Calculate base position in grid
            const baseCol = i % 5;
            const baseRow = Math.floor(i / 5) % 4;
            
            // Calculate position with jitter to avoid perfect grid appearance
            const jitterX = (Math.sin(i * 3.7) * 10); 
            const jitterY = (Math.cos(i * 2.9) * 10);
            
            // Combine for final position (guaranteed to be spread out)
            const baseX = baseCol * sectionWidth + sectionWidth/2 + jitterX;
            const baseY = baseRow * sectionHeight + sectionHeight/2 + jitterY;
            
            // Create a position object (alternating between different position types)
            let position;
            if (i % 4 === 0) {
              position = { top: `${baseY}%`, left: `${baseX}%` };
            } else if (i % 4 === 1) {
              position = { bottom: `${100-baseY}%`, right: `${100-baseX}%` };
            } else if (i % 4 === 2) {
              position = { top: `${baseY}%`, right: `${100-baseX}%` };
            } else {
              position = { bottom: `${100-baseY}%`, left: `${baseX}%` };
            }
            
            // LARGER size variations
            const size = 18 + (i % 5) * 6; // 18px to 42px (much bigger than before)
            
            // Animation speed variations
            const durationBase = 25 + (i % 5) * 8; // 25s to 57s
            
            // Different animation paths with larger movement ranges
            const paths = [
              // Circular path
              {
                x: `${Math.sin((i % 6) * 60) * 20}%`,
                y: `${Math.cos((i % 6) * 60) * 20}%`,
                rotate: 360
              },
              // Zigzag path
              {
                x: [`-15%`, `15%`, `-10%`, `20%`, `0%`],
                y: [`15%`, `-15%`, `20%`, `-10%`, `0%`],
                rotate: [0, 45, -45, 90, 0]
              },
              // Bouncy path
              {
                y: [`-20%`, `20%`],
                x: [`-15%`, `15%`],
                scale: [0.9, 1.3, 0.9]
              },
              // Spiral path
              {
                x: [0, '15%', '7%', '-15%', '-7%', 0],
                y: [0, '7%', '20%', '12%', '-15%', 0],
                scale: [1, 1.2, 0.9, 1.3, 0.8, 1]
              }
            ];
            
            const pathIndex = i % paths.length;
            const animationPath = paths[pathIndex];
            
            // Staggered delays to prevent all icons moving in sync
            const delay = (i % 15) * 0.3;
            
            return (
              <motion.div
                key={i}
                className="absolute will-change-transform"
                initial={{ 
                  opacity: 0.8,
                  scale: 0.9,
                }}
                animate={{ 
                  ...animationPath,
                  opacity: [0.6, 0.9, 0.7, 1.0, 0.8],
                }}
                transition={{
                  duration: durationBase,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: delay,
                }}
                style={{
                  ...position,
                  zIndex: 1,
                }}
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className="object-contain filter drop-shadow-lg"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  title={tech.name}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* COMPLETELY REMOVED ALL code particles */}
        {/* No code particles at all to ensure there are no text symbols anywhere */}
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Main heading section */}
        <div className="text-center mx-auto mb-8">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
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
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Hi, I'm Samuel Marndi. I help businesses establish a powerful online presence through 
            cutting-edge web development, AI integration, mobile apps, and strategic marketing solutions.
          </motion.p>
        </div>
        
        {/* Three-column layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Value Proposition - Full width on mobile, 5/12 on larger screens */}
          <div className="md:col-span-5 text-center md:text-left">
            <motion.div 
              className="space-y-4 md:space-y-6"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Expert Web Development</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Fast, responsive, and SEO-optimized websites</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">AI Integration</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Innovative solutions with artificial intelligence</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                    <BarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Digital Marketing</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Growth strategies that deliver results</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Global Market Reach</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Expand your business internationally</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                    <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Full-Stack Solutions</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Complete end-to-end development services</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
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
              </div>
              
              <div className="space-y-3 pt-4 hidden lg:block">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  TRUSTED BY BUSINESSES WORLDWIDE
                </p>
                <div className="flex flex-wrap gap-8">
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
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Center Column - Profile Image */}
          <motion.div 
            className="lg:col-span-2 relative"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative max-w-[300px] sm:max-w-[380px] md:max-w-[480px] mx-auto ml-0 mr-auto pl-0 pr-4 md:pr-8">
              {/* Enhanced glow behind image - shifted to match new image position - responsive sizing */}
              <div className="absolute -top-8 md:-top-12 -bottom-8 md:-bottom-12 -left-16 md:-left-24 -right-0 rounded-full z-0" 
                style={{ transform: "translateX(-20px) md:translateX(-40px)" }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-[25%] bg-gradient-to-br from-indigo-500/20 via-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "300ms" }}></div>
              </div>
              
              {/* Profile Image - responsive sizing for mobile */}
              <motion.img 
                src={samuelImage}
                alt="Samuel Marndi" 
                className="w-[140%] sm:w-[160%] md:w-[180%] h-auto object-contain relative z-10 max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] -ml-[40px] sm:-ml-[50px] md:-ml-[60px] lg:-ml-[70px]"
                style={{ 
                  transform: "translateY(-10px) translateX(-15%)",
                }}
                initial={{ scale: 0.95 }}
                animate={{ 
                  scale: [0.98, 1.06, 0.98],
                  y: [-8, 8, -8]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
          
          {/* Right Column - Quick Quote Form */}
          <motion.div 
            className="lg:col-span-5"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Background Animation */}
              <div className="absolute inset-0 overflow-hidden z-0">
                {/* Animated gradients */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
              </div>
              
              {/* Quick Quote Form */}
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
          </motion.div>
        </motion.div>
        
        {/* Tech stack section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Working with cutting-edge technologies</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {techIcons.slice(0, 12).map((tech, i) => (
              <motion.div 
                key={i}
                className="relative group"
                whileHover={{ y: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  className="h-8 w-8 md:h-10 md:w-10 object-contain"
                />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;