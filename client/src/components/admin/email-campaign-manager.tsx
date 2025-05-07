import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

interface ContactData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  submittedAt: Date;
  selected?: boolean;
}

interface ServiceRequestData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  submittedAt: Date;
  selected?: boolean;
}

interface CampaignData {
  recipients: Array<{ name: string; email: string; phone?: string }>;
  subject: string;
  messageBody: string;
  campaignType: 'email' | 'sms';
}

const EmailCampaignManager: React.FC = () => {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<CampaignData>({
    recipients: [],
    subject: '',
    messageBody: '',
    campaignType: 'email'
  });
  
  // Fetch contacts and service requests
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/contact-submissions');
      const data = await res.json();
      return data.map((item: ContactData) => ({ ...item, selected: false }));
    }
  });
  
  const { data: serviceRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/admin/service-requests'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/service-requests');
      const data = await res.json();
      return data.map((item: ServiceRequestData) => ({ ...item, selected: false }));
    }
  });
  
  // Track selected recipients
  const [selectedContacts, setSelectedContacts] = useState<ContactData[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<ServiceRequestData[]>([]);
  
  const handleContactSelection = (contact: ContactData, selected: boolean) => {
    if (selected) {
      setSelectedContacts(prev => [...prev, contact]);
    } else {
      setSelectedContacts(prev => prev.filter(c => c.id !== contact.id));
    }
  };
  
  const handleRequestSelection = (request: ServiceRequestData, selected: boolean) => {
    if (selected) {
      setSelectedRequests(prev => [...prev, request]);
    } else {
      setSelectedRequests(prev => prev.filter(r => r.id !== request.id));
    }
  };
  
  const selectAllContacts = (selected: boolean) => {
    if (selected && contacts) {
      setSelectedContacts(contacts);
    } else {
      setSelectedContacts([]);
    }
  };
  
  const selectAllRequests = (selected: boolean) => {
    if (selected && serviceRequests) {
      setSelectedRequests(serviceRequests);
    } else {
      setSelectedRequests([]);
    }
  };
  
  // Prepare recipients for campaign
  const prepareRecipients = () => {
    const allRecipients = [
      ...selectedContacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || undefined
      })),
      ...selectedRequests.map(request => ({
        name: request.name,
        email: request.email,
        phone: request.phone || undefined
      }))
    ];
    
    // Remove duplicates based on email
    const uniqueRecipients = allRecipients.filter((recipient, index, self) => 
      index === self.findIndex(r => r.email === recipient.email)
    );
    
    setCampaign(prev => ({ ...prev, recipients: uniqueRecipients }));
    
    toast({
      title: "Recipients selected",
      description: `${uniqueRecipients.length} unique recipients added to campaign.`
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignData: CampaignData) => {
      const endpoint = campaignData.campaignType === 'email' 
        ? '/api/admin/send-email-campaign' 
        : '/api/admin/send-sms-campaign';
        
      const res = await apiRequest('POST', endpoint, campaignData);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign sent successfully",
        description: `${data.success} messages were sent successfully. ${data.failed} failed.`,
      });
      
      // Reset campaign form
      setCampaign({
        recipients: [],
        subject: '',
        messageBody: '',
        campaignType: 'email'
      });
      
      setSelectedContacts([]);
      setSelectedRequests([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send campaign",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle campaign type change
  const handleCampaignTypeChange = (type: 'email' | 'sms') => {
    setCampaign(prev => ({
      ...prev,
      campaignType: type
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (campaign.recipients.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient for your campaign.",
        variant: "destructive"
      });
      return;
    }
    
    if (!campaign.messageBody) {
      toast({
        title: "Message is empty",
        description: "Please enter a message for your campaign.",
        variant: "destructive"
      });
      return;
    }
    
    if (campaign.campaignType === 'email' && !campaign.subject) {
      toast({
        title: "Subject is empty",
        description: "Please enter a subject for your email campaign.",
        variant: "destructive"
      });
      return;
    }
    
    // For SMS campaign, filter recipients who have a phone number
    const finalData = { ...campaign };
    if (campaign.campaignType === 'sms') {
      finalData.recipients = campaign.recipients.filter(r => r.phone);
      
      if (finalData.recipients.length === 0) {
        toast({
          title: "No valid phone numbers",
          description: "None of the selected recipients have a valid phone number.",
          variant: "destructive"
        });
        return;
      }
    }
    
    sendCampaignMutation.mutate(finalData);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email & SMS Campaign Manager</CardTitle>
        <CardDescription>
          Create and send targeted email and SMS campaigns to your contacts and leads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recipients">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipients">Select Recipients</TabsTrigger>
            <TabsTrigger value="compose">Compose Message</TabsTrigger>
            <TabsTrigger value="preview">Preview & Send</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipients" className="space-y-4 mt-4">
            <Tabs defaultValue="contacts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contacts">Contact Form Submissions</TabsTrigger>
                <TabsTrigger value="requests">Service Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contacts" className="mt-4">
                {contactsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <Checkbox 
                        id="selectAllContacts" 
                        checked={selectedContacts.length === contacts.length}
                        onCheckedChange={selectAllContacts}
                      />
                      <Label htmlFor="selectAllContacts" className="ml-2">Select All</Label>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contacts.map(contact => (
                            <TableRow key={contact.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedContacts.some(c => c.id === contact.id)}
                                  onCheckedChange={(checked) => 
                                    handleContactSelection(contact, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.phone || 'N/A'}</TableCell>
                              <TableCell>
                                {new Date(contact.submittedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    No contact form submissions found.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="requests" className="mt-4">
                {requestsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : serviceRequests && serviceRequests.length > 0 ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <Checkbox 
                        id="selectAllRequests" 
                        checked={selectedRequests.length === serviceRequests.length}
                        onCheckedChange={selectAllRequests}
                      />
                      <Label htmlFor="selectAllRequests" className="ml-2">Select All</Label>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceRequests.map(request => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedRequests.some(r => r.id === request.id)}
                                  onCheckedChange={(checked) => 
                                    handleRequestSelection(request, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell>{request.name}</TableCell>
                              <TableCell>{request.email}</TableCell>
                              <TableCell>{request.phone || 'N/A'}</TableCell>
                              <TableCell>{request.company || 'N/A'}</TableCell>
                              <TableCell>
                                {new Date(request.submittedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    No service requests found.
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end mt-4">
              <Button onClick={prepareRecipients}>
                Use Selected Recipients ({selectedContacts.length + selectedRequests.length})
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="compose" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant={campaign.campaignType === 'email' ? 'default' : 'outline'}
                  onClick={() => handleCampaignTypeChange('email')}
                >
                  Email Campaign
                </Button>
                <Button
                  variant={campaign.campaignType === 'sms' ? 'default' : 'outline'}
                  onClick={() => handleCampaignTypeChange('sms')}
                >
                  SMS Campaign
                </Button>
              </div>
              
              {campaign.campaignType === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter email subject line"
                    value={campaign.subject}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="messageBody">
                  {campaign.campaignType === 'email' ? 'Email Content' : 'SMS Message'}
                </Label>
                <Textarea
                  id="messageBody"
                  name="messageBody"
                  placeholder={campaign.campaignType === 'email' 
                    ? "Enter your email content. You can use {{name}} to personalize the message."
                    : "Enter your SMS message. You can use {{name}} to personalize the message. Keep it concise for SMS."
                  }
                  value={campaign.messageBody}
                  onChange={handleInputChange}
                  rows={campaign.campaignType === 'email' ? 10 : 4}
                />
                {campaign.campaignType === 'sms' && (
                  <p className="text-sm text-muted-foreground">
                    SMS messages should be kept short (under 160 characters for a single message).
                    Current length: {campaign.messageBody.length} characters
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Campaign Type</h3>
                <p>{campaign.campaignType === 'email' ? 'Email Campaign' : 'SMS Campaign'}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recipients</h3>
                <p className="text-sm text-muted-foreground">
                  {campaign.recipients.length} recipient(s) selected
                </p>
                {campaign.recipients.length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                    <ul className="space-y-1">
                      {campaign.recipients.map((recipient, index) => (
                        <li key={index} className="text-sm">
                          {recipient.name} ({recipient.email})
                          {campaign.campaignType === 'sms' && 
                            ` - ${recipient.phone ? recipient.phone : 'No phone number'}`
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {campaign.campaignType === 'email' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Subject</h3>
                  <p>{campaign.subject || 'No subject'}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Message Preview</h3>
                <div className="rounded-md border p-4 bg-gray-50 dark:bg-gray-900">
                  {campaign.messageBody ? (
                    <div className="whitespace-pre-wrap">
                      {campaign.messageBody.replace(/{{name}}/g, '[Recipient Name]')}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No message content</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {campaign.campaignType === 'email' 
            ? 'Emails will be sent via Brevo SMTP'
            : 'SMS messages will be sent via Twilio'
          }
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={
            sendCampaignMutation.isPending || 
            campaign.recipients.length === 0 || 
            !campaign.messageBody || 
            (campaign.campaignType === 'email' && !campaign.subject)
          }
        >
          {sendCampaignMutation.isPending 
            ? 'Sending...' 
            : `Send ${campaign.campaignType === 'email' ? 'Email' : 'SMS'} Campaign`
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailCampaignManager;