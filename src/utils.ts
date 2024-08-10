import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const getRedirectURL = (path: string) => {
  return `${window.location.origin}${path}`;
};

