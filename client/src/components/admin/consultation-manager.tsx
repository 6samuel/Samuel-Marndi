import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, Calendar, ClipboardCheck, Trash, Mail, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  topic: string;
  additionalInfo: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentId: string | null;
  paymentAmount: number;
  meetingLink: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ConsultationManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'edit'>('details');
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch consultations
  const { data: consultations, isLoading, error } = useQuery({
    queryKey: ['/api/admin/consultations'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/consultations');
      if (!response.ok) {
        throw new Error('Failed to fetch consultations');
      }
      return response.json();
    }
  });

  // Update consultation status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/admin/consultations/${id}/status`, { status });
      if (!response.ok) {
        throw new Error('Failed to update consultation status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] });
      toast({
        title: "Status updated",
        description: "The consultation status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update consultation details (meeting link, notes)
  const updateDetailsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/consultations/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update consultation details');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] });
      setViewMode('details');
      toast({
        title: "Details updated",
        description: "The consultation details have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete consultation
  const deleteConsultationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/consultations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete consultation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] });
      setSelectedConsultation(null);
      setIsDetailsDialogOpen(false);
      toast({
        title: "Deleted",
        description: "The consultation has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Send reminder email
  const sendReminderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/admin/consultations/${id}/send-reminder`);
      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reminder sent",
        description: "A reminder email has been sent to the client.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send reminder",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setMeetingLink(consultation.meetingLink || "");
    setNotes(consultation.notes || "");
    setViewMode('details');
    setIsDetailsDialogOpen(true);
  };

  const handleEditConsultation = () => {
    setViewMode('edit');
  };

  const handleSaveDetails = () => {
    if (!selectedConsultation) return;
    
    updateDetailsMutation.mutate({
      id: selectedConsultation.id,
      data: {
        meetingLink,
        notes
      }
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = () => {
    if (!selectedConsultation) return;
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      deleteConsultationMutation.mutate(selectedConsultation.id);
    }
  };

  const handleSendReminder = () => {
    if (!selectedConsultation) return;
    sendReminderMutation.mutate(selectedConsultation.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No-Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Unpaid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredConsultations = consultations?.filter((consultation: Consultation) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      consultation.name.toLowerCase().includes(searchTermLower) ||
      consultation.email.toLowerCase().includes(searchTermLower) ||
      consultation.phone.toLowerCase().includes(searchTermLower) ||
      consultation.topic.toLowerCase().includes(searchTermLower) ||
      consultation.status.toLowerCase().includes(searchTermLower) ||
      consultation.paymentStatus.toLowerCase().includes(searchTermLower)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
        <p>Error loading consultations: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button 
          variant="outline" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] })}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Consultations</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search consultations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/consultation'}>
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Consultations</CardTitle>
          <CardDescription>Manage all consultation bookings and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? 'No consultations match your search.' : 'No consultations have been booked yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultations.map((consultation: Consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{consultation.name}</p>
                        <p className="text-sm text-muted-foreground">{consultation.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p>{new Date(consultation.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.timeSlot}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-[200px]">{consultation.topic}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={consultation.status}
                        onValueChange={(value) => handleStatusChange(consultation.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>{getStatusBadge(consultation.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                              <span>Pending</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="confirmed">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              <span>Confirmed</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <ClipboardCheck className="h-4 w-4 mr-2 text-blue-600" />
                              <span>Completed</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              <span>Cancelled</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="no-show">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-gray-600" />
                              <span>No-Show</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(consultation.paymentStatus)}
                      {consultation.paymentMethod && (
                        <p className="text-xs text-muted-foreground mt-1">via {consultation.paymentMethod}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewConsultation(consultation)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consultation Details Dialog */}
      {selectedConsultation && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {viewMode === 'details' ? 'Consultation Details' : 'Edit Consultation'}
              </DialogTitle>
              <DialogDescription>
                {viewMode === 'details' 
                  ? 'Review the details of this consultation booking.' 
                  : 'Update the meeting link and notes for this consultation.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {viewMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Client Information</h3>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="font-medium">{selectedConsultation.name}</p>
                          <p className="text-sm">{selectedConsultation.email}</p>
                          <p className="text-sm">{selectedConsultation.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Booking Details</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Date:</span>
                          <span className="text-sm font-medium">{new Date(selectedConsultation.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Time:</span>
                          <span className="text-sm font-medium">{selectedConsultation.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <span>{getStatusBadge(selectedConsultation.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Created:</span>
                          <span className="text-sm font-medium">{new Date(selectedConsultation.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <span>{getPaymentStatusBadge(selectedConsultation.paymentStatus)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Amount:</span>
                          <span className="text-sm font-medium">₹{selectedConsultation.paymentAmount}</span>
                        </div>
                        {selectedConsultation.paymentMethod && (
                          <div className="flex justify-between">
                            <span className="text-sm">Method:</span>
                            <span className="text-sm font-medium">{selectedConsultation.paymentMethod}</span>
                          </div>
                        )}
                        {selectedConsultation.paymentId && (
                          <div className="flex justify-between">
                            <span className="text-sm">Payment ID:</span>
                            <span className="text-sm font-medium truncate max-w-[200px]">{selectedConsultation.paymentId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Consultation Topic</h3>
                      <p className="mt-2 p-3 bg-muted rounded-md text-sm">{selectedConsultation.topic}</p>
                    </div>

                    {selectedConsultation.additionalInfo && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                        <p className="mt-2 p-3 bg-muted rounded-md text-sm">{selectedConsultation.additionalInfo}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Meeting Link</h3>
                      {selectedConsultation.meetingLink ? (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm break-all">
                          <a href={selectedConsultation.meetingLink} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline">
                            {selectedConsultation.meetingLink}
                          </a>
                        </div>
                      ) : (
                        <p className="mt-2 p-3 bg-muted rounded-md text-sm text-muted-foreground">No meeting link added yet.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                      {selectedConsultation.notes ? (
                        <p className="mt-2 p-3 bg-muted rounded-md text-sm">{selectedConsultation.notes}</p>
                      ) : (
                        <p className="mt-2 p-3 bg-muted rounded-md text-sm text-muted-foreground">No notes added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Meeting Link</label>
                    <Input
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="e.g. https://zoom.us/j/123456789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes or follow-up details here"
                      className="mt-1"
                      rows={5}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {viewMode === 'details' ? (
                <>
                  <div className="flex-1 flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={deleteConsultationMutation.isPending}
                    >
                      {deleteConsultationMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSendReminder}
                      disabled={sendReminderMutation.isPending}
                    >
                      {sendReminderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4 mr-2" />
                      )}
                      Send Reminder
                    </Button>
                  </div>
                  <Button onClick={handleEditConsultation}>Edit Details</Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewMode('details')}
                    disabled={updateDetailsMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveDetails}
                    disabled={updateDetailsMutation.isPending}
                  >
                    {updateDetailsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}