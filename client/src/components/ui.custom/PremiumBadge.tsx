export const PremiumBadge = ({ className = '' }) => {
    return (
      <div className={`relative ${className}`}>
        {/* Galaxy effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-galaxy-spin opacity-50 blur-sm" />
        
        {/* Crown icon */}
        <div className="relative z-10 p-1">
          <svg 
            className="w-4 h-4 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
          </svg>
        </div>
      </div>
    );
  };