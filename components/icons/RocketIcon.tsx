
import React from 'react';

const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.66-.05 1.32-.17 2-.38.68-.2 1.35-.5 2-.87.65-.38 1.3-.87 2-1.5.7-.63 1.3-1.4 2-2.3.7-1 1.3-2.1 2-3.3.66-1.2 1.2-2.5 1.6-4 .18-1-.3-2.3-1-3s-2-1.16-3-1c-1.2.18-2.5.76-4 1.6-1.1.7-2.3 1.3-3.3 2-.9.7-1.67 1.3-2.3 2-.63.7-1.12 1.3-1.5 2-.38.65-.7 1.32-.87 2-.2.68-.33 1.34-.38 2C6.8 14.2 5.34 14.8 4.5 16.5z" />
    <path d="m14 6 3.5 3.5" />
    <path d="M12 12 2 22" />
  </svg>
);

export default RocketIcon;
