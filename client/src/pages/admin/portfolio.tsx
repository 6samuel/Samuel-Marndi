import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { PortfolioItem } from "@shared/schema";
import { ArrowDown, ArrowUp, Copy, Edit, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminPortfolio() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    category: "",
    description: "",
    imageUrl: "",
    featured: false,
    completionDate: "",
    technologies: "",
    websiteUrl: ""
  });

  // Fetch portfolio items with React Query handling the loading state
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ["/api/portfolio-items"],
    queryFn: async () => {
      const response = await fetch("/api/portfolio-items", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
      }
      
      return await response.json() as PortfolioItem[];
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 1000 // 1 second, to prevent redundant requests
  });
  
  // Safely access portfolio data
  const portfolioItems = portfolioData || [];
  
  // Mutation for creating a portfolio item
  const createMutation = useMutation({
    mutationFn: async (newItem: Omit<PortfolioItem, 'id'>) => {
      const res = await apiRequest('POST', '/api/portfolio-items', newItem);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item created",
        description: "The item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-items'] });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create portfolio item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating a portfolio item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<PortfolioItem> }) => {
      const res = await apiRequest('PATCH', `/api/portfolio-items/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item updated",
        description: "The item has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-items'] });
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update portfolio item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting a portfolio item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/portfolio-items/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Portfolio item deleted",
        description: "The item has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-items'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete portfolio item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Function to handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  // Function to handle technologies input (convert comma-separated string to array when submitting)
  const formatFormDataForSubmission = () => {
    return {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
    };
  };
  
  // Function to open edit dialog
  const handleEdit = (item: PortfolioItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      client: item.client,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      featured: item.featured || false,
      completionDate: item.completionDate || "",
      technologies: item.technologies?.join(', ') || "",
      websiteUrl: item.websiteUrl || ""
    });
    setIsEditDialogOpen(true);
  };
  
  // Function to open delete dialog
  const handleDelete = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to duplicate a portfolio item
  const handleDuplicate = (item: PortfolioItem) => {
    setFormData({
      ...item,
      title: `${item.title} (Copy)`,
      slug: `${item.slug}-copy`,
      technologies: item.technologies?.join(', ') || "",
      id: undefined
    } as any);
    setIsAddDialogOpen(true);
  };
  
  // Function to reset form
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      client: "",
      category: "",
      description: "",
      imageUrl: "",
      featured: false,
      completionDate: "",
      technologies: "",
      websiteUrl: ""
    });
    setSelectedItem(null);
  };

  return (
    <>
      <Helmet>
        <title>Manage Portfolio - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Portfolio">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Portfolio Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Portfolio Item</DialogTitle>
                  <DialogDescription>
                    Showcase your work by adding a new portfolio item.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. E-commerce Website"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="e.g. ecommerce-website"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        name="client"
                        value={formData.client}
                        onChange={handleInputChange}
                        placeholder="e.g. ABC Company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g. Web Development"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the project"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="completionDate">Completion Date</Label>
                      <Input
                        id="completionDate"
                        name="completionDate"
                        value={formData.completionDate}
                        onChange={handleInputChange}
                        placeholder="e.g. January 2023"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="technologies"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleInputChange}
                      placeholder="e.g. React, Node.js, PostgreSQL"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="featured">Featured Portfolio Item</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => createMutation.mutate(formatFormDataForSubmission())}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading portfolio items...</div>
            ) : portfolioItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {portfolioItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">{item.client}</td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3 text-center">
                          {item.featured ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                No portfolio items found. Add your first portfolio item to get started.
              </div>
            )}
          </div>
          
          {/* Edit Portfolio Item Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Portfolio Item</DialogTitle>
                <DialogDescription>
                  Make changes to the portfolio item details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-slug">Slug</Label>
                    <Input
                      id="edit-slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-client">Client</Label>
                    <Input
                      id="edit-client"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl">Image URL</Label>
                  <Input
                    id="edit-imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-completionDate">Completion Date</Label>
                    <Input
                      id="edit-completionDate"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-websiteUrl">Website URL</Label>
                    <Input
                      id="edit-websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="edit-technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-featured"
                    checked={formData.featured}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="edit-featured">Featured Portfolio Item</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => updateMutation.mutate({
                    id: selectedItem?.id || 0,
                    data: formatFormDataForSubmission()
                  })}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the portfolio item "{selectedItem?.title}". 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteMutation.mutate(selectedItem?.id || 0)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AdminLayout>
    </>
  );
}