import React from 'react';

export function SwissCross({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" fill={color} />
      <path
        d="M12 8v8M8 12h8"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}