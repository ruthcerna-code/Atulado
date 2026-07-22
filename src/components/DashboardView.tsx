import React from 'react';
import { Play, Sparkles, BookOpen, ClipboardList, AlertCircle, Phone, ArrowRight, Heart, Calendar, Activity } from 'lucide-react';
import { UserProfile, MoodType, JournalEntry, EpdsResult } from '../types';

interface DashboardViewProps {
  userProfile: UserProfile;
  recentEntries: JournalEntry[];
  latestEpds?: EpdsResult;
  onQuickMoodCheckin: (mood: MoodType) => void;
  onOpenBreathing: () => void;
  onNavigateTab: (tab: 'journal' | 'community' | 'resources') => void;
  onOpenEpdsTest: () => void;
  onOpenSos: () => void;
  onOpenClinicalProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  recentEntries,
  latestEpds,
  onQuickMoodCheckin,
  onOpenBreathing,
  onNavigateTab,
  onOpenEpdsTest,
  onOpenSos,
  onOpenClinicalProfile
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Daily phrase selection
  const dailyQuotes = [
    'Tu sentir es válido. No tienes que sostenerlo todo sola.',
    'Sanar es un proceso suave, con días de sol y días de refugio.',
    'Cada pequeña pausa de respiración es una caricia para tu sistema nervioso.',
    'Honra el cuerpo y el corazón que han dado tanto.'
  ];
  const todayQuote = dailyQuotes[new Date().getDay() % dailyQuotes.length];

