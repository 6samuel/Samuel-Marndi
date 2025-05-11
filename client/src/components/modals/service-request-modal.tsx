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
  
  // Find the service name if serviceId is provided
  const serviceName = React.useMemo(() => {
    if (!serviceId || !services) return undefined;
    const service = services.find(s => s.id.toString() === serviceId);
    return service?.title;
  }, [serviceId, services]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-0 pt-10 sm:pt-6">
          <DialogTitle>
            {serviceName 
              ? `Request Service: ${serviceName}` 
              : "Request Service"
            }
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to request more information about this service
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2 pb-8">
          <ServiceRequestForm
            onClose={onClose}
            serviceId={serviceId}
            serviceName={serviceName}
            services={services || []}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}