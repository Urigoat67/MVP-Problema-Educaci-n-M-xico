import { proposalFields, rubric, type Proposal } from './classroom';

export function evaluationPrompt(challenge: string, proposal: Proposal, guidance: string, individual = false) {
  const evidence = proposalFields.map(({key, label}) => `${label}: ${proposal[key].trim() || 'Por completar'}`);
  const criteria = rubric.map(({label, max}) => `${label}: hasta ${max} puntos`).join(' · ');

  return [
    { title:'Objetivo', text: individual ? 'Ayúdame a revisar mi solución y a explicar mejor cómo llegué a ella.' : 'Ayúdanos a revisar nuestra solución y a explicar mejor cómo llegamos a ella.' },
    { title:'Contexto del reto', text:challenge },
    { title:individual ? 'Mi propuesta' : 'Nuestra propuesta', text:evidence.join('\n\n') },
    ...(guidance.trim() ? [{ title:individual ? 'Mi pregunta' : 'Orientación del docente', text:guidance.trim() }] : []),
    { title:'Respuesta esperada', text:`Da un puntaje de 0 a 10 con esta rúbrica: ${criteria}. Señala un acierto y sugiere un paso concreto para mejorar. Usa palabras sencillas y deja que sigamos resolviendo el reto.` },
  ];
}
