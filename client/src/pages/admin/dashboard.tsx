import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BarChart3, MessageSquare, Calendar, FileText, ArrowUpRight, Activity, ShoppingBag, Users } from "lucide-react";

// Layout and UI components
import AdminLayout from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch contact submissions
  const { data: contactSubmissions = [] } = useQuery({
    queryKey: ["/api/contact-submissions"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch service requests
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ["/api/service-requests"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Get unread/pending items
  const unreadContactSubmissions = Array.isArray(contactSubmissions) 
    ? contactSubmissions.filter(sub => sub.status === 'unread').length 
    : 0;
    
  const pendingServiceRequests = Array.isArray(serviceRequests) 
    ? serviceRequests.filter(req => req.status === 'pending').length 
    : 0;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Samuel Marndi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout title="Dashboard">
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || user?.username}!</h2>
              <p className="text-muted-foreground">
                Here's what's happening with your website today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/admin/forms" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View all forms
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="forms">Form Submissions</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Contact Submissions
                    </CardTitle>
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{unreadContactSubmissions}</div>
                    <p className="text-xs text-muted-foreground">
                      Unread messages
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href="/admin/forms">
                        <span>View all</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Service Requests
                    </CardTitle>
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingServiceRequests}</div>
                    <p className="text-xs text-muted-foreground">
                      Pending requests
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href="/admin/forms?tab=service-requests">
                        <span>View all</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Website Visitors
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+24%</div>
                    <p className="text-xs text-muted-foreground">
                      From last week
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href="/admin/tracking">
                        <span>View analytics</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Conversion Rate
                    </CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.4% from last month
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild className="w-full">
                      <Link href="/admin/tracking">
                        <span>View details</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Website Analytics</CardTitle>
                    <CardDescription>
                      Your website performance over the last 30 days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <BarChart3 className="w-10 h-10 text-muted-foreground" />
                        <h3 className="font-medium">Analytics Dashboard</h3>
                        <p className="text-sm text-muted-foreground px-6">
                          Configure your Google Analytics to see traffic data here
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/tracking">Setup Analytics</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <CardDescription>
                      Tasks and reminders for this week.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Respond to service requests</p>
                          <p className="text-sm text-muted-foreground truncate">
                            You have {pendingServiceRequests} pending service requests
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Reply to contact forms</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {unreadContactSubmissions} unread messages to check
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">View All Tasks</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>
                    View detailed website traffic, conversion rates, and ad performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <BarChart3 className="w-10 h-10 text-muted-foreground" />
                    <h3 className="font-medium">Traffic Analytics</h3>
                    <p className="text-sm text-muted-foreground px-6">
                      Set up traffic tracking to visualize website performance
                    </p>
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <Link href="/admin/tracking">Configure Analytics</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Form Submissions</CardTitle>
                  <CardDescription>
                    View and manage contact forms and service requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                  <div className="space-y-4">
                    {/* Contact Forms Section */}
                    <div>
                      <h3 className="font-medium mb-2">Recent Contact Submissions</h3>
                      {Array.isArray(contactSubmissions) && contactSubmissions.length > 0 ? (
                        <div className="space-y-2">
                          {contactSubmissions.slice(0, 3).map((submission, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between">
                                <p className="font-medium">{submission.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  submission.status === 'unread' 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {submission.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{submission.email}</p>
                              <p className="text-sm mt-1 line-clamp-1">{submission.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No contact submissions yet</p>
                      )}
                    </div>

                    {/* Service Requests Section */}
                    <div>
                      <h3 className="font-medium mb-2">Recent Service Requests</h3>
                      {Array.isArray(serviceRequests) && serviceRequests.length > 0 ? (
                        <div className="space-y-2">
                          {serviceRequests.slice(0, 3).map((request, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between">
                                <p className="font-medium">{request.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  request.status === 'pending' 
                                    ? 'bg-yellow-500/10 text-yellow-500' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              <p className="text-sm mt-1 line-clamp-1">{request.projectDescription}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No service requests yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/admin/forms">Manage All Submissions</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>
                    Create and manage email campaigns and newsletters
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground" />
                    <h3 className="font-medium">Email Campaigns</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Configure your email provider settings to start sending campaigns to leads and clients
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/campaigns">Setup Email</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/admin/campaigns/new">Create Campaign</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}