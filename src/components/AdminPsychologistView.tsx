import React, { useState } from 'react';
import {
  Users,
  Search,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  UserCheck,
  Heart,
  Save,
  Check,
  Filter,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, JournalEntry, EpdsResult, Gad7Result } from '../types';

interface PatientRecord {
  id: string;
  fullName: string;
  age: number;
  status: 'gestational' | 'postpartum' | 'grief_loss' | 'seeking';
  psychologistName: string;
  riskLevel: 'low' | 'moderate' | 'high';
  epdsScore: number;
  gad7Score: number;
  lastActiveDate: string;
  clinicalProfile: {
    weightKg: number;
    heightCm: number;
    lastPeriodStartDate: string;
    periodDurationDays: number;
    cycleDurationDays: number;
    contraceptiveMethod: string;
    healthConditions: string[];
    otherHealthConditions?: string;
    diagnosedDisease?: string;
    medications?: string;
    medicationDurationValue?: number | string;
    medicationDurationUnit?: 'días' | 'meses';
  };
  journalEntries: JournalEntry[];
  epdsHistory: EpdsResult[];
  gad7History: Gad7Result[];
  psychologistNotes?: string;
}

interface AdminPsychologistViewProps {
  currentUserProfile: UserProfile;
  currentUserEntries: JournalEntry[];
  currentUserEpds: EpdsResult[];
  currentUserGad7?: Gad7Result[];
}

