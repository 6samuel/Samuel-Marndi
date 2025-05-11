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
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  
  // Data export function
  const exportData = (data: any[], format: 'csv' | 'json' | 'excel', filename: string) => {
    if (!data || data.length === 0) {
      return;
    }
    
    const exportDate = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${exportDate}`;
    
    if (format === 'json') {
      // Export as JSON
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadBlob(blob, `${fullFilename}.json`);
    } 
    else if (format === 'csv') {
      // Export as CSV
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => {
          return headers.map(header => {
            let value = row[header];
            
            // Handle complex values
            if (typeof value === 'object' && value !== null) {
              value = JSON.stringify(value);
            }
            
            // Escape quotes and format for CSV
            const cellValue = value === null || value === undefined ? '' : String(value);
            return `"${cellValue.replace(/"/g, '""')}"`;
          }).join(',');
        })
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `${fullFilename}.csv`);
    }
    else if (format === 'excel') {
      // For Excel, we'll actually just use CSV which Excel can open
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => {
          return headers.map(header => {
            let value = row[header];
            
            // Handle complex values
            if (typeof value === 'object' && value !== null) {
              value = JSON.stringify(value);
            }
            
            // Escape quotes and format for CSV
            const cellValue = value === null || value === undefined ? '' : String(value);
            return `"${cellValue.replace(/"/g, '""')}"`;
          }).join(',');
        })
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'application/vnd.ms-excel' });
      downloadBlob(blob, `${fullFilename}.xls`);
    }
  };
  
  // Helper function to download blob
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
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
              <div className="mb-4 flex justify-end space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportData(contactSubmissions, 'csv', 'contact-submissions')}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(contactSubmissions, 'json', 'contact-submissions')}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(contactSubmissions, 'excel', 'contact-submissions')}>
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
              <div className="mb-4 flex justify-end space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportData(serviceRequests, 'csv', 'service-requests')}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(serviceRequests, 'json', 'service-requests')}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(serviceRequests, 'excel', 'service-requests')}>
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                              <div className="flex items-center justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleView('service', request.id)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleReply('service', request.id)}
                                  title="Reply to request"
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('service', request.id)}
                                  title="Delete request"
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
                    No service requests found.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="partner" className="pt-4">
              <div className="mb-4 flex justify-end space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportData(partnerApplications, 'csv', 'partner-applications')}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(partnerApplications, 'json', 'partner-applications')}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData(partnerApplications, 'excel', 'partner-applications')}>
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                              <div className="flex items-center justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleView('partner', application.id)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleReply('partner', application.id)}
                                  title="Reply to application"
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('partner', application.id)}
                                  title="Delete application"
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
                    No partner applications found.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* View Submission Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {activeTab === 'contact' ? 'Contact Form Submission Details' : 
                   activeTab === 'service' ? 'Service Request Details' : 
                   'Partner Application Details'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {activeTab === 'contact' && selectedContact && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Name</h4>
                        <p>{selectedContact.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Email</h4>
                        <p>{selectedContact.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Phone</h4>
                        <p>{selectedContact.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Subject</h4>
                        <p>{selectedContact.subject || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Service Interest</h4>
                      <p>{selectedContact.serviceInterest || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Source</h4>
                      <p>{selectedContact.source || 'Website'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Message</h4>
                      <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                        {selectedContact.message}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Submitted On</h4>
                      <p>{format(new Date(selectedContact.submittedAt), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'service' && selectedRequest && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Name</h4>
                        <p>{selectedRequest.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Email</h4>
                        <p>{selectedRequest.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Phone</h4>
                        <p>{selectedRequest.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Company</h4>
                        <p>{selectedRequest.company || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Service ID</h4>
                      <p>{selectedRequest.serviceId}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Budget</h4>
                        <p>{selectedRequest.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Timeline</h4>
                        <p>{selectedRequest.timeline || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Project Description</h4>
                      <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                        {selectedRequest.projectDescription}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Submitted On</h4>
                      <p>{format(new Date(selectedRequest.submittedAt), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'partner' && selectedApplication && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Company Name</h4>
                        <p>{selectedApplication.companyName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Contact Name</h4>
                        <p>{selectedApplication.contactName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Email</h4>
                        <p>{selectedApplication.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Phone</h4>
                        <p>{selectedApplication.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Business Type</h4>
                        <p>{selectedApplication.businessType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Website</h4>
                        <p>{selectedApplication.website || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Services</h4>
                      <p>{selectedApplication.services}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Expectations</h4>
                      <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                        {selectedApplication.expectations}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Submitted On</h4>
                      <p>{format(new Date(selectedApplication.submittedAt), 'MMMM d, yyyy h:mm a')}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Reply Dialog */}
          <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Send Reply</DialogTitle>
                <DialogDescription>
                  Send a response to the {
                    activeTab === 'contact' ? 'contact form submission' : 
                    activeTab === 'service' ? 'service request' : 
                    'partner application'
                  }.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply-to">To</Label>
                  <Input 
                    id="reply-to" 
                    readOnly 
                    value={
                      activeTab === 'contact' && selectedContact ? selectedContact.email :
                      activeTab === 'service' && selectedRequest ? selectedRequest.email :
                      activeTab === 'partner' && selectedApplication ? selectedApplication.email : ''
                    } 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    value={replyForm.subject}
                    onChange={handleReplyInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={replyForm.message}
                    onChange={handleReplyInputChange}
                    rows={10}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (activeTab === 'contact' && selectedContact) {
                      replyMutation.mutate({
                        type: activeTab,
                        id: selectedContact.id,
                        email: selectedContact.email,
                        name: selectedContact.name,
                        subject: replyForm.subject,
                        message: replyForm.message
                      });
                    } else if (activeTab === 'service' && selectedRequest) {
                      replyMutation.mutate({
                        type: activeTab,
                        id: selectedRequest.id,
                        email: selectedRequest.email,
                        name: selectedRequest.name,
                        subject: replyForm.subject,
                        message: replyForm.message
                      });
                    } else if (activeTab === 'partner' && selectedApplication) {
                      replyMutation.mutate({
                        type: activeTab,
                        id: selectedApplication.id,
                        email: selectedApplication.email,
                        name: selectedApplication.contactName,
                        subject: replyForm.subject,
                        message: replyForm.message
                      });
                    }
                  }}
                  disabled={replyMutation.isPending}
                >
                  {replyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {activeTab === 'contact' 
                    ? "This will permanently delete this contact form submission." 
                    : activeTab === 'service'
                    ? "This will permanently delete this service request."
                    : "This will permanently delete this partner application."
                  }
                  {" "}This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (activeTab === 'contact' && selectedContact) {
                      deleteSubmissionMutation.mutate({ type: activeTab, id: selectedContact.id });
                    } else if (activeTab === 'service' && selectedRequest) {
                      deleteSubmissionMutation.mutate({ type: activeTab, id: selectedRequest.id });
                    } else if (activeTab === 'partner' && selectedApplication) {
                      deleteSubmissionMutation.mutate({ type: activeTab, id: selectedApplication.id });
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteSubmissionMutation.isPending}
                >
                  {deleteSubmissionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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