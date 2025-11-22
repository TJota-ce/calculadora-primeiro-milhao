import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Container with subtle opacity */}
      <rect width="100" height="100" rx="24" fill="currentColor" className="opacity-10" />
      
      {/* Growth Bars */}
      <path 
        d="M28 72V52" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        className="opacity-60"
      />
      <path 
        d="M50 72V40" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        className="opacity-80"
      />
      <path 
        d="M72 72V24" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Success Indicator Dot */}
      <circle cx="72" cy="24" r="5" fill="currentColor" />
    </svg>
  );
};