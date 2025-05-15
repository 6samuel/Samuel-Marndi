import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, Plus, RefreshCw, Search, Target, Link as LinkIcon } from "lucide-react";
import CampaignDashboard from "@/components/marketing/campaign-dashboard";
import CampaignUrlGenerator from "@/components/marketing/campaign-url-generator";
import { adTrackers } from "@shared/schema";

function AdminMarketingCampaigns() {
  const [activeTrackerId, setActiveTrackerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");

  // Fetch ad trackers
  const { data: trackers, isLoading } = useQuery({
    queryKey: ["/api/ad-trackers"],
    queryFn: async () => {
      const response = await fetch("/api/ad-trackers");
      if (!response.ok) {
        throw new Error("Failed to fetch ad trackers");
      }
      return response.json();
    }
  });

  // Filter trackers based on search query
  const filteredTrackers = trackers?.filter((tracker: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      tracker.name.toLowerCase().includes(query) ||
      tracker.platform.toLowerCase().includes(query) ||
      tracker.campaignId.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Helmet>
        <title>Marketing Campaigns | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
            <p className="text-muted-foreground">
              Track, analyze, and manage your marketing campaigns and conversions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="analytics" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="url-generator">URL Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Visits
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,324</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversions
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87</div>
                  <p className="text-xs text-muted-foreground">
                    +4.3% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6.57%</div>
                  <p className="text-xs text-muted-foreground">
                    -0.2% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Campaigns
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">
                    +1 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {activeTrackerId ? (
              <CampaignDashboard trackerId={activeTrackerId} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Analytics</CardTitle>
                  <CardDescription>
                    Select a campaign from the list below to view detailed analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search campaigns..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center my-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Campaign</TableHead>
                              <TableHead>Platform</TableHead>
                              <TableHead>Visits</TableHead>
                              <TableHead>Conv. Rate</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredTrackers?.length > 0 ? (
                              filteredTrackers.map((tracker: any) => (
                                <TableRow 
                                  key={tracker.id}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() => setActiveTrackerId(tracker.id)}
                                >
                                  <TableCell className="font-medium">{tracker.name}</TableCell>
                                  <TableCell>{tracker.platform}</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>-</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      tracker.active 
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                    }`}>
                                      {tracker.active ? "Active" : "Inactive"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                  {searchQuery 
                                    ? "No campaigns matching your search" 
                                    : "No campaigns found. Create your first campaign."}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Create and manage your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Campaign ID</TableHead>
                          <TableHead>Conversion Goal</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTrackers?.length > 0 ? (
                          filteredTrackers.map((tracker: any) => (
                            <TableRow key={tracker.id}>
                              <TableCell className="font-medium">{tracker.name}</TableCell>
                              <TableCell>{tracker.platform}</TableCell>
                              <TableCell>{tracker.campaignId}</TableCell>
                              <TableCell>{tracker.conversionGoal}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  tracker.active 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                  {tracker.active ? "Active" : "Inactive"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              {searchQuery 
                                ? "No campaigns matching your search" 
                                : "No campaigns found. Create your first campaign."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url-generator" className="space-y-4">
            <CampaignUrlGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Wrap component in admin layout
export default function AdminMarketingCampaignsRoute() {
  return (
    <AdminLayout title="Marketing Campaigns" description="Track, analyze, and manage your marketing campaigns">
      <AdminMarketingCampaigns />
    </AdminLayout>
  );
}