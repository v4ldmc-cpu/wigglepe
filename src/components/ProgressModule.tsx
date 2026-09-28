import React, { useState } from 'react';
import { UserProfile, ProgressPhoto, Badge } from '../types';
import {
  Flame,
  Award,
  TrendingUp,
  Camera,
  Plus,
  Share2,
  Calendar,
  Sparkles,
  CheckCircle,
  Footprints,
  Clock,
  HeartPulse,
} from 'lucide-react';

interface ProgressModuleProps {
  userProfile: UserProfile;
}

const DEFAULT_PHOTOS: ProgressPhoto[] = [
  {
    id: 'p1',
    date: '12 de Agosto',
    stage: 'Antes',
    angleDegrees: 12,
    notes: 'Inicio de rehabilitación: rigidez severa al intentar dorsiflexión. Apoyo con molestia.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p2',
    date: '05 de Septiembre',
    stage: 'En Proceso',
    angleDegrees: 24,
    notes: 'Semana 3 con Wiggle: el talón apoya en cojín azul sin dolor. Flexión más suave.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p3',
    date: '24 de Septiembre',
    stage: 'Después',
    angleDegrees: 38,
    notes: 'Progreso notable: +26 grados ganados, agarre completo de almohadillas amarillas.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  },
];

const BADGES_LIST: Badge[] = [
  {
    id: 'b1',
    title: 'Primeros 100 movimientos',
    description: 'Completaste 100 repeticiones en el dispositivo Wiggle.',
    icon: '🎯',
    unlocked: true,
    unlockedDate: 'Ayer',
    color: 'blue',
  },
  {
    id: 'b2',
    title: 'Constancia de Bronce',
    description: '3 días seguidos practicando con Wiggle.',
    icon: '🥉',
    unlocked: true,
    unlockedDate: 'Hace 2 días',
    color: 'yellow',
  },
  {
    id: 'b3',
    title: 'Maestro del Cuadrante',
    description: 'Exploraste los 4 cuadrantes sensoriales (Verde, Rojo, Azul, Amarillo).',
    icon: '🌈',
    unlocked: true,
    unlockedDate: 'Hoy',
    color: 'green',
  },
  {
    id: 'b4',
    title: 'Explorador de Flexión',
    description: 'Alcanzaste más de 25 grados de dorsiflexión activa.',
    icon: '📐',
    unlocked: true,
    unlockedDate: 'Esta semana',
    color: 'red',
  },
  {
    id: 'b5',
    title: 'Superación Wiggle',
    description: 'Completa 10 sesiones guiadas de rehabilitación.',
    icon: '🏆',
    unlocked: false,
    color: 'yellow',
  },
  {
    id: 'b6',
    title: 'Campeón de la Canastilla',
    description: 'Encesta 20 almohadillas con los dedos del pie.',
    icon: '🧺',
    unlocked: false,
    color: 'blue',
  },
];

export const ProgressModule: React.FC<ProgressModuleProps> = ({ userProfile }) => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem('wiggle_progress_photos');
    return saved ? JSON.parse(saved) : DEFAULT_PHOTOS;
  });

  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newStage, setNewStage] = useState<'Antes' | 'En Proceso' | 'Después'>('En Proceso');
  const [newAngle, setNewAngle] = useState(30);
  const [newNotes, setNewNotes] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [comparisonBeforeIndex, setComparisonBeforeIndex] = useState(0);
  const [comparisonAfterIndex, setComparisonAfterIndex] = useState(photos.length - 1);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSavePhoto = () => {
    const newEntry: ProgressPhoto = {
      id: 'photo-' + Date.now(),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
      stage: newStage,
      angleDegrees: Number(newAngle),
      notes: newNotes || 'Foto de evolución y postura con Wiggle.',
      imageUrl:
        newImageUrl ||
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    };
    const updated = [...photos, newEntry];
    setPhotos(updated);
    localStorage.setItem('wiggle_progress_photos', JSON.stringify(updated));
    setShowAddPhotoModal(false);
    setNewNotes('');
    setNewImageUrl('');
  };

  const handleShareCard = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const beforePhoto = photos[comparisonBeforeIndex] || photos[0];
  const afterPhoto = photos[comparisonAfterIndex] || photos[photos.length - 1];

  return (
    <div className="space-y-6 pb-20">
      {/* Gamification Streak & Highlights */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-200">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Racha de Ejercicio Wiggle</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{userProfile.streakDays} Días Seguidos</span>
              <span className="text-2xl">🔥</span>
            </h1>
            <p className="text-xs text-amber-100 mt-1 max-w-sm">
              ¡Increíble constancia, {userProfile.name}! La regeneración neuromuscular depende del hábito diario.
            </p>
          </div>

          <button
            type="button"
            onClick={handleShareCard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-orange-700 font-extrabold text-xs shadow-md hover:bg-orange-50 active:scale-95 transition-all self-start cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedShare ? '¡Copiado para compartir!' : 'Compartir mi Racha'}</span>
          </button>
        </div>

        {/* 7-day visual streak dots */}
        <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between gap-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-white/80 font-semibold">{d}</span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                  i < userProfile.streakDays
                    ? 'bg-white text-orange-600'
                    : 'bg-white/20 text-white/50 border border-white/20'
                }`}
              >
                {i < userProfile.streakDays ? '🔥' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-1">
            <Footprints className="w-4 h-4" />
            <span>Repeticiones</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userProfile.totalReps}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">En cuadrantes Wiggle</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
            <Clock className="w-4 h-4" />
            <span>Minutos</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userProfile.totalMinutes} min
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Tiempo activo</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Sesiones</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userProfile.completedSessionsCount || 4}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Completadas con éxito</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Dolor Reportado</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userProfile.painLevel} / 10
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">↓ -40% desde inicio</p>
        </div>
      </div>

      {/* ÁLBUM DE FOTOS "ANTES Y DESPUÉS" (Private Progress Album) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Álbum Privado "Antes y Después"
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Guarda tus fotos y registros de postura, grado de flexión dorsal y reducción de hinchazón.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddPhotoModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Nueva Foto</span>
          </button>
        </div>

        {/* Side-by-Side Visual Comparison Tool */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
            <span>Comparativa de Evolución</span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Ganancia de +{Math.max(0, (afterPhoto?.angleDegrees || 38) - (beforePhoto?.angleDegrees || 12))}° en flexión
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photo Card */}
            <div className="bg-white rounded-2xl p-3 border-2 border-amber-300 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  {beforePhoto.stage} ({beforePhoto.date})
                </span>
                <span className="text-slate-600">{beforePhoto.angleDegrees}° Ángulo</span>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src={beforePhoto.imageUrl}
                  alt="Foto antes"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {beforePhoto.notes}
              </p>
            </div>

            {/* After Photo Card */}
            <div className="bg-white rounded-2xl p-3 border-2 border-emerald-400 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {afterPhoto.stage} ({afterPhoto.date})
                </span>
                <span className="text-emerald-600 font-extrabold">{afterPhoto.angleDegrees}° Ángulo</span>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src={afterPhoto.imageUrl}
                  alt="Foto después"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {afterPhoto.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700">Historial de registros guardados</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setComparisonAfterIndex(idx)}
                className="relative rounded-xl overflow-hidden aspect-square border-2 border-slate-200 hover:border-blue-500 cursor-pointer group shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.notes}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-1.5 text-white">
                  <span className="text-[10px] font-bold leading-tight truncate">{item.stage}</span>
                  <span className="text-[9px] text-amber-300 font-medium">{item.angleDegrees}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GAMIFICACIÓN: Medallas y Logros Desbloqueables */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Medallas e Insignias Wiggle</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recompensas por tu constancia, destreza y superación motriz.
            </p>
          </div>
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            4 / 6 Desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES_LIST.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                badge.unlocked
                  ? 'border-amber-200 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/70 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                  badge.unlocked
                    ? 'bg-white border-2 border-amber-300'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {badge.title}
                  </h3>
                  {badge.unlocked && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ¡Ganada!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {badge.description}
                </p>
                {badge.unlockedDate && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Desbloqueado: {badge.unlockedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding new photo */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-blue-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <span>Registrar Nueva Foto de Progreso</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Etapa del registro
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Antes', 'En Proceso', 'Después'] as const).map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    onClick={() => setNewStage(stage)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      newStage === stage
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ángulo de Flexión estimado (Grados °)
              </label>
              <input
                type="number"
                min={0}
                max={90}
                value={newAngle}
                onChange={(e) => setNewAngle(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notas sobre sensaciones o postura
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ej. Hoy logré apoyar el talón con menor hinchazón..."
                rows={3}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL de imagen o cargar
              </label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://... o deja vacío para usar imagen estándar"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Guardar en Mi Álbum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
