import React from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBreadcrumbs?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  showBreadcrumbs = false,
  className = '',
}: PageHeaderProps) {
  const [location] = useLocation();
  
  // Generate breadcrumb items from the current location
  const breadcrumbItems = React.useMemo(() => {
    if (!showBreadcrumbs) return [];
    
    const pathSegments = location.split('/').filter(Boolean);
    return [
      { label: 'Home', href: '/' },
      ...pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href,
        };
      }),
    ];
  }, [location, showBreadcrumbs]);

  return (
    <div className={`bg-gradient-to-r from-primary/5 to-primary/10 py-16 px-4 ${className}`}>
      <div className="container mx-auto max-w-5xl">
        {showBreadcrumbs && breadcrumbItems.length > 0 && (
          <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumbItems.map((item, index) => (
                <li key={item.href} className="inline-flex items-center">
                  {index === 0 ? (
                    <Link href={item.href} className="inline-flex items-center text-gray-700 hover:text-primary">
                      <Home className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                      {index === breadcrumbItems.length - 1 ? (
                        <span className="text-gray-500">{item.label}</span>
                      ) : (
                        <Link href={item.href} className="text-gray-700 hover:text-primary">
                          {item.label}
                        </Link>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}