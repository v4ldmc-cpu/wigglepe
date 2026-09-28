import React from 'react';
import { UserProfile } from '../types';
import { WiggleLogo } from './WiggleLogo';
import { CONDITION_DETAILS } from '../data/routines';
import { Volume2, VolumeX, Eye, Type, Settings, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderBarProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenProfileModal: () => void;
  onOpenConditionSelector: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenProfileModal,
  onOpenConditionSelector,
}) => {
  const currentCondition = CONDITION_DETAILS[userProfile.condition];

  const cycleFontSize = () => {
    const nextSize =
      userProfile.fontSize === 'normal'
        ? 'large'
        : userProfile.fontSize === 'large'
        ? 'xlarge'
        : 'normal';
    onUpdateProfile({ fontSize: nextSize });
  };

  const toggleHighContrast = () => {
    onUpdateProfile({ highContrast: !userProfile.highContrast });
  };

  const toggleVoice = () => {
    onUpdateProfile({ voiceGuide: !userProfile.voiceGuide });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-3 sm:px-4 py-2 transition-colors">
      {/* Top Utilities & Accessibility Row */}
      <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto mb-1">
        {/* User condition tag with quick switcher */}
        <button
          type="button"
          onClick={onOpenConditionSelector}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-all cursor-pointer shadow-xs"
          title="Toca para cambiar de perfil de movilidad"
        >
          <span className="text-sm">{currentCondition?.icon}</span>
          <span className="truncate max-w-[130px] sm:max-w-[180px]">
            {currentCondition?.name}
          </span>
          <RefreshCw className="w-3 h-3 text-slate-600" />
        </button>

        {/* Accessibility Tools: Font Size, High Contrast, Voice Narration */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Button */}
          <button
            type="button"
            onClick={cycleFontSize}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-0.5 cursor-pointer transition-colors ${
              userProfile.fontSize !== 'normal'
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Ajustar tamaño de letra para fácil lectura"
          >
            <Type className="w-3.5 h-3.5" />
            <span>
              {userProfile.fontSize === 'normal'
                ? 'A'
                : userProfile.fontSize === 'large'
                ? 'A+'
                : 'A++'}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`p-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
              userProfile.highContrast
                ? 'bg-slate-900 border-slate-900 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Modo Alto Contraste para máxima legibilidad"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Voice Guide Toggle */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
              userProfile.voiceGuide
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
            }`}
            title={
              userProfile.voiceGuide
                ? 'Voz guiada activada'
                : 'Voz guiada silenciada'
            }
          >
            {userProfile.voiceGuide ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* User Profile trigger */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 cursor-pointer"
            title="Ver tu perfil y estadísticas"
          >
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
              {userProfile.name.charAt(0).toUpperCase() || 'W'}
            </span>
            <span className="hidden sm:inline truncate max-w-[80px]">
              {userProfile.name}
            </span>
          </button>
        </div>
      </div>

      {/* Main Center Logo - Official Wiggle branding space */}
      <div className="flex flex-col items-center justify-center my-0.5">
        <WiggleLogo size="md" showUploadOption={true} interactive={true} />
        <p className="text-[11px] font-semibold text-slate-600 tracking-wide mt-0.5">
          Reactivación y Rehabilitación Dinámica de Miembros Inferiores
        </p>
      </div>
    </header>
  );
};
