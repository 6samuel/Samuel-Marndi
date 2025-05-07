import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function PageTitle({
  title,
  description,
  align = 'left',
  className = '',
}: PageTitleProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`bg-gradient-to-r from-primary/5 to-primary/10 py-16 px-4 ${className}`}>
      <div className={`container mx-auto max-w-5xl ${alignmentClasses[align]}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}