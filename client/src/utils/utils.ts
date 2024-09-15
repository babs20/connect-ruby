import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanize(str: string): string {
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .toLowerCase() // Convert the rest to lowercase
    .replace(/^\w/, (char) => char.toUpperCase()); // Capitalize the first letter of the string
}
