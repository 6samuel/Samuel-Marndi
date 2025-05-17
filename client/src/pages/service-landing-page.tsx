import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Check, Star } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import QuickQuoteModal from '@/components/forms/quick-quote-modal';
import SiteHeader from '@/components/layouts/site-header';
import SiteFooter from '@/components/layouts/site-footer';
import TestimonialsCarousel from '@/components/sections/testimonials-carousel';
import ProjectShowcase from '@/components/sections/project-showcase';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const ServiceLandingPage = () => {
  const [match, params] = useRoute('/:serviceSlug');
  const [_, setLocation] = useLocation();
  const serviceSlug = params?.serviceSlug || '';

  // Fetch service details based on the slug
  const { data: service, isLoading, error } = useQuery({
    queryKey: [`/api/services/by-slug/${serviceSlug}`],
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
  const featuresSection = descriptionParts.find(part => part.includes('- '));
  const features = featuresSection
    ? featuresSection.split('\n').filter(line => line.startsWith('- ')).map(line => line.substring(2))
    : [];
  
  // Try to extract benefits if they exist
  const benefitsSection = descriptionParts.find(part => part.includes('Benefits of') || part.toLowerCase().includes('benefits:'));
  const benefits = benefitsSection
    ? benefitsSection.split('\n').filter(line => line.startsWith('- ')).map(line => line.substring(2))
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

      <SiteHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10">
          <div className="container px-4 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                  {service.title}
                </h1>
                <p className="text-xl mb-8 text-gray-800 dark:text-gray-200">
                  {service.shortDescription}
                </p>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  {introText}
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <QuickQuoteModal
                    triggerText="Get a Free Quote"
                    buttonVariant="default"
                    buttonSize="lg"
                    selectedService={service.slug}
                  />
                  <Button size="lg" variant="outline" asChild>
                    <a href="#service-details">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-500/30 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
                    alt={service.title}
                    className="w-full rounded-2xl"
                    width={600}
                    height={400}
                    priority={true}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Features */}
        <section id="service-details" className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{service.title} Services</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Professional and reliable {service.title.toLowerCase()} services to help your business grow and succeed in the digital landscape.
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
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                  >
                    <div className="mb-4 p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.split(':')[0]}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
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
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of Professional {service.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Here's how my {service.title.toLowerCase()} services can transform your business:
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md"
                  >
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.split(':')[0]}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {benefit.includes(':') ? benefit.split(':')[1].trim() : benefit}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Project Showcase - Related Projects */}
        <ProjectShowcase category={service.slug} title={`Recent ${service.title} Projects`} />

        {/* Testimonials */}
        <TestimonialsCarousel title={`What Clients Say About My ${service.title} Services`} />

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
                  <a href="/contact">
                    Contact Me
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
};

export default ServiceLandingPage;