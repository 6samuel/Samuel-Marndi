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
  AlertCircle,
  Save,
  CheckIcon,
  XCircle,
  Code,
  LucideIcon,
  Globe,
  Star,
  Move,
  ArrowUp,
  ArrowDown,
  Layers,
  Link
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

// List of available Lucide icons to choose from
const availableIcons = [
  "Code",
  "Globe",
  "Star",
  "Layers",
  "Link",
  "BarChart",
  "Book",
  "Brain",
  "Building",
  "Cog",
  "Cpu",
  "Database",
  "FileCode",
  "Fingerprint",
  "HardDrive",
  "LineChart",
  "Megaphone",
  "MessageSquare",
  "Mobile",
  "MonitorSmartphone",
  "Palette",
  "Rocket",
  "Search",
  "Server",
  "Settings",
  "Shield",
  "ShoppingCart",
  "Smartphone",
  "Table",
  "Tablet",
  "Terminal",
  "Truck",
  "Users",
  "Zap"
];

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters long"),
  fullDescription: z.string().min(100, "Full description must be at least 100 characters long"),
  iconName: z.string().min(1, "Icon is required"),
  imageUrl: z.string().url("Please enter a valid URL"),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().nonnegative("Display order must be a non-negative number"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceCardProps {
  service: any;
  onEdit: (service: any) => void;
  onDelete: (id: number) => void;
  onPreview: (service: any) => void;
  onToggleFeatured: (id: number, featured: boolean) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
}

function ServiceCard({ 
  service, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleFeatured,
  onMoveUp,
  onMoveDown
}: ServiceCardProps) {
  // Dynamically get the icon component
  const IconComponent = (service.iconName && typeof service.iconName === 'string') 
    ? (globalThis as any)['lucide-react'][service.iconName] 
    : Code;
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={service.imageUrl} 
          alt={service.title} 
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
            onClick={() => onPreview(service)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onEdit(service)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {IconComponent && <IconComponent className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription className="text-xs">
                /services/{service.slug}
              </CardDescription>
            </div>
          </div>
          {service.featured && <Badge>Featured</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <p className="text-sm line-clamp-3">{service.shortDescription}</p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between border-t">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMoveUp(service.id)}
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMoveDown(service.id)}
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500 flex items-center px-2">
            Order: {service.displayOrder}
          </span>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFeatured(service.id, !service.featured)}
          >
            {service.featured ? (
              <>
                <XCircle className="h-4 w-4 mr-1.5" />
                Unfeature
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-1.5" />
                Feature
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
            onClick={() => onDelete(service.id)}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ServiceManager() {
  const { toast } = useToast();
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  
  const queryClient = useQueryClient();
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      iconName: "",
      imageUrl: "",
      featured: false,
      displayOrder: 0,
    },
  });

  const updateForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      iconName: "",
      imageUrl: "",
      featured: false,
      displayOrder: 0,
    },
  });
  
  const { data: services, isLoading, error } = useQuery({
    queryKey: ["/api/services"],
    refetchOnWindowFocus: false,
  });
  
  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormValues) => {
      const res = await apiRequest("POST", "/api/services", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service created",
        description: "Your service has been created successfully.",
      });
      form.reset();
      setIsNewServiceDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating service",
        description: error.message || "An error occurred while creating the service.",
        variant: "destructive",
      });
    },
  });
  
  const updateServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormValues & { id: number }) => {
      const { id, ...serviceData } = data;
      const res = await apiRequest("PUT", `/api/services/${id}`, serviceData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service updated",
        description: "Your service has been updated successfully.",
      });
      updateForm.reset();
      setIsUpdateDialogOpen(false);
      setSelectedService(null);
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating service",
        description: error.message || "An error occurred while updating the service.",
        variant: "destructive",
      });
    },
  });
  
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/services/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service deleted",
        description: "The service has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting service",
        description: error.message || "An error occurred while deleting the service.",
        variant: "destructive",
      });
    },
  });
  
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/services/${id}`, { featured });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service updated",
        description: "Featured status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating service",
        description: error.message || "An error occurred while updating the service.",
        variant: "destructive",
      });
    },
  });
  
  const reorderServiceMutation = useMutation({
    mutationFn: async ({ id, displayOrder }: { id: number; displayOrder: number }) => {
      const res = await apiRequest("PATCH", `/api/services/${id}`, { displayOrder });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error reordering service",
        description: error.message || "An error occurred while reordering the service.",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateService = (values: ServiceFormValues) => {
    // Generate a slug from title if not provided
    if (!values.slug && values.title) {
      values.slug = values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      if (values.slug.length < 3) {
        values.slug = values.slug + "-service";
      }
    }
    
    createServiceMutation.mutate(values);
  };
  
  const handleUpdateService = (values: ServiceFormValues) => {
    if (selectedService) {
      updateServiceMutation.mutate({ ...values, id: selectedService.id });
    }
  };
  
  const handleEditService = (service: any) => {
    setSelectedService(service);
    updateForm.reset({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      iconName: service.iconName,
      imageUrl: service.imageUrl,
      featured: service.featured || false,
      displayOrder: service.displayOrder || 0,
    });
    setIsUpdateDialogOpen(true);
  };
  
  const handleDeleteService = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  };
  
  const handlePreviewService = (service: any) => {
    setSelectedService(service);
    setIsPreviewDialogOpen(true);
  };
  
  const handleToggleFeatured = (id: number, featured: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured });
  };
  
  const handleMoveUp = (id: number) => {
    if (!services) return;
    
    const serviceList = [...services];
    const currentIndex = serviceList.findIndex((s: any) => s.id === id);
    if (currentIndex <= 0) return; // Already at the top
    
    const currentService = serviceList[currentIndex];
    const prevService = serviceList[currentIndex - 1];
    
    // Swap display orders
    reorderServiceMutation.mutate({ 
      id: currentService.id, 
      displayOrder: prevService.displayOrder 
    });
    reorderServiceMutation.mutate({ 
      id: prevService.id, 
      displayOrder: currentService.displayOrder 
    });
  };
  
  const handleMoveDown = (id: number) => {
    if (!services) return;
    
    const serviceList = [...services];
    const currentIndex = serviceList.findIndex((s: any) => s.id === id);
    if (currentIndex === -1 || currentIndex >= serviceList.length - 1) return; // Already at the bottom
    
    const currentService = serviceList[currentIndex];
    const nextService = serviceList[currentIndex + 1];
    
    // Swap display orders
    reorderServiceMutation.mutate({ 
      id: currentService.id, 
      displayOrder: nextService.displayOrder 
    });
    reorderServiceMutation.mutate({ 
      id: nextService.id, 
      displayOrder: currentService.displayOrder 
    });
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
    
    return slug.length < 3 ? slug + "-service" : slug;
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
  
  // Filter services based on search query
  const filteredServices = services 
    ? services.filter((service: any) => {
        return searchQuery === "" || 
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];
  
  // Sort services by display order
  const sortedServices = [...(filteredServices || [])].sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  );
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your service offerings and descriptions
          </p>
        </div>
        <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service to your offerings
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateService)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Development" {...field} />
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
                            <Input placeholder="web-development" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used in the URL: /services/{field.value || "example-service"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A brief summary of the service..." 
                              {...field} 
                              rows={2}
                            />
                          </FormControl>
                          <FormDescription>
                            Displayed in service listings and cards
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="iconName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select icon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[280px]">
                                {availableIcons.map(iconName => (
                                  <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center">
                                      {iconName}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="displayOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Lower numbers appear first
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Service</FormLabel>
                            <FormDescription>
                              Feature this service on the homepage
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
                      name="fullDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A detailed description of the service..." 
                              {...field} 
                              rows={16}
                            />
                          </FormControl>
                          <FormDescription>
                            Displayed on the service detail page. Markdown supported.
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
                    disabled={createServiceMutation.isPending}
                  >
                    {createServiceMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Service
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Service Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Service</DialogTitle>
              <DialogDescription>
                Edit your existing service
              </DialogDescription>
            </DialogHeader>
            {selectedService && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateService)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={updateForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Title</FormLabel>
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
                              Used in the URL: /services/{field.value}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={2}
                              />
                            </FormControl>
                            <FormDescription>
                              Displayed in service listings and cards
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={updateForm.control}
                          name="iconName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[280px]">
                                  {availableIcons.map(iconName => (
                                    <SelectItem key={iconName} value={iconName}>
                                      <div className="flex items-center">
                                        {iconName}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={updateForm.control}
                          name="displayOrder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Lower numbers appear first
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={updateForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Service</FormLabel>
                              <FormDescription>
                                Feature this service on the homepage
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
                        name="fullDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={16}
                              />
                            </FormControl>
                            <FormDescription>
                              Displayed on the service detail page. Markdown supported.
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
                      disabled={updateServiceMutation.isPending}
                    >
                      {updateServiceMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Service
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Preview Service Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedService?.title}</DialogTitle>
              <DialogDescription>
                Service Preview
              </DialogDescription>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden h-60">
                  <img 
                    src={selectedService.imageUrl} 
                    alt={selectedService.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Image+Not+Found";
                    }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {React.createElement(
                        (globalThis as any)['lucide-react'][selectedService.iconName] || Code, 
                        { className: "h-5 w-5" }
                      )}
                    </div>
                    <h3 className="text-lg font-medium">{selectedService.title}</h3>
                  </div>
                  
                  {selectedService.featured && <Badge>Featured</Badge>}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Short Description</h4>
                  <p className="text-gray-600">{selectedService.shortDescription}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Display Order</h4>
                  <p className="text-gray-600">{selectedService.displayOrder}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Full Description</h4>
                  <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-700 max-h-96 overflow-auto whitespace-pre-line">
                    {selectedService.fullDescription}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">URL</h4>
                  <p className="text-sm text-blue-600">/services/{selectedService.slug}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleEditService(selectedService)}
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
      
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
          <p>Error loading services: {(error as Error).message}</p>
        </div>
      ) : services && services.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Code className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first service</p>
          <Button onClick={() => setIsNewServiceDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Service
          </Button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No matching services</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search query</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedServices.map((service: any) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onPreview={handlePreviewService}
              onToggleFeatured={handleToggleFeatured}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Short Description</TableHead>
                <TableHead className="hidden md:table-cell">Icon</TableHead>
                <TableHead className="w-[100px] text-center">Featured</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedServices.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {service.displayOrder}
                      <div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleMoveUp(service.id)}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleMoveDown(service.id)}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={service.imageUrl} 
                        alt={service.title} 
                        className="max-w-full max-h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Error";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <div className="truncate">{service.title}</div>
                      <div className="text-xs text-gray-500 truncate">/services/{service.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <div className="truncate">{service.shortDescription}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {React.createElement(
                        (globalThis as any)['lucide-react'][service.iconName] || Code, 
                        { className: "h-5 w-5" }
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {service.featured ? 
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
                        <DropdownMenuItem onClick={() => handlePreviewService(service)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(service.id, !service.featured)}>
                          {service.featured ? 
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Remove Featured
                            </> :
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Mark as Featured
                            </>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteService(service.id)}
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