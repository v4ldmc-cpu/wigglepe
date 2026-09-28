import React, { useState, useEffect, useRef } from 'react';
import { RoutineSession, UserProfile } from '../types';
import { WiggleDeviceInteractive } from './WiggleDeviceInteractive';
import { WIGGLE_ZONES_INFO } from '../data/deviceZones';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import {
  playBtnClick,
  playSuccessChime,
  playWoodClick,
} from '../utils/soundEffects';

interface SessionRunnerModalProps {
  session: RoutineSession;
  userProfile: UserProfile;
  onClose: () => void;
  onFinish?: (
    session: RoutineSession,
    repsCompleted: number,
    minutesSpent: number
  ) => void;
  onFinishSession?: (
    session: RoutineSession,
    repsCompleted: number,
    minutesSpent: number
  ) => void;
}

export const SessionRunnerModal: React.FC<SessionRunnerModalProps> = ({
  session,
  userProfile,
  onClose,
  onFinish,
  onFinishSession,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [repsDone, setRepsDone] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(
    session.steps[0]?.durationSeconds || 30
  );
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(15);
  const [totalSessionReps, setTotalSessionReps] = useState(0);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebrationBadge, setShowCelebrationBadge] = useState(false);

  // Audio Voice Guide
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(
    userProfile.voiceGuide ?? true
  );
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakInstruction = (text: string) => {
    if (!voiceGuideEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      synthRef.current.speak(utterance);
    } catch {
      // Speech synthesis unsupported
    }
  };

  const totalSteps = session.steps.length;
  const currentStep = session.steps[currentStepIndex] || session.steps[0];

  // Announce step change
  useEffect(() => {
    if (currentStep) {
      setTimerSeconds(currentStep.durationSeconds);
      setRepsDone(0);
      setIsResting(false);
      speakInstruction(`${currentStep.title}. ${currentStep.audioPrompt}`);
    }
  }, [currentStepIndex]);

  // Main step timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isResting && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleStepTimeComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isResting, timerSeconds]);

  // Rest timer
  useEffect(() => {
    let restInterval: any = null;
    if (isResting && restSeconds > 0) {
      restInterval = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            handleRestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSeconds]);

  // Overall time tracker
  useEffect(() => {
    let tracker: any = null;
    if (isPlaying && !isCompleted) {
      tracker = setInterval(() => {
        setTotalSecondsSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(tracker);
  }, [isPlaying, isCompleted]);

  const handleStepTimeComplete = () => {
    const newReps = repsDone > 0 ? repsDone : currentStep.reps;
    setTotalSessionReps((prev) => prev + newReps);
    handleNextStepOrRest();
  };

  const handleNextStepOrRest = () => {
    playSuccessChime();
    if (currentStepIndex < totalSteps - 1) {
      setIsResting(true);
      setRestSeconds(15);
      speakInstruction('¡Excelente trabajo! Tómate 15 segundos para descansar, respirar y relajar tu pie.');
    } else {
      setIsCompleted(true);
      setShowCelebrationBadge(true);
      speakInstruction('¡Felicidades! Has completado tu sesión de rehabilitación interactiva con Wiggle.');
    }
  };

  const handleRestComplete = () => {
    setIsResting(false);
    setCurrentStepIndex((prev) => prev + 1);
  };

  const incrementRep = () => {
    playBtnClick();
    setRepsDone((prev) => {
      const next = prev + 1;
      setTotalSessionReps((t) => t + 1);
      if (next >= currentStep.reps) {
        handleNextStepOrRest();
      }
      return next;
    });
  };

  const handleDeviceAction = (actionType: string) => {
    // When the user performs an active action on the device during therapy
    incrementRep();
  };

  const handleFinalizeAndSave = () => {
    playSuccessChime();
    const minutes = Math.max(1, Math.round(totalSecondsSpent / 60));
    if (onFinish) onFinish(session, totalSessionReps, minutes);
    if (onFinishSession) onFinishSession(session, totalSessionReps, minutes);
    onClose();
  };

  // Progress percentage
  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + (repsDone / currentStep.reps)) / totalSteps) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-4 sm:p-6 border-4 border-amber-200 text-slate-800 my-auto transition-all max-h-[96vh] flex flex-col justify-between overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃‍♂️</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                {session.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Paso {currentStepIndex + 1} de {totalSteps} • Sesión Interactiva
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setVoiceGuideEnabled(!voiceGuideEnabled);
                playBtnClick();
              }}
              className={`p-1.5 rounded-full border text-xs cursor-pointer transition-colors ${
                voiceGuideEnabled
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
              title={voiceGuideEnabled ? 'Voz guía activada' : 'Voz guía desactivada'}
            >
              {voiceGuideEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                playBtnClick();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-full cursor-pointer"
              title="Cerrar sesión"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Screen states */}
        {isCompleted ? (
          /* Completion Screen */
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-3xl shadow-inner animate-bounce">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                ¡Sesión Completada con Éxito!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">
                Has trabajado cada parte del dispositivo Wiggle con precisión y control motor.
              </p>
            </div>

            {/* Session Stats Badges */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-center">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-2xl font-black text-amber-700">
                  {totalSessionReps}
                </span>
                <p className="text-[11px] font-bold text-amber-900 mt-0.5">
                  Repeticiones Hechas
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                <span className="text-2xl font-black text-blue-700">
                  {Math.max(1, Math.round(totalSecondsSpent / 60))} min
                </span>
                <p className="text-[11px] font-bold text-blue-900 mt-0.5">
                  Tiempo Total
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalizeAndSave}
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-98"
            >
              Guardar Progreso y Continuar
            </button>
          </div>
        ) : isResting ? (
          /* Rest Break Screen */
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center text-2xl animate-pulse">
              🧘
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Pausa de Recuperación
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {restSeconds}s
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mt-1">
                Inhala suavemente y exhala. Relaja los músculos de tu pie y pantorrilla.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playBtnClick();
                handleRestComplete();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>Continuar al Siguiente Ejercicio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Active Interactive Exercise Step */
          <div className="space-y-3">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-0.5">
                <span>
                  Serie {currentStepIndex + 1} de {totalSteps}
                </span>
                <span className="text-blue-600 uppercase tracking-wider font-extrabold text-[11px]">
                  {session.level}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                {currentStep.title}
              </h2>
            </div>

            {/* Habilidad que trabaja y beneficio terapéutico */}
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-2.5 text-xs space-y-0.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <span>🎯</span>
                <span>Habilidad trabajada:</span>
                <span className="font-extrabold text-blue-800">
                  {currentStep.habilidadClave || WIGGLE_ZONES_INFO[currentStep.targetZone]?.habilidadClave}
                </span>
              </div>
              <p className="text-[11px] text-blue-900 leading-snug">
                {currentStep.therapeuticBenefit || WIGGLE_ZONES_INFO[currentStep.targetZone]?.therapeuticHelp}
              </p>
            </div>

            {/* REAL WIGGLE PRODUCT INTERACTIVE SIMULATOR */}
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200/90 p-2 flex flex-col items-center justify-center">
              <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentStep.zoneColor }} />
                <span>
                  Interactúa directamente con la pieza para sumar repeticiones:
                </span>
              </div>
              <WiggleDeviceInteractive
                activeZone={currentStep.targetZone}
                onZoneClick={() => incrementRep()}
                onActionComplete={handleDeviceAction}
                showLabels={false}
                compact={true}
                showDetailedInspector={false}
              />
            </div>

            {/* Clear instructions */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <p className="text-slate-800 font-medium leading-relaxed">
                👉 <strong className="text-slate-900">Cómo hacerlo:</strong> {currentStep.instruction}
              </p>
              <p className="text-emerald-800 text-[11px] font-medium">
                💡 <strong className="text-emerald-950">Consejo postural:</strong> {currentStep.focusTip}
              </p>
            </div>

            {/* Counter and Timer Row */}
            <div className="grid grid-cols-2 gap-2.5 items-center pt-1">
              {/* Repetition Counter */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-emerald-900">
                  Repeticiones Realizadas
                </span>
                <div className="flex items-center gap-1.5 my-0.5">
                  <span className="text-2xl font-black text-emerald-700">
                    {repsDone}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">
                    / {currentStep.reps}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={incrementRep}
                  className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-2xs cursor-pointer"
                >
                  +1 Repetición
                </button>
              </div>

              {/* Timer & Controls */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-amber-900">
                  Tiempo Sugerido
                </span>
                <span className="text-2xl font-black text-amber-700 my-0.5">
                  {timerSeconds}s
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    playBtnClick();
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Skip / Next button */}
        {!isCompleted && !isResting && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => {
                playBtnClick();
                handleNextStepOrRest();
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Saltar este paso ⏭️
            </button>
            <button
              type="button"
              onClick={() => {
                playBtnClick();
                handleStepTimeComplete();
              }}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
            >
              <span>Completar Serie</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
