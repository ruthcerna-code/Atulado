import { SupportResource } from '../types';

export const INITIAL_RESOURCES: SupportResource[] = [
  {
    id: 'linea-4141',
    name: 'Línea de Prevención del Suicidio *4141',
    category: 'Línea de Crisis',
    region: 'Chile - Cobertura Nacional',
    phone: '*4141',
    hours: '24 horas / 7 días a la semana',
    description: 'Atención gratuita y confidencial atendida por psicólogos especializados del Ministerio de Salud de Chile para personas en crisis emocional.',
    website: 'https://www.minsal.cl',
    isFavorite: true,
    isEmergencyLine: true
  },
  {
    id: 'salud-responde',
    name: 'Salud Responde (Minsal)',
    category: 'Línea de Crisis',
    region: 'Chile - Cobertura Nacional',
    phone: '600 360 7777',
    hours: '24/7',
    description: 'Orientación médica y psicológica telefónica para urgencias de salud general y bienestar maternal.',
    website: 'https://saludresponde.minsal.cl',
    isFavorite: true,
    isEmergencyLine: true
  },
  {
    id: 'fundacion-amparos',
    name: 'Fundación Amparos (Duelo Perinatal)',
    category: 'Fundación / Apoyo',
    region: 'Región Metropolitana y Online',
    phone: '+56 9 8765 4321',
    hours: 'Lun a Vie 09:00 - 18:00 hrs',
    description: 'Organización dedicada a brindar contención, grupos de apoyo mutuo y formación en torno a la muerte gestacional y perinatal.',
    website: 'https://www.fundacionamparos.cl',
    isFavorite: true
  },
  {
    id: 'red-salud-mental-perinatal',
    name: 'Red Chilena de Salud Mental Perinatal',
    category: 'Salud Mental Perinatal',
    region: 'Nacional / Consulta remota',
    phone: '+56 2 2345 6789',
    hours: 'Lun a Sáb 08:30 - 19:00 hrs',
    description: 'Directorio de psicólogas, psiquiatras y matronas formadas en salud mental gestacional, duelo y posparto.',
    website: 'https://www.saludmentalperinatal.cl',
    isFavorite: false
  },
  {
    id: 'hospital-salvador',
    name: 'Hospital del Salvador - Urgencia Psiquiátrica',
    category: 'Hospital / Urgencia',
    region: 'Santiago / Providencia',
    phone: '+56 2 2575 4000',
    address: 'Av. Salvador 364, Providencia, Región Metropolitana',
    hours: 'Urgencias 24/7',
    description: 'Atención de urgencia médica y psiquiátrica de alta complejidad en el sistema público.',
    isFavorite: false
  },
  {
    id: 'hospital-san-borja',
    name: 'Hospital Clínico San Borja Arriarán - Maternidad',
    category: 'Hospital / Urgencia',
    region: 'Santiago Centro',
    phone: '+56 2 2574 8000',
    address: 'Av. Santa Rosa 1234, Santiago',
    hours: 'Urgencias Maternidad 24/7',
    description: 'Centro de referencia nacional con protocolo activo Ley Dominga para acompañamiento humano y digno.',
    isFavorite: false
  }
];
