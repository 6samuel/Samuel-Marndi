import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { generateTrackingUrl } from '@/lib/campaign-tracking';
import { TrackConversion } from '@/components/tracking/campaign-tracker';

/**
 * Campaign URL Generator component for marketing
 * Allows creation of tracking URLs for various campaigns
 */
export default function CampaignUrlGenerator() {
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const [source, setSource] = useState('google');
  const [medium, setMedium] = useState('cpc');
  const [campaign, setCampaign] = useState('leads_2025');
  const [content, setContent] = useState('');
  const [term, setTerm] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate the tracking URL whenever inputs change
  useEffect(() => {
    const url = generateTrackingUrl(baseUrl, {
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
      ...(content && { utm_content: content }),
      ...(term && { utm_term: term })
    });
    setTrackingUrl(url);
  }, [baseUrl, source, medium, campaign, content, term]);

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Campaign URL Generator</CardTitle>
        <CardDescription>
          Create tracking URLs for your marketing campaigns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base-url">Base URL</Label>
          <Input 
            id="base-url" 
            value={baseUrl} 
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://samuelmarndi.com"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="utm-source">Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="utm-source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="utm-medium">Medium</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger id="utm-medium">
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpc">CPC (Paid Search)</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="utm-campaign">Campaign Name</Label>
          <Input 
            id="utm-campaign" 
            value={campaign} 
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="summer_sale_2025"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="utm-content">Content (Optional)</Label>
            <Input 
              id="utm-content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="blue_banner"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="utm-term">Term/Keyword (Optional)</Label>
            <Input 
              id="utm-term" 
              value={term} 
              onChange={(e) => setTerm(e.target.value)}
              placeholder="web_development"
            />
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <Label className="text-sm">Generated Tracking URL:</Label>
          <div className="mt-1 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 break-all">
            {trackingUrl}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <TrackConversion trackerId={1} conversionType="url_created">
          <Button className="w-full" onClick={copyToClipboard}>
            {copied ? (
              <>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </TrackConversion>
      </CardFooter>
    </Card>
  );
}