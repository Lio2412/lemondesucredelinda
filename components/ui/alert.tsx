import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

// Définition des styles de variante
const variantStyles = {
  default: 'bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:text-blue-300',
  destructive: 'bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-300',
  success: 'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-300'
};

export function Alert({ children, variant = 'default', className, ...props }: AlertProps) {
  return (
    <div 
      className={cn(
        'flex p-4 mb-4 text-sm rounded-lg',
        variantStyles[variant],
        className
      )} 
      role="alert" 
      {...props}
    >
      {children}
    </div>
  );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function AlertDescription({ children, className, ...props }: AlertDescriptionProps) {
  return (
    <p className={cn("font-bold", className)} {...props}>
      {children}
    </p>
  );
}