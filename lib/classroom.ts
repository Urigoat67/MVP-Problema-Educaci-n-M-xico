export const rosters: Record<string, string[]> = {
  '6A': ['Ana Torres', 'Mariana Ruiz', 'Sofía Méndez', 'Mateo Cruz', 'Diego Flores', 'Luis García', 'Valeria Pérez', 'Camila Ríos'],
  '6B': ['Daniel Ríos', 'Camila Soto', 'Julia Mendoza', 'Bruno León', 'Lucía Reyes', 'Emilio Rojas'],
};

export const proposalFields = [
  { key:'request', label:'Qué pide el reto', placeholder:'Escribe con tus palabras qué debes resolver.' },
  { key:'data', label:'Datos que usarás', placeholder:'Anota las cantidades, información o evidencias relevantes.' },
  { key:'plan', label:'Estrategia, operaciones o pasos', placeholder:'Describe qué harías, en qué orden y por qué.' },
  { key:'expected', label:'Resultado esperado o conclusión', placeholder:'Escribe qué esperas obtener y cómo lo comprobarías.' },
] as const;

export type Proposal = Record<typeof proposalFields[number]['key'], string>;

export type RoundWork = {
  proposal: Proposal;
  submitted: boolean;
  confirmed?: boolean;
  evaluation?: Evaluation;
  evaluationStartedAt?: number;
  evaluationError?: string;
  messages: { question: string; reply: string }[];
};

export const emptyWork: RoundWork = {
  proposal: { request:'', data:'', plan:'', expected:'' },
  submitted:false,
  messages:[],
};

export type Activity = {
  id: string;
  problemId: string;
  group: string;
  time: string;
  instructions: string;
  evaluationGuidance: string;
  rounds: number;
  aid: 'none' | 'hints' | 'calculator';
  participants: { id: number; name: string; members: string[] }[];
};

export function hintFor(proposal: Proposal) {
  if (!proposal.request.trim()) return 'Escriban con sus palabras qué pregunta deben responder.';
  if (!proposal.data.trim()) return '¿Qué dato del enunciado cambia su decisión? ¿Qué necesitan verificar?';
  if (!proposal.plan.trim()) return 'Elijan un primer paso y expliquen por qué los acerca a la respuesta.';
  if (!proposal.expected.trim()) return 'Escriban qué esperan obtener y cómo lo comprobarían.';
  return '¿Qué dato respalda su conclusión? Compárenla con otra opción antes de entregarla.';
}

export const classroomGroups = [
  { id:'6A', name:'6.º A', subject:'Matemáticas', time:'10:00–10:45' },
  { id:'6B', name:'6.º B', subject:'Ciencias', time:'11:00–11:45' },
  { id:'5A', name:'5.º A', subject:'Matemáticas', time:'08:00–08:45' },
  { id:'5B', name:'5.º B', subject:'Lengua', time:'09:00–09:45' },
  { id:'4A', name:'4.º A', subject:'Ciencias', time:'12:00–12:45' },
].map((group, groupIndex) => {
  const base = rosters[group.id] ?? [];
  const firstNames = ['Alma','Pablo','Eva','Joel','Lola','Inés','Leo','Nora','Iván','Elena','Hugo','Luz','Mario','Sara','Alex','Elsa','Raúl','Emma','Nicolás','Irene'];
  const surnames = ['Navarro','Campos','Medina','Romero','Salas'];
  const students = [...base, ...firstNames.slice(0, 20 - base.length).map(name => `${name} ${surnames[groupIndex]}`)];
  return { ...group, students };
});

export const rubric = [
  { key:'request', label:'Comprensión', max:2 },
  { key:'data', label:'Datos', max:2 },
  { key:'plan', label:'Operaciones', max:3 },
  { key:'expected', label:'Conclusión', max:3 },
] as const;

export type Scores = Record<keyof Proposal, number>;

export type Evaluation = {
  scores: Scores;
  observations: Proposal;
  strength: string;
  recommendation: string;
  source: 'openai' | 'demo';
};

export const waterExamples: Proposal[] = [
  {
    request:'Tenemos que ver cuánta agua ya no gastaría la escuela.',
    data:'Son mil litros en la semana y hay que quitar el veinte por ciento.',
    plan:'Primero hice mil entre cien y me salió diez. Luego hice diez por veinte.',
    expected:'Creo que salen doscientos litros, pero no puse cómo se revisa.',
  },
  {
    request:'Hay que ver cuánta agua ahorramos.',
    data:'Vi que dice mil litros y veinte, pero no puse qué significa ese veinte.',
    plan:'Hice mil menos veinte porque pensé que había que quitarle veinte litros.',
    expected:'Me salió novecientos ochenta. Creo que eso es lo que queda, pero no sé si es el ahorro.',
  },
];

export type ProjectionSnapshot = {
  round: number;
  finished: boolean;
  teams: { name: string; proposal: Proposal | null; evaluation: Evaluation | null; evaluationStartedAt: number | null; evaluationFailed: boolean }[];
};

export const projectionKey = (id: string) => `aula-retos-proyeccion-${id}`;

