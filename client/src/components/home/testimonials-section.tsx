import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials/featured'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/testimonials/featured', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured testimonials: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching featured testimonials:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 2
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What Clients Are Saying
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't take my word for it. Hear what my clients have to say about their experiences working with me.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-60">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Failed to load testimonials. Please try again later.</p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials?.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1">
                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
                            {testimonial.imageUrl ? (
                              <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary-foreground/10 dark:text-primary-foreground">
                                {getInitials(testimonial.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-4">
                            <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{testimonial.testimonial.length > 150 
                            ? `${testimonial.testimonial.substring(0, 150)}...`
                            : testimonial.testimonial}"
                        </blockquote>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
