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
  ArrowRightLeft,
  FileBarChart,
  CheckIcon,
  PlusIcon,
  RefreshCw,
  Trophy,
  ChevronUp,
  ChevronDown,
  Check,
  Beaker,
  AlertCircle,
  Eye,
  BarChart2,
  BarChart3,
  Play,
  Pause,
  Clock,
  ArrowRight,
  Terminal,
  Pencil,
  XIcon,
  LayoutPanelTop,
  PieChart,
  Copy,
  Zap,
  Flag
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeHighlightTabs } from "@/components/ui/code-tabs";
import { cn } from "@/lib/utils";

const testSchema = z.object({
  name: z.string().min(3, "Test name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string(),
  targetSampleSize: z.coerce.number().positive("Sample size must be positive"),
  minimumConfidence: z.coerce.number().min(50, "Confidence must be at least 50%").max(99.9, "Confidence cannot exceed 99.9%"),
  status: z.string().default("draft"),
  metric: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.string().optional(),
  element: z.string().optional(),
  conversionPage: z.string().optional(),
  conversionEvent: z.string().optional(),
  trafficAllocation: z.coerce.number().min(1).max(100).default(100),
});

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  description: z.string().optional(),
  isControl: z.boolean().default(false),
  content: z.string().optional(),
  customProperties: z.record(z.string(), z.string()).optional(),
});

type TestFormValues = z.infer<typeof testSchema>;
type VariantFormValues = z.infer<typeof variantSchema>;

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Not set";
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

interface TestCardProps {
  test: any;
  onEdit: (test: any) => void;
  onDelete: (id: number) => void;
  onViewResults: (test: any) => void;
  onManageVariants: (test: any) => void;
  onStatusChange: (id: number, status: string) => void;
}

