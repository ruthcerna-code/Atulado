import React, { useState } from 'react';
import { BookOpen, Plus, Tag, Check, Calendar as CalendarIcon, Trash2, Cloud, CloudOff, Image as ImageIcon, Sparkles, Activity } from 'lucide-react';
import { JournalEntry, MoodType } from '../types';
import { EmotionCalendarView } from './EmotionCalendarView';

interface JournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp' | 'syncedToCloud'>) => void;
  onDeleteEntry: (id: string) => void;
  syncEnabled: boolean;
  onOpenBreathingTab?: () => void;
  initialSubTab?: 'list' | 'calendar';
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  syncEnabled,
  onOpenBreathingTab,
  initialSubTab = 'calendar'
}) => {
  const [viewTab, setViewTab] = useState<'list' | 'calendar'>(initialSubTab);
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [intensity, setIntensity] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#ansiedad']);
  const [noteText, setNoteText] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const availableTags = [
    '#sueño',
    '#duelo',
    '#ansiedad',
    '#gratitud',
    '#pareja',
    '#lactancia',
    '#sobrecarga',
    '#esperanza',
    '#cuerpo',
    '#fuerza'
  ];

  const moodEmojis: Record<MoodType, { emoji: string; label: string }> = {
    angry: { emoji: '😡', label: 'Enojada' },
    guilty: { emoji: '😔', label: 'Culposa' },
    trapped: { emoji: '🚪', label: 'Sin salida' },
    sad: { emoji: '😢', label: 'Triste' },
    overwhelmed: { emoji: '😣', label: 'Abrumada' },
    calm: { emoji: '😌', label: 'En calma' },
    anxious: { emoji: '😰', label: 'Ansiosa' }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const dateStr = new Date().toISOString().split('T')[0];
    onSaveEntry({
      dateStr,
      mood: selectedMood,
      intensity,
      tags: selectedTags,
      note: noteText.trim()
    });

    setNoteText('');
    setShowForm(false);
  };

  const filteredEntries = filterTag
    ? entries.filter((item) => item.tags.includes(filterTag))
    : entries;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Sub-tab Switcher: Calendario Emocional vs Lista de Notas */}
      <div className="flex p-1 rounded-2xl bg-[#E8DCC4]/50 border border-[#5A5A40]/10 text-xs font-bold text-[#5A5A40]">
        <button
          onClick={() => setViewTab('calendar')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewTab === 'calendar' ? 'bg-[#5A5A40] text-white shadow-2xs' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendario & Recomendaciones Adaptativas</span>
        </button>

        <button
          onClick={() => setViewTab('list')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewTab === 'list' ? 'bg-[#5A5A40] text-white shadow-2xs' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vista Lista de Notas ({entries.length})</span>
        </button>
      </div>

      {viewTab === 'calendar' ? (
        <EmotionCalendarView
          entries={entries}
          onSaveEntry={onSaveEntry}
          onDeleteEntry={onDeleteEntry}
          onOpenBreathingTab={onOpenBreathingTab}
        />
      ) : (
        <>
          {/* Title Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="serif text-2xl font-bold text-[#5A5A40]">Diario de Reflexiones</h1>
              <p className="sans text-xs text-[#5A5A40]/70">
                Un espacio íntimo para registrar tu sentir, sin presiones.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-2 rounded-2xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? 'Cerrar' : 'Nueva Entrada'}</span>
            </button>
          </div>

      {/* Entry Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-5"
        >
          <div className="serif text-sm font-bold text-[#5A5A40]">
            1. ¿Cuál es tu estado de ánimo principal hoy?
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(moodEmojis) as MoodType[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                  selectedMood === m
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm font-bold'
                    : 'bg-white text-[#2D2D2D] border-[#5A5A40]/15 hover:border-[#5A5A40]/40'
                }`}
              >
                <span className="text-2xl">{moodEmojis[m].emoji}</span>
                <span className="sans text-[10px]">{moodEmojis[m].label}</span>
              </button>
            ))}
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="serif text-xs font-bold text-[#5A5A40]">
                2. Intensidad Emocional ({intensity}/5):
              </span>
              <span className="sans text-[11px] text-[#5A5A40]">
                {intensity <= 2 ? 'Suave' : intensity <= 4 ? 'Moderada' : 'Muy Intensa'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#5A5A40]"
            />
          </div>

          {/* Tags selection */}
          <div>
            <div className="serif text-xs font-bold text-[#5A5A40] mb-2">
              3. Etiquetas de contexto:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#5A5A40] text-white font-bold'
                      : 'bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Reflection text */}
          <div>
            <label className="serif text-xs font-bold text-[#5A5A40] block mb-1">
              4. Escribe tus notas y reflexiones del día:
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="¿Qué ha estado rondando por tu mente hoy? Desahógate con total libertad..."
              className="w-full p-4 rounded-2xl bg-white border border-[#5A5A40]/20 text-xs leading-relaxed focus:outline-hidden focus:border-[#5A5A40]"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <span className="sans text-[10px] text-[#5A5A40]/70 flex items-center gap-1">
              {syncEnabled ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Sincronización en la nube activa</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Guardado en Room local</span>
                </>
              )}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter by tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="sans text-[10px] font-bold uppercase text-[#5A5A40]/60 shrink-0">
          Filtrar:
        </span>
        <button
          onClick={() => setFilterTag(null)}
          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
            filterTag === null ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] border border-[#5A5A40]/20'
          }`}
        >
          Todos ({entries.length})
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag === filterTag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
              filterTag === tag ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] border border-[#5A5A40]/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* History Entries List */}
      <div className="space-y-3">
        <h2 className="serif text-lg font-bold text-[#5A5A40]">Entradas Anteriores</h2>

        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFDF5] rounded-3xl border border-[#5A5A40]/10 text-xs text-[#5A5A40]/70">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No se encontraron registros para esta selección.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/10 soft-shadow space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{moodEmojis[entry.mood]?.emoji || '😐'}</span>
                  <div>
                    <span className="serif text-sm font-bold text-[#2D2D2D]">
                      {moodEmojis[entry.mood]?.label} (Intensidad {entry.intensity}/5)
                    </span>
                    <div className="sans text-[10px] text-[#5A5A40]/70 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{entry.dateStr}</span>
                      <span>•</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      entry.syncedToCloud ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E8DCC4] text-[#5A5A40]'
                    }`}
                  >
                    {entry.syncedToCloud ? 'Nube' : 'Room Local'}
                  </span>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 rounded-lg text-[#D67C65] hover:bg-[#D67C65]/10 opacity-70 hover:opacity-100 transition-all"
                    title="Eliminar entrada"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="sans text-xs text-[#2D2D2D]/90 leading-relaxed whitespace-pre-wrap bg-white/70 p-3 rounded-2xl border border-[#5A5A40]/5">
                {entry.note}
              </p>

              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="sans text-[10px] px-2.5 py-0.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
};
