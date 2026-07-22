import React from 'react';
import { Home, BookOpen, Users, Bookmark, AlertCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'journal' | 'community' | 'resources';
  setActiveTab: (tab: 'home' | 'journal' | 'community' | 'resources') => void;
  onOpenSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenSos }) => {
  return (
    <>
      {/* Floating SOS Trigger Button */}
      <button
        onClick={onOpenSos}
        className="fixed bottom-20 right-4 sm:right-8 z-50 w-14 h-14 bg-[#D67C65] text-white rounded-full shadow-lg hover:bg-[#C06852] active:scale-95 transition-all flex flex-col items-center justify-center font-bold border-2 border-white/40 group"
        title="Ayuda Inmediata SOS - Línea *4141"
        aria-label="Botón de Ayuda Inmediata SOS"
      >
        <AlertCircle className="w-6 h-6 group-hover:animate-bounce" />
        <span className="text-[10px] tracking-widest font-bold uppercase leading-none mt-0.5">SOS</span>
      </button>

      {/* Bottom Floating Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#5A5A40]/10 py-2 px-4 shadow-lg max-w-lg mx-auto sm:rounded-t-3xl">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'home'
                ? 'text-[#5A5A40] bg-[#5A5A40]/10 font-bold'
                : 'text-[#2D2D2D]/60 hover:text-[#5A5A40]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="sans text-[10px] tracking-tight">Inicio</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'journal'
                ? 'text-[#5A5A40] bg-[#5A5A40]/10 font-bold'
                : 'text-[#2D2D2D]/60 hover:text-[#5A5A40]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="sans text-[10px] tracking-tight">Diario</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'community'
                ? 'text-[#5A5A40] bg-[#5A5A40]/10 font-bold'
                : 'text-[#2D2D2D]/60 hover:text-[#5A5A40]'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="sans text-[10px] tracking-tight">Comunidad</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'resources'
                ? 'text-[#5A5A40] bg-[#5A5A40]/10 font-bold'
                : 'text-[#2D2D2D]/60 hover:text-[#5A5A40]'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="sans text-[10px] tracking-tight">Recursos</span>
          </button>
        </div>
      </nav>
    </>
  );
};