function TestCard({ test, onEdit, onDelete, onViewResults, onManageVariants, onStatusChange }: TestCardProps) {
  const startDate = test.startDate ? new Date(test.startDate) : null;
  const endDate = test.endDate ? new Date(test.endDate) : null;
  const today = new Date();
  
  const isActive = test.status === 'active';
  const isPaused = test.status === 'paused';
  const isCompleted = test.status === 'completed';
  const isDraft = test.status === 'draft';
  
  const hasStarted = startDate && startDate <= today;
  const hasEnded = endDate && endDate <= today;
  
  let statusColor = "bg-gray-500";
  if (isActive) statusColor = "bg-green-500";
  if (isPaused) statusColor = "bg-amber-500";
  if (isCompleted) statusColor = "bg-blue-500";
  if (isDraft) statusColor = "bg-gray-500";
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">
              {test.name}
            </CardTitle>
            <CardDescription className="text-sm flex items-center">
              <Badge variant="outline" className="mr-2">
                {test.type === 'ab' ? 'A/B Test' : 
                  test.type === 'multivariate' ? 'Multivariate Test' : 
                  test.type === 'split' ? 'Split Test' : 
                  'Other Test'}
              </Badge>
              <span>Metric: {test.metric}</span>
            </CardDescription>
          </div>
          <Badge className={statusColor}>{test.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {test.description && (
          <p className="text-sm mb-3 text-gray-700">{test.description}</p>
        )}
        <div className="text-sm space-y-1 mb-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Sample Size:</span>
            <span className="font-medium">{test.targetSampleSize.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Min. Confidence:</span>
            <span className="font-medium">{test.minimumConfidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Variants:</span>
            <span className="font-medium">{test.variantCount || 0}</span>
          </div>
          {test.trafficAllocation < 100 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Traffic:</span>
              <span className="font-medium">{test.trafficAllocation}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Dates:</span>
            <span className="font-medium">
              {startDate ? formatDate(startDate) : 'Not started'} 
              {endDate ? ` - ${formatDate(endDate)}` : ''}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div>
          {isActive && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(test.id, 'paused')}
            >
              <Pause className="h-4 w-4 mr-1" /> Pause
            </Button>
          )}
          {isPaused && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onStatusChange(test.id, 'active')}
            >
              <Play className="h-4 w-4 mr-1" /> Resume
            </Button>
          )}
          {isDraft && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(test.id, 'active')}
            >
              <Play className="h-4 w-4 mr-1" /> Start
            </Button>
          )}
          {(isActive || isPaused) && (
            <Button 
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => onStatusChange(test.id, 'completed')}
            >
              <Check className="h-4 w-4 mr-1" /> Complete
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onManageVariants(test)}
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" /> Variants
          </Button>
          {!isDraft && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewResults(test)}
            >
              <BarChart2 className="h-4 w-4 mr-1" /> Results
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(test)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(test.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function VariantCard({ variant, onEdit, onDelete, isInactive }: { 
  variant: any; 
  onEdit: (variant: any) => void; 
  onDelete: (id: number) => void;
  isInactive: boolean;
}) {
  return (
    <Card className={cn("mb-4", isInactive && "opacity-70")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-1 flex items-center">
            {variant.name}
            {variant.isControl && (
              <Badge className="ml-2 bg-blue-500">Control</Badge>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(variant)}
              disabled={isInactive}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(variant.id)}
              disabled={isInactive || variant.isControl}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {variant.description && (
          <p className="text-sm mb-3 text-gray-700">{variant.description}</p>
        )}
        {variant.impressions != null && variant.conversions != null && (
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Impressions:</span>
              <span className="font-medium">{variant.impressions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Conversions:</span>
              <span className="font-medium">{variant.conversions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Conversion Rate:</span>
              <span className="font-medium">{(variant.conversionRate || 0).toFixed(2)}%</span>
            </div>
          </div>
        )}
        {variant.content && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="text-sm font-medium mb-1">Content:</h4>
            <div className="text-xs bg-gray-50 p-2 rounded-md border overflow-auto max-h-32">
              {variant.content}
            </div>
          </div>
        )}
        {variant.customProperties && Object.keys(variant.customProperties).length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="text-sm font-medium mb-1">Custom Properties:</h4>
            <div className="space-y-1">
              {Object.entries(variant.customProperties).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TestResults({ test, onClose }: { test: any; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/ab-tests/${test.id}/results`);
        if (!res.ok) {
          throw new Error(`Failed to fetch results: ${res.statusText}`);
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        toast({
          title: "Error fetching results",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [test.id, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load test results: {error}
          </AlertDescription>
        </Alert>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Results Available</AlertTitle>
          <AlertDescription>
            There are no results available for this test yet.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }
  
  const { metrics, variants, status } = results;
  const isSignificant = metrics?.isSignificant;
  const bestVariant = metrics?.bestVariant;
  const controlVariant = variants?.find((v: any) => v.isControl);
  
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{test.name} - Results</h2>
      
      {status === 'completed' && isSignificant && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Trophy className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Significant Result Found!</AlertTitle>
          <AlertDescription>
            The test reached statistical significance with {metrics.confidenceLevel.toFixed(1)}% confidence.
            {bestVariant && ` "${bestVariant.name}" is the winner with a ${formatPercentage(metrics.improvement)} improvement over the control.`}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'completed' && !isSignificant && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">No Significant Result</AlertTitle>
          <AlertDescription>
            The test completed but did not reach statistical significance with the required confidence level ({test.minimumConfidence}%).
            Current confidence level: {metrics.confidenceLevel.toFixed(1)}%.
          </AlertDescription>
        </Alert>
      )}
      
      {status !== 'completed' && (
        <Alert className="mb-6">
          <Clock className="h-4 w-4" />
          <AlertTitle>Test in Progress</AlertTitle>
          <AlertDescription>
            This test is still running. Results are preliminary and may change.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Impressions:</span>
                <span className="font-medium">{metrics.totalImpressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Conversions:</span>
                <span className="font-medium">{metrics.totalConversions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Overall Conversion Rate:</span>
                <span className="font-medium">{formatPercentage(metrics.overallConversionRate)}</span>
              </div>
              {metrics.improvement !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Best vs Control:</span>
                  <span className={`font-medium ${metrics.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.improvement > 0 ? '+' : ''}{formatPercentage(metrics.improvement)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium capitalize">{status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Significance Level:</span>
                <span className="font-medium">{metrics.confidenceLevel.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Required Sample Size:</span>
                <span className="font-medium">{test.targetSampleSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates:</span>
                <span className="font-medium">
                  {formatDate(test.startDate)} - {test.endDate ? formatDate(test.endDate) : 'Present'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variant Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variants.map((variant: any) => (
                <div key={variant.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{variant.name}</span>
                      {variant.isControl && <Badge variant="outline">Control</Badge>}
                      {bestVariant && bestVariant.id === variant.id && !variant.isControl && (
                        <Badge className="ml-1 bg-green-500">Winner</Badge>
                      )}
                    </div>
                    <span className="font-medium">{formatPercentage(variant.conversionRate)}</span>
                  </div>
                  <Progress 
                    value={variant.conversionRate} 
                    max={Math.max(...variants.map((v: any) => v.conversionRate)) * 1.2} 
                    className={cn(
                      bestVariant && bestVariant.id === variant.id && !variant.isControl ? "bg-green-500" : "",
                      variant.isControl ? "bg-blue-500" : ""
                    )}
                  />
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>{variant.impressions.toLocaleString()} impressions</span>
                    <span>{variant.conversions.toLocaleString()} conversions</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  {controlVariant && <TableHead>vs Control</TableHead>}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant: any) => {
                  let improvement = 0;
                  if (controlVariant && !variant.isControl) {
                    improvement = controlVariant.conversionRate > 0 
                      ? ((variant.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate) * 100
                      : 0;
                  }
                  
                  return (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        {variant.name}
                        {variant.isControl && <Badge className="ml-2" variant="outline">Control</Badge>}
                      </TableCell>
                      <TableCell>{variant.impressions.toLocaleString()}</TableCell>
                      <TableCell>{variant.conversions.toLocaleString()}</TableCell>
                      <TableCell>{formatPercentage(variant.conversionRate)}</TableCell>
                      {controlVariant && (
                        <TableCell>
                          {variant.isControl ? (
                            "—"
                          ) : (
                            <span className={improvement > 0 ? "text-green-600" : improvement < 0 ? "text-red-600" : ""}>
                              {improvement > 0 ? "+" : ""}{formatPercentage(improvement)}
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {bestVariant && bestVariant.id === variant.id && !variant.isControl ? (
                          <Badge className="bg-green-500">Winner</Badge>
                        ) : variant.impressions < test.targetSampleSize / variants.length ? (
                          <Badge variant="outline">Needs more data</Badge>
                        ) : (
                          <Badge variant="outline">Completed</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

function getTestTrackerCode(test: any, variants: any[]) {
  if (!variants || variants.length === 0) {
    return {
      javascript: '// No variants defined for this test yet',
      html: '<!-- No variants defined for this test yet -->'
    };
  }
  
  // Generate JavaScript code
  const jsCode = `
// A/B Test Tracking Code for "${test.name}"
document.addEventListener('DOMContentLoaded', function() {
  // Generate a session ID if one doesn't exist
  if (!sessionStorage.getItem('abTestSessionId')) {
    sessionStorage.setItem('abTestSessionId', 
      Math.random().toString(36).substring(2, 15) + 
      Math.random().toString(36).substring(2, 15)
    );
  }
  
  const sessionId = sessionStorage.getItem('abTestSessionId');
  const testId = ${test.id};
  const variants = ${JSON.stringify(variants.map(v => ({ 
    id: v.id, 
    name: v.name,
    isControl: v.isControl 
  })))};
  
  // Check if user is already in a variant for this test
  const variantId = sessionStorage.getItem('abTestVariant_' + testId);
  
  if (variantId) {
    // User already assigned to a variant
    console.log('User already in variant:', variantId);
    applyVariant(parseInt(variantId));
  } else {
    // Assign user to a variant
    // In a real implementation, you would call your API to get the assigned variant
    // For simplicity, randomly assign here
    const selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    
    // Store the assignment
    sessionStorage.setItem('abTestVariant_' + testId, selectedVariant.id);
    
    // Record impression in your analytics system
    fetch('/api/ab-tests/variants/' + selectedVariant.id + '/impression', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: sessionId,
        referrer: document.referrer,
        device: navigator.userAgent
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Impression recorded:', data);
      // Apply the variant changes
      applyVariant(selectedVariant.id);
    })
    .catch(error => {
      console.error('Error recording impression:', error);
    });
  }
  
  function applyVariant(variantId) {
    // Apply the changes for the variant
    const variant = variants.find(v => v.id === variantId);
    console.log('Applying variant:', variant.name);
    
    // This is where you would apply the changes based on the variant
    // For example, changing text, styles, etc.
    
    // When a conversion happens, call this function
    function recordConversion() {
      fetch('/api/ab-tests/variants/' + variantId + '/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Conversion recorded:', data);
      })
      .catch(error => {
        console.error('Error recording conversion:', error);
      });
    }
    
    // Example: Track conversion on button click
    // document.querySelector('#signup-button').addEventListener('click', recordConversion);
    
    // Example: Track conversion on page load (if this is a conversion page)
    // recordConversion();
  }
});`;

  // Generate HTML code
  const htmlCode = `
<!-- A/B Test Tracking Code for "${test.name}" -->
<script>
${jsCode}
</script>

<!-- Example: Add this to the conversion element -->
<button id="signup-button">Sign Up Now</button>
`;

  return {
    javascript: jsCode,
    html: htmlCode
  };
}

export default function ABTesting() {
  const { toast } = useToast();
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = useState(false);
  const [isUpdateTestDialogOpen, setIsUpdateTestDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isManageVariantsOpen, setIsManageVariantsOpen] = useState(false);
  const [isNewVariantDialogOpen, setIsNewVariantDialogOpen] = useState(false);
  const [isUpdateVariantDialogOpen, setIsUpdateVariantDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isViewResultsOpen, setIsViewResultsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const testForm = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "ab",
      targetSampleSize: 1000,
      minimumConfidence: 95,
      status: "draft",
      metric: "conversion",
      trafficAllocation: 100,
    },
  });

  const updateTestForm = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "ab",
      targetSampleSize: 1000,
      minimumConfidence: 95,
      status: "draft",
      metric: "conversion",
      trafficAllocation: 100,
    },
  });
  
  const variantForm = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      description: "",
      isControl: false,
      content: "",
    },
  });
  
  const updateVariantForm = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      description: "",
      isControl: false,
      content: "",
    },
  });
  
  const { data: tests, isLoading, error } = useQuery({
    queryKey: ["/api/ab-tests"],
    refetchOnWindowFocus: false,
  });
  
  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: ["/api/ab-tests", selectedTest?.id, "variants"],
    enabled: !!selectedTest?.id && isManageVariantsOpen,
    refetchOnWindowFocus: false,
  });
  
  const createTestMutation = useMutation({
    mutationFn: async (data: TestFormValues) => {
      const res = await apiRequest("POST", "/api/ab-tests", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test created",
        description: "Your A/B test has been created successfully.",
      });
      testForm.reset();
      setIsNewTestDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating test",
        description: error.message || "An error occurred while creating the test.",
        variant: "destructive",
      });
    },
  });
  
  const updateTestMutation = useMutation({
    mutationFn: async (data: TestFormValues & { id: number }) => {
      const { id, ...testData } = data;
      const res = await apiRequest("PUT", `/api/ab-tests/${id}`, testData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test updated",
        description: "Your A/B test has been updated successfully.",
      });
      updateTestForm.reset();
      setIsUpdateTestDialogOpen(false);
      setSelectedTest(null);
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating test",
        description: error.message || "An error occurred while updating the test.",
        variant: "destructive",
      });
    },
  });
  
  const updateTestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/ab-tests/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The test status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message || "An error occurred while updating the status.",
        variant: "destructive",
      });
    },
  });
  
  const deleteTestMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/ab-tests/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test deleted",
        description: "The A/B test has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting test",
        description: error.message || "An error occurred while deleting the test.",
        variant: "destructive",
      });
    },
  });
  
  const createVariantMutation = useMutation({
    mutationFn: async (data: VariantFormValues & { testId: number }) => {
      const { testId, ...variantData } = data;
      const res = await apiRequest("POST", `/api/ab-tests/${testId}/variants`, variantData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Variant created",
        description: "Your test variant has been created successfully.",
      });
      variantForm.reset();
      setIsNewVariantDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests", selectedTest?.id, "variants"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating variant",
        description: error.message || "An error occurred while creating the variant.",
        variant: "destructive",
      });
    },
  });
  
  const updateVariantMutation = useMutation({
    mutationFn: async (data: VariantFormValues & { id: number; testId: number }) => {
      const { id, testId, ...variantData } = data;
      const res = await apiRequest("PUT", `/api/ab-tests/${testId}/variants/${id}`, variantData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Variant updated",
        description: "Your test variant has been updated successfully.",
      });
      updateVariantForm.reset();
      setIsUpdateVariantDialogOpen(false);
      setSelectedVariant(null);
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests", selectedTest?.id, "variants"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating variant",
        description: error.message || "An error occurred while updating the variant.",
        variant: "destructive",
      });
    },
  });
  
  const deleteVariantMutation = useMutation({
    mutationFn: async ({ id, testId }: { id: number; testId: number }) => {
      const res = await apiRequest("DELETE", `/api/ab-tests/${testId}/variants/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Variant deleted",
        description: "The test variant has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ab-tests", selectedTest?.id, "variants"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting variant",
        description: error.message || "An error occurred while deleting the variant.",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateTest = (values: TestFormValues) => {
    createTestMutation.mutate(values);
  };
  
  const handleUpdateTest = (values: TestFormValues) => {
    if (selectedTest) {
      updateTestMutation.mutate({ ...values, id: selectedTest.id });
    }
  };
  
  const handleEditTest = (test: any) => {
    setSelectedTest(test);
    updateTestForm.reset({
      name: test.name,
      description: test.description || "",
      type: test.type,
      targetSampleSize: test.targetSampleSize,
      minimumConfidence: test.minimumConfidence,
      status: test.status,
      metric: test.metric,
      page: test.page || "",
      element: test.element || "",
      conversionPage: test.conversionPage || "",
      conversionEvent: test.conversionEvent || "",
      trafficAllocation: test.trafficAllocation || 100,
      startDate: test.startDate ? new Date(test.startDate) : undefined,
      endDate: test.endDate ? new Date(test.endDate) : undefined,
    });
    setIsUpdateTestDialogOpen(true);
  };
  
  const handleDeleteTest = (id: number) => {
    if (window.confirm("Are you sure you want to delete this A/B test? This will delete all variants and results.")) {
      deleteTestMutation.mutate(id);
    }
  };
  
  const handleStatusChange = (id: number, status: string) => {
    updateTestStatusMutation.mutate({ id, status });
  };
  
  const handleManageVariants = (test: any) => {
    setSelectedTest(test);
    setIsManageVariantsOpen(true);
  };
  
  const handleViewResults = (test: any) => {
    setSelectedTest(test);
    setIsViewResultsOpen(true);
  };
  
  const handleCreateVariant = (values: VariantFormValues) => {
    if (selectedTest) {
      createVariantMutation.mutate({ ...values, testId: selectedTest.id });
    }
  };
  
  const handleUpdateVariant = (values: VariantFormValues) => {
    if (selectedTest && selectedVariant) {
      updateVariantMutation.mutate({ 
        ...values, 
        id: selectedVariant.id, 
        testId: selectedTest.id 
      });
    }
  };
  
  const handleEditVariant = (variant: any) => {
    setSelectedVariant(variant);
    updateVariantForm.reset({
      name: variant.name,
      description: variant.description || "",
      isControl: variant.isControl,
      content: variant.content || "",
      customProperties: variant.customProperties || {},
    });
    setIsUpdateVariantDialogOpen(true);
  };
  
  const handleDeleteVariant = (id: number) => {
    if (selectedTest && window.confirm("Are you sure you want to delete this variant?")) {
      deleteVariantMutation.mutate({ id, testId: selectedTest.id });
    }
  };
  
  const handleShowIntegration = (test: any) => {
    setSelectedTest(test);
    setIsIntegrationDialogOpen(true);
  };
  
  // Filter tests based on status
  const filteredTests = tests 
    ? tests.filter((test: any) => activeTab === "all" || test.status === activeTab)
    : [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">A/B Testing</h2>
          <p className="text-muted-foreground">
            Create and manage A/B tests to optimize your website and marketing
          </p>
        </div>
        <Dialog open={isNewTestDialogOpen} onOpenChange={setIsNewTestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create new A/B test</DialogTitle>
              <DialogDescription>
                Set up a new A/B test to optimize your website or marketing campaigns
              </DialogDescription>
            </DialogHeader>
            <Form {...testForm}>
              <form onSubmit={testForm.handleSubmit(handleCreateTest)} className="space-y-4">
                <FormField
                  control={testForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Homepage Headline Test" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={testForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the test purpose and hypothesis..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ab">A/B Test</SelectItem>
                            <SelectItem value="multivariate">Multivariate</SelectItem>
                            <SelectItem value="split">Split URL Test</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="metric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Metric</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select metric" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="conversion">Conversion Rate</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="clicks">Click Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="targetSampleSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Sample Size</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={100} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Minimum number of visitors needed for statistical significance
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
                          <Input type="number" {...field} min={50} max={99.9} step={0.1} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Statistical confidence threshold (usually 95%)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="page"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Page URL</FormLabel>
                        <FormControl>
                          <Input placeholder="/homepage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="element"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Element</FormLabel>
                        <FormControl>
                          <Input placeholder="#hero-headline" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={testForm.control}
                    name="conversionPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conversion Page</FormLabel>
                        <FormControl>
                          <Input placeholder="/thank-you" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="conversionEvent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conversion Event</FormLabel>
                        <FormControl>
                          <Input placeholder="form-submit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={testForm.control}
                  name="trafficAllocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Allocation (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} max={100} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Percentage of traffic to include in the test
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createTestMutation.isPending}
                  >
                    {createTestMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Test
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Update Test Dialog */}
        <Dialog open={isUpdateTestDialogOpen} onOpenChange={setIsUpdateTestDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update A/B test</DialogTitle>
              <DialogDescription>
                Edit your existing A/B test
              </DialogDescription>
            </DialogHeader>
            {selectedTest && (
              <Form {...updateTestForm}>
                <form onSubmit={updateTestForm.handleSubmit(handleUpdateTest)} className="space-y-4">
                  <FormField
                    control={updateTestForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateTestForm.control}
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
                      control={updateTestForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ab">A/B Test</SelectItem>
                              <SelectItem value="multivariate">Multivariate</SelectItem>
                              <SelectItem value="split">Split URL Test</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateTestForm.control}
                      name="metric"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Metric</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select metric" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="conversion">Conversion Rate</SelectItem>
                              <SelectItem value="revenue">Revenue</SelectItem>
                              <SelectItem value="engagement">Engagement</SelectItem>
                              <SelectItem value="clicks">Click Rate</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateTestForm.control}
                      name="targetSampleSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Sample Size</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={100} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateTestForm.control}
                      name="minimumConfidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Confidence (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={50} max={99.9} step={0.1} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateTestForm.control}
                      name="page"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Page URL</FormLabel>
                          <FormControl>
                            <Input placeholder="/homepage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateTestForm.control}
                      name="element"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Element</FormLabel>
                          <FormControl>
                            <Input placeholder="#hero-headline" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateTestForm.control}
                      name="conversionPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conversion Page</FormLabel>
                          <FormControl>
                            <Input placeholder="/thank-you" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={updateTestForm.control}
                      name="conversionEvent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conversion Event</FormLabel>
                          <FormControl>
                            <Input placeholder="form-submit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateTestForm.control}
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
                      control={updateTestForm.control}
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
                  
                  <FormField
                    control={updateTestForm.control}
                    name="trafficAllocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Traffic Allocation (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} max={100} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Percentage of traffic to include in the test
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateTestForm.control}
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updateTestMutation.isPending}
                    >
                      {updateTestMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Test
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Manage Variants Dialog */}
        <Dialog 
          open={isManageVariantsOpen} 
          onOpenChange={setIsManageVariantsOpen}
          modal={false}
        >
          <DialogContent className="sm:max-w-[700px] max-h-screen overflow-auto">
            <DialogHeader>
              <DialogTitle>Manage Test Variants</DialogTitle>
              <DialogDescription>
                {selectedTest?.name} - Create and manage test variants
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Variants</h3>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShowIntegration(selectedTest)}
                  >
                    <Terminal className="h-4 w-4 mr-1" /> Integration Code
                  </Button>
                  
                  <Dialog open={isNewVariantDialogOpen} onOpenChange={setIsNewVariantDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={selectedTest?.status === 'completed'}>
                        <PlusCircle className="h-4 w-4 mr-1" /> New Variant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create new variant</DialogTitle>
                        <DialogDescription>
                          Add a new variant for "{selectedTest?.name}"
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...variantForm}>
                        <form onSubmit={variantForm.handleSubmit(handleCreateVariant)} className="space-y-4">
                          <FormField
                            control={variantForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Variant Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Variant B" {...field} />
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
                                  <Textarea placeholder="Describe this variant..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={variantForm.control}
                            name="isControl"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Control Variant</FormLabel>
                                  <FormDescription>
                                    Is this the control (baseline) variant?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={variants?.some((v: any) => v.isControl)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={variantForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Content or code for this variant..." 
                                    {...field} 
                                    className="font-mono"
                                    rows={5}
                                  />
                                </FormControl>
                                <FormDescription>
                                  HTML, text or code for this variant
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button 
                              type="submit" 
                              disabled={createVariantMutation.isPending}
                            >
                              {createVariantMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Create Variant
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {isLoadingVariants ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : variants && variants.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                  <ArrowRightLeft className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-base font-medium mb-2">No variants yet</h3>
                  <p className="text-gray-500 mb-4 text-sm">Start by creating at least two variants for your test</p>
                  <Button 
                    size="sm" 
                    onClick={() => setIsNewVariantDialogOpen(true)}
                    disabled={selectedTest?.status === 'completed'}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create First Variant
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {variants && variants.map((variant: any) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      onEdit={handleEditVariant}
                      onDelete={handleDeleteVariant}
                      isInactive={selectedTest?.status === 'completed'}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4">
              <Button onClick={() => setIsManageVariantsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Update Variant Dialog */}
        <Dialog open={isUpdateVariantDialogOpen} onOpenChange={setIsUpdateVariantDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update variant</DialogTitle>
              <DialogDescription>
                Edit an existing variant
              </DialogDescription>
            </DialogHeader>
            {selectedVariant && (
              <Form {...updateVariantForm}>
                <form onSubmit={updateVariantForm.handleSubmit(handleUpdateVariant)} className="space-y-4">
                  <FormField
                    control={updateVariantForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateVariantForm.control}
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
                  
                  <FormField
                    control={updateVariantForm.control}
                    name="isControl"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Control Variant</FormLabel>
                          <FormDescription>
                            Is this the control (baseline) variant?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              selectedVariant.isControl || 
                              (variants?.some((v: any) => v.isControl && v.id !== selectedVariant.id))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={updateVariantForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="font-mono"
                            rows={5}
                          />
                        </FormControl>
                        <FormDescription>
                          HTML, text or code for this variant
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={updateVariantMutation.isPending}
                    >
                      {updateVariantMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Variant
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* View Results Dialog */}
        <Dialog 
          open={isViewResultsOpen} 
          onOpenChange={setIsViewResultsOpen}
          modal={false}
        >
          <DialogContent className="sm:max-w-[800px] max-h-screen overflow-auto">
            {selectedTest && (
              <TestResults 
                test={selectedTest} 
                onClose={() => setIsViewResultsOpen(false)} 
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Integration Code Dialog */}
        <Dialog 
          open={isIntegrationDialogOpen} 
          onOpenChange={setIsIntegrationDialogOpen}
          modal={false}
        >
          <DialogContent className="sm:max-w-[800px] max-h-screen overflow-auto">
            <DialogHeader>
              <DialogTitle>Integration Code</DialogTitle>
              <DialogDescription>
                Code to implement the A/B test on your website
              </DialogDescription>
            </DialogHeader>
            
            {selectedTest && variants && (
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600">Implementation Instructions</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p className="mb-2">
                      Copy and paste the code below into your website to implement the A/B test. The code will:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Assign visitors to a variant</li>
                      <li>Apply the variant's changes to your page</li>
                      <li>Track impressions and conversions</li>
                    </ol>
                  </AlertDescription>
                </Alert>
                
                <div className="rounded-md border">
                  <CodeHighlightTabs
                    code={getTestTrackerCode(selectedTest, variants)}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Tracking Conversions</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    To track conversions, call the <code className="bg-gray-100 px-1 py-0.5 rounded">recordConversion()</code> function on your conversion page or when a conversion event occurs.
                    For example, when a user clicks a button or submits a form.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md border">
                    <pre className="text-sm overflow-auto">
                      <code>
{`// Example: Record a conversion when a button is clicked
document.querySelector('#signup-button').addEventListener('click', recordConversion);

// Example: Record a conversion on page load (if this is a conversion page)
window.addEventListener('load', recordConversion);`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-4">
              <Button onClick={() => setIsIntegrationDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Status Filter Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error loading A/B tests: {(error as Error).message}</p>
        </div>
      ) : tests && tests.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Beaker className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No A/B tests yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first A/B test</p>
          <Button onClick={() => setIsNewTestDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Test
          </Button>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <Beaker className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No {activeTab} tests found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === "active" ? "You don't have any active tests right now" :
             activeTab === "paused" ? "You don't have any paused tests right now" :
             activeTab === "completed" ? "You don't have any completed tests yet" :
             activeTab === "draft" ? "You don't have any draft tests right now" :
             "No tests match the current filter"}
          </p>
          {activeTab !== "all" && (
            <Button variant="outline" onClick={() => setActiveTab("all")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Show All Tests
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tests Section - shown on All tab */}
          {activeTab === "all" && filteredTests.some((t: any) => t.status === "active") && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Active Tests</h3>
              {filteredTests
                .filter((t: any) => t.status === "active")
                .map((test: any) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    onEdit={handleEditTest}
                    onDelete={handleDeleteTest}
                    onViewResults={handleViewResults}
                    onManageVariants={handleManageVariants}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          )}
          
          {/* Other Tests */}
          <div>
            {activeTab === "all" ? (
              <h3 className="text-lg font-semibold mb-4">
                {filteredTests.some((t: any) => t.status === "active") ? "Other Tests" : "All Tests"}
              </h3>
            ) : null}
            
            {filteredTests
              .filter((t: any) => activeTab === "all" ? t.status !== "active" : true)
              .map((test: any) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onEdit={handleEditTest}
                  onDelete={handleDeleteTest}
                  onViewResults={handleViewResults}
                  onManageVariants={handleManageVariants}
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}