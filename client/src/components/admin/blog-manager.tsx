import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  GridIcon,
  ListIcon,
  Search,
  Calendar,
  Tag,
  User,
  Clock,
  CheckIcon,
  XCircle,
  Bookmark,
  Filter,
  FilePlus,
  FileText,
  Pencil
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import MediaLibrarySelector from "@/components/admin/media-library-selector";

const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  author: z.string().min(1, "Author is required"),
  publishDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)), 
    { message: "Invalid date format" }
  ),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  featured: z.boolean().default(false),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Sample categories and tags
const sampleCategories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Programming",
  "Marketing",
  "SEO",
  "Technology",
  "Industry News",
  "Tips & Tricks",
  "Case Studies",
  "Tutorials",
  "Business"
];

interface BlogPostCardProps {
  post: any;
  onEdit: (post: any) => void;
  onDelete: (id: number) => void;
  onPreview: (post: any) => void;
  onToggleFeatured: (id: number, featured: boolean) => void;
}

function BlogPostCard({ 
  post, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleFeatured 
}: BlogPostCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Not+Found";
          }}
        />
        <div className="absolute bottom-0 right-0 flex gap-1 m-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onPreview(post)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onEdit(post)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1 line-clamp-2">{post.title}</CardTitle>
            <CardDescription className="text-sm flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> {formatDate(post.publishDate)}
            </CardDescription>
          </div>
          {post.featured && <Badge>Featured</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-sm line-clamp-3 mb-3">{post.excerpt}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.categories && post.categories.slice(0, 2).map((category: string, index: number) => (
            <Badge key={`cat-${index}`} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {post.categories && post.categories.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{post.categories.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {post.tags && post.tags.slice(0, 3).map((tag: string, index: number) => (
            <Badge key={`tag-${index}`} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags && post.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between border-t mt-auto">
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-3.5 w-3.5 mr-1.5" />
          {post.author}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onToggleFeatured(post.id, !post.featured)}
          >
            {post.featured ? (
              <XCircle className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function BlogManager() {
  const { toast } = useToast();
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Form states
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [updateTagInput, setUpdateTagInput] = useState("");
  const [updateCategoryInput, setUpdateCategoryInput] = useState("");
  
  const queryClient = useQueryClient();
  
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      author: "",
      publishDate: new Date().toISOString().split('T')[0],
      categories: [],
      tags: [],
      featured: false,
    },
  });

  const updateForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      author: "",
      publishDate: new Date().toISOString().split('T')[0],
      categories: [],
      tags: [],
      featured: false,
    },
  });
  
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
    refetchOnWindowFocus: false,
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      const formattedData = {
        ...data,
        publishDate: new Date(data.publishDate)
      };
      const res = await apiRequest("POST", "/api/blog", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully.",
      });
      form.reset();
      setIsNewPostDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating blog post",
        description: error.message || "An error occurred while creating the blog post.",
        variant: "destructive",
      });
    },
  });
  
  const updatePostMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues & { id: number }) => {
      const { id, ...postData } = data;
      const formattedData = {
        ...postData,
        publishDate: new Date(postData.publishDate)
      };
      const res = await apiRequest("PUT", `/api/blog/${id}`, formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });
      updateForm.reset();
      setIsUpdateDialogOpen(false);
      setSelectedPost(null);
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating blog post",
        description: error.message || "An error occurred while updating the blog post.",
        variant: "destructive",
      });
    },
  });
  
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/blog/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting blog post",
        description: error.message || "An error occurred while deleting the blog post.",
        variant: "destructive",
      });
    },
  });
  
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/blog/${id}`, { featured });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Featured status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating blog post",
        description: error.message || "An error occurred while updating the blog post.",
        variant: "destructive",
      });
    },
  });
  
  // Tag and category management for the create form
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues().tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue("tags", currentTags.filter(t => t !== tag));
  };
  
  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      const currentCategories = form.getValues().categories || [];
      if (!currentCategories.includes(categoryInput.trim())) {
        form.setValue("categories", [...currentCategories, categoryInput.trim()]);
      }
      setCategoryInput("");
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    const currentCategories = form.getValues().categories || [];
    form.setValue("categories", currentCategories.filter(c => c !== category));
  };
  
  // Tag and category management for the update form
  const handleUpdateAddTag = () => {
    if (updateTagInput.trim()) {
      const currentTags = updateForm.getValues().tags || [];
      if (!currentTags.includes(updateTagInput.trim())) {
        updateForm.setValue("tags", [...currentTags, updateTagInput.trim()]);
      }
      setUpdateTagInput("");
    }
  };
  
  const handleUpdateRemoveTag = (tag: string) => {
    const currentTags = updateForm.getValues().tags || [];
    updateForm.setValue("tags", currentTags.filter(t => t !== tag));
  };
  
  const handleUpdateAddCategory = () => {
    if (updateCategoryInput.trim()) {
      const currentCategories = updateForm.getValues().categories || [];
      if (!currentCategories.includes(updateCategoryInput.trim())) {
        updateForm.setValue("categories", [...currentCategories, updateCategoryInput.trim()]);
      }
      setUpdateCategoryInput("");
    }
  };
  
  const handleUpdateRemoveCategory = (category: string) => {
    const currentCategories = updateForm.getValues().categories || [];
    updateForm.setValue("categories", currentCategories.filter(c => c !== category));
  };
  
  const handleCreatePost = (values: BlogPostFormValues) => {
    // Generate a slug from title if not provided
    if (!values.slug && values.title) {
      values.slug = values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (values.slug.length < 3) {
        values.slug = values.slug + "-post";
      }
    }
    
    createPostMutation.mutate(values);
  };
  
  const handleUpdatePost = (values: BlogPostFormValues) => {
    if (selectedPost) {
      updatePostMutation.mutate({ ...values, id: selectedPost.id });
    }
  };
  
  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    updateForm.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author,
      publishDate: new Date(post.publishDate).toISOString().split('T')[0],
      categories: post.categories || [],
      tags: post.tags || [],
      featured: post.featured || false,
    });
    setIsUpdateDialogOpen(true);
  };
  
  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deletePostMutation.mutate(id);
    }
  };
  
  const handlePreviewPost = (post: any) => {
    setSelectedPost(post);
    setIsPreviewDialogOpen(true);
  };
  
  const handleToggleFeatured = (id: number, featured: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured });
  };
  
  const handleImageSelected = (url: string) => {
    if (isUpdateDialogOpen) {
      updateForm.setValue("imageUrl", url);
    } else {
      form.setValue("imageUrl", url);
    }
  };
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return slug.length < 3 ? slug + "-post" : slug;
  };
  
  // Auto-generate slug when title changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const slug = generateSlug(value.title || "");
        form.setValue("slug", slug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Filter and sort blog posts
  const filteredPosts = blogPosts 
    ? blogPosts.filter((post: any) => {
        const matchesSearch = searchQuery === "" || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesCategory = categoryFilter === null || 
          (post.categories && post.categories.includes(categoryFilter));
        
        return matchesSearch && matchesCategory;
      })
    : [];
  
  // Sort blog posts by publish date (newest first)
  const sortedPosts = filteredPosts.sort((a: any, b: any) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  
  // Get all unique categories for filtering
  const uniqueCategories = blogPosts 
    ? Array.from(new Set(blogPosts.flatMap((post: any) => post.categories || [])))
    : [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog content and articles
          </p>
        </div>
        <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Create a new blog post for your website
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePost)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="How to Choose the Right Tech Stack" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="how-to-choose-right-tech-stack" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used in the URL: /blog/{field.value || "example-post"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A brief summary of your post..." 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            A short summary displayed in blog listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="publishDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publish Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <MediaLibrarySelector onSelect={handleImageSelected} />
                          </div>
                          {field.value && (
                            <div className="mt-2">
                              <img 
                                src={field.value} 
                                alt="Preview" 
                                className="max-h-32 rounded-md"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                                }}
                              />
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Post</FormLabel>
                            <FormDescription>
                              Feature this post on the homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categories</FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Select 
                                value={categoryInput} 
                                onValueChange={setCategoryInput}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or type..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {sampleCategories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button type="button" variant="outline" onClick={handleAddCategory}>
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {field.value?.map((category, index) => (
                                <Badge key={index} variant="secondary" className="py-1">
                                  {category}
                                  <button 
                                    type="button" 
                                    className="ml-1 text-gray-400 hover:text-gray-700"
                                    onClick={() => handleRemoveCategory(category)}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </Badge>
                              ))}
                              {field.value?.length === 0 && (
                                <span className="text-gray-500 text-sm">No categories added yet</span>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Input 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Add tag"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={handleAddTag}>
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {field.value?.map((tag, index) => (
                                <Badge key={index} variant="outline" className="py-1">
                                  {tag}
                                  <button 
                                    type="button" 
                                    className="ml-1 text-gray-400 hover:text-gray-700"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </Badge>
                              ))}
                              {field.value?.length === 0 && (
                                <span className="text-gray-500 text-sm">No tags added yet</span>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your blog post content here..." 
                              {...field} 
                              rows={13}
                              className="font-mono text-sm"
                            />
                          </FormControl>
                          <FormDescription>
                            Markdown is supported
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createPostMutation.isPending}
                  >
                    {createPostMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Publish Post
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Blog Post Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Blog Post</DialogTitle>
              <DialogDescription>
                Edit your existing blog post
              </DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdatePost)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={updateForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Used in the URL: /blog/{field.value}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                              />
                            </FormControl>
                            <FormDescription>
                              A short summary displayed in blog listings
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={updateForm.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={updateForm.control}
                          name="publishDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Publish Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={updateForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Featured Image URL</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <MediaLibrarySelector onSelect={handleImageSelected} />
                            </div>
                            {field.value && (
                              <div className="mt-2">
                                <img 
                                  src={field.value} 
                                  alt="Preview" 
                                  className="max-h-32 rounded-md"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                                  }}
                                />
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Post</FormLabel>
                              <FormDescription>
                                Feature this post on the homepage
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <FormField
                          control={updateForm.control}
                          name="categories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categories</FormLabel>
                              <div className="flex gap-2 mb-2">
                                <Select 
                                  value={updateCategoryInput} 
                                  onValueChange={setUpdateCategoryInput}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select or type..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sampleCategories.map(category => (
                                      <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button type="button" variant="outline" onClick={handleUpdateAddCategory}>
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {field.value?.map((category, index) => (
                                  <Badge key={index} variant="secondary" className="py-1">
                                    {category}
                                    <button 
                                      type="button" 
                                      className="ml-1 text-gray-400 hover:text-gray-700"
                                      onClick={() => handleUpdateRemoveCategory(category)}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </Badge>
                                ))}
                                {field.value?.length === 0 && (
                                  <span className="text-gray-500 text-sm">No categories added yet</span>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div>
                        <FormField
                          control={updateForm.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <div className="flex gap-2 mb-2">
                                <Input 
                                  value={updateTagInput}
                                  onChange={(e) => setUpdateTagInput(e.target.value)}
                                  placeholder="Add tag"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleUpdateAddTag();
                                    }
                                  }}
                                />
                                <Button type="button" variant="outline" onClick={handleUpdateAddTag}>
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {field.value?.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="py-1">
                                    {tag}
                                    <button 
                                      type="button" 
                                      className="ml-1 text-gray-400 hover:text-gray-700"
                                      onClick={() => handleUpdateRemoveTag(tag)}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </Badge>
                                ))}
                                {field.value?.length === 0 && (
                                  <span className="text-gray-500 text-sm">No tags added yet</span>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={updateForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={13}
                                className="font-mono text-sm"
                              />
                            </FormControl>
                            <FormDescription>
                              Markdown is supported
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updatePostMutation.isPending}
                    >
                      {updatePostMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Post
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Preview Blog Post Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost?.title}</DialogTitle>
              <DialogDescription>
                Blog Post Preview
              </DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden h-60">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Image+Not+Found";
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(selectedPost.publishDate)}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      {selectedPost.author}
                    </span>
                  </div>
                  
                  {selectedPost.featured && <Badge>Featured</Badge>}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">{selectedPost.title}</h3>
                  <p className="text-gray-600 mt-2">{selectedPost.excerpt}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedPost.categories?.map((category: string, index: number) => (
                    <Badge key={`cat-${index}`} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {selectedPost.tags?.map((tag: string, index: number) => (
                    <Badge key={`tag-${index}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Content</h3>
                  <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-700 max-h-96 overflow-auto whitespace-pre-line">
                    {selectedPost.content}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium text-gray-700 mb-1">URL</h3>
                  <p className="text-sm text-blue-600">/blog/{selectedPost.slug}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleEditPost(selectedPost)}
                className="mr-auto"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={categoryFilter || ""}
            onValueChange={(value) => setCategoryFilter(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error loading blog posts: {(error as Error).message}</p>
        </div>
      ) : blogPosts && blogPosts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first blog post</p>
          <Button onClick={() => setIsNewPostDialogOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" /> Write Your First Post
          </Button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Filter className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No matching posts</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search query or filters</p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setCategoryFilter(null);
          }}>
            Clear Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post: any) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onPreview={handlePreviewPost}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Categories</TableHead>
                <TableHead className="w-[100px] text-center">Featured</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts.map((post: any) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="max-w-full max-h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Error";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <div className="truncate">{post.title}</div>
                      <div className="text-xs text-gray-500 truncate">/blog/{post.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(post.publishDate)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.categories && post.categories.slice(0, 2).map((category: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {post.categories && post.categories.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {post.featured ? 
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" /> : 
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreviewPost(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPost(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(post.id, !post.featured)}>
                          {post.featured ? 
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Remove Featured
                            </> :
                            <>
                              <Bookmark className="mr-2 h-4 w-4" />
                              Mark as Featured
                            </>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}