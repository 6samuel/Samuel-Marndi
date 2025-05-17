import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, Bot, Sparkles, Zap, Brain, MessageSquare, BarChart, Image } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import QuickQuoteModal from '@/components/forms/quick-quote-modal';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { Service } from '@shared/schema';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// AI Services sub-services data
const aiSubServices = [
  {
    id: 'chatbot-development',
    title: 'AI Chatbot Development',
    description: 'Intelligent conversational AI solutions that engage customers, provide support, and drive conversions.',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    features: [
      'Natural language processing capabilities',
      'Multi-platform deployment (website, messaging, social)',
      'Custom conversation flows',
      'Integration with business systems',
      '24/7 customer engagement'
    ],
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'machine-learning-solutions',
    title: 'Machine Learning Solutions',
    description: 'Custom ML models that transform data into valuable business insights and automated decision-making.',
    icon: <Brain className="h-8 w-8 text-primary" />,
    features: [
      'Predictive analytics and forecasting',
      'Pattern recognition and anomaly detection',
      'Recommendation engines',
      'Data classification and clustering',
      'Risk assessment systems'
    ],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'computer-vision-applications',
    title: 'Computer Vision Applications',
    description: 'Visual AI solutions that automate object detection, recognition, and analysis across industries.',
    icon: <Image className="h-8 w-8 text-primary" />,
    features: [
      'Object detection and recognition',
      'Image classification and segmentation',
      'Facial recognition and analysis',
      'Activity and motion tracking',
      'Quality control automation'
    ],
    image: 'https://images.unsplash.com/photo-1570215171323-4ec328f3f5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'nlp-text-analytics',
    title: 'NLP & Text Analytics',
    description: 'Advanced natural language processing solutions to extract meaning and insights from text data.',
    icon: <BarChart className="h-8 w-8 text-primary" />,
    features: [
      'Sentiment analysis and opinion mining',
      'Entity recognition and extraction',
      'Text classification and categorization',
      'Topic modeling and summarization',
      'Content generation and translation'
    ],
    image: 'https://images.unsplash.com/photo-1550592704-6c76defa9985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

// AI Services use cases by industry
const aiIndustryUseCases = [
  {
    industry: 'E-Commerce & Retail',
    applications: [
      'Personalized product recommendations',
      'Visual search capabilities',
      'Inventory forecasting and optimization',
      'Customer service chatbots',
      'Fraud detection systems'
    ]
  },
  {
    industry: 'Healthcare',
    applications: [
      'Medical image analysis and diagnostics',
      'Patient data analytics',
      'Treatment optimization',
      'Virtual health assistants',
      'Drug discovery and development'
    ]
  },
  {
    industry: 'Finance & Banking',
    applications: [
      'Risk assessment and scoring',
      'Fraud detection and prevention',
      'Algorithmic trading',
      'Customer service automation',
      'Document processing and analysis'
    ]
  },
  {
    industry: 'Manufacturing',
    applications: [
      'Predictive maintenance',
      'Quality control automation',
      'Supply chain optimization',
      'Demand forecasting',
      'Process optimization'
    ]
  }
];

// Benefits of AI integration
const aiBenefits = [
  {
    title: 'Enhanced Efficiency',
    description: 'Automate routine tasks, reduce manual effort, and process information at unprecedented speeds.',
    icon: <Zap className="h-6 w-6 text-yellow-500" />
  },
  {
    title: 'Data-Driven Insights',
    description: 'Uncover patterns, trends, and correlations in your data that would be impossible to find manually.',
    icon: <BarChart className="h-6 w-6 text-blue-500" />
  },
  {
    title: 'Improved Decision Making',
    description: 'Make more accurate predictions and better-informed business decisions based on AI-powered analytics.',
    icon: <Brain className="h-6 w-6 text-purple-500" />
  },
  {
    title: 'Enhanced Customer Experience',
    description: 'Deliver personalized interactions, faster service, and more intuitive interfaces for your customers.',
    icon: <MessageSquare className="h-6 w-6 text-green-500" />
  },
  {
    title: 'Competitive Advantage',
    description: 'Stay ahead of the curve with innovative AI capabilities that differentiate your business.',
    icon: <Sparkles className="h-6 w-6 text-orange-500" />
  },
  {
    title: 'Scalable Growth',
    description: 'Expand operations without proportionally increasing costs through AI automation and optimization.',
    icon: <ArrowRight className="h-6 w-6 text-red-500" />
  }
];

// AI implementation process steps
const aiImplementationSteps = [
  {
    step: 1,
    title: 'Discovery & Assessment',
    description: 'We analyze your business needs, existing processes, and data to identify the most valuable AI opportunities.'
  },
  {
    step: 2,
    title: 'Strategy & Planning',
    description: 'We design a tailored AI implementation roadmap, selecting appropriate technologies and defining success metrics.'
  },
  {
    step: 3,
    title: 'Data Preparation',
    description: 'We collect, clean, and structure the necessary data to ensure your AI solutions have quality inputs.'
  },
  {
    step: 4,
    title: 'AI Development',
    description: 'We build, train, and refine custom AI models and applications tailored to your specific requirements.'
  },
  {
    step: 5,
    title: 'Integration & Deployment',
    description: 'We seamlessly integrate AI solutions with your existing systems and deploy them to production.'
  },
  {
    step: 6,
    title: 'Training & Support',
    description: 'We provide comprehensive training for your team and ongoing support to ensure long-term success.'
  }
];

const AIServicesLanding = () => {
  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['/api/services/ai-services'],
  });

  // Track page view
  useEffect(() => {
    if (service) {
      trackEvent('view_service_page', 'service', service.title);
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Integration Services | Samuel Marndi - Professional Developer</title>
        <meta 
          name="description" 
          content="Transform your business with custom AI integration services: machine learning, computer vision, NLP, and intelligent chatbots that deliver real business value." 
        />
        <meta property="og:title" content="AI Integration Services | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Custom AI solutions to automate processes, gain insights, and create intelligent applications that drive business growth." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                AI Integration Services
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Transform your business with cutting-edge artificial intelligence solutions that automate processes, deliver insights, and create exceptional user experiences.
              </p>
              <div className="flex flex-wrap gap-3">
                <QuickQuoteModal 
                  triggerText="Get a Free Quote"
                  selectedService="AI Integration"
                  className="bg-primary hover:bg-primary/90"
                />
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://wa.me/918280320550', '_blank')}
                >
                  Discuss Your Project
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-border">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1595476108398-47adf1e9ff2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="AI Integration Services"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Machine Learning</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Computer Vision</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">NLP</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Chatbots</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Services Overview */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Comprehensive AI Solutions</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              From intelligent chatbots to advanced machine learning models, I provide a full spectrum of AI integration services tailored to your specific business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiSubServices.map((subService, index) => (
              <motion.div
                key={subService.id}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-48 overflow-hidden">
                  <OptimizedImage
                    src={subService.image || "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                    alt={subService.title}
                    width={600}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {subService.icon}
                    <h3 className="text-xl font-bold ml-3">{subService.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{subService.description}</p>
                  <ul className="space-y-2 mb-4">
                    {subService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/ai-integration/${subService.id}`} className="flex items-center text-primary font-medium hover:underline">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI Integration? */}
      <section className="py-16 bg-accent/5">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Integrate AI Into Your Business?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Artificial Intelligence is revolutionizing how businesses operate. Here's how AI integration can transform your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 rounded-full bg-background inline-block mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI for Different Industries */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">AI Applications Across Industries</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              See how AI is transforming different sectors with tailored applications that address industry-specific challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiIndustryUseCases.map((industry, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-4">{industry.industry}</h3>
                <ul className="space-y-2">
                  {industry.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Implementation Process */}
      <section className="py-16 bg-accent/5">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">My AI Implementation Process</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A structured, comprehensive approach to ensure successful AI integration for your business.
            </p>
          </div>
          
          <div className="relative">
            {/* Process Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -ml-0.5 z-0"></div>
            
            <div className="space-y-12">
              {aiImplementationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 relative z-10`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 flex md:justify-end">
                    <div className={`p-6 bg-card border border-border rounded-lg ${index % 2 === 0 ? 'md:rounded-r-none' : 'md:rounded-l-none'} shadow-sm w-full md:max-w-md`}>
                      <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold ml-3">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary z-10"></div>
                  </div>
                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies & Frameworks */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">AI Technologies & Frameworks</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              I leverage the latest AI technologies and frameworks to build robust, efficient, and scalable solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI API', 'Azure Cognitive Services', 
              'Google Cloud AI', 'Hugging Face', 'BERT', 'GPT', 'YOLO', 'Keras', 'Pandas',
              'NumPy', 'OpenCV', 'spaCy', 'NLTK', 'Rasa', 'DialogFlow'
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-card text-card-foreground rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <p className="font-medium">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Let's discuss how I can help you implement cutting-edge AI solutions tailored to your specific business needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <QuickQuoteModal
                triggerText="Get Started Today"
                selectedService="AI Integration"
                className="bg-white text-primary hover:bg-white/90"
              />
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('https://wa.me/918280320550', '_blank')}
              >
                Contact via WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about AI integration for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What types of businesses can benefit from AI integration?",
                answer: "Businesses across all industries can benefit from AI integration. Whether you're in retail, healthcare, finance, manufacturing, or services, AI can help automate processes, gain insights from data, enhance customer experiences, and drive innovation."
              },
              {
                question: "How much data do I need to implement AI solutions?",
                answer: "The data requirements vary depending on the specific AI application. Some solutions can work with limited data by leveraging pre-trained models and transfer learning. Others may require larger datasets for optimal performance. I'll assess your data situation and recommend appropriate approaches."
              },
              {
                question: "How long does it take to implement an AI solution?",
                answer: "Implementation timelines vary based on project scope, complexity, data readiness, and integration requirements. Simple AI implementations might take 4-8 weeks, while more complex enterprise solutions could take 3-6 months. I'll provide a detailed timeline as part of your project plan."
              },
              {
                question: "Will AI replace jobs in my company?",
                answer: "AI typically augments human capabilities rather than replacing them entirely. It automates repetitive tasks, allowing your team to focus on higher-value activities that require creativity, emotional intelligence, and strategic thinking. The goal is to enhance productivity and create new opportunities."
              },
              {
                question: "How do I measure the ROI of AI implementation?",
                answer: "ROI can be measured through various metrics including cost savings, productivity improvements, revenue growth, customer satisfaction, error reduction, and competitive advantage. I'll help establish clear KPIs aligned with your business goals to track and measure the impact."
              },
              {
                question: "What ongoing maintenance do AI systems require?",
                answer: "AI systems require monitoring, periodic retraining with new data, performance optimization, and adaptations to changing business requirements. I provide comprehensive support and maintenance services to ensure your AI solutions continue to deliver value over time."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AIServicesLanding;