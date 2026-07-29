import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Wind,
  Activity,
  Heart,
  Check,
  Info,
  Play,
  ArrowRight,
  Clock,
  ShieldCheck,
  Dumbbell,
  Smile,
  AlertCircle,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { JournalEntry, MoodType } from '../types';
import { playAmbientSound, stopAllAmbientSounds } from '../utils/audioSynthesizer';

interface EmotionCalendarViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp' | 'syncedToCloud'>) => void;
  onDeleteEntry: (id: string) => void;
  onOpenBreathingTab?: () => void;
}

export const EmotionCalendarView: React.FC<EmotionCalendarViewProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onOpenBreathingTab
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Modal / Exercise guides state
  const [activeExerciseModal, setActiveExerciseModal] = useState<
    'none' | 'breathing' | 'yoga' | 'exercise' | 'quick_log'
  >('none');
  const [selectedYogaRoutine, setSelectedYogaRoutine] = useState<any>(null);
  const [selectedPhysicalRoutine, setSelectedPhysicalRoutine] = useState<any>(null);

  // Quick Log form state for selected date
  const [logMood, setLogMood] = useState<MoodType>('calm');
  const [logIntensity, setLogIntensity] = useState<number>(3);
  const [logNote, setLogNote] = useState<string>('');
  const [logDaySummaryPhrase, setLogDaySummaryPhrase] = useState<string>('');
  const [logTags, setLogTags] = useState<string[]>(['#emociones']);

  // Breathing interactive modal state
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Sostén' | 'Exhala' | 'Pausa'>('Inhala');
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathTimer, setBreathTimer] = useState(180);
  const [soundType, setSoundType] = useState<'none' | 'womb' | 'rain' | 'waves'>('none');

  // Breathing interval timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingRunning && activeExerciseModal === 'breathing') {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setIsBreathingRunning(false);
            stopAllAmbientSounds();
            setSoundType('none');
            return 0;
          }
          return prev - 1;
        });

        const currentSec = breathTimer % 16;
        if (currentSec >= 12) setBreathPhase('Inhala');
        else if (currentSec >= 8) setBreathPhase('Sostén');
        else if (currentSec >= 4) setBreathPhase('Exhala');
        else setBreathPhase('Pausa');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingRunning, breathTimer, activeExerciseModal]);

  const toggleSound = (type: 'womb' | 'rain' | 'waves') => {
    if (soundType === type) {
      stopAllAmbientSounds();
      setSoundType('none');
    } else {
      setSoundType(type);
      playAmbientSound(type);
    }
  };

  const moodEmojis: Record<MoodType, { emoji: string; label: string; color: string; bg: string }> = {
    angry: { emoji: '😡', label: 'Enojada', color: 'text-red-700', bg: 'bg-red-100 border-red-300' },
    guilty: { emoji: '😔', label: 'Culposa', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' },
    trapped: { emoji: '🚪', label: 'Sin salida', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-300' },
    sad: { emoji: '😢', label: 'Triste', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
    overwhelmed: { emoji: '😣', label: 'Abrumada', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-300' },
    calm: { emoji: '😌', label: 'En calma', color: 'text-teal-700', bg: 'bg-teal-100 border-teal-300' },
    anxious: { emoji: '😰', label: 'Ansiosa', color: 'text-indigo-700', bg: 'bg-indigo-100 border-indigo-300' }
  };

  const availableTags = ['#sueño', '#duelo', '#ansiedad', '#gratitud', '#pareja', '#lactancia', '#sobrecarga', '#fuerza'];

  // Calendar math logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adjusted for Monday start (0=Mon, 6=Sun)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map entries by date string YYYY-MM-DD
  const entriesByDate: Record<string, JournalEntry[]> = {};
  entries.forEach((e) => {
    if (!entriesByDate[e.dateStr]) {
      entriesByDate[e.dateStr] = [];
    }
    entriesByDate[e.dateStr].push(e);
  });

  // Emotional Evolution Analysis Logic (Past 14 days)
  const analyzeEmotionalEvolution = () => {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentEntries = entries.filter((e) => {
      const entryDate = new Date(e.dateStr);
      return entryDate >= fourteenDaysAgo && entryDate <= now;
    });

    if (recentEntries.length === 0) {
      return {
        type: 'balanced',
        dominantMood: 'calm' as MoodType,
        avgIntensity: 2.5,
        stressRatio: 0,
        summary: 'Aún no hay suficientes registros recientes. Mantiene un patrón neutro o de calma.',
        recommendationFocus: 'Mantener hábitos de serenidad y conectar con tu cuerpo suavemente.'
      };
    }

    let stressCount = 0; // anxious, overwhelmed, sad
    let calmCount = 0; // radiant, calm, neutral
    let totalIntensity = 0;

    const moodCounts: Record<MoodType, number> = {
      angry: 0,
      guilty: 0,
      trapped: 0,
      sad: 0,
      overwhelmed: 0,
      calm: 0,
      anxious: 0
    };

    recentEntries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      totalIntensity += e.intensity;
      if (['anxious', 'overwhelmed', 'sad', 'angry', 'guilty', 'trapped'].includes(e.mood) || e.intensity >= 4) {
        stressCount++;
      } else {
        calmCount++;
      }
    });

    const avgIntensity = totalIntensity / recentEntries.length;
    const stressRatio = stressCount / recentEntries.length;

    // Find dominant mood
    let dominantMood: MoodType = 'calm';
    let maxCount = -1;
    (Object.keys(moodCounts) as MoodType[]).forEach((m) => {
      if (moodCounts[m] > maxCount) {
        maxCount = moodCounts[m];
        dominantMood = m;
      }
    });

    if (stressRatio >= 0.4 || avgIntensity >= 3.6) {
      return {
        type: 'high_stress',
        dominantMood,
        avgIntensity: Number(avgIntensity.toFixed(1)),
        stressRatio: Math.round(stressRatio * 100),
        summary: `Evolución con tendencia a ${moodEmojis[dominantMood].label.toLowerCase()} y sobrecarga emocional (${Math.round(stressRatio * 100)}% de tensión en los últimos días).`,
        recommendationFocus: 'Prioridad: Descompresión del sistema nervioso, respiración diafragmática y yoga somático restaurativo.'
      };
    } else if (stressRatio > 0.2 || avgIntensity >= 2.8) {
      return {
        type: 'fluctuating',
        dominantMood,
        avgIntensity: Number(avgIntensity.toFixed(1)),
        stressRatio: Math.round(stressRatio * 100),
        summary: `Evolución fluctuante con momentos de calma alternados con sensibilidad (${moodEmojis[dominantMood].label}).`,
        recommendationFocus: 'Prioridad: Estabilización emocional, movilidad articular suave y grounding consciente.'
      };
    } else {
      return {
        type: 'balanced',
        dominantMood,
        avgIntensity: Number(avgIntensity.toFixed(1)),
        stressRatio: Math.round(stressRatio * 100),
        summary: `Evolución positiva y en equilibrio predominantemente ${moodEmojis[dominantMood].label.toLowerCase()}.`,
        recommendationFocus: 'Prioridad: Mantener la vitalidad, yoga de fortalecimiento pélvico suave y gratitud.'
      };
    }
  };

  const evolution = analyzeEmotionalEvolution();

  // Smart Exercise Content Definitions
  const getSmartSuggestions = () => {
    if (evolution.type === 'high_stress') {
      return {
        breathing: {
          title: 'Respiración de Rescate 4-4-4-4 & Diafragmática',
          duration: '3 - 5 min',
          benefits: 'Desactiva la respuesta de lucha o huida, reduce el pulso y alivia la opresión en el pecho.',
          type: 'Caja Regulación Vagal'
        },
        yoga: {
          title: 'Yoga Somático de Descompresión y Alivio Lumbar',
          duration: '12 min',
          level: 'Suave / Restaurativo',
          poses: [
            {
              name: 'Postura del Niño Modificada (Balasana)',
              duration: '3 min',
              desc: 'Rodillas abiertas para dar espacio al abdomen o cuerpo, frente apoyada sobre almohadón. Respira suave en la zona lumbar.'
            },
            {
              name: 'Gato - Vaca Somático Suave',
              duration: '3 min',
              desc: 'En 4 apoyos, arquea y redondea levemente la espalda coordinado con la inhalación y exhalación. Inhala para abrir tórax, exhala para relajar cuello.'
            },
            {
              name: 'Piernas Elevadas en Pared (Viparita Karani)',
              duration: '5 min',
              desc: 'Tumbada de lado, apoya las piernas suavemente contra una pared con cojín bajo la cadera. Favorece el retorno venoso y calma inmediata.'
            }
          ]
        },
        exercise: {
          title: 'Rutina Somática de Liberación Física por Sacudida (Shaking) y Caminata Lenta',
          duration: '10 min',
          benefits: 'Descarga la tensión acumulada en hombros, espalda alta y articulaciones sin sobrecargar.',
          steps: [
            { step: '1. Liberación por Sacudida (Shaking)', time: '2 min', desc: 'De pie o sentada, sacude suavemente tus manos, brazos y hombros exhalando por la boca para soltar cortisol.' },
            { step: '2. Círculos de Cuello y Hombros', time: '3 min', desc: 'Rota tus hombros hacia atrás 10 veces lentamente con los ojos cerrados.' },
            { step: '3. Caminata Consciente de Anclaje', time: '5 min', desc: 'Camina a ritmo lento dentro de casa o al aire libre sintiendo el contacto de la planta del pie con la tierra.' }
          ]
        }
      };
    } else if (evolution.type === 'fluctuating') {
      return {
        breathing: {
          title: 'Coherencia Cardíaca 5-5 con Sonidos del Utero',
          duration: '5 min',
          benefits: 'Sincroniza el ritmo cardíaco con la respiración, mejorando el estado de ánimo y disminuyendo la labilidad emocional.',
          type: 'Ritmo Armónico'
        },
        yoga: {
          title: 'Yoga Perinatal de Apertura Suave de Pecho y Caderas',
          duration: '15 min',
          level: 'Intermedio Suave',
          poses: [
            {
              name: 'Estiramiento Lateral de Columna (Sentada)',
              duration: '3 min',
              desc: 'Mano derecha al suelo, eleva brazo izquierdo inhalando e inclínate suavemente alargando el costado.'
            },
            {
              name: 'Postura de la Mariposa Suave (Baddha Konasana)',
              duration: '5 min',
              desc: 'Plantas de los pies juntas, balancea suavemente las rodillas soltando la tensión acumulada en la pelvis.'
            },
            {
              name: 'Torsión Suave Supinada',
              duration: '4 min',
              desc: 'Tumbada de lado con almohada entre las rodillas, abre el brazo opuesto para flexibilizar la caja torácica.'
            }
          ]
        },
        exercise: {
          title: 'Movilidad de Cadera y Balanceo Pélvico Consciente',
          duration: '12 min',
          benefits: 'Mejora la circulación pelviana, flexibiliza el área lumbar y libera energía estancada.',
          steps: [
            { step: '1. Balanceos Pélvicos en 4 Apoyos', time: '4 min', desc: 'Realiza círculos suaves con la cadera dibujando ochos imaginarios.' },
            { step: '2. Balanceo sobre Balón de Pilates o Silla', time: '5 min', desc: 'Si tienes balón o silla, realiza movimientos de suave bote y basculación anterior/posterior.' },
            { step: '3. Estiramiento de Psoas Suave', time: '3 min', desc: 'Paso largo al frente con rodilla posterior apoyada para estirar la ingle suavemente.' }
          ]
        }
      };
    } else {
      return {
        breathing: {
          title: 'Respiración de Vitalidad y Coherencia Respiratoria',
          duration: '3 min',
          benefits: 'Aumenta los niveles de energía positiva, concentración y oxigenación celular.',
          type: 'Energizante Suave'
        },
        yoga: {
          title: 'Yoga de Vitalidad, Fuerza y Gratitud Prenatal/Posparto',
          duration: '20 min',
          level: 'Moderado',
          poses: [
            {
              name: 'Guerrero II Suave Modificado (Virabhadrasana II)',
              duration: '4 min',
              desc: 'Pies separados, flexiona rodilla delantera manteniendo la mirada fija al frente. Fortalece piernas y confianza.'
            },
            {
              name: 'Postura de la Diosa (Utkata Konasana)',
              duration: '4 min',
              desc: 'Sentadilla ancha con espalda erguida, manos en el centro del pecho. Tonifica musculos pélvicos y postura.'
            },
            {
              name: 'Apertura de Corazón y Cierre en Gratitud',
              duration: '5 min',
              desc: 'Sentada sobre talones o cojín, entrelaza manos por detrás y abre el tórax elevando la mirada con ternura.'
            }
          ]
        },
        exercise: {
          title: 'Fortalecimiento Suave del Suelo Pélvico, Glúteos y Core',
          duration: '15 min',
          benefits: 'Tonifica la musculatura profunda, previene incontinencias y mantiene firmeza y estabilidad física.',
          steps: [
            { step: '1. Puentes de Glúteo Conscientes (Glute Bridges)', time: '5 min', desc: '10 a 12 repeticiones exhalando al subir y activando suavemente el suelo pélvico.' },
            { step: '2. Sentadillas Asistidas con Silla', time: '5 min', desc: 'Baja a tocar la silla de forma controlada para activar cuadriceps y glúteos.' },
            { step: '3. Caminata Vigorosa al Aire Libre', time: '5 min', desc: 'Camina con buen ritmo inhalando aire fresco y sonriendo.' }
          ]
        }
      };
    }
  };

  const suggestions = getSmartSuggestions();

  // Quick Log Save
  const handleSaveQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEntry({
      dateStr: selectedDateStr,
      mood: logMood,
      intensity: logIntensity,
      tags: logTags,
      note: logNote.trim() || `Registro emocional rápido del día ${selectedDateStr}`,
      daySummaryPhrase: logDaySummaryPhrase.trim() || undefined
    });
    setActiveExerciseModal('none');
    setLogNote('');
    setLogDaySummaryPhrase('');
  };

  const selectedDayEntries = entriesByDate[selectedDateStr] || [];
  const primaryEntryForSelectedDay = selectedDayEntries[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Page Title & Subtitle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#5A5A40]" />
            <h1 className="serif text-2xl font-bold text-[#5A5A40]">
              Calendario Emocional & Evolución
            </h1>
          </div>
          <p className="sans text-xs text-[#5A5A40]/80 mt-1">
            Visualiza el historial de tus días y recibe recomendaciones inteligentes de autorregulación.
          </p>
        </div>

        <button
          onClick={() => setActiveExerciseModal('quick_log')}
          className="px-4 py-2.5 rounded-2xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Emoción</span>
        </button>
      </div>

      {/* 1. Main Interactive Calendar Grid Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-5">
        {/* Month Selector Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="serif text-xl font-bold text-[#5A5A40]">
              {monthNames[month]} {year}
            </span>
            <span className="text-[10px] bg-[#E8DCC4] text-[#5A5A40] font-bold px-2.5 py-0.5 rounded-full">
              {entries.length} registros totales
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white border border-[#5A5A40]/15 text-[#5A5A40] hover:bg-[#F5F5F0] transition-colors"
              title="Mes Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#5A5A40]/15 text-[11px] font-bold text-[#5A5A40] hover:bg-[#F5F5F0]"
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white border border-[#5A5A40]/15 text-[#5A5A40] hover:bg-[#F5F5F0] transition-colors"
              title="Mes Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Weekday Headers */}
        <div className="grid grid-cols-7 text-center sans text-[11px] font-bold text-[#5A5A40]/70 py-1 border-b border-[#5A5A40]/10">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
          <div>Dom</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty padding slots for days before start of month */}
          {Array.from({ length: startDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateStr = dateObj.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = dateStr === selectedDateStr;

            const dayEntries = entriesByDate[dateStr] || [];
            const primaryEntry = dayEntries[0]; // main entry for that date

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => {
                  setSelectedDateStr(dateStr);
                }}
                className={`h-16 sm:h-20 p-1.5 rounded-2xl border transition-all flex flex-col justify-between items-center relative group text-left ${
                  isSelected
                    ? 'ring-2 ring-[#5A5A40] border-[#5A5A40] bg-white shadow-sm'
                    : isToday
                    ? 'bg-[#E8DCC4]/40 border-[#5A5A40]/40'
                    : 'bg-white border-[#5A5A40]/10 hover:border-[#5A5A40]/30'
                }`}
              >
                {/* Day Number and Today Indicator */}
                <div className="w-full flex justify-between items-center">
                  <span
                    className={`text-[11px] font-bold ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-[#5A5A40] text-white flex items-center justify-center text-[10px]'
                        : 'text-[#5A5A40]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEntries.length > 1 && (
                    <span className="text-[9px] font-bold text-[#5A5A40] bg-[#E8DCC4] px-1 rounded-full">
                      +{dayEntries.length - 1}
                    </span>
                  )}
                </div>

                {/* Emotion Badge / Emoji if recorded */}
                {primaryEntry ? (
                  <div className="flex flex-col items-center justify-center my-auto w-full">
                    <span className="text-xl sm:text-2xl transition-transform group-hover:scale-110">
                      {moodEmojis[primaryEntry.mood]?.emoji || '😐'}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(primaryEntry.intensity, 5) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            primaryEntry.intensity >= 4 ? 'bg-[#D67C65]' : 'bg-[#5A5A40]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity">
                    <Plus className="w-4 h-4 text-[#5A5A40]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Day Details Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-[#5A5A40]/10 pb-3">
          <div>
            <div className="serif text-base font-bold text-[#5A5A40] flex items-center gap-2">
              <span>Detalle del Día {selectedDateStr}</span>
              {selectedDateStr === new Date().toISOString().split('T')[0] && (
                <span className="text-[10px] bg-[#5A5A40] text-white font-bold px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </div>
            <p className="sans text-xs text-[#5A5A40]/70 mt-0.5">
              {selectedDayEntries.length > 0
                ? `${selectedDayEntries.length} registro(s) guardado(s) para esta fecha.`
                : 'No se ha registrado ninguna emoción para este día aún.'}
            </p>
          </div>

          <button
            onClick={() => {
              if (primaryEntryForSelectedDay) {
                setLogMood(primaryEntryForSelectedDay.mood);
                setLogIntensity(primaryEntryForSelectedDay.intensity);
                setLogTags(primaryEntryForSelectedDay.tags || ['#emociones']);
                setLogNote(primaryEntryForSelectedDay.note || '');
                setLogDaySummaryPhrase(primaryEntryForSelectedDay.daySummaryPhrase || '');
              } else {
                setLogMood('calm');
                setLogIntensity(3);
                setLogTags(['#emociones']);
                setLogNote('');
                setLogDaySummaryPhrase('');
              }
              setActiveExerciseModal('quick_log');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#E8DCC4] hover:bg-[#DDD0B7] text-[#5A5A40] font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Registro</span>
          </button>
        </div>

        {/* Show Entries for selected day */}
        {selectedDayEntries.length > 0 ? (
          <div className="space-y-3 pt-1">
            {selectedDayEntries.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-2xl bg-white border border-[#5A5A40]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[e.mood]?.emoji}</span>
                    <div>
                      <span className="serif text-sm font-bold text-[#2D2D2D]">
                        {moodEmojis[e.mood]?.label}
                      </span>
                      <span className="sans text-xs text-[#5A5A40]/80 ml-2">
                        (Intensidad: {e.intensity}/5)
                      </span>
                    </div>
                  </div>
                  {e.daySummaryPhrase && (
                    <div className="p-2.5 rounded-xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15">
                      <span className="sans text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-0.5">
                        Resumen del día:
                      </span>
                      <p className="sans text-xs font-semibold text-[#2D2D2D] italic">
                        "{e.daySummaryPhrase}"
                      </p>
                    </div>
                  )}
                  <p className="sans text-xs text-[#2D2D2D]/90 leading-relaxed bg-[#F5F5F0]/60 p-2.5 rounded-xl">
                    "{e.note}"
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="sans text-[10px] px-2 py-0.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteEntry(e.id)}
                  className="text-xs text-[#D67C65] hover:underline self-end sm:self-center shrink-0 font-bold"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#5A5A40]/20 text-xs text-[#5A5A40]/70">
            <p>Haz clic en "Añadir Registro" para documentar tu sentir en este día.</p>
          </div>
        )}
      </div>

      {/* 3. Emotional Evolution Intelligence & Smart Recommendations Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/20 soft-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5A5A40]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#5A5A40] text-[#E8DCC4] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="serif text-lg font-bold text-[#5A5A40]">
                Análisis de Evolución & Recomendaciones Adaptativas
              </h2>
              <p className="sans text-xs text-[#5A5A40]/80">
                El sistema evalúa tu patrón emocional reciente para sugerir ejercicios a medida.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                evolution.type === 'high_stress'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : evolution.type === 'fluctuating'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {evolution.type === 'high_stress'
                ? 'Atención a Carga Emocional'
                : evolution.type === 'fluctuating'
                ? 'Evolución Fluctuante'
                : 'Estado Estable / Balanceado'}
            </span>
          </div>
        </div>

        {/* Evolution Metrics & Insight Box */}
        <div className="p-5 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 p-3 rounded-xl bg-[#F5F5F0]/70">
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70 uppercase">
                Estado Dominante Reciente
              </span>
              <div className="serif text-sm font-bold text-[#5A5A40] flex items-center gap-2">
                <span className="text-xl">{moodEmojis[evolution.dominantMood]?.emoji}</span>
                <span>{moodEmojis[evolution.dominantMood]?.label}</span>
              </div>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-[#F5F5F0]/70">
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70 uppercase">
                Intensidad Promedio
              </span>
              <div className="serif text-sm font-bold text-[#5A5A40] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#5A5A40]" />
                <span>{evolution.avgIntensity} / 5.0</span>
              </div>
            </div>

            <div className="space-y-1 p-3 rounded-xl bg-[#F5F5F0]/70">
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70 uppercase">
                Nivel de Tensión / Estrés
              </span>
              <div className="serif text-sm font-bold text-[#5A5A40] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                <span>{evolution.stressRatio}% de días recientes</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15 space-y-1">
            <p className="sans text-xs text-[#5A5A40] font-semibold leading-relaxed">
              💡 <span className="font-bold">Diagnóstico de Autorregulación:</span> {evolution.summary}
            </p>
            <p className="sans text-xs text-[#5A5A40]/80">
              🎯 <span className="font-bold">Enfoque sugerido:</span> {evolution.recommendationFocus}
            </p>
          </div>
        </div>

        {/* 3 Categories of Smart Suggestions */}
        <div className="space-y-4">
          <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center gap-2">
            <span>Recomendaciones Personalizadas para Hoy</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category 1: Breathing Exercise */}
            <div className="p-5 rounded-2xl bg-white border border-[#5A5A40]/15 soft-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-0.5 rounded-full">
                    1. Respiración
                  </span>
                  <span className="sans text-[11px] text-[#5A5A40]/80 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestions.breathing.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#5A5A40] font-bold text-sm pt-1">
                  <Wind className="w-5 h-5 shrink-0" />
                  <span className="serif">{suggestions.breathing.title}</span>
                </div>

                <p className="sans text-xs text-[#5A5A40]/80 leading-relaxed">
                  {suggestions.breathing.benefits}
                </p>
              </div>

              <button
                onClick={() => {
                  if (onOpenBreathingTab) {
                    onOpenBreathingTab();
                  } else {
                    setActiveExerciseModal('breathing');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 mt-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Iniciar Respiración Guiada</span>
              </button>
            </div>

            {/* Category 2: Somatic / Perinatal Yoga */}
            <div className="p-5 rounded-2xl bg-white border border-[#5A5A40]/15 soft-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-0.5 rounded-full">
                    2. Yoga Somático
                  </span>
                  <span className="sans text-[11px] text-[#5A5A40]/80 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestions.yoga.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#5A5A40] font-bold text-sm pt-1">
                  <Heart className="w-5 h-5 shrink-0" />
                  <span className="serif">{suggestions.yoga.title}</span>
                </div>

                <p className="sans text-xs text-[#5A5A40]/80 leading-relaxed">
                  Nivel: <span className="font-bold">{suggestions.yoga.level}</span>.
                  Incluye {suggestions.yoga.poses.length} posturas adaptadas para no presionar la zona abdominal y liberar molestias.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedYogaRoutine(suggestions.yoga);
                  setActiveExerciseModal('yoga');
                }}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 mt-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ver Guía de Yoga</span>
              </button>
            </div>

            {/* Category 3: Physical Exercise & Conscious Movement */}
            <div className="p-5 rounded-2xl bg-white border border-[#5A5A40]/15 soft-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-0.5 rounded-full">
                    3. Ejercicio Físico
                  </span>
                  <span className="sans text-[11px] text-[#5A5A40]/80 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestions.exercise.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#5A5A40] font-bold text-sm pt-1">
                  <Dumbbell className="w-5 h-5 shrink-0" />
                  <span className="serif">{suggestions.exercise.title}</span>
                </div>

                <p className="sans text-xs text-[#5A5A40]/80 leading-relaxed">
                  {suggestions.exercise.benefits}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPhysicalRoutine(suggestions.exercise);
                  setActiveExerciseModal('exercise');
                }}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 mt-2"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Ver Rutina de Ejercicio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Quick Emotion Log Modal for Selected Date */}
      {activeExerciseModal === 'quick_log' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF5] border border-[#5A5A40]/20 w-full max-w-lg rounded-3xl p-6 soft-shadow space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveExerciseModal('none')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#5A5A40]/10 text-[#5A5A40]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="serif text-xl font-bold text-[#5A5A40]">
                Registrar Emoción del Día ({selectedDateStr})
              </h3>
              <p className="sans text-xs text-[#5A5A40]/70">
                Guarda tu estado para enriquecer el historial y análisis adaptativo.
              </p>
            </div>

            <form onSubmit={handleSaveQuickLog} className="space-y-4">
              <div>
                <label className="serif text-xs font-bold text-[#5A5A40] block mb-2">
                  Estado de Ánimo Principal:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(Object.keys(moodEmojis) as MoodType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLogMood(m)}
                      className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        logMood === m
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                          : 'bg-white text-[#2D2D2D] border-[#5A5A40]/15'
                      }`}
                    >
                      <span className="text-xl">{moodEmojis[m].emoji}</span>
                      <span className="sans text-[9px] font-medium">{moodEmojis[m].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="serif text-xs font-bold text-[#5A5A40]">
                    Intensidad ({logIntensity}/5):
                  </span>
                  <span className="sans text-[11px] text-[#5A5A40]">
                    {logIntensity <= 2 ? 'Suave' : logIntensity <= 4 ? 'Moderada' : 'Muy Intensa'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={logIntensity}
                  onChange={(e) => setLogIntensity(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />
              </div>

              <div>
                <label className="serif text-xs font-bold text-[#5A5A40] block mb-1">
                  Etiquetas opcionales:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (logTags.includes(tag)) {
                          setLogTags(logTags.filter((t) => t !== tag));
                        } else {
                          setLogTags([...logTags, tag]);
                        }
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        logTags.includes(tag)
                          ? 'bg-[#5A5A40] text-white font-bold'
                          : 'bg-[#F5F5F0] text-[#5A5A40]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="serif text-xs font-bold text-[#5A5A40]">
                    ¿Cómo describirías tu día hoy?
                  </label>
                  <span className="sans text-[10px] text-[#5A5A40]/70 font-medium">
                    Resumen en una frase breve
                  </span>
                </div>
                <input
                  type="text"
                  value={logDaySummaryPhrase}
                  onChange={(e) => setLogDaySummaryPhrase(e.target.value)}
                  placeholder="Ej: Un día tranquilo donde logré hacer pausas y recargar energía..."
                  className="w-full p-3 rounded-2xl bg-white border border-[#5A5A40]/20 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="serif text-xs font-bold text-[#5A5A40] block mb-1">
                  Notas / Reflexión breve del día:
                </label>
                <textarea
                  rows={3}
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="Escribe brevemente cómo te sentiste o qué ocurrió..."
                  className="w-full p-3 rounded-2xl bg-white border border-[#5A5A40]/20 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveExerciseModal('none')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A5A40] border border-[#5A5A40]/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar en Calendario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Yoga Routine Interactive Guide Modal */}
      {activeExerciseModal === 'yoga' && selectedYogaRoutine && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF5] border border-[#5A5A40]/20 w-full max-w-lg rounded-3xl p-6 soft-shadow space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveExerciseModal('none')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#5A5A40]/10 text-[#5A5A40]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-0.5 rounded-full">
                Guía de Yoga Somático Perinatal
              </span>
              <h3 className="serif text-xl font-bold text-[#5A5A40] pt-1">
                {selectedYogaRoutine.title}
              </h3>
              <p className="sans text-xs text-[#5A5A40]/80">
                Duración: <span className="font-bold">{selectedYogaRoutine.duration}</span> • Nivel: {selectedYogaRoutine.level}
              </p>
            </div>

            <div className="space-y-3">
              {selectedYogaRoutine.poses.map((pose: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="serif text-sm font-bold text-[#5A5A40] flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#5A5A40]" />
                      <span>{pose.name}</span>
                    </span>
                    <span className="sans text-[11px] font-bold text-[#5A5A40] bg-[#E8DCC4]/50 px-2 py-0.5 rounded-full">
                      {pose.duration}
                    </span>
                  </div>
                  <p className="sans text-xs text-[#2D2D2D]/90 leading-relaxed pl-6">
                    {pose.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15 text-xs text-[#5A5A40] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>Precauciones y Cuidado Somático:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Escucha tu cuerpo en todo momento. Si sientes mareos, molestias o tirantez excesiva, detén la postura y descansa de lado. Mantén respiración fluida por la nariz.
              </p>
            </div>

            <button
              onClick={() => setActiveExerciseModal('none')}
              className="w-full py-3 rounded-2xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all shadow-md active:scale-95"
            >
              Completar Práctica de Yoga
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Physical Exercise Guide Modal */}
      {activeExerciseModal === 'exercise' && selectedPhysicalRoutine && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF5] border border-[#5A5A40]/20 w-full max-w-lg rounded-3xl p-6 soft-shadow space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveExerciseModal('none')}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#5A5A40]/10 text-[#5A5A40]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E8DCC4] px-2.5 py-0.5 rounded-full">
                Rutina de Ejercicio Físico Consciente
              </span>
              <h3 className="serif text-xl font-bold text-[#5A5A40] pt-1">
                {selectedPhysicalRoutine.title}
              </h3>
              <p className="sans text-xs text-[#5A5A40]/80">
                Duración: <span className="font-bold">{selectedPhysicalRoutine.duration}</span>
              </p>
            </div>

            <div className="space-y-3">
              {selectedPhysicalRoutine.steps.map((st: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="serif text-sm font-bold text-[#5A5A40] flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-[#5A5A40]" />
                      <span>{st.step}</span>
                    </span>
                    <span className="sans text-[11px] font-bold text-[#5A5A40] bg-[#E8DCC4]/50 px-2 py-0.5 rounded-full">
                      {st.time}
                    </span>
                  </div>
                  <p className="sans text-xs text-[#2D2D2D]/90 leading-relaxed pl-6">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15 text-xs text-[#5A5A40] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Recomendación de Salud Perinatal:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Asegúrate de mantenerte hidratada y evitar ejercicios de impacto brusco. Esta secuencia ha sido seleccionada respetando tu estatus físico actual.
              </p>
            </div>

            <button
              onClick={() => setActiveExerciseModal('none')}
              className="w-full py-3 rounded-2xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all shadow-md active:scale-95"
            >
              Completar Rutina de Ejercicio
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Interactive Breathing Exercise Modal */}
      {activeExerciseModal === 'breathing' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF5] border border-[#5A5A40]/20 w-full max-w-md rounded-3xl p-6 soft-shadow text-center space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsBreathingRunning(false);
                stopAllAmbientSounds();
                setActiveExerciseModal('none');
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#5A5A40]/10 text-[#5A5A40]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="sans text-xs font-bold uppercase tracking-widest text-[#5A5A40]/80">
              Respiración Guiada Adaptativa
            </span>

            {/* Bubble */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
              <div
                className={`absolute inset-0 rounded-full bg-[#5A5A40]/20 transition-transform duration-4000 ease-in-out ${
                  breathPhase === 'Inhala'
                    ? 'scale-100 bg-[#5A5A40]/30'
                    : breathPhase === 'Sostén'
                    ? 'scale-100 bg-[#5A5A40]/35'
                    : 'scale-60 bg-[#5A5A40]/15'
                }`}
              />
              <div className="relative z-10 flex flex-col items-center justify-center text-[#5A5A40]">
                <span className="serif text-2xl font-bold tracking-tight mb-1">{breathPhase}</span>
                <span className="sans text-xs opacity-80">
                  {Math.floor(breathTimer / 60)}:{(breathTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsBreathingRunning(!isBreathingRunning)}
                className="px-6 py-2.5 rounded-full bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex items-center gap-2 shadow-md"
              >
                {isBreathingRunning ? 'Pausar' : 'Iniciar Respiración'}
              </button>

              <button
                onClick={() => {
                  setIsBreathingRunning(false);
                  setBreathTimer(180);
                  setBreathPhase('Inhala');
                }}
                className="p-2.5 rounded-full bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4]"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Sound Toggles */}
            <div className="pt-2 border-t border-[#5A5A40]/10 flex justify-center gap-2">
              {[
                { id: 'womb', label: 'Utero' },
                { id: 'rain', label: 'Lluvia' },
                { id: 'waves', label: 'Olas' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSound(s.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    soundType === s.id ? 'bg-[#5A5A40] text-white' : 'bg-[#E8DCC4]/50 text-[#5A5A40]'
                  }`}
                >
                  {soundType === s.id ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
