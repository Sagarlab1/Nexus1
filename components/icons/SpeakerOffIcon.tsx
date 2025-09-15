import React from 'react';

// FIX: Added React import and component definition to fix module and reference errors.
const SpeakerOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.5 13.5c0 .6.1 1.2.4 1.8m2.6-2.6a6.4 6.4 0 0 1-1.2 3.8" />
    <path d="M18.5 13.5a6.47 6.47 0 0 1-5.2 5.2" />
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3" />
    <path d="M9 9v3a3 3 0 0 0 5.1 2.6" />
    <path d="M19 10v2a7 7 0 0 1-7 7" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default SpeakerOffIcon;
