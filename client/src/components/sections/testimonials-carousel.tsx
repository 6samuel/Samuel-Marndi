import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface TestimonialsCarouselProps {
  title?: string;
  limit?: number;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  title = "What Our Clients Say",
  limit = 3
}) => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials/featured'],
  });

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Limit the number of testimonials displayed
  const displayedTestimonials = testimonials.slice(0, limit);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative"
            >
              <div className="absolute -top-4 -left-4 text-primary">
                <Quote className="h-8 w-8 transform rotate-180" />
              </div>
              
              <div className="mb-6 pt-4">
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <OptimizedImage
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;