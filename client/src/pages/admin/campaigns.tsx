import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/layouts/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Mail, MessageSquare, Send, FileUp, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the Recipient type
interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  added: Date;
  source: string;
  tags: string[] | null;
  unsubscribed: boolean;
}

// Define the Campaign type
interface Campaign {
  id: number;
  name: string;
  type: 'email' | 'sms';
  subject?: string | null;
  content: string;
  sentAt: Date | null;
  status: 'draft' | 'sent' | 'scheduled';
  recipientCount: number;
  openRate?: number | null;
  clickRate?: number | null;
  scheduledFor?: Date | null;
}

export default function AdminCampaigns() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("email");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [recipientSource, setRecipientSource] = useState<string>("all");
  
  // Form states for creating/editing campaigns
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "email",
    subject: "",
    content: "",
    recipientSource: "all",
    recipientTag: "",
    scheduledFor: "",
  });
  
  // Form states for uploading recipients
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    uploading: false
  });
  
  // CSV example strings
  const emailCsvExample = "name,email,tags\nJohn Doe,john@example.com,client,lead\nJane Smith,jane@example.com,prospect";
  const smsCsvExample = "name,phone,tags\nJohn Doe,+1234567890,client,lead\nJane Smith,+0987654321,prospect";
  
  // Fetch campaigns
  const { 
    data: campaigns = [], 
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns
  } = useQuery<Campaign[]>({
    queryKey: [`/api/campaigns/${activeTab}`],
    queryFn: getQueryFn(),
    enabled: !!user, // Only run query if user is logged in
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Fetch recipients
  const { 
    data: recipients = [], 
    isLoading: isLoadingRecipients,
    refetch: refetchRecipients
  } = useQuery<Recipient[]>({
    queryKey: ["/api/recipients"],
    queryFn: getQueryFn(),
    enabled: !!user, // Only run query if user is logged in
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // List of unique tags from all recipients
  const allTags = [...new Set(recipients.flatMap(r => r.tags || []))];
  
  // Filtered recipients based on selected source
  const filteredRecipients = recipients.filter(recipient => {
    if (recipientSource === "all") return true;
    if (recipientSource === "unsubscribed") return recipient.unsubscribed;
    if (recipientSource === "subscribed") return !recipient.unsubscribed;
    // Filter by specific tag
    return recipient.tags?.includes(recipientSource) || false;
  });
  
  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (formData: typeof campaignForm) => {
      const res = await apiRequest('POST', '/api/campaigns', formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
      });
      
      // Reset form
      setCampaignForm({
        name: "",
        type: "email",
        subject: "",
        content: "",
        recipientSource: "all",
        recipientTag: "",
        scheduledFor: "",
      });
      
      // Close dialog
      setIsCreateDialogOpen(false);
      
      // Refresh campaigns
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${activeTab}`] });
    },
    onError: (error) => {
      toast({
        title: "Error creating campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const res = await apiRequest('POST', `/api/campaigns/${campaignId}/send`);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign sent",
        description: `Your campaign has been sent to ${data.recipientCount} recipients.`,
      });
      
      // Refresh campaigns
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${activeTab}`] });
    },
    onError: (error) => {
      toast({
        title: "Error sending campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      await apiRequest('DELETE', `/api/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully.",
      });
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      
      // Refresh campaigns
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${activeTab}`] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Upload recipients mutation
  const uploadRecipientsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest('POST', '/api/recipients/upload', undefined, formData);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Recipients uploaded",
        description: `${data.count} recipients have been uploaded successfully.`,
      });
      
      // Reset form
      setUploadForm({
        file: null,
        uploading: false
      });
      
      // Refresh recipients
      queryClient.invalidateQueries({ queryKey: ["/api/recipients"] });
    },
    onError: (error) => {
      toast({
        title: "Error uploading recipients",
        description: error.message,
        variant: "destructive",
      });
      
      setUploadForm(prev => ({
        ...prev,
        uploading: false
      }));
    }
  });
  
  // Handle campaign form input changes
  const handleCampaignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCampaignForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle campaign form select changes
  const handleSelectChange = (name: string, value: string) => {
    setCampaignForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({ ...prev, file }));
  };
  
  // Handle upload submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('type', activeTab);
    
    setUploadForm(prev => ({ ...prev, uploading: true }));
    uploadRecipientsMutation.mutate(formData);
  };
  
  // Handle campaign creation submit
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!campaignForm.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your campaign.",
        variant: "destructive",
      });
      return;
    }
    
    if (campaignForm.type === "email" && !campaignForm.subject) {
      toast({
        title: "Missing information",
        description: "Please provide a subject for your email campaign.",
        variant: "destructive",
      });
      return;
    }
    
    if (!campaignForm.content) {
      toast({
        title: "Missing information",
        description: "Please provide content for your campaign.",
        variant: "destructive",
      });
      return;
    }
    
    createCampaignMutation.mutate(campaignForm);
  };
  
  // Display recipients source count
  const getRecipientCount = (source: string) => {
    if (source === "all") return recipients.length;
    if (source === "unsubscribed") return recipients.filter(r => r.unsubscribed).length;
    if (source === "subscribed") return recipients.filter(r => !r.unsubscribed).length;
    // Count by tag
    return recipients.filter(r => r.tags?.includes(source)).length;
  };
  
  return (
    <>
      <Helmet>
        <title>Marketing Campaigns - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Marketing Campaigns">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Create a new email or SMS campaign to send to your recipients.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={campaignForm.name}
                      onChange={handleCampaignInputChange}
                      placeholder="Spring Promotion 2025"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Campaign Type</Label>
                    <Select 
                      name="type" 
                      value={campaignForm.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Campaign</SelectItem>
                        <SelectItem value="sms">SMS Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {campaignForm.type === "email" && (
                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={campaignForm.subject}
                        onChange={handleCampaignInputChange}
                        placeholder="Special Offer Inside! 25% Off Web Development Services"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      {campaignForm.type === "email" ? "Email Content" : "SMS Message"}
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={campaignForm.content}
                      onChange={handleCampaignInputChange}
                      rows={6}
                      placeholder={campaignForm.type === "email" 
                        ? "Use {{name}} to personalize your message with the recipient's name."
                        : "Hi {{name}}, thank you for your interest in our services! We are offering a 25% discount until the end of the month."
                      }
                    />
                    {campaignForm.type === "email" && (
                      <p className="text-xs text-muted-foreground">
                        For emails, you can use HTML formatting tags.
                      </p>
                    )}
                    {campaignForm.type === "sms" && (
                      <p className="text-xs text-muted-foreground">
                        SMS messages are limited to 160 characters. Current count: {campaignForm.content.length}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientSource">Recipients</Label>
                    <Select 
                      name="recipientSource" 
                      value={campaignForm.recipientSource}
                      onValueChange={(value) => handleSelectChange("recipientSource", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Recipients ({getRecipientCount("all")})</SelectItem>
                        <SelectItem value="subscribed">Subscribed Recipients ({getRecipientCount("subscribed")})</SelectItem>
                        {allTags.map(tag => (
                          <SelectItem key={tag} value={tag}>
                            Tag: {tag} ({getRecipientCount(tag)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule Send (Optional)</Label>
                    <Input 
                      id="scheduledFor" 
                      name="scheduledFor" 
                      type="datetime-local"
                      value={campaignForm.scheduledFor}
                      onChange={handleCampaignInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to save as draft without scheduling.
                    </p>
                  </div>
                </form>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCampaignSubmit}
                    disabled={createCampaignMutation.isPending}
                  >
                    {createCampaignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Campaign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="email" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email Campaigns
              </TabsTrigger>
              <TabsTrigger value="sms">
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS Campaigns
              </TabsTrigger>
              <TabsTrigger value="recipients">
                Recipients
              </TabsTrigger>
            </TabsList>
            
            {/* Email Campaigns Tab */}
            <TabsContent value="email" className="pt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoadingCampaigns ? (
                  <div className="col-span-full flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : campaigns.length > 0 ? (
                  campaigns.map(campaign => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.status === 'draft' && 'Draft'}
                          {campaign.status === 'scheduled' && `Scheduled for ${format(new Date(campaign.scheduledFor!), 'MMM d, yyyy h:mm a')}`}
                          {campaign.status === 'sent' && `Sent on ${format(new Date(campaign.sentAt!), 'MMM d, yyyy')}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <span className="font-semibold">Subject:</span> {campaign.subject}
                        </div>
                        <div className="text-sm line-clamp-3 text-muted-foreground">
                          {campaign.content.substring(0, 100)}
                          {campaign.content.length > 100 && '...'}
                        </div>
                        
                        {campaign.status === 'sent' && (
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="rounded bg-muted p-2 text-center">
                              <div className="text-sm font-medium">Recipients</div>
                              <div className="text-lg font-semibold">{campaign.recipientCount}</div>
                            </div>
                            <div className="rounded bg-muted p-2 text-center">
                              <div className="text-sm font-medium">Open Rate</div>
                              <div className="text-lg font-semibold">
                                {campaign.openRate ? `${(campaign.openRate * 100).toFixed(1)}%` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/50 flex justify-between pt-3">
                        {campaign.status === 'draft' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <div className="space-x-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => sendCampaignMutation.mutate(campaign.id)}
                                disabled={sendCampaignMutation.isPending}
                              >
                                {sendCampaignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="h-4 w-4 mr-1" />
                                Send
                              </Button>
                            </div>
                          </>
                        )}
                        
                        {campaign.status === 'scheduled' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Cancel scheduled campaign
                              }}
                            >
                              Cancel Schedule
                            </Button>
                          </>
                        )}
                        
                        {campaign.status === 'sent' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Clone campaign
                              }}
                            >
                              Clone
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium mb-2">No Email Campaigns Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first email campaign to engage with your audience.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Email Campaign
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* SMS Campaigns Tab */}
            <TabsContent value="sms" className="pt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoadingCampaigns ? (
                  <div className="col-span-full flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : campaigns.length > 0 ? (
                  campaigns.map(campaign => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.status === 'draft' && 'Draft'}
                          {campaign.status === 'scheduled' && `Scheduled for ${format(new Date(campaign.scheduledFor!), 'MMM d, yyyy h:mm a')}`}
                          {campaign.status === 'sent' && `Sent on ${format(new Date(campaign.sentAt!), 'MMM d, yyyy')}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm line-clamp-3 text-muted-foreground">
                          {campaign.content}
                        </div>
                        
                        {campaign.status === 'sent' && (
                          <div className="rounded bg-muted p-2 text-center mt-2">
                            <div className="text-sm font-medium">Recipients</div>
                            <div className="text-lg font-semibold">{campaign.recipientCount}</div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/50 flex justify-between pt-3">
                        {campaign.status === 'draft' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <div className="space-x-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedCampaign(campaign);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => sendCampaignMutation.mutate(campaign.id)}
                                disabled={sendCampaignMutation.isPending}
                              >
                                {sendCampaignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="h-4 w-4 mr-1" />
                                Send
                              </Button>
                            </div>
                          </>
                        )}
                        
                        {campaign.status === 'scheduled' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Cancel scheduled campaign
                              }}
                            >
                              Cancel Schedule
                            </Button>
                          </>
                        )}
                        
                        {campaign.status === 'sent' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsPreviewDialogOpen(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Clone campaign
                              }}
                            >
                              Clone
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium mb-2">No SMS Campaigns Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first SMS campaign to reach your audience directly on their phones.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create SMS Campaign
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Recipients Tab */}
            <TabsContent value="recipients" className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recipient Sources</CardTitle>
                      <CardDescription>
                        Filter recipients by source or tag
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <button
                          onClick={() => setRecipientSource("all")}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            recipientSource === "all" 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>All Recipients</span>
                          <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                            {recipients.length}
                          </span>
                        </button>
                        
                        <button
                          onClick={() => setRecipientSource("subscribed")}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            recipientSource === "subscribed" 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>Subscribed</span>
                          <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                            {recipients.filter(r => !r.unsubscribed).length}
                          </span>
                        </button>
                        
                        <button
                          onClick={() => setRecipientSource("unsubscribed")}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            recipientSource === "unsubscribed" 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>Unsubscribed</span>
                          <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                            {recipients.filter(r => r.unsubscribed).length}
                          </span>
                        </button>
                        
                        {allTags.length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Tags</h4>
                            {allTags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setRecipientSource(tag)}
                                className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                                  recipientSource === tag 
                                    ? "bg-primary text-primary-foreground" 
                                    : "hover:bg-muted"
                                }`}
                              >
                                <span>{tag}</span>
                                <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                                  {recipients.filter(r => r.tags?.includes(tag)).length}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Recipients</CardTitle>
                      <CardDescription>
                        Import your contacts from a CSV file
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4" onSubmit={handleUploadSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="file">CSV File</Label>
                          <Input 
                            id="file" 
                            type="file" 
                            accept=".csv"
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be a CSV file with the correct format.
                          </p>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>For {activeTab === "email" ? "email" : "SMS"} recipients, use this format:</p>
                          <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
                            {activeTab === "email" ? emailCsvExample : smsCsvExample}
                          </pre>
                        </div>
                        
                        <Button type="submit" disabled={uploadForm.uploading || !uploadForm.file} className="w-full">
                          {uploadForm.uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload Recipients
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {recipientSource === "all" ? "All Recipients" : 
                         recipientSource === "subscribed" ? "Subscribed Recipients" :
                         recipientSource === "unsubscribed" ? "Unsubscribed Recipients" :
                         `Recipients Tagged with "${recipientSource}"`}
                      </CardTitle>
                      <CardDescription>
                        Showing {filteredRecipients.length} recipients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingRecipients ? (
                        <div className="flex justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : filteredRecipients.length > 0 ? (
                        <div className="border rounded-md">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="px-4 py-3 text-left font-medium">Name</th>
                                  <th className="px-4 py-3 text-left font-medium">Email</th>
                                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                                  <th className="px-4 py-3 text-left font-medium">Added</th>
                                  <th className="px-4 py-3 text-left font-medium">Tags</th>
                                  <th className="px-4 py-3 text-center font-medium">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {filteredRecipients.map(recipient => (
                                  <tr key={recipient.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">{recipient.name}</td>
                                    <td className="px-4 py-3">{recipient.email}</td>
                                    <td className="px-4 py-3">{recipient.phone || "—"}</td>
                                    <td className="px-4 py-3">{format(new Date(recipient.added), 'MMM d, yyyy')}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex flex-wrap gap-1">
                                        {recipient.tags?.map(tag => (
                                          <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-xs">
                                            {tag}
                                          </span>
                                        )) || "—"}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        !recipient.unsubscribed 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      }`}>
                                        {!recipient.unsubscribed ? "Subscribed" : "Unsubscribed"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <h3 className="text-lg font-medium mb-2">No Recipients Found</h3>
                          <p className="text-muted-foreground mb-4">
                            {recipientSource === "all" 
                              ? "You haven't added any recipients yet. Upload a CSV file to get started."
                              : recipientSource === "unsubscribed"
                              ? "No recipients have unsubscribed."
                              : `No recipients with the tag "${recipientSource}" were found.`
                            }
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Preview Dialog */}
          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedCampaign?.type === 'email' ? 'Email Preview' : 'SMS Preview'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {selectedCampaign?.type === 'email' ? (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">From: Samuel Marndi &lt;noreply@samuelmarndi.in&gt;</div>
                      <div className="text-sm font-medium">Subject: {selectedCampaign?.subject}</div>
                      <div className="text-sm font-medium">To: [Recipient]</div>
                    </div>
                    <div className="border-t pt-4">
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedCampaign?.content.replace(/{{name}}/g, 'John') || ''
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 max-w-sm mx-auto">
                    <div className="bg-blue-100 dark:bg-blue-950 rounded-2xl p-4 text-sm max-w-[80%]">
                      {selectedCampaign?.content.replace(/{{name}}/g, 'John')}
                    </div>
                    <div className="text-xs text-center mt-2 text-muted-foreground">
                      {selectedCampaign?.content.length} characters
                      {selectedCampaign?.content.length > 160 && (
                        <span className="text-red-500"> (exceeds 160 character limit, may send as multiple messages)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the campaign "{selectedCampaign?.name}".
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => selectedCampaign && deleteCampaignMutation.mutate(selectedCampaign.id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteCampaignMutation.isPending}
                >
                  {deleteCampaignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AdminLayout>
    </>
  );
}