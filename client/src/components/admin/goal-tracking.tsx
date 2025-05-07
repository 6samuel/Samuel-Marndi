import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  Clock, 
  Edit, 
  Plus, 
  Target, 
  Trash, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Goal schema
const goalSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Goal name is required'),
  type: z.enum(['visits', 'conversions', 'rate', 'custom']),
  target: z.number().min(1, 'Target must be greater than 0'),
  current: z.number().default(0),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  trackerId: z.number().optional().nullable(),
  isActive: z.boolean().default(true),
});

type Goal = z.infer<typeof goalSchema>;
type NewGoal = Omit<Goal, 'id' | 'current'> & { id?: number, current?: number };

// Marketing activity schema
const activitySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Activity name is required'),
  type: z.enum(['campaign', 'social', 'email', 'content', 'other']),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

type MarketingActivity = z.infer<typeof activitySchema>;
type NewActivity = Omit<MarketingActivity, 'id'> & { id?: number };

const GoalTrackingDashboard: React.FC = () => {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editActivity, setEditActivity] = useState<MarketingActivity | null>(null);
  const { toast } = useToast();

  // Fetch goals
  const { data: goals, isLoading: isLoadingGoals } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      // If API endpoint doesn't exist yet, return empty array
      try {
        const res = await apiRequest('GET', '/api/goals');
        return await res.json();
      } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
      }
    }
  });

  // Fetch marketing activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<MarketingActivity[]>({
    queryKey: ['/api/marketing-activities'],
    queryFn: async () => {
      // If API endpoint doesn't exist yet, return empty array
      try {
        const res = await apiRequest('GET', '/api/marketing-activities');
        return await res.json();
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    }
  });

  // Fetch tracker list
  const { data: trackers } = useQuery<Array<{ id: number; name: string; platform: string }>>({
    queryKey: ['/api/ad-trackers'],
  });

  // Forms
  const goalForm = useForm<NewGoal>({
    resolver: zodResolver(goalSchema.omit({ id: true, current: true })),
    defaultValues: {
      name: '',
      type: 'visits',
      target: 100,
      period: 'monthly',
      trackerId: null,
      isActive: true
    }
  });

  const activityForm = useForm<NewActivity>({
    resolver: zodResolver(activitySchema.omit({ id: true })),
    defaultValues: {
      name: '',
      type: 'campaign',
      startDate: new Date().toISOString().split('T')[0],
      status: 'planned'
    }
  });

  // Mutations
  const createGoalMutation = useMutation({
    mutationFn: async (data: NewGoal) => {
      const res = await apiRequest('POST', '/api/goals', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: 'Goal created',
        description: 'Marketing goal has been created successfully'
      });
      setGoalDialogOpen(false);
      goalForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error creating goal',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (data: Goal) => {
      const res = await apiRequest('PUT', `/api/goals/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: 'Goal updated',
        description: 'Marketing goal has been updated successfully'
      });
      setGoalDialogOpen(false);
      setEditGoal(null);
      goalForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error updating goal',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: 'Goal deleted',
        description: 'Marketing goal has been deleted successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting goal',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: NewActivity) => {
      const res = await apiRequest('POST', '/api/marketing-activities', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketing-activities'] });
      toast({
        title: 'Activity created',
        description: 'Marketing activity has been created successfully'
      });
      setActivityDialogOpen(false);
      activityForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error creating activity',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: async (data: MarketingActivity) => {
      const res = await apiRequest('PUT', `/api/marketing-activities/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketing-activities'] });
      toast({
        title: 'Activity updated',
        description: 'Marketing activity has been updated successfully'
      });
      setActivityDialogOpen(false);
      setEditActivity(null);
      activityForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error updating activity',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/marketing-activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketing-activities'] });
      toast({
        title: 'Activity deleted',
        description: 'Marketing activity has been deleted successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting activity',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Handle form submissions
  const onGoalSubmit = (data: NewGoal) => {
    if (editGoal) {
      updateGoalMutation.mutate({ ...data, id: editGoal.id, current: editGoal.current });
    } else {
      createGoalMutation.mutate(data);
    }
  };

  const onActivitySubmit = (data: NewActivity) => {
    if (editActivity) {
      updateActivityMutation.mutate({ ...data, id: editActivity.id });
    } else {
      createActivityMutation.mutate(data);
    }
  };

  // Setup edit mode
  const handleEditGoal = (goal: Goal) => {
    setEditGoal(goal);
    goalForm.reset({
      name: goal.name,
      type: goal.type,
      target: goal.target,
      period: goal.period,
      startDate: goal.startDate,
      endDate: goal.endDate,
      trackerId: goal.trackerId,
      isActive: goal.isActive
    });
    setGoalDialogOpen(true);
  };

  const handleEditActivity = (activity: MarketingActivity) => {
    setEditActivity(activity);
    activityForm.reset({
      name: activity.name,
      type: activity.type,
      description: activity.description,
      startDate: activity.startDate,
      endDate: activity.endDate,
      status: activity.status,
      notes: activity.notes
    });
    setActivityDialogOpen(true);
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Render status badge
  const renderStatusBadge = (status: MarketingActivity['status']) => {
    const statusConfig = {
      planned: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-3 w-3 mr-1" /> },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: <TrendingUp className="h-3 w-3 mr-1" /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    };

    const { color, icon } = statusConfig[status];
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center w-fit ${color}`}>
        {icon}
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Reset forms when closing dialogs
  const handleGoalDialogClose = () => {
    setGoalDialogOpen(false);
    setEditGoal(null);
    goalForm.reset();
  };

  const handleActivityDialogClose = () => {
    setActivityDialogOpen(false);
    setEditActivity(null);
    activityForm.reset();
  };

  return (
    <div className="space-y-8">
      {/* Goals Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Marketing Goals</h2>
            <p className="text-muted-foreground">Set and track goals for your marketing campaigns</p>
          </div>
          <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditGoal(null);
                goalForm.reset({
                  name: '',
                  type: 'visits',
                  target: 100,
                  period: 'monthly',
                  trackerId: null,
                  isActive: true
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
              </DialogHeader>
              <Form {...goalForm}>
                <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-4">
                  <FormField
                    control={goalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Goal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={goalForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select goal type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="visits">Visits</SelectItem>
                              <SelectItem value="conversions">Conversions</SelectItem>
                              <SelectItem value="rate">Conversion Rate</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={goalForm.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={goalForm.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                              <SelectItem value="custom">Custom Date Range</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={goalForm.control}
                      name="trackerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))} 
                            defaultValue={field.value?.toString() || "null"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select campaign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="null">All Campaigns</SelectItem>
                              {trackers?.map(tracker => (
                                <SelectItem key={tracker.id} value={tracker.id.toString()}>
                                  {tracker.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {goalForm.watch('period') === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={goalForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={goalForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={goalForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Mark this goal as currently active
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleGoalDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editGoal ? 'Update Goal' : 'Create Goal'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingGoals ? (
            <p>Loading goals...</p>
          ) : (
            <>
              {goals?.length ? (
                goals.map(goal => (
                  <Card key={goal.id} className={!goal.isActive ? 'opacity-60' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Target className="h-5 w-5 mr-2 text-primary" />
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteGoalMutation.mutate(goal.id!)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center">
                        {goal.type === 'visits' && 'Total Visits'}
                        {goal.type === 'conversions' && 'Total Conversions'}
                        {goal.type === 'rate' && 'Conversion Rate'}
                        {goal.type === 'custom' && 'Custom Goal'}
                        {' - '}
                        {goal.period === 'custom' ? 
                          `${new Date(goal.startDate!).toLocaleDateString()} - ${new Date(goal.endDate!).toLocaleDateString()}` : 
                          goal.period.charAt(0).toUpperCase() + goal.period.slice(1)
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">
                            {goal.current} / {goal.target} 
                            {goal.type === 'rate' && '%'}
                          </span>
                        </div>
                        <Progress value={calculateProgress(goal.current, goal.target)} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full text-xs text-muted-foreground">
                        {goal.trackerId ? 
                          `Tracking campaign: ${trackers?.find(t => t.id === goal.trackerId)?.name || 'Unknown'}` : 
                          'Tracking all campaigns'
                        }
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No marketing goals set yet. Click "Add Goal" to create your first goal.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Activities Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Marketing Activities</h2>
            <p className="text-muted-foreground">Plan and track your marketing campaigns and activities</p>
          </div>
          <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditActivity(null);
                activityForm.reset({
                  name: '',
                  type: 'campaign',
                  startDate: new Date().toISOString().split('T')[0],
                  status: 'planned'
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editActivity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
              </DialogHeader>
              <Form {...activityForm}>
                <form onSubmit={activityForm.handleSubmit(onActivitySubmit)} className="space-y-4">
                  <FormField
                    control={activityForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Activity name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={activityForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="campaign">Ad Campaign</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="email">Email Marketing</SelectItem>
                              <SelectItem value="content">Content Marketing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={activityForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={activityForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={activityForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={activityForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Activity description" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={activityForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Additional notes" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleActivityDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editActivity ? 'Update Activity' : 'Create Activity'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-4">
          {isLoadingActivities ? (
            <p>Loading activities...</p>
          ) : (
            <>
              {activities?.length ? (
                activities.map(activity => (
                  <Card key={activity.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{activity.name}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <span>
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </span>
                            <span className="text-xs">
                              {new Date(activity.startDate).toLocaleDateString()}
                              {activity.endDate && ` - ${new Date(activity.endDate).toLocaleDateString()}`}
                            </span>
                            {renderStatusBadge(activity.status)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditActivity(activity)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteActivityMutation.mutate(activity.id!)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(activity.description || activity.notes) && (
                        <div className="space-y-2 text-sm">
                          {activity.description && <p>{activity.description}</p>}
                          {activity.notes && (
                            <p className="text-muted-foreground">
                              <span className="font-medium">Notes:</span> {activity.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No marketing activities scheduled yet. Click "Add Activity" to create your first activity.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalTrackingDashboard;