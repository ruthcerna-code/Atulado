import { CommunityWorkshop } from '../types';

export const INITIAL_WORKSHOPS: CommunityWorkshop[] = [
  {
    id: 'taller-duelo-amparos',
    title: 'Círculo de Acompañamiento en Duelo Perinatal',
    category: 'Duelo Perinatal',
    speaker: 'Ps. Sofía Alarcón',
    role: 'Especialista en Psicología Perinatal',
    date: 'Jueves 24 de Julio',
    time: '19:00 - 20:30 hrs',
    mode: 'Online (Zoom)',
    description: 'Espacio confidencial para madres y parejas que han sufrido la pérdida de sus bebés. Un lugar seguro para compartir emociones, memoria y sanación.',
    isEnrolled: false,
    spotsLeft: 8
  },
  {
    id: 'taller-ley-dominga',
    title: 'Conoce tus Derechos: Taller Informativo Ley Dominga',
    category: 'Legal / Ley Dominga',
    speaker: 'Abog. Marcela Fuentes',
    role: 'Asesora en Derechos Maternos',
    date: 'Martes 29 de Julio',
    time: '18:30 - 19:30 hrs',
    mode: 'Online (Zoom)',
    description: 'Aprende a hacer valer la Ley Dominga en clínicas y hospitales, exigencia de permisos laborales, reclamos formales y resguardo de la intimidad.',
    isEnrolled: true,
    spotsLeft: 15
  },
  {
    id: 'taller-autocuidado-posparto',
    title: 'Taller de Autorregulación y Pausa Consciente en el Posparto',
    category: 'Autocuidado',
    speaker: 'Matrona Camila Sepúlveda',
    role: 'Consultora de Lactancia e Instructor de Mindfulness',
    date: 'Sábado 2 de Agosto',
    time: '11:00 - 12:30 hrs',
    mode: 'Online (Zoom)',
    description: 'Aprende técnicas sencillas de respiración diafragmática, estimulación del nervio vago y ejercicios de grounding para momentos de sobrecarga maternal.',
    isEnrolled: false,
    spotsLeft: 12
  }
];
