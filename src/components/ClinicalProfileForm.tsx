import React, { useState } from 'react';
import { Save, Calendar, Activity, CheckSquare, Square, Heart, Check } from 'lucide-react';
import { ClinicalHealthData } from '../types';

interface ClinicalProfileFormProps {
  initialData?: ClinicalHealthData;
  onSave: (data: ClinicalHealthData) => void;
  onCancel?: () => void;
  showTitleHeader?: boolean;
}

export const ClinicalProfileForm: React.FC<ClinicalProfileFormProps> = ({
  initialData,
  onSave,
  onCancel,
  showTitleHeader = true,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || 'Ruth Cerna');
  const [age, setAge] = useState<number | string>(initialData?.age ?? 28);
  const [weightKg, setWeightKg] = useState<number | string>(initialData?.weightKg ?? 62);
  const [heightCm, setHeightCm] = useState<number | string>(initialData?.heightCm ?? 165);
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState(
    initialData?.lastPeriodStartDate || '2026-07-10'
  );
  const [periodDurationDays, setPeriodDurationDays] = useState<number | string>(
    initialData?.periodDurationDays ?? 3
  );
  const [cycleDurationDays, setCycleDurationDays] = useState<number | string>(
    initialData?.cycleDurationDays ?? 28
  );
  const [contraceptiveMethod, setContraceptiveMethod] = useState(
    initialData?.contraceptiveMethod || 'Ninguno / Ciclo Natural'
  );

  const defaultConditions = ['Celíaca', 'Diabetes', 'Obesidad', 'Depresión'];
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    initialData?.healthConditions || ['Diabetes', 'Obesidad']
  );

  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ClinicalHealthData = {
      fullName: fullName.trim(),
      age: Number(age) || 0,
      weightKg: Number(weightKg) || 0,
      heightCm: Number(heightCm) || 0,
      lastPeriodStartDate,
      periodDurationDays: Number(periodDurationDays) || 0,
      cycleDurationDays: Number(cycleDurationDays) || 0,
      contraceptiveMethod: contraceptiveMethod.trim(),
      healthConditions: selectedConditions,
    };
    onSave(data);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
      {/* Top Header Label & Title matching image */}
      {showTitleHeader && (
        <div className="space-y-1">
          <span className="sans text-[11px] font-bold uppercase tracking-widest text-[#5A5A40]/70 block">
            TU IDENTIDAD DE SALUD
          </span>
          <h1 className="serif text-3xl font-bold text-[#5A5A40]">
            Mi Perfil Clínico
          </h1>
          <p className="sans text-xs text-[#5A5A40]/80">
            Configura tus condiciones de bienestar y parámetros del ciclo.
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-6">
        <h2 className="serif text-xl font-bold text-[#5A5A40] pb-2 border-b border-[#5A5A40]/10">
          Editar Información
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Row 1: Nombre Completo, Edad, Peso, Altura */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Ruth Cerna"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Edad
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="28"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all text-center"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Peso (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="62"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all text-center"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Altura (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="165"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all text-center"
              />
            </div>
          </div>

          {/* Grid Row 2: Última Regla, Duración Periodo, Duración Ciclo */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Última Regla (Inicio)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={lastPeriodStartDate}
                  onChange={(e) => setLastPeriodStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Duración Periodo (días)
              </label>
              <input
                type="number"
                value={periodDurationDays}
                onChange={(e) => setPeriodDurationDays(e.target.value)}
                placeholder="3"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all text-center"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
                Duración Ciclo (días)
              </label>
              <input
                type="number"
                value={cycleDurationDays}
                onChange={(e) => setCycleDurationDays(e.target.value)}
                placeholder="28"
                className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all text-center"
              />
            </div>
          </div>

          {/* Grid Row 3: Método Anticonceptivo */}
          <div>
            <label className="sans text-xs font-bold text-[#2D2D2D] block mb-1.5">
              Método Anticonceptivo
            </label>
            <input
              type="text"
              value={contraceptiveMethod}
              onChange={(e) => setContraceptiveMethod(e.target.value)}
              placeholder="Ninguno / Ciclo Natural"
              className="w-full px-4 py-3 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/15 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] focus:bg-white transition-all"
            />
          </div>

          {/* Grid Row 4: Condiciones de Salud */}
          <div>
            <label className="sans text-xs font-bold text-[#2D2D2D] block mb-2">
              Condiciones de Salud
            </label>
            <div className="flex flex-wrap gap-3">
              {defaultConditions.map((condition) => {
                const isChecked = selectedConditions.includes(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleCondition(condition)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
                      isChecked
                        ? 'bg-[#E8DCC4]/50 border-[#5A5A40] text-[#2D2D2D] shadow-2xs'
                        : 'bg-[#F9F8F3] border-[#5A5A40]/15 text-[#5A5A40]/80 hover:border-[#5A5A40]/30'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-[#5A5A40] border-[#5A5A40] text-white'
                          : 'border-[#5A5A40]/40 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{condition}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons matching screenshot bottom right */}
          <div className="pt-4 border-t border-[#5A5A40]/10 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 rounded-full bg-[#F5F5F0] hover:bg-[#E8DCC4] text-[#5A5A40] text-xs font-semibold transition-all"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
