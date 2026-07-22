import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, Volume2, VolumeX, ArrowLeft, Clock, Shield, Share2 } from 'lucide-react';
import { INITIAL_ARTICLES } from '../data/educationalData';
import { EducationalArticle } from '../types';

export const LibraryView: React.FC = () => {
  const [articles, setArticles] = useState<EducationalArticle[]>(INITIAL_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = ['Todos', 'Ley Dominga', 'Duelo Perinatal', 'Ansiedad y Depresión', 'Culpa y Autocuidado', 'Pareja y Redes'];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(articles.map(a => a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a));
  };

  const handleSpeakText = (textArray: string[]) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const fullText = textArray.join('. ');
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'es-CL';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesCat = selectedCategory === 'Todos' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#5A5A40]" />
          <h1 className="serif text-2xl font-bold text-[#5A5A40]">Biblioteca Educativa</h1>
        </div>
        <p className="sans text-xs text-[#5A5A40]/80 mt-1">
          Información rigurosa y empática sobre salud perinatal y Ley Dominga.
        </p>
      </div>

      {!activeArticle ? (
        <>
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#5A5A40]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema (ej: Ley Dominga, culpa, duelo)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF5] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] soft-shadow"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'bg-[#FFFDF5] text-[#5A5A40] border border-[#5A5A40]/15 hover:bg-[#E8DCC4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles list */}
          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="p-5 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow hover:border-[#5A5A40]/40 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DCC4] text-[#5A5A40]">
                    {article.category}
                  </span>
                  <button
                    onClick={(e) => toggleBookmark(article.id, e)}
                    className="p-1 text-[#5A5A40] hover:scale-110 transition-transform"
                    title="Guardar marcador"
                  >
                    <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'fill-[#5A5A40]' : ''}`} />
                  </button>
                </div>

                <h3 className="serif text-base font-bold text-[#2D2D2D] group-hover:text-[#5A5A40] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="sans text-xs text-[#5A5A40]/80 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#5A5A40]/10 text-[11px] text-[#5A5A40]/70 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span className="text-[#5A5A40] font-bold group-hover:underline">Leer artículo →</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Full Article Detail View */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => {
              if (isSpeaking) handleSpeakText([]);
              setActiveArticle(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la biblioteca</span>
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DCC4] text-[#5A5A40]">
                {activeArticle.category}
              </span>
              <span className="sans text-xs text-[#5A5A40]/70">{activeArticle.readTime}</span>
            </div>
            <h1 className="serif text-2xl font-bold text-[#2D2D2D] leading-tight">
              {activeArticle.title}
            </h1>
          </div>

          {/* Audio Reader Controls */}
          <div className="p-3.5 rounded-2xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40]">
              <Volume2 className="w-4 h-4" />
              <span>Lector de Audio Accesible</span>
            </div>
            <button
              onClick={() => handleSpeakText(activeArticle.content)}
              className="px-3.5 py-1.5 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] flex items-center gap-1.5"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Detener Lectura</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Escuchar Artículo</span>
                </>
              )}
            </button>
          </div>

          {/* Article Text */}
          <div className="space-y-4 text-xs text-[#2D2D2D] leading-relaxed pt-2">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="bg-white/60 p-3.5 rounded-2xl border border-[#5A5A40]/5">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-4 border-t border-[#5A5A40]/10 flex justify-between items-center text-xs text-[#5A5A40]">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-[#5A5A40]" />
              Contenido verificado por Dominga Care
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
