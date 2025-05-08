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
  Calendar,
  Flag,
  CheckCircle,
  XCircle,
  Megaphone,
  Target,
  BarChart,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Search,
  EyeIcon,
  RefreshCw
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
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

const activitySchema = z.object({
  name: z.string().min(3, "Activity name must be at least 3 characters long"),
  description: z.string().optional(),
  type: z.string(),
  budget: z.coerce.number().min(0, "Budget cannot be negative").optional(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string().default("planned"),
  platform: z.string().optional(),
  channels: z.array(z.string()).default([]),
  goalId: z.coerce.number().optional(),
  metrics: z.record(z.string(), z.any()).optional(),
  notes: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const activityTypes = {
  "social-campaign": "Social Media Campaign",
  "email-campaign": "Email Campaign",
  "content-campaign": "Content Campaign",
  "digital-ads": "Digital Advertising",
  "seo-initiative": "SEO Initiative",
  "event": "Event/Webinar",
  "partnership": "Partnership/Collaboration",
  "influencer": "Influencer Marketing",
  "pr-campaign": "PR Campaign",
  "other": "Other"
};

const platforms = {
  "facebook": "Facebook",
  "instagram": "Instagram", 
  "twitter": "Twitter/X",
  "linkedin": "LinkedIn",
  "tiktok": "TikTok",
  "youtube": "YouTube",
  "pinterest": "Pinterest",
  "google": "Google",
  "bing": "Bing/Microsoft",
  "email": "Email",
  "website": "Website",
  "blog": "Blog",
  "other": "Other"
};

const channels = [
  "social-media",
  "email",
  "search-engine",
  "display-ads",
  "content-marketing",
  "influencer",
  "video",
  "affiliate",
  "referral",
  "direct-mail",
  "events",
  "webinars",
  "podcasts"
];

function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "active":
      return <Badge className="bg-blue-500">Active</Badge>;
    case "planned":
      return <Badge className="bg-amber-500">Planned</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "paused":
      return <Badge className="bg-gray-500">Paused</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function ActivityCard({ activity, onEdit, onDelete }: { activity: any; onEdit: (activity: any) => void; onDelete: (id: number) => void }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{activity.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {activityTypes[activity.type as keyof typeof activityTypes]}
            </CardDescription>
          </div>
          <div>
            {getStatusBadge(activity.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {activity.description && (
          <p className="text-sm mb-3 text-gray-700">{activity.description}</p>
        )}
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(activity.startDate)} - {formatDate(activity.endDate)}</span>
          </div>
          {activity.platform && (
            <div className="flex items-center">
              <Megaphone className="h-4 w-4 mr-1" />
              <span>{platforms[activity.platform as keyof typeof platforms]}</span>
            </div>
          )}
        </div>
        {activity.budget && (
          <div className="flex items-center text-sm font-medium mb-2">
            <span>Budget: ${activity.budget.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(activity)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(activity.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MarketingActivities() {
  const { toast } = useToast();
  const [isNewActivityDialogOpen, setIsNewActivityDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const queryClient = useQueryClient();
  
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "social-campaign",
      budget: 0,
      status: "planned",
      platform: "facebook",
      channels: ["social-media"],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const updateForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "social-campaign",
      budget: 0,
      status: "planned",
      platform: "facebook",
      channels: ["social-media"],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });
  
  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
    refetchOnWindowFocus: false,
  });
  
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["/api/marketing-activities"],
    refetchOnWindowFocus: false,
  });
  
  const createActivityMutation = useMutation({
    mutationFn: async (data: ActivityFormValues) => {
      const res = await apiRequest("POST", "/api/marketing-activities", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity created",
        description: "Your marketing activity has been created successfully.",
      });
      form.reset();
      setIsNewActivityDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating activity",
        description: error.message || "An error occurred while creating the activity.",
        variant: "destructive",
      });
    },
  });
  
  const updateActivityMutation = useMutation({
    mutationFn: async (data: ActivityFormValues & { id: number }) => {
      const { id, ...activityData } = data;
      const res = await apiRequest("PUT", `/api/marketing-activities/${id}`, activityData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity updated",
        description: "Your marketing activity has been updated successfully.",
      });
      updateForm.reset();
      setIsUpdateDialogOpen(false);
      setSelectedActivity(null);
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating activity",
        description: error.message || "An error occurred while updating the activity.",
        variant: "destructive",
      });
    },
  });
  
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/marketing-activities/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity deleted",
        description: "The marketing activity has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting activity",
        description: error.message || "An error occurred while deleting the activity.",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateActivity = (values: ActivityFormValues) => {
    createActivityMutation.mutate(values);
  };
  
  const handleUpdateActivity = (values: ActivityFormValues) => {
    if (selectedActivity) {
      updateActivityMutation.mutate({ ...values, id: selectedActivity.id });
    }
  };
  
  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    updateForm.reset({
      name: activity.name,
      description: activity.description || "",
      type: activity.type,
      budget: activity.budget || 0,
      status: activity.status,
      platform: activity.platform || "",
      channels: activity.channels || [],
      startDate: new Date(activity.startDate),
      endDate: new Date(activity.endDate),
      goalId: activity.goalId,
      notes: activity.notes || "",
    });
    setIsUpdateDialogOpen(true);
  };
  
  const handleDeleteActivity = (id: number) => {
    if (window.confirm("Are you sure you want to delete this marketing activity?")) {
      deleteActivityMutation.mutate(id);
    }
  };
  
  // Filter activities based on status and search query
  const filteredActivities = activities 
    ? activities.filter((activity: any) => {
        const matchesStatus = activeTab === "all" || activity.status === activeTab;
        const matchesSearch = searchQuery === "" || 
          activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (activity.description && activity.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      })
    : [];
  
  // Group activities by type for better organization in grid view
  const groupedActivities = filteredActivities 
    ? Object.groupBy(filteredActivities, (activity: any) => activity.type) 
    : {};
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Activities</h2>
          <p className="text-muted-foreground">
            Plan, track, and analyze your marketing campaigns and activities
          </p>
        </div>
        <Dialog open={isNewActivityDialogOpen} onOpenChange={setIsNewActivityDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create new marketing activity</DialogTitle>
              <DialogDescription>
                Define a marketing campaign or activity to track
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateActivity)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Sale Campaign" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Describe the activity..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(activityTypes).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(platforms).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {goals && goals.length > 0 && (
                  <FormField
                    control={form.control}
                    name="goalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Goal</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString() || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select related goal (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {goals.map((goal: any) => (
                              <SelectItem key={goal.id} value={goal.id.toString()}>
                                {goal.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes about this activity..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createActivityMutation.isPending}
                  >
                    {createActivityMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Activity
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Activity Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update marketing activity</DialogTitle>
              <DialogDescription>
                Edit your existing marketing activity
              </DialogDescription>
            </DialogHeader>
            {selectedActivity && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateActivity)} className="space-y-4">
                  <FormField
                    control={updateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(activityTypes).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateForm.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(platforms).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {goals && goals.length > 0 && (
                    <FormField
                      control={updateForm.control}
                      name="goalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Goal</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} defaultValue={field.value?.toString() || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select related goal (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {goals.map((goal: any) => (
                                <SelectItem key={goal.id} value={goal.id.toString()}>
                                  {goal.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={updateForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updateActivityMutation.isPending}
                    >
                      {updateActivityMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Activity
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Status and Search Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="planned">Planned</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error loading marketing activities: {(error as Error).message}</p>
        </div>
      ) : activities && activities.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No marketing activities yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first marketing activity</p>
          <Button onClick={() => setIsNewActivityDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Activity
          </Button>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Filter className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No matching activities</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
          <Button variant="outline" onClick={() => { setActiveTab("all"); setSearchQuery(""); }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Activities - show only if any planned activities exist */}
          {activeTab === "all" && filteredActivities.some((a: any) => a.status === "planned") && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Activities</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities
                    .filter((a: any) => a.status === "planned")
                    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 5)
                    .map((activity: any) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{activityTypes[activity.type as keyof typeof activityTypes]}</TableCell>
                        <TableCell>{formatDate(activity.startDate)}</TableCell>
                        <TableCell>{activity.platform ? platforms[activity.platform as keyof typeof platforms] : "-"}</TableCell>
                        <TableCell>{activity.budget ? `$${activity.budget.toLocaleString()}` : "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditActivity(activity)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Grid View - group by type */}
          {Object.entries(groupedActivities).map(([type, activities]: [string, any]) => (
            <div key={type} className="mb-8">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {activityTypes[type as keyof typeof activityTypes]}
                </h3>
                <Badge variant="outline" className="ml-2">
                  {activities.length}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity: any) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}