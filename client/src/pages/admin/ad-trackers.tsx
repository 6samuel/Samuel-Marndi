import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/admin-layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Pencil, 
  Trash2, 
  BarChart3, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  PlusCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Type definitions for our ad trackers
interface AdTracker {
  id: number;
  name: string;
  campaignId: string;
  platform: string;
  parameters: Record<string, any>;
  conversionGoal: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdTrackerHit {
  id: number;
  trackerId: number;
  sourcePlatform: string;
  sourceUrl: string | null;
  pageUrl: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  converted: boolean;
  conversionType: string | null;
  timestamp: string;
  sessionId: string | null;
  extraData: Record<string, any>;
}

interface TrackerAnalytics {
  trackerId: number;
  trackerName: string;
  platform: string;
  totalHits: number;
  conversionRate: number;
  sourcesBreakdown: Record<string, number>;
  deviceTypeBreakdown: Record<string, number>;
}

// Form schema for creating/editing trackers
const trackerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  campaignId: z.string().min(1, 'Campaign ID is required'),
  platform: z.string().min(1, 'Platform is required'),
  conversionGoal: z.string().min(1, 'Conversion goal is required'),
  active: z.boolean().default(true),
  parameters: z.string().optional()
});

type TrackerFormValues = z.infer<typeof trackerFormSchema>;

