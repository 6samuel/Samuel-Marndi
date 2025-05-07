import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/admin-layout";
import { ContactSubmission, ServiceRequest } from "@shared/schema";
import { format } from "date-fns";

export default function AdminForms() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("contact");

  // Fetch contact submissions
  const { 
    data: contactSubmissions = [], 
    isLoading: isLoadingContacts 
  } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch service requests
  const { 
    data: serviceRequests = [], 
    isLoading: isLoadingRequests 
  } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests"],
    staleTime: 60 * 1000, // 1 minute
  });

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
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}