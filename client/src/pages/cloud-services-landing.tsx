import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, ChevronRight, Cloud, Database, ServerIcon, Shield, Zap, NetworkIcon } from 'lucide-react';
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

// Cloud Services sub-services data
const cloudSubServices = [
  {
    id: 'aws-cloud-solutions',
    title: 'AWS Cloud Solutions',
    description: 'Comprehensive Amazon Web Services infrastructure for scalable, secure cloud deployments.',
    icon: <Cloud className="h-8 w-8 text-primary" />,
    features: [
      'EC2 instance setup and management',
      'S3 storage configuration',
      'RDS database solutions',
      'Lambda serverless functions',
      'CloudFront CDN implementation'
    ],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
  },
  {
    id: 'azure-cloud-solutions',
    title: 'Microsoft Azure Solutions',
    description: 'Enterprise-grade cloud services built on Microsoft\'s powerful Azure platform.',
    icon: <Database className="h-8 w-8 text-primary" />,
    features: [
      'Azure App Service deployment',
      'Azure SQL Database setup',
      'Azure Functions implementation',
      'Blob Storage configuration',
      'Azure DevOps integration'
    ],
    image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'google-cloud-solutions',
    title: 'Google Cloud Platform',
    description: 'Cutting-edge cloud infrastructure powered by Google\'s global network.',
    icon: <ServerIcon className="h-8 w-8 text-primary" />,
    features: [
      'Google Compute Engine setup',
      'Cloud Storage implementation',
      'Cloud SQL database configuration',
      'App Engine deployment',
      'Google Kubernetes Engine (GKE)'
    ],
    image: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  },
  {
    id: 'cloud-security-solutions',
    title: 'Cloud Security Solutions',
    description: 'Comprehensive security measures to protect your cloud infrastructure and data.',
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [
      'Security posture assessment',
      'Encryption implementation',
      'Identity and access management',
      'Network security configuration',
      'Continuous security monitoring'
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

// Cloud Services Industry use cases
const cloudIndustryUseCases = [
  {
    industry: 'E-Commerce',
    applications: [
      'Scalable web hosting for seasonal demand',
      'Reliable database solutions for inventory',
      'Fast CDN for global product delivery',
      'Secure payment processing',
      'Data analytics for customer behavior'
    ]
  },
  {
    industry: 'Healthcare',
    applications: [
      'HIPAA-compliant data storage',
      'Secure patient portals',
      'Telemedicine infrastructure',
      'Medical imaging storage and processing',
      'Healthcare analytics systems'
    ]
  },
  {
    industry: 'Financial Services',
    applications: [
      'Secure transaction processing',
      'Regulatory compliant infrastructure',
      'Fraud detection systems',
      'High-performance trading platforms',
      'Customer data management'
    ]
  },
  {
    industry: 'Media & Entertainment',
    applications: [
      'Content delivery networks',
      'Video streaming platforms',
      'Digital asset management',
      'Audience analytics',
      'Scalable gaming infrastructure'
    ]
  }
];

// Benefits of Cloud Services
const cloudBenefits = [
  {
    title: 'Cost Efficiency',
    description: 'Reduce capital expenses and operational costs with pay-as-you-go pricing models.',
    icon: <Zap className="h-6 w-6 text-yellow-500" />
  },
  {
    title: 'Scalability',
    description: 'Easily scale resources up or down based on demand without infrastructure investment.',
    icon: <ArrowRight className="h-6 w-6 text-blue-500" />
  },
  {
    title: 'Reliability',
    description: 'Benefit from redundant systems and high availability across multiple data centers.',
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />
  },
  {
    title: 'Security',
    description: 'Leverage enterprise-grade security measures and compliance certifications.',
    icon: <Shield className="h-6 w-6 text-purple-500" />
  },
  {
    title: 'Global Reach',
    description: 'Deploy applications closer to your users with worldwide data center networks.',
    icon: <NetworkIcon className="h-6 w-6 text-orange-500" />
  },
  {
    title: 'Innovation',
    description: 'Access cutting-edge technologies like AI, ML, IoT, and serverless computing.',
    icon: <ServerIcon className="h-6 w-6 text-red-500" />
  }
];

// Cloud implementation process steps
const cloudImplementationSteps = [
  {
    step: 1,
    title: 'Assessment & Planning',
    description: 'Analyze your current infrastructure and business needs to create an optimal cloud strategy.'
  },
  {
    step: 2,
    title: 'Architecture Design',
    description: 'Design a scalable, secure, and cost-efficient cloud architecture tailored to your requirements.'
  },
  {
    step: 3,
    title: 'Migration Planning',
    description: 'Develop a detailed migration plan that minimizes disruption to your business operations.'
  },
  {
    step: 4,
    title: 'Implementation',
    description: 'Execute the migration with careful attention to security, data integrity, and performance.'
  },
  {
    step: 5,
    title: 'Testing & Optimization',
    description: 'Thoroughly test all systems and optimize for performance, security, and cost-efficiency.'
  },
  {
    step: 6,
    title: 'Training & Support',
    description: 'Provide comprehensive training for your team and ongoing support for your cloud environment.'
  }
];

const CloudServicesLanding = () => {
  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['/api/services/cloud-services'],
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
        <title>Cloud Computing Services | Samuel Marndi - Professional Developer</title>
        <meta 
          name="description" 
          content="Expert cloud computing services: AWS, Azure, Google Cloud Platform solutions for scalable, secure, and cost-effective infrastructure." 
        />
        <meta property="og:title" content="Cloud Computing Services | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Professional cloud infrastructure setup and management services to power your business applications with industry-leading platforms." 
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
                Cloud Computing Services
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Scalable, secure, and cost-effective cloud infrastructure solutions to power your business applications and services.
              </p>
              <div className="flex flex-wrap gap-3">
                <QuickQuoteModal 
                  triggerText="Get a Free Quote"
                  selectedService="Cloud Services"
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
                  src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Cloud Computing Services"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">AWS</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Azure</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Google Cloud</span>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Cloud Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cloud Services Overview */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Comprehensive Cloud Solutions</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              From infrastructure design to migration and ongoing management, I provide end-to-end cloud computing services tailored to your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cloudSubServices.map((subService, index) => (
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
                    src={subService.image}
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
                  <Link to={`/cloud-services/${subService.id}`} className="flex items-center text-primary font-medium hover:underline">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cloud Computing? */}
      <section className="py-16 bg-accent/5">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Move to the Cloud?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Cloud computing offers transformative benefits for businesses of all sizes. Here's how cloud services can empower your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudBenefits.map((benefit, index) => (
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

      {/* Cloud for Different Industries */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Cloud Solutions Across Industries</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              See how cloud computing is transforming different sectors with tailored solutions that address industry-specific challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cloudIndustryUseCases.map((industry, index) => (
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

      {/* Cloud Implementation Process */}
      <section className="py-16 bg-accent/5">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">My Cloud Implementation Process</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A structured, comprehensive approach to ensure successful cloud migration and deployment for your business.
            </p>
          </div>
          
          <div className="relative">
            {/* Process Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -ml-0.5 z-0"></div>
            
            <div className="space-y-12">
              {cloudImplementationSteps.map((step, index) => (
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

      {/* Technologies & Platforms */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Cloud Technologies & Platforms</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              I work with leading cloud platforms and technologies to deliver robust, scalable solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Amazon AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 
              'Terraform', 'CloudFormation', 'Lambda', 'Azure Functions', 'Cloud Run',
              'S3', 'Blob Storage', 'Cloud Storage', 'DynamoDB', 'CosmosDB',
              'RDS', 'Azure SQL', 'Firestore', 'CloudFront', 'Elastic Beanstalk'
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
              Ready to Transform Your Infrastructure with Cloud Computing?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Let's discuss how I can help you implement a secure, scalable, and cost-effective cloud solution for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <QuickQuoteModal
                triggerText="Get Started Today"
                selectedService="Cloud Services"
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
              Get answers to common questions about cloud computing services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How secure is cloud computing for my business data?",
                answer: "Cloud platforms offer enterprise-grade security that often exceeds what most businesses can implement on-premises. Major providers invest billions in security measures including advanced encryption, network protection, physical security, and compliance certifications. I implement additional security best practices like identity management, access controls, and regular security audits to ensure your data remains protected."
              },
              {
                question: "How much does it cost to migrate to the cloud?",
                answer: "Cloud migration costs vary based on your current infrastructure, data volume, application complexity, and chosen cloud model. I provide detailed cost analysis and optimization strategies to ensure your migration is cost-effective. Most businesses see ROI through reduced hardware costs, improved operational efficiency, and the ability to scale resources as needed."
              },
              {
                question: "How long does a typical cloud migration take?",
                answer: "Migration timelines depend on your infrastructure complexity, application architecture, data volume, and business constraints. Simple migrations might take a few weeks, while larger enterprise migrations can span several months. I develop phased migration plans that minimize disruption while allowing you to realize benefits incrementally."
              },
              {
                question: "Will my applications work the same in the cloud?",
                answer: "Most applications can run in the cloud with minimal modifications, but some may require refactoring to fully leverage cloud capabilities. I assess your applications and recommend the appropriate migration strategy for each—whether that's rehosting (lift and shift), replatforming, refactoring, or replacing with cloud-native alternatives."
              },
              {
                question: "How do I manage costs in the cloud?",
                answer: "I implement comprehensive cost management strategies including right-sizing resources, leveraging reserved instances, implementing auto-scaling, using spot instances for appropriate workloads, and setting up detailed monitoring and reporting. This ensures you only pay for what you need while maintaining performance and reliability."
              },
              {
                question: "What if I want to switch cloud providers or move back on-premises?",
                answer: "I design cloud architectures with portability in mind, using containerization, infrastructure as code, and documented deployment processes. This reduces vendor lock-in and preserves your flexibility to change providers or repatriate workloads if your business needs change."
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

export default CloudServicesLanding;