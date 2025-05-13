import React from 'react';
import clsx from 'clsx';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    isActive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Kbd: React.FC<React.PropsWithChildren<KbdProps>> = ({ children, className, isActive, ...props }) => (
    <kbd
        className={clsx(
            "px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow", // Adjusted dark theme styling
            className, // Allow overriding styles
            // Add conditional class based on isActive
        )}
        {...props}
    >
        {children}
    </kbd>
);

export default Kbd;