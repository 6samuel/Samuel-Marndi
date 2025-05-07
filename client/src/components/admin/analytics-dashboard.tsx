import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingDown, TrendingUp, Activity, Users, BarChart2, PieChart } from 'lucide-react';
import { LineChart, BarChart, DoughnutChart } from '@/components/charts/chart-components';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for analytics data
interface OverviewData {
  totalVisits: number;
  totalConversions: number;
  conversionRate: number;
  previousPeriodVisits: number;
  previousPeriodConversions: number;
  bySource: Record<string, number>;
  byDevice: Record<string, number>;
  dailyVisits: Array<{ date: string; count: number }>;
  dailyConversions: Array<{ date: string; count: number }>;
}

interface TrackerData {
  tracker: {
    id: number;
    name: string;
    platform: string;
    campaignId: string;
    conversionGoal: string;
    active: boolean;
  };
  hits: number;
  conversions: number;
  conversionRate: number;
}

interface DashboardData {
  activeTrackersCount: number;
  totalTrackersCount: number;
  last30DaysHitsCount: number;
  last30DaysConversionsCount: number;
  conversionRate: number;
}

interface ConversionData {
  conversionsBySource: Array<{
    source: string;
    totalHits: number;
    conversions: number;
    conversionRate: number;
  }>;
  conversionsByDevice: Array<{
    device: string;
    totalHits: number;
    conversions: number;
    conversionRate: number;
  }>;
  dailyConversionRates: Array<{
    date: string;
    totalHits: number;
    conversions: number;
    conversionRate: number;
  }>;
}

