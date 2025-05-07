import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";
import { ContactSubmission, ServiceRequest, PartnerApplication } from "@shared/schema";
import { format } from "date-fns";
import { queryClient, getQueryFn, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Eye, Trash2, Reply, Loader2 } from "lucide-react";

export default function AdminForms() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("contact");
  
  // State for dialogs
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // State for selected items
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  
  // State for reply form
  const [replyForm, setReplyForm] = useState({
    subject: "",
    message: ""
  });

  // Fetch contact submissions using our centralized queryFn
  const { 
    data: contactSubmissions = [], 
    isLoading: isLoadingContacts,
    refetch: refetchContacts
  } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    queryFn: getQueryFn(),
    enabled: !!user, // Only run query if user is logged in
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Fetch service requests using our centralized queryFn
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests"],
    queryFn: getQueryFn(),
    enabled: !!user, // Only run query if user is logged in
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Fetch partner applications using our centralized queryFn
  const { 
    data: partnerApplications = [], 
    isLoading: isLoadingPartners,
    refetch: refetchPartners
  } = useQuery<PartnerApplication[]>({
    queryKey: ["/api/partner-applications"],
    queryFn: getQueryFn(),
    enabled: !!user, // Only run query if user is logged in
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Mutations for handling form submissions
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ type, id, status }: { type: string, id: number, status: string }) => {
      const endpoint = type === 'contact' 
        ? `/api/contact-submissions/${id}/status` 
        : type === 'service' 
        ? `/api/service-requests/${id}/status` 
        : `/api/partner-applications/${id}/status`;
        
      const res = await apiRequest('PATCH', endpoint, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The status has been updated successfully.",
      });
      
      // Refresh the appropriate data based on the current tab
      if (activeTab === 'contact') {
        queryClient.invalidateQueries({ queryKey: ['/api/contact-submissions'] });
      } else if (activeTab === 'service') {
        queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/partner-applications'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete submission mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string, id: number }) => {
      const endpoint = type === 'contact' 
        ? `/api/contact-submissions/${id}` 
        : type === 'service' 
        ? `/api/service-requests/${id}` 
        : `/api/partner-applications/${id}`;
        
      await apiRequest('DELETE', endpoint);
    },
    onSuccess: () => {
      toast({
        title: "Submission deleted",
        description: "The submission has been deleted successfully.",
      });
      
      // Refresh the appropriate data based on the current tab
      if (activeTab === 'contact') {
        queryClient.invalidateQueries({ queryKey: ['/api/contact-submissions'] });
      } else if (activeTab === 'service') {
        queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/partner-applications'] });
      }
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Reset selected items
      setSelectedContact(null);
      setSelectedRequest(null);
      setSelectedApplication(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting submission",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Reply to submission mutation
  const replyMutation = useMutation({
    mutationFn: async ({ 
      type, 
      id, 
      email, 
      name, 
      subject, 
      message 
    }: { 
      type: string, 
      id: number, 
      email: string, 
      name: string, 
      subject: string, 
      message: string 
    }) => {
      const endpoint = `/api/send-reply`;
      const res = await apiRequest('POST', endpoint, {
        type,
        id,
        email,
        name,
        subject,
        message
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
      
      // Update the status to replied
      const type = activeTab;
      let id = 0;
      let status = '';
      
      if (type === 'contact' && selectedContact) {
        id = selectedContact.id;
        status = 'replied';
      } else if (type === 'service' && selectedRequest) {
        id = selectedRequest.id;
        status = 'contacted';
      } else if (type === 'partner' && selectedApplication) {
        id = selectedApplication.id;
        status = 'contacted';
      }
      
      if (id > 0) {
        updateStatusMutation.mutate({ type, id, status });
      }
      
      // Close the dialog
      setIsReplyDialogOpen(false);
      
      // Reset form and selected items
      setReplyForm({ subject: "", message: "" });
      setSelectedContact(null);
      setSelectedRequest(null);
      setSelectedApplication(null);
    },
    onError: (error) => {
      toast({
        title: "Error sending reply",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Function to handle view action
  const handleView = (type: string, id: number) => {
    if (type === 'contact') {
      const submission = contactSubmissions.find(s => s.id === id);
      if (submission) {
        setSelectedContact(submission);
        // Change status to reading if it was unread
        if (submission.status === 'unread') {
          updateStatusMutation.mutate({ type, id, status: 'reading' });
        }
      }
    } else if (type === 'service') {
      const request = serviceRequests.find(r => r.id === id);
      if (request) {
        setSelectedRequest(request);
        // Change status to reviewing if it was pending
        if (request.status === 'pending') {
          updateStatusMutation.mutate({ type, id, status: 'reviewing' });
        }
      }
    } else if (type === 'partner') {
      const application = partnerApplications.find(a => a.id === id);
      if (application) {
        setSelectedApplication(application);
        // Change status to reviewing if it was new
        if (application.status === 'new') {
          updateStatusMutation.mutate({ type, id, status: 'reviewing' });
        }
      }
    }
    setIsViewDialogOpen(true);
  };
  
  // Function to handle reply action
  const handleReply = (type: string, id: number) => {
    if (type === 'contact') {
      const submission = contactSubmissions.find(s => s.id === id);
      if (submission) {
        setSelectedContact(submission);
        setReplyForm({
          subject: `RE: ${submission.subject || 'Your Contact Form Submission'}`,
          message: `Dear ${submission.name},\n\nThank you for reaching out to us. We have received your message and would like to respond to your inquiry.\n\n`
        });
      }
    } else if (type === 'service') {
      const request = serviceRequests.find(r => r.id === id);
      if (request) {
        setSelectedRequest(request);
        setReplyForm({
          subject: `RE: Your Service Request`,
          message: `Dear ${request.name},\n\nThank you for your interest in our services. We have received your request and would like to discuss it further.\n\n`
        });
      }
    } else if (type === 'partner') {
      const application = partnerApplications.find(a => a.id === id);
      if (application) {
        setSelectedApplication(application);
        setReplyForm({
          subject: `RE: Your Partnership Application`,
          message: `Dear ${application.contactName},\n\nThank you for your interest in partnering with us. We have received your application and would like to discuss the potential partnership further.\n\n`
        });
      }
    }
    setIsReplyDialogOpen(true);
  };
  
  // Function to handle delete action
  const handleDelete = (type: string, id: number) => {
    if (type === 'contact') {
      const submission = contactSubmissions.find(s => s.id === id);
      if (submission) setSelectedContact(submission);
    } else if (type === 'service') {
      const request = serviceRequests.find(r => r.id === id);
      if (request) setSelectedRequest(request);
    } else if (type === 'partner') {
      const application = partnerApplications.find(a => a.id === id);
      if (application) setSelectedApplication(application);
    }
    setIsDeleteDialogOpen(true);
  };
  
  // Function to handle reply form input changes
  const handleReplyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReplyForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Form Submissions - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Form Submissions">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Form Submissions</h2>
          
          <Tabs defaultValue="contact" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="contact">
                Contact Form 
                {contactSubmissions.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {contactSubmissions.filter(s => s.status === 'unread').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="service">
                Service Requests
                {serviceRequests.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {serviceRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="partner">
                Partner Applications
                {partnerApplications.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {partnerApplications.filter(p => p.status === 'new').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="pt-4">
              <div className="border rounded-lg shadow overflow-hidden">
                {isLoadingContacts ? (
                  <div className="p-6 text-center">Loading contact submissions...</div>
                ) : contactSubmissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Subject</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {contactSubmissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">{submission.name}</td>
                            <td className="px-4 py-3">{submission.email}</td>
                            <td className="px-4 py-3">{submission.subject || 'N/A'}</td>
                            <td className="px-4 py-3">
                              {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.status === 'unread' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : submission.status === 'reading' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleView('contact', submission.id)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleReply('contact', submission.id)}
                                  title="Reply to submission"
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('contact', submission.id)}
                                  title="Delete submission"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    No contact submissions found.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="service" className="pt-4">
              <div className="border rounded-lg shadow overflow-hidden">
                {isLoadingRequests ? (
                  <div className="p-6 text-center">Loading service requests...</div>
                ) : serviceRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Service</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {serviceRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">{request.name}</td>
                            <td className="px-4 py-3">{request.email}</td>
                            <td className="px-4 py-3">Service #{request.serviceId}</td>
                            <td className="px-4 py-3">
                              {format(new Date(request.submittedAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : request.status === 'contacted' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {/* View/Reply/Delete buttons would go here */}
                              <span className="text-sm text-gray-500">View / Reply / Delete</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    No service requests found.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="partner" className="pt-4">
              <div className="border rounded-lg shadow overflow-hidden">
                {isLoadingPartners ? (
                  <div className="p-6 text-center">Loading partner applications...</div>
                ) : partnerApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-3 text-left">Company</th>
                          <th className="px-4 py-3 text-left">Contact Name</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Business Type</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {partnerApplications.map((application) => (
                          <tr key={application.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">{application.companyName}</td>
                            <td className="px-4 py-3">{application.contactName}</td>
                            <td className="px-4 py-3">{application.email}</td>
                            <td className="px-4 py-3">{application.businessType}</td>
                            <td className="px-4 py-3">
                              {format(new Date(application.submittedAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                application.status === 'new' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : application.status === 'reviewing' 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {/* View/Reply/Delete buttons would go here */}
                              <span className="text-sm text-gray-500">View / Reply / Delete</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    No partner applications found.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}