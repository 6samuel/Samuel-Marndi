import { ProtectedRoute } from "@/lib/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/layouts/admin-layout";
import CampaignUrlGenerator from "@/components/marketing/campaign-url-generator";
import CampaignDashboard from "@/components/marketing/campaign-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Share2 } from "lucide-react";
import { Link } from "wouter";

function AdminMarketingCampaigns() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Marketing Campaigns | Admin Dashboard</title>
        <meta name="description" content="Manage and track marketing campaigns, UTM parameters, and conversion tracking" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Marketing Campaigns</h1>
              <p className="text-muted-foreground">
                Create, manage, and analyze your marketing campaigns and tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/ad-trackers">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Ad Trackers
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="url-generator">URL Generator</TabsTrigger>
              <TabsTrigger value="guide">Implementation Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <CampaignDashboard trackerId={1} />
            </TabsContent>
            
            <TabsContent value="url-generator" className="space-y-4">
              <CampaignUrlGenerator />
            </TabsContent>
            
            <TabsContent value="guide" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Tracking Implementation Guide</CardTitle>
                  <CardDescription>
                    Learn how to implement campaign tracking in your marketing efforts
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">What is Campaign Tracking?</h3>
                    <p className="text-muted-foreground">
                      Campaign tracking allows you to measure the effectiveness of your marketing campaigns
                      by tracking visitors from different sources and monitoring their conversions on your
                      website.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Implementation Steps</h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>
                        <strong>Generate tracking URLs</strong> - Use the URL Generator tab to create URLs with 
                        UTM parameters for each marketing channel (Google Ads, Facebook, Email, etc.)
                      </li>
                      <li>
                        <strong>Use these URLs in your campaigns</strong> - Replace your regular website URLs 
                        with these tracking URLs in your ads, social media posts, emails, etc.
                      </li>
                      <li>
                        <strong>Track visitor actions</strong> - When visitors come to your website through these 
                        URLs, their source information will be automatically tracked.
                      </li>
                      <li>
                        <strong>Record conversions</strong> - Implement conversion tracking in your thank-you pages, 
                        checkout confirmation, or after form submissions.
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">UTM Parameters Explained</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_source</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies which site sent the traffic (e.g., google, facebook, newsletter)
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_medium</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies what type of link was used (e.g., cpc, email, social)
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_campaign</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies a specific campaign (e.g., summer_sale, product_launch)
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_content</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies what specifically was clicked (e.g., banner_ad, text_link)
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_term</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies search terms (e.g., marketing+digital, web+development)
                        </p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium mb-1">utm_session</h4>
                        <p className="text-sm text-muted-foreground">
                          Unique identifier for tracking user sessions (automatically generated)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Code Snippet for Tracking Conversions</h3>
                    <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                      <code>
{`// Add this code to your thank-you pages or conversion confirmation
import { recordConversion } from '@/lib/campaign-tracking';

// Example usage in a form submission handler
const handleSubmit = async (formData) => {
  // Process the form submission
  const result = await submitForm(formData);
  
  if (result.success) {
    // Record the conversion
    await recordConversion(1, 'lead');
    
    // Show success message
    showSuccessMessage();
  }
};`}
                      </code>
                    </pre>
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

export default function AdminMarketingCampaignsRoute() {
  return (
    <ProtectedRoute
      path="/admin/marketing-campaigns"
      component={AdminMarketingCampaigns}
      adminOnly={true}
    />
  );
}