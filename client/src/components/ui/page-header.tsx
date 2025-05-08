import React from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  centered?: boolean;
  compact?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  centered = false,
  compact = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-primary/5 px-4 py-12 ${
        compact ? "py-8" : "py-16 md:py-20"
      } ${className}`}
    >
      <div className="container mx-auto">
        <div className={`space-y-4 ${centered ? "text-center" : ""}`}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center text-sm text-gray-500 mb-4">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-primary">
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-primary">
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${
              compact ? "text-2xl md:text-3xl" : ""
            }`}
          >
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 max-w-3xl mt-4 text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;