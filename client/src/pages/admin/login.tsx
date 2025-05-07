import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { user, loginMutation } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already authenticated and is an admin, redirect to admin dashboard
  if (user && user.role === "admin") {
    return <Redirect to="/admin/dashboard" />;
  }

  // If user is authenticated but not an admin, redirect to home
  if (user && user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Samuel Marndi</title>
        <meta name="description" content="Admin panel login for Samuel Marndi's freelance services website" />
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <div className="flex flex-col justify-center w-full px-4 sm:w-1/2 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to website
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden sm:block sm:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-full max-w-md px-8 py-12 space-y-4 bg-background/80 backdrop-blur-sm rounded-xl">
              <h2 className="text-2xl font-bold text-center">Admin Dashboard</h2>
              <p className="text-center text-muted-foreground">
                Manage your website content, forms, and track marketing performance
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 space-y-2 rounded-lg bg-accent/50">
                  <h3 className="font-medium">Forms</h3>
                  <p className="text-sm text-muted-foreground">Manage contact form submissions</p>
                </div>
                <div className="p-4 space-y-2 rounded-lg bg-accent/50">
                  <h3 className="font-medium">Content</h3>
                  <p className="text-sm text-muted-foreground">Edit services, portfolio, and blog</p>
                </div>
                <div className="p-4 space-y-2 rounded-lg bg-accent/50">
                  <h3 className="font-medium">Marketing</h3>
                  <p className="text-sm text-muted-foreground">Track ad campaigns and conversions</p>
                </div>
                <div className="p-4 space-y-2 rounded-lg bg-accent/50">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">Send campaigns and newsletters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}