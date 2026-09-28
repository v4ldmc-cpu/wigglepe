import React, { useState } from 'react';
import { UserProfile, AffectedLimb } from '../types';
import { CONDITION_DETAILS } from '../data/routines';
import { User, X, Check, Award, Flame, Footprints, Clock, RotateCcw } from 'lucide-react';

interface UserProfileModalProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
  onResetOnboarding: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  onUpdate,
  onClose,
  onResetOnboarding,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [affectedLimb, setAffectedLimb] = useState<AffectedLimb>(userProfile.affectedLimb);
  const [painLevel, setPainLevel] = useState(userProfile.painLevel);
  const [primaryGoal, setPrimaryGoal] = useState(userProfile.primaryGoal);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      name: name.trim() || 'Usuario Wiggle',
      age: Number(age) || 45,
      affectedLimb,
      painLevel,
      primaryGoal,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const currentCondition = CONDITION_DETAILS[userProfile.condition];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-amber-100 shadow-2xl space-y-4 text-slate-800 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Perfil de Paciente
            </h2>
            <p className="text-xs text-slate-500">
              Condición: <strong className="text-blue-600">{currentCondition?.name}</strong>
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
          <div>
            <span className="text-[10px] text-slate-500 block">Racha</span>
            <span className="text-sm font-black text-amber-600">🔥 {userProfile.streakDays} d</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Repeticiones</span>
            <span className="text-sm font-black text-blue-600">{userProfile.totalReps}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Tiempo</span>
            <span className="text-sm font-black text-emerald-600">{userProfile.totalMinutes} min</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Edad</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Miembro</label>
              <select
                value={affectedLimb}
                onChange={(e) => setAffectedLimb(e.target.value as AffectedLimb)}
                className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
              >
                <option value="Derecha">Pie Derecho</option>
                <option value="Izquierda">Pie Izquierdo</option>
                <option value="Ambas">Ambos Pies</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">Molestia / Dolor (0-10)</label>
              <span className="font-extrabold text-blue-600">{painLevel} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Meta primordial</label>
            <input
              type="text"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Guardado correctamente' : 'Guardar Cambios'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('¿Deseas reiniciar el cuestionario inicial de bienvenida?')) {
                onResetOnboarding();
                onClose();
              }
            }}
            className="w-full py-2 text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar Cuestionario de Bienvenida</span>
          </button>
        </div>
      </div>
    </div>
  );
};
