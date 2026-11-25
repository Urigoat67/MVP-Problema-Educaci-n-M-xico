import { classroomGroups } from './classroom';

export const grades = [1, 2, 3, 4, 5, 6] as const;
export const periods = ['Diagnóstico inicial', 'Corte 1', 'Corte 2'] as const;

const givenNames = ['Abril','Alicia','Andrés','Brisa','César','Clara','Dalia','Dante','Elisa','Emilio','Estela','Héctor','Iris','Julián','Lara','Lina','Lucas','Marina','Nadia','Omar'];
const familyNames = ['Silva','Ortiz','Vega','Luna','Rojas','Mejía','Mora','Lara','Ibarra','Paz','Arias','Reyes'];

export const schoolGroups = grades.flatMap(grade => ['A', 'B'].map((section, index) => {
  const id = `${grade}${section}`;
  const teacherGroup = classroomGroups.find(group => group.id === id);
  const names = teacherGroup?.students ?? givenNames.map(name => `${name} ${familyNames[(grade - 1) * 2 + index]}`);
  return {
    id, grade, name: `${grade}.º ${section}`, assignedToTeacher: Boolean(teacherGroup),
    students: names.map((name, position) => ({
      id: `${id}-${position + 1}`, name,
      history: periods.map((period, cut) => ({
        period,
        score: 37 + (position * 7 + grade * 3 + index * 4) % 21 + cut * 3 + (position + cut) % 3,
        calculation: 42 + (position * 7 + grade * 3 + index * 4) % 21 + cut * 3,
        reasoning: 29 + (position * 9 + grade * 2 + index * 3) % 21 + cut * 4,
        participation: 37 + (position * 11 + grade * 5 + index * 3) % 41 + cut * 4 + (position + cut) % 3,
      })),
    })),
  };
}));

export type SchoolGroup = typeof schoolGroups[number];

export function level(score: number) {
  if (score < 45) return 'Bajo';
  if (score < 60) return 'Medio-bajo';
  if (score < 75) return 'Medio';
  return 'Alto';
}

export function summarize(groups: SchoolGroup[]) {
  const students = groups.flatMap(group => group.students);
  return periods.map((period, index) => ({
    period,
    score: Math.round(students.reduce((total, student) => total + student.history[index].score, 0) / students.length),
    calculation: Math.round(students.reduce((total, student) => total + student.history[index].calculation, 0) / students.length),
    reasoning: Math.round(students.reduce((total, student) => total + student.history[index].reasoning, 0) / students.length),
    participation: Math.round(students.reduce((total, student) => total + student.history[index].participation, 0) / students.length),
  }));
}
