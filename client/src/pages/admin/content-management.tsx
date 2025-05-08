import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ServiceManager from "@/components/admin/service-manager";
import PortfolioManager from "@/components/admin/portfolio-manager";
import BlogManager from "@/components/admin/blog-manager";
import MediaLibrary from "@/components/admin/media-library";

export default function ContentManagementPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    toast({
      title: "Access Denied",
      description: "You must be an administrator to access this page.",
      variant: "destructive",
    });
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your website content including services, portfolio, blog, and media assets
          </p>
        </div>
      </div>

      <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="services" className="space-y-4">
            <ServiceManager />
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioManager />
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4">
            <BlogManager />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <MediaLibrary />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}