import React from 'react';

const HeartMindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M11.72 19.34A6.5 6.5 0 0 0 12 21.5a6.5 6.5 0 0 0 10-5.4c0-3.3-2.5-5.9-5.1-8.2a.7.7 0 0 0-1 0C13.2 10.2 11 12.8 11 16.1a6.3 6.3 0 0 0 .72 3.24Z" />
    <path d="M6 13.5a6.5 6.5 0 1 1 11.2-5.3" />
    <path d="M4 10.5a6.5 6.5 0 1 1 11.2-5.3" />
    <path d="m4.5 10.5 1.5 1.5" />
    <path d="m6 9 1.5 1.5" />
  </svg>
);

export default HeartMindIcon;
