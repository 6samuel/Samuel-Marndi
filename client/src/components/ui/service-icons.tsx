import React from 'react';
import { 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Layers, 
  BarChart, 
  Search, 
  Share2, 
  Mail, 
  MessageSquare, 
  Users, 
  Server,
  CloudCog,
  PenTool,
  Cpu,
  Lock,
  Link,
  LineChart,
  ShoppingCart
} from 'lucide-react';

export type IconName = 
  | 'Code' 
  | 'Database' 
  | 'Smartphone' 
  | 'Globe' 
  | 'Layers' 
  | 'BarChart' 
  | 'Search' 
  | 'Share2'
  | 'Mail'
  | 'MessageSquare'
  | 'Users'
  | 'Server'
  | 'CloudCog'
  | 'PenTool'
  | 'Cpu'
  | 'Lock'
  | 'Link'
  | 'LineChart'
  | 'ShoppingCart';

interface IconWrapperProps {
  name: IconName;
  className?: string;
  size?: number;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  name, 
  className = "w-6 h-6", 
  size = 24 
}) => {
  const iconProps = { className, size };
  
  switch (name) {
    case 'Code':
      return <Code {...iconProps} />;
    case 'Database':
      return <Database {...iconProps} />;
    case 'Smartphone':
      return <Smartphone {...iconProps} />;
    case 'Globe':
      return <Globe {...iconProps} />;
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'BarChart':
      return <BarChart {...iconProps} />;
    case 'Search':
      return <Search {...iconProps} />;
    case 'Share2':
      return <Share2 {...iconProps} />;
    case 'Mail':
      return <Mail {...iconProps} />;
    case 'MessageSquare':
      return <MessageSquare {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'Server':
      return <Server {...iconProps} />;
    case 'CloudCog':
      return <CloudCog {...iconProps} />;
    case 'PenTool':
      return <PenTool {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'Lock':
      return <Lock {...iconProps} />;
    case 'Link':
      return <Link {...iconProps} />;
    case 'LineChart':
      return <LineChart {...iconProps} />;
    case 'ShoppingCart':
      return <ShoppingCart {...iconProps} />;
    default:
      return <Code {...iconProps} />;
  }
};

export const ServiceIconBox: React.FC<{
  name: IconName;
  title: string;
  description: string;
  className?: string;
}> = ({ name, title, description, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ${className}`}>
      <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
        <IconWrapper name={name} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export const AnimatedServiceIcons: React.FC<{
  serviceType: string;
  className?: string;
}> = ({ serviceType, className = "" }) => {
  // Define different icon sets for different service types
  const getIconSet = (): IconName[] => {
    switch (serviceType) {
      case 'web-development':
        return ['Code', 'Database', 'Globe', 'Layers', 'Server', 'Lock'];
      case 'app-development':
        return ['Smartphone', 'Cpu', 'Database', 'Lock', 'Users', 'CloudCog'];
      case 'digital-marketing':
        return ['BarChart', 'Search', 'Share2', 'Mail', 'LineChart', 'Globe'];
      case 'ui-ux-design':
        return ['PenTool', 'Layers', 'Smartphone', 'Globe', 'Users', 'Share2'];
      case 'e-commerce':
        return ['ShoppingCart', 'Globe', 'Database', 'Lock', 'BarChart', 'Search'];
      case 'ai-integration':
        return ['Cpu', 'Database', 'BarChart', 'Globe', 'CloudCog', 'Link'];
      default:
        return ['Code', 'Database', 'Globe', 'Smartphone', 'BarChart', 'Search'];
    }
  };
  
  const icons = getIconSet();
  
  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-3 gap-3">
        {icons.map((icon, index) => (
          <div 
            key={icon} 
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-sm"
            style={{
              animation: `float ${2 + (index % 3)}s ease-in-out infinite alternate`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <IconWrapper name={icon} className="text-primary" />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}} />
    </div>
  );
};

export const TechStackGrid: React.FC<{
  tech: string[];
  className?: string;
}> = ({ tech, className = "" }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${className}`}>
      {tech.map((item, index) => (
        <div 
          key={index}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-lg text-center text-sm font-medium border border-gray-100 dark:border-gray-700"
        >
          {item}
        </div>
      ))}
    </div>
  );
};