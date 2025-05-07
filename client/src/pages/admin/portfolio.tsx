import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { PortfolioItem } from "@shared/schema";

export default function AdminPortfolio() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch portfolio items
  const { data: portfolioData } = useQuery({
    queryKey: ["/api/portfolio-items"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/portfolio-items", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
        }
        
        return await response.json() as PortfolioItem[];
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Safely access portfolio data
  const portfolioItems = portfolioData || [];

  return (
    <>
      <Helmet>
        <title>Manage Portfolio - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Portfolio">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
            {/* Add Portfolio Item button would go here */}
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading portfolio items...</div>
            ) : portfolioItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {portfolioItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">{item.client}</td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3 text-center">
                          {item.featured ? "Yes" : "No"}
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
                No portfolio items found. Add your first portfolio item to get started.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}