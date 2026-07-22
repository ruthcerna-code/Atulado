import { EducationalArticle } from '../types';

export const INITIAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'ley-dominga-guia',
    title: 'Ley Dominga (Ley N° 21.371): Tus derechos en la pérdida gestacional o perinatal',
    category: 'Ley Dominga',
    readTime: '4 min de lectura',
    summary: 'Conoce el marco legal en Chile que garantiza un protocolo de contención, empatía, derecho a despedida y permiso laboral especial.',
    content: [
      'La Ley N° 21.371, conocida como Ley Dominga, fue promulgada en Chile para establecer un estándar mínimo de empatía, dignidad y respeto en todas las instituciones de salud (públicas y privadas) ante la pérdida gestacional o perinatal.',
      'Derechos Claves Garantiados por Ley:',
      '1. Protocolo de Acompañamiento Humano: La madre y su acompañante tienen derecho a estar juntos en un espacio resguardado y en silencio, alejados de las salas de maternidad general con recién nacidos.',
      '2. Identificación y Despedida Respetuosa: Derecho a llamar a la hija o hijo por su nombre, recibir recuerdos (huellas, fotografías) si la familia lo desea, y realizar rituales de despedida.',
      '3. Permiso Laboral Especial: Se otorgan 7 días corridos de permiso pagado para la madre y el padre en caso de muerte gestacional, y 10 días en caso de muerte perinatal.',
      '4. Contención Profesional: Obligatoriedad de asistencia psicológica y emocional inmediata brindada por el equipo de salud.',
      'Si sientes que tus derechos no fueron respetados, puedes realizar un reclamo formal en la Superintendencia de Salud o solicitar orientación a Fundación Amparos.'
    ],
    isBookmarked: true
  },
  {
    id: 'comprender-el-duelo-perinatal',
    title: 'Comprender las Olas del Duelo Perinatal',
    category: 'Duelo Perinatal',
    readTime: '5 min de lectura',
    summary: 'El duelo perinatal no sigue una línea recta. Acepta el vaivén de tus emociones sin juzgarte.',
    content: [
      'La pérdida de un bebé deseado irrumpe en el cuerpo, la mente y el proyecto de vida. Muchas madres y familias describen el duelo como las olas del mar: momentos de calma seguidos de marejadas intensas de tristeza, rabia o vacío.',
      'Manifestaciones Físicas y Emocionales Frecuentes:',
      '• Sensación de vacío en los brazos o dolor corporal.',
      '• Alteraciones del sueño o pesadillas recurrentes.',
      '• Preguntas sin respuesta ("¿Por qué a mí?", "¿Qué hice mal?"). Sabe que NADA de lo que hiciste causó esta pérdida.',
      '• Incomodidad social o dificultad para retomar actividades cotidianas.',
      'Recuerda: No hay un "tiempo límite" para sanar. Permítete sentir cada emoción sin exigirte "estar bien" para los demás.'
    ],
    isBookmarked: false
  },
  {
    id: 'ansiedad-posparto-y-gestacion',
    title: 'Diferenciando el Baby Blues de la Depresión y Ansiedad Perinatal',
    category: 'Ansiedad y Depresión',
    readTime: '6 min de lectura',
    summary: 'Entiende los cambios hormonales y emocionales normales del posparto frente a alertas clínicas que requieren apoyo profesional.',
    content: [
      'Cerca del 80% de las personas puérperas experimentan el denominado "Baby Blues" o tristeza puerperal durante las primeras dos semanas tras el parto. Sin embargo, cuando la tristeza, el insomnio extremo o la ansiedad angustiante se extienden más allá de 14 días, podemos estar ante una depresión posparto.',
      'Señales de Alerta a Observar:',
      '• Sensación constante de angustia, opresión en el pecho o ataques de pánico.',
      '• Pensamientos intrusivos de miedo irrazonable sobre la salud del bebé o la propia.',
      '• Pérdida total del interés o placer en actividades que antes disfrutabas.',
      '• Dificultad para conectar con el bebé o sentimiento de no ser una "buena madre".',
      'La depresión perinatal es una condición médica y emocional tratable. Pedir ayuda es un acto de profundo amor hacia ti y tu familia.'
    ],
    isBookmarked: false
  },
  {
    id: 'liberarse-de-la-culpa-materna',
    title: 'Liberándote de la Culpa: El Mito de la Maternidad Perfecta',
    category: 'Culpa y Autocuidado',
    readTime: '4 min de lectura',
    summary: 'Estrategias para desarmar la autoexigencia y dar paso a un autocuidado compasivo y realista.',
    content: [
      'La sociedad a menudo impone un ideal irreal de la maternidad: la madre siempre dispuesta, feliz, paciente y abnegada. Cuando la realidad trae cansancio, ambivalencia o frustración, aparece la culpa.',
      'Pasos para Practicar la Autocompasión:',
      '1. Valida tus necesidades básicas: Dormir, alimentarte bien y tener 15 minutos en silencio no son lujos, son necesidades vitales.',
      '2. Reemplaza "Debería" por "Elijo": En lugar de "Debería hacerlo todo bien", intenta "Elijo hacer lo que puedo hoy con la energía que tengo".',
      '3. Rodéate de tribu: Hablar con otras madres que comparten sus verdades ayuda a desmontar el aislamiento.'
    ],
    isBookmarked: false
  },
  {
    id: 'rol-del-acompanante-y-pareja',
    title: 'El Rol de la Pareja y la Familia: Cómo Acompañar Verdaderamente',
    category: 'Pareja y Redes',
    readTime: '5 min de lectura',
    summary: 'Guía práctica para parejas y seres queridos sobre qué decir, qué no decir y cómo sostener sin invadir.',
    content: [
      'Para las parejas o familiares cercanos, ver a la madre sufrir o atravesar un duelo puede generar impotencia. A menudo se comete el error de intentar "solucionar" el dolor rápidamente o pronunciar frases cliché.',
      'Frases a Evitar:',
      '❌ "Eres joven, ya tendrás otro bebé."',
      '❌ "Todo pasa por algo."',
      '❌ "Tienes que estar fuerte por tu otro hijo."',
      'Frases de Apoyo Real:',
      '✅ "Lamento profundamente tu dolor. Estoy aquí para lo que necesites, sin juzgarte."',
      '✅ "Tu bebé y tu proceso importan. Tómate el tiempo que sea necesario."',
      '✅ "Hoy me encargo yo del almuerzo y las tareas de la casa para que puedas descansar."'
    ],
    isBookmarked: false
  }
];
