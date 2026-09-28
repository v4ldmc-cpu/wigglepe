import React, { useState } from 'react';
import { Testimonial, UserCondition } from '../types';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import {
  Star,
  Quote,
  CheckCircle2,
  TrendingUp,
  Clock,
  Filter,
  Heart,
  MessageSquarePlus,
} from 'lucide-react';

export const TestimonialsModule: React.FC = () => {
  const [filter, setFilter] = useState<UserCondition | 'all'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorCondition, setAuthorCondition] = useState('Recuperación de Fractura de Tobillo');
  const [authorStory, setAuthorStory] = useState('');
  const [submittedStory, setSubmittedStory] = useState(false);

  const filtered =
    filter === 'all'
      ? TESTIMONIALS_DATA
      : TESTIMONIALS_DATA.filter((t) => t.condition === filter);

  const handleShareStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorStory.trim()) return;
    setSubmittedStory(true);
    setTimeout(() => {
      setSubmittedStory(false);
      setShowShareModal(false);
      setAuthorName('');
      setAuthorStory('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-200 mb-1">
            <Heart className="w-4 h-4 fill-emerald-300 text-emerald-300" />
            <span>Historias de Superación Real</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Muro de Éxito e Inspiración Wiggle
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Conoce cómo personas de todas las edades han transformado su movilidad, recuperado su autonomía y reducido el dolor gracias a la constancia con el dispositivo Wiggle.
          </p>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="mt-4 px-4 py-2 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Compartir mi Historia de Éxito</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
        </span>
        {[
          { id: 'all', label: 'Todos los casos' },
          { id: 'ankle_fracture', label: '🦶 Fracturas de tobillo' },
          { id: 'walker', label: '🦯 Usuarios de andador' },
          { id: 'wheelchair', label: '🦽 Silla de ruedas' },
          { id: 'reduced_mobility', label: '🌟 Movilidad reducida' },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* User Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">
                        {item.name}
                      </h3>
                      {item.verified && (
                        <span className="flex items-center text-[10px] text-blue-600 font-bold" title="Caso clínico verificado">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.age} años • {item.city}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Condition Badge & Time */}
              <div className="space-y-1 mb-3">
                <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                  <strong>Condición previa:</strong> {item.conditionLabel}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tiempo con Wiggle: <strong>{item.timeUsingWiggle}</strong></span>
                </div>
              </div>

              {/* Metric Improvement Box */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-3 flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold block">Logro medible:</strong>
                  {item.improvementMetric}
                </div>
              </div>

              {/* Quote */}
              <div className="relative pl-3 border-l-2 border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                "{item.quote}"
              </div>
            </div>

            {/* Verified testimonial badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Testimonio Verificado</span>
              </span>
              <span className="text-[11px] text-slate-400">Comunidad Wiggle</span>
            </div>
          </div>
        ))}
      </div>

      {/* Share story modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-emerald-200 shadow-2xl space-y-4 text-slate-800">
            {submittedStory ? (
              <div className="py-8 text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <h3 className="text-lg font-bold text-slate-900">¡Gracias por inspirar a otros!</h3>
                <p className="text-xs text-slate-600">
                  Tu historia será revisada por nuestro equipo de fisioterapia para publicarse en el muro.
                </p>
              </div>
            ) : (
              <form onSubmit={handleShareStory} className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
                  <span>Comparte tu Experiencia con Wiggle</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tu nombre</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Roberto Díaz"
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tu condición o motivo</label>
                  <input
                    type="text"
                    required
                    value={authorCondition}
                    onChange={(e) => setAuthorCondition(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ¿Qué cambios has notado al usar Wiggle?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={authorStory}
                    onChange={(e) => setAuthorStory(e.target.value)}
                    placeholder="Cuéntanos sobre tus avances con los cuadrantes, reducción de dolor o sensaciones de apoyo..."
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Publicar Historia
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