export default function AdTrackers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTracker, setSelectedTracker] = useState<AdTracker | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedTrackerAnalytics, setSelectedTrackerAnalytics] = useState<TrackerAnalytics | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("details");
  const [selectedTrackerHits, setSelectedTrackerHits] = useState<AdTrackerHit[]>([]);

  // Fetch all trackers
  const { data: trackers, isLoading } = useQuery<AdTracker[]>({
    queryKey: ['/api/ad-trackers'],
    enabled: true,
  });

  // Create form
  const createForm = useForm<TrackerFormValues>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: {
      name: '',
      campaignId: '',
      platform: 'google',
      conversionGoal: 'lead',
      active: true,
      parameters: '{}'
    }
  });

  // Edit form
  const editForm = useForm<TrackerFormValues>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: {
      name: '',
      campaignId: '',
      platform: 'google',
      conversionGoal: 'lead',
      active: true,
      parameters: '{}'
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: TrackerFormValues) => {
      // Convert parameters from string to object
      let parsedParams = {};
      try {
        parsedParams = values.parameters ? JSON.parse(values.parameters) : {};
      } catch (e) {
        toast({
          title: "Invalid parameters format",
          description: "Parameters must be valid JSON",
          variant: "destructive"
        });
        throw new Error("Invalid parameters format");
      }

      const payload = {
        ...values,
        parameters: parsedParams
      };

      const res = await apiRequest('POST', '/api/ad-trackers', payload);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-trackers'] });
      setIsCreateModalOpen(false);
      createForm.reset();
      toast({
        title: "Tracker created",
        description: "Ad tracker has been created successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating tracker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number, values: TrackerFormValues }) => {
      // Convert parameters from string to object
      let parsedParams = {};
      try {
        parsedParams = values.parameters ? JSON.parse(values.parameters) : {};
      } catch (e) {
        toast({
          title: "Invalid parameters format",
          description: "Parameters must be valid JSON",
          variant: "destructive"
        });
        throw new Error("Invalid parameters format");
      }

      const payload = {
        ...values,
        parameters: parsedParams
      };

      const res = await apiRequest('PATCH', `/api/ad-trackers/${id}`, payload);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-trackers'] });
      setIsEditModalOpen(false);
      editForm.reset();
      toast({
        title: "Tracker updated",
        description: "Ad tracker has been updated successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating tracker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PATCH', `/api/ad-trackers/${id}/toggle-status`, {});
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-trackers'] });
      toast({
        title: data.tracker.active ? "Tracker activated" : "Tracker deactivated",
        description: `Tracker has been ${data.tracker.active ? 'activated' : 'deactivated'} successfully`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error toggling tracker status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/ad-trackers/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-trackers'] });
      setIsDeleteModalOpen(false);
      setSelectedTracker(null);
      toast({
        title: "Tracker deleted",
        description: "Ad tracker has been deleted successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting tracker",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Get tracker analytics 
  const getTrackerAnalytics = async (tracker: AdTracker) => {
    try {
      const res = await apiRequest('GET', `/api/ad-trackers/${tracker.id}/analytics`);
      const data = await res.json();
      setSelectedTrackerAnalytics(data);
      setIsAnalyticsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error fetching analytics",
        description: "Could not fetch analytics data for this tracker",
        variant: "destructive"
      });
    }
  };

  // Get tracker hits
  const getTrackerHits = async (tracker: AdTracker) => {
    try {
      const res = await apiRequest('GET', `/api/ad-trackers/${tracker.id}/hits`);
      const data: AdTrackerHit[] = await res.json();
      setSelectedTrackerHits(data);
      setSelectedTab("hits");
    } catch (error) {
      toast({
        title: "Error fetching hits",
        description: "Could not fetch hits data for this tracker",
        variant: "destructive"
      });
    }
  };

  // Handle edit button click
  const handleEditClick = (tracker: AdTracker) => {
    setSelectedTracker(tracker);
    
    // Initialize form with tracker values
    editForm.reset({
      name: tracker.name,
      campaignId: tracker.campaignId,
      platform: tracker.platform,
      conversionGoal: tracker.conversionGoal,
      active: tracker.active,
      parameters: JSON.stringify(tracker.parameters, null, 2)
    });
    
    setIsEditModalOpen(true);
  };

  // Handle view analytics click
  const handleAnalyticsClick = async (tracker: AdTracker) => {
    setSelectedTracker(tracker);
    await getTrackerAnalytics(tracker);
    await getTrackerHits(tracker);
  };

  // Handle create form submission
  const onCreateSubmit = (values: TrackerFormValues) => {
    createMutation.mutate(values);
  };

  // Handle edit form submission
  const onEditSubmit = (values: TrackerFormValues) => {
    if (selectedTracker) {
      updateMutation.mutate({ id: selectedTracker.id, values });
    }
  };

  // Generate tracking code snippet for a tracker
  const generateTrackingCode = (tracker: AdTracker) => {
    return `
// Add this code to your pages where you want to track visits
const trackingUrl = new URL(window.location.href);
trackingUrl.searchParams.append('utm_id', '${tracker.id}');
trackingUrl.searchParams.append('utm_source', '${tracker.platform}');
trackingUrl.searchParams.append('utm_campaign', '${tracker.campaignId}');
trackingUrl.searchParams.append('utm_session', 'session_' + Math.random().toString(36).substring(2, 12));

// Use this URL in your marketing campaigns
console.log('Tracking URL:', trackingUrl.toString());

// For conversion tracking, make a POST request
async function recordConversion(sessionId, type = 'lead') {
  await fetch('/api/ad-trackers/${tracker.id}/conversion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: sessionId,
      conversionType: type,
    }),
  });
}
`;
  };

  return (
    <AdminLayout title="Ad Trackers" description="Manage marketing campaign tracking">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ad Trackers</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Tracker
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      ) : !trackers || trackers.length === 0 ? (
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No trackers found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any ad trackers yet. Create one to start monitoring your marketing campaigns.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create your first tracker
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Trackers</CardTitle>
            <CardDescription>
              Manage and monitor your marketing campaign trackers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Conversion Goal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackers.map((tracker) => (
                  <TableRow key={tracker.id}>
                    <TableCell className="font-medium">{tracker.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {tracker.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>{tracker.campaignId}</TableCell>
                    <TableCell>{tracker.conversionGoal}</TableCell>
                    <TableCell>
                      {tracker.active ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(tracker.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(tracker.id)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {tracker.active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAnalyticsClick(tracker)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(tracker)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedTracker(tracker);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Tracker Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Tracker</DialogTitle>
            <DialogDescription>
              Create a new marketing tracker to monitor campaign performance
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracker Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Campaign 2023" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this tracking campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign ID</FormLabel>
                    <FormControl>
                      <Input placeholder="summer_2023" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The marketing platform for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="conversionGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversion Goal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lead">Lead Generation</SelectItem>
                          <SelectItem value="contact">Contact Form</SelectItem>
                          <SelectItem value="signup">Sign Up</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="download">Download</SelectItem>
                          <SelectItem value="pageview">Page View</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The primary goal for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={createForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Activate Tracker
                      </FormLabel>
                      <FormDescription>
                        Enable tracking for this campaign immediately
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
              
              <FormField
                control={createForm.control}
                name="parameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Parameters (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="{}" 
                        className="font-mono h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add custom parameters as a JSON object
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Tracker
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tracker Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tracker</DialogTitle>
            <DialogDescription>
              Edit your marketing tracker settings
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracker Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this tracking campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for this campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The marketing platform for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="conversionGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversion Goal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lead">Lead Generation</SelectItem>
                          <SelectItem value="contact">Contact Form</SelectItem>
                          <SelectItem value="signup">Sign Up</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="download">Download</SelectItem>
                          <SelectItem value="pageview">Page View</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The primary goal for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Activate Tracker
                      </FormLabel>
                      <FormDescription>
                        Toggle tracking status for this campaign
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
              
              <FormField
                control={editForm.control}
                name="parameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Parameters (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="font-mono h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add custom parameters as a JSON object
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Tracker
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tracker? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTracker && (
            <div className="py-4">
              <p><strong>Name:</strong> {selectedTracker.name}</p>
              <p><strong>Platform:</strong> {selectedTracker.platform}</p>
              <p><strong>Campaign ID:</strong> {selectedTracker.campaignId}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedTracker && deleteMutation.mutate(selectedTracker.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Tracker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Tracker Analytics</DialogTitle>
            <DialogDescription>
              {selectedTracker && `Performance data for ${selectedTracker.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Analytics Overview</TabsTrigger>
              <TabsTrigger value="hits">Traffic Hits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              {selectedTrackerAnalytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium">Total Hits</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-2xl font-bold">{selectedTrackerAnalytics.totalHits}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-2xl font-bold">{selectedTrackerAnalytics.conversionRate}%</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium">Platform</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-xl font-medium capitalize">{selectedTrackerAnalytics.platform}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        {selectedTracker?.active ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {Object.keys(selectedTrackerAnalytics.sourcesBreakdown).length > 0 ? (
                          <ul className="space-y-2">
                            {Object.entries(selectedTrackerAnalytics.sourcesBreakdown).map(([source, count]) => (
                              <li key={source} className="flex justify-between items-center">
                                <span className="capitalize">{source}</span>
                                <Badge variant="outline">{count}</Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No source data available</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Device Types</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {Object.keys(selectedTrackerAnalytics.deviceTypeBreakdown).length > 0 ? (
                          <ul className="space-y-2">
                            {Object.entries(selectedTrackerAnalytics.deviceTypeBreakdown).map(([device, count]) => (
                              <li key={device} className="flex justify-between items-center">
                                <span className="capitalize">{device || 'Unknown'}</span>
                                <Badge variant="outline">{count}</Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No device data available</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedTracker && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Implementation Code</CardTitle>
                        <CardDescription>
                          Use this code to track your marketing campaigns
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto text-xs">
                          {generateTrackingCode(selectedTracker)}
                        </pre>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generateTrackingCode(selectedTracker));
                            toast({
                              title: "Code copied",
                              description: "Tracking code copied to clipboard"
                            });
                          }}
                        >
                          Copy Code
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hits" className="pt-4">
              {selectedTrackerHits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Converted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTrackerHits.map((hit) => (
                      <TableRow key={hit.id}>
                        <TableCell>
                          {new Date(hit.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {hit.sourcePlatform}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={hit.pageUrl}>
                          {hit.pageUrl}
                        </TableCell>
                        <TableCell className="capitalize">
                          {hit.deviceType || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {hit.converted ? (
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {hit.conversionType || 'Yes'}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              No
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hit data available for this tracker</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnalyticsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}