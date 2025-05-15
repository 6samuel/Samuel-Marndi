import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, Download, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface CampaignDashboardProps {
  trackerId?: number;
}

/**
 * Campaign Dashboard component for marketing campaign analysis
 */
export default function CampaignDashboard({ trackerId = 1 }: CampaignDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("7d");

  // Query for campaign analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: [`/api/ad-trackers/${trackerId}/analytics`, timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/ad-trackers/${trackerId}/analytics?range=${timeRange}`);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      return res.json();
    },
  });

  // Prepare data for source breakdown pie chart
  const sourceData = analytics?.trafficSources
    ? Object.entries(analytics.trafficSources).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // Prepare data for device type chart
  const deviceData = analytics?.deviceTypes
    ? Object.entries(analytics.deviceTypes).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-7"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h2 className="text-xl font-semibold">{analytics?.trackerName || "Campaign Dashboard"}</h2>
            <Badge variant={analytics?.active ? "default" : "secondary"}>
              {analytics?.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Platform: {analytics?.platform || "All Platforms"}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex rounded-md border border-input overflow-hidden">
            <Button
              variant={timeRange === "7d" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${timeRange === "7d" ? "" : "hover:bg-muted"}`}
              onClick={() => setTimeRange("7d")}
            >
              7d
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${timeRange === "30d" ? "" : "hover:bg-muted"}`}
              onClick={() => setTimeRange("30d")}
            >
              30d
            </Button>
            <Button
              variant={timeRange === "90d" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${timeRange === "90d" ? "" : "hover:bg-muted"}`}
              onClick={() => setTimeRange("90d")}
            >
              90d
            </Button>
            <Button
              variant={timeRange === "1y" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${timeRange === "1y" ? "" : "hover:bg-muted"}`}
              onClick={() => setTimeRange("1y")}
            >
              1y
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalHits.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.hitsTrend >= 0 ? "+" : ""}{analytics?.hitsTrend || 0}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalConversions.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.conversionsTrend >= 0 ? "+" : ""}{analytics?.conversionsTrend || 0}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.conversionRateTrend >= 0 ? "+" : ""}{analytics?.conversionRateTrend || 0}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Source</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{analytics?.topSource || "direct"}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.topSourcePercentage || 0}% of all traffic
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Daily visits and conversions over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {analytics?.dailyStats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.dailyStats}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hits"
                      name="Visits"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="conversions"
                      name="Conversions"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
              <CardDescription>
                Daily conversion rate over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {analytics?.dailyStats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.dailyStats}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversionRate"
                      name="Conversion Rate (%)"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Breakdown of traffic by referral source
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {sourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No source data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Traffic Sources Over Time</CardTitle>
              <CardDescription>
                How your traffic sources have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {analytics?.dailyStats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.dailyStats.map((day: any) => ({
                      date: day.date,
                      [day.topSource]: day.hits,
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Dynamically render bars based on unique sources */}
                    {Array.from(
                      new Set(
                        analytics.dailyStats.map((day: any) => day.topSource)
                      )
                    ).map((source: any, index: number) => (
                      <Bar
                        key={source}
                        dataKey={source}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>
                Breakdown of traffic by device type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No device data available for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}