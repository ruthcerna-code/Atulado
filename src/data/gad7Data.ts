import { Gad7Question } from '../types';

export const GAD7_QUESTIONS: Gad7Question[] = [
  {
    id: 1,
    question: "1. Sentirse nerviosa, ansiosa o con los nervios de punta:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 2,
    question: "2. No poder parar o controlar las preocupaciones:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 3,
    question: "3. Preocuparse demasiado por diferentes cosas:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 4,
    question: "4. Dificultad para relajarse:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 5,
    question: "5. Estar tan inquieta que es difícil permanecer sentada o quieta:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 6,
    question: "6. Molestarse o irritarse fácilmente:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  },
  {
    id: 7,
    question: "7. Sentir miedo como si algo terrible fuera a pasar:",
    options: [
      { text: "Para nada / Nunca", score: 0 },
      { text: "Varios días", score: 1 },
      { text: "Más de la mitad de los días", score: 2 },
      { text: "Casi todos los días", score: 3 }
    ]
  }
];

export interface Gad7Interpretation {
  title: string;
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'severe';
  badgeColor: string;
  badgeText: string;
  recommendation: string;
}

export function interpretGad7Score(totalScore: number): Gad7Interpretation {
  if (totalScore <= 4) {
    return {
      title: "Ansiedad Mínima (Normal)",
      riskLevel: 'minimal',
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      badgeText: "Nivel Mínimo (0-4 pts)",
      recommendation: "Tus síntomas de ansiedad se encuentran dentro del rango mínimo o normal. Mantén tus espacios de descanso, ejercicios de respiración y hábitos de bienestar."
    };
  } else if (totalScore <= 9) {
    return {
      title: "Ansiedad Leve",
      riskLevel: 'mild',
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      badgeText: "Nivel Leve (5-9 pts)",
      recommendation: "Presentas manifestaciones leves de ansiedad. Te sugerimos realizar ejercicios regulares de regulación emocional, pausas de respiración y compartir tus sensaciones."
    };
  } else if (totalScore <= 14) {
    return {
      title: "Ansiedad Moderada",
      riskLevel: 'moderate',
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      badgeText: "Nivel Moderado (10-14 pts)",
      recommendation: "Tus respuestas reflejan un nivel moderado de ansiedad. Se aconseja conversar con tu psicólogo/a de cabecera o equipo médico para orientación preventiva."
    };
  } else {
    return {
      title: "Ansiedad Severa",
      riskLevel: 'severe',
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      badgeText: "Nivel Severo (15-21 pts)",
      recommendation: "El puntaje indica síntomas significativos de ansiedad. Se recomienda agendar una evaluación profesional con tu psicólogo/a o acudir a tu centro de salud de referencia."
    };
  }
}
