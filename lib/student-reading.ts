import type { Evaluation, Proposal } from './classroom';
import type { Subject } from './sample-data';

const reading = 'En la Escuela Horizonte quieren plantar 24 semillas de frijol en el huerto. Tienen cuatro charolas y quieren poner la misma cantidad de semillas en cada una. Cerca de la ventana entra luz natural casi todo el día. En el armario hay espacio, pero está oscuro. La maestra les recordó que, después de brotar, las plantas necesitan luz para crecer.';

const question = '¿Cuántas semillas pondrías en cada charola y en qué lugar las dejarías después de que broten? Explica tu cálculo y usa una pista del texto para justificar el lugar.';

export const readingChallenge = {
  id: 'semillas-huerto',
  title: '¿Dónde crecerán los frijoles?',
  subjects: ['Lengua', 'Ciencias', 'Matemáticas'] satisfies Subject[],
  reading,
  question,
  prompt: `${reading}\n\n${question}`,
};

export const readingExample: Proposal = {
  request: 'Hay que repartir las semillas y escoger dónde poner las charolas.',
  data: 'Dice que hay 24 semillas y cuatro charolas.',
  plan: 'Creo que van seis en cada una. Las fui pensando de seis en seis, pero no anoté la cuenta.',
  expected: 'Yo las pondría en la ventana porque ahí está más clarito. No sé bien qué tiene que ver eso con el frijol.',
};

export const readingExampleQuestion = '¿Qué me falta explicar de mi cálculo y de la luz que necesitan los frijoles?';

export const readingExampleEvaluation: Evaluation = {
  source: 'demo',
  scores: { request:2, data:2, plan:2, expected:1 },
  observations: {
    request: 'Identificaste las dos decisiones: repartir las semillas y elegir un lugar.',
    data: 'Usaste las cantidades correctas. También puedes anotar qué dice el texto sobre la luz.',
    plan: 'Seis por charola es correcto. Escribe la operación que te dio ese número y verifica que usaste las 24 semillas.',
    expected: 'Elegiste la ventana. Explica por qué la luz ayuda a los frijoles después de que brotan.',
  },
  strength: 'Encontraste las cantidades importantes y propusiste un reparto igual.',
  recommendation: 'Multiplica tu cantidad por el número de charolas para comprobar el reparto. Después completa: «Elegí la ventana porque el texto dice que…».',
};
