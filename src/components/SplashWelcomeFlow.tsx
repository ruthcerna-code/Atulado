import React, { useState } from 'react';
import { Heart, ShieldCheck, CheckCircle2, User, ArrowRight, Lock, Check, Activity } from 'lucide-react';
import { UserProfile, ClinicalHealthData } from '../types';
import { ClinicalProfileForm } from './ClinicalProfileForm';

interface SplashWelcomeFlowProps {
  onComplete: (updatedProfile: Partial<UserProfile>) => void;
  initialProfile?: UserProfile;
}

export const SplashWelcomeFlow: React.FC<SplashWelcomeFlowProps> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState<'splash' | 'welcome' | 'consent' | 'auth' | 'clinical'>('welcome');
  const [hasAcceptedConsent, setHasAcceptedConsent] = useState(true);
  const [statusChoice, setStatusChoice] = useState<'gestational' | 'postpartum' | 'grief_loss' | 'seeking'>(
    initialProfile?.pregnancyOrPostpartumStatus || 'gestational'
  );
  const [userName, setUserName] = useState(initialProfile?.displayName || '');
  const [authEmail, setAuthEmail] = useState(initialProfile?.email || '');
  const [isGuestUser, setIsGuestUser] = useState(initialProfile?.isGuest ?? true);

  const [clinicalData, setClinicalData] = useState<ClinicalHealthData>(
    initialProfile?.clinicalProfile || {
      fullName: 'Ruth Cerna',
      age: 28,
      weightKg: 62,
      heightCm: 165,
      lastPeriodStartDate: '2026-07-10',
      periodDurationDays: 3,
      cycleDurationDays: 28,
      contraceptiveMethod: 'Ninguno / Ciclo Natural',
      healthConditions: ['Diabetes', 'Obesidad'],
    }
  );

  // Auto transition splash -> welcome only if coming for the very first time
  React.useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('welcome'), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleProceedToClinical = (isGuest: boolean) => {
    setIsGuestUser(isGuest);
    setStep('clinical');
  };

  const handleFinalSubmitClinical = (savedClinical: ClinicalHealthData) => {
    onComplete({
      displayName: savedClinical.fullName || userName.trim() || 'Ruth Cerna',
      email: isGuestUser ? undefined : authEmail || 'usuario@firebase.app',
      isGuest: isGuestUser,
      hasConsented: true,
      pregnancyOrPostpartumStatus: statusChoice,
      syncEnabled: !isGuestUser,
      clinicalProfile: savedClinical,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5F0] flex items-center justify-center p-4 overflow-y-auto">
      {/* 1. Splash Screen */}
      {step === 'splash' && (
        <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 fade-in duration-700">
          <div className="w-20 h-20 rounded-full bg-[#5A5A40] flex items-center justify-center shadow-lg mb-6 animate-pulse">
            <Heart className="w-10 h-10 fill-[#E8DCC4] text-[#E8DCC4]" />
          </div>
          <h1 className="serif text-3xl font-bold text-[#5A5A40] tracking-tight mb-2">A TU LADO HOY</h1>
          <p className="sans text-xs tracking-widest text-[#5A5A40]/70 uppercase font-semibold">
            Dominga Care • Salud Mental Perinatal
          </p>
          <div className="mt-8 w-12 h-1 bg-[#E8DCC4] rounded-full animate-pulse" />
        </div>
      )}

      {/* 2. Welcome Screen */}
      {step === 'welcome' && (
        <div className="w-full max-w-md bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 soft-shadow border border-[#5A5A40]/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-[#E8DCC4]">
              <Heart className="w-5 h-5 fill-[#E8DCC4]" />
            </div>
            <div>
              <span className="serif text-xl font-bold text-[#5A5A40]">A TU LADO HOY</span>
              <p className="sans text-[11px] text-[#5A5A40]/70">Un espacio de escucha y calma</p>
            </div>
          </div>

          <h2 className="serif text-2xl font-bold text-[#2D2D2D] mb-3 leading-snug">
            Acompañamiento respetuoso en tu maternidad y duelo
          </h2>

          <p className="sans text-sm text-[#5A5A40]/80 leading-relaxed mb-6">
            Te damos la bienvenida a un entorno seguro, libre de juicios, diseñado para apoyarte en la gestación, el posparto o el proceso de pérdida gestacional y perinatal.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F5F5F0]">
              <div className="w-8 h-8 rounded-xl bg-[#E8DCC4] flex items-center justify-center text-[#5A5A40] font-bold text-xs">
                ✓
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#2D2D2D]">Almacenamiento Local Seguro (Room)</p>
                <p className="text-[#5A5A40]/70">Tus notas y diario se guardan prioritariamente en tu dispositivo.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F5F5F0]">
              <div className="w-8 h-8 rounded-xl bg-[#E8DCC4] flex items-center justify-center text-[#5A5A40] font-bold text-xs">
                ✓
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#2D2D2D]">Escala EPDS y Pausa de Calma</p>
                <p className="text-[#5A5A40]/70">Herramientas validadas para el monitoreo emocional diario.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('consent')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
          >
            <span>Comenzar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Consentimiento Informado */}
      {step === 'consent' && (
        <div className="w-full max-w-md bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 soft-shadow border border-[#5A5A40]/10 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 mb-4 text-[#5A5A40]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="serif text-xl font-bold">Consentimiento Informado</h2>
          </div>

          <div className="bg-[#F5F5F0] rounded-2xl p-4 text-xs text-[#2D2D2D]/80 leading-relaxed space-y-2.5 max-h-56 overflow-y-auto mb-5 border border-[#5A5A40]/10">
            <p className="font-semibold text-[#5A5A40]">Política de Privacidad y Tratamiento de Datos:</p>
            <p>
              1. <strong>Carácter Psicoeducativo:</strong> Esta aplicación ofrece orientación y apoyo emocional complementario. No reemplaza el diagnóstico ni la consulta médica o psiquiátrica profesional.
            </p>
            <p>
              2. <strong>Privacidad Offline-First:</strong> Todos tus registros del diario emocional se almacenan localmente en tu teléfono. La sincronización en la nube con Firebase es estrictamente opcional.
            </p>
            <p>
              3. <strong>Protocolo de Emergencia:</strong> Ante situaciones de crisis o riesgo de autodaño, la app facilita accesos directos a líneas oficiales como la Línea *4141 del Ministerio de Salud.
            </p>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasAcceptedConsent}
              onChange={(e) => setHasAcceptedConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#5A5A40] text-[#5A5A40] focus:ring-[#5A5A40]"
            />
            <span className="sans text-xs text-[#2D2D2D]/80 leading-snug">
              He leído y acepto los términos del consentimiento informado y la política de tratamiento de datos personales.
            </span>
          </label>

          <button
            disabled={!hasAcceptedConsent}
            onClick={() => setStep('auth')}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
              hasAcceptedConsent
                ? 'bg-[#5A5A40] hover:bg-[#484833] text-white cursor-pointer active:scale-98'
                : 'bg-[#5A5A40]/30 text-white/60 cursor-not-allowed'
            }`}
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Auth / Modo Invitado Selection */}
      {step === 'auth' && (
        <div className="w-full max-w-md bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 soft-shadow border border-[#5A5A40]/10 animate-in fade-in duration-300">
          <h2 className="serif text-2xl font-bold text-[#5A5A40] mb-2">Personaliza tu Espacio</h2>
          <p className="sans text-xs text-[#5A5A40]/80 mb-5">
            Ingresa tu nombre para referirnos a ti con cariño y selecciona tu momento actual.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="sans text-xs font-semibold text-[#2D2D2D] mb-1 block">
                ¿Cómo te gustaría que te llamemos?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ej: María G."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#5A5A40]/20 text-sm focus:outline-hidden focus:border-[#5A5A40]"
              />
            </div>

            <div>
              <label className="sans text-xs font-semibold text-[#2D2D2D] mb-1 block">
                Etapa o momento que estás atravesando:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'gestational', label: 'Gestación / Embarazo' },
                  { id: 'postpartum', label: 'Posparto / Crianza' },
                  { id: 'grief_loss', label: 'Duelo / Pérdida' },
                  { id: 'seeking', label: 'Búsqueda / Apoyo' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusChoice(item.id as typeof statusChoice)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      statusChoice === item.id
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] font-bold shadow-2xs'
                        : 'bg-white text-[#2D2D2D] border-[#5A5A40]/20 hover:border-[#5A5A40]/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#5A5A40]/10 space-y-3">
            {/* Guest Mode Choice -> Proceed to Clinical Data */}
            <button
              onClick={() => handleProceedToClinical(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#E8DCC4] hover:bg-[#DDD0B7] text-[#5A5A40] font-bold text-xs transition-all flex items-center justify-between shadow-2xs active:scale-98"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Ingresar como Invitada y Cargar Datos de Salud</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Optional Cloud Account Choice */}
            <div className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40]">
                <Lock className="w-3.5 h-3.5" />
                <span>O crea tu cuenta Firebase opcional:</span>
              </div>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3 py-2 rounded-xl bg-[#F5F5F0] border border-[#5A5A40]/15 text-xs"
              />
              <button
                onClick={() => handleProceedToClinical(false)}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] flex items-center justify-center gap-2"
              >
                <span>Registrar e Ingresar Datos de Salud</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Datos de Salud / Mi Perfil Clínico Screen */}
      {step === 'clinical' && (
        <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
          <ClinicalProfileForm
            initialData={clinicalData}
            onSave={(saved) => {
              setClinicalData(saved);
              handleFinalSubmitClinical(saved);
            }}
            onCancel={() => {
              // Submit with default or existing clinical profile
              handleFinalSubmitClinical(clinicalData);
            }}
          />
        </div>
      )}
    </div>
  );
};
