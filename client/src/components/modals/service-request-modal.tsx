import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ServiceRequestForm from '@/components/forms/service-request-form';
import { useQuery } from '@tanstack/react-query';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId?: string;
}

export default function ServiceRequestModal({
  isOpen,
  onClose,
  serviceId
}: ServiceRequestModalProps) {
  // Fetch all services for the dropdown
  const { data: services } = useQuery<any[]>({
    queryKey: ['/api/services'],
    select: (data) => {
      return Array.isArray(data) ? data.map((service) => ({
        id: service.id,
        title: service.title
      })) : [];
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Request This Service</DialogTitle>
          <DialogDescription>
            Fill out the form below to request more information about this service
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2">
          <ServiceRequestForm
            onClose={onClose}
            serviceId={serviceId}
            services={services || []}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}