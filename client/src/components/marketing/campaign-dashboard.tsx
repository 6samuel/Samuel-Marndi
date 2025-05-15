import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ExternalLink, Download, PieChart, BarChart, TrendingUp } from 'lucide-react';
import { recordTrackerHit, getUtmParams } from '@/lib/campaign-tracking';

// Chart component (can be replaced with a real chart library)
const DummyChart = ({ type, data }: { type: string, data: any }) => {
  return (
    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center">
      {type === 'pie' ? (
        <PieChart className="w-12 h-12 text-gray-400" />
      ) : type === 'bar' ? (
        <BarChart className="w-12 h-12 text-gray-400" />
      ) : (
        <TrendingUp className="w-12 h-12 text-gray-400" />
      )}
      <span className="ml-2 text-gray-500">Chart visualization would appear here</span>
    </div>
  );
};

interface CampaignDashboardProps {
  trackerId?: number;
}

/**
 * Campaign Dashboard component for marketing campaign analysis
 */
export default function CampaignDashboard({ trackerId = 1 }: CampaignDashboardProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('sources');
  
  // Fetch campaign tracker data
  const { data: trackerData, isLoading, refetch } = useQuery({
    queryKey: [`/api/ad-trackers/${trackerId}/analytics`, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/ad-trackers/${trackerId}/analytics?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to load tracker analytics');
      }
      
      return response.json();
    }
  });
  
  // Manually trigger a hit for testing
  const testTrackingHit = async () => {
    await recordTrackerHit(trackerId);
    refetch();
  };
  
  // Export data as CSV
  const exportData = () => {
    if (!trackerData) return;
    
    // Convert data to CSV format
    const headers = ['date', 'hits', 'conversions', 'conversionRate', 'source'].join(',');
    const rows = trackerData.dailyStats.map((stat: any) => 
      [stat.date, stat.hits, stat.conversions, stat.conversionRate, stat.topSource].join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `campaign-data-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };
  
  // Display current UTM parameters
  const currentUtmParams = getUtmParams();
  const hasUtmParams = Object.keys(currentUtmParams).length > 0;

  return (
    <div className="space-y-6">
      {/* Current UTM Parameters */}
      {hasUtmParams && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Campaign Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(currentUtmParams).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium mr-2">{key}:</span>
                  <span className="text-gray-600 dark:text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Dashboard Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()}
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={testTrackingHit}>
            Test Hit
          </Button>
          <Button variant="outline" onClick={exportData} disabled={!trackerData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trackerData ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trackerData.totalHits}</div>
              <p className="text-xs text-gray-500 mt-1">
                {trackerData.hitsTrend > 0 ? '+' : ''}{trackerData.hitsTrend}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trackerData.totalConversions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {trackerData.conversionsTrend > 0 ? '+' : ''}{trackerData.conversionsTrend}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trackerData.conversionRate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {trackerData.conversionRateTrend > 0 ? '+' : ''}{trackerData.conversionRateTrend}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Top Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trackerData.topSource}</div>
              <p className="text-xs text-gray-500 mt-1">
                {trackerData.topSourcePercentage}% of total traffic
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No data available for this tracker. Try creating some test hits.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Chart Section */}
      {trackerData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Campaign Performance</CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sources">Traffic Sources</SelectItem>
                  <SelectItem value="devices">Device Types</SelectItem>
                  <SelectItem value="trends">Conversion Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              Visual breakdown of campaign performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartType === 'sources' && (
              <DummyChart type="pie" data={trackerData.trafficSources} />
            )}
            {chartType === 'devices' && (
              <DummyChart type="bar" data={trackerData.deviceTypes} />
            )}
            {chartType === 'trends' && (
              <DummyChart type="line" data={trackerData.dailyStats} />
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Tracking Guide</CardTitle>
          <CardDescription>
            How to implement campaign tracking URLs across your marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Implementation Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Use the Campaign URL Generator to create tracking URLs for each marketing channel</li>
              <li>Add these URLs to your ads, emails, social media posts, etc.</li>
              <li>Monitor traffic and conversions in this dashboard</li>
              <li>Optimize campaigns based on performance data</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Sample Tracking Code:</h4>
            <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
              {`// Add this code to track conversions
await fetch('/api/ad-trackers/${trackerId}/conversion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    conversionType: 'purchase',
  }),
});`}
            </pre>
          </div>
          
          <div className="flex justify-end">
            <Button variant="link" size="sm" className="pl-0">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Full Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}