import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Search, Share2, MousePointerClick, Target, Users, AreaChart, ArrowRight, 
  CheckCircle2, Globe, Laptop, LineChart, PieChart, Smartphone, Zap, MessageCircle, TrendingUp as ChartLineUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/lib/seo-utils';
import { trackConversion } from '@/components/tracking/tracking-scripts';

// Case study card component
const CaseStudyCard = ({ 
  title, 
  industry, 
  stats, 
  description, 
  index 
}: { 
  title: string; 
  industry: string; 
  stats: { label: string; value: string; increase: string }[];
  description: string;
  index: number;
}) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className={`h-2 ${index % 3 === 0 ? 'bg-primary' : index % 3 === 1 ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
    <div className="p-6">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{industry}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            <div className="text-xs text-green-500 font-medium">↑ {stat.increase}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </motion.div>
);

// Marketing stat component
const MarketingStat = ({ 
  value, 
  label, 
  desc, 
  icon: Icon,
  color,
  delay 
}: { 
  value: string; 
  label: string; 
  desc: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  >
    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{label}</div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </motion.div>
);

// Service card component
const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description,
  benefits,
  delay
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  benefits: string[];
  delay: number;
}) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-full flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <div className="space-y-2 mt-auto">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-start">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// Research highlight component
const ResearchHighlight = ({
  source,
  title,
  description,
  stat,
  index
}: {
  source: string;
  title: string;
  description: string;
  stat: string;
  index: number;
}) => (
  <motion.div 
    className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md h-full"
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="absolute top-0 right-0 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-medium rounded-bl-lg rounded-tr-lg px-3 py-1">
      {source}
    </div>
    <h4 className="text-lg font-bold mt-4 mb-2">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
    <div className="text-2xl font-bold text-primary">{stat}</div>
  </motion.div>
);

// Chart visualization component (simple visual representation of a chart)
const ChartVisualization = ({ type, color }: { type: 'bar' | 'line' | 'pie'; color: string }) => {
  if (type === 'bar') {
    return (
      <div className="flex items-end h-16 gap-1 justify-around">
        {[65, 40, 85, 55, 70, 90, 75].map((height, i) => (
          <div 
            key={i} 
            className={`${color} rounded-t-sm w-3`} 
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    );
  } else if (type === 'line') {
    return (
      <svg className="w-full h-16" viewBox="0 0 100 40">
        <path
          d="M0,35 C10,30 20,10 30,15 C40,20 50,5 60,10 C70,15 80,25 90,5 L90,40 L0,40 Z"
          className={`${color} opacity-20`}
          fill="currentColor"
        />
        <path
          d="M0,35 C10,30 20,10 30,15 C40,20 50,5 60,10 C70,15 80,25 90,5"
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else {
    return (
      <div className="relative h-16 w-16 mx-auto">
        <div className={`absolute inset-0 rounded-full ${color} opacity-20`}></div>
        <div 
          className={`absolute rounded-full ${color}`} 
          style={{ 
            top: '25%', 
            right: '25%', 
            bottom: '25%', 
            left: '25%' 
          }}
        ></div>
        <div 
          className={`absolute rounded-tl-full ${color}`} 
          style={{ 
            top: 0,
            left: 0,
            width: '50%',
            height: '50%'
          }}
        ></div>
        <div 
          className={`absolute rounded-br-full ${color}`} 
          style={{ 
            bottom: 0,
            right: 0,
            width: '50%',
            height: '50%'
          }}
        ></div>
      </div>
    );
  }
};

const DigitalMarketingPage = () => {
  // Track page view
  useEffect(() => {
    trackConversion('page_view', 'USD');
  }, []);

  return (
    <>
      <SEO 
        title="Digital Marketing Services | Samuel Marndi"
        description="Grow your business with proven digital marketing strategies. SEO, content marketing, social media, PPC, and more to drive traffic and conversions."
        keywords="digital marketing, SEO, PPC, content marketing, social media marketing, conversion optimization"
        ogImage="/og-digital-marketing.jpg"
        ogType="website"
        canonical="/services/digital-marketing"
      />

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Data-Driven Digital Marketing
              <br />
              <span className="text-gray-800 dark:text-white">That Actually Works</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Stop wasting money on ineffective marketing. Get strategies backed by research, 
              driven by data, and proven to generate real business results.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" asChild>
                <Link to="/contact">
                  Get Your Free Strategy Session <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <a href="#case-studies">
                  See Real Results
                </a>
              </Button>
            </motion.div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <MarketingStat 
              icon={LineChart}
              color="bg-gradient-to-br from-primary to-blue-700"
              value="3,700%"
              label="Average ROI"
              desc="Average return on investment for businesses using our comprehensive digital marketing strategies"
              delay={0.2}
            />
            
            <MarketingStat 
              icon={Users}
              color="bg-gradient-to-br from-indigo-500 to-indigo-700"
              value="187%"
              label="Traffic Increase"
              desc="Average increase in qualified website traffic within the first 6 months of implementation"
              delay={0.3}
            />
            
            <MarketingStat 
              icon={ChartLineUp}
              color="bg-gradient-to-br from-green-500 to-green-700"
              value="143%"
              label="Conversion Growth"
              desc="Average improvement in conversion rates through optimization and targeted audience strategies"
              delay={0.4}
            />
            
            <MarketingStat 
              icon={TrendingUp}
              color="bg-gradient-to-br from-orange-500 to-orange-700"
              value="68%"
              label="Lead Quality"
              desc="Improvement in lead quality, resulting in higher closing rates and customer lifetime value"
              delay={0.5}
            />
          </div>
        </div>
      </section>
      
      {/* What Your Business Is Missing */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Most Businesses Are <span className="text-primary">Missing</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              In today's digital landscape, these critical factors separate thriving businesses from struggling ones.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Search className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Search Engine Visibility</h3>
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                <strong>Alarming Fact:</strong> 91% of web pages get zero traffic from Google, leaving billions in potential revenue untapped.
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Without strategic SEO, your business is essentially invisible to thousands of potential customers actively searching for your products or services.
              </p>
              <ChartVisualization type="bar" color="text-primary" />
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MousePointerClick className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Conversion Optimization</h3>
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                <strong>Alarming Fact:</strong> The average website conversion rate is just 2.35%, while top performers achieve 11%+ with strategic optimization.
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Most businesses focus solely on traffic, neglecting the science of turning visitors into customers through data-driven design and messaging.
              </p>
              <ChartVisualization type="line" color="text-indigo-500" />
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Target className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Strategic Multi-Channel Approach</h3>
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                <strong>Alarming Fact:</strong> Businesses with integrated multi-channel strategies retain 89% more customers than those with single-channel approaches.
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Relying on a single marketing channel exposes your business to volatile platform changes and misses crucial touchpoints in the customer journey.
              </p>
              <ChartVisualization type="pie" color="text-green-500" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Digital Marketing Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Each service is meticulously crafted to work independently or as part of an integrated strategy.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Search}
              title="Search Engine Optimization (SEO)"
              description="Climb to the top of Google rankings and capture valuable organic traffic with data-driven strategies."
              benefits={[
                "Technical SEO audits and optimization",
                "Keyword research and content strategy",
                "Link building and authority development",
                "Local SEO for regional businesses"
              ]}
              delay={0.1}
            />
            
            <ServiceCard 
              icon={Zap}
              title="Pay-Per-Click (PPC) Advertising"
              description="Generate immediate, targeted traffic with meticulously managed ads that maximize ROI."
              benefits={[
                "Strategic campaign structure and targeting",
                "A/B testing of ad creative and landing pages",
                "Budget optimization and bid management",
                "Conversion tracking and attribution"
              ]}
              delay={0.2}
            />
            
            <ServiceCard 
              icon={Laptop}
              title="Content Marketing & Creation"
              description="Establish authority and attract your ideal customers with high-value content that converts."
              benefits={[
                "Content strategy aligned with business goals",
                "SEO-optimized blog posts and articles",
                "Lead magnets and downloadable resources",
                "Content performance tracking and optimization"
              ]}
              delay={0.3}
            />
            
            <ServiceCard 
              icon={Share2}
              title="Social Media Marketing"
              description="Build community, increase brand awareness, and drive engagement that converts followers to customers."
              benefits={[
                "Platform-specific content strategies",
                "Community management and engagement",
                "Paid social media advertising campaigns",
                "Social listening and reputation management"
              ]}
              delay={0.4}
            />
            
            <ServiceCard 
              icon={Target}
              title="Conversion Rate Optimization"
              description="Turn more visitors into leads and customers with scientific testing and optimization."
              benefits={[
                "User experience audits and heatmap analysis",
                "A/B and multivariate testing",
                "Sales funnel optimization",
                "Psychological trigger implementation"
              ]}
              delay={0.5}
            />
            
            <ServiceCard 
              icon={AreaChart}
              title="Analytics & Reporting"
              description="Make data-driven decisions with comprehensive tracking and actionable insights."
              benefits={[
                "Custom dashboard creation for KPIs",
                "Google Analytics setup and optimization",
                "Conversion tracking implementation",
                "Monthly performance reports and strategy adjustments"
              ]}
              delay={0.6}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Discuss Your Marketing Needs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Case Studies */}
      <section id="case-studies" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results for Real Businesses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Don't just take my word for it. See how these businesses transformed their online presence and revenue.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CaseStudyCard 
              title="E-commerce Revenue Transformation"
              industry="Fashion Retail"
              stats={[
                { label: "Revenue", value: "186%", increase: "YoY Growth" },
                { label: "Traffic", value: "243%", increase: "Increase" },
                { label: "Conversion", value: "5.4%", increase: "From 2.1%" }
              ]}
              description="Comprehensive SEO and CRO strategy led to major traffic growth and doubled conversion rates within 8 months, resulting in record-breaking revenue."
              index={0}
            />
            
            <CaseStudyCard 
              title="Local Business Lead Generation"
              industry="Home Services"
              stats={[
                { label: "Leads", value: "317%", increase: "More Leads" },
                { label: "Cost/Lead", value: "63%", increase: "Reduction" },
                { label: "Rankings", value: "Top 3", increase: "For 65 Keywords" }
              ]}
              description="Local SEO and Google Ads campaigns transformed a struggling service business, tripling qualified leads while reducing acquisition costs."
              index={1}
            />
            
            <CaseStudyCard 
              title="B2B Sales Pipeline Expansion"
              industry="SaaS Company"
              stats={[
                { label: "Pipeline", value: "257%", increase: "Growth" },
                { label: "Demos", value: "189%", increase: "Increase" },
                { label: "Content ROI", value: "12x", increase: "Return" }
              ]}
              description="Content marketing and LinkedIn advertising created a predictable flow of high-quality enterprise leads, expanding sales pipeline and shortening sales cycles."
              index={2}
            />
            
            <CaseStudyCard 
              title="Brand Awareness Breakthrough"
              industry="Consumer Goods"
              stats={[
                { label: "Followers", value: "450K+", increase: "From 25K" },
                { label: "Engagement", value: "28%", increase: "Rate Increase" },
                { label: "Traffic", value: "214%", increase: "From Social" }
              ]}
              description="Strategic social media campaign propelled an emerging brand to industry leadership position, dramatically increasing visibility and driving website traffic."
              index={3}
            />
            
            <CaseStudyCard 
              title="E-commerce Conversion Optimization"
              industry="Health & Wellness"
              stats={[
                { label: "Conversion", value: "9.7%", increase: "From 3.2%" },
                { label: "AOV", value: "$127", increase: "From $82" },
                { label: "Revenue", value: "342%", increase: "Increase" }
              ]}
              description="Comprehensive conversion rate optimization program transformed underperforming store into a high-converting revenue machine without increasing traffic."
              index={4}
            />
            
            <CaseStudyCard 
              title="Full-Funnel Marketing System"
              industry="Professional Services"
              stats={[
                { label: "Leads", value: "431%", increase: "Growth" },
                { label: "Clients", value: "175%", increase: "New Clients" },
                { label: "ROI", value: "841%", increase: "Marketing ROI" }
              ]}
              description="Integrated marketing system spanning SEO, content, email, and paid social created predictable client acquisition machine for a growing consultancy."
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* Research & Data */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Backed by Research & Data
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our strategies are grounded in the latest industry research and empirical data—not guesswork or outdated tactics.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResearchHighlight 
              source="Hubspot Research"
              title="Content Marketing Effectiveness"
              description="Businesses that prioritize blogging are 13x more likely to achieve positive ROI from their marketing efforts."
              stat="13x Higher ROI"
              index={0}
            />
            
            <ResearchHighlight 
              source="Google Analytics Benchmarks"
              title="Website Speed Impact"
              description="Every 1-second delay in page load time results in 7% fewer conversions and 11% fewer page views."
              stat="7% Conversion Drop Per Second"
              index={1}
            />
            
            <ResearchHighlight 
              source="Salesforce Research"
              title="Multi-Channel Marketing"
              description="Customers using 3+ channels to interact with businesses have a 250% higher purchase and engagement rate."
              stat="250% Higher Engagement"
              index={2}
            />
            
            <ResearchHighlight 
              source="Aberdeen Group"
              title="Personalization Impact"
              description="Businesses using marketing personalization see an average 19% increase in sales compared to those that don't."
              stat="19% Sales Increase"
              index={3}
            />
            
            <ResearchHighlight 
              source="SEMrush Industry Report"
              title="SEO vs. PPC Investment"
              description="Organic search drives 53% of website traffic, while paid search accounts for just 15%, highlighting SEO's long-term value."
              stat="3.5x More Traffic from SEO"
              index={4}
            />
            
            <ResearchHighlight 
              source="LinkedIn B2B Research"
              title="B2B Decision Making"
              description="95% of B2B buyers view content as a trustworthiness marker when evaluating businesses and their offerings."
              stat="95% Trust Content First"
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Process: How We'll Work Together
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A transparent, collaborative approach that consistently delivers results.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-gray-800 transform -translate-x-1/2"></div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-2">Step 1</div>
                    <h3 className="text-xl font-bold mb-2">Discovery & Goal Setting</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We start with a comprehensive assessment of your business goals, current marketing performance, competitive landscape, and target audience to establish clear objectives and KPIs.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mt-4 md:mt-0">
                    <h4 className="font-medium mb-2 text-primary">What You'll Get:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Detailed current performance analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Competitor benchmarking report</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Clear KPIs and measurement plan</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-800 transform -translate-x-1/2"></div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:order-2">
                    <div className="inline-block text-xs font-medium bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full mb-2">Step 2</div>
                    <h3 className="text-xl font-bold mb-2">Strategy Development</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on our findings, we craft a comprehensive, custom marketing strategy that combines the right channels and tactics to efficiently reach your business objectives.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mt-4 md:mt-0 md:order-1">
                    <h4 className="font-medium mb-2 text-indigo-500">What You'll Get:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Comprehensive marketing strategy document</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Channel prioritization and budget allocation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Timeline and implementation roadmap</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 transform -translate-x-1/2"></div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="inline-block text-xs font-medium bg-green-500/10 text-green-500 px-3 py-1 rounded-full mb-2">Step 3</div>
                    <h3 className="text-xl font-bold mb-2">Implementation & Optimization</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We execute the strategy with meticulous attention to detail, continuously testing, measuring, and refining to maximize performance and ROI as data comes in.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mt-4 md:mt-0">
                    <h4 className="font-medium mb-2 text-green-500">What You'll Get:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Professional execution across all channels</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">A/B testing and performance optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Agile adjustments based on real-time results</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 rounded-full bg-orange-500 border-4 border-white dark:border-gray-800 transform -translate-x-1/2"></div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:order-2">
                    <div className="inline-block text-xs font-medium bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full mb-2">Step 4</div>
                    <h3 className="text-xl font-bold mb-2">Analysis & Growth Planning</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We provide transparent reporting on all KPIs, analyze results, and develop recommendations for scaling what's working and improving what could perform better.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mt-4 md:mt-0 md:order-1">
                    <h4 className="font-medium mb-2 text-orange-500">What You'll Get:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Comprehensive performance dashboards</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Detailed analysis and actionable insights</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Strategic recommendations for scaling results</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Start with a free, no-obligation strategy consultation. Discover how data-driven digital marketing can help you achieve your business goals.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild variant="secondary" className="bg-white hover:bg-gray-100 text-primary">
                  <Link to="/contact">
                    Book Your Free Strategy Session <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button size="lg" asChild variant="outline" className="border-white/30 hover:bg-white/10 text-white">
                  <a href="tel:+918280320550">
                    <MessageCircle className="mr-2 h-4 w-4" /> Call Directly
                  </a>
                </Button>
              </div>
              
              <p className="mt-6 text-sm opacity-80">
                Not ready to talk yet? <Link to="/portfolio" className="underline hover:no-underline">Browse the portfolio</Link> to see more examples of my work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingPage;