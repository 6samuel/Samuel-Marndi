import AdminLayout from "@/components/layouts/admin-layout";
import ConsultationManager from "@/components/admin/consultation-manager";
import { Helmet } from "react-helmet-async";

export default function AdminConsultationsPage() {
  return (
    <AdminLayout
      title="Consultation Bookings"
      description="Manage consultation bookings, update status, and track payments"
    >
      <Helmet>
        <title>Consultation Management - Samuel Marndi Admin</title>
        <meta name="description" content="Manage consultation bookings, update status, and track payments" />
      </Helmet>
      
      <ConsultationManager />
    </AdminLayout>
  );
}