import React from 'react';

interface StretchDollIconProps {
  size?: number;
  className?: string;
  id?: string;
}

export default function StretchDollIcon({ size = 24, className = "", id }: StretchDollIconProps) {
  return (
    <svg
      id={id}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Head - elevated representing a proud, healthy posture */}
      <circle cx="12" cy="4" r="1.8" />
      
      {/* Spinal Arch / Torso - elegant curved line representing lean flexibility */}
      <path d="M12 5.8 Q11.3 10 12 14" />
      
      {/* Arm 1: Graceful overhead stretch reaching up and outward */}
      <path d="M12 7.5 Q15.5 6 17.5 3" />
      
      {/* Arm 2: Counterbalancing arm sweeping down to maximize lateral chest expand */}
      <path d="M12 7.5 Q9 9.5 6.5 13" />
      
      {/* Leg 1: Right leg stretching in alignment */}
      <path d="M12 14 Q14.5 16.5 16 21" />
      
      {/* Leg 2: Left leg flexed and supporting posture */}
      <path d="M12 14 Q9.5 16 8 21" />
      
      {/* Subtle, beautiful floor anchor curve to ground the stretching figure */}
      <path d="M6 21.5 Q12 22.5 18 21.5" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
