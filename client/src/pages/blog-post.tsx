import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link as WouterLink } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { BlogPost } from "@shared/schema";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getInitials } from "@/lib/utils";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    onError: () => {
      // Redirect to 404 page if blog post not found
      setLocation("/not-found");
    }
  });

  // Get related posts (posts with the same category)
  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    enabled: !!post,
    select: (data) => {
      if (!post) return [];
      return data
        .filter(p => 
          p.id !== post.id && 
          p.categories.some(cat => post.categories.includes(cat))
        )
        .slice(0, 3);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  // Convert markdown content to HTML
  const renderMarkdown = (content: string) => {
    // Create paragraphs
    const withParagraphs = content
      .split('\n\n')
      .map(paragraph => {
        // Handle headings
        if (paragraph.startsWith('# ')) {
          return `<h1 class="text-3xl font-bold my-6">${paragraph.substring(2)}</h1>`;
        } else if (paragraph.startsWith('## ')) {
          return `<h2 class="text-2xl font-bold my-5">${paragraph.substring(3)}</h2>`;
        } else if (paragraph.startsWith('### ')) {
          return `<h3 class="text-xl font-bold my-4">${paragraph.substring(4)}</h3>`;
        }
        
        // Handle lists
        if (paragraph.includes('\n- ')) {
          const listItems = paragraph
            .split('\n- ')
            .filter(item => item.trim() !== '')
            .map(item => `<li>${item}</li>`)
            .join('');
          return `<ul class="list-disc pl-6 my-4">${listItems}</ul>`;
        }
        
        // Regular paragraphs
        return `<p class="my-4">${paragraph}</p>`;
      })
      .join('');
    
    return { __html: withParagraphs };
  };

  if (isLoading) {
    return (
      <div className="container px-4 mx-auto py-20">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 max-w-lg mb-4 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 max-w-md mb-8 rounded"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return null; // Handled by onError redirect
  }

  const readingTime = getReadingTime(post.content);

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog | Samuel Marndi</title>
        <meta 
          name="description" 
          content={post.excerpt}
        />
        <meta property="og:title" content={`${post.title} | Blog | Samuel Marndi`} />
        <meta 
          property="og:description" 
          content={post.excerpt}
        />
        <meta property="og:image" content={post.imageUrl} />
        {post.tags && post.tags.length > 0 && (
          <meta name="keywords" content={post.tags.join(', ')} />
        )}
      </Helmet>

      <div className="pt-16 pb-24">
        <motion.div
          className="container px-4 mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto">
            {/* Back to blog link */}
            <motion.div variants={itemVariants} className="mb-8">
              <WouterLink href="/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </WouterLink>
            </motion.div>
            
            {/* Article Header */}
            <motion.div variants={itemVariants} className="mb-6">
              {post.categories && post.categories.length > 0 && (
                <Badge className="mb-4">
                  {post.categories[0]}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {post.excerpt}
              </p>
              
              {/* Author and meta info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(post.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Web Developer & Digital Marketer
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(post.publishDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Featured Image */}
            <motion.div variants={itemVariants} className="mb-10">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </motion.div>
            
            {/* Article Content */}
            <motion.div variants={itemVariants}>
              <div 
                className="prose dark:prose-invert prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={renderMarkdown(post.content)}
              />
            </motion.div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Author Box */}
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-12"
            >
              <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold mb-2">{post.author}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Professional web developer and digital marketer with over 7 years of experience helping businesses succeed online through custom websites and effective marketing strategies.
                  </p>
                  <WouterLink href="/about">
                    <Button variant="outline" size="sm">
                      About Me
                    </Button>
                  </WouterLink>
                </div>
              </div>
            </motion.div>
            
            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="group">
                      <WouterLink href={`/blog/${relatedPost.slug}`}>
                        <div className="mb-3 overflow-hidden rounded-lg">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </WouterLink>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default BlogPostPage;
