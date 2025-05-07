import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { BlogPost } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import BlogCard from "@/components/blog/blog-card";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // Get unique categories and tags for filtering
  const categories = blogPosts 
    ? [...new Set(blogPosts.flatMap(post => post.categories))]
    : [];
  
  const tags = blogPosts
    ? [...new Set(blogPosts.flatMap(post => post.tags))]
    : [];

  // Filter posts based on search term, category, and tag
  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      (post.categories && post.categories.includes(selectedCategory));
    
    const matchesTag = selectedTag === null || 
      (post.tags && post.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Find featured posts (limit to 1)
  const featuredPost = blogPosts?.find(post => post.featured);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filter above
  };

  return (
    <>
      <Helmet>
        <title>Blog | Samuel Marndi</title>
        <meta 
          name="description" 
          content="Read insights and tips about web development, digital marketing, SEO, and UI/UX design from Samuel Marndi's professional blog."
        />
        <meta property="og:title" content="Blog | Samuel Marndi" />
        <meta 
          property="og:description" 
          content="Read insights and tips about web development, digital marketing, SEO, and UI/UX design from Samuel Marndi's professional blog."
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
                Blog & Insights
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                Thoughts, tips, and insights on web development, digital marketing, and design.
              </motion.p>
              
              {/* Search Form */}
              <motion.form 
                onSubmit={handleSearch}
                className="max-w-md mx-auto mb-8"
                variants={itemVariants}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </motion.form>
            </motion.div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories and Tags */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Categories</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                        selectedCategory === null 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Categories
                    </button>
                    
                    {categories.map((category, index) => (
                      <button 
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                          selectedCategory === category 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 10).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant={selectedTag === tag ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => selectedTag === tag ? setSelectedTag(null) : setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content - Blog Posts */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {isLoading ? (
                <div className="space-y-8">
                  <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">Failed to load blog posts. Please try again later.</p>
                </div>
              ) : (
                <motion.div 
                  className="space-y-12"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Featured Post */}
                  {featuredPost && !selectedCategory && !selectedTag && searchTerm === "" && (
                    <motion.div variants={itemVariants} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Post</h2>
                      <BlogCard post={featuredPost} featured={true} />
                    </motion.div>
                  )}
                  
                  {/* All Posts or Filtered Posts */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCategory ? `Category: ${selectedCategory}` : 
                         selectedTag ? `Tag: ${selectedTag}` : 
                         searchTerm ? `Search: "${searchTerm}"` : "Latest Articles"}
                      </h2>
                      
                      {(selectedCategory || selectedTag || searchTerm) && (
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedCategory(null);
                            setSelectedTag(null);
                            setSearchTerm("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                    
                    {filteredPosts && filteredPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPosts.map((post) => (
                          <motion.div key={post.id} variants={itemVariants}>
                            <BlogCard post={post} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">No articles found matching your criteria.</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
