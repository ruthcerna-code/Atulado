import { EpdsQuestion } from '../types';

export const EPDS_QUESTIONS: EpdsQuestion[] = [
  {
    id: 1,
    question: "1. He sido capaz de reírme y ver el lado divertido de las cosas:",
    options: [
      { text: "Tanto como siempre he sido capaz", score: 0 },
      { text: "No tanto ahora", score: 1 },
      { text: "Mucho menos ahora", score: 2 },
      { text: "No, en absoluto", score: 3 }
    ]
  },
  {
    id: 2,
    question: "2. He mirado el futuro con ilusión:",
    options: [
      { text: "Tanto como siempre", score: 0 },
      { text: "Algo menos de lo que era habitual", score: 1 },
      { text: "Mucho menos de lo que era habitual", score: 2 },
      { text: "Casi nada", score: 3 }
    ]
  },
  {
    id: 3,
    question: "3. Me he culpado sin necesidad cuando las cosas salían mal:",
    options: [
      { text: "Sí, la mayoría de las veces", score: 3 },
      { text: "Sí, algunas veces", score: 2 },
      { text: "No muy a menudo", score: 1 },
      { text: "No, nunca", score: 0 }
    ]
  },
  {
    id: 4,
    question: "4. He estado ansiosa o preocupada sin motivo alguno:",
    options: [
      { text: "No, para nada", score: 0 },
      { text: "Casi nunca", score: 1 },
      { text: "Sí, a veces", score: 2 },
      { text: "Sí, muy a menudo", score: 3 }
    ]
  },
  {
    id: 5,
    question: "5. He sentido miedo o pánico sin motivo alguno:",
    options: [
      { text: "Sí, bastante", score: 3 },
      { text: "Sí, a veces", score: 2 },
      { text: "No, no mucho", score: 1 },
      { text: "No, para nada", score: 0 }
    ]
  },
  {
    id: 6,
    question: "6. Las cosas me superan o me sobrepasan:",
    options: [
      { text: "Sí, la mayoría de las veces no he podido solucionarlas", score: 3 },
      { text: "Sí, a veces no he podido solucionarlas como de costumbre", score: 2 },
      { text: "No, la mayoría de las veces las he solucionado bastante bien", score: 1 },
      { text: "No, me he sentido tan capaz como siempre", score: 0 }
    ]
  },
  {
    id: 7,
    question: "7. Me he sentido tan desdichada que he tenido dificultades para dormir:",
    options: [
      { text: "Sí, la mayoría de las veces", score: 3 },
      { text: "Sí, a veces", score: 2 },
      { text: "No muy a menudo", score: 1 },
      { text: "No, en absoluto", score: 0 }
    ]
  },
  {
    id: 8,
    question: "8. Me he sentido triste o desgraciada:",
    options: [
      { text: "Sí, la mayoría de las veces", score: 3 },
      { text: "Sí, bastante a menudo", score: 2 },
      { text: "Not mucho", score: 1 },
      { text: "No, para nada", score: 0 }
    ]
  },
  {
    id: 9,
    question: "9. Me he sentido tan desgraciada que he estado llorando:",
    options: [
      { text: "Sí, la mayoría de las veces", score: 3 },
      { text: "Sí, bastante a menudo", score: 2 },
      { text: "Sólo en ocasiones", score: 1 },
      { text: "No, nunca", score: 0 }
    ]
  },
  {
    id: 10,
    question: "10. Se me ha pasado por la cabeza la idea de hacerme daño:",
    options: [
      { text: "Sí, bastante a menudo", score: 3 },
      { text: "A veces", score: 2 },
      { text: "Apenas nunca", score: 1 },
      { text: "Nunca", score: 0 }
    ]
  }
];

export function interpretEpdsScore(totalScore: number, item10Score: number) {
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  let title = 'Puntaje Bajo (0 - 9 puntos)';
  let recommendation = 'Tus respuestas no muestran signos de depresión perinatal o malestar clínico severo en este momento. Es importante continuar practicando tu autocuidado diario y apoyarte en tus seres queridos.';
  let badgeColor = 'bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/30';

  if (totalScore >= 13 || item10Score > 0) {
    riskLevel = 'high';
    title = 'Atención Especial Requerida (13+ puntos o alerta en pregunta 10)';
    recommendation = 'Tu puntaje indica la presencia de síntomas importantes de malestar emocional o sospecha de depresión perinatal. Le recomendamos encarecidamente contactar a un profesional de la salud mental o llamar a la línea de apoyo *4141.';
    badgeColor = 'bg-[#D67C65]/15 text-[#D67C65] border-[#D67C65]/40';
  } else if (totalScore >= 10) {
    riskLevel = 'moderate';
    title = 'Malestar Moderado (10 - 12 puntos)';
    recommendation = 'Presentas algunos signos de malestar o sobrecarga emocional. Se sugiere realizar un seguimiento continuo de tu diario emocional, repetir este cuestionario en dos semanas y conversar con tu matrona o médico.';
    badgeColor = 'bg-[#E8DCC4] text-[#5A5A40] border-[#5A5A40]/20';
  }

  return { riskLevel, title, recommendation, badgeColor };
}
