import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Check, Edit, Eye, FileText, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/ui/optimized-image';
import AdminLayout from '@/components/layouts/admin-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

// Types
interface LandingPage {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateLandingPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  isActive: boolean;
  imageUrl?: string;
}

const AdminLandingPages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPage | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newLandingPage, setNewLandingPage] = useState<ICreateLandingPage>({
    slug: '',
    title: '',
    description: '',
    content: '',
    isActive: true,
    imageUrl: ''
  });

  // Fetch landing pages
  const { data: landingPages, isLoading, isError } = useQuery<LandingPage[]>({
    queryKey: ['/api/admin/landing-pages'],
  });

  // Create landing page mutation
  const createLandingPageMutation = useMutation({
    mutationFn: async (landingPage: ICreateLandingPage) => {
      const response = await apiRequest('POST', '/api/admin/landing-pages', landingPage);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Landing page created',
        description: 'The landing page has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] });
      setIsCreateModalOpen(false);
      setNewLandingPage({
        slug: '',
        title: '',
        description: '',
        content: '',
        isActive: true,
        imageUrl: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating landing page',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update landing page mutation
  const updateLandingPageMutation = useMutation({
    mutationFn: async (landingPage: LandingPage) => {
      const response = await apiRequest('PATCH', `/api/admin/landing-pages/${landingPage.id}`, landingPage);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Landing page updated',
        description: 'The landing page has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating landing page',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete landing page mutation
  const deleteLandingPageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/landing-pages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Landing page deleted',
        description: 'The landing page has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] });
      setIsDeleteModalOpen(false);
      setSelectedLandingPage(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting landing page',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle create landing page
  const handleCreateLandingPage = () => {
    createLandingPageMutation.mutate(newLandingPage);
  };

  // Handle update landing page
  const handleUpdateLandingPage = () => {
    if (selectedLandingPage) {
      updateLandingPageMutation.mutate(selectedLandingPage);
    }
  };

  // Handle delete landing page
  const handleDeleteLandingPage = () => {
    if (selectedLandingPage) {
      deleteLandingPageMutation.mutate(selectedLandingPage.id);
    }
  };

  // Filter landing pages based on search query and tab
  const filteredLandingPages = landingPages?.filter(landingPage => {
    const matchesQuery = landingPage.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         landingPage.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentTab === 'all') return matchesQuery;
    if (currentTab === 'active') return matchesQuery && landingPage.isActive;
    if (currentTab === 'inactive') return matchesQuery && !landingPage.isActive;
    
    return matchesQuery;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Landing Pages</h1>
          <p className="text-muted-foreground mb-6">There was an error loading the landing pages. Please try again later.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/landing-pages'] })}>
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Landing Pages | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Landing Pages</h1>
            <p className="text-muted-foreground">Manage your service landing pages and specialized content</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Landing Page
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
          <Input
            placeholder="Search landing pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator />

        {filteredLandingPages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Landing Pages Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'No landing pages match your search criteria.' : 'You haven\'t created any landing pages yet.'}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Landing Page
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLandingPages?.map((landingPage) => (
              <Card key={landingPage.id} className="overflow-hidden flex flex-col">
                <div className="relative h-40 bg-muted">
                  {landingPage.imageUrl ? (
                    <OptimizedImage
                      src={landingPage.imageUrl}
                      alt={landingPage.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {!landingPage.isActive && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-background">
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{landingPage.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">/{landingPage.slug}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {landingPage.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${landingPage.slug}`, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLandingPage(landingPage);
                        setIsEditModalOpen(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedLandingPage(landingPage);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Landing Page Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Landing Page</DialogTitle>
            <DialogDescription>
              Create a new custom landing page for your services or specialized content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Web Development Services"
                  value={newLandingPage.title}
                  onChange={(e) => setNewLandingPage({...newLandingPage, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Page Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="e.g., web-development"
                  value={newLandingPage.slug}
                  onChange={(e) => setNewLandingPage({...newLandingPage, slug: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  This will be the URL path: /{newLandingPage.slug || 'your-slug'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description for SEO and previews"
                value={newLandingPage.description}
                onChange={(e) => setNewLandingPage({...newLandingPage, description: e.target.value})}
                className="resize-none h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={newLandingPage.imageUrl || ''}
                onChange={(e) => setNewLandingPage({...newLandingPage, imageUrl: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="content">Page Content</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newLandingPage.isActive}
                    onCheckedChange={(checked) => setNewLandingPage({...newLandingPage, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <div data-color-mode="dark">
                <MDEditor
                  value={newLandingPage.content}
                  onChange={(val) => setNewLandingPage({...newLandingPage, content: val || ''})}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                  height={400}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateLandingPage}
              disabled={createLandingPageMutation.isPending}
              className="flex items-center gap-1"
            >
              {createLandingPageMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create Landing Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Landing Page Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Landing Page</DialogTitle>
            <DialogDescription>
              Update the details and content of your landing page.
            </DialogDescription>
          </DialogHeader>
          {selectedLandingPage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Page Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedLandingPage.title}
                    onChange={(e) => setSelectedLandingPage({...selectedLandingPage, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Page Slug (URL)</Label>
                  <Input
                    id="edit-slug"
                    value={selectedLandingPage.slug}
                    onChange={(e) => setSelectedLandingPage({...selectedLandingPage, slug: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be the URL path: /{selectedLandingPage.slug}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Meta Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedLandingPage.description}
                  onChange={(e) => setSelectedLandingPage({...selectedLandingPage, description: e.target.value})}
                  className="resize-none h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Cover Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={selectedLandingPage.imageUrl || ''}
                  onChange={(e) => setSelectedLandingPage({...selectedLandingPage, imageUrl: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="edit-content">Page Content</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-isActive"
                      checked={selectedLandingPage.isActive}
                      onCheckedChange={(checked) => setSelectedLandingPage({...selectedLandingPage, isActive: checked})}
                    />
                    <Label htmlFor="edit-isActive">Active</Label>
                  </div>
                </div>
                <div data-color-mode="dark">
                  <MDEditor
                    value={selectedLandingPage.content}
                    onChange={(val) => setSelectedLandingPage({...selectedLandingPage, content: val || ''})}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    height={400}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLandingPage}
              disabled={updateLandingPageMutation.isPending}
              className="flex items-center gap-1"
            >
              {updateLandingPageMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Landing Page Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Landing Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this landing page? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLandingPage}
              disabled={deleteLandingPageMutation.isPending}
              className="flex items-center gap-1"
            >
              {deleteLandingPageMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Landing Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLandingPages;