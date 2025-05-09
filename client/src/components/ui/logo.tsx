import logoDarkMode from "@assets/Samuel Marndi.png";
import logoLightMode from "@assets/samuel marndi logo for light bg.png";
import logoText from "@assets/Samuel Marndi Logo text.png";
import logoIcon from "@assets/s.png";
import { OptimizedImage } from "./optimized-image";
import { useTheme } from "next-themes";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "full" | "icon" | "text";
}

export function Logo({ size = "md", className = "", variant = "full" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const sizeClasses = {
    sm: "h-9",
    md: "h-12",
    lg: "h-16",
  };

  if (variant === "icon") {
    return (
      <div className={`${className}`}>
        <OptimizedImage
          src={logoIcon}
          alt="Samuel Marndi Logo"
          className={`${sizeClasses[size]} w-auto object-contain`}
          width={32}
          height={32}
        />
      </div>
    );
  }
  
  if (variant === "text") {
    return (
      <div className={`${className}`}>
        <OptimizedImage
          src={logoText}
          alt="Samuel Marndi Logo"
          className={`${sizeClasses[size]} w-auto object-contain`}
          width={150}
          height={40}
        />
      </div>
    );
  }

  // Default full logo with theme-based selection
  return (
    <div className={`${className}`}>
      <OptimizedImage
        src={isDark ? logoDarkMode : logoLightMode}
        alt="Samuel Marndi Logo"
        className={`${sizeClasses[size]} w-auto object-contain`}
        width={180}
        height={50}
      />
    </div>
  );
}