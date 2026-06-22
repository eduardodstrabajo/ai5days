import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

export default function FootPainIcon({ size = 16, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* simple foot silhouette */}
      <path d="M4 14c0-3 2-5 2-7 0-1.7 1.3-3 3-3 1.1 0 2.1.6 2.6 1.6.3.6.9 1 1.6 1h1c.6 0 1 .4 1 1v5c0 1.1-.9 2-2 2H8c-.6 0-2 .5-4 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* big toe with pain indicator */}
      <circle cx="7.5" cy="6" r="1.6" fill="#ff4d4f" />
      {/* small pain ripple */}
      <path d="M9.2 4.8c.6.6 1.1 1.4 1.1 2.2" stroke="#ff4d4f" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
