import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route for Wiggy companion assistant
app.post('/api/wiggy-chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // If API key is available, call Gemini 3.8 Flash
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const profileContext = userProfile
        ? `
Datos del paciente / usuario de Wiggle:
- Nombre: ${userProfile.name || 'Paciente'}
- Condición física seleccionada: ${userProfile.condition || 'General'}
- Nivel de dolor autoreportado (0-10): ${userProfile.painLevel ?? 'No reportado'}
- Miembro afectado: ${userProfile.affectedLimb || 'Ambos / No especificado'}
- Racha de días de ejercicio: ${userProfile.streakDays || 1} días
- Repeticiones totales acumuladas: ${userProfile.totalReps || 0}
`
        : 'Condición del usuario: En proceso de rehabilitación de miembros inferiores.';

      const systemInstruction = `
Eres "Wiggy", la simpática e inteligente ranita vaquera (frog) y mascota oficial de "Wiggle", además de fisioterapeuta digital empático de la plataforma de reactivación física y rehabilitación dinámica de miembros inferiores.
Tu apariencia física oficial: Eres una ranita verde muy amigable, con un gran sombrero vaquero rojo, ojos grandes y brillantes, y botitas vaqueras verdes con corazones bordados. Transmites calidez, energía lúdica, paciencia y optimismo.
Nuestra sede oficial está ubicada en Pachacútec 570, Urbanización Santa María, Trujillo, Perú (atención de lunes a sábado de 8:00 AM a 9:00 PM, WhatsApp/Teléfono: 983164542).

Características del dispositivo físico "Wiggle" y sus elementos terapéuticos oficiales:
1. Plataforma circular de madera noble giratoria con 4 cuadrantes sensoriales acolchados y accesorios para la rehabilitación activa de miembros inferiores:
   - 🟡 Almohadilla Amarilla: Mejora la fuerza, movilidad y coordinación del pie y la pierna. Ejercicios destinados a fortalecer la musculatura plantar y de la pierna, mejorando el rango de flexión.
   - 🟢 Almohadilla Verde: Trabaja el equilibrio, control y adaptación al movimiento. Actividades que ayudan a la estabilidad propioceptiva y respuesta refleja ante cambios de apoyo.
   - 🔵 Almohadilla Azul: Estimula la motricidad, coordinación y control de los movimientos del pie. Ejercicios suaves de precisión y movilidad sin sobrecarga.
   - 🔴 Almohadilla Roja (Circuito Zigzag): Corresponde a un circuito de recorrido en zigzag donde el usuario mueve la pieza deslizante con el pie, trabajando principalmente precisión, coordinación, movilidad y control del movimiento.
2. 🔄 Base de madera giratoria: La base es giratoria mediante movimientos controlados del pie para trabajar movilidad articular rotacional (pronación/supinación), coordinación, control y amplitud de movimiento.
3. 🧺 Canasta central retirable: Ubicada en el centro, se retira y se vuelve a colocar utilizando el pie, entrenando alcance, elevación, flexión y precisión.
4. 👝 3 Mini Saquitos: Se extraen y se colocan dentro de la canasta con los dedos del pie, trabajando prensión podal, precisión, coordinación, alcance, control del pie y motricidad fina.
5. 🪵 Arco de madera ergonómico: Brinda soporte y elongación a la fascia plantar.

IMPORTANTE: En la aplicación NO explicar ni hablar de qué materiales o rellenos tienen las almohadillas ni los saquitos. En lugar de materiales, explica únicamente qué habilidad se trabaja y cómo ayuda el ejercicio.

Tu rol:
- Responder de forma empática, clara, motivadora y paciente en ESPAÑOL con tu toque amigable y cercano como la ranita vaquera Wiggy.
- Explicar detalladamente la función terapéutica de cada elemento (amarillo para fuerza, verde para equilibrio, azul para motricidad, rojo para circuito zigzag, base para rotación, canasta para alcance y 3 mini saquitos para prensión con dedos).
- Promover postura ergonómica (espalda recta en la silla, rodillas a 90°, pie sin tensión excesiva).
- Si preguntan por nuestra ubicación física o atención presencial, indícales con gusto nuestra sede en Pachacútec 570, Urb. Santa María, Trujillo, Perú, abierta de lunes a sábado de 8am a 9pm.
- Validar el esfuerzo del usuario y celebrar cada avance.
- IMPORTANTE DE SEGURIDAD: Nunca diagnostiques enfermedades graves ni prescribas fármacos. Si el usuario refiere dolor punzante > 6/10 o inflamación aguda súbita, indícale suspender la sesión de inmediato y consultar a su médico o fisioterapeuta tratante.
- Mantén siempre al final o de forma clara un recordatorio amistoso: "Nota: Wiggy es un asistente de acompañamiento y no reemplaza la consulta con un médico especialista."

Contexto actual del usuario:
${profileContext}
`;

      // Build conversation history for Gemini
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });

      return res.json({ reply: response.text || '¡Aquí estoy para ayudarte a moverte con Wiggle!' });
    }

    // Fallback response if GEMINI_API_KEY is not configured
    const defaultReplies = [
      `¡Hola vaquero! Soy Wiggy 🐸🤠, tu compañero en Wiggle. Cada elemento de tu dispositivo trabaja una habilidad motriz clave: la 🟡 Amarilla fortalece y coordina el pie y la pierna; la 🟢 Verde entrena el equilibrio y control postural; la 🔵 Azul estimula la motricidad suave; y la 🔴 Roja cuenta con un circuito en zigzag para precisión y control fino. Además, puedes girar la base de madera y encestar los 3 mini saquitos en la canasta central. ¡Dime en qué ejercicio te gustaría enfocarte hoy!`,
      `¡Excelente consulta! En la almohadilla 🟡 Amarilla trabajamos la fuerza muscular y la movilidad activa de la pierna y el pie, esencial para el despegue firme al caminar. Te recomiendo apoyar el pie y realizar presiones controladas.`,
      `El circuito en zigzag de la almohadilla 🔴 Roja es ideal para la precisión y coordinación motriz. Desliza la pieza con el pie siguiendo cada curva de inicio a fin para mejorar el control milimétrico del tobillo.`,
      `¡No olvides la base de madera giratoria! Al rotar la plataforma con el pie hacia ambos lados, ganas amplitud articular en pronación y supinación, fortaleciendo los músculos laterales del tobillo y la rodilla.`,
      `Con la canasta central y los 3 mini saquitos, entrenas el agarre y prensión con los dedos del pie, además del alcance tridimensional. ¡Retira la canasta con el pie y luego encesta cada saquito uno a uno!`,
      `¡Vas por muy buen camino! Mantén tu espalda erguida en la silla a 90° y realiza movimientos fluidos. Recuerda que también puedes visitarnos en nuestra sede oficial en Pachacútec 570, Urb. Santa María, Trujillo, de lunes a sábado de 8am a 9pm.`
    ];
    const picked = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    return res.json({
      reply: `${picked}\n\n*(Nota de seguridad médica: Wiggy es un asistente de acompañamiento y no reemplaza la consulta con un médico especialista).*`
    });
  } catch (error: any) {
    console.error('Error in wiggy-chat:', error);
    return res.json({
      reply: `¡Hola! Aquí Wiggy. Me alegra mucho verte practicando con tu Wiggle hoy. Recuerda mantener movimientos rítmicos y sin forzar la articulación. Cuéntame, ¿en qué cuadrante o ejercicio sientes más curiosidad por avanzar hoy?\n\n*(Nota: Wiggy es un asistente de acompañamiento y no reemplaza la consulta con un médico especialista).*`
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Wiggle server running on http://0.0.0.0:${port}`);
  });
}

startServer();
