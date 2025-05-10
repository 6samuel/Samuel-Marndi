import { useState, useEffect } from "react";
import { useAuth, LoginData } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const { user, loginMutation } = useAuth();
  const [location, navigate] = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginData) {
    loginMutation.mutate(data);
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Samuel Marndi</title>
        <meta name="description" content="Secure admin panel login for Samuel Marndi's website management." />
      </Helmet>
      
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <span className="font-bold text-3xl tracking-tighter">
                <span className="text-primary">S</span>
                <span className="text-gray-800 dark:text-gray-200">AMUEL</span>
                <span className="mx-1 text-primary">⚡</span>
                <span className="text-gray-800 dark:text-gray-200">MARNDI</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to manage your website
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            type="text" 
                            {...field} 
                          />
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
                          <Input 
                            placeholder="Enter your password" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-xs text-gray-500 text-center mt-2">
                This is a secured area. Unauthorized access will be monitored and logged.
              </p>
            </CardFooter>
          </Card>
          
          <div className="text-center mt-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}