// Define time period options
const TIME_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' }
];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrackerId, setSelectedTrackerId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery<DashboardData>({
    queryKey: ['/api/analytics/dashboard'],
    enabled: activeTab === 'dashboard',
  });

  // Fetch overview data
  const { data: overviewData, isLoading: isOverviewLoading } = useQuery<OverviewData>({
    queryKey: ['/api/analytics/overview', { timeRange, trackerId: selectedTrackerId }],
    enabled: activeTab === 'overview',
  });

  // Fetch conversion data
  const { data: conversionData, isLoading: isConversionLoading } = useQuery<ConversionData>({
    queryKey: ['/api/analytics/conversions', { timeRange, trackerId: selectedTrackerId }],
    enabled: activeTab === 'conversions',
  });

  // Fetch ad trackers
  const { data: adTrackers, isLoading: isTrackersLoading } = useQuery<Array<{ id: number; name: string; platform: string }>>({
    queryKey: ['/api/ad-trackers'],
  });

  // Formats data for charts
  const formatLineChartData = (visits: Array<{ date: string; count: number }> = [], conversions: Array<{ date: string; count: number }> = []) => {
    const labels = visits.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const visitData = visits.map(item => item.count);
    const conversionData = conversions.map(item => item.count);

    return {
      labels,
      datasets: [
        {
          label: 'Visits',
          data: visitData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Conversions',
          data: conversionData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3,
        }
      ]
    };
  };

  const formatBarChartData = (data: Record<string, number> = {}) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6);
    
    return {
      labels: entries.map(([key]) => key),
      datasets: [
        {
          label: 'Visits',
          data: entries.map(([_, value]) => value),
          backgroundColor: [
            'rgba(53, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
        },
      ],
    };
  };

  const formatDoughnutChartData = (data: Record<string, number> = {}) => {
    const entries = Object.entries(data);
    
    return {
      labels: entries.map(([key]) => key),
      datasets: [
        {
          data: entries.map(([_, value]) => value),
          backgroundColor: [
            'rgba(53, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const formatConversionRatesData = (data: Array<{ date: string; totalHits: number; conversions: number; conversionRate: number }> = []) => {
    const labels = data.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const conversionRates = data.map(item => item.conversionRate);

    return {
      labels,
      datasets: [
        {
          label: 'Conversion Rate (%)',
          data: conversionRates,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
        }
      ]
    };
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const handleTrackerChange = (value: string) => {
    setSelectedTrackerId(value === 'all' ? null : parseInt(value));
  };

  // Calculate stats and trends
  const getStatTrend = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 100, isPositive: true };
    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(Math.round(percentage)),
      isPositive: percentage >= 0
    };
  };

  const visitsTrend = overviewData 
    ? getStatTrend(overviewData.totalVisits, overviewData.previousPeriodVisits)
    : { percentage: 0, isPositive: true };
    
  const conversionsTrend = overviewData 
    ? getStatTrend(overviewData.totalConversions, overviewData.previousPeriodConversions)
    : { percentage: 0, isPositive: true };

  // Render loading state
  if ((activeTab === 'overview' && isOverviewLoading) || 
      (activeTab === 'dashboard' && isDashboardLoading) || 
      (activeTab === 'conversions' && isConversionLoading) || 
      isTrackersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketing Analytics</h1>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {adTrackers && adTrackers.length > 0 && (
            <Select value={selectedTrackerId?.toString() || 'all'} onValueChange={handleTrackerChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {adTrackers.map(tracker => (
                  <SelectItem key={tracker.id} value={tracker.id.toString()}>
                    {tracker.name} ({tracker.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          {overviewData && (
            <>
              {/* Summary cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalVisits.toLocaleString()}</div>
                    <div className="flex items-center pt-1">
                      {visitsTrend.isPositive ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span className={visitsTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                        {visitsTrend.percentage}%
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalConversions.toLocaleString()}</div>
                    <div className="flex items-center pt-1">
                      {conversionsTrend.isPositive ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span className={conversionsTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                        {conversionsTrend.percentage}%
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">from previous period</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.conversionRate.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground pt-1">
                      {overviewData.totalVisits} visits / {overviewData.totalConversions} conversions
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Visits & Conversions Over Time</CardTitle>
                    <CardDescription>Daily traffic and conversion trends</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <LineChart 
                      data={formatLineChartData(overviewData.dailyVisits, overviewData.dailyConversions)} 
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Traffic Sources</CardTitle>
                    <CardDescription>Visits by referral source</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <BarChart 
                      data={formatBarChartData(overviewData.bySource)} 
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Distribution</CardTitle>
                    <CardDescription>Visits by device type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <DoughnutChart 
                      data={formatDoughnutChartData(overviewData.byDevice)} 
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Dashboard tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardData && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Trackers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.activeTrackersCount}</div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Out of {dashboardData.totalTrackersCount} total trackers
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">30-Day Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.last30DaysHitsCount.toLocaleString()}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">30-Day Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.last30DaysConversionsCount.toLocaleString()}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">30-Day Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.conversionRate.toFixed(2)}%</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Campaign Performance</CardTitle>
                  <CardDescription>Status and metrics for all your tracking campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Button onClick={() => toast({
                      title: "Coming soon!",
                      description: "Campaign comparison dashboard is under development."
                    })}>
                      View Campaign Comparison
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Conversions tab */}
        <TabsContent value="conversions" className="space-y-6">
          {conversionData && (
            <>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Conversion Rate Trend</CardTitle>
                  <CardDescription>Daily conversion rate over the selected time period</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <LineChart 
                    data={formatConversionRatesData(conversionData.dailyConversionRates)} 
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion by Source</CardTitle>
                    <CardDescription>Performance by traffic source</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Source</th>
                          <th className="py-2 text-right">Visits</th>
                          <th className="py-2 text-right">Conversions</th>
                          <th className="py-2 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversionData.conversionsBySource
                          .sort((a, b) => b.totalHits - a.totalHits)
                          .slice(0, 6)
                          .map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{item.source}</td>
                              <td className="py-2 text-right">{item.totalHits}</td>
                              <td className="py-2 text-right">{item.conversions}</td>
                              <td className="py-2 text-right">{item.conversionRate.toFixed(2)}%</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion by Device</CardTitle>
                    <CardDescription>Performance by device type</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Device</th>
                          <th className="py-2 text-right">Visits</th>
                          <th className="py-2 text-right">Conversions</th>
                          <th className="py-2 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversionData.conversionsByDevice
                          .sort((a, b) => b.totalHits - a.totalHits)
                          .map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{item.device || "Unknown"}</td>
                              <td className="py-2 text-right">{item.totalHits}</td>
                              <td className="py-2 text-right">{item.conversions}</td>
                              <td className="py-2 text-right">{item.conversionRate.toFixed(2)}%</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;