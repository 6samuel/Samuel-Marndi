import { Link } from "wouter";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <span className={`font-bold ${sizeClasses[size]} tracking-tighter`}>
          <span className="text-primary">S</span>
          <span className="text-gray-800 dark:text-gray-200">AMUEL</span>
          <span className="mx-1 text-primary">⚡</span>
          <span className="text-gray-800 dark:text-gray-200">MARNDI</span>
        </span>
      </div>
    </Link>
  );
}