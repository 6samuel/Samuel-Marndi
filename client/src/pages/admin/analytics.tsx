import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Marketing Analytics - Admin Dashboard | Samuel Marndi</title>
        <meta
          name="description"
          content="View and analyze marketing campaign performance, website traffic, and conversion metrics."
        />
      </Helmet>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Admin</span>
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-card rounded-md shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics Settings</h2>
              <p className="text-muted-foreground mb-6">
                Configure analytics settings and tracking parameters in the Tracking Settings section.
                You can access tracking settings from the Admin Dashboard under the "Tracking" tab.
              </p>
              <Link href="/admin/tracking">
                <Button>
                  Go to Tracking Settings
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default AdminAnalyticsPage;