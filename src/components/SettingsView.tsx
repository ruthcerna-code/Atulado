import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, User, Cloud, HardDrive, Download, Trash2, Heart, Phone, Lock, Save, Check, LogOut, Activity } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onExportData: () => void;
  onClearData: () => void;
  onLogout?: () => void;
  onOpenClinicalProfile?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onExportData,
  onClearData,
  onLogout,
  onOpenClinicalProfile
}) => {
  const [displayName, setDisplayName] = useState(userProfile.displayName || '');
  const [trustedName, setTrustedName] = useState(userProfile.trustedContactName || '');
  const [trustedPhone, setTrustedPhone] = useState(userProfile.trustedContactPhone || '');
  const [statusStage, setStatusStage] = useState(userProfile.pregnancyOrPostpartumStatus);
  const [syncEnabled, setSyncEnabled] = useState(userProfile.syncEnabled);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      displayName: displayName.trim(),
      trustedContactName: trustedName.trim(),
      trustedContactPhone: trustedPhone.trim(),
      pregnancyOrPostpartumStatus: statusStage,
      syncEnabled
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#5A5A40]" />
            <h1 className="serif text-2xl font-bold text-[#5A5A40]">Configuración</h1>
          </div>
          <p className="sans text-xs text-[#5A5A40]/80 mt-1">
            Ajustes de cuenta, sincronización Firebase y perfil clínico de salud.
          </p>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-2xl bg-[#D67C65]/10 hover:bg-[#D67C65]/20 text-[#D67C65] font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 border border-[#D67C65]/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>

      {/* Clinical Profile Shortcut Card */}
      {onOpenClinicalProfile && (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5A5A40]">
              <Activity className="w-4 h-4" />
              <span>Mi Perfil Clínico de Salud</span>
            </div>
            <p className="sans text-xs text-[#5A5A40]/80 leading-relaxed">
              Configura tu edad, peso, altura, fecha de última regla, ciclo y condiciones de salud.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenClinicalProfile}
            className="px-5 py-2.5 rounded-full bg-[#5A5A40] text-white hover:bg-[#484833] text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-xs active:scale-95"
          >
            <Activity className="w-4 h-4" />
            <span>Ver / Editar Datos de Salud</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account & Profile Box */}
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#5A5A40]">
            <User className="w-4 h-4" />
            <span>Perfil y Estado Personal</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-[#2D2D2D] block mb-1">Nombre preferido:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5A5A40]/20 text-xs focus:outline-hidden focus:border-[#5A5A40]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#2D2D2D] block mb-1">Etapa actual:</label>
              <select
                value={statusStage}
                onChange={(e) => setStatusStage(e.target.value as typeof statusStage)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5A5A40]/20 text-xs focus:outline-hidden"
              >
                <option value="gestational">Gestación / Embarazo</option>
                <option value="postpartum">Posparto / Crianza</option>
                <option value="grief_loss">Duelo Perinatal / Pérdida</option>
                <option value="seeking">Búsqueda / Apoyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trusted Crisis Contact */}
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#5A5A40]">
            <Phone className="w-4 h-4 text-[#D67C65]" />
            <span>Contacto de Confianza para Emergencias</span>
          </div>

          <p className="sans text-xs text-[#5A5A40]/80">
            Aparecerá en el Botón SOS para contacto telefónico directo en momentos de crisis.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-[#2D2D2D] block mb-1">Nombre:</label>
              <input
                type="text"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
                placeholder="Ej: Pareja, Mamá, Hermana..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5A5A40]/20 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-[#2D2D2D] block mb-1">Teléfono:</label>
              <input
                type="text"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#5A5A40]/20 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Cloud Sync & Firebase */}
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#5A5A40]">
            <Cloud className="w-4 h-4" />
            <span>Sincronización en la Nube (Firebase Cloud Firestore)</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#5A5A40]/10 text-xs">
            <div>
              <p className="font-bold text-[#2D2D2D]">Respaldo automático de diario</p>
              <p className="text-[#5A5A40]/70">
                {userProfile.isGuest ? 'Modo Invitado (Almacenamiento Local Room activo)' : 'Conectado a Firebase Auth'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#5A5A40]"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Ajustes Guardados con Éxito</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </form>

      {/* Data Export & Privacy Actions */}
      <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#5A5A40]">
          <HardDrive className="w-4 h-4" />
          <span>Gestión de Datos e Privacidad</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExportData}
            className="flex-1 py-3 px-4 rounded-2xl bg-white border border-[#5A5A40]/20 hover:border-[#5A5A40] text-[#5A5A40] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Copia de Seguridad (JSON)</span>
          </button>

          <button
            onClick={onClearData}
            className="py-3 px-4 rounded-2xl bg-white border border-[#D67C65]/30 text-[#D67C65] font-bold text-xs hover:bg-[#D67C65]/10 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Todos mis Datos Locales</span>
          </button>
        </div>
      </div>

      {/* Session Logout Action Card */}
      {onLogout && (
        <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#D67C65]/30 soft-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#D67C65]">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </div>
            <p className="sans text-xs text-[#5A5A40]/80 mt-1">
              Cierra la sesión actual para volver a ingresar o configurar tu Perfil Clínico de Salud.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-6 py-3 rounded-2xl bg-[#D67C65] hover:bg-[#C06852] text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-[10px] text-[#5A5A40]/70 space-y-1 pt-2">
        <p className="font-bold">A TU LADO • Dominga Care v1.0</p>
        <p>Diseñado bajo Clean Architecture & Offline-First (Room + Firebase)</p>
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#5A5A40]" />
          Cumplimiento Ley Dominga N° 21.371
        </p>
      </div>
    </div>
  );
};
