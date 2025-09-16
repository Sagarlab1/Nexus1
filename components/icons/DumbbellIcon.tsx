
import React from 'react';

const DumbbellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M4 8H6V16H4zM18 8H20V16H18z" />
    <path d="M6 12H18" />
    <path d="M2 10H4V14H2z" />
    <path d="M20 10H22V14H20z" />
  </svg>
);

export default DumbbellIcon;