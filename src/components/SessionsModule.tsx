import React, { useState } from 'react';
import { RoutineSession, UserProfile } from '../types';
import { ROUTINES_DATA, CONDITION_DETAILS } from '../data/routines';
import { WiggleDeviceInteractive } from './WiggleDeviceInteractive';
import { SessionRunnerModal } from './SessionRunnerModal';
import {
  Play,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  Info,
  Footprints,
  Flame,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SessionsModuleProps {
  userProfile: UserProfile;
  onFinishSession: (session: RoutineSession, reps: number, minutes: number) => void;
}

export const SessionsModule: React.FC<SessionsModuleProps> = ({
  userProfile,
  onFinishSession,
}) => {
  const [activeSession, setActiveSession] = useState<RoutineSession | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7);

  // Filter routines by user's condition
  const conditionRoutines = ROUTINES_DATA.filter(
    (r) => r.targetCondition === userProfile.condition
  );

  // Fallback to all if condition has none
  const displayedRoutines =
    conditionRoutines.length > 0 ? conditionRoutines : ROUTINES_DATA.slice(0, 2);

  const currentConditionMeta = CONDITION_DETAILS[userProfile.condition];

  const daysOfWeek = [
    { num: 1, name: 'Lun', done: true },
    { num: 2, name: 'Mar', done: true },
    { num: 3, name: 'Mié', done: true },
    { num: 4, name: 'Jue', done: false, isToday: true },
    { num: 5, name: 'Vie', done: false },
    { num: 6, name: 'Sáb', done: false },
    { num: 7, name: 'Dom', done: false },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Condition Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-amber-400/20 blur-lg" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentConditionMeta?.icon}</span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Plan Adaptado Wiggle
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            {currentConditionMeta?.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
            {currentConditionMeta?.description}
          </p>

          {/* Quick stats ribbon */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-4 text-xs font-semibold text-blue-200">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Racha: <strong className="text-white">{userProfile.streakDays} días seguidos</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>Reps acumuladas: <strong className="text-white">{userProfile.totalReps}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Plan Timeline */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Cronograma Semanal de Reactivación
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            3 de 7 sesiones completadas
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day.num;
            return (
              <button
                type="button"
                key={day.num}
                onClick={() => setSelectedDay(day.num)}
                className={`py-2 px-1 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                  day.done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : day.isToday
                    ? 'bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{day.name}</span>
                <span className="text-sm font-extrabold mt-0.5">
                  {day.done ? '✓' : day.num}
                </span>
                {day.done && (
                  <span className="text-[8px] text-emerald-700 font-bold mt-0.5">Listo</span>
                )}
                {day.isToday && (
                  <span className="text-[8px] text-amber-300 font-bold mt-0.5">Hoy</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Device Exploration */}
      <div className="bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs">
        <div className="mb-3">
          <h2 className="text-base font-bold text-amber-950 flex items-center gap-1.5">
            <span>🎯</span>
            <span>Dispositivo Wiggle Físico: Cuadrantes e Implementos</span>
          </h2>
          <p className="text-xs text-amber-900 mt-0.5">
            Familiarízate con las zonas de tu Wiggle. Toca cualquier cuadrante para escuchar el tono táctil.
          </p>
        </div>

        <WiggleDeviceInteractive showLabels={true} compact={false} showDetailedInspector={true} />

        {/* All Product Components & Therapeutic Skills Worked */}
        <div className="mt-4 pt-3 border-t border-amber-200/80">
          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🎯</span>
            <span>Elementos del Dispositivo Wiggle y Habilidades que Trabajas:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Amarillo */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>🟡 Almohadilla Amarilla</span>
                </div>
                <p className="text-[11px] text-amber-950 font-bold leading-snug">
                  Habilidad: Fuerza, movilidad y coordinación del pie y la pierna.
                </p>
                <p className="text-[11px] text-amber-900 mt-1 leading-snug">
                  Ejercicios destinados a fortalecer la musculatura plantar y de la pierna, mejorando el rango de flexión y el impulso para caminar.
                </p>
              </div>
            </div>

            {/* Verde */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>🟢 Almohadilla Verde</span>
                </div>
                <p className="text-[11px] text-emerald-950 font-bold leading-snug">
                  Habilidad: Equilibrio, control y adaptación al movimiento.
                </p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
                  Actividades que estimulan los reflejos propioceptivos, ayudando a que el pie se adapte con firmeza y seguridad a diferentes apoyos e inclinaciones.
                </p>
              </div>
            </div>

            {/* Azul */}
            <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-blue-950 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                  <span>🔵 Almohadilla Azul</span>
                </div>
                <p className="text-[11px] text-blue-950 font-bold leading-snug">
                  Habilidad: Motricidad, coordinación y control del pie.
                </p>
                <p className="text-[11px] text-blue-800 mt-1 leading-snug">
                  Ejercicios suaves para estimular la motricidad fina y la coordinación de movimientos del pie, especialmente en fases iniciales.
                </p>
              </div>
            </div>

            {/* Rojo Zigzag */}
            <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-rose-950 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                  <span>🔴 Almohadilla Roja (Circuito Zigzag)</span>
                </div>
                <p className="text-[11px] text-rose-950 font-bold leading-snug">
                  Habilidad: Precisión, coordinación, movilidad y control en zigzag.
                </p>
                <p className="text-[11px] text-rose-800 mt-1 leading-snug">
                  El usuario desliza la pieza móvil con el pie por el circuito guiado, trabajando precisión milimétrica y estabilidad articular.
                </p>
              </div>
            </div>

            {/* Base Giratoria */}
            <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                  <span>🔄</span>
                  <span>Base de Madera Giratoria</span>
                </div>
                <p className="text-[11px] text-amber-950 font-bold leading-snug">
                  Habilidad: Movilidad, coordinación, control y amplitud rotacional.
                </p>
                <p className="text-[11px] text-amber-900 mt-1 leading-snug">
                  Gira con movimientos controlados del pie para recuperar la amplitud de rotación (pronación/supinación) del tobillo y la rodilla.
                </p>
              </div>
            </div>

            {/* Arco con Cuadrados Azules Deslizantes */}
            <div className="bg-sky-100/70 border border-sky-300 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1">
                  <span>🪵</span>
                  <span>Arco con Cuadrados Azules</span>
                </div>
                <p className="text-[11px] text-sky-950 font-bold leading-snug">
                  Habilidad: Movilidad en curva, alcance y control de empuje.
                </p>
                <p className="text-[11px] text-sky-900 mt-1 leading-snug">
                  Los cuadrados azules ensartados en el arco se pasan de un lado a otro con el pie, trabajando la coordinación en trayectoria curva.
                </p>
              </div>
            </div>

            {/* Canasta Central y 3 Mini Saquitos */}
            <div className="bg-sky-50/90 border border-sky-200 rounded-xl p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1">
                  <span>🧺</span>
                  <span>Canasta Central y 3 Mini Saquitos</span>
                </div>
                <p className="text-[11px] text-sky-950 font-bold leading-snug">
                  Habilidad: Alcance, precisión, control del pie y prensión podal.
                </p>
                <p className="text-[11px] text-sky-900 mt-1 leading-snug">
                  Retiro y colocación de la canasta con el pie, más recolección y enceste de los 3 mini saquitos usando los dedos a modo de pinza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Sesiones Recomendadas para Ti
          </h2>
          <span className="text-xs text-slate-500">
            Basado en tu nivel de molestia: {userProfile.painLevel}/10
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRoutines.map((routine, idx) => (
            <div
              key={routine.id}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                    Nivel {routine.level}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{routine.estimatedMinutes} minutos</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {routine.subtitle}
                </p>

                {/* Focus on device */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Enfoque Wiggle: </span>
                  {routine.deviceFocus}
                </div>

                {/* Benefits */}
                <div className="mt-2.5 space-y-1">
                  {routine.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                      <span className="text-emerald-500">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Session CTA Button */}
              <button
                type="button"
                onClick={() => setActiveSession(routine)}
                className="mt-5 w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar Sesión Guiada</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Session Modal Runner */}
      {activeSession && (
        <SessionRunnerModal
          session={activeSession}
          userProfile={userProfile}
          onClose={() => setActiveSession(null)}
          onFinishSession={onFinishSession}
        />
      )}
    </div>
  );
};