  // Quick mood options
  const moodOptions: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'radiant', emoji: '😊', label: 'Radiante' },
    { type: 'calm', emoji: '😐', label: 'En Calma' },
    { type: 'sad', emoji: '😔', label: 'Triste' },
    { type: 'anxious', emoji: '😢', label: 'Abrumada' }
  ];

  // Weekly evolution dummy/live calculation
  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const moodHeights = [40, 60, 30, 80, 50, 45, 20];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Empathetic Greeting Header */}
      <div className="flex justify-between items-center bg-[#FFFDF5] p-5 rounded-3xl border border-[#5A5A40]/10 soft-shadow">
        <div>
          <span className="sans text-[11px] font-bold uppercase tracking-wider text-[#5A5A40]/70 block">
            {getGreeting()}
          </span>
          <h1 className="serif text-2xl font-bold text-[#2D2D2D]">
            {userProfile.displayName || 'María'}
          </h1>
          <p className="sans text-xs text-[#5A5A40] mt-0.5">
            {userProfile.pregnancyOrPostpartumStatus === 'grief_loss'
              ? 'Acompañando tu proceso con amor'
              : userProfile.pregnancyOrPostpartumStatus === 'postpartum'
              ? 'En etapa de posparto y crianza'
              : 'En tu camino de gestación'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#E8DCC4] flex items-center justify-center text-[#5A5A40] text-xl font-bold shadow-xs border-2 border-white">
          <Heart className="w-6 h-6 fill-[#5A5A40] text-[#5A5A40]" />
        </div>
      </div>

      {/* Clinical Profile Summary Banner */}
      {userProfile.clinicalProfile && (
        <div className="p-4 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-[#E8DCC4] shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#5A5A40] flex items-center gap-2">
                <span>Mi Perfil Clínico</span>
                <span className="text-[10px] bg-[#E8DCC4] text-[#5A5A40] px-2 py-0.5 rounded-full font-semibold">
                  {userProfile.clinicalProfile.age} años • {userProfile.clinicalProfile.weightKg} kg
                </span>
              </div>
              <p className="text-[#5A5A40]/80 mt-0.5 text-[11px]">
                Última regla: <span className="font-semibold">{userProfile.clinicalProfile.lastPeriodStartDate}</span> • Ciclo: {userProfile.clinicalProfile.cycleDurationDays} días
              </p>
            </div>
          </div>
          {onOpenClinicalProfile && (
            <button
              onClick={onOpenClinicalProfile}
              className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white hover:bg-[#484833] text-[11px] font-bold transition-all shrink-0 active:scale-95"
            >
              Editar
            </button>
          )}
        </div>
      )}

      {/* Daily Quote Card */}
      <div className="p-4 rounded-2xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
        <div>
          <p className="serif text-sm font-bold italic text-[#5A5A40]">"{todayQuote}"</p>
          <span className="sans text-[10px] uppercase tracking-widest text-[#5A5A40]/60 font-semibold block mt-1">
            Pensamiento de Apoyo Dominga Care
          </span>
        </div>
      </div>

      {/* Primary Highlight Grid: Pausa del día & Calendario Emocional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pausa del día */}
        <div className="p-6 rounded-3xl bg-[#5A5A40] text-white relative overflow-hidden soft-shadow flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E8DCC4] animate-ping" />
              <span className="sans text-[10px] uppercase font-bold tracking-widest text-[#E8DCC4]">
                Pausa del día
              </span>
            </div>
            <h2 className="serif text-xl font-bold mb-1.5">Respiración Consciente</h2>
            <p className="sans text-xs text-white/80 leading-relaxed mb-4">
              Regálate 3 minutos de autorregulación. Ejercicio con sonido ambiente relajante.
            </p>
          </div>
          <button
            onClick={onOpenBreathing}
            className="w-full py-2.5 bg-white text-[#5A5A40] hover:bg-[#FFFDF5] rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-[#5A5A40]" />
            <span>Comenzar Pausa</span>
          </button>
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Calendario Emocional & Sugerencias */}
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/20 text-[#5A5A40] relative overflow-hidden soft-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#5A5A40]" />
              <span className="sans text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">
                Evolución & Ejercicios
              </span>
            </div>
            <h2 className="serif text-xl font-bold mb-1.5">Calendario Emocional</h2>
            <p className="sans text-xs text-[#5A5A40]/80 leading-relaxed mb-4">
              Registra tu día a día y recibe recomendaciones adaptativas de yoga, ejercicios y respiración.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('journal')}
            className="w-full py-2.5 bg-[#5A5A40] text-white hover:bg-[#484833] rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Calendario & Ejercicios</span>
          </button>
        </div>
      </div>

      {/* Quick Mood Check-in */}
      <div className="p-5 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/10 soft-shadow">
        <div className="serif text-base font-bold text-[#5A5A40] mb-3 italic">
          ¿Cómo te sientes en este momento?
        </div>
        <div className="grid grid-cols-4 gap-2">
          {moodOptions.map((item) => (
            <button
              key={item.type}
              onClick={() => onQuickMoodCheckin(item.type)}
              className="p-3 rounded-2xl bg-white border border-[#5A5A40]/10 hover:border-[#5A5A40] hover:bg-[#F5F5F0] transition-all flex flex-col items-center gap-1 shadow-2xs group active:scale-95"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
              <span className="sans text-[10px] font-medium text-[#2D2D2D]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('journal')}
          className="p-4 rounded-2xl bg-white border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-[#E8DCC4]/50 flex items-center justify-center text-[#5A5A40] mb-2 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">Mi Diario</div>
            <div className="sans text-[10px] text-[#5A5A40]/70 mt-0.5">Escribe tu sentir de hoy</div>
          </div>
        </button>

        <button
          onClick={onOpenEpdsTest}
          className="p-4 rounded-2xl bg-white border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-[#E8DCC4]/50 flex items-center justify-center text-[#5A5A40] mb-2 group-hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">Test EPDS</div>
            <div className="sans text-[10px] text-[#5A5A40]/70 mt-0.5">Evaluación clínica Edimburgo</div>
          </div>
        </button>
      </div>

      {/* Latest EPDS Result Widget if evaluated */}
      {latestEpds && (
        <div className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="sans text-xs font-bold text-[#2D2D2D]">Última Evaluación EPDS</div>
              <div className="sans text-[11px] text-[#5A5A40]">
                Puntaje: {latestEpds.totalScore}/30 • {latestEpds.dateStr}
              </div>
            </div>
          </div>
          <button
            onClick={onOpenEpdsTest}
            className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1"
          >
            Ver
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Weekly Mood Bar Chart */}
      <div className="p-5 rounded-3xl border border-[#5A5A40]/10 bg-white shadow-2xs">
        <div className="flex justify-between items-center mb-3">
          <h3 className="serif text-sm font-bold text-[#5A5A40]">Evolución Semanal de Bienestar</h3>
          <span className="sans text-[10px] uppercase tracking-widest text-[#5A5A40]/60 font-semibold">
            {recentEntries.length} entradas
          </span>
        </div>
        <div className="flex items-end gap-2 h-20 pt-2 border-b border-[#5A5A40]/10">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                style={{ height: `${moodHeights[idx]}%` }}
                className={`w-full rounded-t-lg transition-all ${
                  idx === 3 ? 'bg-[#5A5A40]' : 'bg-[#5A5A40]/25'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between sans text-[9px] uppercase tracking-widest text-[#5A5A40]/60 font-bold pt-2">
          {daysOfWeek.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>

      {/* Crisis Protocol Highlight */}
      <div className="p-5 rounded-3xl bg-[#D67C65]/10 border border-[#D67C65]/20 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[#D67C65] font-bold text-xs uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Protocolo de Crisis Inmediata</span>
          </div>
          <p className="sans text-xs text-[#D67C65]/90 leading-relaxed">
            Acceso directo a la línea telefónica gratuita *4141 y contacto de confianza.
          </p>
        </div>
        <button
          onClick={onOpenSos}
          className="px-3.5 py-2 bg-[#D67C65] text-white rounded-xl text-xs font-bold hover:bg-[#C06852] shrink-0 shadow-2xs active:scale-95 transition-all flex items-center gap-1"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>
    </div>
  );
};
