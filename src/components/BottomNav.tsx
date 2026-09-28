import React from 'react';
import {
  Activity,
  Flame,
  HeartHandshake,
  Users,
  MapPin,
} from 'lucide-react';
import { WiggyMascot } from './WiggyMascot';

export type NavTab =
  | 'sessions'
  | 'progress'
  | 'wiggy'
  | 'testimonials'
  | 'community'
  | 'contact';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    colorActive: string;
    bgActive: string;
  }[] = [
    {
      id: 'sessions',
      label: 'Sesiones',
      icon: <Activity className="w-5 h-5" />,
      colorActive: 'text-blue-700',
      bgActive: 'bg-blue-100',
    },
    {
      id: 'progress',
      label: 'Progresión',
      icon: <Flame className="w-5 h-5" />,
      colorActive: 'text-amber-700',
      bgActive: 'bg-amber-100',
    },
    {
      id: 'wiggy',
      label: 'Wiggy 🐸',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <WiggyMascot variant="head" size="xs" interactive={false} />
        </div>
      ),
      colorActive: 'text-emerald-800',
      bgActive: 'bg-emerald-100',
    },
    {
      id: 'testimonials',
      label: 'Historias',
      icon: <HeartHandshake className="w-5 h-5" />,
      colorActive: 'text-emerald-700',
      bgActive: 'bg-emerald-100',
    },
    {
      id: 'community',
      label: 'Comunidad',
      icon: <Users className="w-5 h-5" />,
      colorActive: 'text-purple-700',
      bgActive: 'bg-purple-100',
    },
    {
      id: 'contact',
      label: 'Ubicación',
      icon: <MapPin className="w-5 h-5" />,
      colorActive: 'text-rose-700',
      bgActive: 'bg-rose-100',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-1 sm:px-4 py-1.5 transition-colors">
      <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-3 rounded-2xl transition-all cursor-pointer select-none ${
                isActive
                  ? `${tab.colorActive} ${tab.bgActive} font-extrabold scale-105 shadow-2xs`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'wiggy' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
