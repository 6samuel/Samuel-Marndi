import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { BlogPost } from "@shared/schema";
import { format } from "date-fns";

export default function AdminBlog() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog posts with improved approach
  const { data: blogData } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/blog", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
        }
        
        return await response.json() as BlogPost[];
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Safely access blog data
  const blogPosts = blogData || [];

  return (
    <>
      <Helmet>
        <title>Manage Blog - Admin Dashboard | Samuel Marndi</title>
      </Helmet>
      <AdminLayout title="Manage Blog">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
            {/* Add Blog Post button would go here */}
          </div>
          
          <div className="border rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">Loading blog posts...</div>
            ) : blogPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Author</th>
                      <th className="px-4 py-3 text-left">Publish Date</th>
                      <th className="px-4 py-3 text-center">Featured</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">{post.title}</td>
                        <td className="px-4 py-3">{post.author}</td>
                        <td className="px-4 py-3">
                          {format(new Date(post.publishDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {post.featured ? "Yes" : "No"}
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
                No blog posts found. Add your first blog post to get started.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}