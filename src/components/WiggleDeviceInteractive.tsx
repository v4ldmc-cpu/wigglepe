import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  Footprints,
  Layers,
  Activity,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import productImg from '../assets/images/wiggle-product.jpg';
import { WIGGLE_ZONES_INFO, WiggleZoneDetail } from '../data/deviceZones';
import {
  playWoodClick,
  playCushionTap,
  playPuckSlide,
  playBasketAction,
  playSaquitoAction,
  playArchBlockSlide,
  playSuccessChime,
  isSoundMuted,
  setSoundMuted,
} from '../utils/soundEffects';

export interface WiggleDeviceInteractiveProps {
  activeZone?: 'amarillo' | 'verde' | 'azul' | 'rojo' | 'base_giratoria' | 'canasta' | 'mini_saquitos' | 'arco' | string | null;
  onZoneClick?: (zone: string) => void;
  onActionComplete?: (actionType: string) => void;
  showLabels?: boolean;
  compact?: boolean;
  interactiveMode?: boolean;
  stepType?: 'touch' | 'rotate_base' | 'zigzag_track' | 'basket_action' | 'saquitos_action';
  highlightInstruction?: string;
  showDetailedInspector?: boolean;
}

export const WiggleDeviceInteractive: React.FC<WiggleDeviceInteractiveProps> = ({
  activeZone = null,
  onZoneClick,
  onActionComplete,
  showLabels = true,
  compact = false,
  interactiveMode = true,
  stepType = 'touch',
  highlightInstruction,
  showDetailedInspector = true,
}) => {
  // Device Interactive State
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>(activeZone || 'verde');
  const [isBasketRemoved, setIsBasketRemoved] = useState<boolean>(false);
  const [saquitosInBasket, setSaquitosInBasket] = useState<number>(3); // 3 units
  const [puckStep, setPuckStep] = useState<number>(0); // 0 to 4 in zigzag
  const [archBlockStep, setArchBlockStep] = useState<number>(0); // 0 to 5 across wooden arch
  const [archDirection, setArchDirection] = useState<'forward' | 'backward'>('forward');
  const [muted, setMutedState] = useState<boolean>(isSoundMuted());
  const [recentAnimation, setRecentAnimation] = useState<string | null>(null);

  // Sync activeZone prop
  useEffect(() => {
    if (activeZone) {
      setSelectedZone(activeZone);
    }
  }, [activeZone]);

  const toggleSound = () => {
    const next = !muted;
    setMutedState(next);
    setSoundMuted(next);
  };

  // 1. ROTATE BASE ACTION
  const handleRotateBase = (direction: 'cw' | 'ccw', degrees = 45) => {
    setIsRotating(true);
    playWoodClick();
    const delta = direction === 'cw' ? degrees : -degrees;
    setRotationDegrees((prev) => (prev + delta) % 360);
    setRecentAnimation('rotate');
    setSelectedZone('base_giratoria');
    if (onZoneClick) onZoneClick('base_giratoria');
    if (onActionComplete) onActionComplete('rotate_base');

    setTimeout(() => {
      setIsRotating(false);
      setRecentAnimation(null);
    }, 450);
  };

  // 2. TOUCH CUSHION ACTION
  const handleTouchCushion = (zone: 'amarillo' | 'verde' | 'azul' | 'rojo' | 'arco') => {
    setSelectedZone(zone);
    setRecentAnimation(zone);
    playCushionTap(zone);
    if (onZoneClick) onZoneClick(zone);
    if (onActionComplete) onActionComplete(`touch_${zone}`);

    setTimeout(() => {
      setRecentAnimation(null);
    }, 500);
  };

  // 3. ZIGZAG PUCK SLIDE ACTION
  const handleSlidePuck = (stepIndex?: number) => {
    const next = stepIndex !== undefined ? stepIndex : (puckStep + 1) % 5;
    setPuckStep(next);
    setSelectedZone('rojo');
    setRecentAnimation('rojo_puck');
    playPuckSlide();
    if (onZoneClick) onZoneClick('rojo');

    if (next === 4) {
      playSuccessChime();
      if (onActionComplete) onActionComplete('zigzag_completed');
    }

    setTimeout(() => setRecentAnimation(null), 400);
  };

  // 4. BASKET REMOVE / PLACE ACTION
  const handleToggleBasket = () => {
    const nextState = !isBasketRemoved;
    setIsBasketRemoved(nextState);
    setSelectedZone('canasta');
    playBasketAction(nextState ? 'remove' : 'place');
    setRecentAnimation(nextState ? 'basket_out' : 'basket_in');
    if (onZoneClick) onZoneClick('canasta');
    if (onActionComplete) onActionComplete(nextState ? 'basket_removed' : 'basket_placed');

    setTimeout(() => setRecentAnimation(null), 600);
  };

  // 5. SAQUITOS (3 UNITS) ACTIONS
  const handleTakeSaquito = () => {
    if (saquitosInBasket > 0) {
      const next = saquitosInBasket - 1;
      setSaquitosInBasket(next);
      setSelectedZone('mini_saquitos');
      playSaquitoAction();
      setRecentAnimation('saquito_take');
      if (onZoneClick) onZoneClick('mini_saquitos');
      if (next === 0 && onActionComplete) onActionComplete('saquitos_all_taken');
      setTimeout(() => setRecentAnimation(null), 500);
    }
  };

  const handlePlaceSaquito = () => {
    if (saquitosInBasket < 3) {
      const next = saquitosInBasket + 1;
      setSaquitosInBasket(next);
      setSelectedZone('mini_saquitos');
      playSaquitoAction();
      setRecentAnimation('saquito_place');
      if (onZoneClick) onZoneClick('mini_saquitos');
      if (next === 3) {
        playSuccessChime();
        if (onActionComplete) onActionComplete('saquitos_all_placed');
      }
      setTimeout(() => setRecentAnimation(null), 500);
    }
  };

  // 6. SLIDE BLUE SQUARES ACROSS WOODEN ARCH (Cuadrados azules del arco de madera)
  const handleSlideArchBlock = (stepIndex?: number) => {
    let next: number;
    let nextDir = archDirection;
    if (stepIndex !== undefined) {
      next = stepIndex;
    } else {
      if (archDirection === 'forward') {
        if (archBlockStep >= 5) {
          next = 4;
          nextDir = 'backward';
        } else {
          next = archBlockStep + 1;
          if (next === 5) nextDir = 'backward';
        }
      } else {
        if (archBlockStep <= 0) {
          next = 1;
          nextDir = 'forward';
        } else {
          next = archBlockStep - 1;
          if (next === 0) nextDir = 'forward';
        }
      }
    }

    setArchBlockStep(next);
    setArchDirection(nextDir);
    setSelectedZone('arco');
    setRecentAnimation('arch_block');
    playArchBlockSlide();
    if (onZoneClick) onZoneClick('arco');
    if (next === 5 || next === 0) {
      playSuccessChime();
      if (onActionComplete) onActionComplete('arch_slide_completed');
    }
    setTimeout(() => setRecentAnimation(null), 400);
  };

  const currentDetail: WiggleZoneDetail =
    WIGGLE_ZONES_INFO[selectedZone] ||
    (selectedZone === 'almohadillas' ? WIGGLE_ZONES_INFO.mini_saquitos : null) ||
    (selectedZone === 'canastilla' ? WIGGLE_ZONES_INFO.canasta : null) ||
    WIGGLE_ZONES_INFO.verde;

  // Zigzag positions along the red path (Cuadrante Rojo en la parte inferior)
  const zigzagCoords = [
    { x: '42%', y: '65%' }, // Paso 1 (Inicio de la pista roja)
    { x: '47%', y: '71%' }, // Paso 2 (Curva inferior)
    { x: '52%', y: '64%' }, // Paso 3 (Curva superior)
    { x: '56%', y: '71%' }, // Paso 4 (Curva inferior)
    { x: '60%', y: '67%' }, // Paso 5 (Extremo de la pista roja)
  ];

  // Coordenadas exactas a lo largo de la curvatura del arco de madera real
  // Desde la base inferior-izquierda (anclaje azul) pasando por la cúspide sobre la canasta hasta la base superior-derecha (anclaje azul)
  const archBlockCoords = [
    { x: '24%', y: '75%', angle: -52 }, // 1. Base inferior-izquierda del arco
    { x: '29%', y: '56%', angle: -42 }, // 2. Subiendo por el arco
    { x: '38%', y: '37%', angle: -24 }, // 3. Curva media izquierda
    { x: '52%', y: '23%', angle: 6 },   // 4. Cúspide superior del arco (sobre la canasta)
    { x: '65%', y: '21%', angle: 26 },  // 5. Curva descendente hacia la derecha
    { x: '76%', y: '29%', angle: 46 },  // 6. Base superior-derecha del arco
  ];

  return (
    <div className={`flex flex-col items-center justify-center select-none w-full ${compact ? 'p-1' : 'p-2 sm:p-4'}`}>
      {/* Top Interactive Status & Audio Toggle */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dispositivo Real Wiggle</span>
          <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">
            (Base giratoria, 4 cuadrantes, canasta y 3 mini saquitos)
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
            muted ? 'bg-slate-100 text-slate-500 border-slate-300' : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
          title={muted ? 'Activar sonido de piezas' : 'Silenciar'}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
          <span>{muted ? 'Sin sonido' : 'Sonido ON'}</span>
        </button>
      </div>

      {/* Main Interactive Product Frame */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border-4 border-amber-200/80 transition-all ${
          compact ? 'w-full max-w-[360px] aspect-video' : 'w-full max-w-[560px] aspect-[16/9]'
        }`}
      >
        {/* ROTATING BASE WRAPPER - Exact Real Product Image Rotates Smoothly */}
        <div
          className="w-full h-full relative flex items-center justify-center transition-transform duration-500 ease-out origin-center"
          style={{ transform: `rotate(${rotationDegrees}deg)` }}
        >
          {/* Authentic Real Product Photograph */}
          <img
            src={productImg}
            alt="Dispositivo físico Wiggle real para terapia y rehabilitación de miembros inferiores"
            className="w-full h-full object-cover object-center pointer-events-none drop-shadow-md select-none"
            loading="eager"
          />

          {/* INTERACTIVE HOTSPOTS OVERLAY ALIGNED WITH REAL PIECES */}
          {/* 1. Yellow Cushion (Almohadilla Amarilla - Izquierda) */}
          <button
            type="button"
            onClick={() => handleTouchCushion('amarillo')}
            className={`absolute top-[28%] left-[21%] w-[20%] h-[32%] rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
              selectedZone === 'amarillo'
                ? 'bg-amber-400/40 ring-4 ring-amber-300 ring-offset-2 ring-offset-amber-500 scale-105 shadow-lg'
                : 'hover:bg-amber-400/25 active:scale-95'
            }`}
            title="🟡 Almohadilla Amarilla: Fuerza, movilidad y coordinación del pie y la pierna"
          >
            <span className="opacity-0 hover:opacity-100 transition-opacity bg-amber-950/80 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              Amarillo
            </span>
          </button>

          {/* 2. Green Cushion (Almohadilla Verde - Arriba) */}
          <button
            type="button"
            onClick={() => handleTouchCushion('verde')}
            className={`absolute top-[14%] left-[34%] w-[33%] h-[26%] rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
              selectedZone === 'verde'
                ? 'bg-emerald-400/40 ring-4 ring-emerald-300 ring-offset-2 ring-offset-emerald-600 scale-105 shadow-lg'
                : 'hover:bg-emerald-400/25 active:scale-95'
            }`}
            title="🟢 Almohadilla Verde: Equilibrio, control y adaptación al movimiento"
          >
            <span className="opacity-0 hover:opacity-100 transition-opacity bg-emerald-950/80 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              Verde
            </span>
          </button>

          {/* 3. Blue Cushion (Almohadilla Azul - Derecha) */}
          <button
            type="button"
            onClick={() => handleTouchCushion('azul')}
            className={`absolute top-[26%] left-[58%] w-[22%] h-[36%] rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
              selectedZone === 'azul'
                ? 'bg-blue-400/40 ring-4 ring-blue-300 ring-offset-2 ring-offset-blue-600 scale-105 shadow-lg'
                : 'hover:bg-blue-400/25 active:scale-95'
            }`}
            title="🔵 Almohadilla Azul: Motricidad, coordinación y control de los movimientos del pie"
          >
            <span className="opacity-0 hover:opacity-100 transition-opacity bg-blue-950/80 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              Azul
            </span>
          </button>

          {/* 4. Red Cushion & Zigzag Maze (Almohadilla Roja - Abajo) */}
          <div
            onClick={() => handleTouchCushion('rojo')}
            className={`absolute top-[55%] left-[34%] w-[34%] h-[25%] rounded-full cursor-pointer transition-all duration-200 ${
              selectedZone === 'rojo'
                ? 'bg-rose-500/35 ring-4 ring-rose-300 ring-offset-2 ring-offset-rose-600 scale-105'
                : 'hover:bg-rose-500/20'
            }`}
            title="🔴 Almohadilla Roja: Circuito en zigzag para precisión, coordinación y control"
          >
            {/* Interactive Zigzag Puck (Pivote deslizante de madera) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSlidePuck();
              }}
              className="absolute w-7 h-7 sm:w-8 sm:h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EAD8B3] border-2 border-[#8B5A2B] shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                left: zigzagCoords[puckStep].x,
                top: zigzagCoords[puckStep].y,
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              }}
              title="Haz clic para deslizar la pieza por el zigzag con el pie"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#B88647]" />
            </div>
          </div>

          {/* 5. Central Basket Area (Canasta Central) */}
          <div
            onClick={() => {
              setSelectedZone('canasta');
              handleToggleBasket();
            }}
            className={`absolute top-[18%] left-[40%] w-[22%] h-[38%] rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
              isBasketRemoved ? 'opacity-30 border-2 border-dashed border-sky-300' : 'hover:scale-105'
            } ${selectedZone === 'canasta' ? 'ring-4 ring-sky-300' : ''}`}
            title="🧺 Canasta central con asa: Se retira y coloca con el pie"
          >
            {/* Visual indicator of basket state */}
            {isBasketRemoved && (
              <span className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
                Canasta Retirada
              </span>
            )}
          </div>

          {/* 6. Curved Wooden Arch & Sliding Blue Squares (Cuadrados Azules que se pasan por el arco) */}
          {/* Transparent hit area along the arch curve */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSlideArchBlock();
            }}
            className="absolute top-[16%] left-[20%] w-[60%] h-[64%] z-14 cursor-pointer"
            style={{
              clipPath: 'polygon(0% 100%, 25% 40%, 60% 0%, 95% 15%, 100% 35%, 70% 25%, 35% 65%, 15% 100%)',
            }}
            title="Toca a lo largo del arco de madera para pasar los cuadrados azules de un lado a otro"
          />

          {/* Primary Blue Square Block */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSlideArchBlock();
            }}
            className="absolute cursor-pointer transition-all duration-300 z-16 group"
            style={{
              left: archBlockCoords[archBlockStep].x,
              top: archBlockCoords[archBlockStep].y,
              transform: `translate(-50%, -50%) rotate(${archBlockCoords[archBlockStep].angle}deg)`,
            }}
            title="🟦 Cuadrados azules del arco: Toca para pasarlos de un lado a otro con el pie"
          >
            {/* Blue Square Block with inner circular cutout showing the wooden arch rod */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 hover:bg-blue-500 border-2 border-blue-200 shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ring-2 ring-blue-300">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EAD8B3] border border-[#8B5A2B] shadow-inner" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-950/95 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow whitespace-nowrap pointer-events-none">
              Pasar Cuadrado ({archBlockStep + 1}/6)
            </span>
          </div>

          {/* Secondary Blue Square Block (Traveling alongside/behind the first block) */}
          {(() => {
            const secondStep = archDirection === 'forward' 
              ? Math.max(0, archBlockStep - 1) 
              : Math.min(archBlockCoords.length - 1, archBlockStep + 1);
            if (secondStep === archBlockStep) return null;
            return (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlideArchBlock();
                }}
                className="absolute cursor-pointer transition-all duration-300 z-15 group pointer-events-auto opacity-90"
                style={{
                  left: archBlockCoords[secondStep].x,
                  top: archBlockCoords[secondStep].y,
                  transform: `translate(-50%, -50%) rotate(${archBlockCoords[secondStep].angle}deg)`,
                }}
                title="🟦 Segundo cuadrado azul deslizante"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500 hover:bg-blue-400 border-2 border-blue-100 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ring-1 ring-blue-200">
                  <div className="w-3 h-3 rounded-full bg-[#EAD8B3] border border-[#8B5A2B] shadow-inner" />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Removed Basket Tray (Appears outside if basket is taken out) */}
        {isBasketRemoved && (
          <div
            onClick={handleToggleBasket}
            className="absolute bottom-2 right-2 bg-slate-900/90 border-2 border-sky-400 p-2 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer animate-bounce z-20"
            title="Haz clic para volver a colocar la canasta en el centro"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white text-xs font-bold">
              🧺
            </div>
            <div className="text-left text-[11px] text-white">
              <p className="font-bold leading-none text-sky-300">Canasta en el suelo</p>
              <p className="text-[10px] text-slate-300">Toca para reinsertar con el pie</p>
            </div>
          </div>
        )}

        {/* Rotation Degrees Badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md">
          <RotateCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Giro: {rotationDegrees}°</span>
        </div>

        {/* 3 Mini Saquitos Badge inside or outside */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md">
          <span>👝</span>
          <span>Saquitos en canasta:</span>
          <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px]">
            {saquitosInBasket} / 3
          </span>
        </div>

        {/* Active Feedback Highlight Flash */}
        {recentAnimation && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <span className="text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-900/90 shadow-2xl border border-amber-300 animate-pulse">
              {recentAnimation === 'rotate' && '🔄 Base Girando con el pie'}
              {recentAnimation === 'amarillo' && '🟡 Almohadilla Amarilla Activa'}
              {recentAnimation === 'verde' && '🟢 Almohadilla Verde Activa'}
              {recentAnimation === 'azul' && '🔵 Almohadilla Azul Activa'}
              {recentAnimation === 'rojo' && '🔴 Circuito Zigzag Activo'}
              {recentAnimation === 'rojo_puck' && `🔴 Deslizando Zigzag: Paso ${puckStep + 1}/5`}
              {recentAnimation === 'arch_block' && `🪵 Cuadrado azul del arco: Paso ${archBlockStep + 1}/5`}
              {recentAnimation === 'basket_out' && '🧺 Canasta Retirada con el pie'}
              {recentAnimation === 'basket_in' && '🧺 Canasta Colocada con el pie'}
              {recentAnimation === 'saquito_take' && '👝 Saquito extraído con los dedos'}
              {recentAnimation === 'saquito_place' && '👝 Saquito encestado con los dedos'}
            </span>
          </div>
        )}
      </div>

      {/* INTERACTIVE CONTROLS BAR: Everything executable with 1-click */}
      <div className="w-full mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* 1. Base Rotation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <RotateCw className="w-4 h-4 text-amber-700" />
            <span>Base Giratoria (Movilidad con el pie):</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleRotateBase('ccw', 45)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95"
              title="Girar base hacia la izquierda con el pie"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>-45° Izq</span>
            </button>
            <button
              type="button"
              onClick={() => handleRotateBase('cw', 45)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95"
              title="Girar base hacia la derecha con el pie"
            >
              <span>+45° Der</span>
              <RotateCw className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              type="button"
              onClick={() => handleRotateBase('cw', 90)}
              className="px-2 py-1 rounded-lg bg-amber-100 border border-amber-300 hover:bg-amber-200 text-xs font-extrabold text-amber-900 shadow-2xs cursor-pointer active:scale-95"
              title="Giro amplio de 90°"
            >
              90°
            </button>
          </div>
        </div>

        {/* 2. Interactive Pieces Actions (Zigzag, Cuadrados del Arco, Canasta & 3 Mini Saquitos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {/* Zigzag Puck Step Button */}
          <button
            type="button"
            onClick={() => handleSlidePuck()}
            className="flex items-center justify-between p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 font-bold transition-all cursor-pointer active:scale-95"
            title="Mover la pieza deslizante por el circuito en zigzag"
          >
            <div className="flex items-center gap-1.5">
              <span>🔴</span>
              <span>Zigzag: {puckStep + 1}/5</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
          </button>

          {/* Sliding Blue Square on Arch Button */}
          <button
            type="button"
            onClick={() => handleSlideArchBlock()}
            className="flex items-center justify-between p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Pasar los cuadrados azules de un lado a otro del arco con el pie"
          >
            <div className="flex items-center gap-1.5">
              <span>🪵</span>
              <span>Cuadrados Arco: {archBlockStep + 1}/6</span>
            </div>
            <span className="text-[10px] font-black text-sky-700 underline">
              Pasar
            </span>
          </button>

          {/* Central Basket Toggle Button */}
          <button
            type="button"
            onClick={handleToggleBasket}
            className={`flex items-center justify-between p-2 rounded-xl border font-bold transition-all cursor-pointer active:scale-95 ${
              isBasketRemoved
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
            }`}
            title="Retirar o colocar la canasta central con el pie"
          >
            <div className="flex items-center gap-1.5">
              <span>🧺</span>
              <span>{isBasketRemoved ? 'Colocar Canasta' : 'Sacar Canasta'}</span>
            </div>
            <span className="text-[10px] font-black underline">
              {isBasketRemoved ? 'Insertar' : 'Retirar'}
            </span>
          </button>

          {/* 3 Mini Saquitos Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleTakeSaquito}
              disabled={saquitosInBasket <= 0}
              className="flex-1 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 border border-emerald-200 text-emerald-950 font-bold text-center cursor-pointer active:scale-95 transition-all text-[11px]"
              title="Sacar un saquito de la canasta con los dedos del pie"
            >
              Sacar ({saquitosInBasket})
            </button>
            <button
              type="button"
              onClick={handlePlaceSaquito}
              disabled={saquitosInBasket >= 3}
              className="flex-1 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-center cursor-pointer active:scale-95 transition-all text-[11px] shadow-2xs"
              title="Colocar un saquito dentro de la canasta con los dedos del pie"
            >
              + Encestar ({3 - saquitosInBasket})
            </button>
          </div>
        </div>

        {/* Quick Color Hotspot Tabs */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Zonas:</span>
          </span>
          {(['amarillo', 'verde', 'azul', 'rojo', 'arco', 'base_giratoria', 'canasta', 'mini_saquitos'] as const).map(
            (zid) => {
              const info = WIGGLE_ZONES_INFO[zid];
              const isSelected = selectedZone === zid;
              return (
                <button
                  key={zid}
                  type="button"
                  onClick={() => {
                    setSelectedZone(zid);
                    if (zid === 'base_giratoria') handleRotateBase('cw', 45);
                    else if (zid === 'rojo') handleSlidePuck();
                    else if (zid === 'arco') handleSlideArchBlock();
                    else if (zid === 'canasta') handleToggleBasket();
                    else if (zid === 'mini_saquitos') handlePlaceSaquito();
                    else handleTouchCushion(zid as any);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-105'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{info?.emoji}</span>
                  <span className="capitalize">{zid.replace('_', ' ')}</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* DETAILED CLINICAL INSPECTOR CARD - Focuses exclusively on skills & benefits */}
      {showDetailedInspector && currentDetail && (
        <div className="w-full mt-3 bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-4 shadow-sm transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentDetail.emoji}</span>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>{currentDetail.name}</span>
                </h4>
                <p className="text-[11px] font-bold text-blue-700">
                  {currentDetail.habilidadClave}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* Habilidad que trabaja y beneficio terapéutico */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5">
              <span className="font-bold text-blue-950 flex items-center gap-1 mb-0.5">
                <span>🎯</span>
                <span>En qué ayuda esta actividad en la terapia:</span>
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {currentDetail.therapeuticHelp}
              </p>
            </div>

            {/* Cómo realizar el ejercicio con el pie */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5">
              <span className="font-bold text-amber-950 flex items-center gap-1 mb-0.5">
                <span>🦶</span>
                <span>Cómo realizarlo con el pie:</span>
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {currentDetail.howToPerform}
              </p>
            </div>

            {/* Metas terapéuticas */}
            {currentDetail.clinicalGoals && currentDetail.clinicalGoals.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                  <span>✓</span>
                  <span>Objetivos terapéuticos trabajados:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                  {currentDetail.clinicalGoals.map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
