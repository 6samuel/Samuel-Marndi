import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Service } from "@shared/schema";

export default function AdminServices() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services with a simple approach
  const { data: servicesData } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/services", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data as Service[];
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Safely access services data
  const services = servicesData || [];

  return (
    <>
      <Helmet>
        <title>Manage Services - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Services">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Services</h2>
            {/* Add Service button would go here */}
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading services...</div>
            ) : services.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Slug</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{service.title}</td>
                        <td className="px-4 py-3">{service.slug}</td>
                        <td className="px-4 py-3 text-center">
                          {service.featured ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {/* Edit/Delete buttons would go here */}
                          <span className="text-sm text-gray-500">Edit / Delete</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                No services found. Add your first service to get started.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}