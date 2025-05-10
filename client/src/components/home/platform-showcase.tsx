import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  WordPressLogo,
  ShopifyLogo,
  MagentoLogo,
  WebflowLogo,
  WixLogo,
  SquarespaceLogo,
  UnbounceLogo,
  WordPressTemplateMockup,
  ShopifyTemplateMockup,
  WebflowTemplateMockup,
  WixTemplateMockup,
  MagentoTemplateMockup,
  SquarespaceTemplateMockup,
  UnbounceTemplateMockup
} from '@/components/icons/platform-logos';

interface PlatformData {
  id: number;
  name: string;
  logo: React.ReactNode;
  mockup: React.ReactNode;
  description: string;
  strengths: string[];
  color: string;
}

const platforms: PlatformData[] = [
  {
    id: 1,
    name: 'WordPress',
    logo: <WordPressLogo />,
    mockup: <WordPressTemplateMockup />,
    description: 'The world\'s most popular CMS, powering over 40% of all websites on the internet.',
    strengths: ['Highly Customizable', 'SEO Friendly', 'Extensive Plugin Ecosystem'],
    color: 'bg-[#21759b]'
  },
  {
    id: 2,
    name: 'Shopify',
    logo: <ShopifyLogo />,
    mockup: <ShopifyTemplateMockup />,
    description: 'Leading e-commerce platform for online stores and retail point-of-sale systems.',
    strengths: ['Built-in Payment Processing', 'Inventory Management', 'Mobile Responsive'],
    color: 'bg-[#95BF47]'
  },
  {
    id: 3,
    name: 'Magento',
    logo: <MagentoLogo />,
    mockup: <MagentoTemplateMockup />,
    description: 'Powerful e-commerce platform designed for enterprise-level businesses.',
    strengths: ['Highly Scalable', 'Advanced Features', 'Multi-store Management'],
    color: 'bg-[#f46f25]'
  },
  {
    id: 4,
    name: 'Webflow',
    logo: <WebflowLogo />,
    mockup: <WebflowTemplateMockup />,
    description: 'Visual web design tool, CMS, and hosting platform all in one.',
    strengths: ['Visual Design', 'Responsive Layouts', 'Clean Code Output'],
    color: 'bg-[#4353ff]'
  },
  {
    id: 5,
    name: 'Wix',
    logo: <WixLogo />,
    mockup: <WixTemplateMockup />,
    description: 'Cloud-based web development platform making website creation accessible to everyone.',
    strengths: ['Drag-and-Drop Editor', 'Built-in Templates', 'App Market'],
    color: 'bg-[#faad4d]'
  },
  {
    id: 6,
    name: 'Squarespace',
    logo: <SquarespaceLogo />,
    mockup: <SquarespaceTemplateMockup />,
    description: 'All-in-one platform to create a beautiful online presence with award-winning templates.',
    strengths: ['Beautiful Templates', 'Mobile Optimization', 'Built-in Analytics'],
    color: 'bg-black'
  },
  {
    id: 7,
    name: 'Unbounce',
    logo: <UnbounceLogo />,
    mockup: <UnbounceTemplateMockup />,
    description: 'Landing page builder designed for marketing teams and agencies.',
    strengths: ['A/B Testing', 'Conversion Optimization', 'No Coding Required'],
    color: 'bg-[#ff524d]'
  }
];

const PlatformShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const currentPlatform = platforms[selectedIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Your Vision, Any Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              I bring your ideas to life across all major website platforms and builders. Benefit from my expertise with the tools you already love or discover new possibilities.
            </p>
          </motion.div>
        </div>

        {/* Platform showcase */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Left side - Platform carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="relative">
              {/* Platform logos */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {platforms.map((platform) => (
                    <div 
                      key={platform.id} 
                      className="relative flex-[0_0_100%] min-w-0 pl-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-6">
                          {platform.logo}
                        </div>
                        <div className="w-full max-w-md">
                          {platform.mockup}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <button 
                  onClick={scrollPrev}
                  className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex space-x-2">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === selectedIndex 
                          ? `${platforms[index].color} scale-125` 
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={scrollNext}
                  className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right side - Platform info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full opacity-10 ${currentPlatform.color}`}></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-2">{currentPlatform.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{currentPlatform.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider font-medium">Platform Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPlatform.strengths.map((strength, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${currentPlatform.color} bg-opacity-10 text-opacity-90`}
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold mb-3">How I can help with {currentPlatform.name}:</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${currentPlatform.color}`}></span>
                      <span>Custom theme development and design implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${currentPlatform.color}`}></span>
                      <span>Platform migration and data transfer</span>
                    </li>
                    <li className="flex items-start">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${currentPlatform.color}`}></span>
                      <span>Performance optimization and maintenance</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="mt-6" asChild>
                  <a href="/contact" className="inline-flex items-center">
                    Get a Custom Quote <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform logos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 md:mt-24"
        >
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Expertise Across All Major Platforms
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {platforms.map((platform) => (
              <div 
                key={platform.id} 
                className="w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => scrollTo(platform.id - 1)}
              >
                {platform.logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformShowcase;