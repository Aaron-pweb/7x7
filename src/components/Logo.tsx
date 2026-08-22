import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 50"
      className={className}
      {...props}
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Playfair+Display:ital,wght@1,800&display=swap');
            
            .seven {
              font-family: 'Playfair Display', serif;
              font-weight: 800;
              font-style: italic;
              font-size: 28px;
              fill: #b03e28;
            }

            .journal {
              font-family: 'Montserrat', sans-serif;
              font-weight: 700;
              font-size: 18px;
              fill: #333333;
              letter-spacing: 2px;
            }
          `}
        </style>
      </defs>

      {/* The "7x7" Text First */}
      <text x="5" y="34" className="seven">
        7x7
      </text>

      {/* The "JOURNAL" Text Second */}
      <text x="65" y="34" className="journal">
        JOURNAL
      </text>
    </svg>
  );
}
