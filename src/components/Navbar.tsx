import React from 'react';
import { Heart, ShieldCheck, UserCheck, Settings as SettingsIcon, Cloud, CloudOff, LogOut, Activity, Users } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile;
  activeTab: string;
  onOpenSettings: () => void;
  onOpenClinicalProfile?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onOpenSettings,
  onOpenClinicalProfile,
  onOpenAdmin,
  onLogout
}) => {
  return (
    <header className="w-full bg-[#F5F5F0] border-b border-[#5A5A40]/10 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 glass shadow-xs">
      <div className="flex items-center gap-3">
        {/* Emblem logo from design specs */}
        <div className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center text-[#FFFDF5] shadow-sm">
          <Heart className="w-4 h-4 fill-[#E8DCC4] text-[#E8DCC4]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="serif text-lg font-bold tracking-tight text-[#5A5A40]">A TU LADO HOY</span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#E8DCC4] text-[#5A5A40] font-semibold">
              Dominga Care
            </span>
          </div>
          <p className="sans text-[10px] text-[#5A5A40]/70 font-medium hidden xs:block">
            Salud Mental Perinatal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#5A5A40]/10 text-[11px] text-[#5A5A40]/80">
          {userProfile.syncEnabled ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Sincronizado</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3.5 h-3.5 text-[#D67C65]" />
              <span>Local (Room)</span>
            </>
          )}
        </div>

        {/* User Auth Badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#5A5A40]/10 shadow-2xs">
          {userProfile.isGuest ? (
            <div className="flex items-center gap-1.5 text-xs text-[#5A5A40]">
              <UserCheck className="w-3.5 h-3.5 opacity-70" />
              <span className="font-medium text-[11px]">Modo Invitada</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#5A5A40]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span className="font-medium text-[11px] truncate max-w-[90px] sm:max-w-[130px]">
                {userProfile.displayName || 'Usuario'}
              </span>
            </div>
          )}
        </div>

        {/* Admin / Psicólogo Portal button */}
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95"
            title="Administración / Portal Psicólogos"
            aria-label="Administración Psicólogos"
          >
            <Users className="w-3.5 h-3.5 text-[#E8DCC4]" />
            <span className="hidden sm:inline">Administración</span>
          </button>
        )}

        {/* Clinical Profile Shortcut button */}
        {onOpenClinicalProfile && (
          <button
            onClick={onOpenClinicalProfile}
            className="p-2 rounded-full hover:bg-[#5A5A40]/10 transition-colors text-[#5A5A40] flex items-center gap-1"
            title="Mi Perfil Clínico"
            aria-label="Perfil Clínico"
          >
            <Activity className="w-5 h-5" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-[#5A5A40]/10 transition-colors text-[#5A5A40]"
          title="Configuración de la app"
          aria-label="Configuración"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-[#D67C65]/15 transition-colors text-[#D67C65]"
            title="Cerrar Sesión"
            aria-label="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
