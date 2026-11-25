'use client';

import { useState } from 'react';
import { ReadingChallenge } from './reto-lectura';
import { readingChallenge } from '@/lib/student-reading';
import { problems, rankings, subjects, type Subject } from '@/lib/sample-data';

const studentProblems = [...problems, readingChallenge];

type View = 'Mi tablero' | 'Materias' | 'Retos' | 'Mi avance';

export function Student() {
  const [view, setView] = useState<View>('Mi tablero');
  const [subject, setSubject] = useState<Subject | 'Todas'>('Todas');
  const [category, setCategory] = useState<Subject | 'General'>('General');
  const [active, setActive] = useState<string>();
  const [withTutor, setWithTutor] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const readingOpen = active === readingChallenge.id;
  const current = studentProblems.find(item => item.id === active);
  const rows = rankings.map(person => ({
    ...person,
    points: category === 'General' ? Object.values(person.scores).reduce((a, b) => a + b, 0) : person.scores[category],
  })).sort((a, b) => b.points - a.points);
  const myRow = rows.find(person => person.self)!;
  const place = (points: number) => rows.findIndex(person => person.points === points) + 1;

  function open(id: string) {
    setWithTutor(false);
    setActive(id);
  }

  return <>
    <nav className="tabs" aria-label="Secciones del alumno">
      {(['Mi tablero', 'Materias', 'Retos', 'Mi avance'] as const).map(item =>
        <button key={item} aria-pressed={view === item && !current} onClick={() => {setView(item); setActive(undefined);}}>{item}</button>)}
    </nav>
    {current ? <>
      <button className="quiet" onClick={() => setActive(undefined)}>Volver a {view.toLowerCase()}</button>
      {!readingOpen && <section className="card section exercise">
        <p className="eyebrow">{current.subjects.join(' + ')}</p><h1>{current.title}</h1><p>{current.prompt}</p>
        {current.id !== 'agua' && <div className="tabs" role="group" aria-label="Modo de práctica">
          <button aria-pressed={!withTutor} onClick={() => setWithTutor(false)}>Practicar por mi cuenta</button>
          <button aria-pressed={withTutor} onClick={() => setWithTutor(true)}>Practicar con mi tutor</button>
        </div>}
        {withTutor && <aside className="callout">Lean la consigna juntos. Pregunta «¿Qué datos tienes?» y deja que Sofía explique su idea.</aside>}
        {done.includes(current.id) ? <p className="callout" role="status">¡Listo! Completaste el reto en esta sesión.</p> :
          <form className="form section" key={current.id} onSubmit={event => {
            event.preventDefault();
            const answer = new FormData(event.currentTarget).get('answer');
            if (typeof answer === 'string' && answer.trim()) setDone(previous => [...previous, current.id]);
          }}>
            <label>Escribe tu respuesta y cómo la encontraste<textarea name="answer" rows={4} required /></label>
            <button className="action">{current.id === 'agua' ? 'Entregar respuesta' : 'Completar práctica'}</button>
          </form>}
      </section>}
    </> : view === 'Mi tablero' ? <>
      <section className="hero"><p className="eyebrow">6.º A</p><h1>¡Hola, Sofía!</h1><p>Tu reto de clase está listo.</p>
        <button className="action light" onClick={() => open('agua')}>Entrar al reto del agua</button></section>
      <section className="card row section"><div><p className="eyebrow">Matemáticas + Ciencias · 10:00–10:45</p><h2>El reto del agua</h2></div>
        <button className="action" onClick={() => open('agua')}>{done.includes('agua') ? 'Ver reto completado' : 'Abrir actividad'}</button></section>
    </> : view === 'Mi avance' ? <>
      <h1>Mi avance</h1>
      <section className="grid two section">
        <div className="card"><p className="eyebrow">Retos terminados</p><strong className="metric">{3 + done.length}</strong><p>Tu historial de ejemplo y los retos que terminaste en esta sesión.</p></div>
        <div className="card"><h2>Explicar tus ideas</h2><p>Elige un dato y cuenta cómo lo usaste para llegar a tu respuesta.</p></div>
      </section>
      <section className="card section">
        <div className="row"><div><p className="eyebrow">6.º A · Puntos de ejemplo</p><h2>Clasificación de mi grupo</h2></div>
          <div className="position"><strong>{place(myRow.points)}.º lugar</strong><span>{myRow.points} puntos</span></div></div>
        <div className="tabs" role="group" aria-label="Clasificación por materia">
          {(['General', ...subjects] as const).map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="table-wrap"><table><thead><tr><th scope="col">Lugar</th><th scope="col">Nombre</th><th scope="col">Puntos</th></tr></thead>
          <tbody>{rows.map(person => <tr key={person.name} className={person.self ? 'highlight' : undefined}>
            <td>{place(person.points)}.º</td><th scope="row">{person.name}{person.self && ' · Tú'}</th><td>{person.points}</td></tr>)}</tbody></table></div>
      </section>
    </> : <>
      <h1>{view === 'Materias' ? 'Mis materias' : 'Elige tu próximo reto'}</h1>
      {view === 'Materias' && <div className="tabs" role="group" aria-label="Filtrar por materia">
        {(['Todas', ...subjects] as const).map(item => <button key={item} aria-pressed={subject === item} onClick={() => setSubject(item)}>{item}</button>)}
      </div>}
      <div className="grid two section">{studentProblems.filter(item => view === 'Materias'
        ? subject === 'Todas' || item.subjects.includes(subject) : item.id !== 'agua').map(item => <article className="card" key={item.id}>
          <p className="eyebrow">{item.subjects.join(' + ')}</p><h2>{item.title}</h2>
          <p>{item.id === 'agua' ? 'Actividad de clase' : item.subjects.length > 1 ? 'Reto multidisciplinario' : 'Práctica'}</p>
          <button className="action" onClick={() => open(item.id)}>Abrir reto</button></article>)}</div>
    </>}
    <div hidden={!readingOpen}>
      <ReadingChallenge onComplete={() => setDone(previous => previous.includes(readingChallenge.id)
        ? previous : [...previous, readingChallenge.id])} />
    </div>
  </>;
}
