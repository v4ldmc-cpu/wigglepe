import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { WiggyMascot } from './WiggyMascot';
import {
  Send,
  User,
  Sparkles,
  AlertTriangle,
  Volume2,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  MapPin,
} from 'lucide-react';

interface WiggyChatModuleProps {
  userProfile: UserProfile;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content:
      '¡Hola! Soy **Wiggy** 🐸🤠, la ranita fisioterapeuta y mascota oficial de Wiggle. Con mi sombrero vaquero y mis botitas verdes estoy listo para acompañar tu rehabilitación dinámica de miembros inferiores paso a paso. Recuerda que también puedes visitarnos en nuestra sede en **Pachacútec 570, Urb. Santa María, Trujillo**. ¿En qué ejercicio o duda puedo ayudarte hoy?',
    timestamp: 'Ahora',
  },
];

const QUICK_PROMPTS = [
  '¿Qué habilidad trabaja cada almohadilla de colores?',
  '¿Cómo realizo el circuito en zigzag de la almohadilla roja?',
  '¿En qué ayuda girar la base de madera durante mi terapia?',
  '¿Cómo uso la canasta central y los 3 mini saquitos con el pie?',
  '¿Por qué la almohadilla amarilla mejora la fuerza del pie y la pierna?',
  '¿Cómo ayuda la almohadilla verde al equilibrio y adaptación?',
  '¿Dónde queda la sede de Wiggle en Trujillo?',
];

export const WiggyChatModule: React.FC<WiggyChatModuleProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('wiggle_wiggy_chat');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown bold stars and brackets for cleaner audio
      const clean = text.replace(/[*_#\[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/wiggy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          userProfile: {
            name: userProfile.name,
            condition: userProfile.condition,
            affectedLimb: userProfile.affectedLimb,
            painLevel: userProfile.painLevel,
            streakDays: userProfile.streakDays,
            totalReps: userProfile.totalReps,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || '¡Aquí estoy para acompañar tu rehabilitación con Wiggle!',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...newHistory, assistantMsg];
      setMessages(finalMessages);
      localStorage.setItem('wiggle_wiggy_chat', JSON.stringify(finalMessages));

      // Auto-read aloud if voice guide enabled
      if (userProfile.voiceGuide) {
        speakText(assistantMsg.content);
      }
    } catch (error) {
      console.error(error);
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: `¡Hola ${userProfile.name}! Recuerda que para tu condición (${userProfile.condition}), lo fundamental es avanzar sin forzar la articulación. En el cuadrante verde, coloca tu talón y balancéate suavemente hacia el amarillo. Descansa 15 segundos entre repeticiones.\n\n*(Nota de seguridad médica: Wiggy es un asistente de acompañamiento y no reemplaza la consulta con un médico especialista).*`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('wiggle_wiggy_chat');
  };

  const [showMascotCard, setShowMascotCard] = useState(false);

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto flex flex-col h-[calc(100vh-180px)] min-h-[550px]">
      {/* Header Info Banner featuring Official Brand Frog Mascot */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-800 rounded-3xl p-3.5 sm:p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Official Mascot Avatar */}
          <div
            onClick={() => setShowMascotCard(!showMascotCard)}
            className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border-2 border-emerald-300/40 flex items-center justify-center p-1 shadow-inner cursor-pointer hover:scale-105 transition-transform"
            title="Toca para conocer a Wiggy, nuestra ranita vaquera oficial"
          >
            <WiggyMascot variant="avatar" size="avatar" interactive={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white flex items-center gap-1">
                <span>Wiggy</span>
                <span className="text-xs bg-emerald-500/80 text-white font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
                  Mascota Oficial
                </span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-200 font-semibold">En línea</span>
            </div>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <span>Ranita fisioterapeuta de Wiggle</span>
              <span>•</span>
              <span className="text-amber-200 font-semibold flex items-center gap-0.5">
                <MapPin className="w-3 h-3 inline" />
                Trujillo, Perú
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowMascotCard(!showMascotCard)}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Ver tarjeta de la mascota"
          >
            <span>🤠</span>
            <span className="hidden sm:inline">Ver Mascota</span>
          </button>
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Reiniciar conversación"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Expandable Official Mascot Card */}
      {showMascotCard && (
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 flex items-center gap-4 shadow-sm animate-fadeIn">
          <div className="flex-shrink-0 bg-white p-2 rounded-2xl border border-emerald-200 shadow-xs">
            <WiggyMascot variant="full" size="md" interactive={true} />
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-emerald-950">¡Hola! Soy Wiggy</span>
              <span className="text-[10px] bg-red-100 text-red-700 font-black px-1.5 py-0.5 rounded">
                Sombrero & Botas Vaqueras 🤠
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Soy la mascota oficial de <strong>Wiggle</strong>. Te acompaño en cada serie con los cojines sensoriales, cuidando tu postura y celebrando cada paso de tu rehabilitación en miembros inferiores.
            </p>
            <p className="text-[11px] text-emerald-800 font-bold">
              📍 Visítanos en nuestra sede: Pachacútec 570, Urb. Santa María, Trujillo.
            </p>
          </div>
        </div>
      )}

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="text-amber-950 font-bold">Descargo de responsabilidad médica: </strong>
          Wiggy es un asistente virtual interactivo de acompañamiento y educación motriz. No reemplaza ni sustituye el diagnóstico, tratamiento ni consulta con un médico o fisioterapeuta especialista. En caso de dolor agudo, suspende la actividad.
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xs p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-xs overflow-hidden ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <WiggyMascot variant="head" size="xs" interactive={false} />
                )}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap font-medium">
                  {m.content}
                </div>

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-blue-200' : 'text-slate-600'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakText(m.content)}
                      className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors ml-2 cursor-pointer"
                      title="Escuchar en voz alta"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Escuchar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2 bg-slate-50 rounded-2xl w-fit border border-slate-200">
            <div className="w-5 h-5 animate-bounce">
              <WiggyMascot variant="head" size="xs" interactive={false} />
            </div>
            <span>Wiggy está pensando tu respuesta...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Sugerencias:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="flex-shrink-0 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-300 font-medium text-[11px] shadow-2xs hover:border-blue-400 transition-all cursor-pointer truncate max-w-[240px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white rounded-2xl border-2 border-slate-300 focus-within:border-blue-500 p-1.5 shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Pregúntale a Wiggy sobre tu postura, dolor o el Wiggle...`}
          className="flex-1 px-3 py-2 text-xs sm:text-sm focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs cursor-pointer flex-shrink-0"
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
