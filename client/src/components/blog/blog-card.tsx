import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { formatDate, truncateText } from "@/lib/utils";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { OptimizedBlogImage } from "@/components/ui/optimized-blog-image";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const readingTime = Math.ceil(post.content.split(' ').length / 200); // Assuming 200 words per minute

  return (
    <motion.div 
      className={`group overflow-hidden ${
        featured ? "lg:col-span-2 grid md:grid-cols-2 gap-6" : ""
      }`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-lg ${featured ? "h-full" : "mb-4"}`}>
        <Link href={`/blog/${post.slug}`}>
          <div className="w-full h-60 overflow-hidden">
            <OptimizedBlogImage
              src={post.imageUrl || ''}
              alt={post.title}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {/* Category Badge */}
        {post.categories && post.categories.length > 0 && (
          <Badge className="absolute top-4 left-4 bg-primary/80 hover:bg-primary">
            {post.categories[0]}
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{formatDate(post.publishDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
        
        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {truncateText(post.excerpt, featured ? 200 : 120)}
        </p>
        
        {/* Tags */}
        {featured && post.tags && post.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="font-normal text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Author Info */}
        <div className="flex items-center mt-auto">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-xs">
            {post.author.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <span className="ml-2 text-sm font-medium">{post.author}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
