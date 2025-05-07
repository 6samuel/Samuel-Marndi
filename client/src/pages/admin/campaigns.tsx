import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";
import { Mail, MessageSquare } from "lucide-react";

export default function AdminCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("email");

  return (
    <>
      <Helmet>
        <title>Email & SMS Campaigns - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Email & SMS Campaigns">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Email & SMS Campaigns</h2>
          
          <Tabs defaultValue="email" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Email Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>SMS Campaigns</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="pt-4">
              <div className="border rounded-lg p-6">
                <p className="text-center text-muted-foreground">
                  Email campaign management feature is currently in development.
                  <br />
                  You will be able to send bulk emails and create scheduled campaigns from here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sms" className="pt-4">
              <div className="border rounded-lg p-6">
                <p className="text-center text-muted-foreground">
                  SMS campaign management feature is currently in development.
                  <br />
                  You will be able to send bulk SMS and create scheduled campaigns from here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}