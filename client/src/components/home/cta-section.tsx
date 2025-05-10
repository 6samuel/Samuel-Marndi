import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

const CtaSection = () => {
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

  const benefits = [
    "Customized solutions tailored to your business",
    "Responsive design that works on all devices",
    "SEO optimization for better visibility",
    "Ongoing support and maintenance",
    "Clear communication throughout the process",
    "Fast turnaround times"
  ];

  return (
    <section className="py-20 bg-primary/5 dark:bg-primary/10">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <OptimizedImage 
                src="/images/samuel-marndi-profile.jpg" 
                alt="Samuel Marndi - Professional Web Developer" 
                className="w-full h-full object-cover"
                priority={true}
              />
              <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
            </motion.div>
            
            {/* Content Side */}
            <motion.div 
              className="p-8 md:p-12 flex flex-col justify-center"
              variants={itemVariants}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Ready to Transform Your Digital Presence?
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Let's discuss how I can help your business achieve its goals with a custom digital solution. 
                Get in touch for a free consultation and quote.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-2"
                    variants={itemVariants}
                  >
                    <CheckCircle className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get a Free Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  No obligations. I'll respond within 24 hours.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
