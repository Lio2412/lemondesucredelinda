import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = React.forwardRef<
  HTMLDivElement, 
  React.ComponentProps<"nav"> 
>(({ className, ...props }, ref) => (
  <nav
    ref={ref} 
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
));
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLDivElement, 
  React.ComponentProps<"div"> 
>(({ className, ...props }, ref) => (
  <div
    ref={ref} 
    className={cn("flex items-center justify-center gap-2", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLDivElement, 
  React.ComponentProps<"div"> 
>(({ className, ...props }, ref) => (
  <div
    ref={ref} 
    className={cn("flex items-center justify-center", className)}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = React.forwardRef<
  HTMLAnchorElement, 
  PaginationLinkProps 
>(({ isActive, disabled, size, onClick, ...props }, ref) => (
  <a
    ref={ref} 
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
    }}
    tabIndex={disabled ? -1 : 0}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement, 
  ButtonProps 
>(({ className, ...props }, ref) => (
  <button
    ref={ref} 
    type="button"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:text-gray-400",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </button>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLButtonElement, 
  ButtonProps 
>(({ className, ...props }, ref) => (
  <button
    ref={ref} 
    type="button"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:text-gray-400",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </button>
));
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = React.forwardRef<
  HTMLButtonElement, 
  ButtonProps 
>(({ className, ...props }, ref) => (
  <button
    ref={ref} 
    type="button"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:text-gray-400",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
  </button>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
