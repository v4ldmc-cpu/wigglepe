import React, { useState } from 'react';
import { UserProfile, UserCondition, AffectedLimb } from '../types';
import { WiggleLogo } from './WiggleLogo';
import { WiggyMascot } from './WiggyMascot';
import { CONDITION_DETAILS } from '../data/routines';
import { ChevronRight, ArrowLeft, Check, Sparkles, HeartPulse, User } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  initialProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 45);
  const [condition, setCondition] = useState<UserCondition>(
    initialProfile?.condition || 'ankle_fracture'
  );
  const [affectedLimb, setAffectedLimb] = useState<AffectedLimb>(
    initialProfile?.affectedLimb || 'Derecha'
  );
  const [painLevel, setPainLevel] = useState<number>(
    initialProfile?.painLevel ?? 3
  );
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    initialProfile?.primaryGoal || 'Recuperar movilidad y fuerza sin dolor'
  );
  const [isAdapting, setIsAdapting] = useState<boolean>(false);

  const conditionsList: { id: UserCondition; title: string; subtitle: string; icon: string; colorBorder: string; badgeColor: string }[] = [
    {
      id: 'wheelchair',
      title: 'Uso de Silla de Ruedas',
      subtitle: 'Ejercicios sentados para reactivar circulación, propiocepción de pies y dedos con Wiggle sin impacto.',
      icon: '🦽',
      colorBorder: 'border-blue-500 hover:border-blue-600 bg-blue-50/60',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'walker',
      title: 'Uso de Andador',
      subtitle: 'Ejercicios de transición sentado-parado, apoyo gradual de peso, equilibrio y destreza con almohadillas.',
      icon: '🦯',
      colorBorder: 'border-emerald-500 hover:border-emerald-600 bg-emerald-50/60',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'ankle_fracture',
      title: 'Recuperación por Fractura de Tobillo / Pie',
      subtitle: 'Dorsiflexión progresiva, descarga de peso controlada, juego de precisión de dedos y talón con cuadrantes.',
      icon: '🦶',
      colorBorder: 'border-amber-500 hover:border-amber-600 bg-amber-50/60',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'reduced_mobility',
      title: 'Otra condición / Movilidad reducida',
      subtitle: 'Adultos mayores, rigidez articular, post-operatorio o reactivación neuro-motriz suave a tu propio ritmo.',
      icon: '🌟',
      colorBorder: 'border-rose-500 hover:border-rose-600 bg-rose-50/60',
      badgeColor: 'bg-rose-600 text-white',
    },
  ];

  const handleFinish = () => {
    setIsAdapting(true);
    setTimeout(() => {
      const newProfile: UserProfile = {
        id: initialProfile?.id || 'user-' + Date.now(),
        name: name.trim() || 'Amigo Wiggle',
        age: Number(age) || 45,
        condition,
        affectedLimb,
        primaryGoal,
        painLevel,
        streakDays: initialProfile?.streakDays || 1,
        totalReps: initialProfile?.totalReps || 0,
        totalMinutes: initialProfile?.totalMinutes || 0,
        completedSessionsCount: initialProfile?.completedSessionsCount || 0,
        onboardingCompleted: true,
        fontSize: initialProfile?.fontSize || 'normal',
        highContrast: initialProfile?.highContrast || false,
        voiceGuide: initialProfile?.voiceGuide ?? true,
      };
      setIsAdapting(false);
      onComplete(newProfile);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-4 border-amber-100 my-auto text-slate-800 transition-all">
        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <WiggleLogo size="lg" interactive={true} />
          <p className="text-xs uppercase tracking-widest font-bold text-slate-600 mt-2">
            Rehabilitación Dinámica y Lúdica
          </p>
        </div>

        {/* Adapting Animation state */}
        {isAdapting ? (
          <div className="py-10 flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <WiggyMascot variant="head" size="sm" interactive={false} />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">
              Wiggy está preparando tu plan Wiggle...
            </h3>
            <p className="text-sm text-slate-600 max-w-xs">
              Calibrando repeticiones, descansos y cuadrantes sensoriales para{' '}
              <strong className="text-emerald-700">
                {CONDITION_DETAILS[condition]?.name}
              </strong>.
            </p>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping delay-75" />
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping delay-150" />
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping delay-200" />
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: User Profile & Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="bg-emerald-50/90 border-2 border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <WiggyMascot variant="head" size="sm" interactive={true} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>¡Bienvenido a Wiggle!</span>
                      <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Soy Wiggy 🐸🤠</span>
                    </h2>
                    <p className="text-xs text-emerald-900 mt-0.5">
                      Te guiaré paso a paso para reactivar tus piernas jugando y con seguridad médica desde Trujillo para todo el Perú.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    ¿Cómo te llamas o cómo te gustaría que te llamemos?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María o Don Carlos"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-base font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Edad (años)
                    </label>
                    <input
                      type="number"
                      min={6}
                      max={110}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pierna / Pie a rehabilitar
                    </label>
                    <select
                      value={affectedLimb}
                      onChange={(e) => setAffectedLimb(e.target.value as AffectedLimb)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-base bg-white"
                    >
                      <option value="Derecha">Pie Derecho</option>
                      <option value="Izquierda">Pie Izquierdo</option>
                      <option value="Ambas">Ambos Pies</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Continuar a Selección de Condición</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Mandatory Condition Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </button>
                  <span className="text-xs font-bold text-blue-600">
                    Paso Obligatorio
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Selecciona tu Tipo de Movilidad o Condición
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nuestra tecnología ajustará las rutinas, repeticiones y tiempos del dispositivo Wiggle a tu caso particular:
                  </p>
                </div>

                {/* 4 Conditions as requested */}
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {conditionsList.map((cond) => {
                    const isSelected = condition === cond.id;
                    return (
                      <div
                        key={cond.id}
                        onClick={() => setCondition(cond.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 text-left ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-400/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-3xl p-2 rounded-xl bg-white shadow-sm border border-slate-100 flex-shrink-0">
                          {cond.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-sm text-slate-900">
                              {cond.title}
                            </h3>
                            {isSelected && (
                              <span className="p-1 rounded-full bg-blue-600 text-white flex-shrink-0">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {cond.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Continuar a Evaluación de Dolor</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 3: Pain Level & Goal */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </button>
                  <span className="text-xs font-bold text-emerald-600">
                    Paso Final
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Nivel de molestia / dolor actual
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Esto nos permite empezar en un nivel de exigencia completamente seguro.
                  </p>
                </div>

                {/* Pain Slider with visual indicator */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">
                      Escala EVA (0 al 10)
                    </span>
                    <span
                      className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                        painLevel <= 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : painLevel <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {painLevel} / 10 -{' '}
                      {painLevel === 0
                        ? 'Sin dolor'
                        : painLevel <= 3
                        ? 'Leve / Manejable'
                        : painLevel <= 6
                        ? 'Moderado'
                        : 'Intenso'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 mt-2 font-medium">
                    <span>😊 0 Calma</span>
                    <span>😐 5 Molestia</span>
                    <span>😣 10 Fuerte</span>
                  </div>
                </div>

                {/* Primary Goal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ¿Cuál es tu meta primordial en esta etapa?
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Recuperar movilidad y flexión de tobillo',
                      'Caminar con mayor seguridad y equilibrio',
                      'Disminuir hinchazón y activar circulación',
                      'Volver a pisar con confianza sin dolor',
                    ].map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => setPrimaryGoal(goal)}
                        className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                          primaryGoal === goal
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        ✓ {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Guardar Perfil y Empezar Wiggle</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
