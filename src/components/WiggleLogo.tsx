import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, Download, Upload, RotateCcw } from 'lucide-react';
import officialLogoImg from '../assets/images/wiggle-logo.png';

export interface WiggleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadOption?: boolean;
  className?: string;
  interactive?: boolean;
  animated?: boolean;
  animationMode?: 'gentle' | 'active' | 'party' | 'paused';
}

export const WiggleLogo: React.FC<WiggleLogoProps> = ({
  size = 'md',
  showUploadOption = false,
  className = '',
  interactive = true,
  animated = true,
  animationMode: initialMode = 'gentle',
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const [animationMode, setAnimationMode] = useState<'gentle' | 'active' | 'party' | 'paused'>(initialMode);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a soft cheerful chime on interaction if sound is enabled
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.36);
      });
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomLogoUrl(url);
    }
  };

  const sizeClasses = {
    sm: 'h-10 w-auto max-w-[130px]',
    md: 'h-16 sm:h-18 w-auto max-w-[210px]',
    lg: 'h-24 sm:h-28 w-auto max-w-[320px]',
    xl: 'h-32 sm:h-36 w-auto max-w-[420px]',
  };

  const triggerWiggleBurst = () => {
    if (!interactive) return;
    setIsWiggling(true);
    playChime();

    // Spawn playful sparkles around the logo
    const colors = ['#D84234', '#387BB0', '#EDA128', '#5E8C62', '#FDE68A'];
    const newSparkles = Array.from({ length: 8 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 12 + Math.random() * 12,
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 1100);

    setTimeout(() => {
      setIsWiggling(false);
    }, 850);
  };

  // Download official logo PNG
  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = customLogoUrl || officialLogoImg;
    link.download = 'logo-oficial-wiggle.png';
    link.click();
  };

  // Determine active animation class
  const getAnimationClass = () => {
    if (isWiggling) return 'animate-wiggle-burst';
    if (!animated || animationMode === 'paused') return '';
    if (animationMode === 'party') return 'animate-wiggle-party';
    return 'animate-wiggle-gentle';
  };

  const currentLogoSrc = customLogoUrl || officialLogoImg;

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Animation Styles scoped for the logo image */}
      <style>{`
        @keyframes wiggle-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-3px) rotate(-1.8deg) scale(1.015, 0.985);
          }
          50% {
            transform: translateY(0px) rotate(0deg) scale(0.99, 1.01);
          }
          75% {
            transform: translateY(-2px) rotate(1.8deg) scale(1.01, 0.99);
          }
        }

        @keyframes wiggle-party {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          20% {
            transform: translateY(-6px) rotate(-3.5deg) scale(1.05, 0.95);
          }
          40% {
            transform: translateY(2px) rotate(3deg) scale(0.96, 1.04);
          }
          60% {
            transform: translateY(-5px) rotate(-2.5deg) scale(1.04, 0.97);
          }
          80% {
            transform: translateY(1px) rotate(2deg) scale(0.98, 1.02);
          }
        }

        @keyframes wiggle-burst {
          0% {
            transform: scale(1) rotate(0deg);
          }
          20% {
            transform: scale(1.12) rotate(-5deg);
          }
          40% {
            transform: scale(1.06) rotate(5deg);
          }
          60% {
            transform: scale(1.1) rotate(-3deg);
          }
          80% {
            transform: scale(1.04) rotate(2deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-wiggle-gentle {
          animation: wiggle-gentle 3.2s ease-in-out infinite;
          transform-origin: 50% 60%;
        }

        .animate-wiggle-party {
          animation: wiggle-party 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 50% 60%;
        }

        .animate-wiggle-burst {
          animation: wiggle-burst 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 50% 60%;
        }
      `}</style>

      {/* Main Logo Container */}
      <div
        onClick={triggerWiggleBurst}
        className="relative cursor-pointer group flex items-center justify-center py-1"
        title="Logo oficial Wiggle - Haz clic para hacerlo bailar!"
      >
        {/* Floating Sparkles on click */}
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="absolute pointer-events-none z-30 animate-ping"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              color: sp.color,
              fontSize: `${sp.size}px`,
              animationDuration: '0.8s',
            }}
          >
            ✦
          </span>
        ))}

        {/* The Exact Official Wiggle Logo Image */}
        <img
          src={currentLogoSrc}
          alt="Logo oficial Wiggle"
          className={`${sizeClasses[size]} object-contain drop-shadow-md transition-all duration-300 ${getAnimationClass()} hover:scale-105 active:scale-95`}
          loading="eager"
        />

        {/* If custom logo uploaded, button to revert to official logo */}
        {customLogoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCustomLogoUrl(null);
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            title="Restaurar logo oficial Wiggle"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls & Options Toolbar */}
      {showUploadOption && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Animation Mode Switcher */}
          <div className="inline-flex items-center gap-1 bg-amber-50/90 border border-amber-200 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-amber-900 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Animación:</span>
            <button
              type="button"
              onClick={() =>
                setAnimationMode(
                  animationMode === 'gentle' ? 'party' : animationMode === 'party' ? 'paused' : 'gentle'
                )
              }
              className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer ml-0.5"
              title="Alternar animación entre suave, fiesta o pausada"
            >
              {animationMode === 'gentle' ? 'Suave' : animationMode === 'party' ? '¡Fiesta!' : 'Pausada'}
            </button>
          </div>

          {/* Sound Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-blue-100 border-blue-300 text-blue-800 font-semibold'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Activar o desactivar sonido al tocar el logo"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3 text-blue-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
            <span>{soundEnabled ? 'Chime ON' : 'Chime'}</span>
          </button>

          {/* Download Official Image Button */}
          <button
            type="button"
            onClick={handleDownloadImage}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] text-slate-700 transition-colors cursor-pointer"
            title="Descargar imagen oficial del logo Wiggle"
          >
            <Download className="w-3 h-3 text-slate-600" />
            <span>Descargar PNG</span>
          </button>

          {/* User File Upload option */}
          <label className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full transition-colors border border-slate-200 text-[11px]">
            <Upload className="w-3 h-3 text-blue-600" />
            <span>Subir otra foto</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};
