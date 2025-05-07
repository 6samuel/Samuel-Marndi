import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/layouts/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  RefreshCw, 
  FileText, 
  Settings, 
  Shield, 
  Globe, 
  Database, 
  BarChart4, 
  Activity 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SEOStatus {
  sitemap: {
    exists: boolean;
    lastModified: string | null;
    size: number | null;
    url: string;
  };
  robots: {
    exists: boolean;
    lastModified: string | null;
    size: number | null;
    url: string;
  };
}

// Define schema for tracking settings
const trackingFormSchema = z.object({
  googleAnalyticsId: z.string().optional()
    .refine(val => !val || /^(G|UA|AW|GTM)-[a-zA-Z0-9\-]+$/.test(val), {
      message: "Invalid Google Analytics ID format. Should start with G-, UA-, AW-, or GTM-"
    }),
  facebookPixelId: z.string().optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: "Invalid Facebook Pixel ID. Should only contain numbers"
    }),
  microsoftAdsId: z.string().optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: "Invalid Microsoft Ads UET Tag ID. Should only contain numbers"
    }),
  linkedInInsightId: z.string().optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: "Invalid LinkedIn Insight Tag ID. Should only contain numbers"
    }),
  googleTagManagerId: z.string().optional()
    .refine(val => !val || /^GTM-[a-zA-Z0-9]+$/.test(val), {
      message: "Invalid Google Tag Manager ID. Should start with GTM-"
    }),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

interface TrackingSettings {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  microsoftAdsId: string | null;
  linkedInInsightId: string | null;
  googleTagManagerId: string | null;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("seo");
  const { toast } = useToast();

  const { 
    data: seoStatus, 
    isLoading: isLoadingSEO,
    refetch: refetchSEO,
    isError: isSEOError 
  } = useQuery<SEOStatus>({
    queryKey: ['/api/seo/status'],
    enabled: activeTab === "seo",
  });

  // Query for tracking settings
  const {
    data: trackingSettings,
    isLoading: isLoadingTracking,
    refetch: refetchTracking,
    isError: isTrackingError
  } = useQuery<TrackingSettings>({
    queryKey: ['/api/settings/tracking'],
    enabled: activeTab === "tracking",
  });

