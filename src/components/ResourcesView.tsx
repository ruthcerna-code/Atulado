import React, { useState } from 'react';
import { Bookmark, Phone, Globe, MapPin, Clock, Search, Heart, ShieldAlert, ExternalLink } from 'lucide-react';
import { INITIAL_RESOURCES } from '../data/resourcesData';
import { SupportResource } from '../types';

export const ResourcesView: React.FC = () => {
  const [resources, setResources] = useState<SupportResource[]>(INITIAL_RESOURCES);
  const [selectedCat, setSelectedCat] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Línea de Crisis', 'Fundación / Apoyo', 'Hospital / Urgencia', 'Salud Mental Perinatal'];

  const toggleFavorite = (id: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const filtered = resources.filter(r => {
    const matchesCat = selectedCat === 'Todos' || r.category === selectedCat;
    const matchesQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-[#5A5A40]" />
          <h1 className="serif text-2xl font-bold text-[#5A5A40]">Recursos de Apoyo</h1>
        </div>
        <p className="sans text-xs text-[#5A5A40]/80 mt-1">
          Directorio oficial de líneas de emergencia, fundaciones y centros de salud perinatal.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#5A5A40]/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar apoyo, fundación o ciudad..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF5] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] soft-shadow"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'bg-[#FFFDF5] text-[#5A5A40] border border-[#5A5A40]/15 hover:bg-[#E8DCC4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border soft-shadow space-y-3 relative ${
              item.isEmergencyLine
                ? 'bg-[#FFFDF5] border-[#D67C65]/30'
                : 'bg-[#FFFDF5] border-[#5A5A40]/15'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <span
                className={`sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.isEmergencyLine
                    ? 'bg-[#D67C65] text-white'
                    : 'bg-[#E8DCC4] text-[#5A5A40]'
                }`}
              >
                {item.category}
              </span>

              <button
                onClick={() => toggleFavorite(item.id)}
                className="p-1 text-[#5A5A40] hover:scale-110 transition-transform"
                title="Favorito"
              >
                <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-[#D67C65] text-[#D67C65]' : ''}`} />
              </button>
            </div>

            <div>
              <h3 className="serif text-lg font-bold text-[#2D2D2D]">{item.name}</h3>
              <p className="sans text-xs text-[#5A5A40]/80 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-[#5A5A40] pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{item.region} {item.address ? `• ${item.address}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{item.hours}</span>
              </div>
            </div>

            {/* Direct Call & Link buttons */}
            <div className="pt-3 border-t border-[#5A5A40]/10 flex flex-wrap items-center justify-between gap-2">
              <span className="serif text-sm font-bold text-[#2D2D2D]">{item.phone}</span>

              <div className="flex items-center gap-2">
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#F5F5F0] text-[#5A5A40] text-xs font-bold hover:bg-[#E8DCC4] flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Sitio</span>
                  </a>
                )}

                <a
                  href={`tel:${item.phone.replace(/\s+/g, '')}`}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all ${
                    item.isEmergencyLine ? 'bg-[#D67C65] hover:bg-[#C06852]' : 'bg-[#5A5A40] hover:bg-[#484833]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar Ahora</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
