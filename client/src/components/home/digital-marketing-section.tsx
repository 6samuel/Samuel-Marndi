import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Search, Share2, MousePointerClick, Target, Users, AreaChart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import QuickQuoteModal from "@/components/forms/quick-quote-modal";

// Marketing stat card component
const MarketingStatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string; 
  description: string;
  color: string;
}) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl transition-shadow"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-1">{value}</h3>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
    <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
  </motion.div>
);

// Marketing service card component
const MarketingServiceCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

// Strategy point component
const StrategyPoint = ({ text }: { text: string }) => (
  <div className="flex items-start space-x-2">
    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-gray-700 dark:text-gray-300">{text}</span>
  </div>
);

const DigitalMarketingSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section className="py-16 px-4 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Transform Your Online Presence With Digital Marketing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            In today's digital world, effective online marketing is the difference between business growth and stagnation. I help businesses just like yours thrive in the digital landscape.
          </p>
        </motion.div>

        {/* Digital marketing stats */}
        <motion.div 
          className="grid md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <MarketingStatCard 
              icon={BarChart3} 
              title="Return on Investment" 
              value="1,400%"
              description="Average ROI for companies using strategic SEO"
              color="bg-gradient-to-br from-blue-500 to-blue-700"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <MarketingStatCard 
              icon={MousePointerClick} 
              title="Click-Through Rate" 
              value="22x"
              description="Higher CTR for businesses in top 3 search positions"
              color="bg-gradient-to-br from-green-500 to-green-700"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <MarketingStatCard 
              icon={Users} 
              title="Customer Engagement" 
              value="6x"
              description="Increase in engagement from targeted campaigns"
              color="bg-gradient-to-br from-purple-500 to-purple-700"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <MarketingStatCard 
              icon={AreaChart} 
              title="Revenue Growth" 
              value="140%"
              description="Average annual growth for SMBs with integrated marketing"
              color="bg-gradient-to-br from-orange-500 to-orange-700"
            />
          </motion.div>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Why Every Business Needs Digital Marketing in 2025</h3>
            
            <div className="space-y-4 mb-6">
              <StrategyPoint text="94% of first impressions are design and digital marketing related" />
              <StrategyPoint text="70-80% of consumers research businesses online before visiting or purchasing" />
              <StrategyPoint text="Businesses using marketing automation see 53% higher conversion rates" />
              <StrategyPoint text="Companies that blog regularly generate 67% more leads than those that don't" />
              <StrategyPoint text="Email marketing has an average ROI of 4,400% - the highest of any channel" />
              <StrategyPoint text="Social media users have grown to 4.95 billion worldwide in 2025" />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-indigo-100 dark:border-indigo-900">
              <h4 className="font-semibold text-lg mb-2">You're Losing Customers Right Now If:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  Your competitors appear above you in search results
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  Your website isn't optimized for mobile devices
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  You don't have a consistent social media presence
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  You're not leveraging email marketing for customer retention
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  You lack a content strategy that builds authority in your industry
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-indigo-600 p-5 text-white">
                <h3 className="text-xl font-bold">Proven Digital Marketing Strategies</h3>
                <p className="text-white/80 text-sm mt-1">Used by Fortune 500 companies and successful startups alike</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                    <h4 className="font-semibold">Search Engine Optimization</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">Rank higher on Google and capture targeted traffic already looking for what you offer</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-500 mr-2" />
                    <h4 className="font-semibold">Conversion-Focused Web Design</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">Turn visitors into customers with strategic design that guides users to action</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Share2 className="w-5 h-5 text-purple-500 mr-2" />
                    <h4 className="font-semibold">Social Media Marketing</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">Build community, increase brand awareness, and drive engagement on the platforms your customers use daily</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <AreaChart className="w-5 h-5 text-orange-500 mr-2" />
                    <h4 className="font-semibold">Analytics & Performance Tracking</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">Make data-driven decisions with comprehensive reporting and actionable insights</p>
                </div>
                
                <div className="pt-3">
                  <Button className="w-full" asChild>
                    <Link to="/services/digital-marketing">
                      Explore All Marketing Services <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services grid */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Digital Marketing Services to Power Your Growth</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <MarketingServiceCard 
              icon={Search} 
              title="Search Engine Optimization" 
              description="Climb the Google rankings and capture valuable organic traffic with data-driven SEO strategies tailored to your industry."
            />
            
            <MarketingServiceCard 
              icon={MousePointerClick} 
              title="Pay-Per-Click Advertising" 
              description="Generate immediate traffic and leads with strategically managed PPC campaigns that maximize your ROI."
            />
            
            <MarketingServiceCard 
              icon={Share2} 
              title="Social Media Marketing" 
              description="Build brand awareness, engage with your audience, and drive conversions through strategic social media campaigns."
            />
            
            <MarketingServiceCard 
              icon={Users} 
              title="Content Marketing" 
              description="Establish authority in your industry with high-quality, strategic content that attracts and converts your ideal customers."
            />
            
            <MarketingServiceCard 
              icon={AreaChart} 
              title="Analytics & Reporting" 
              description="Make data-driven decisions with comprehensive analytics and clear reporting that shows exactly what's working."
            />
            
            <MarketingServiceCard 
              icon={Target} 
              title="Conversion Rate Optimization" 
              description="Turn more visitors into customers by optimizing every element of your digital presence for maximum conversions."
            />
          </div>
        </motion.div>

        {/* Website Transformation Showcase */}
        <motion.div 
          className="mb-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Transform Your Website Like This One
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-2">
              Just like this website, I can rebuild or optimize your existing site to generate more leads, 
              increase conversions, and ultimately grow your profits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Target className="w-5 h-5 text-primary mr-2" />
                Results-Focused Redesign
              </h4>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Conversion optimization</span> - Strategic placement of CTAs and lead capture forms
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">SEO-friendly architecture</span> - Rank higher on Google and capture more organic traffic
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Persuasive copywriting</span> - Compelling messaging that drives action
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Mobile optimization</span> - Perfect experience on all devices
                  </span>
                </li>
              </ul>
              
              <div className="mt-6">
                <Button asChild>
                  <Link to="/portfolio">
                    See Website Transformations <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-primary mr-2" />
                Real Business Impact
              </h4>
              
              <div className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Conversion Rate</span>
                    <span className="text-green-500 font-bold">+157%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Organic Traffic</span>
                    <span className="text-green-500 font-bold">+94%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Lead Quality</span>
                    <span className="text-green-500 font-bold">+112%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/services/web-development">
                    Learn About Web Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business With Digital Marketing?</h3>
              <p className="text-white/80 mb-6">
                Let's discuss how a tailored digital marketing strategy can help you reach your business goals. The consultation is completely free, and there's no obligation.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <Button asChild variant="secondary" className="bg-white hover:bg-gray-100 text-primary">
                  <Link to="/contact">
                    Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <QuickQuoteModal 
                  triggerText="Get a Quote"
                  icon={true}
                  iconPosition="right"
                  iconComponent={<ArrowRight className="ml-2 h-4 w-4" />}
                  buttonVariant="default"
                  selectedService="digital-marketing"
                  triggerClassName="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                />
              </div>
              
              <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm mb-4">
                <p className="font-medium text-white">
                  <span className="font-bold text-yellow-300">Limited Time Offer:</span> Get a comprehensive digital marketing audit + strategy session for just $99 (Reg. $299) - No commitment required.
                </p>
                <Button asChild variant="default" className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Link to="/contact?offer=digital-marketing-audit">
                    Claim This Offer Now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-bold text-lg mb-4">What You Get From a Consultation:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Free website and digital presence audit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Competitor analysis and market opportunity assessment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom strategy recommendations based on your goals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Clear pricing and expected ROI projections</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Actionable tips you can implement immediately</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalMarketingSection;