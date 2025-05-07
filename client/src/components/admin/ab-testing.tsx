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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BarChartHorizontal,
  Copy,
  Edit, 
  FilePieChart, 
  Plus, 
  Play,
  Pause,
  RotateCcw,
  ScrollText,
  Trash 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, BarChart } from '@/components/charts/chart-components';

// A/B Test schema
const abTestSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Test name is required'),
  description: z.string().optional(),
  type: z.enum(['landing', 'cta', 'headline', 'image', 'content', 'layout', 'color', 'custom']),
  status: z.enum(['draft', 'running', 'paused', 'completed']).default('draft'),
  trackerId: z.number().optional().nullable(),
  pageUrl: z.string().min(1, 'Page URL is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  conversionMetric: z.enum(['clicks', 'forms', 'signups', 'purchases', 'custom']),
  targetSampleSize: z.number().min(1).default(1000),
  minimumConfidence: z.number().min(70).max(99.9).default(95),
});

// Test variant schema
const variantSchema = z.object({
  id: z.number().optional(),
  testId: z.number().optional(),
  name: z.string().min(1, 'Variant name is required'),
  description: z.string().optional(),
  isControl: z.boolean().default(false),
  content: z.string().optional(),
  customProperties: z.record(z.string(), z.string()).optional(),
  // Stats
  impressions: z.number().default(0),
  conversions: z.number().default(0),
  conversionRate: z.number().default(0),
});

type ABTest = z.infer<typeof abTestSchema>;
type NewABTest = Omit<ABTest, 'id'> & { id?: number };

type Variant = z.infer<typeof variantSchema>;
type NewVariant = Omit<Variant, 'id' | 'testId'> & { id?: number, testId?: number };

// Results data
interface TestResults {
  testId: number;
  totalImpressions: number;
  totalConversions: number;
  averageConversionRate: number;
  confidenceLevel: number;
  winner: number | null;
  variants: {
    id: number;
    name: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
    improvement: number | null;
  }[];
  timeline: {
    date: string;
    variantId: number;
    impressions: number;
    conversions: number;
  }[];
}

const ABTestingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [editTest, setEditTest] = useState<ABTest | null>(null);
  const [editVariant, setEditVariant] = useState<Variant | null>(null);
  const { toast } = useToast();

  // Fetch trackers
  const { data: trackers } = useQuery<Array<{ id: number; name: string; platform: string }>>({
    queryKey: ['/api/ad-trackers'],
  });

  // Fetch tests
  const { data: tests, isLoading: isLoadingTests } = useQuery<ABTest[]>({
    queryKey: ['/api/ab-tests'],
    queryFn: async () => {
      // If API endpoint doesn't exist yet, return empty array
      try {
        const res = await apiRequest('GET', '/api/ab-tests');
        return await res.json();
      } catch (error) {
        console.error('Error fetching A/B tests:', error);
        return [];
      }
    }
  });

  // Fetch variants for selected test
  const { data: variants, isLoading: isLoadingVariants } = useQuery<Variant[]>({
    queryKey: ['/api/ab-tests', selectedTest, 'variants'],
    queryFn: async () => {
      if (!selectedTest) return [];
      // If API endpoint doesn't exist yet, return empty array
      try {
        const res = await apiRequest('GET', `/api/ab-tests/${selectedTest}/variants`);
        return await res.json();
      } catch (error) {
        console.error(`Error fetching variants for test ${selectedTest}:`, error);
        return [];
      }
    },
    enabled: !!selectedTest
  });

  // Fetch test results
  const { data: testResults, isLoading: isLoadingResults } = useQuery<TestResults>({
    queryKey: ['/api/ab-tests', selectedTest, 'results'],
    queryFn: async () => {
      if (!selectedTest) return null as any;
      // If API endpoint doesn't exist yet, return empty results
      try {
        const res = await apiRequest('GET', `/api/ab-tests/${selectedTest}/results`);
        return await res.json();
      } catch (error) {
        console.error(`Error fetching results for test ${selectedTest}:`, error);
        return {
          testId: selectedTest,
          totalImpressions: 0,
          totalConversions: 0,
          averageConversionRate: 0,
          confidenceLevel: 0,
          winner: null,
          variants: [],
          timeline: []
        };
      }
    },
    enabled: !!selectedTest
  });
  
  // Forms
  const testForm = useForm<NewABTest>({
    resolver: zodResolver(abTestSchema.omit({ id: true })),
    defaultValues: {
      name: '',
      type: 'landing',
      status: 'draft',
      trackerId: null,
      pageUrl: '/',
      conversionMetric: 'clicks',
      targetSampleSize: 1000,
      minimumConfidence: 95
    }
  });
  
  const variantForm = useForm<NewVariant>({
    resolver: zodResolver(variantSchema.omit({ id: true, testId: true })),
    defaultValues: {
      name: '',
      isControl: false,
      impressions: 0,
      conversions: 0,
      conversionRate: 0
    }
  });

  // Mutations
  const createTestMutation = useMutation({
    mutationFn: async (data: NewABTest) => {
      const res = await apiRequest('POST', '/api/ab-tests', data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      toast({
        title: 'Test created',
        description: 'A/B test has been created successfully'
      });
      setTestDialogOpen(false);
      setSelectedTest(data.id);
      testForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error creating test',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const updateTestMutation = useMutation({
    mutationFn: async (data: ABTest) => {
      const res = await apiRequest('PUT', `/api/ab-tests/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      toast({
        title: 'Test updated',
        description: 'A/B test has been updated successfully'
      });
      setTestDialogOpen(false);
      setEditTest(null);
      testForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error updating test',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const deleteTestMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/ab-tests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      toast({
        title: 'Test deleted',
        description: 'A/B test has been deleted successfully'
      });
      if (selectedTest === id) {
        setSelectedTest(null);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error deleting test',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const updateTestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ABTest['status'] }) => {
      const res = await apiRequest('PATCH', `/api/ab-tests/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      toast({
        title: 'Status updated',
        description: 'Test status has been updated successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const createVariantMutation = useMutation({
    mutationFn: async (data: NewVariant & { testId: number }) => {
      const res = await apiRequest('POST', `/api/ab-tests/${data.testId}/variants`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests', selectedTest, 'variants'] });
      toast({
        title: 'Variant created',
        description: 'Test variant has been created successfully'
      });
      setVariantDialogOpen(false);
      variantForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error creating variant',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const updateVariantMutation = useMutation({
    mutationFn: async (data: Variant & { testId: number }) => {
      const res = await apiRequest('PUT', `/api/ab-tests/${data.testId}/variants/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests', selectedTest, 'variants'] });
      toast({
        title: 'Variant updated',
        description: 'Test variant has been updated successfully'
      });
      setVariantDialogOpen(false);
      setEditVariant(null);
      variantForm.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error updating variant',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const deleteVariantMutation = useMutation({
    mutationFn: async ({ testId, id }: { testId: number; id: number }) => {
      await apiRequest('DELETE', `/api/ab-tests/${testId}/variants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests', selectedTest, 'variants'] });
      toast({
        title: 'Variant deleted',
        description: 'Test variant has been deleted successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting variant',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Handlers
  const onTestSubmit = (data: NewABTest) => {
    if (editTest) {
      updateTestMutation.mutate({ ...data, id: editTest.id });
    } else {
      createTestMutation.mutate(data);
    }
  };
  
  const onVariantSubmit = (data: NewVariant) => {
    if (!selectedTest) return;
    
    if (editVariant) {
      updateVariantMutation.mutate({ 
        ...data, 
        id: editVariant.id, 
        testId: selectedTest,
        impressions: editVariant.impressions,
        conversions: editVariant.conversions,
        conversionRate: editVariant.conversionRate
      });
    } else {
      createVariantMutation.mutate({ ...data, testId: selectedTest });
    }
  };
  
  const handleEditTest = (test: ABTest) => {
    setEditTest(test);
    testForm.reset({
      name: test.name,
      description: test.description,
      type: test.type,
      status: test.status,
      trackerId: test.trackerId,
      pageUrl: test.pageUrl,
      startDate: test.startDate,
      endDate: test.endDate,
      conversionMetric: test.conversionMetric,
      targetSampleSize: test.targetSampleSize,
      minimumConfidence: test.minimumConfidence
    });
    setTestDialogOpen(true);
  };
  
  const handleEditVariant = (variant: Variant) => {
    setEditVariant(variant);
    variantForm.reset({
      name: variant.name,
      description: variant.description,
      isControl: variant.isControl,
      content: variant.content,
      customProperties: variant.customProperties
    });
    setVariantDialogOpen(true);
  };
  
  const handleDuplicateVariant = (variant: Variant) => {
    if (!selectedTest) return;
    
    const newVariant: NewVariant & { testId: number } = {
      name: `${variant.name} (Copy)`,
      description: variant.description,
      isControl: false,
      content: variant.content,
      customProperties: variant.customProperties,
      testId: selectedTest
    };
    
    createVariantMutation.mutate(newVariant);
  };

  const handleStatusChange = (id: number, status: ABTest['status']) => {
    updateTestStatusMutation.mutate({ id, status });
  };
  
  const handleTestSelect = (id: number | null) => {
    setSelectedTest(id);
  };
  
  // Reset forms when closing dialogs
  const handleTestDialogClose = () => {
    setTestDialogOpen(false);
    setEditTest(null);
    testForm.reset();
  };
  
  const handleVariantDialogClose = () => {
    setVariantDialogOpen(false);
    setEditVariant(null);
    variantForm.reset();
  };

  // Format data for charts
  const formatResultsData = () => {
    if (!testResults || !testResults.variants.length) return null;
    
    const barData = {
      labels: testResults.variants.map(v => v.name),
      datasets: [
        {
          label: 'Conversion Rate (%)',
          data: testResults.variants.map(v => v.conversionRate),
          backgroundColor: testResults.variants.map(v => 
            v.id === testResults.winner 
              ? 'rgba(34, 197, 94, 0.8)' 
              : 'rgba(59, 130, 246, 0.8)'
          ),
        }
      ]
    };
    
    // Group timeline data by date
    const timelineMap = new Map<string, { [key: string]: number }>();
    testResults.timeline.forEach(entry => {
      const variant = testResults.variants.find(v => v.id === entry.variantId);
      if (!variant) return;
      
      if (!timelineMap.has(entry.date)) {
        timelineMap.set(entry.date, {});
      }
      
      const dateEntry = timelineMap.get(entry.date)!;
      dateEntry[variant.name] = entry.conversions > 0 && entry.impressions > 0
        ? (entry.conversions / entry.impressions) * 100
        : 0;
    });
    
    // Convert to array and sort by date
    const timelineData = Array.from(timelineMap.entries())
      .map(([date, rates]) => ({ date, ...rates }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const lineData = {
      labels: timelineData.map(entry => {
        const date = new Date(entry.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: testResults.variants.map((variant, index) => ({
        label: variant.name,
        data: timelineData.map(entry => entry[variant.name] || 0),
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(16, 185, 129)',
          'rgb(168, 85, 247)',
          'rgb(239, 68, 68)'
        ][index % 6],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(239, 68, 68, 0.5)'
        ][index % 6],
        tension: 0.3,
      }))
    };
    
    return { barData, lineData };
  };

  // Filter tests by status
  const filteredTests = tests?.filter(test => {
    if (activeTab === 'active') return ['running', 'paused'].includes(test.status);
    if (activeTab === 'draft') return test.status === 'draft';
    if (activeTab === 'completed') return test.status === 'completed';
    return true;
  });

  // Format status badge
  const getStatusBadge = (status: ABTest['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
      running: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
      paused: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
      completed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' }
    };
    
    return (
      <Badge className={`font-medium ${statusConfig[status].color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const chartsData = formatResultsData();

  // Get currently active test info
  const activeTest = tests?.find(test => test.id === selectedTest);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B Testing</h2>
          <p className="text-muted-foreground">Create and manage A/B tests to optimize your website</p>
        </div>
        
        <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditTest(null);
              testForm.reset({
                name: '',
                type: 'landing',
                status: 'draft',
                trackerId: null,
                pageUrl: '/',
                conversionMetric: 'clicks',
                targetSampleSize: 1000,
                minimumConfidence: 95
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editTest ? 'Edit A/B Test' : 'Create New A/B Test'}</DialogTitle>
            </DialogHeader>
            <Form {...testForm}>
              <form onSubmit={testForm.handleSubmit(onTestSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Homepage Hero Test" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select test type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="landing">Landing Page</SelectItem>
                            <SelectItem value="cta">Call-to-Action</SelectItem>
                            <SelectItem value="headline">Headline</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="content">Content</SelectItem>
                            <SelectItem value="layout">Layout</SelectItem>
                            <SelectItem value="color">Color Scheme</SelectItem>
                            <SelectItem value="custom">Custom Element</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={testForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose and hypothesis of this test"
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="pageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page URL</FormLabel>
                        <FormControl>
                          <Input placeholder="/page-path" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="trackerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking Campaign</FormLabel>
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
                            <SelectItem value="null">All Traffic</SelectItem>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="conversionMetric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conversion Metric</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select metric" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clicks">Clicks</SelectItem>
                            <SelectItem value="forms">Form Submissions</SelectItem>
                            <SelectItem value="signups">Sign-ups</SelectItem>
                            <SelectItem value="purchases">Purchases</SelectItem>
                            <SelectItem value="custom">Custom Goal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
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
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="targetSampleSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Sample Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum number of visitors needed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="minimumConfidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Confidence (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="70"
                            max="99.9"
                            step="0.1"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Statistical confidence level for results
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={handleTestDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editTest ? 'Update Test' : 'Create Test'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test list panel */}
        <div className="lg:col-span-1 space-y-4">
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="draft" className="flex-1">Draft</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {isLoadingTests ? (
              <p>Loading tests...</p>
            ) : (
              <>
                {filteredTests?.length ? (
                  filteredTests.map((test) => (
                    <Card 
                      key={test.id} 
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedTest === test.id ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                      onClick={() => handleTestSelect(test.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{test.name}</CardTitle>
                          {getStatusBadge(test.status)}
                        </div>
                        <CardDescription className="text-xs">
                          {test.type.charAt(0).toUpperCase() + test.type.slice(1)} test 
                          on {test.pageUrl}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {test.description || 'No description provided.'}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="text-xs text-muted-foreground">
                          {test.startDate ? `Started: ${new Date(test.startDate).toLocaleDateString()}` : 'Not started'}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTest(test);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTestMutation.mutate(test.id!);
                            }}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">No tests found. Create your first A/B test to get started.</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Test details panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTest && activeTest ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FilePieChart className="h-5 w-5" />
                    {activeTest.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTest.description || `Testing different ${activeTest.type} variations`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {activeTest.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStatusChange(activeTest.id!, 'running')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Test
                    </Button>
                  )}
                  
                  {activeTest.status === 'running' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activeTest.id!, 'paused')}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  
                  {activeTest.status === 'paused' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activeTest.id!, 'running')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  
                  {(activeTest.status === 'running' || activeTest.status === 'paused') && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activeTest.id!, 'completed')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  
                  {activeTest.status === 'completed' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activeTest.id!, 'draft')}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(activeTest.status)}
                      {activeTest.status === 'running' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Metric</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="capitalize">
                      {activeTest.conversionMetric.replace('_', ' ')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Target Sample</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      {activeTest.targetSampleSize.toLocaleString()} visitors
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="variants">
                <TabsList>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="variants" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Test Variants</h4>
                    
                    <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setEditVariant(null);
                            variantForm.reset({
                              name: '',
                              isControl: variants?.length === 0,
                              impressions: 0,
                              conversions: 0,
                              conversionRate: 0
                            });
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Variant
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{editVariant ? 'Edit Variant' : 'Create New Variant'}</DialogTitle>
                        </DialogHeader>
                        <Form {...variantForm}>
                          <form onSubmit={variantForm.handleSubmit(onVariantSubmit)} className="space-y-4">
                            <FormField
                              control={variantForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Variant Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Variation A" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={variantForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe this variant"
                                      className="min-h-[80px]"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={variantForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content/Code</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="HTML, CSS, or text content for this variant"
                                      className="min-h-[120px] font-mono text-sm"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    For layouts, use HTML. For copy tests, enter text only.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={variantForm.control}
                              name="isControl"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      disabled={editVariant?.isControl}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Control Variant</FormLabel>
                                    <FormDescription>
                                      This is the original/current version
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-4 pt-4">
                              <Button type="button" variant="outline" onClick={handleVariantDialogClose}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {editVariant ? 'Update Variant' : 'Create Variant'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {isLoadingVariants ? (
                    <p>Loading variants...</p>
                  ) : (
                    <>
                      {variants?.length ? (
                        <div className="space-y-4">
                          {variants.map((variant) => (
                            <Card key={variant.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <CardTitle className="text-lg">
                                      {variant.name}
                                      {variant.isControl && (
                                        <Badge className="ml-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                          Control
                                        </Badge>
                                      )}
                                    </CardTitle>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleEditVariant(variant)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDuplicateVariant(variant)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => deleteVariantMutation.mutate({ testId: selectedTest, id: variant.id! })}
                                      disabled={variant.isControl && variants.length > 1}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {variant.description && (
                                  <CardDescription>
                                    {variant.description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                {variant.content ? (
                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md font-mono text-sm overflow-x-auto max-h-[200px] overflow-y-auto">
                                    <pre>{variant.content}</pre>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground text-sm italic">No content specified</p>
                                )}
                              </CardContent>
                              <CardFooter className="pt-0 flex justify-between text-sm">
                                <div className="text-muted-foreground">
                                  {variant.impressions > 0 ? (
                                    <span>
                                      {variant.impressions.toLocaleString()} impressions, 
                                      {' '}{variant.conversions.toLocaleString()} conversions
                                      {' '}({variant.conversionRate.toFixed(2)}%)
                                    </span>
                                  ) : (
                                    <span>No data yet</span>
                                  )}
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="pt-6">
                            <Alert>
                              <AlertDescription>
                                This test needs at least two variants - a control and a test variation.
                                Click "Add Variant" to create them.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="results" className="space-y-4">
                  {isLoadingResults ? (
                    <p>Loading results...</p>
                  ) : (
                    <>
                      {testResults && variants?.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Traffic</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {testResults.totalImpressions.toLocaleString()}
                                </div>
                                <Progress 
                                  value={(testResults.totalImpressions / activeTest.targetSampleSize) * 100} 
                                  className="h-2 mt-2" 
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.min(Math.round((testResults.totalImpressions / activeTest.targetSampleSize) * 100), 100)}% 
                                  of target ({activeTest.targetSampleSize.toLocaleString()})
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {testResults.totalConversions.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Average rate: {testResults.averageConversionRate.toFixed(2)}%
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Confidence</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {testResults.confidenceLevel.toFixed(2)}%
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {testResults.confidenceLevel >= activeTest.minimumConfidence 
                                    ? 'Statistically significant' 
                                    : 'Not significant yet'}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {testResults.winner !== null && (
                            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <AlertDescription className="text-green-800 dark:text-green-300">
                                Winner detected: 
                                <span className="font-semibold"> 
                                  {variants.find(v => v.id === testResults.winner)?.name}
                                </span> 
                                with 
                                {testResults.variants.find(v => v.id === testResults.winner)?.improvement && (
                                  <span> {testResults.variants.find(v => v.id === testResults.winner)?.improvement}% improvement</span>
                                )}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {chartsData && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Conversion Rates</CardTitle>
                                  <CardDescription>
                                    Comparison of each variant's performance
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                  <BarChart data={chartsData.barData} />
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Performance Over Time</CardTitle>
                                  <CardDescription>
                                    Conversion rates throughout the test
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                  <LineChart data={chartsData.lineData} />
                                </CardContent>
                              </Card>
                            </div>
                          )}
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Variant Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b dark:border-gray-700">
                                      <th className="text-left py-3 px-4">Variant</th>
                                      <th className="text-right py-3 px-4">Visitors</th>
                                      <th className="text-right py-3 px-4">Conversions</th>
                                      <th className="text-right py-3 px-4">Rate</th>
                                      <th className="text-right py-3 px-4">Improvement</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {testResults.variants.map((variant) => (
                                      <tr 
                                        key={variant.id} 
                                        className={`border-b dark:border-gray-700 ${
                                          variant.id === testResults.winner 
                                            ? 'bg-green-50 dark:bg-green-900/20' 
                                            : ''
                                        }`}
                                      >
                                        <td className="py-3 px-4 font-medium">{variant.name}</td>
                                        <td className="py-3 px-4 text-right">{variant.impressions.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right">{variant.conversions.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right">{variant.conversionRate.toFixed(2)}%</td>
                                        <td className="py-3 px-4 text-right">
                                          {variant.improvement === null ? (
                                            <span className="text-muted-foreground">Baseline</span>
                                          ) : (
                                            <span className={variant.improvement >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                              {variant.improvement > 0 ? '+' : ''}{variant.improvement.toFixed(2)}%
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <div className="text-xs text-muted-foreground">
                                {testResults.confidenceLevel < activeTest.minimumConfidence ? (
                                  <div className="flex items-center gap-2">
                                    <BarChartHorizontal className="h-4 w-4" />
                                    <p>
                                      Test needs more data to reach {activeTest.minimumConfidence}% confidence level
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <ScrollText className="h-4 w-4" />
                                    <p>
                                      Results are statistically significant at {activeTest.minimumConfidence}% confidence
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardFooter>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-muted-foreground">
                              {variants?.length === 0 
                                ? 'Add at least one control and one test variant to see results.' 
                                : 'No test data available yet. Start the test to begin collecting data.'}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Select a test from the list or create a new one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestingDashboard;