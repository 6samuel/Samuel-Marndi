import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';
import GoalTrackingDashboard from '@/components/admin/goal-tracking';
import ABTestingDashboard from '@/components/admin/ab-testing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart, Target, Beaker, Settings } from 'lucide-react';
import { Link } from 'wouter';
import AdminLayout from '@/components/layouts/admin-layout';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <AdminLayout title="Marketing Analytics">
      <Helmet>
        <title>Marketing Analytics - Admin Dashboard | Samuel Marndi</title>
        <meta
          name="description"
          content="View and analyze marketing campaign performance, website traffic, and conversion metrics."
        />
      </Helmet>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target size={16} />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="abtesting" className="flex items-center gap-2">
            <Beaker size={16} />
            <span className="hidden sm:inline">A/B Testing</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalTrackingDashboard />
        </TabsContent>

        <TabsContent value="abtesting" className="space-y-6">
          <ABTestingDashboard />
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
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;