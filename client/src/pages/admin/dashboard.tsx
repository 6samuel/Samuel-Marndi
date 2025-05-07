import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

import {
  BarChart,
  User,
  FileText,
  Settings,
  Mail,
  Phone,
  Megaphone,
  ChartLine,
  LayoutDashboard,
  Code,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Query for statistics
  const { data: serviceCount } = useQuery({
    queryKey: ["/api/admin/stats/services"],
    queryFn: async () => {
      try {
        return { count: 6 }; // Mock count until API is implemented
      } catch (error) {
        return { count: 0 };
      }
    },
  });

  const { data: portfolioCount } = useQuery({
    queryKey: ["/api/admin/stats/portfolio"],
    queryFn: async () => {
      try {
        return { count: 8 }; // Mock count until API is implemented
      } catch (error) {
        return { count: 0 };
      }
    },
  });

  const { data: blogCount } = useQuery({
    queryKey: ["/api/admin/stats/blog"],
    queryFn: async () => {
      try {
        return { count: 5 }; // Mock count until API is implemented
      } catch (error) {
        return { count: 0 };
      }
    },
  });

  const { data: contactCount } = useQuery({
    queryKey: ["/api/admin/stats/contact"],
    queryFn: async () => {
      try {
        return { count: 12 }; // Mock count until API is implemented
      } catch (error) {
        return { count: 0 };
      }
    },
  });

  const { data: serviceRequestCount } = useQuery({
    queryKey: ["/api/admin/stats/service-requests"],
    queryFn: async () => {
      try {
        return { count: 7 }; // Mock count until API is implemented
      } catch (error) {
        return { count: 0 };
      }
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/admin/login");
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Samuel Marndi</title>
        <meta name="description" content="Admin dashboard for managing the Samuel Marndi website." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || user?.username}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Services
              </CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceCount?.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total services listed
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/admin/services">Manage Services</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioCount?.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total portfolio items
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/admin/portfolio">Manage Portfolio</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Blog Posts
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogCount?.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total published articles
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/admin/blog">Manage Blog</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Form Submissions
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(contactCount?.count || 0) + (serviceRequestCount?.count || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total form submissions
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/admin/forms">Manage Submissions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used tools and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/forms">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Messages
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/services">
                  <Code className="mr-2 h-4 w-4" />
                  Edit Services
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/blog">
                  <FileText className="mr-2 h-4 w-4" />
                  New Blog Post
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/campaigns">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Email Campaign
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/tracking">
                  <ChartLine className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Site Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest website events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <Mail className="h-6 w-6" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New contact submission</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <Phone className="h-6 w-6" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New service request</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <User className="h-6 w-6" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Website login</p>
                  <p className="text-xs text-muted-foreground">Today at 9:32 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}