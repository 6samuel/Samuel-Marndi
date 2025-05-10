import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PhoneCall, FileText, ArrowRight, MessageSquare, ThumbsUp, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  PayPalIcon, 
  StripeIcon, 
  GooglePayIcon, 
  RazorpayIcon, 
  UPIIcon, 
  PhonePeIcon,
  GooglePayUPIIcon,
  ApplePayIcon, 
  WireTransferIcon, 
  PayoneerIcon,
  WiseIcon,
  MasterCardIcon,
  VisaIcon
} from '@/components/icons/payment-icons';

// Budget range card component
const BudgetRangeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradientColors,
  priceRange,
  ctaLink,
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  gradientColors: string;
  priceRange: string;
  ctaLink: string;
}) => (
  <motion.div 
    className={`rounded-xl p-0.5 ${gradientColors}`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="h-full bg-white dark:bg-gray-900 rounded-lg p-6 flex flex-col">
      <div className="mb-4 p-3 rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-primary/10 text-primary font-medium text-sm rounded-full px-3 py-1 mb-3 inline-block">
        {priceRange}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4">{description}</p>
      <Button asChild size="sm" variant="outline" className="mt-auto">
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
              gradientColors="bg-gradient-to-r from-purple-300 to-purple-500"
              priceRange="₹1 Lakh+ / $1,000+"
              ctaLink="/contact"
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-5">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="font-medium">Flexible Payment Options</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Multiple payment methods accepted including all major cards, PayPal, bank transfers, UPI, and more.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="font-medium">EMI Available</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Break down your payments into affordable monthly installments to manage cash flow better.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="font-medium">Negotiable Pricing</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Not satisfied with the initial quote? Let's discuss and find middle ground together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Payment methods section */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-center mb-6">Accepted Payment Methods</h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Choose the payment option that works best for you. All payment methods are secure and flexible with EMI options available.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Row 1 - Credit/Debit Cards */}
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <VisaIcon />
              </div>
              <span className="text-sm">Visa</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <MasterCardIcon />
              </div>
              <span className="text-sm">MasterCard</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              </div>
              <span className="text-sm">Other Cards</span>
            </div>
            
            {/* Row 2 - Digital Payment */}
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <PayPalIcon />
              </div>
              <span className="text-sm">PayPal</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <StripeIcon />
              </div>
              <span className="text-sm">Stripe</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <GooglePayIcon />
              </div>
              <span className="text-sm">Google Pay</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <ApplePayIcon />
              </div>
              <span className="text-sm">Apple Pay</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <RazorpayIcon />
              </div>
              <span className="text-sm">Razorpay</span>
            </div>
            
            {/* Row 3 - UPI & Transfer */}
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <UPIIcon />
              </div>
              <span className="text-sm">UPI</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <PhonePeIcon />
              </div>
              <span className="text-sm">PhonePe</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <GooglePayUPIIcon />
              </div>
              <span className="text-sm">GPay (UPI)</span>
            </div>
            
            {/* Row 4 - International Transfers */}
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <WireTransferIcon />
              </div>
              <span className="text-sm">Bank Transfer</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <PayoneerIcon />
              </div>
              <span className="text-sm">Payoneer</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-2">
                <WiseIcon />
              </div>
              <span className="text-sm">Wise</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-primary">EMI options available</span> for eligible projects through various payment processors.
            </p>
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