import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WiggyMascot } from './WiggyMascot';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Navigation,
  Accessibility,
  Building2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ContactLocationModuleProps {
  userProfile: UserProfile;
}

const WIGGLE_PHONE = '983164542';
const WIGGLE_PHONE_INTL = '+51983164542';

const LOCATIONS = [
  {
    id: 'loc1',
    name: 'Sede Principal & Centro de Rehabilitación Wiggle Trujillo',
    address: 'Pachacútec 570, Urbanización Santa María, Trujillo - Perú',
    reference: 'Zona accesible y tranquila de Urb. Santa María / Rampa directa para silla de ruedas y andadores',
    hours: 'Lunes a Sábado: 8:00 AM - 9:00 PM',
    accessibility: '100% Accesible para silla de ruedas y andadores, ingreso a nivel de calle con rampa y piso podotáctil antideslizante.',
    phone: '983164542',
    mapQuery: 'Pachacutec+570,+Santa+Maria,+Trujillo,+Peru',
  },
  {
    id: 'loc2',
    name: 'Sala de Demostración y Envíos a Todo el Perú',
    address: 'Pachacútec 570, Urbanización Santa María, Trujillo - Perú',
    reference: 'Punto de recojo, pruebas personalizadas del dispositivo y despacho nacional',
    hours: 'Lunes a Sábado: 8:00 AM - 9:00 PM',
    accessibility: 'Atención personalizada con especialistas en terapia física y asesoría postural.',
    phone: '983164542',
    mapQuery: 'Pachacutec+570,+Santa+Maria,+Trujillo,+Peru',
  },
];

export const ContactLocationModule: React.FC<ContactLocationModuleProps> = ({
  userProfile,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Consulta sobre el dispositivo Wiggle');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const getWhatsAppUrl = (customMsg?: string) => {
    const text = encodeURIComponent(
      customMsg ||
        `¡Hola equipo Wiggle! Mi nombre es ${name || userProfile.name}. Mi condición actual es: ${userProfile.condition}. Quisiera información sobre el dispositivo Wiggle y coordinación de una prueba.`
    );
    return `https://wa.me/51${WIGGLE_PHONE}?text=${text}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMsg = `Hola Wiggle, soy ${name} (Tel: ${phone}). Motivo: ${subject}. Mensaje: ${message}`;
    const url = getWhatsAppUrl(fullMsg);
    setSentSuccess(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setSentSuccess(false);
      setMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-wider text-blue-200">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Sede Central Trujillo, Perú</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Ubícanos en Trujillo
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
              Te esperamos en nuestra sede oficial en <strong className="text-amber-300">Pachacútec 570, Urbanización Santa María, Trujillo, Perú</strong>. Atención continua de <strong className="text-white">Lunes a Sábado de 8:00 AM a 9:00 PM</strong>.
            </p>
          </div>

          {/* Wiggy Mascot greeting visitors */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex items-center gap-2 self-start sm:self-center">
            <WiggyMascot variant="head" size="avatar" interactive={true} />
            <div className="text-[11px] text-white pr-2">
              <span className="font-extrabold block text-amber-300">¡Wiggy te espera!</span>
              <span className="text-blue-100 text-[10px]">Pruebas gratuitas</span>
            </div>
          </div>
        </div>

        {/* Direct Action Buttons: WhatsApp & Call */}
        <div className="mt-5 flex flex-wrap items-center gap-3 relative z-10">
          {/* WhatsApp Direct */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>WhatsApp Directo: {WIGGLE_PHONE}</span>
          </a>

          {/* Direct Phone Dial */}
          <a
            href={`tel:${WIGGLE_PHONE}`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Llamar: {WIGGLE_PHONE}</span>
          </a>
        </div>
      </div>

      {/* Interactive Google Maps & Branches */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span>Sede Principal Trujillo & Salas de Demostración</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pruébate el Wiggle con la asistencia presencial de nuestro equipo en Pachacútec 570, Urb. Santa María, Trujillo.
            </p>
          </div>

          {/* Branch Switcher Buttons */}
          <div className="flex gap-1.5 self-start">
            {LOCATIONS.map((loc) => (
              <button
                type="button"
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLocation.id === loc.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {loc.name.includes('Principal') ? 'Sede Trujillo (Pachacútec 570)' : 'Pruebas & Envíos Perú'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Branch Detail Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">{selectedLocation.name}</strong>
                <span className="text-slate-600">{selectedLocation.address}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{selectedLocation.hours}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l sm:pl-3 border-slate-200 pt-2 sm:pt-0">
            <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <Accessibility className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-bold block">Accesibilidad Universal:</strong>
                <span>{selectedLocation.accessibility}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Interactive Embed */}
        <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner h-72 sm:h-80 relative bg-slate-100">
          <iframe
            title="Mapa de Sedes Wiggle"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              selectedLocation.mapQuery
            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      </div>

      {/* Quick Consultation Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Formulario de Consulta Rápida</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Déjanos tus datos y te responderemos inmediatamente a través de WhatsApp o llamada telefónica.
          </p>
        </div>

        {sentSuccess ? (
          <div className="py-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 text-emerald-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold">¡Mensaje preparado con éxito!</h3>
            <p className="text-xs">Abriendo canal de WhatsApp oficial al 983164542...</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Roberto Torres"
                  className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono / WhatsApp de contacto
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. 983164542"
                  className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motivo de tu consulta
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm bg-white font-medium"
              >
                <option value="Adquisición del dispositivo Wiggle">
                  Quiero adquirir el dispositivo Wiggle
                </option>
                <option value="Consulta sobre rehabilitación para mi condición">
                  Consulta de ejercicios para mi condición médica
                </option>
                <option value="Agendar cita en sala de prueba presencial">
                  Agendar prueba presencial en sede
                </option>
                <option value="Pregunta sobre almohadillas y accesorios">
                  Pregunta sobre accesorios y almohadillas
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detalles adicionales o dudas
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos brevemente tu caso (tiempo de lesión, movilidad actual)..."
                className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Consulta Directa a WhatsApp (983164542)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
