import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Loader2, RefreshCw } from "lucide-react";

// Schema for URL generator form
const urlGeneratorSchema = z.object({
  baseUrl: z.string().url("Please enter a valid URL"),
  utmSource: z.string().min(1, "Source is required"),
  utmMedium: z.string().min(1, "Medium is required"),
  utmCampaign: z.string().min(1, "Campaign name is required"),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  platform: z.string().min(1, "Platform is required"),
  notes: z.string().optional(),
});

type UrlGeneratorFormValues = z.infer<typeof urlGeneratorSchema>;

export default function CampaignUrlGenerator() {
  const { toast } = useToast();
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [isPlatformMismatch, setIsPlatformMismatch] = useState(false);
  
  // Form setup with validation
  const form = useForm<UrlGeneratorFormValues>({
    resolver: zodResolver(urlGeneratorSchema),
    defaultValues: {
      baseUrl: "https://samuelmarndi.com",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      platform: "",
      notes: "",
    },
  });

  // Platform options (should match database platform options)
  const platformOptions = [
    { value: "google", label: "Google Ads" },
    { value: "facebook", label: "Facebook Ads" },
    { value: "instagram", label: "Instagram Ads" },
    { value: "linkedin", label: "LinkedIn Ads" },
    { value: "twitter", label: "Twitter Ads" },
    { value: "youtube", label: "YouTube Ads" },
    { value: "tiktok", label: "TikTok Ads" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "direct", label: "Direct" },
    { value: "organic", label: "Organic" },
    { value: "referral", label: "Referral" },
    { value: "other", label: "Other" },
  ];

  // Watch for platform/source mismatch
  const utmSource = form.watch("utmSource");
  const platform = form.watch("platform");

  React.useEffect(() => {
    if (platform && utmSource && platform !== utmSource && 
        !["direct", "organic", "referral", "other"].includes(platform)) {
      setIsPlatformMismatch(true);
    } else {
      setIsPlatformMismatch(false);
    }
  }, [platform, utmSource]);

  // Generate URL mutation
  const generateUrlMutation = useMutation({
    mutationFn: async (data: UrlGeneratorFormValues) => {
      const response = await apiRequest("POST", "/api/generate-tracking-url", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate tracking URL");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedUrl(data.trackingUrl);
      toast({
        title: "URL Generated Successfully",
        description: "Your tracking URL has been created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: UrlGeneratorFormValues) => {
    generateUrlMutation.mutate(data);
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast({
      title: "Copied to clipboard",
      description: "The tracking URL has been copied to your clipboard.",
    });
  };

  // Reset the form
  const resetForm = () => {
    form.reset({
      baseUrl: "https://samuelmarndi.com",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      platform: "",
      notes: "",
    });
    setGeneratedUrl("");
  };

  const generateUrlPreview = () => {
    const values = form.getValues();
    let url = new URL(values.baseUrl);
    
    if (values.utmSource) url.searchParams.append("utm_source", values.utmSource);
    if (values.utmMedium) url.searchParams.append("utm_medium", values.utmMedium);
    if (values.utmCampaign) url.searchParams.append("utm_campaign", values.utmCampaign);
    if (values.utmTerm) url.searchParams.append("utm_term", values.utmTerm);
    if (values.utmContent) url.searchParams.append("utm_content", values.utmContent);
    
    return url.toString();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="generator">
        <TabsList>
          <TabsTrigger value="generator">URL Generator</TabsTrigger>
          <TabsTrigger value="about">About UTM Parameters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Tracking URL</CardTitle>
                  <CardDescription>
                    Create a tracking URL with UTM parameters for your marketing campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://samuelmarndi.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="platform"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Platform</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {platformOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="utmSource"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Source 
                                {isPlatformMismatch && (
                                  <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                                    (Should match platform)
                                  </span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="google, facebook, etc." 
                                  {...field} 
                                  className={isPlatformMismatch ? "border-yellow-500" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="utmMedium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medium</FormLabel>
                              <FormControl>
                                <Input placeholder="cpc, banner, email, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="utmCampaign"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Name</FormLabel>
                              <FormControl>
                                <Input placeholder="summer_sale, product_launch, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="utmTerm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Term (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Keywords for paid search" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="utmContent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="banner_blue, text_link, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Internal notes about this campaign url" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={generateUrlMutation.isPending}
                        >
                          {generateUrlMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Generate URL
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetForm}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>URL Preview</CardTitle>
                  <CardDescription>
                    See how your tracking URL will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-3 rounded-md break-all text-sm font-mono">
                    {form.formState.isValid ? generateUrlPreview() : "Complete the required fields to see URL preview"}
                  </div>
                </CardContent>
              </Card>
              
              {generatedUrl && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Generated Tracking URL</CardTitle>
                    <CardDescription>
                      Your tracking URL is ready to use
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-3 rounded-md break-all text-sm font-mono">
                      {generatedUrl}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="w-full"
                      onClick={copyToClipboard}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About UTM Parameters</CardTitle>
              <CardDescription>
                Understanding UTM parameters and how to use them for tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">What are UTM parameters?</h3>
                <p className="text-muted-foreground">
                  UTM parameters are tags added to a URL that help identify the source of website traffic. 
                  They are essential for tracking the effectiveness of online marketing campaigns.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">UTM Parameter Types</h3>
                
                <div>
                  <h4 className="font-medium">utm_source</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies which site sent the traffic (e.g., google, facebook, newsletter)
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">utm_medium</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies what type of link was used (e.g., cpc, banner, email)
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">utm_campaign</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies a specific product promotion or strategic campaign
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">utm_term</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies search terms (mainly used for paid search)
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">utm_content</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifies what specifically was clicked (useful for A/B testing)
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Best Practices</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Be consistent with naming conventions</li>
                  <li>Use lowercase for all parameter values</li>
                  <li>Use underscores (_) or hyphens (-) instead of spaces</li>
                  <li>Keep values short but descriptive</li>
                  <li>Match utm_source to the platform parameter for accurate tracking</li>
                  <li>Document your UTM naming conventions for team consistency</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}