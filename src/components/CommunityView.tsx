import React, { useState } from 'react';
import { Users, Calendar, Clock, Video, CheckCircle, UserCheck, MapPin } from 'lucide-react';
import { INITIAL_WORKSHOPS } from '../data/communityData';
import { CommunityWorkshop } from '../types';

export const CommunityView: React.FC = () => {
  const [workshops, setWorkshops] = useState<CommunityWorkshop[]>(INITIAL_WORKSHOPS);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Duelo Perinatal', 'Legal / Ley Dominga', 'Autocuidado'];

  const toggleEnrollment = (id: string) => {
    setWorkshops(
      workshops.map((w) => {
        if (w.id === id) {
          const newStatus = !w.isEnrolled;
          return {
            ...w,
            isEnrolled: newStatus,
            spotsLeft: newStatus ? w.spotsLeft - 1 : w.spotsLeft + 1
          };
        }
        return w;
      })
    );
  };

  const filteredWorkshops = workshops.filter(
    (w) => filterCategory === 'Todos' || w.category === filterCategory
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-[#5A5A40]" />
          <h1 className="serif text-2xl font-bold text-[#5A5A40]">Comunidad & Talleres</h1>
        </div>
        <p className="sans text-xs text-[#5A5A40]/80 mt-1">
          Charlas guiadas, grupos de apoyo y círculos de acompañamiento online.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'bg-[#FFFDF5] text-[#5A5A40] border border-[#5A5A40]/15 hover:bg-[#E8DCC4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workshops List */}
      <div className="space-y-4">
        {filteredWorkshops.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DCC4] text-[#5A5A40]">
                {item.category}
              </span>
              <span className="sans text-[11px] text-[#5A5A40]/70 font-semibold">
                {item.spotsLeft} cupos disponibles
              </span>
            </div>

            <div>
              <h3 className="serif text-lg font-bold text-[#2D2D2D] leading-snug">{item.title}</h3>
              <p className="sans text-xs text-[#5A5A40]/80 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Facilitator & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/70 p-3.5 rounded-2xl border border-[#5A5A40]/10">
              <div className="flex items-center gap-2 text-[#2D2D2D]">
                <UserCheck className="w-4 h-4 text-[#5A5A40]" />
                <div>
                  <span className="font-bold">{item.speaker}</span>
                  <span className="block text-[10px] text-[#5A5A40]">{item.role}</span>
                </div>
              </div>

              <div className="space-y-1 text-[#5A5A40]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>{item.mode}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-between items-center">
              {item.isEnrolled ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  <span>Inscripción Confirmada</span>
                </div>
              ) : (
                <span className="sans text-[11px] text-[#5A5A40]/70">Actividad Gratuita</span>
              )}

              <button
                onClick={() => toggleEnrollment(item.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  item.isEnrolled
                    ? 'bg-[#F5F5F0] text-[#D67C65] hover:bg-[#D67C65]/10'
                    : 'bg-[#5A5A40] hover:bg-[#484833] text-white'
                }`}
              >
                {item.isEnrolled ? 'Cancelar Inscripción' : 'Inscribirme en el Taller'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
