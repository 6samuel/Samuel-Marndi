import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TrackingConfig {
  googleAnalyticsId: string;
  googleAdsId: string;
  facebookPixelId: string;
  microsoftAdsId: string;
}

const AdTrackingSettings: React.FC = () => {
  const { toast } = useToast();
  const [trackingConfig, setTrackingConfig] = useState<TrackingConfig>({
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
    googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID || '',
    facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID || '',
    microsoftAdsId: import.meta.env.VITE_MICROSOFT_ADS_ID || '',
  });
  
  const updateTrackingConfigMutation = useMutation({
    mutationFn: async (config: TrackingConfig) => {
      const res = await apiRequest('POST', '/api/admin/tracking-config', config);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Settings updated',
        description: 'Ad tracking settings have been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrackingConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrackingConfigMutation.mutate(trackingConfig);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Tracking Configuration</CardTitle>
        <CardDescription>
          Configure your advertising platform tracking IDs for conversion tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID (GA4)</Label>
              <Input
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                placeholder="G-XXXXXXXXXX"
                value={trackingConfig.googleAnalyticsId}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Your Google Analytics 4 measurement ID (starts with G-)
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="googleAdsId">Google Ads ID</Label>
              <Input
                id="googleAdsId"
                name="googleAdsId"
                placeholder="AW-XXXXXXXXXX"
                value={trackingConfig.googleAdsId}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Your Google Ads conversion tracking ID (starts with AW-)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="facebook" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input
                id="facebookPixelId"
                name="facebookPixelId"
                placeholder="XXXXXXXXXX"
                value={trackingConfig.facebookPixelId}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Your Facebook Pixel ID for conversion tracking
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="microsoft" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="microsoftAdsId">Microsoft Ads UET Tag ID</Label>
              <Input
                id="microsoftAdsId"
                name="microsoftAdsId"
                placeholder="XXXXXXXXXX"
                value={trackingConfig.microsoftAdsId}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Your Microsoft Advertising UET tag ID for conversion tracking
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={updateTrackingConfigMutation.isPending}
        >
          {updateTrackingConfigMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdTrackingSettings;