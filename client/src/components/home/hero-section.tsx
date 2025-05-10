import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, BarChart2, BrainCircuit, Globe, Database } from "lucide-react";
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
  { name: "AWS", color: "#232F3E", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
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
        
        {/* Distributed tech stacks floating throughout the hero section */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {techIcons.map((tech, i) => {
            // Create various positions across the entire hero section
            const positionStyles = [
              { top: `${5 + (i % 20) * 5}%`, left: `${3 + (i % 15) * 6}%` },                // Top left zone
              { top: `${10 + (i % 15) * 6}%`, right: `${5 + (i % 18) * 5}%` },               // Top right zone
              { bottom: `${10 + (i % 12) * 7}%`, left: `${8 + (i % 10) * 9}%` },             // Bottom left zone
              { bottom: `${5 + (i % 17) * 5}%`, right: `${3 + (i % 12) * 8}%` },             // Bottom right zone
              { top: `${30 + (i % 40)}%`, left: `${45 + (i % 10)}%` },                       // Center zone
              { top: `${i % 85}%`, left: `${(i * 17) % 85}%` },                              // Random zone
              { top: `${20 + (i * 13) % 60}%`, right: `${(i * 11) % 30 + 10}%` },            // Mid-right zone
              { bottom: `${10 + (i * 7) % 30}%`, left: `${30 + (i * 19) % 40}%` }            // Mid-bottom zone
            ];
            
            // Select position based on index to spread icons throughout
            const positionIndex = i % positionStyles.length;
            const position = positionStyles[positionIndex];
            
            // Size variations
            const size = 8 + (i % 4) * 4; // 8px to 20px
            
            // Animation speed variations
            const durationBase = 25 + (i % 5) * 10; // 25s to 65s
            
            // Different animation paths
            const paths = [
              // Circular path
              {
                x: `${Math.sin((i % 6) * 60) * 15}%`,
                y: `${Math.cos((i % 6) * 60) * 15}%`,
                rotate: 360
              },
              // Zigzag path
              {
                x: [`-10%`, `10%`, `-5%`, `15%`, `0%`],
                y: [`10%`, `-10%`, `15%`, `-5%`, `0%`],
                rotate: [0, 45, -45, 90, 0]
              },
              // Bouncy path
              {
                y: [`-15%`, `15%`],
                x: [`-10%`, `10%`],
                scale: [0.8, 1.2, 0.9]
              },
              // Spiral path
              {
                x: [0, '10%', '5%', '-10%', '-5%', 0],
                y: [0, '5%', '15%', '10%', '-10%', 0],
                scale: [1, 1.1, 0.9, 1.2, 0.8, 1]
              }
            ];
            
            const pathIndex = i % paths.length;
            const animationPath = paths[pathIndex];
            
            // Staggered delays
            const delay = (i % 10) * 0.5;
            
            return (
              <motion.div
                key={i}
                className="absolute will-change-transform"
                initial={{ 
                  opacity: 0.7,
                  scale: 0.8,
                }}
                animate={{ 
                  ...animationPath,
                  opacity: [0.4, 0.8, 0.6, 0.9, 0.7],
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
                  className={`w-${size} h-${size} object-contain filter drop-shadow-md`}
                  style={{ width: `${size}px`, height: `${size}px` }}
                  title={tech.name}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Enhanced animated code particles - more distributed and varied */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20">
          {Array.from({ length: 35 }).map((_, i) => {
            // More code symbols with programming concepts
            const codeSymbols = [
              '{ }', '[ ]', '( )', '//', '/*', '*/', '=>', '&&', '||', '++', '--', 
              '!=', '==', '===', '<>', '</>', '</>', '.map()', '.filter()', 
              'await', 'async', 'function', 'const', 'let', 'var', 'for()', 
              'if()', 'import', 'export', '<div>', 'useState', 'return', 'class', 
              '@media', '#root', '::before', ':hover'
            ];
            
            // Varied starting positions
            const posX = 5 + (i * 13) % 90; // 5% to 95% width
            const posY = (i * 17) % 100;    // 0% to 100% height
            
            // Different animation speeds 
            const speed = 15 + (i % 20);
            
            // Different sizes
            const fontSize = 10 + (i % 6) * 2; // 10px to 20px
            
            // Direction and path variations
            const directions = [
              // Vertical falling (most common)
              { 
                y: ['-20%', '120%'],
                x: [`${posX}%`, `${posX + (Math.random() > 0.5 ? 5 : -5)}%`]
              },
              // Diagonal falling right
              { 
                y: ['-20%', '120%'],
                x: [`${posX}%`, `${Math.min(posX + 20, 95)}%`]
              },
              // Diagonal falling left
              { 
                y: ['-20%', '120%'],
                x: [`${posX}%`, `${Math.max(posX - 20, 5)}%`]
              },
              // Horizontal float
              { 
                x: ['0%', '100%'],
                y: [`${posY}%`, `${posY + (Math.random() > 0.5 ? 5 : -5)}%`]
              }
            ];
            
            const pathIndex = i % directions.length;
            const animationPath = directions[pathIndex];
            
            return (
              <motion.div
                key={i}
                className="absolute text-xs font-mono font-bold"
                initial={{ 
                  x: `${posX}%`,
                  y: pathIndex === 3 ? `${posY}%` : '-20%',
                  opacity: 0.3 + (i % 5) * 0.1,
                  rotate: (i % 3 - 1) * 5 // -5, 0, or 5 degrees
                }}
                animate={animationPath}
                transition={{
                  duration: speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (i % 10) * 1.5
                }}
                style={{
                  color: ['#3b82f6', '#10b981', '#f97316', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444'][i % 7],
                  fontSize: `${fontSize}px`,
                  textShadow: '0 0 3px rgba(0,0,0,0.1)'
                }}
              >
                {codeSymbols[i % codeSymbols.length]}
              </motion.div>
            );
          })}
        </div>
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Value Proposition */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div 
              className="space-y-6"
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
            <div className="relative max-w-[280px] mx-auto">
              {/* Enhanced glow behind image */}
              <div className="absolute -top-8 -bottom-8 -left-8 -right-8 rounded-full z-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-[25%] bg-gradient-to-br from-indigo-500/20 via-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "300ms" }}></div>
              </div>
              
              {/* Profile Image - using the requested image */}
              <motion.img 
                src="/samuel-transparent.png"
                alt="Samuel Marndi" 
                className="w-full h-auto object-contain relative z-10"
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: [0.95, 1.05, 0.95],
                  y: [-5, 5, -5]
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