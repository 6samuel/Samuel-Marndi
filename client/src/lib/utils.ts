import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates initials from a name
 * @param name The full name to get initials from
 * @returns String with the first letter of each word in the name
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Formats a date to a readable format
 * @param date Date object or string to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Creates a URL friendly slug from a string
 * @param text The text to convert to a slug
 * @returns URL friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Generates a meta description from a longer text
 * Truncates the text to a maximum length and adds ellipsis if needed
 * @param text The full text to use as source
 * @param maxLength Maximum length of the description (default: 160 characters)
 * @returns Truncated text suitable for meta description
 */
export function getMetaDescription(text: string, maxLength: number = 160): string {
  if (!text) return '';
  
  // Remove any HTML tags
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find a good breakpoint near the maxLength
  const truncated = cleanText.substring(0, maxLength);
  // Try to break at a sentence, then at a word
  const sentenceBreak = truncated.lastIndexOf('.');
  const wordBreak = truncated.lastIndexOf(' ');
  
  // Prefer sentence break if it's not too short, otherwise use word break
  const breakPoint = sentenceBreak > maxLength * 0.7 ? sentenceBreak + 1 : wordBreak;
  
  return cleanText.substring(0, breakPoint) + '...';
}

/**
 * Truncates text to specified length and adds ellipsis
 * @param text The text to truncate
 * @param length Maximum length of the truncated text (default: 100 characters)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number = 100): string {
  if (!text) return '';
  
  // Remove any HTML tags
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (cleanText.length <= length) {
    return cleanText;
  }
  
  // Find a good breakpoint near the length
  const truncated = cleanText.substring(0, length);
  const wordBreak = truncated.lastIndexOf(' ');
  
  return cleanText.substring(0, wordBreak) + '...';
}

/**
 * Calculate the estimated reading time for a given text
 * @param text The content text to analyze
 * @param wordsPerMinute Average reading speed in words per minute (default: 200)
 * @returns Formatted reading time string (e.g., "5 min read")
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): string {
  if (!text) return '1 min read';
  
  // Remove HTML tags if present
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Count words
  const words = cleanText.trim().split(/\s+/).length;
  
  // Calculate reading time
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
}

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Basic email validation using regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}