export const AdminPsychologistView: React.FC<AdminPsychologistViewProps> = ({
  currentUserProfile,
  currentUserEntries,
  currentUserEpds,
  currentUserGad7,
}) => {
  // Construct patient directory including current user and clinical demo patients
  const currentPatientRecord: PatientRecord = {
    id: currentUserProfile.uid || 'user-current',
    fullName: currentUserProfile.clinicalProfile?.fullName || currentUserProfile.displayName || 'Ruth Cerna',
    age: currentUserProfile.clinicalProfile?.age || 28,
    status: currentUserProfile.pregnancyOrPostpartumStatus,
    psychologistName: currentUserProfile.psychologistName || 'Dra. María González (Psicología Perinatal)',
    riskLevel: currentUserEpds[0]?.riskLevel || 'moderate',
    epdsScore: currentUserEpds[0]?.totalScore || 11,
    gad7Score: currentUserGad7 && currentUserGad7.length > 0 ? currentUserGad7[0].totalScore : 8,
    lastActiveDate: currentUserEntries[0]?.dateStr || '2026-07-28',
    clinicalProfile: {
      weightKg: currentUserProfile.clinicalProfile?.weightKg || 62,
      heightCm: currentUserProfile.clinicalProfile?.heightCm || 165,
      lastPeriodStartDate: currentUserProfile.clinicalProfile?.lastPeriodStartDate || '2026-07-10',
      periodDurationDays: currentUserProfile.clinicalProfile?.periodDurationDays || 3,
      cycleDurationDays: currentUserProfile.clinicalProfile?.cycleDurationDays || 28,
      contraceptiveMethod: currentUserProfile.clinicalProfile?.contraceptiveMethod || 'Ninguno / Ciclo Natural',
      healthConditions: currentUserProfile.clinicalProfile?.healthConditions || ['Diabetes', 'Obesidad'],
      otherHealthConditions: currentUserProfile.clinicalProfile?.otherHealthConditions || 'Hipotiroidismo subclínico en tratamiento',
      diagnosedDisease: currentUserProfile.clinicalProfile?.diagnosedDisease || 'Síndrome de Ovario Poliquístico (SOP)',
      medications: currentUserProfile.clinicalProfile?.medications || 'Levotiroxina 50mcg, Sertralina 50mg',
      medicationDurationValue: currentUserProfile.clinicalProfile?.medicationDurationValue || 6,
      medicationDurationUnit: currentUserProfile.clinicalProfile?.medicationDurationUnit || 'meses',
    },
    journalEntries: currentUserEntries,
    epdsHistory: currentUserEpds.length > 0 ? currentUserEpds : [
      {
        id: 'epds-1',
        timestamp: Date.now() - 86400000 * 3,
        dateStr: '2026-07-25',
        totalScore: 11,
        item10Score: 0,
        riskLevel: 'moderate',
        notes: 'Evaluación de seguimiento posparto inicial.'
      }
    ],
    gad7History: currentUserGad7 && currentUserGad7.length > 0 ? currentUserGad7 : [
      {
        id: 'gad7-1',
        timestamp: Date.now() - 86400000 * 2,
        dateStr: '2026-07-26',
        totalScore: 8,
        riskLevel: 'mild',
        notes: 'Ansiedad leve al atardecer. Paciente responde adecuadamente a pausas respiratorias.'
      }
    ],
    psychologistNotes: 'Paciente acude a consulta por síntomas de opresión al atardecer. Muestra buena receptividad a los ejercicios de respiración guiada. Se sugiere mantener diarios y apoyo de red familiar.'
  };

  const samplePatients: PatientRecord[] = [
    currentPatientRecord,
    {
      id: 'p-102',
      fullName: 'Camila Morales',
      age: 31,
      status: 'postpartum',
      psychologistName: 'Dr. Alejandro Silva (Salud Mental Materna)',
      riskLevel: 'high',
      epdsScore: 16,
      gad7Score: 14,
      lastActiveDate: '2026-07-27',
      clinicalProfile: {
        weightKg: 68,
        heightCm: 160,
        lastPeriodStartDate: '2026-06-15',
        periodDurationDays: 4,
        cycleDurationDays: 30,
        contraceptiveMethod: 'Implante Subdérmico',
        healthConditions: ['Depresión', 'Anemia'],
        otherHealthConditions: 'Alergia a la Penicilina',
        diagnosedDisease: 'Depresión Posparto Moderada-Severa',
        medications: 'Sertralina 100mg',
        medicationDurationValue: 3,
        medicationDurationUnit: 'meses',
      },
      journalEntries: [
        {
          id: 'j-102-1',
          timestamp: Date.now() - 86400000,
          dateStr: '2026-07-27',
          mood: 'overwhelmed',
          intensity: 5,
          tags: ['#sobrecarga', '#llanto'],
          note: 'Día muy difícil, siento que no logro descansar lo suficiente por las noches.',
          daySummaryPhrase: 'Un día abrumador pero pude pedir ayuda a mi pareja.',
          syncedToCloud: true
        }
      ],
      epdsHistory: [
        {
          id: 'epds-102',
          timestamp: Date.now() - 86400000 * 2,
          dateStr: '2026-07-26',
          totalScore: 16,
          item10Score: 1,
          riskLevel: 'high',
          notes: 'Alerta EPDS > 13. Ítem 10 positivo leve. Requiere seguimiento estrecho semanal.'
        }
      ],
      gad7History: [
        {
          id: 'gad7-102',
          timestamp: Date.now() - 86400000 * 2,
          dateStr: '2026-07-26',
          totalScore: 14,
          riskLevel: 'moderate',
          notes: 'Síntomas de ansiedad con insomnio de conciliación.'
        }
      ],
      psychologistNotes: 'Se coordinó sesión telefónica de urgencia. Paciente apoyada por su red directa.'
    },
    {
      id: 'p-103',
      fullName: 'Constanza Silva',
      age: 29,
      status: 'grief_loss',
      psychologistName: 'Dra. María González (Psicología Perinatal)',
      riskLevel: 'moderate',
      epdsScore: 12,
      gad7Score: 9,
      lastActiveDate: '2026-07-26',
      clinicalProfile: {
        weightKg: 59,
        heightCm: 168,
        lastPeriodStartDate: '2026-07-02',
        periodDurationDays: 5,
        cycleDurationDays: 28,
        contraceptiveMethod: 'Ninguno',
        healthConditions: ['Depresión'],
        otherHealthConditions: 'Acompañamiento Duelo Perinatal (Ley Dominga)',
        diagnosedDisease: 'Pérdida gestacional del segundo trimestre',
        medications: 'Suplemento Hierro + Ácido Fólico',
        medicationDurationValue: 1,
        medicationDurationUnit: 'meses',
      },
      journalEntries: [
        {
          id: 'j-103-1',
          timestamp: Date.now() - 86400000 * 2,
          dateStr: '2026-07-26',
          mood: 'sad',
          intensity: 4,
          tags: ['#duelo', '#memoria'],
          note: 'Agradecida del espacio en el diario para honrar mi proceso sin culpas.',
          daySummaryPhrase: 'Un día de tristeza tranquila y mucha nostalgia.',
          syncedToCloud: true
        }
      ],
      epdsHistory: [
        {
          id: 'epds-103',
          timestamp: Date.now() - 86400000 * 5,
          dateStr: '2026-07-23',
          totalScore: 12,
          item10Score: 0,
          riskLevel: 'moderate',
          notes: 'Duelo perinatal activo. Buen acoplamiento a talleres comunitarios de apoyo.'
        }
      ],
      gad7History: [
        {
          id: 'gad7-103',
          timestamp: Date.now() - 86400000 * 5,
          dateStr: '2026-07-23',
          totalScore: 9,
          riskLevel: 'mild',
          notes: 'Nivel leve de ansiedad asociado a fechas significativas.'
        }
      ],
      psychologistNotes: 'Continuar con plan de autocuidado y grupo de acompañamiento mutuo.'
    },
    {
      id: 'p-104',
      fullName: 'Francisca Reyes',
      age: 34,
      status: 'gestational',
      psychologistName: 'Dra. Lorena Fuentes (Obstetricia & Salud Mental)',
      riskLevel: 'low',
      epdsScore: 5,
      gad7Score: 3,
      lastActiveDate: '2026-07-28',
      clinicalProfile: {
        weightKg: 71,
        heightCm: 163,
        lastPeriodStartDate: '2026-02-14',
        periodDurationDays: 4,
        cycleDurationDays: 29,
        contraceptiveMethod: 'Ninguno / Embarazo Activo (23 semanas)',
        healthConditions: ['Diabetes'],
        otherHealthConditions: 'Diabetes Gestacional controlada con dieta',
        diagnosedDisease: 'Embarazo normoevolutivo sin complicaciones',
        medications: 'Multivitamínico prenatal',
        medicationDurationValue: 5,
        medicationDurationUnit: 'meses',
      },
      journalEntries: [
        {
          id: 'j-104-1',
          timestamp: Date.now(),
          dateStr: '2026-07-28',
          mood: 'calm',
          intensity: 2,
          tags: ['#gratitud', '#embarazo'],
          note: 'Me siento llena de energía hoy. Caminé 30 minutos por el parque.',
          daySummaryPhrase: 'Un día muy sereno, pleno y conectado.',
          syncedToCloud: true
        }
      ],
      epdsHistory: [
        {
          id: 'epds-104',
          timestamp: Date.now() - 86400000 * 10,
          dateStr: '2026-07-18',
          totalScore: 5,
          item10Score: 0,
          riskLevel: 'low',
          notes: 'Screening normal. Sin factores de riesgo identificados.'
        }
      ],
      gad7History: [
        {
          id: 'gad7-104',
          timestamp: Date.now() - 86400000 * 10,
          dateStr: '2026-07-18',
          totalScore: 3,
          riskLevel: 'minimal',
          notes: 'Puntaje de ansiedad dentro de límites normales.'
        }
      ],
      psychologistNotes: 'Paciente estable. Controles mensuales rutinarios.'
    }
  ];

  const [selectedPatientId, setSelectedPatientId] = useState<string>(currentPatientRecord.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNote, setEditingNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const selectedPatient = samplePatients.find((p) => p.id === selectedPatientId) || samplePatients[0];

  React.useEffect(() => {
    if (selectedPatient) {
      setEditingNote(selectedPatient.psychologistNotes || '');
    }
  }, [selectedPatientId]);

  const handleSavePsychologistNote = () => {
    selectedPatient.psychologistNotes = editingNote;
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  const filteredPatients = samplePatients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.psychologistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'high_risk' && patient.riskLevel === 'high') ||
      (filterStatus === 'moderate_risk' && patient.riskLevel === 'moderate') ||
      patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: PatientRecord['status']) => {
    switch (status) {
      case 'gestational':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Gestación</span>;
      case 'postpartum':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Posparto</span>;
      case 'grief_loss':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">Duelo Perinatal</span>;
      case 'seeking':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Búsqueda</span>;
    }
  };

  const getRiskBadge = (risk: PatientRecord['riskLevel']) => {
    switch (risk) {
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px] flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-600" /> Riesgo Alto</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" /> Moderado</span>;
      case 'low':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-600" /> Bajo Riesgo</span>;
    }
  };

  const getGad7Badge = (riskLevel: Gad7Result['riskLevel']) => {
    switch (riskLevel) {
      case 'severe':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px]">Severo (15-21)</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px]">Moderado (10-14)</span>;
      case 'mild':
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold text-[10px]">Leve (5-9)</span>;
      case 'minimal':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px]">Mínimo (0-4)</span>;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#5A5A40] text-white soft-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-[#E8DCC4]" />
            <span className="sans text-[11px] font-bold uppercase tracking-widest text-[#E8DCC4]">
              PORTAL PROFESIONAL DE SALUD MENTAL
            </span>
          </div>
          <h1 className="serif text-2xl font-bold">Módulo de Administración & Psicología</h1>
          <p className="sans text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            Plataforma clínica para que los psicólogos tratantes monitoreen la evolución emocional, profilaxis clínica, resultados EPDS y registros diarios de las pacientes.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs shrink-0 space-y-0.5">
          <p className="font-bold text-[#E8DCC4]">Acceso Multidisciplinario Abierto</p>
          <p className="text-white/80 text-[10px]">Visión centralizada de pacientes en seguimiento</p>
        </div>
      </div>

      {/* Main Grid: Left Directory & Right Patient Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="serif text-base font-bold text-[#5A5A40] flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Directorio de Pacientes</span>
              </h2>
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70 bg-[#E8DCC4] px-2 py-0.5 rounded-full">
                {filteredPatients.length} pacientes
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#5A5A40]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar paciente o psicólogo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#5A5A40]/20 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4]'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterStatus('high_risk')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterStatus === 'high_risk'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Riesgo EPDS Alto
              </button>
              <button
                onClick={() => setFilterStatus('postpartum')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterStatus === 'postpartum'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E8DCC4]'
                }`}
              >
                Posparto
              </button>
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2.5 pt-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#E8DCC4]/40 border-[#5A5A40] shadow-2xs ring-1 ring-[#5A5A40]/30'
                        : 'bg-white border-[#5A5A40]/10 hover:border-[#5A5A40]/30 hover:bg-[#F9F8F3]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="serif text-sm font-bold text-[#2D2D2D]">
                          {p.fullName}
                        </span>
                        <span className="sans text-[10px] text-[#5A5A40]/70 font-semibold">
                          ({p.age} años)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getStatusBadge(p.status)}
                        {getRiskBadge(p.riskLevel)}
                      </div>

                      <p className="sans text-[10px] text-[#5A5A40]/80 italic pt-0.5 truncate max-w-[210px]">
                        Psicólogo: {p.psychologistName}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-[#5A5A40] translate-x-0.5' : 'text-[#5A5A40]/30'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Patient Clinical History & Evolution (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Header Summary Box */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5A5A40]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E8DCC4] flex items-center justify-center text-[#5A5A40] text-xl font-bold shadow-xs border-2 border-white">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="serif text-xl font-bold text-[#2D2D2D]">
                      {selectedPatient.fullName}
                    </h2>
                    <span className="sans text-xs font-semibold text-[#5A5A40]">
                      ({selectedPatient.age} años)
                    </span>
                  </div>
                  <p className="sans text-xs text-[#5A5A40] font-medium mt-0.5">
                    Última actividad registrada: <span className="font-bold">{selectedPatient.lastActiveDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(selectedPatient.status)}
                {getRiskBadge(selectedPatient.riskLevel)}
              </div>
            </div>

            {/* Assigned Psychologist Badge */}
            <div className="p-3.5 rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/15 flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[#5A5A40] shrink-0" />
              <div>
                <span className="sans text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]/80 block">
                  Psicólogo/a de Cabecera Asignado/a
                </span>
                <p className="sans text-xs font-bold text-[#2D2D2D]">
                  {selectedPatient.psychologistName}
                </p>
              </div>
            </div>
          </div>

          {/* Ficha Clínica Completa (Health Data) */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center gap-2 pb-2 border-b border-[#5A5A40]/10">
              <Activity className="w-4 h-4 text-[#5A5A40]" />
              <span>Ficha Clínica de Salud & Profilaxis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Enfermedad Diagnosticada
                </span>
                <p className="font-semibold text-[#2D2D2D]">
                  {selectedPatient.clinicalProfile.diagnosedDisease || 'Sin diagnósticos previos reportados'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Medicamentos & Tratamiento
                </span>
                <p className="font-semibold text-[#2D2D2D]">
                  {selectedPatient.clinicalProfile.medications ? (
                    <>
                      {selectedPatient.clinicalProfile.medications}
                      <span className="block text-[11px] text-[#5A5A40] font-normal mt-0.5">
                        Tiempo: {selectedPatient.clinicalProfile.medicationDurationValue} {selectedPatient.clinicalProfile.medicationDurationUnit || 'meses'}
                      </span>
                    </>
                  ) : (
                    'Ninguno'
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Condiciones de Salud
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.clinicalProfile.healthConditions.map((cond) => (
                    <span key={cond} className="px-2 py-0.5 rounded-md bg-[#E8DCC4] text-[#5A5A40] font-bold text-[10px]">
                      {cond}
                    </span>
                  ))}
                </div>
                {selectedPatient.clinicalProfile.otherHealthConditions && (
                  <p className="text-[11px] text-[#5A5A40] font-medium mt-1.5 pt-1 border-t border-[#5A5A40]/10">
                    <span className="font-bold">Otras:</span> {selectedPatient.clinicalProfile.otherHealthConditions}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Biometría
                </span>
                <p className="font-semibold text-[#2D2D2D]">
                  Peso: {selectedPatient.clinicalProfile.weightKg} kg • Altura: {selectedPatient.clinicalProfile.heightCm} cm
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Parámetros del Ciclo
                </span>
                <p className="font-semibold text-[#2D2D2D]">
                  Última Regla: {selectedPatient.clinicalProfile.lastPeriodStartDate}
                </p>
                <p className="text-[11px] text-[#5A5A40]">
                  Duración: {selectedPatient.clinicalProfile.periodDurationDays} días (Ciclo: {selectedPatient.clinicalProfile.cycleDurationDays} días)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F8F3] border border-[#5A5A40]/10">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40] block mb-1">
                  Método Anticonceptivo
                </span>
                <p className="font-semibold text-[#2D2D2D]">
                  {selectedPatient.clinicalProfile.contraceptiveMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Registros de Diario & Frases Resumen Diario */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center justify-between pb-2 border-b border-[#5A5A40]/10">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5A5A40]" />
                <span>Historial de Diario & Frases Resumen del Día</span>
              </span>
              <span className="sans text-[10px] text-[#5A5A40]/70 font-semibold">
                {selectedPatient.journalEntries.length} registros
              </span>
            </h3>

            {selectedPatient.journalEntries.length > 0 ? (
              <div className="space-y-3">
                {selectedPatient.journalEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-2xl bg-white border border-[#5A5A40]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {entry.mood === 'calm' ? '😌' : entry.mood === 'anxious' ? '😰' : entry.mood === 'overwhelmed' ? '😣' : '😔'}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-[#2D2D2D] capitalize">{entry.mood}</span>
                          <span className="sans text-[10px] text-[#5A5A40] block">{entry.dateStr}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E8DCC4]/50 text-[#5A5A40] font-bold text-[10px]">
                        Intensidad: {entry.intensity}/5
                      </span>
                    </div>

                    {/* Highlighted Day Summary Phrase */}
                    {entry.daySummaryPhrase && (
                      <div className="p-3 rounded-xl bg-[#E8DCC4]/30 border border-[#5A5A40]/15">
                        <span className="sans text-[9px] uppercase tracking-widest font-bold text-[#5A5A40] block mb-0.5">
                          Frase Resumen del Día ("¿Cómo describirías tu día hoy?"):
                        </span>
                        <p className="serif text-xs font-bold text-[#2D2D2D] italic">
                          "{entry.daySummaryPhrase}"
                        </p>
                      </div>
                    )}

                    <p className="sans text-xs text-[#2D2D2D]/90 leading-relaxed bg-[#F9F8F3] p-3 rounded-xl">
                      "{entry.note}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sans text-xs text-[#5A5A40]/70 italic py-4 text-center">
                Sin entradas de diario registradas para esta paciente.
              </p>
            )}
          </div>

          {/* Historial de Evaluaciones EPDS */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center justify-between pb-2 border-b border-[#5A5A40]/10">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D67C65]" />
                <span>Evaluación de Depresión Perinatal de Edimburgo (EPDS)</span>
              </span>
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70">
                Puntaje actual: {selectedPatient.epdsScore}/30
              </span>
            </h3>

            {selectedPatient.epdsHistory.map((epds) => (
              <div key={epds.id} className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#2D2D2D]">Evaluación EPDS del {epds.dateStr}</span>
                    <p className="sans text-[10px] text-[#5A5A40]">
                      Puntaje Total: <span className="font-bold text-[#2D2D2D]">{epds.totalScore} / 30</span>
                    </p>
                  </div>
                  {getRiskBadge(epds.riskLevel)}
                </div>

                {epds.item10Score > 0 && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Ítem 10 (Riesgo de autolesión): Puntaje {epds.item10Score} - Alerta clínica activada.</span>
                  </div>
                )}

                {epds.notes && (
                  <p className="sans text-xs text-[#5A5A40] leading-relaxed bg-[#F9F8F3] p-2.5 rounded-xl">
                    <span className="font-bold">Observaciones:</span> {epds.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Historial de Evaluaciones GAD-7 (Ansiedad) */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center justify-between pb-2 border-b border-[#5A5A40]/10">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5A5A40]" />
                <span>Test de Ansiedad Generalizada (GAD-7)</span>
              </span>
              <span className="sans text-[10px] font-bold text-[#5A5A40]/70">
                Puntaje actual: {selectedPatient.gad7Score}/21
              </span>
            </h3>

            {selectedPatient.gad7History && selectedPatient.gad7History.length > 0 ? (
              selectedPatient.gad7History.map((gad) => (
                <div key={gad.id} className="p-4 rounded-2xl bg-white border border-[#5A5A40]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[#2D2D2D]">Evaluación GAD-7 del {gad.dateStr}</span>
                      <p className="sans text-[10px] text-[#5A5A40]">
                        Puntaje Total: <span className="font-bold text-[#2D2D2D]">{gad.totalScore} / 21</span>
                      </p>
                    </div>
                    {getGad7Badge(gad.riskLevel)}
                  </div>

                  {gad.notes && (
                    <p className="sans text-xs text-[#5A5A40] leading-relaxed bg-[#F9F8F3] p-2.5 rounded-xl">
                      <span className="font-bold">Observaciones:</span> {gad.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="sans text-xs text-[#5A5A40]/70 italic py-2 text-center">
                Sin evaluaciones GAD-7 registradas aún.
              </p>
            )}
          </div>

          {/* Seccion de Notas Privadas del Psicologo */}
          <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#5A5A40]/15 soft-shadow space-y-4">
            <h3 className="serif text-base font-bold text-[#5A5A40] flex items-center gap-2 pb-2 border-b border-[#5A5A40]/10">
              <FileText className="w-4 h-4 text-[#5A5A40]" />
              <span>Notas Clínicas de Sesión del Psicólogo Tratante</span>
            </h3>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                placeholder="Escribe tus notas de sesión, acuerdos de tratamiento o indicaciones terapéuticas privadas..."
                className="w-full p-4 rounded-2xl bg-white border border-[#5A5A40]/20 text-xs text-[#2D2D2D] focus:outline-hidden focus:border-[#5A5A40] leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePsychologistNote}
                  className="px-5 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs active:scale-95"
                >
                  {isNoteSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>¡Nota Clínica Guardada!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Nota de Sesión</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
