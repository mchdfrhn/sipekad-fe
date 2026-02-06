import React from "react";

const Logo = ({ className }) => {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="white" />
      <path
        d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20ZM50 70C38.9543 70 30 61.0457 30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70Z"
        fill="#4318FF"
      />
      <path
        d="M26 55C29 40 40 28 50 28C60 28 71 40 74 55"
        stroke="#4318FF"
        strokeWidth="0"
        fill="#4318FF"
      />
      {/* Crescent shape mimicking Horizon UI */}
      <path
        d="M50 27C34 27 24 38 22 50C22 36 34 24 50 24C66 24 78 36 78 50C76 38 66 27 50 27Z"
        fill="#4318FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 22C65.464 22 78 34.536 78 50C78 65.464 65.464 78 50 78C34.536 78 22 65.464 22 50C22 34.536 34.536 22 50 22ZM50 86C69.8823 86 86 69.8823 86 50C86 30.1177 69.8823 14 50 14C30.1177 14 14 30.1177 14 50C14 69.8823 30.1177 86 50 86Z"
        fill="white"
      />

      {/* Simple arc/moon shape for the center */}
      <path
        d="M28 60C32 45 40 38 50 38C60 38 68 45 72 60C68 50 60 45 50 45C40 45 32 50 28 60Z"
        fill="#4318FF"
      />
    </svg>
  );
};

export const HorizonLogo = ({ className }) => {
  return (
    <svg
      width="175"
      height="175"
      viewBox="0 0 175 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="175" height="175" rx="87.5" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M86.7417 38.0833C57.4086 38.0833 33.6333 61.8585 33.6333 91.1916H60.1916C60.1916 76.524 72.0837 64.6318 86.75 64.6318C101.416 64.6318 113.308 76.524 113.308 91.1916H139.867C139.867 61.8585 116.075 38.0833 86.7417 38.0833Z"
        fill="#4318FF"
      />
    </svg>
  );
};
export default HorizonLogo;
