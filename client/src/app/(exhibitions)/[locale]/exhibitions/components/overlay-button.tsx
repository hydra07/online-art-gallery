import { ButtonHTMLAttributes, ReactNode } from 'react';

interface OverlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function OverlayButton({ children, className, ...props }: OverlayButtonProps) {
  return (
    <button
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}