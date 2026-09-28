/**
 * Especificaciones clínicas y terapéuticas oficiales del dispositivo Wiggle.
 * Enfocado exclusivamente en las habilidades trabajadas y beneficios terapéuticos.
 * (Sin mención de materiales ni rellenos).
 */

export interface WiggleZoneDetail {
  id: 'amarillo' | 'verde' | 'azul' | 'rojo' | 'base_giratoria' | 'canasta' | 'mini_saquitos' | 'arco';
  name: string;
  emoji: string;
  colorName: string;
  colorHex: string;
  habilidadClave: string;
  therapeuticHelp: string;
  howToPerform: string;
  clinicalGoals: string[];
}

export const WIGGLE_ZONES_INFO: Record<string, WiggleZoneDetail> = {
  amarillo: {
    id: 'amarillo',
    name: 'Almohadilla Amarilla',
    emoji: '🟡',
    colorName: 'Zona Amarilla',
    colorHex: '#E59F2D',
    habilidadClave: 'Fuerza, movilidad y coordinación del pie y la pierna',
    therapeuticHelp: 'Ejercicios destinados a fortalecer la musculatura plantar y de la pierna, mejorando el rango de flexión y la coordinación motriz durante el apoyo.',
    howToPerform: 'Apoya el pie sobre la almohadilla amarilla realizando presiones controladas y flexiones activas de tobillo.',
    clinicalGoals: [
      'Aumento de la fuerza muscular de tobillo y pantorrilla',
      'Mejora de la amplitud de flexión dorsal y plantar',
      'Coordinación de cadenas musculares de la pierna',
      'Activación neuromuscular para el impulso de la marcha',
    ],
  },
  verde: {
    id: 'verde',
    name: 'Almohadilla Verde',
    emoji: '🟢',
    colorName: 'Zona Verde',
    colorHex: '#528E5A',
    habilidadClave: 'Equilibrio, control y adaptación al movimiento',
    therapeuticHelp: 'Actividades que desafían la estabilidad y estimulan los reflejos propioceptivos, ayudando a que el pie se adapte con seguridad a diferentes apoyos e inclinaciones.',
    howToPerform: 'Transfiere el peso hacia la almohadilla verde realizando balanceos suaves para mantener el centro de gravedad estable.',
    clinicalGoals: [
      'Entrenamiento del equilibrio dinámico y estático',
      'Desarrollo del control motor fino ante cambios de peso',
      'Adaptación propioceptiva de receptores articulares',
      'Confianza y seguridad en transferencias de apoyo',
    ],
  },
  azul: {
    id: 'azul',
    name: 'Almohadilla Azul',
    emoji: '🔵',
    colorName: 'Zona Azul',
    colorHex: '#2E6F9E',
    habilidadClave: 'Motricidad, coordinación y control de los movimientos del pie',
    therapeuticHelp: 'Ejercicios suaves enfocados en reactivar la precisión motriz, la fluidez articular y el control voluntario del pie, especialmente en fases iniciales.',
    howToPerform: 'Realiza toques pausados y deslizamientos precisos con la punta o el talón, buscando un movimiento limpio y sin tensión.',
    clinicalGoals: [
      'Estimulación de la motricidad fina y gruesa del pie',
      'Control voluntario y coordinación intermuscular',
      'Movilización articular sin impacto ni sobrecarga',
      'Recuperación de la fluidez en el patrón de movimiento',
    ],
  },
  rojo: {
    id: 'rojo',
    name: 'Almohadilla Roja (Circuito Zigzag)',
    emoji: '🔴',
    colorName: 'Zona Roja Zigzag',
    colorHex: '#D14332',
    habilidadClave: 'Precisión, coordinación, movilidad y control del movimiento en zigzag',
    therapeuticHelp: 'Circuito de recorrido en zigzag donde el usuario mueve la pieza deslizante con el pie, trabajando la coordinación ojo-pie, la precisión del trazo y la estabilidad articular.',
    howToPerform: 'Coloca los dedos o la planta sobre la pieza móvil y deslízala con control a lo largo de todo el canal en zigzag de inicio a fin.',
    clinicalGoals: [
      'Precisión milimétrica en el direccionamiento del pie',
      'Coordinación óculo-pedal compleja en curvas y ángulos',
      'Movilidad multidireccional controlada',
      'Disociación y control fino de los movimientos del tobillo',
    ],
  },
  base_giratoria: {
    id: 'base_giratoria',
    name: 'Base de Madera Giratoria',
    emoji: '🔄',
    colorName: 'Base Giratoria',
    colorHex: '#D8B486',
    habilidadClave: 'Movilidad, coordinación, control y amplitud de movimiento rotacional',
    therapeuticHelp: 'La base gira de forma suave y controlada. El usuario rota la plataforma usando la musculatura del pie y la pierna para ganar amplitud rotacional (pronación y supinación).',
    howToPerform: 'Apoya el pie firmemente y realiza un giro suave de la base hacia la izquierda y hacia la derecha, manteniendo el control de la velocidad.',
    clinicalGoals: [
      'Incremento de la amplitud articular en rotación interna y externa',
      'Fortalecimiento de los músculos peroneos y tibiales',
      'Coordinación de rotación de cadera, rodilla y tobillo',
      'Control cinemático continuo en plano transversal',
    ],
  },
  canasta: {
    id: 'canasta',
    name: 'Canasta Central Retirable',
    emoji: '🧺',
    colorName: 'Canasta Central',
    colorHex: '#3B82F6',
    habilidadClave: 'Alcance, precisión, coordinación y control del pie',
    therapeuticHelp: 'Ubicada en el centro del dispositivo, esta canasta cuenta con una asa diseñada para ser retirada y vuelta a colocar utilizando exclusivamente el pie.',
    howToPerform: 'Engancha el asa de la canasta con el empeine o los dedos del pie, elévala del centro, colócala a un lado y vuelve a insertarla con precisión.',
    clinicalGoals: [
      'Entrenamiento de alcance tridimensional con el pie',
      'Flexión activa de rodilla y cadera combinada',
      'Control de inserción y precisión espacial',
      'Autonomía funcional en tareas motoras complejas',
    ],
  },
  mini_saquitos: {
    id: 'mini_saquitos',
    name: '3 Mini Saquitos Terapéuticos',
    emoji: '👝',
    colorName: 'Mini Saquitos (3 unidades)',
    colorHex: '#10B981',
    habilidadClave: 'Prensión podal, precisión, coordinación, alcance y motricidad fina',
    therapeuticHelp: 'Los 3 mini saquitos son manipulados con los dedos del pie. Se extraen y se colocan dentro de la canasta para reeducar la prensión y la coordinación óculo-pedal.',
    howToPerform: 'Usa los dedos del pie a modo de pinza suave para sujetar cada mini saquito, elévalo y deposítalo dentro de la canasta central uno por uno.',
    clinicalGoals: [
      'Fortalecimiento de los flexores cortos y largos de los dedos',
      'Desarrollo del arco plantar activo',
      'Motricidad fina podal y prensión selectiva',
      'Puntería y destreza en tareas lúdicas de rehabilitación',
    ],
  },
  arco: {
    id: 'arco',
    name: 'Arco con Cuadrados Azules Deslizantes',
    emoji: '🪵',
    colorName: 'Arco y Cuadrados Azules',
    colorHex: '#3B82F6',
    habilidadClave: 'Movilidad en arco, coordinación, alcance y control motriz',
    therapeuticHelp: 'Estructura curvada de madera noble que incorpora piezas cuadradas azules ensartadas que se deslizan de un lado a otro a lo largo del arco con el pie. Trabaja la flexión y extensión coordinada, el control motriz en curva y la elongación activa.',
    howToPerform: 'Usa los dedos o el borde del pie para empujar los cuadrados azules y pasarlos de un extremo al otro a lo largo de la curvatura del arco de madera.',
    clinicalGoals: [
      'Coordinación de movimientos en trayectoria curva continua',
      'Fortalecimiento de flexores y extensores del tobillo y pie',
      'Precisión y control de empuje sin perder el contacto',
      'Elongación y descarga anatómica de la fascia plantar',
    ],
  },
};
