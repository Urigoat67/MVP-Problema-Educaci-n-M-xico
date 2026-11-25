export const subjects = ['Matemáticas', 'Ciencias', 'Lengua'] as const;
export type Subject = typeof subjects[number];

export const problems: Array<{ id: string; title: string; subjects: Subject[]; prompt: string }> = [
  { id: 'agua', title: 'El reto del agua', subjects: ['Matemáticas', 'Ciencias'], prompt: 'La escuela usa 1,000 litros de agua por semana. Si reduce su consumo un 20 %, ¿cuántos litros ahorrará? Explica cómo lo sabes.' },
  { id: 'pizza', title: 'Reparte la pizza', subjects: ['Matemáticas'], prompt: 'Cuatro amigos comparten dos pizzas en partes iguales. ¿Qué parte de una pizza le toca a cada uno?' },
  { id: 'huerto', title: 'Un huerto para mi escuela', subjects: ['Ciencias', 'Matemáticas'], prompt: 'Reparte doce plantas en tres cajas y explica dónde las pondrías para que reciban suficiente luz.' },
  { id: 'historia', title: 'Detectives de historias', subjects: ['Lengua'], prompt: 'Mara dejó su paraguas en casa y volvió con la mochila empapada. ¿Qué ocurrió? Explica qué pistas usaste.' },
];

export const rankings: Array<{ name: string; self?: boolean; scores: Record<Subject, number> }> = [
  { name: 'Luna', scores: { Matemáticas: 90, Ciencias: 86, Lengua: 95 } },
  { name: 'Sofía', self: true, scores: { Matemáticas: 96, Ciencias: 75, Lengua: 83 } },
  { name: 'Sol', scores: { Matemáticas: 85, Ciencias: 89, Lengua: 92 } },
  { name: 'Cometa', scores: { Matemáticas: 78, Ciencias: 91, Lengua: 76 } },
  { name: 'Nube', scores: { Matemáticas: 82, Ciencias: 70, Lengua: 86 } },
];
