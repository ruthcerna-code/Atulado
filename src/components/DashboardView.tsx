import React from 'react';
import { Play, Sparkles, BookOpen, ClipboardList, AlertCircle, Phone, ArrowRight, Heart, Calendar, Activity } from 'lucide-react';
import { UserProfile, MoodType, JournalEntry, EpdsResult, Gad7Result } from '../types';

interface DashboardViewProps {
  userProfile: UserProfile;
  recentEntries: JournalEntry[];
  latestEpds?: EpdsResult;
  latestGad7?: Gad7Result;
  onQuickMoodCheckin: (mood: MoodType) => void;
  onOpenBreathing: () => void;
  onNavigateTab: (tab: 'journal' | 'community' | 'resources') => void;
  onOpenEpdsTest: () => void;
  onOpenGad7Test: () => void;
  onOpenSos: () => void;
  onOpenClinicalProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  recentEntries,
  latestEpds,
  latestGad7,
  onQuickMoodCheckin,
  onOpenBreathing,
  onNavigateTab,
  onOpenEpdsTest,
  onOpenGad7Test,
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

  // Quick mood options matching the 7 official emotional states
  const moodOptions: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'angry', emoji: '😡', label: 'Enojada' },
    { type: 'guilty', emoji: '😔', label: 'Culposa' },
    { type: 'trapped', emoji: '🚪', label: 'Sin salida' },
    { type: 'sad', emoji: '😢', label: 'Triste' },
    { type: 'overwhelmed', emoji: '😣', label: 'Abrumada' },
    { type: 'calm', emoji: '😌', label: 'En calma' },
    { type: 'anxious', emoji: '😰', label: 'Ansiosa' }
  ];

  // Weekly evolution live calculation & mock data structured by day
  const weeklyData = [
    { day: 'Lun', label: 'Lunes', date: '21 Jul', score: 85, mood: 'calm' as MoodType, emoji: '😌', moodLabel: 'En calma', color: 'bg-emerald-600', textColor: 'text-emerald-700' },
    { day: 'Mar', label: 'Martes', date: '22 Jul', score: 45, mood: 'anxious' as MoodType, emoji: '😰', moodLabel: 'Ansiosa', color: 'bg-orange-500', textColor: 'text-orange-700' },
    { day: 'Mié', label: 'Miércoles', date: '23 Jul', score: 35, mood: 'trapped' as MoodType, emoji: '🚪', moodLabel: 'Sin salida', color: 'bg-rose-500', textColor: 'text-rose-700' },
    { day: 'Jue', label: 'Jueves', date: '24 Jul', score: 90, mood: 'calm' as MoodType, emoji: '😌', moodLabel: 'En calma', color: 'bg-emerald-600', textColor: 'text-emerald-700' },
    { day: 'Vie', label: 'Viernes', date: '25 Jul', score: 60, mood: 'guilty' as MoodType, emoji: '😔', moodLabel: 'Culposa', color: 'bg-amber-500', textColor: 'text-amber-700' },
    { day: 'Sáb', label: 'Sábado', date: '26 Jul', score: 75, mood: 'calm' as MoodType, emoji: '😌', moodLabel: 'En calma', color: 'bg-teal-600', textColor: 'text-teal-700' },
    { day: 'Dom', label: 'Domingo', date: '27 Jul', score: 80, mood: 'calm' as MoodType, emoji: '😌', moodLabel: 'En calma', color: 'bg-emerald-600', textColor: 'text-emerald-700' }
  ];

  const averageScore = Math.round(
    weeklyData.reduce((acc, curr) => acc + curr.score, 0) / weeklyData.length
  );

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
                {userProfile.clinicalProfile.diagnosedDisease && (
                  <span className="block text-[10px] text-[#5A5A40]/90 font-medium truncate max-w-xs mt-0.5">
                    Diagnóstico: {userProfile.clinicalProfile.diagnosedDisease}
                  </span>
                )}
                {userProfile.clinicalProfile.medications && (
                  <span className="block text-[10px] text-[#5A5A40]/90 font-medium truncate max-w-xs mt-0.5">
                    Meds: {userProfile.clinicalProfile.medications} ({userProfile.clinicalProfile.medicationDurationValue} {userProfile.clinicalProfile.medicationDurationUnit || 'meses'})
                  </span>
                )}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <div className="sans text-[10px] text-[#5A5A40]/70 mt-0.5">Depresión Perinatal</div>
          </div>
        </button>

        <button
          onClick={onOpenGad7Test}
          className="p-4 rounded-2xl bg-white border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 transition-all text-left shadow-2xs group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40] mb-2 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="sans text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">Test GAD-7</div>
            <div className="sans text-[10px] text-[#5A5A40]/70 mt-0.5">Ansiedad Generalizada</div>
          </div>
        </button>
      </div>

      {/* Latest Test Results Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {latestEpds && (
          <div className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40] shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="sans text-xs font-bold text-[#2D2D2D]">Último Test EPDS</div>
                <div className="sans text-[11px] text-[#5A5A40]">
                  Puntaje: <span className="font-bold">{latestEpds.totalScore}/30</span> • {latestEpds.dateStr}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenEpdsTest}
              className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1 shrink-0"
            >
              Ver
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {latestGad7 && (
          <div className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40] shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="sans text-xs font-bold text-[#2D2D2D]">Último Test GAD-7</div>
                <div className="sans text-[11px] text-[#5A5A40]">
                  Puntaje: <span className="font-bold">{latestGad7.totalScore}/21</span> • {latestGad7.dateStr}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenGad7Test}
              className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1 shrink-0"
            >
              Ver
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Weekly Mood Bar Chart - Clear & Intuitive Graphic */}
      <div className="p-6 rounded-3xl border border-[#5A5A40]/15 bg-[#FFFDF5] soft-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#5A5A40]/10">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="serif text-base font-bold text-[#5A5A40]">Evolución Semanal de Bienestar</h3>
            </div>
            <p className="sans text-xs text-[#5A5A40]/80 mt-0.5">
              Escala de bienestar diario de 0% (Alta Opresión) a 100% (Calma Total)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E8DCC4] text-[#5A5A40] text-xs font-bold shadow-2xs">
              Promedio: {averageScore}% Favorable
            </span>
            <span className="sans text-[10px] uppercase tracking-widest text-[#5A5A40]/70 font-semibold hidden sm:inline">
              7 días
            </span>
          </div>
        </div>

        {/* Main Graphical Canvas with Y-Axis and Bars */}
        <div className="relative pt-6 pb-2 px-1">
          {/* Horizontal Reference Lines (Y-Axis) */}
          <div className="absolute inset-x-0 top-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-[#5A5A40] w-full flex justify-between text-[9px] text-[#5A5A40] font-bold">
              <span>100% Óptimo</span>
            </div>
            <div className="border-b border-dashed border-[#5A5A40] w-full flex justify-between text-[9px] text-[#5A5A40]">
              <span>75% Favorable</span>
            </div>
            <div className="border-b border-dashed border-[#5A5A40] w-full flex justify-between text-[9px] text-[#5A5A40]">
              <span>50% Moderado</span>
            </div>
            <div className="border-b border-[#D67C65] w-full flex justify-between text-[9px] text-[#D67C65] font-bold">
              <span>25% Alerta</span>
            </div>
          </div>

          {/* Bar Chart Grid */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 relative z-10 pt-2 border-b border-[#5A5A40]/20">
            {weeklyData.map((item, idx) => {
              const isLow = item.score < 50;
              const isModerate = item.score >= 50 && item.score < 70;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Score pill on top of bar */}
                  <span className={`text-[10px] font-extrabold mb-1 px-1.5 py-0.5 rounded-md transition-all shadow-2xs ${
                    isLow ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    isModerate ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {item.score}%
                  </span>

                  {/* Vertical Bar with animation and color fill */}
                  <div className="w-full max-w-[36px] bg-[#5A5A40]/10 rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${item.score}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 shadow-xs ${
                        isLow ? 'bg-rose-500 group-hover:bg-rose-600' :
                        isModerate ? 'bg-amber-500 group-hover:bg-amber-600' :
                        'bg-emerald-600 group-hover:bg-emerald-700'
                      }`}
                    />
                  </div>

                  {/* Day Label & Mood Emoji Badge under bar */}
                  <div className="mt-2 text-center">
                    <span className="text-lg block group-hover:scale-125 transition-transform">{item.emoji}</span>
                    <span className="sans text-[11px] font-bold text-[#2D2D2D] block leading-tight mt-0.5">
                      {item.day}
                    </span>
                    <span className={`sans text-[9px] font-semibold truncate block max-w-[48px] ${item.textColor}`}>
                      {item.moodLabel}
                    </span>
                  </div>

                  {/* Hover Tooltip Card */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none w-32 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#2D2D2D] text-white p-2 rounded-xl text-[10px] shadow-xl text-center space-y-0.5">
                      <p className="font-bold text-[#E8DCC4]">{item.label} ({item.date})</p>
                      <p className="text-white/90">{item.emoji} {item.moodLabel} ({item.score}%)</p>
                    </div>
                    <div className="w-2 h-2 bg-[#2D2D2D] rotate-45 -mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Key for Easy Understanding */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#5A5A40] bg-[#F5F5F0]/70 p-3 rounded-2xl border border-[#5A5A40]/10">
          <span className="font-bold uppercase tracking-wider text-[#2D2D2D]">Clave de Interpretación:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="font-medium">70-100%: En Calma / Favorable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-medium">50-69%: Nivel Moderado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="font-medium">0-49%: Opresión / Ansiedad</span>
          </div>
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
