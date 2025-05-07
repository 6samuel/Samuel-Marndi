import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Testimonial } from "@shared/schema";

export default function AdminTestimonials() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch testimonials
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/testimonials", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });

  return (
    <>
      <Helmet>
        <title>Manage Testimonials - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Testimonials">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
            {/* Add Testimonial button would go here */}
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading testimonials...</div>
            ) : testimonials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Company</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-center">Rating</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{testimonial.name}</td>
                        <td className="px-4 py-3">{testimonial.company}</td>
                        <td className="px-4 py-3">{testimonial.role}</td>
                        <td className="px-4 py-3 text-center">{testimonial.rating}/5</td>
                        <td className="px-4 py-3 text-center">
                          {testimonial.featured ? "Yes" : "No"}
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
                No testimonials found. Add your first testimonial to get started.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}