import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PortfolioItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const { data: portfolioItems, isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio'],
  });

  // Get unique categories for filtering
  const categories = portfolioItems 
    ? [...new Set(portfolioItems.map(item => item.category))] 
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Portfolio | Samuel Marndi</title>
        <meta 
          name="description" 
          content="Explore Samuel Marndi's portfolio of web development, digital marketing, and UI/UX design projects for businesses across various industries."
        />
        <meta property="og:title" content="Portfolio | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Explore Samuel Marndi's portfolio of web development, digital marketing, and UI/UX design projects for businesses across various industries."
        />
      </Helmet>

      <div className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pb-16">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
                variants={itemVariants}
              >
                My Portfolio
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                A showcase of my best work across web development, digital marketing, and design.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="container px-4 mx-auto">
          {/* Category Filters */}
          {!isLoading && !error && categories.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Button variant="outline" className="mb-2">
                All Projects
              </Button>
              
              {categories.map((category, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Button variant="ghost" className="mb-2">
                    {category}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-72 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400">Failed to load portfolio items. Please try again later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {portfolioItems?.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="group relative overflow-hidden rounded-lg shadow-md"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="mb-3">{item.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{item.description}</p>
                    <Link href={`/portfolio/${item.slug}`}>
                      <Button variant="default" size="sm" className="mt-2">
                        View Case Study
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-12 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to discuss your project? Contact me today to explore how I can help bring your vision to life with tailored digital solutions.
            </p>
            <Link href="/contact">
              <Button size="lg" className="font-medium">
                Start Your Project
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Portfolio;
