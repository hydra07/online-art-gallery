'use client'
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";

// Define props with more customization options
interface CustomDropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
    className?: string;
}

// Separate component for the dropdown content to optimize rendering
const DropdownContent = memo(({ 
    children, 
    isOpen, 
    setIsOpen, 
    align = 'right',
    width = 'w-60',
    parentRect,
    triggerRef
}: { 
    children: React.ReactNode; 
    isOpen: boolean; 
    setIsOpen: (state: boolean) => void;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
    parentRect: DOMRect | null;
    triggerRef: React.RefObject<HTMLDivElement>;
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<React.CSSProperties | null>(null);
    
    // Calculate position based on alignment
    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return null;
        
        // Get current trigger position
        const currentRect = triggerRef.current.getBoundingClientRect();
        
        const style: React.CSSProperties = {
            position: 'fixed',  // Changed to fixed to better handle scrolling
            top: `${currentRect.bottom + 8}px`,
        };

        if (align === 'left') {
            style.left = `${currentRect.left}px`;
        } else if (align === 'right') {
            style.right = `${window.innerWidth - currentRect.right}px`;
        } else {
            style.left = `${currentRect.left + currentRect.width/2}px`;
            style.transform = 'translateX(-50%)';
        }

        return style;
    }, [align, triggerRef]);

    // Set initial position and handle scroll updates
    useEffect(() => {
        if (!isOpen) return;
        
        const updatePosition = () => {
            setPosition(calculatePosition());
        };
        
        // Set initial position
        updatePosition();
        
        // Add scroll and resize listeners
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, calculatePosition]);
    
    useEffect(() => {
        if (!isOpen) return;
        
        // Handle click outside
        const handleClickOutside = (e: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        
        // Handle escape key
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen || !position) return null;

    // Only create portal if we're client-side
    return createPortal(
        <div
            ref={contentRef}
            style={position}
            className={`${typeof width === 'string' ? width : `w-[${width}px]`} bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in-50 duration-100`}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
        >
            {children}
        </div>,
        document.body
    );
});

DropdownContent.displayName = 'DropdownContent';

const CustomDropdown = ({ 
    trigger, 
    children, 
    align = 'right',
    width = 'w-60',
    className = ''
}: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
    
    const handleToggle = useCallback(() => {
        if (!isOpen && triggerRef.current) {
            // Update position when opening
            setTriggerRect(triggerRef.current.getBoundingClientRect());
        }
        setIsOpen(prev => !prev);
    }, [isOpen]);

    return (
        <div className={`relative ${className}`}>
            <div 
                ref={triggerRef}
                onClick={handleToggle}
                className="inline-flex cursor-pointer"
                role="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {trigger}
            </div>
            
            <DropdownContent 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
                align={align}
                width={width}
                parentRect={triggerRect}
                triggerRef={triggerRef}
            >
                {children}
            </DropdownContent>
        </div>
    );
};

export { CustomDropdown };
export default memo(CustomDropdown);