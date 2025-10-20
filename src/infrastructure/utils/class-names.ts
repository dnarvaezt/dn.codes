import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const classNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Alias común usado por shadcn/ui
export const cn = (...inputs: ClassValue[]) => classNames(...inputs)
