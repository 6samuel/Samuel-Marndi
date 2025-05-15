import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Code,
  Briefcase,
  FileText,
  Mail,
  Megaphone,
  ChartLine,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Quote,
  BarChart,
  Calendar,
  Target,
  GanttChart
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { Logo } from "@/components/ui/logo";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Add dark mode class directly to the document
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Clean up function to remove dark mode when component unmounts
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Services",
      href: "/admin/services",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "Portfolio",
      href: "/admin/portfolio",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Blog",
      href: "/admin/blog",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Testimonials",
      href: "/admin/testimonials",
      icon: <Quote className="h-5 w-5" />,
    },
    {
      title: "Consultations",
      href: "/admin/consultations",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Forms",
      href: "/admin/forms",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      title: "Campaigns",
      href: "/admin/campaigns",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      title: "Ad Trackers",
      href: "/admin/ad-trackers",
      icon: <ChartLine className="h-5 w-5" />,
    },
    {
      title: "Marketing Campaigns",
      href: "/admin/marketing-campaigns",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo size="sm" />
              </div>
              <span className="ml-2 text-xl font-semibold dark:text-gray-200">
                Admin
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === item.href
                      ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-2 lg:hidden">
              <div className="flex-shrink-0">
                <Logo size="sm" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" target="_blank">
                  View Site
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-16">
          {title && (
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className={title ? "px-6" : ""}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}