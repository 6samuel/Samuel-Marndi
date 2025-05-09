interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <span className={`font-bold ${sizeClasses[size]} tracking-tighter ${className}`}>
      <span className="text-primary">S</span>
      <span className="text-gray-800 dark:text-gray-200">AMUEL</span>
      <span className="mx-1 text-primary">⚡</span>
      <span className="text-gray-800 dark:text-gray-200">MARNDI</span>
    </span>
  );
}