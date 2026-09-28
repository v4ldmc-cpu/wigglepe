import React, { useState } from 'react';
import { ForumPost, FAQItem, UserProfile } from '../types';
import { FAQ_LIST, INITIAL_POSTS } from '../data/community';
import {
  MessageCircle,
  HelpCircle,
  ThumbsUp,
  Send,
  Plus,
  ShieldCheck,
  Tag,
  ChevronDown,
  Sparkles,
  Users,
} from 'lucide-react';

interface CommunityModuleProps {
  userProfile: UserProfile;
}

export const CommunityModule: React.FC<CommunityModuleProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'faq'>('forum');
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('wiggle_community_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('todos');

  const handleLike = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        const liked = !p.likedByMe;
        return {
          ...p,
          likedByMe: liked,
          likes: liked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('wiggle_community_posts', JSON.stringify(updated));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: 'post-' + Date.now(),
      author: userProfile.name || 'Usuario Wiggle',
      authorCondition: userProfile.condition,
      date: 'Recién publicado',
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 1,
      likedByMe: true,
      tags: ['Comunidad', 'Experiencia Wiggle'],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('wiggle_community_posts', JSON.stringify(updated));
    setNewTitle('');
    setNewContent('');
    setShowNewPostForm(false);
  };

  const filteredFaq =
    faqCategoryFilter === 'todos'
      ? FAQ_LIST
      : FAQ_LIST.filter((f) => f.category === faqCategoryFilter);

  return (
    <div className="space-y-6 pb-20">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-wider text-purple-200">
          <Users className="w-4 h-4 text-purple-300" />
          <span>Espacio Colaborativo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Comunidad, Dudas y Reseñas Wiggle
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl leading-relaxed">
          Comparte tus inquietudes, lee las experiencias de otros pacientes y familiares, y encuentra respuestas oficiales de nuestro equipo de rehabilitación.
        </p>

        {/* Tab Switcher */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'forum'
                ? 'bg-white text-purple-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Foro & Comentarios ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-white text-purple-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Preguntas Frecuentes (FAQ)
          </button>
        </div>
      </div>

      {activeTab === 'forum' ? (
        /* Forum Section */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span>Conversaciones de la Comunidad</span>
            </h2>

            <button
              type="button"
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewPostForm ? 'Cancelar' : 'Publicar Consulta / Reseña'}</span>
            </button>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <form
              onSubmit={handleCreatePost}
              className="bg-white rounded-3xl p-5 border-2 border-blue-300 shadow-md space-y-3"
            >
              <h3 className="text-sm font-bold text-slate-900">
                Escribe tu consulta o reseña para la comunidad Wiggle
              </h3>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Título corto (ej. ¿Cómo adaptan el ejercicio para tobillo izquierdo?)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl font-semibold"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe tu experiencia, duda sobre el dispositivo Wiggle o consejo..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Publicar Ahora
                </button>
              </div>
            </form>
          )}

          {/* Post Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      post.likedByMe
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Verified Physiotherapist Response */}
                {post.physioReply && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Respuesta de Fisioterapia Wiggle</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {post.physioReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FAQ Section */
        <div className="space-y-4">
          {/* FAQ Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'todos', label: 'Todas' },
              { id: 'dispositivo', label: 'Dispositivo Wiggle' },
              { id: 'ejercicios', label: 'Ejercicios & Rutinas' },
              { id: 'seguridad', label: 'Seguridad Médica' },
              { id: 'limpieza', label: 'Higiene & Cuidados' },
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setFaqCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                  faqCategoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaq.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
