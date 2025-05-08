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
  Check,
  XCircle,
  BarChart3,
  Target,
  Calendar,
  TrendingUp,
  Sparkles,
  RefreshCw,
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DatePicker } from "@/components/ui/date-picker";

const goalSchema = z.object({
  name: z.string().min(3, "Goal name must be at least 3 characters long"),
  description: z.string().optional(),
  targetValue: z.coerce.number().positive("Target must be a positive number"),
  currentValue: z.coerce.number().min(0, "Current value cannot be negative").default(0),
  category: z.string(),
  startDate: z.date(),
  targetDate: z.date(),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
});

type GoalFormValues = z.infer<typeof goalSchema>;

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

function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0; // Avoid division by zero
  return Math.min(Math.round((current / target) * 100), 100);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "active":
      return "bg-blue-500";
    case "at-risk":
      return "bg-amber-500";
    case "behind":
      return "bg-red-500";
    case "on-hold":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-500">High</Badge>;
    case "medium":
      return <Badge className="bg-amber-500">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-500">Low</Badge>;
    default:
      return <Badge>Medium</Badge>;
  }
}

function GoalCard({ goal, onEdit, onDelete }: { goal: any; onEdit: (goal: any) => void; onDelete: (id: number) => void }) {
  const progress = calculateProgress(goal.currentValue, goal.targetValue);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{goal.name}</CardTitle>
            <CardDescription className="text-sm">{goal.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {getPriorityBadge(goal.priority)}
            <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="mb-3">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span>Progress: {goal.currentValue} / {goal.targetValue} ({progress}%)</span>
            <span>{goal.category}</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Start: {formatDate(goal.startDate)}</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1" />
            <span>Target: {formatDate(goal.targetDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(goal)}
        >
          <Edit className="h-4 w-4 mr-1" /> Update
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MarketingGoals() {
  const { toast } = useToast();
  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      targetValue: 0,
      currentValue: 0,
      category: "leads",
      status: "active",
      priority: "medium",
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const updateForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      targetValue: 0,
      currentValue: 0,
      category: "leads",
      status: "active",
      priority: "medium",
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ["/api/goals"],
    refetchOnWindowFocus: false,
  });
  
  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      const res = await apiRequest("POST", "/api/goals", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Goal created",
        description: "Your marketing goal has been created successfully.",
      });
      form.reset();
      setIsNewGoalDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating goal",
        description: error.message || "An error occurred while creating the goal.",
        variant: "destructive",
      });
    },
  });
  
  const updateGoalMutation = useMutation({
    mutationFn: async (data: GoalFormValues & { id: number }) => {
      const { id, ...goalData } = data;
      const res = await apiRequest("PUT", `/api/goals/${id}`, goalData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Goal updated",
        description: "Your marketing goal has been updated successfully.",
      });
      updateForm.reset();
      setIsUpdateDialogOpen(false);
      setSelectedGoal(null);
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating goal",
        description: error.message || "An error occurred while updating the goal.",
        variant: "destructive",
      });
    },
  });
  
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/goals/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Goal deleted",
        description: "The marketing goal has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting goal",
        description: error.message || "An error occurred while deleting the goal.",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateGoal = (values: GoalFormValues) => {
    createGoalMutation.mutate(values);
  };
  
  const handleUpdateGoal = (values: GoalFormValues) => {
    if (selectedGoal) {
      updateGoalMutation.mutate({ ...values, id: selectedGoal.id });
    }
  };
  
  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    updateForm.reset({
      name: goal.name,
      description: goal.description || "",
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      category: goal.category,
      status: goal.status,
      priority: goal.priority,
      startDate: new Date(goal.startDate),
      targetDate: new Date(goal.targetDate),
    });
    setIsUpdateDialogOpen(true);
  };
  
  const handleDeleteGoal = (id: number) => {
    if (window.confirm("Are you sure you want to delete this marketing goal?")) {
      deleteGoalMutation.mutate(id);
    }
  };
  
  // Group goals by category for better organization
  const groupedGoals = goals ? Object.groupBy(goals, (goal: any) => goal.category) : {};
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Goals</h2>
          <p className="text-muted-foreground">
            Set, track, and manage your marketing objectives and KPIs
          </p>
        </div>
        <Dialog open={isNewGoalDialogOpen} onOpenChange={setIsNewGoalDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create new marketing goal</DialogTitle>
              <DialogDescription>
                Define a measurable objective for your marketing efforts
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateGoal)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Increase website traffic" {...field} />
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
                        <Textarea placeholder="Describe the goal and why it matters..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="targetValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Value</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Value</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                          <SelectItem value="leads">Lead Generation</SelectItem>
                          <SelectItem value="conversions">Conversions</SelectItem>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="awareness">Brand Awareness</SelectItem>
                          <SelectItem value="retention">Customer Retention</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="seo">SEO</SelectItem>
                          <SelectItem value="email">Email Marketing</SelectItem>
                          <SelectItem value="content">Content Marketing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Target Date</FormLabel>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="at-risk">At Risk</SelectItem>
                            <SelectItem value="behind">Behind</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createGoalMutation.isPending}
                  >
                    {createGoalMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Goal
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Goal Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update marketing goal</DialogTitle>
              <DialogDescription>
                Edit your existing marketing goal
              </DialogDescription>
            </DialogHeader>
            {selectedGoal && (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateGoal)} className="space-y-4">
                  <FormField
                    control={updateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Name</FormLabel>
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
                      name="targetValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Value</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateForm.control}
                      name="currentValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Value</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                            <SelectItem value="leads">Lead Generation</SelectItem>
                            <SelectItem value="conversions">Conversions</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="awareness">Brand Awareness</SelectItem>
                            <SelectItem value="retention">Customer Retention</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="seo">SEO</SelectItem>
                            <SelectItem value="email">Email Marketing</SelectItem>
                            <SelectItem value="content">Content Marketing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                      name="targetDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Target Date</FormLabel>
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
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="at-risk">At Risk</SelectItem>
                              <SelectItem value="behind">Behind</SelectItem>
                              <SelectItem value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updateGoalMutation.isPending}
                    >
                      {updateGoalMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Goal
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error loading marketing goals: {(error as Error).message}</p>
        </div>
      ) : goals && goals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No marketing goals yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first marketing goal</p>
          <Button onClick={() => setIsNewGoalDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Goal
          </Button>
        </div>
      ) : (
        <div>
          {/* Dashboard Summary */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Target className="mr-2 h-4 w-4" /> Total Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold">{goals?.length || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Check className="mr-2 h-4 w-4" /> Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold">
                  {goals?.filter((g: any) => g.status === "completed").length || 0}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" /> In Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold">
                  {goals?.filter((g: any) => g.status === "active").length || 0}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <XCircle className="mr-2 h-4 w-4" /> At Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold">
                  {goals?.filter((g: any) => g.status === "at-risk" || g.status === "behind").length || 0}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Goals by Category */}
          {Object.entries(groupedGoals).map(([category, categoryGoals]: [string, any]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-3">
                <h3 className="text-xl font-semibold capitalize">
                  {category === "leads" && "Lead Generation"}
                  {category === "conversions" && "Conversions"}
                  {category === "revenue" && "Revenue"}
                  {category === "engagement" && "Engagement"}
                  {category === "awareness" && "Brand Awareness"}
                  {category === "retention" && "Customer Retention"}
                  {category === "social" && "Social Media"}
                  {category === "seo" && "SEO"}
                  {category === "email" && "Email Marketing"}
                  {category === "content" && "Content Marketing"}
                  {category === "other" && "Other Goals"}
                </h3>
                <Badge variant="outline" className="ml-2">
                  {categoryGoals.length}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryGoals.map((goal: any) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
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