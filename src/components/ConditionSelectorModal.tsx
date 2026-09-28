import React from 'react';
import { UserProfile, UserCondition } from '../types';
import { CONDITION_DETAILS } from '../data/routines';
import { X, Check } from 'lucide-react';

interface ConditionSelectorModalProps {
  currentCondition: UserCondition;
  onSelectCondition: (condition: UserCondition) => void;
  onClose: () => void;
}

export const ConditionSelectorModal: React.FC<ConditionSelectorModalProps> = ({
  currentCondition,
  onSelectCondition,
  onClose,
}) => {
  const conditions: { id: UserCondition; title: string; subtitle: string; icon: string }[] = [
    {
      id: 'wheelchair',
      title: 'Uso de Silla de Ruedas',
      subtitle: 'Ejercicios sentados para reactivar circulación, propiocepción de pies y dedos con Wiggle sin impacto.',
      icon: '🦽',
    },
    {
      id: 'walker',
      title: 'Uso de Andador',
      subtitle: 'Ejercicios de transición sentado-parado, apoyo gradual de peso, equilibrio y destreza con almohadillas.',
      icon: '🦯',
    },
    {
      id: 'ankle_fracture',
      title: 'Recuperación por Fractura de Tobillo / Pie',
      subtitle: 'Dorsiflexión progresiva, descarga de peso controlada, juego de precisión de dedos y talón con cuadrantes.',
      icon: '🦶',
    },
    {
      id: 'reduced_mobility',
      title: 'Otra condición / Movilidad reducida',
      subtitle: 'Adultos mayores, rigidez articular, post-operatorio o reactivación neuro-motriz suave a tu propio ritmo.',
      icon: '🌟',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-4 border-amber-200 shadow-2xl space-y-4 text-slate-800 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Cambiar Perfil de Movilidad
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Elige la condición física actual. El algoritmo Wiggle adaptará de inmediato los planes, repeticiones y cuadrantes sensoriales recomendados:
          </p>
        </div>

        <div className="space-y-2.5">
          {conditions.map((item) => {
            const isSelected = currentCondition === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCondition(item.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-400/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-3xl p-2 rounded-xl bg-white shadow-sm border border-slate-100 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900">
                      {item.title}
                    </h3>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-blue-600 text-white flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
