import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminTracking() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("google");

  return (
    <>
      <Helmet>
        <title>Ad Tracking - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Ad Tracking">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Ad Tracking</h2>
          
          <Tabs defaultValue="google" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="pt-4">
              <div className="border rounded-lg p-6">
                <p className="text-center text-muted-foreground">
                  Google Ads tracking integration is currently in development.
                  <br />
                  You will be able to view conversion tracking data and set up tag parameters here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="facebook" className="pt-4">
              <div className="border rounded-lg p-6">
                <p className="text-center text-muted-foreground">
                  Facebook Ads tracking integration is currently in development.
                  <br />
                  You will be able to view conversion tracking data and set up pixel parameters here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="microsoft" className="pt-4">
              <div className="border rounded-lg p-6">
                <p className="text-center text-muted-foreground">
                  Microsoft Ads tracking integration is currently in development.
                  <br />
                  You will be able to view conversion tracking data and set up UET tag parameters here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}