import React, { useState } from 'react';
import { Phone, AlertTriangle, Wind, HeartHandshake, X, ChevronRight, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onOpenBreathing: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenBreathing
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFDF5] rounded-3xl p-6 shadow-2xl border-2 border-[#D67C65]/30 relative overflow-hidden">
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[#D67C65]" />

        <div className="flex items-center justify-between mb-4 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D67C65]/15 flex items-center justify-center text-[#D67C65]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="serif text-xl font-bold text-[#D67C65]">Ayuda Inmediata SOS</h2>
              <p className="sans text-xs text-[#2D2D2D]/70">No estás sola. Estamos aquí contigo.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#2D2D2D]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#D67C65]/10 border border-[#D67C65]/20 mb-5">
          <p className="sans text-xs text-[#D67C65] font-medium leading-relaxed">
            Si estás sintiendo una angustia inmanejable, abrumación severa o pensamientos de hacerte daño, por favor solicita apoyo inmediato. Hay profesionales listos para escucharte con empatía.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {/* Linea *4141 */}
          <div className="p-4 rounded-2xl bg-white border border-[#D67C65]/25 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="serif text-base font-bold text-[#D67C65]">Línea *4141</span>
                <span className="text-[10px] bg-[#D67C65] text-white px-2 py-0.5 rounded-full font-bold">24/7 Gratis</span>
              </div>
              <p className="sans text-[11px] text-[#2D2D2D]/70 mt-0.5">
                Prevención del suicidio y contención en crisis emocional Minsal.
              </p>
            </div>
            <a
              href="tel:*4141"
              className="px-4 py-2.5 bg-[#D67C65] hover:bg-[#C06852] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>
          </div>

          {/* Salud Responde */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#5A5A40]/15 shadow-2xs flex items-center justify-between gap-3">
            <div>
              <div className="serif text-sm font-bold text-[#5A5A40]">Salud Responde</div>
              <p className="sans text-[11px] text-[#2D2D2D]/70">600 360 7777 • Orientación Minsal 24/7</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy('6003607777')}
                className="p-2 text-[#5A5A40] hover:bg-[#5A5A40]/10 rounded-lg text-xs"
                title="Copiar número"
              >
                {copiedNumber === '6003607777' ? <Check className="w-4 h-4 text-emerald-600" /> : 'Copiar'}
              </button>
              <a
                href="tel:6003607777"
                className="px-3 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#484833]"
              >
                <Phone className="w-3.5 h-3.5" />
                Llamar
              </a>
            </div>
          </div>

          {/* Trusted contact if configured */}
          {userProfile.trustedContactPhone && (
            <div className="p-3.5 rounded-2xl bg-[#E8DCC4]/40 border border-[#5A5A40]/20 flex items-center justify-between gap-3">
              <div>
                <div className="sans text-[10px] uppercase font-bold text-[#5A5A40]">Tu Contacto de Confianza</div>
                <div className="serif text-sm font-bold text-[#2D2D2D]">
                  {userProfile.trustedContactName || 'Contacto Configurado'}
                </div>
                <p className="sans text-[11px] text-[#2D2D2D]/70">{userProfile.trustedContactPhone}</p>
              </div>
              <a
                href={`tel:${userProfile.trustedContactPhone}`}
                className="px-3.5 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                Llamar
              </a>
            </div>
          )}
        </div>

        {/* Quick Grounding Action */}
        <div className="pt-2 border-t border-[#5A5A40]/10 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenBreathing();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#5A5A40] text-white hover:bg-[#484833] transition-all flex items-center justify-between text-xs font-bold shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#E8DCC4]" />
              <span>Realizar Pausa de Calma Inmediata (1 min)</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="sans text-[10px] text-center text-[#5A5A40]/70 pt-1">
            <HeartHandshake className="w-3 h-3 inline mr-1 text-[#D67C65]" />
            Ley Dominga • Acompañamiento Perinatal Respetuoso
          </p>
        </div>
      </div>
    </div>
  );
};
