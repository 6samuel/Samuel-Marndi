import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  DoughnutChart,
} from "@/components/charts/chart-components";
import { Loader2, BarChart3, LineChart as LineChartIcon, PieChart, Users, MousePointer, Eye, Radio } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdTracker,
  AdTrackerHit
} from "@shared/schema";

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper to calculate percentage change
const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 100; // If previous was 0, we count this as 100% increase
  return Math.round(((current - previous) / previous) * 100);
};

// Analytics dashboard component
const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [selectedTracker, setSelectedTracker] = useState<number | null>(null);
  
  // Fetch ad trackers
  const { data: adTrackers, isLoading: isLoadingTrackers } = useQuery<AdTracker[]>({
    queryKey: ['/api/ad-trackers'],
  });
  
  // Fetch analytics overview data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<{
    totalVisits: number;
    totalConversions: number;
    conversionRate: number;
    previousPeriodVisits: number;
    previousPeriodConversions: number;
    bySource: Record<string, number>;
    byDevice: Record<string, number>;
    dailyVisits: Array<{ date: string; count: number }>;
    dailyConversions: Array<{ date: string; count: number }>;
  }>({
    queryKey: ['/api/analytics/overview', { timeRange, trackerId: selectedTracker }],
  });
  
  // Fetch tracker hits for the selected tracker
  const { data: trackerHits, isLoading: isLoadingHits } = useQuery<AdTrackerHit[]>({
    queryKey: ['/api/ad-trackers', selectedTracker, 'hits'],
    enabled: selectedTracker !== null,
  });
  
  // Set the first tracker as selected if none is selected yet
  useEffect(() => {
    if (adTrackers && adTrackers.length > 0 && selectedTracker === null) {
      setSelectedTracker(adTrackers[0].id);
    }
  }, [adTrackers, selectedTracker]);
  
  // If data is loading, show a loading spinner
  if (isLoadingTrackers || isLoadingAnalytics) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Extract analytics data or provide defaults
  const {
    totalVisits = 0,
    totalConversions = 0,
    conversionRate = 0,
    previousPeriodVisits = 0,
    previousPeriodConversions = 0,
    bySource = {},
    byDevice = {},
    dailyVisits = [],
    dailyConversions = [],
  } = analyticsData || {};
  
  // Calculate percentage changes
  const visitsChange = calculatePercentageChange(totalVisits, previousPeriodVisits);
  const conversionsChange = calculatePercentageChange(totalConversions, previousPeriodConversions);
  
  // Prepare chart data
  const sourceData = {
    labels: Object.keys(bySource),
    datasets: [
      {
        label: 'Visits by Source',
        data: Object.values(bySource),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
          'rgba(249, 115, 22, 0.7)', // orange
          'rgba(239, 68, 68, 0.7)',  // red
          'rgba(139, 92, 246, 0.7)', // purple
        ],
      },
    ],
  };
  
  const deviceData = {
    labels: Object.keys(byDevice),
    datasets: [
      {
        label: 'Visits by Device',
        data: Object.values(byDevice),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
          'rgba(249, 115, 22, 0.7)', // orange
        ],
      },
    ],
  };
  
  // Daily visits chart data
  const visitsData = {
    labels: dailyVisits.map(item => item.date),
    datasets: [
      {
        label: 'Visits',
        data: dailyVisits.map(item => item.count),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  // Daily conversions chart data
  const conversionsData = {
    labels: dailyConversions.map(item => item.date),
    datasets: [
      {
        label: 'Conversions',
        data: dailyConversions.map(item => item.count),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  // Conversion rate by source chart data
  const conversionsBySourceData = {
    labels: Object.keys(bySource),
    datasets: [
      {
        label: 'Conversion Rate',
        data: Object.keys(bySource).map(source => {
          // Calculate conversion rate for each source
          const sourceHits = trackerHits?.filter(hit => hit.utmSource === source) || [];
          const sourceConversions = sourceHits.filter(hit => hit.converted).length;
          return sourceHits.length ? Math.round((sourceConversions / sourceHits.length) * 100) : 0;
        }),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Marketing Analytics</h2>
        
        <div className="flex items-center space-x-4">
          {/* Tracker selection */}
          <Select 
            value={selectedTracker?.toString()} 
            onValueChange={(value) => setSelectedTracker(parseInt(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              {adTrackers?.map((tracker) => (
                <SelectItem key={tracker.id} value={tracker.id.toString()}>
                  {tracker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Time range selection */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            Export Report
          </Button>
        </div>
      </div>
      
      {/* KPI summary cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalVisits)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge className={visitsChange >= 0 ? "bg-emerald-500" : "bg-rose-500"}>
                {visitsChange >= 0 ? "+" : ""}{visitsChange}%
              </Badge>
              <span className="ml-1">vs. previous period</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalConversions)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge className={conversionsChange >= 0 ? "bg-emerald-500" : "bg-rose-500"}>
                {conversionsChange >= 0 ? "+" : ""}{conversionsChange}%
              </Badge>
              <span className="ml-1">vs. previous period</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Optimal range: 3-5%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adTrackers?.filter(t => t.active).length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {adTrackers?.length || 0} total campaigns
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and detailed analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="conversions">Conversion Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Daily visits over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <LineChart data={visitsData} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Source</CardTitle>
                <CardDescription>Distribution of visits by referral source</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DoughnutChart data={sourceData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Device</CardTitle>
                <CardDescription>Distribution of visits by device type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DoughnutChart data={deviceData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Traffic Sources tab */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Detailed breakdown of traffic by source</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart data={sourceData} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Source Performance</CardTitle>
              <CardDescription>Conversion rates by traffic source</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={conversionsBySourceData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Devices tab */}
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>Visits by device type</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <DoughnutChart data={deviceData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conversions tab */}
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Trends</CardTitle>
              <CardDescription>Daily conversions over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <LineChart data={conversionsData} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate by Source</CardTitle>
              <CardDescription>Effectiveness of different traffic sources</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={conversionsBySourceData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;