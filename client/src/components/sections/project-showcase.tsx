import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { motion } from 'framer-motion';

interface ProjectShowcaseProps {
  category?: string;
  title?: string;
  limit?: number;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ 
  category,
  title = "Featured Projects",
  limit = 3
}) => {
  // Fetch projects - either by category or featured
  const queryKey = category 
    ? [`/api/portfolio/by-category/${category}`] 
    : ['/api/portfolio/featured'];
  
  const { data: projects, isLoading } = useQuery({
    queryKey,
  });

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  // Limit the number of projects displayed
  const displayedProjects = projects.slice(0, limit);

  return (
    <section className="py-20">
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
            Explore some of my recent work and see how I've helped businesses achieve their goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="relative h-52 overflow-hidden">
                <OptimizedImage
                  src={project.imageUrl || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={225}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.shortDescription}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/portfolio/${project.slug}`}>
                    View Project <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link to="/portfolio">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;