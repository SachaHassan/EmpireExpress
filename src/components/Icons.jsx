import React from 'react';

// Common wrapper for SVGs
const IconWrapper = ({ children, className = '', size = 16, style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    fill="currentColor"
  >
    {children}
  </svg>
);

export const IconEnergy = (props) => (
  <IconWrapper {...props}>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
  </IconWrapper>
);

export const IconMaterial = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2.5L20 7V17L12 21.5L4 17V7L12 2.5ZM12 6L7 8.8V15.2L12 18L17 15.2V8.8L12 6ZM12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z" />
  </IconWrapper>
);

export const IconScience = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.95 7.06 4.57 11 4.07V19.93ZM13 4.07C16.94 4.57 20 7.95 20 12C20 16.05 16.94 19.43 13 19.93V4.07ZM14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12Z" />
  </IconWrapper>
);

export const IconPrestige = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </IconWrapper>
);

export const IconConstruct = (props) => (
  <IconWrapper {...props}>
    <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM12 3L5 10H9V16H15V10H19L12 3Z" />
  </IconWrapper>
);

export const IconRecycle = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2.5C7.36 2.5 3.5 6.36 3.5 11C3.5 13.25 4.38 15.3 5.82 16.82L7.23 15.41C6.1 14.28 5.5 12.72 5.5 11C5.5 7.42 8.42 4.5 12 4.5V2.5ZM20.5 11C20.5 13.32 19.56 15.42 18.06 16.94L16.64 15.53C17.77 14.4 18.5 12.78 18.5 11C18.5 7.41 15.58 4.5 12 4.5V7L7.5 3.5L12 0V2.5C16.69 2.5 20.5 6.31 20.5 11ZM12 21.5V19L16.5 22.5L12 26V23.5C7.31 23.5 3.5 19.69 3.5 15H5.5C5.5 18.58 8.42 21.5 12 21.5Z" viewBox="0 0 24 26" />
  </IconWrapper>
);

export const IconPlayer = (props) => (
  <IconWrapper {...props}>
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
  </IconWrapper>
);

export const IconBot = (props) => (
  <IconWrapper {...props}>
    <path d="M19 6H17V4C17 2.9 16.1 2 15 2H9C7.9 2 7 2.9 7 4V6H5C3.9 6 3 6.9 3 8V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V8C21 6.9 20.1 6 19 6ZM15 4V6H9V4H15ZM19 18H5V8H19V18ZM7 10H11V14H7V10ZM13 10H17V14H13V10Z" />
  </IconWrapper>
);

export const IconFactory = (props) => (
  <IconWrapper {...props}>
    <path d="M22 10V22H2V10L12 5L22 10ZM12 7.2L6 10.2V19.8H9V14H15V19.8H18V10.2L12 7.2ZM12 16.8V19.8H15V16.8H12ZM9 16.8V19.8H6V16.8H9Z" />
  </IconWrapper>
);

export const IconEye = (props) => (
  <IconWrapper {...props}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" />
  </IconWrapper>
);

export const IconBook = (props) => (
  <IconWrapper {...props}>
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM8 6H16V8H8V6ZM8 10H16V12H8V10ZM8 14H16V16H8V14Z" />
  </IconWrapper>
);
