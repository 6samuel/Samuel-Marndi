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
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Save,
  CheckIcon,
  XCircle,
  ExternalLink,
  Calendar,
  Tag,
  Briefcase,
  Globe,
  Code,
  Bookmark
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

const portfolioSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  imageUrl: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Category is required"),
  client: z.string().min(1, "Client name is required"),
  description: z.string().min(50, "Description must be at least 50 characters long"),
  completionDate: z.string().optional(),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onPreview: (item: any) => void;
  onToggleFeatured: (id: number, featured: boolean) => void;
}

const categories = [
  "Web Development",
  "Mobile App",
  "E-commerce",
  "Landing Page",
  "Web App",
  "Portfolio",
  "Blog",
  "Business Website",
  "Dashboard",
  "UI/UX Design",
  "API Integration",
  "Other"
];

function PortfolioCard({ 
  item, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleFeatured 
}: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
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
            onClick={() => onPreview(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
            <CardDescription className="text-sm flex items-center">
              <Tag className="h-3 w-3 mr-1" /> {item.category}
            </CardDescription>
          </div>
          {item.featured && <Badge>Featured</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <div className="flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
            <span>{item.client}</span>
          </div>
          {item.completionDate && (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{item.completionDate}</span>
            </div>
          )}
          {item.websiteUrl && (
            <div className="flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              <a 
                href={item.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {item.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <div className="flex gap-1.5 flex-wrap">
            {item.technologies && item.technologies.slice(0, 3).map((tech: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {item.technologies && item.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.technologies.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFeatured(item.id, !item.featured)}
        >
          {item.featured ? (
            <>
              <XCircle className="h-4 w-4 mr-1.5" />
              Unfeature
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-1.5" />
              Feature
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PortfolioManager() {
  const { toast } = useToast();
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      slug: "",
      imageUrl: "",
      category: "",
      client: "",
      description: "",
      completionDate: "",
      technologies: [],
      websiteUrl: "",
      featured: false,
    },
  });

  const updateForm = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      slug: "",
      imageUrl: "",
      category: "",
      client: "",
      description: "",
      completionDate: "",
      technologies: [],
      websiteUrl: "",
      featured: false,
    },
  });
  
  const [techInput, setTechInput] = useState("");
  const [updateTechInput, setUpdateTechInput] = useState("");
  
  const { data: portfolioItems, isLoading, error } = useQuery({
    queryKey: ["/api/portfolio-items"],
    refetchOnWindowFocus: false,
  });
  
  const createItemMutation = useMutation({
    mutationFn: async (data: PortfolioFormValues) => {
      const res = await apiRequest("POST", "/api/portfolio-items", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item created",
        description: "Your portfolio item has been created successfully.",
      });
      form.reset();
      setIsNewItemDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-items"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating portfolio item",
        description: error.message || "An error occurred while creating the portfolio item.",
        variant: "destructive",
      });
    },
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async (data: PortfolioFormValues & { id: number }) => {
      const { id, ...itemData } = data;
      const res = await apiRequest("PUT", `/api/portfolio-items/${id}`, itemData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item updated",
        description: "Your portfolio item has been updated successfully.",
      });
      updateForm.reset();
      setIsUpdateDialogOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-items"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating portfolio item",
        description: error.message || "An error occurred while updating the portfolio item.",
        variant: "destructive",
      });
    },
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/portfolio-items/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item deleted",
        description: "The portfolio item has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-items"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting portfolio item",
        description: error.message || "An error occurred while deleting the portfolio item.",
        variant: "destructive",
      });
    },
  });
  
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/portfolio-items/${id}`, { featured });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item updated",
        description: "Featured status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-items"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating portfolio item",
        description: error.message || "An error occurred while updating the portfolio item.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddTech = () => {
    if (techInput.trim()) {
      const currentTechs = form.getValues().technologies || [];
      if (!currentTechs.includes(techInput.trim())) {
        form.setValue("technologies", [...currentTechs, techInput.trim()]);
      }
      setTechInput("");
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    const currentTechs = form.getValues().technologies || [];
    form.setValue("technologies", currentTechs.filter(t => t !== tech));
  };
  
  const handleUpdateAddTech = () => {
    if (updateTechInput.trim()) {
      const currentTechs = updateForm.getValues().technologies || [];
      if (!currentTechs.includes(updateTechInput.trim())) {
        updateForm.setValue("technologies", [...currentTechs, updateTechInput.trim()]);
      }
      setUpdateTechInput("");
    }
  };
  
  const handleUpdateRemoveTech = (tech: string) => {
    const currentTechs = updateForm.getValues().technologies || [];
    updateForm.setValue("technologies", currentTechs.filter(t => t !== tech));
  };
  
  const handleCreateItem = (values: PortfolioFormValues) => {
    // Generate a slug from title if not provided
    if (!values.slug && values.title) {
      values.slug = values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (values.slug.length < 3) {
        values.slug = values.slug + "-project";
      }
    }
    
    createItemMutation.mutate(values);
  };
  
  const handleUpdateItem = (values: PortfolioFormValues) => {
    if (selectedItem) {
      updateItemMutation.mutate({ ...values, id: selectedItem.id });
    }
  };
  
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    updateForm.reset({
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl,
      category: item.category,
      client: item.client,
      description: item.description,
      completionDate: item.completionDate || "",
      technologies: item.technologies || [],
      websiteUrl: item.websiteUrl || "",
      featured: item.featured || false,
    });
    setIsUpdateDialogOpen(true);
  };
  
  const handleDeleteItem = (id: number) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      deleteItemMutation.mutate(id);
    }
  };
  
  const handlePreviewItem = (item: any) => {
    setSelectedItem(item);
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
    
    return slug.length < 3 ? slug + "-project" : slug;
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
  
  // Filter and sort portfolio items
  const filteredItems = portfolioItems 
    ? portfolioItems.filter((item: any) => {
        const matchesSearch = searchQuery === "" || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.client.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesCategory = categoryFilter === null || item.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
    : [];
  
  // Get all unique categories for filtering
  const uniqueCategories = portfolioItems 
    ? Array.from(new Set(portfolioItems.map((item: any) => item.category)))
    : [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects and case studies
          </p>
        </div>
        <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add Portfolio Project</DialogTitle>
              <DialogDescription>
                Showcase a new project in your portfolio
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateItem)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="E-commerce Website" {...field} />
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
                            <Input placeholder="e-commerce-website" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used in the URL: /portfolio/{field.value || "example-project"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="completionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Completion Date</FormLabel>
                            <FormControl>
                              <Input placeholder="June 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Input placeholder="Client Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
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
                            <FormLabel>Featured Project</FormLabel>
                            <FormDescription>
                              Feature this project on the homepage
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
                  
                  <div className="space-y-4">
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the project, your role, and the challenges overcome..." 
                              {...field} 
                              rows={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technologies Used</FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Input 
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                placeholder="Add technology"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTech();
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={handleAddTech}>
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {field.value?.map((tech, index) => (
                                <Badge key={index} variant="secondary" className="py-1">
                                  {tech}
                                  <button 
                                    type="button" 
                                    className="ml-1 text-gray-400 hover:text-gray-700"
                                    onClick={() => handleRemoveTech(tech)}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </Badge>
                              ))}
                              {field.value?.length === 0 && (
                                <span className="text-gray-500 text-sm">No technologies added yet</span>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createItemMutation.isPending}
                  >
                    {createItemMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Project
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Portfolio Item Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Update Portfolio Project</DialogTitle>
              <DialogDescription>
                Edit your existing portfolio project
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateItem)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={updateForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
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
                              Used in the URL: /portfolio/{field.value}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={updateForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={updateForm.control}
                          name="completionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Completion Date</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={updateForm.control}
                        name="client"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
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
                              <FormLabel>Featured Project</FormLabel>
                              <FormDescription>
                                Feature this project on the homepage
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
                    
                    <div className="space-y-4">
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
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={6}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormField
                          control={updateForm.control}
                          name="technologies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Technologies Used</FormLabel>
                              <div className="flex gap-2 mb-2">
                                <Input 
                                  value={updateTechInput}
                                  onChange={(e) => setUpdateTechInput(e.target.value)}
                                  placeholder="Add technology"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleUpdateAddTech();
                                    }
                                  }}
                                />
                                <Button type="button" variant="outline" onClick={handleUpdateAddTech}>
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {field.value?.map((tech, index) => (
                                  <Badge key={index} variant="secondary" className="py-1">
                                    {tech}
                                    <button 
                                      type="button" 
                                      className="ml-1 text-gray-400 hover:text-gray-700"
                                      onClick={() => handleUpdateRemoveTech(tech)}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </Badge>
                                ))}
                                {field.value?.length === 0 && (
                                  <span className="text-gray-500 text-sm">No technologies added yet</span>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updateItemMutation.isPending}
                    >
                      {updateItemMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Project
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Preview Portfolio Item Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
              <DialogDescription>
                Portfolio Project Preview
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="rounded-md overflow-hidden h-60">
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Image+Not+Found";
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge>
                      {selectedItem.category}
                    </Badge>
                    {selectedItem.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  
                  {selectedItem.websiteUrl && (
                    <a
                      href={selectedItem.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Visit Website <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-gray-700">Client</h3>
                    <p>{selectedItem.client}</p>
                  </div>
                  
                  {selectedItem.completionDate && (
                    <div>
                      <h3 className="font-medium text-gray-700">Completed</h3>
                      <p>{selectedItem.completionDate}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Technologies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.technologies?.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 max-h-64 overflow-auto whitespace-pre-line">
                    {selectedItem.description}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium text-gray-700 mb-1">URL</h3>
                  <p className="text-sm text-blue-600">/portfolio/{selectedItem.slug}</p>
                </div>
              </div>
            )}
            <DialogFooter>
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
              placeholder="Search projects..."
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
          <p>Error loading portfolio items: {(error as Error).message}</p>
        </div>
      ) : portfolioItems && portfolioItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Code className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No portfolio projects yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first project</p>
          <Button onClick={() => setIsNewItemDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Project
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No matching projects</h3>
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
          {filteredItems.map((item: any) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onPreview={handlePreviewItem}
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
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Technologies</TableHead>
                <TableHead className="w-[100px] text-center">Featured</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="max-w-full max-h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Error";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies && item.technologies.slice(0, 2).map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {item.technologies && item.technologies.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.featured ? 
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
                        <DropdownMenuItem onClick={() => handlePreviewItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(item.id, !item.featured)}>
                          {item.featured ? 
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
                          onClick={() => handleDeleteItem(item.id)}
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