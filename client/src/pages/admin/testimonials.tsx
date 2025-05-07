import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Testimonial } from "@shared/schema";
import { Copy, Edit, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminTestimonials() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    testimonial: "",
    imageUrl: "",
    rating: 5,
    featured: false
  });

  // Fetch testimonials with React Query handling loading state
  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.statusText}`);
      }
      
      return await response.json() as Testimonial[];
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 1000 // 1 second, to prevent redundant requests
  });
  
  // Safely access testimonial data
  const testimonials = testimonialData || [];
  
  // Mutation for creating a testimonial
  const createMutation = useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'id'>) => {
      const res = await apiRequest('POST', '/api/testimonials', newTestimonial);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial created",
        description: "The testimonial has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create testimonial",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating a testimonial
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Testimonial> }) => {
      const res = await apiRequest('PATCH', `/api/testimonials/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update testimonial",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting a testimonial
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete testimonial",
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
  
  // Function to handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  // Function to handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  // Function to open edit dialog
  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company || "",
      role: testimonial.role || "",
      testimonial: testimonial.testimonial,
      imageUrl: testimonial.imageUrl || "",
      rating: testimonial.rating || 5,
      featured: testimonial.featured || false
    });
    setIsEditDialogOpen(true);
  };
  
  // Function to open delete dialog
  const handleDelete = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to duplicate a testimonial
  const handleDuplicate = (testimonial: Testimonial) => {
    setFormData({
      name: `${testimonial.name} (Copy)`,
      company: testimonial.company || "",
      role: testimonial.role || "",
      testimonial: testimonial.testimonial,
      imageUrl: testimonial.imageUrl || "",
      rating: testimonial.rating || 5,
      featured: false
    });
    setIsAddDialogOpen(true);
  };
  
  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      role: "",
      testimonial: "",
      imageUrl: "",
      rating: 5,
      featured: false
    });
    setSelectedTestimonial(null);
  };

  return (
    <>
      <Helmet>
        <title>Manage Testimonials - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Testimonials">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Testimonial</DialogTitle>
                  <DialogDescription>
                    Add a client testimonial to showcase on your website.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. ABC Company"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role/Position</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. CEO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial">Testimonial Text</Label>
                    <Textarea
                      id="testimonial"
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleInputChange}
                      placeholder="What the client said about your services"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Client Photo URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleNumberChange}
                      />
                    </div>
                    <div className="flex items-end space-x-2 h-full pb-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="featured">Featured Testimonial</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => createMutation.mutate(formData)}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Testimonial
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading testimonials...</div>
            ) : testimonials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Company</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-center">Rating</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{testimonial.name}</td>
                        <td className="px-4 py-3">{testimonial.company}</td>
                        <td className="px-4 py-3">{testimonial.role}</td>
                        <td className="px-4 py-3 text-center">{testimonial.rating}/5</td>
                        <td className="px-4 py-3 text-center">
                          {testimonial.featured ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(testimonial)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(testimonial)}
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
                No testimonials found. Add your first testimonial to get started.
              </div>
            )}
          </div>
          
          {/* Edit Testimonial Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Testimonial</DialogTitle>
                <DialogDescription>
                  Make changes to the testimonial.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Client Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Company</Label>
                    <Input
                      id="edit-company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role/Position</Label>
                  <Input
                    id="edit-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-testimonial">Testimonial Text</Label>
                  <Textarea
                    id="edit-testimonial"
                    name="testimonial"
                    value={formData.testimonial}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl">Client Photo URL</Label>
                  <Input
                    id="edit-imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-rating">Rating (1-5)</Label>
                    <Input
                      id="edit-rating"
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={handleNumberChange}
                    />
                  </div>
                  <div className="flex items-end space-x-2 h-full pb-2">
                    <Checkbox
                      id="edit-featured"
                      checked={formData.featured}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="edit-featured">Featured Testimonial</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => updateMutation.mutate({
                    id: selectedTestimonial?.id || 0,
                    data: formData
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
                  This will permanently delete the testimonial from {selectedTestimonial?.name}. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteMutation.mutate(selectedTestimonial?.id || 0)}
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