  // Form for tracking settings
  const trackingForm = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      googleAnalyticsId: "",
      facebookPixelId: "",
      microsoftAdsId: "",
      linkedInInsightId: "",
      googleTagManagerId: "",
    },
  });

  // Update form values when tracking settings are loaded
  React.useEffect(() => {
    if (trackingSettings) {
      trackingForm.reset({
        googleAnalyticsId: trackingSettings.googleAnalyticsId || "",
        facebookPixelId: trackingSettings.facebookPixelId || "",
        microsoftAdsId: trackingSettings.microsoftAdsId || "",
        linkedInInsightId: trackingSettings.linkedInInsightId || "",
        googleTagManagerId: trackingSettings.googleTagManagerId || "",
      });
    }
  }, [trackingSettings, trackingForm]);

  // Mutation for updating tracking settings
  const updateTrackingSettingsMutation = useMutation({
    mutationFn: async (values: TrackingFormValues) => {
      const res = await apiRequest("POST", "/api/settings/tracking", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tracking settings updated successfully",
        variant: "default",
      });
      refetchTracking();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update tracking settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitTrackingForm = (data: TrackingFormValues) => {
    updateTrackingSettingsMutation.mutate(data);
  };

  const generateSitemapMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sitemap/generate");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sitemap generated successfully",
        variant: "default",
      });
      refetchSEO();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate sitemap",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Settings | Samuel Marndi</title>
      </Helmet>

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage SEO, security, and other site settings
            </p>
          </div>
        </div>

        <Tabs 
          defaultValue="seo" 
          className="space-y-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              Tracking & Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Manage SEO assets including sitemap and robots.txt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSEOError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to fetch SEO status. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {isLoadingSEO ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Sitemap
                            {seoStatus?.sitemap.exists && (
                              <Badge variant="outline" className="ml-2">
                                Active
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            XML sitemap for search engines
                          </p>
                        </div>
                        <Button
                          onClick={() => generateSitemapMutation.mutate()}
                          disabled={generateSitemapMutation.isPending}
                        >
                          {generateSitemapMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Regenerating...
                            </>
                          ) : (
                            <>Regenerate Sitemap</>
                          )}
                        </Button>
                      </div>

                      {seoStatus?.sitemap.exists ? (
                        <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                          <div>
                            <p className="text-sm font-medium">Last Generated</p>
                            <p className="text-sm">
                              {seoStatus.sitemap.lastModified 
                                ? format(new Date(seoStatus.sitemap.lastModified), "PPp")
                                : "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Size</p>
                            <p className="text-sm">
                              {seoStatus.sitemap.size 
                                ? `${Math.round(seoStatus.sitemap.size / 1024)} KB`
                                : "Unknown"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm font-medium">URL</p>
                            <a 
                              href={seoStatus.sitemap.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {window.location.origin}{seoStatus.sitemap.url}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <Alert>
                          <AlertTitle>No sitemap found</AlertTitle>
                          <AlertDescription>
                            You need to generate a sitemap for better SEO performance.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Robots.txt
                            {seoStatus?.robots.exists && (
                              <Badge variant="outline" className="ml-2">
                                Active
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Instructions for search engine crawlers
                          </p>
                        </div>
                      </div>

                      {seoStatus?.robots.exists ? (
                        <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                          <div>
                            <p className="text-sm font-medium">Last Modified</p>
                            <p className="text-sm">
                              {seoStatus.robots.lastModified 
                                ? format(new Date(seoStatus.robots.lastModified), "PPp")
                                : "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Size</p>
                            <p className="text-sm">
                              {seoStatus.robots.size 
                                ? `${seoStatus.robots.size} bytes`
                                : "Unknown"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm font-medium">URL</p>
                            <a 
                              href={seoStatus.robots.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {window.location.origin}{seoStatus.robots.url}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <Alert>
                          <AlertTitle>No robots.txt found</AlertTitle>
                          <AlertDescription>
                            You need to generate a robots.txt file for search engine crawlers.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  SEO assets are automatically regenerated when content changes.
                </p>
                <Button variant="outline" onClick={() => refetchSEO()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tracking & Analytics Settings</CardTitle>
                <CardDescription>
                  Configure tracking scripts and conversion tracking for marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isTrackingError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to fetch tracking settings. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {isLoadingTracking ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Form {...trackingForm}>
                    <form onSubmit={trackingForm.handleSubmit(onSubmitTrackingForm)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Activity className="h-5 w-5" /> Analytics Configurations
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={trackingForm.control}
                            name="googleAnalyticsId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Analytics ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="G-XXXXXXXXXX" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Google Analytics 4 Measurement ID (starts with G-)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={trackingForm.control}
                            name="googleTagManagerId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Tag Manager ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="GTM-XXXXXXX" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Google Tag Manager container ID (starts with GTM-)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <BarChart4 className="h-5 w-5" /> Marketing & Conversion Tracking
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={trackingForm.control}
                            name="facebookPixelId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook Pixel ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="123456789012345" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Used for tracking Facebook and Instagram ad conversions
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={trackingForm.control}
                            name="microsoftAdsId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Microsoft Ads UET Tag ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormDescription>
                                  UET Tag ID for Bing Ads (Microsoft Advertising)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={trackingForm.control}
                            name="linkedInInsightId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn Insight Tag ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Used for LinkedIn advertising conversion tracking
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => refetchTracking()}
                        >
                          Reset
                        </Button>
                        <Button 
                          type="submit"
                          disabled={updateTrackingSettingsMutation.isPending || !trackingForm.formState.isDirty}
                        >
                          {updateTrackingSettingsMutation.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Settings"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  These tracking IDs are used across the website for analytics and conversion tracking.
                </p>
                <Button variant="outline" onClick={() => refetchTracking()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage security settings and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    Security settings will be available in a future update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>
                  Manage database connections and backup options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    Database settings will be available in a future update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage general site settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    General settings will be available in a future update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}