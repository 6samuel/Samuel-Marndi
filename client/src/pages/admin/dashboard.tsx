import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, FileText, Users, Mail, BriefcaseBusiness } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Dashboard metrics
  const [contactSubmissions, setContactSubmissions] = useState<number>(0);
  const [serviceRequests, setServiceRequests] = useState<number>(0);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const userData = await response.json();
        setUser(userData);
        
        // Fetch dashboard data here
        fetchDashboardData();
      } catch (error) {
        console.error("Auth check failed:", error);
        setLocation("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [setLocation]);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch contact submissions count
      const contactRes = await fetch("/api/contact-submissions");
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContactSubmissions(contactData.length);
      }
      
      // Fetch service requests count
      const serviceRes = await fetch("/api/service-requests");
      if (serviceRes.ok) {
        const serviceData = await serviceRes.json();
        setServiceRequests(serviceData.length);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        toast({
          title: "Logged out successfully",
        });
        setLocation("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Samuel Marndi</title>
        <meta name="description" content="Admin dashboard for Samuel Marndi's website." />
      </Helmet>
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Logged in as: <span className="font-semibold">{user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Contact Submissions</CardDescription>
              <CardTitle className="text-3xl">{contactSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Total number of contact form submissions
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Service Requests</CardDescription>
              <CardTitle className="text-3xl">{serviceRequests}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Total number of service requests
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="submissions">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">
              <Mail className="h-4 w-4 mr-2" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="business">
              <BriefcaseBusiness className="h-4 w-4 mr-2" />
              Business
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  View and manage your website form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will display all contact form submissions, service requests,
                  partner applications, and hire requests.
                </p>
                {/* Submission list would go here */}
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Additional API endpoints will be needed to fetch and display submissions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>
                  Manage services, portfolio items, and blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will allow you to create, edit, and delete content from your website.
                </p>
                {/* Content management would go here */}
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Content management features will be implemented in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage admin users who can access this dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will allow you to create and manage admin users.
                </p>
                {/* User management would go here */}
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    User management features will be implemented in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  View business metrics and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This section will display business metrics, analytics, and reports.
                </p>
                {/* Analytics would go here */}
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Analytics features will be implemented in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}