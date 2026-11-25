'use client';

import { useState, type FormEvent } from 'react';
import { PerformanceDashboard } from './desempeno';
import { TeacherActivity } from './actividad-docente';
import { classroomGroups, type Activity } from '@/lib/classroom';
import { problems } from '@/lib/sample-data';

export function Teacher() {
  const [view, setView] = useState<'classes' | 'bank' | 'prepare' | 'activity' | 'performance'>('classes');
  const [group, setGroup] = useState(classroomGroups[0].id);
  const [problem, setProblem] = useState(problems[0].id);
  const [activity, setActivity] = useState<Activity>();
  const [mode, setMode] = useState('Por equipos');
  const [teamCount, setTeamCount] = useState(2);
  const [assignments, setAssignments] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const roster = classroomGroups.find(item => item.id === group)!.students;

  function changeGroup(id: string) {
    setGroup(id);
    setAssignments({});
    setError('');
  }

  function teamFor(name: string, index: number) {
    return assignments[name] ?? Math.floor(index * teamCount / roster.length) + 1;
  }
  const current = problems.find(item => item.id === problem) ?? problems[0];

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selected = classroomGroups.find(item => item.id === group)!;
    const participants = mode === 'Individual'
      ? roster.map((name, index) => ({ id:index + 1, name, members:[] }))
      : Array.from({ length:teamCount }, (_, index) => ({
          id:index + 1, name:`Equipo ${index + 1}`,
          members:roster.filter((name, studentIndex) => teamFor(name, studentIndex) === index + 1),
        })).filter(team => team.members.length);
    if (!participants.length) {
      setError('Asigna al menos un alumno a un equipo.');
      return;
    }
    setActivity({
      id:crypto.randomUUID(), problemId:problem, group:selected.name, time:String(data.get('time')),
      instructions:String(data.get('instructions')).trim(),
      evaluationGuidance:String(data.get('evaluationGuidance')).trim(), rounds:Number(data.get('rounds')),
      aid:data.get('aid') as Activity['aid'], participants,
    });
    setError('');
    setView('activity');
  }

  return <>
    {view !== 'activity' && <>
      <p className="eyebrow">Portal docente</p><h1>{view === 'performance' ? 'Seguimiento del grupo' : 'Mis clases'}</h1>
      <div className="tabs" role="group" aria-label="Vistas docentes">
        <button aria-pressed={view === 'classes'} onClick={() => setView('classes')}>Clases</button>
        <button aria-pressed={view === 'bank'} onClick={() => setView('bank')}>Banco de problemas</button>
        <button aria-pressed={view === 'prepare'} onClick={() => setView('prepare')}>Preparar actividad</button>
        <button aria-pressed={view === 'performance'} onClick={() => setView('performance')}>Desempeño</button>
        {activity && <button onClick={() => setView('activity')}>Volver a la actividad</button>}
      </div>
      {view === 'performance' && <PerformanceDashboard scope="teacher" />}
      {view === 'classes' && <div className="stack">{classroomGroups.map(item =>
        <article className="card row" key={item.id}><div><p className="eyebrow">{item.time} · {item.name}</p><h2>{item.subject}</h2><p>{item.students.length} alumnos</p></div>
        <button className="action" onClick={() => { changeGroup(item.id); setView('prepare'); }}>Preparar actividad</button></article>
      )}</div>}
      {view === 'bank' && <div className="grid two">{problems.map(item =>
        <article className="card" key={item.id}><p className="eyebrow">{item.subjects.join(' + ')}</p><h2>{item.title}</h2><p>{item.prompt}</p>
        <button className="action" onClick={() => { setProblem(item.id); setView('prepare'); }}>Elegir problema</button></article>
      )}</div>}
      {view === 'prepare' && <div className="grid two">
        <form className="card form" onSubmit={prepare}>
          <h2>Configura la actividad</h2>
          <label>Grupo<select value={group} onChange={event => changeGroup(event.target.value)}>{classroomGroups.map(item => <option key={item.id} value={item.id}>{item.name} · {item.subject}</option>)}</select></label>
          <label>Problema del banco<select value={problem} onChange={event => setProblem(event.target.value)}>{problems.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label>Modalidad<select value={mode} onChange={event => { setMode(event.target.value); setError(''); }}><option>Individual</option><option>Por equipos</option></select></label>
          {mode === 'Por equipos' && <fieldset className="team-assignment">
            <legend>Asignar alumnos a equipos</legend>
            <label>Número de equipos<select value={teamCount} onChange={event => { setTeamCount(Number(event.target.value)); setAssignments({}); setError(''); }}>
              {[2,3,4].map(count => <option key={count}>{count}</option>)}
            </select></label>
            {roster.map((name, index) => <label className="assignment-row" key={name}>{name}
              <select value={teamFor(name, index)} onChange={event => {
                const team = Number(event.target.value);
                setAssignments(previous => ({ ...previous, [name]:team }));
              }}>
                <option value={0}>Sin equipo</option>
                {Array.from({ length:teamCount }, (_, team) => <option key={team} value={team + 1}>Equipo {team + 1}</option>)}
              </select>
            </label>)}
          </fieldset>}
          <div className="grid two">
            <label>Hora de inicio<input name="time" type="time" defaultValue="10:00" required /></label>
            <label>Rondas<select name="rounds" defaultValue="1"><option>1</option><option>2</option><option>3</option></select></label>
          </div>
          <label>Ayuda permitida<select name="aid" defaultValue="calculator"><option value="none">Sin asistente</option><option value="hints">Solo pistas</option><option value="calculator">Pistas y calculadora</option></select></label>
          <label>Instrucciones<textarea name="instructions" rows={2} placeholder="Describe cómo se trabajará el reto" /></label>
          <label>Orientación para la evaluación con IA
            <textarea name="evaluationGuidance" maxLength={600} rows={2} placeholder="Opcional: por ejemplo, pide que justifiquen sus unidades" />
          </label>
          <button className="action">Iniciar reto</button>
          {error && <p role="alert">{error}</p>}
        </form>
        <aside className="card"><p className="eyebrow">{current.subjects.join(' + ')}</p><h2>{current.title}</h2><p>{current.prompt}</p></aside>
      </div>}
    </>}
    {activity && <div hidden={view !== 'activity'}>
      <TeacherActivity key={activity.id} activity={activity} onBack={() => setView('classes')} />
    </div>}
  </>;
}
