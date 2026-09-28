import React, { useState } from 'react';

interface WiggyMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'avatar';
  variant?: 'full' | 'head' | 'badge' | 'avatar';
  interactive?: boolean;
  className?: string;
  speaking?: boolean;
  onMascotClick?: () => void;
}

export const WiggyMascot: React.FC<WiggyMascotProps> = ({
  size = 'md',
  variant = 'full',
  interactive = true,
  className = '',
  speaking = false,
  onMascotClick,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsWiggling(true);
    if (onMascotClick) onMascotClick();
    setTimeout(() => setIsWiggling(false), 900);
  };

  // Size configurations
  const dimensions = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    avatar: 'w-10 h-10',
    md: 'w-20 h-24 sm:w-24 sm:h-28',
    lg: 'w-32 h-40 sm:w-36 sm:h-44',
    xl: 'w-44 h-56 sm:w-52 sm:h-64',
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      } ${isWiggling ? 'animate-bounce' : ''} ${className}`}
      title="Wiggy - La Ranita Fisioterapeuta Oficial de Wiggle"
    >
      {/* Speech ripple if speaking */}
      {speaking && (
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping -z-10" />
      )}

      {variant === 'head' || variant === 'avatar' ? (
        /* Head & Cowboy Hat Avatar View (Ideal for chat bubbles & small indicators) */
        <svg
          viewBox="0 0 100 100"
          className={size === 'avatar' || size === 'xs' || size === 'sm' ? dimensions[size] : 'w-10 h-10'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular frame background */}
          <circle cx="50" cy="50" r="48" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="3" />

          {/* Frog Head */}
          <ellipse cx="50" cy="62" rx="34" ry="24" fill="#759966" />
          {/* Lighter jaw / chin */}
          <ellipse cx="50" cy="66" rx="26" ry="17" fill="#B9CEAA" />

          {/* Left Eye & Socket */}
          <circle cx="34" cy="48" r="14" fill="#759966" />
          <circle cx="34" cy="48" r="11" fill="#1C1917" />
          <circle cx="37" cy="44" r="3.5" fill="#FFFFFF" />
          <circle cx="32" cy="51" r="1.5" fill="#FFFFFF" />

          {/* Right Eye & Socket */}
          <circle cx="66" cy="48" r="14" fill="#759966" />
          <circle cx="66" cy="48" r="11" fill="#1C1917" />
          <circle cx="69" cy="44" r="3.5" fill="#FFFFFF" />
          <circle cx="64" cy="51" r="1.5" fill="#FFFFFF" />

          {/* Frog Smile */}
          <path
            d="M 36 67 Q 50 75 64 67"
            stroke="#3F5A33"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Nostril Dots */}
          <circle cx="47" cy="59" r="1.2" fill="#557547" />
          <circle cx="53" cy="59" r="1.2" fill="#557547" />

          {/* Cute Rosy Freckles */}
          <circle cx="32" cy="63" r="1" fill="#4B663C" opacity="0.6" />
          <circle cx="35" cy="62" r="1.2" fill="#4B663C" opacity="0.6" />
          <circle cx="65" cy="62" r="1.2" fill="#4B663C" opacity="0.6" />
          <circle cx="68" cy="63" r="1" fill="#4B663C" opacity="0.6" />

          {/* Red Cowboy Hat (Official Wiggle Mascot Hat) */}
          <g transform="translate(0, -3)">
            {/* Shadow under brim */}
            <path
              d="M 12 36 C 22 28 78 28 88 36 C 82 42 18 42 12 36 Z"
              fill="#7F1D1D"
              opacity="0.5"
            />
            {/* Cowboy Hat Crown */}
            <path
              d="M 32 30 C 31 16 35 10 44 14 C 47 15 53 15 56 14 C 65 10 69 16 68 30 Z"
              fill="#DC2626"
            />
            {/* Crown Center Crease indent */}
            <path
              d="M 44 14 Q 50 20 56 14 Q 51 25 50 30"
              stroke="#991B1B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Crown highlights */}
            <path
              d="M 37 18 C 39 15 42 15 44 16"
              stroke="#FCA5A5"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wide Curved Hat Brim */}
            <path
              d="M 8 36 C 14 26 34 26 50 27 C 66 26 86 26 92 36 C 94 42 78 40 50 40 C 22 40 6 42 8 36 Z"
              fill="#B91C1C"
            />
            <path
              d="M 12 35 C 24 29 76 29 88 35"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hat Band */}
            <path
              d="M 32 30 C 38 32 62 32 68 30 C 68 33 32 33 32 30 Z"
              fill="#7F1D1D"
            />
          </g>
        </svg>
      ) : (
        /* Full Body Mascot: Standing Green Frog with Red Cowboy Hat, Open Arms, and Green Heart Cowboy Boots! */
        <svg
          viewBox="0 0 200 240"
          className={`${dimensions[size]} filter drop-shadow-md`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ground Shadow */}
          <ellipse cx="100" cy="228" rx="55" ry="8" fill="#CBD5E1" opacity="0.6" />

          {/* Left Leg */}
          <path
            d="M 80 148 L 76 182 L 84 182 L 88 148 Z"
            fill="#759966"
            stroke="#5D7E50"
            strokeWidth="1.5"
          />

          {/* Right Leg */}
          <path
            d="M 120 148 L 124 182 L 116 182 L 112 148 Z"
            fill="#759966"
            stroke="#5D7E50"
            strokeWidth="1.5"
          />

          {/* LEFT GREEN COWBOY BOOT with heart */}
          <g id="left-boot">
            {/* Boot heel & sole */}
            <path d="M 68 224 L 88 224 L 86 228 L 68 228 Z" fill="#1C3822" />
            <path d="M 68 224 L 68 218 L 74 218 L 74 224 Z" fill="#24472B" />
            {/* Boot foot & curved toe */}
            <path
              d="M 68 214 L 75 198 L 86 198 L 94 214 L 102 222 C 104 225 100 226 95 225 L 72 225 C 68 224 67 218 68 214 Z"
              fill="#2E5A35"
              stroke="#1C3822"
              strokeWidth="1.5"
            />
            {/* Boot shaft */}
            <path
              d="M 72 174 C 77 172 84 172 88 175 L 86 202 L 72 202 Z"
              fill="#386A41"
              stroke="#1C3822"
              strokeWidth="1.5"
            />
            {/* Cowboy boot embroidered HEART (♡) */}
            <path
              d="M 80 182 C 78 180 75 181 75 184 C 75 188 80 192 80 192 C 80 192 85 188 85 184 C 85 181 82 180 80 182 Z"
              stroke="#C4E5B8"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Boot decorative stitching loops */}
            <path
              d="M 77 177 Q 80 175 83 177"
              stroke="#A3D494"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="80" cy="195" r="0.8" fill="#C4E5B8" />
          </g>

          {/* RIGHT GREEN COWBOY BOOT with heart */}
          <g id="right-boot">
            {/* Boot heel & sole */}
            <path d="M 112 224 L 132 224 L 132 228 L 112 228 Z" fill="#1C3822" />
            <path d="M 126 224 L 126 218 L 132 218 L 132 224 Z" fill="#24472B" />
            {/* Boot foot & curved toe */}
            <path
              d="M 106 222 C 104 225 108 226 114 225 L 132 225 C 136 224 137 218 136 214 L 130 198 L 118 198 L 112 214 Z"
              fill="#2E5A35"
              stroke="#1C3822"
              strokeWidth="1.5"
            />
            {/* Boot shaft */}
            <path
              d="M 114 175 C 118 172 125 172 130 174 L 130 202 L 116 202 Z"
              fill="#386A41"
              stroke="#1C3822"
              strokeWidth="1.5"
            />
            {/* Cowboy boot embroidered HEART (♡) */}
            <path
              d="M 122 182 C 120 180 117 181 117 184 C 117 188 122 192 122 192 C 122 192 127 188 127 184 C 127 181 124 180 122 182 Z"
              stroke="#C4E5B8"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Boot decorative stitching loops */}
            <path
              d="M 119 177 Q 122 175 125 177"
              stroke="#A3D494"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="122" cy="195" r="0.8" fill="#C4E5B8" />
          </g>

          {/* Main Pear-shaped Frog Torso */}
          <path
            d="M 80 92 C 68 108 66 142 82 154 C 92 160 108 160 118 154 C 134 142 132 108 120 92 Z"
            fill="#759966"
            stroke="#5D7E50"
            strokeWidth="2"
          />

          {/* Light Olive-Cream Belly Contour */}
          <path
            d="M 86 98 C 76 112 76 140 88 148 C 96 153 104 153 112 148 C 124 140 124 112 114 98 Z"
            fill="#B9CEAA"
          />

          {/* LEFT ARM & HAND (Spread warmly, open hand) */}
          <g id="left-arm">
            <path
              d="M 74 100 Q 45 110 32 98 Q 28 96 26 99 Q 34 116 68 118"
              fill="#759966"
              stroke="#5D7E50"
              strokeWidth="1.5"
            />
            {/* 4 Webbed Froggy Fingers in welcoming gesture */}
            <circle cx="24" cy="98" r="3.2" fill="#759966" />
            <circle cx="21" cy="103" r="3" fill="#759966" />
            <circle cx="24" cy="108" r="3" fill="#759966" />
            <circle cx="29" cy="111" r="2.8" fill="#759966" />
          </g>

          {/* RIGHT ARM & HAND (Spread warmly, open hand) */}
          <g id="right-arm">
            <path
              d="M 126 100 Q 155 110 168 98 Q 172 96 174 99 Q 166 116 132 118"
              fill="#759966"
              stroke="#5D7E50"
              strokeWidth="1.5"
            />
            {/* 4 Webbed Froggy Fingers in welcoming gesture */}
            <circle cx="176" cy="98" r="3.2" fill="#759966" />
            <circle cx="179" cy="103" r="3" fill="#759966" />
            <circle cx="176" cy="108" r="3" fill="#759966" />
            <circle cx="171" cy="111" r="2.8" fill="#759966" />
          </g>

          {/* Frog Head */}
          <ellipse cx="100" cy="74" rx="36" ry="24" fill="#759966" stroke="#5D7E50" strokeWidth="1.5" />
          {/* Lower Jaw Highlight */}
          <ellipse cx="100" cy="79" rx="27" ry="17" fill="#B9CEAA" />

          {/* Big Glossy Frog Eyes */}
          {/* Left Eye */}
          <circle cx="82" cy="60" r="16" fill="#759966" />
          <circle cx="82" cy="60" r="12" fill="#18181B" />
          <circle cx="85" cy="56" r="4.2" fill="#FFFFFF" />
          <circle cx="79" cy="63" r="1.8" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="118" cy="60" r="16" fill="#759966" />
          <circle cx="118" cy="60" r="12" fill="#18181B" />
          <circle cx="121" cy="56" r="4.2" fill="#FFFFFF" />
          <circle cx="115" cy="63" r="1.8" fill="#FFFFFF" />

          {/* Friendly Frog Smile */}
          <path
            d="M 85 80 Q 100 88 115 80"
            stroke="#3F5A33"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nostrils */}
          <circle cx="97" cy="72" r="1.2" fill="#4B663C" />
          <circle cx="103" cy="72" r="1.2" fill="#4B663C" />

          {/* Subtle Freckles */}
          <circle cx="80" cy="75" r="1" fill="#4B663C" opacity="0.6" />
          <circle cx="83" cy="74" r="1.2" fill="#4B663C" opacity="0.6" />
          <circle cx="117" cy="74" r="1.2" fill="#4B663C" opacity="0.6" />
          <circle cx="120" cy="75" r="1" fill="#4B663C" opacity="0.6" />

          {/* RED COWBOY HAT (Official Wiggle Mascot) */}
          <g id="cowboy-hat">
            {/* Shadow under hat brim */}
            <ellipse cx="100" cy="46" rx="55" ry="8" fill="#7F1D1D" opacity="0.4" />

            {/* Hat Crown Base & Crease */}
            <path
              d="M 76 38 C 74 20 78 12 90 16 C 94 18 106 18 110 16 C 122 12 126 20 124 38 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="2"
            />
            {/* Pinched Center Crease indent */}
            <path
              d="M 90 16 Q 100 24 110 16 Q 102 30 100 38"
              stroke="#991B1B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Crown lighting highlight */}
            <path
              d="M 82 22 Q 86 17 91 19"
              stroke="#FCA5A5"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Curved Wide Hat Brim */}
            <path
              d="M 45 44 C 55 30 80 32 100 33 C 120 32 145 30 155 44 C 160 52 135 50 100 50 C 65 50 40 52 45 44 Z"
              fill="#B91C1C"
              stroke="#7F1D1D"
              strokeWidth="2"
            />
            {/* Top brim highlight rim */}
            <path
              d="M 52 42 C 68 34 132 34 148 42"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hat Band with Buckle */}
            <path
              d="M 75 38 C 85 41 115 41 125 38 C 125 41 75 41 75 38 Z"
              fill="#7F1D1D"
            />
          </g>
        </svg>
      )}
    </div>
  );
};
