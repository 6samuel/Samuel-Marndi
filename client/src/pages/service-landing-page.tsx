import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Check, Star } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import QuickQuoteModal from '@/components/forms/quick-quote-modal';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { Service } from '@shared/schema';

const ServiceLandingPage = () => {
  const [match, params] = useRoute('/:serviceSlug');
  const [_, setLocation] = useLocation();
  const serviceSlug = params?.serviceSlug || '';

  // Fetch service details based on the slug
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/services/${serviceSlug}`],
    enabled: !!serviceSlug,
  });

  // Track page view with specific service
  useEffect(() => {
    if (service) {
      trackEvent('view_service_page', 'service', service.title);
    }
  }, [service]);

  // Redirect to services page if service not found
  useEffect(() => {
    if (!isLoading && !service && !error) {
      setLocation('/services');
    }
  }, [isLoading, service, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) return null;

  // Parse service description to display as formatted sections
  const descriptionParts = service.fullDescription.split('\n\n');
  const introText = descriptionParts[0];
  
  // Try to extract service features if they exist in a list format
  const featuresSection = descriptionParts.find((part: string) => part.includes('- '));
  const features = featuresSection
    ? featuresSection.split('\n').filter((line: string) => line.startsWith('- ')).map((line: string) => line.substring(2))
    : [];
  
  // Try to extract benefits if they exist
  const benefitsSection = descriptionParts.find((part: string) => part.includes('Benefits of') || part.toLowerCase().includes('benefits:'));
  const benefits = benefitsSection
    ? benefitsSection.split('\n').filter((line: string) => line.startsWith('- ')).map((line: string) => line.substring(2))
    : [];

  return (
    <>
      <Helmet>
        <title>{service.title} Services | Samuel Marndi</title>
        <meta name="description" content={service.shortDescription} />
        <meta property="og:title" content={`${service.title} Services | Samuel Marndi`} />
        <meta property="og:description" content={service.shortDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://samuelmarndi.com/${serviceSlug}`} />
        {service.imageUrl && <meta property="og:image" content={service.imageUrl} />}
        <link rel="canonical" href={`https://samuelmarndi.com/${serviceSlug}`} />
      </Helmet>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent dark:from-primary/10 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-purple-400/5 blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{animationDelay: '0.7s'}}></div>
          </div>
          
          <div className="container px-4 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col relative z-10"
              >
                <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-medium mb-6">
                  Expert {service.title} Solutions
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-700 dark:from-primary dark:via-blue-400 dark:to-indigo-500">
                  {service.title}
                </h1>
                
                <p className="text-xl mb-6 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {service.shortDescription}
                </p>
                
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {introText}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-2">
                  <QuickQuoteModal
                    triggerText="Get a Free Quote"
                    buttonVariant="default"
                    buttonSize="lg"
                    selectedService={service.slug}
                    id={`hero-cta-${service.slug}`}
                  />
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                    <a href="#service-details">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="flex items-center gap-2 mt-8 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Fast turnaround</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Quality guaranteed</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Ongoing support</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Decorative elements */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-500/5 rounded-full blur-xl"></div>
                
                {/* Stylized frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-indigo-600 dark:from-primary dark:via-blue-500 dark:to-indigo-500 rounded-2xl transform rotate-1 scale-105 opacity-20"></div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/30 dark:border-gray-700/30">
                  <OptimizedImage
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
                    alt={service.title}
                    className="w-full rounded-2xl"
                    width={600}
                    height={400}
                    priority={true}
                  />
                  
                  {/* Decorative badges */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-20 border-4 border-white dark:border-gray-800">
                    <Star className="w-8 h-8 text-yellow-500" fill="currentColor" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 px-4 rounded-lg shadow-md z-20 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Premium Service</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Features */}
        <section id="service-details" className="py-24 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent opacity-50"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-medium mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Premium Services
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-blue-400">
                {service.title} Solutions
              </h2>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Professional and reliable {service.title.toLowerCase()} services tailored to help your business thrive in today's competitive digital landscape.
              </p>
            </motion.div>

            {features.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-500/20 transition-all duration-300">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.split(':')[0]}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {feature.includes(':') ? feature.split(':')[1].trim() : feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <section className="py-24 bg-gradient-to-b from-gray-50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
            
            <div className="container px-4 mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center justify-center px-4 py-2 mb-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full text-primary font-medium">
                  Why Choose My Services
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
                  Benefits of Professional {service.title}
                </h2>
                
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                  Here's how my {service.title.toLowerCase()} services can transform your business and give you a competitive edge:
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                    className="flex flex-col bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 h-full transform hover:border-primary/20"
                  >
                    <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                      <Star className="w-8 h-8 text-primary" fill="currentColor" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {benefit.split(':')[0]}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4">
                      {benefit.includes(':') ? benefit.split(':')[1].trim() : benefit}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Extra action prompt */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-16 text-center"
              >
                <QuickQuoteModal
                  triggerText="Discuss Your Project Needs"
                  buttonVariant="outline"
                  buttonSize="lg"
                  selectedService={service.slug}
                  id={`benefit-cta-${service.slug}`}
                  className="border-primary text-primary hover:bg-primary/10"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Portfolio Section */}
        <section className="py-24 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-primary font-medium">
                Client Success Stories
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-primary dark:from-blue-400 dark:to-primary">
                Recent {service.title} Projects
              </h2>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Explore my portfolio of successful {service.title.toLowerCase()} projects that have helped businesses achieve their goals and drive growth.
              </p>
            </motion.div>

            {/* Portfolio showcase with enhanced visuals */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Featured project card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-blue-500/80 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20" asChild>
                      <Link href="/portfolio">
                        View Details
                      </Link>
                    </Button>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Project example" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">Featured</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2023</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    Business Transformation Project
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    A comprehensive {service.title.toLowerCase()} solution that transformed client operations and increased efficiency by 45%.
                  </p>
                </div>
              </motion.div>
              
              {/* Featured project card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-blue-500/80 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20" asChild>
                      <Link href="/portfolio">
                        View Details
                      </Link>
                    </Button>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Project example" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">Recent</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2024</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    Innovation Hub
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    An innovative {service.title.toLowerCase()} project that helped a startup launch their groundbreaking product to market.
                  </p>
                </div>
              </motion.div>
              
              {/* View all projects card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl overflow-hidden shadow-lg flex flex-col"
              >
                <div className="p-8 flex flex-col items-center justify-center flex-grow text-center">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-md">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Discover My Full Portfolio
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-8">
                    Browse my complete collection of {service.title.toLowerCase()} projects and case studies to see the quality and diversity of my work.
                  </p>
                  <Button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary border-none" size="lg" asChild>
                    <Link href="/portfolio">
                      View All Projects <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/80 to-blue-600/80 dark:from-primary/90 dark:to-blue-600/90 rounded-2xl p-8 md:p-12 shadow-xl mt-12"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Start Your {service.title} Project?</h3>
                  <p className="text-white/90">Let's discuss how I can help bring your vision to life.</p>
                </div>
                <div className="flex gap-4">
                  <QuickQuoteModal
                    triggerText="Get Started"
                    buttonVariant="default"
                    buttonSize="lg"
                    selectedService={service.slug}
                    id={`portfolio-cta-${service.slug}`}
                    className="bg-white text-primary hover:bg-gray-100"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Clients Say</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Don't just take my word for it. Here's what my clients have to say about working with me.
              </p>
            </motion.div>

            {/* We'll display testimonials directly here instead of using the component */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial cards will be loaded dynamically - this is a placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative">
                <div className="mb-6 pt-4">
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "Working with Samuel was a game-changer for our business. His expertise in {service.title.toLowerCase()} helped us achieve our goals faster than expected."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Client Testimonial</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      See more on the testimonials page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your {service.title} Experience?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Let's discuss how my professional {service.title.toLowerCase()} services can help you achieve your business goals and stay ahead of the competition.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuickQuoteModal
                  triggerText={`Get a ${service.title} Quote`}
                  buttonVariant="default"
                  buttonSize="lg"
                  selectedService={service.slug}
                />
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Contact Me
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiceLandingPage;