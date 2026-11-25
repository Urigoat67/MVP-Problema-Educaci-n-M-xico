'use client';

import { useRef, useState } from 'react';
import { grades, level, schoolGroups, summarize } from '@/lib/performance';

export function PerformanceDashboard({ scope }: { scope: 'school' | 'teacher' }) {
  const indicators = useRef<HTMLElement>(null);
  const [grade, setGrade] = useState('all');
  const [groupId, setGroupId] = useState('all');
  const [studentId, setStudentId] = useState<string>();
  const groups = schoolGroups.filter(item => scope === 'school' || item.assignedToTeacher);
  const gradeGroups = groups.filter(item => grade === 'all' || String(item.grade) === grade);
  const activeGroup = gradeGroups.find(item => item.id === groupId);
  const student = activeGroup?.students.find(item => item.id === studentId);
  const history = student?.history ?? summarize(activeGroup ? [activeGroup] : gradeGroups);
  const latest = history[history.length - 1];
  const baseline = history[0];
  const subtitle = student?.name ?? activeGroup?.name ?? (grade === 'all' ? (scope === 'school' ? 'Toda la primaria' : 'Mis grupos') : `${grade}.º grado`);

  function selectGroup(id: string) {
    setGroupId(id);
    setStudentId(undefined);
  }

  return <div className="performance">
    <div className="row">
      <div><p className="eyebrow">Escuela Horizonte · Datos ficticios</p>
        {scope === 'school' ? <h1>Desempeño escolar</h1> : <h2>Desempeño de mis alumnos</h2>}
        <p>Mediciones ilustrativas para la demo. Los cortes muestran un escenario simulado.</p>
      </div>
      <div className="tool-row">
        {scope === 'school' && <label>Grado<select value={grade} onChange={event => { setGrade(event.target.value); selectGroup('all'); }}>
          <option value="all">Todos los grados</option>
          {grades.map(item => <option value={item} key={item}>{item}.º grado</option>)}
        </select></label>}
        <label>Grupo<select value={groupId} onChange={event => selectGroup(event.target.value)}>
          <option value="all">Todos los grupos</option>
          {gradeGroups.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
      </div>
    </div>

    <section ref={indicators} className="section" aria-label="Indicadores de desempeño">
      <div className="row"><h2>{subtitle}</h2>{student && <button className="quiet" onClick={() => setStudentId(undefined)}>Volver al resumen del grupo</button>}</div>
      <div className="grid three section">
        <article className="card"><p>Nivel actual</p><strong className="metric performance-level">{level(latest.score)}</strong><p>Inicial: {level(baseline.score)}</p></article>
        <article className="card"><p>{student ? 'Puntaje' : 'Puntaje promedio'}</p><strong className="metric">{latest.score} / 100</strong><p>Inicial: {baseline.score} / 100</p></article>
        <article className="card"><p>Participación</p><strong className="metric">{latest.participation} %</strong><p>Inicial: {baseline.participation} %</p></article>
      </div>
    </section>

    <section className="card section" aria-label="Evolución del desempeño">
      <h2>Evolución por periodo</h2>
      <div className="grid three section">
        {history.map(item => <div className="period-panel" key={item.period}>
          <h3>{item.period}</h3><p className="eyebrow">Nivel {level(item.score).toLowerCase()}</p>
          <p className="row"><span>Puntaje</span><strong>{item.score} / 100</strong></p>
          <progress aria-label={`Puntaje de ${item.period}`} value={item.score} max={100} />
          <p className="row"><span>Participación</span><strong>{item.participation} %</strong></p>
          <progress className="participation-bar" aria-label={`Participación de ${item.period}`} value={item.participation} max={100} />
        </div>)}
      </div>
    </section>

    {scope === 'school' && <section className="grid two section" aria-label="Habilidades y estrategia">
      <article className="card"><h2>Habilidades · Corte 2</h2>
        <p>Cálculo: {latest.calculation} / 100</p><p>Justificación: {latest.reasoning} / 100</p>
      </article>
      <article className="card"><h2>Estrategia sugerida</h2><p>Practicar cómo conectar un dato con una conclusión y revisar la justificación en el siguiente reto.</p></article>
    </section>}

    <section className="card section">
      <div className="row">
        <div><h2>{activeGroup ? `Alumnos de ${activeGroup.name}` : 'Grupos'}</h2>
          <p>{activeGroup ? `${activeGroup.students.length} alumnos · Selecciona un nombre para ver su evolución.` : `${gradeGroups.length} grupos · ${gradeGroups.reduce((sum, group) => sum + group.students.length, 0)} alumnos`}</p></div>
        {activeGroup && <button className="quiet" onClick={() => selectGroup('all')}>Ver todos los grupos</button>}
      </div>
      <div className="table-wrap"><table>
        <thead><tr><th scope="col">{activeGroup ? 'Alumno' : 'Grupo'}</th>
          {!activeGroup && <th scope="col">Alumnos</th>}
          <th scope="col">Nivel</th><th scope="col">Puntaje</th><th scope="col">Participación</th></tr></thead>
        <tbody>{activeGroup ? activeGroup.students.map(item => {
          const current = item.history[item.history.length - 1];
          return <tr key={item.id} className={item.id === studentId ? 'highlight' : undefined}>
            <th scope="row"><button className="quiet" aria-pressed={item.id === studentId} onClick={() => {
              setStudentId(item.id);
              indicators.current?.scrollIntoView({ block:'start' });
            }}>{item.name}</button></th>
            <td>{level(current.score)}</td><td>{current.score} / 100</td><td>{current.participation} %</td>
          </tr>;
        }) : gradeGroups.map(item => {
          const cuts = summarize([item]);
          const current = cuts[cuts.length - 1];
          return <tr key={item.id}>
            <th scope="row"><button className="quiet" onClick={() => selectGroup(item.id)}>{item.name}</button></th>
            <td>{item.students.length}</td><td>{level(current.score)}</td><td>{current.score} / 100</td><td>{current.participation} %</td>
          </tr>;
        })}</tbody>
      </table></div>
    </section>
  </div>;
}
