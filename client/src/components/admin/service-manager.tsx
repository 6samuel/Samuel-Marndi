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
  Move,
  Image,
  Package
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

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters"),
  iconName: z.string(),
  imageUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const iconOptions = [
  "Code", "Globe", "Layout", "Smartphone", "ShoppingCart", "Server", 
  "Image", "PenTool", "BarChart", "Search", "MessageSquare", "Share2",
  "Database", "Link", "Award", "Zap", "Shield", "Monitor"
];

interface ServiceCardProps {
  service: any;
  onEdit: (service: any) => void;
  onDelete: (id: number) => void;
  onPreview: (service: any) => void;
  onToggleFeatured: (id: number, featured: boolean) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}

function ServiceCard({ 
  service, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleFeatured,
  onReorder 
}: ServiceCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{service.title}</CardTitle>
            <CardDescription className="text-sm">
              /{service.slug}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {service.featured && <Badge>Featured</Badge>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(service)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPreview(service)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFeatured(service.id, !service.featured)}>
                  {service.featured ? 
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Remove Featured
                    </> :
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Mark as Featured
                    </>
                  }
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onReorder(service.id, 'up')}>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Move Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReorder(service.id, 'down')}>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Move Down
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => onDelete(service.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex items-start gap-3">
          {service.imageUrl && (
            <img 
              src={service.imageUrl} 
              alt={service.title} 
              className="w-20 h-20 object-cover rounded-md"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{service.shortDescription}</p>
            <div className="flex gap-2 items-center text-xs text-gray-500">
              <span className="flex items-center">
                <Package className="h-3 w-3 mr-1" />
                Icon: {service.iconName}
              </span>
              <span className="flex items-center">
                <Move className="h-3 w-3 mr-1" />
                Order: {service.displayOrder}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
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
      iconName: "Code",
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
      iconName: "Code", 
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
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      // Find the current service and adjacent service
      const currentService = services.find((s: any) => s.id === id);
      
      if (!currentService) return;
      
      // Sort services by display order
      const sortedServices = [...services].sort((a: any, b: any) => 
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      
      // Find the current index
      const currentIndex = sortedServices.findIndex((s: any) => s.id === id);
      
      // Check if we can move in the requested direction
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedServices.length - 1)
      ) {
        return;
      }
      
      // Find the adjacent service
      const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const adjacentService = sortedServices[adjacentIndex];
      
      // Swap display orders
      const res = await apiRequest("PUT", `/api/services/${id}`, { 
        displayOrder: adjacentService.displayOrder 
      });
      
      const res2 = await apiRequest("PUT", `/api/services/${adjacentService.id}`, { 
        displayOrder: currentService.displayOrder 
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service reordered",
        description: "The service order has been updated.",
      });
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
      imageUrl: service.imageUrl || "",
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
  
  const handleReorderService = (id: number, direction: 'up' | 'down') => {
    reorderServiceMutation.mutate({ id, direction });
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
          service.slug.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];
  
  // Sort services by display order
  const sortedServices = filteredServices && filteredServices.length > 0
    ? [...filteredServices].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your service offerings and details
          </p>
        </div>
        <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create new service</DialogTitle>
              <DialogDescription>
                Add a new service to your offerings
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateService)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
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
                            Used in the URL: /services/{field.value || "example-slug"}
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
                              placeholder="Brief description of the service" 
                              {...field} 
                              rows={2}
                            />
                          </FormControl>
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
                              <SelectContent>
                                {iconOptions.map(icon => (
                                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
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
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex gap-4 items-center">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Service</FormLabel>
                              <FormDescription>
                                Show this service on the homepage
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
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the service" 
                              {...field} 
                              rows={8}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
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
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Update service</DialogTitle>
              <DialogDescription>
                Edit your existing service
              </DialogDescription>
            </DialogHeader>
            {selectedService && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateService)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
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
                              <Textarea {...field} rows={2} />
                            </FormControl>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {iconOptions.map(icon => (
                                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
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
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex gap-4 items-center">
                        <FormField
                          control={updateForm.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Featured Service</FormLabel>
                                <FormDescription>
                                  Show this service on the homepage
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
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={updateForm.control}
                        name="fullDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={8} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={updateForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
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
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedService?.title}</DialogTitle>
              <DialogDescription>
                Service Preview
              </DialogDescription>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-4">
                {selectedService.imageUrl && (
                  <div className="rounded-md overflow-hidden h-48">
                    <img 
                      src={selectedService.imageUrl} 
                      alt={selectedService.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant={selectedService.featured ? "default" : "outline"}>
                    {selectedService.featured ? "Featured" : "Not Featured"}
                  </Badge>
                  <Badge variant="outline">
                    Order: {selectedService.displayOrder}
                  </Badge>
                  <Badge variant="outline">
                    Icon: {selectedService.iconName}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold mb-1">Short Description</h3>
                  <p className="text-sm text-gray-700">{selectedService.shortDescription}</p>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold mb-1">Full Description</h3>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 max-h-64 overflow-auto whitespace-pre-line">
                    {selectedService.fullDescription}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-base font-semibold mb-1">URL</h3>
                  <p className="text-sm text-blue-600">/services/{selectedService.slug}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
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
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first service</p>
          <Button onClick={() => setIsNewServiceDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Service
          </Button>
        </div>
      ) : sortedServices.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No matching services</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search query</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Reset Search
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
              onReorder={handleReorderService}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="w-[100px] text-center">Featured</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedServices.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.displayOrder}</TableCell>
                  <TableCell>{service.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{service.slug}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="line-clamp-1">{service.shortDescription}</span>
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
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePreviewService(service)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(service.id, !service.featured)}>
                          {service.featured ? 
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Remove Featured
                            </> :
                            <>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Mark as Featured
                            </>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleReorderService(service.id, 'up')}>
                          <ChevronUp className="mr-2 h-4 w-4" />
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReorderService(service.id, 'down')}>
                          <ChevronDown className="mr-2 h-4 w-4" />
                          Move Down
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