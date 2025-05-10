import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PhoneCall, FileText, ArrowRight, MessageSquare, ThumbsUp, Shield, CreditCard, CreditCard as CardIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

// Budget range card component
const BudgetRangeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradientColors,
  priceRange,
  ctaLink,
  isPremium = false
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  gradientColors: string;
  priceRange: string;
  ctaLink: string;
  isPremium?: boolean;
}) => (
  <motion.div 
    className={`rounded-xl ${isPremium ? "p-[3px]" : "p-0.5"} ${gradientColors} ${isPremium ? "relative" : ""}`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {isPremium && (
      <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black font-bold text-xs rounded-full px-3 py-1 shadow-lg">
        PREMIUM
      </div>
    )}
    <div className={`h-full bg-white dark:bg-gray-900 rounded-lg p-6 flex flex-col ${isPremium ? "shadow-xl dark:shadow-purple-900/30" : "shadow-md"}`}>
      <div className={`mb-4 p-3 rounded-full w-12 h-12 flex items-center justify-center ${isPremium ? "bg-gradient-to-br from-purple-400 to-purple-600" : "bg-gray-100 dark:bg-gray-800"}`}>
        <Icon className={`w-6 h-6 ${isPremium ? "text-white" : "text-primary"}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isPremium ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600" : ""}`}>{title}</h3>
      <div className={`${isPremium ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white" : "bg-primary/10 text-primary"} font-medium text-sm rounded-full px-3 py-1 mb-3 inline-block`}>
        {priceRange}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4">{description}</p>
      <Button asChild size="sm" variant={isPremium ? "default" : "outline"} className={`mt-auto ${isPremium ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600" : ""}`}>
        <Link to={ctaLink}>
          Get Quote <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </div>
  </motion.div>
);

// Feature item component
const FeatureItem = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center space-x-2">
    <div className="flex-shrink-0 p-1.5 rounded-full bg-primary/10">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm">{title}</span>
  </div>
);

const BudgetReassuranceSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            No Budget Is Too Small
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your project deserves quality work regardless of its size or budget. I'm dedicated to making professional digital solutions accessible to everyone.
          </p>
        </motion.div>

        {/* Budget ranges */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <BudgetRangeCard 
              title="Starter Projects" 
              description="Have a limited budget? No problem. I offer streamlined solutions that focus on core functionality without compromising quality or reliability."
              icon={DollarSign}
              gradientColors="bg-gradient-to-r from-green-300 to-green-500"
              priceRange="Starting at ₹5,999 / $99"
              ctaLink="/contact"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <BudgetRangeCard 
              title="Mid-Range Solutions" 
              description="Balance between affordability and extended features. Perfect for growing businesses with moderate budgets seeking competitive advantages."
              icon={FileText}
              gradientColors="bg-gradient-to-r from-blue-300 to-blue-500"
              priceRange="₹50,000+ / $600+"
              ctaLink="/contact"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <BudgetRangeCard 
              title="Premium Development" 
              description="Full-featured, high-performance solutions with advanced customization for established businesses with comprehensive requirements."
              icon={Shield}
              gradientColors="bg-gradient-to-r from-purple-300 to-purple-600"
              priceRange="₹1 Lakh+ / $1,000+"
              ctaLink="/contact"
              isPremium={true}
            />
          </motion.div>
        </motion.div>
        
        {/* Central callout */}
        <motion.div 
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-12 relative shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Let's Discuss Your Vision</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Not sure about costs? Consultation is completely <span className="font-medium text-primary">free</span> and comes with no obligations. I'll work with you to find a solution that fits your specific needs and budget.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-3">
                <FeatureItem icon={ThumbsUp} title="Free consultation" />
                <FeatureItem icon={MessageSquare} title="No pressure discussion" />
                <FeatureItem icon={FileText} title="Customized quotes" />
                <FeatureItem icon={ArrowRight} title="Flexible EMI options" />
              </div>
              
              <div className="pt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/contact">
                    Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="tel:+918280320550" className="flex items-center">
                    <PhoneCall className="mr-2 h-4 w-4" /> Call Directly
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-500/20 mix-blend-overlay"></div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="space-y-5">
                  <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
                    <div className="font-medium flex items-center gap-2">
                      <CardIcon className="h-4 w-4 text-primary" />
                      Flexible Payment Options
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Multiple payment methods accepted including all major cards, PayPal, bank transfers, UPI, and more.
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-5 shadow-lg bg-gradient-to-r from-primary/5 to-indigo-500/5 dark:from-primary/20 dark:to-indigo-500/20">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">EMI Available</span>
                    </div>
                    <p className="text-sm mt-2 font-medium">
                      With minimal upfront cost, break down your payments into affordable monthly installments to manage cash flow better.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg mt-3 p-2 text-xs shadow-sm">
                      <span className="font-semibold">Available through:</span> Credit cards, Razorpay, and other payment processors
                    </div>
                  </div>
                  
                  <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
                    <div className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Negotiable Pricing
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Not satisfied with the initial quote? Let's discuss and find middle ground together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* EMI Highlight Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/5 to-indigo-500/5 dark:from-primary/10 dark:to-indigo-500/10 rounded-xl p-6 mb-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
              <Calendar className="w-10 h-10 mb-3 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                EMI Options Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Break down your project costs into affordable monthly installments to manage your cash flow better.
              </p>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1">
                  <CardIcon className="w-3.5 h-3.5" /> Credit Cards
                </span>
                <span className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1">
                  <DollarSign className="w-3.5 h-3.5" /> Payment Platforms
                </span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <h4 className="font-medium text-lg">Pay conveniently with all major payment methods:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Credit/Debit Cards (Visa, MasterCard, and more)
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Digital Wallets (PayPal, Stripe, Google Pay, Apple Pay)
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  UPI Payments (PhonePe, Google Pay, and others)
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  International Transfers (Bank Transfer, Wise, Payoneer)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom testimonial-style quote */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            "Quality work shouldn't be limited by budget constraints. My mission is to make professional digital solutions accessible to businesses of all sizes, with payment options that work for you."
          </blockquote>
          <div className="mt-4 font-medium">— Samuel Marndi</div>
        </motion.div>
      </div>
    </section>
  );
};

export default BudgetReassuranceSection;