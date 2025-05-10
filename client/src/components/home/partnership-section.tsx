import React from 'react';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  BarChart3, 
  Building2, 
  Globe, 
  Share2, 
  Rocket, 
  PieChart, 
  Users, 
  Trophy, 
  ArrowRight, 
  BadgeDollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

// Partner type card component
const PartnerTypeCard = ({ 
  title, 
  description, 
  icon: Icon,
  benefits,
  gradient,
  delay = 0
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  benefits: string[];
  gradient: string;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className={`h-2 ${gradient}`}></div>
    <div className="p-6 bg-white dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <div className={`p-3 rounded-lg ${gradient} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="ml-3 text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      <div className="space-y-2 mb-6">
        {benefits.map((benefit, i) => (
          <div key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <div className="flex-shrink-0 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            </div>
            <span className="ml-2">{benefit}</span>
          </div>
        ))}
      </div>
      <div className="pt-4 mt-auto">
        <Button variant="outline" size="sm" asChild className="w-full justify-center">
          <Link to="/partners">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

// Statistics card
const StatCard = ({ 
  value, 
  label, 
  icon: Icon,
  delay = 0
}: { 
  value: string; 
  label: string; 
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center"
  >
    <div className="bg-primary/10 p-3 rounded-full">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div className="ml-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  </motion.div>
);

const PartnershipSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-40 right-0 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Strategic Partnerships for Growth
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join forces with me to unlock new revenue streams and expand your business reach. 
              Together, we can create win-win opportunities that drive growth for both of us.
            </p>
          </motion.div>
        </div>

        {/* Hero CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-primary/10 to-indigo-600/10 dark:from-primary/20 dark:to-indigo-600/20 p-8 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Why Partner With Me?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Every business aspires to expand their reach and increase revenue. Through strategic partnerships, 
                we can leverage each other's strengths to achieve remarkable growth. 
                My expertise in digital marketing and web development can be the catalyst your business needs.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm flex items-center">
                  <BadgeDollarSign className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Commission-Based</span>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm flex items-center">
                  <Handshake className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium">No Upfront Costs</span>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm flex items-center">
                  <Share2 className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium">Mutual Growth</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Button size="lg" asChild className="px-8 py-6 h-auto text-base font-semibold shadow-lg">
                <Link to="/partners#apply">
                  Become a Partner
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Partner types grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <PartnerTypeCard 
            title="Service Integration"
            description="Partner your services to integrate with my clients' websites and systems."
            icon={Globe}
            benefits={[
              "Earn commissions through service integrations",
              "Access to a diverse client base",
              "Tailored integration solutions",
              "Ongoing technical support"
            ]}
            gradient="bg-gradient-to-r from-blue-400 to-blue-600"
            delay={0.1}
          />
          
          <PartnerTypeCard 
            title="IT Company Collaboration"
            description="Team up to handle large-scale projects that require extensive resources."
            icon={Building2}
            benefits={[
              "Receive high-value client referrals",
              "Commission-based partnership",
              "No upfront investment required",
              "Expert project handovers and guidance"
            ]}
            gradient="bg-gradient-to-r from-purple-400 to-purple-600"
            delay={0.2}
          />
          
          <PartnerTypeCard 
            title="Product Promotion"
            description="Let me promote your software, apps, or digital products to my audience."
            icon={Rocket}
            benefits={[
              "Targeted marketing campaigns",
              "Performance-based commission structure",
              "Comprehensive marketing strategy",
              "Regular performance reports"
            ]}
            gradient="bg-gradient-to-r from-green-400 to-green-600"
            delay={0.3}
          />
        </div>

        {/* Stats section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-center mb-8">Partnership Success Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              value="30%+"
              label="Average Revenue Increase"
              icon={BarChart3}
              delay={0.1}
            />
            <StatCard 
              value="12+"
              label="Active Partnerships"
              icon={Handshake}
              delay={0.2}
            />
            <StatCard 
              value="40K+"
              label="Combined Audience Reach"
              icon={Users}
              delay={0.3}
            />
            <StatCard 
              value="100%"
              label="Growth-Focused"
              icon={Trophy}
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-6">
            "The most successful businesses aren't built alone. They're built through strategic partnerships 
            that multiply reach, expertise, and opportunities. Take the first step towards exponential growth today."
          </p>
          <div className="font-semibold">- Samuel Marndi</div>
          
          <div className="mt-8">
            <Button asChild>
              <Link to="/partners">
                Explore Partnership Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default PartnershipSection;