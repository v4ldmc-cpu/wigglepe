import { FAQItem, ForumPost } from '../types';

export const FAQ_LIST: FAQItem[] = [
  {
    category: 'dispositivo',
    question: '¿Qué elementos componen el dispositivo Wiggle?',
    answer: 'El Wiggle consta de una base circular de madera giratoria, 4 almohadillas sensoriales de colores (amarilla para fuerza, verde para equilibrio, azul para motricidad y roja con circuito en zigzag para precisión), un arco ergonómico central, una canasta central retirable con el pie y 3 mini saquitos para ejercicios de prensión podal.',
  },
  {
    category: 'dispositivo',
    question: '¿Qué incluye el kit oficial Wiggle?',
    answer: 'El kit incluye: 1 Base giratoria de madera noble con 4 almohadillas de colores (incluyendo el circuito en zigzag en la roja), 1 arco de madera para soporte postural, 1 canasta central retirable con asa, y 3 mini saquitos para estimulación y prensión con los dedos del pie.',
  },
  {
    category: 'ejercicios',
    question: '¿Cuántos minutos al día se recomienda usar el Wiggle?',
    answer: 'Para la fase inicial recomendamos sesiones de 8 a 15 minutos diarios, preferentemente a la misma hora para consolidar el hábito. Si tu condición es fractura reciente, inicia con 8 minutos y eleva progresivamente según la tolerancia y recomendación de tu fisioterapeuta.',
  },
  {
    category: 'seguridad',
    question: '¿Qué debo hacer si siento molestia o calambre durante el ejercicio?',
    answer: 'Una ligera sensación de trabajo muscular o estiramiento es esperable, pero NUNCA debes sentir dolor agudo, pinchazos o sensación quemante. Si esto ocurre, detén la sesión de inmediato, coloca los pies en reposo elevado y consulta a tu profesional tratante o pregúntale a Wiggy.',
  },
  {
    category: 'limpieza',
    question: '¿Cómo se limpian las almohadillas y cojines de Wiggle?',
    answer: 'Las fundas de tela son lavables a mano con agua tibia y jabón neutro. La base de madera se limpia simplemente con un paño de microfibra ligeramente húmedo. No usar alcohol directo ni productos abrasivos para proteger el acabado natural.',
  },
];

export const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: 'Elena R. (Acompañante de Don Pedro, 78 años)',
    authorCondition: 'Uso de Andador',
    date: 'Hace 2 días',
    title: '¡El juego de la canastilla azul ha sido un éxito total!',
    content: 'A mi papá le costaba mucho hacer sus ejercicios de rehabilitación porque los sentía aburridos y repetitivos. Desde que le trajimos el Wiggle, compite con sus nietos para ver cuántas almohadillas amarillas puede encestar en la canastita azul en 2 minutos. Sus tobillos ya no están rígidos.',
    likes: 24,
    likedByMe: true,
    physioReply: '¡Qué gran noticia Elena! Ese ejercicio activa los flexores profundos de los dedos (flexor largo del hallux) y favorece la coordinación cerebral-motriz. ¡Felicidades a Don Pedro!',
    tags: ['Coordinación', 'Motivación Familiar', 'Andador'],
  },
  {
    id: 'p2',
    author: 'Javier M.',
    authorCondition: 'Recuperación de Fractura de Tobillo',
    date: 'Hace 4 días',
    title: '¿Algún tip para la transición entre cuadrante verde y amarillo?',
    content: 'Llevo 3 semanas post-inmovilización y al pasar del cojín verde al amarillo siento una leve rigidez en la parte anterior de la espinilla. ¿Debería acercar más la silla al Wiggle?',
    likes: 15,
    likedByMe: false,
    physioReply: 'Hola Javier. Sí, acercar la silla para mantener la rodilla exactamente a 90 grados reduce la tensión del músculo tibial anterior. Haz 3 respiraciones profundas antes de pasar al amarillo y no fuerces el rango.',
    tags: ['Fractura', 'Técnica', 'Ergonomía'],
  },
  {
    id: 'p3',
    author: 'Lucía P.',
    authorCondition: 'Silla de Ruedas',
    date: 'Hace 1 semana',
    title: 'Uso del Wiggle mirando televisión por la tarde',
    content: 'Uso la silla de ruedas la mayor parte del día por mi trabajo. Pongo el Wiggle debajo de mi escritorio y hago series de 5 minutos entre reuniones. La hinchazón de los tobillos ha desaparecido casi por completo.',
    likes: 31,
    likedByMe: false,
    physioReply: 'Excelente integración en la rutina diaria Lucía. El bombeo en los cojines activa la bomba muscular de la pantorrilla, previniendo el estancamiento circulatorio.',
    tags: ['Circulación', 'Silla de Ruedas', 'Bienestar'],
  },
];
