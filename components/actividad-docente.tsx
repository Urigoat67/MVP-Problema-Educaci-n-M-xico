'use client';

import { useEffect, useRef, useState } from 'react';
import { calculate } from '@/lib/calculator';
import { emptyWork, hintFor, projectionKey, proposalFields, waterExamples, type Evaluation, type Proposal, type Activity, type ProjectionSnapshot, type RoundWork } from '@/lib/classroom';
import { EvaluationConversation, evaluationPhases } from './evaluacion-propuesta';
import { PromptPreview } from './vista-previa-prompt';
import { Comparison } from './comparacion';
import { problems } from '@/lib/sample-data';

export function TeacherActivity({ activity, onBack }: { activity: Activity; onBack: () => void }) {
  const [round, setRound] = useState(1);
  const [open, setOpen] = useState<number>();
  const [entries, setEntries] = useState<Record<string, RoundWork>>({});
  const [finished, setFinished] = useState(false);
  const pending = useRef(new Set<string>());
  const challenge = problems.find(item => item.id === activity.problemId)!;
  const participant = activity.participants.find(item => item.id === open);
  const selectedKey = `${round}-${open}`;
  const entry = entries[selectedKey] ?? emptyWork;
  const roundKeys = activity.participants.map(item => `${round}-${item.id}`);
  const submitted = roundKeys.filter(key => entries[key]?.submitted).length;
  const ready = roundKeys.filter(key => {
    const work = entries[key];
    return work?.confirmed && !work.evaluation && !work.evaluationStartedAt && Object.values(work.proposal).some(value => value.trim());
  });
  const running = roundKeys.some(key => entries[key]?.evaluationStartedAt);
  const exampleIndex = activity.participants.findIndex(item => item.id === open);

  const allScored = Array.from({ length:activity.rounds }, (_, index) => index + 1)
    .every(number => activity.participants.every(item => {
      const work = entries[`${number}-${item.id}`];
      return work?.submitted && work.evaluation;
    }));
  const snapshot: ProjectionSnapshot = {
    round, finished,
    teams: activity.participants.map(item => {
      const work = entries[`${round}-${item.id}`];
      return {
        name:item.name,
        proposal: work?.submitted ? work.proposal : null,
        evaluation: work?.evaluation ?? null,
        evaluationStartedAt: work?.evaluationStartedAt ?? null,
        evaluationFailed: Boolean(work?.evaluationError),
      };
    }),
  };
  const payload = JSON.stringify(snapshot);

  useEffect(() => {
    try { window.localStorage.setItem(projectionKey(activity.id), payload); }
    catch { /* The comparison remains available on the teacher screen. */ }
  }, [activity.id, payload]);

  const canLoadExample = !entry.submitted && challenge.id === 'agua'
    && participant && participant.members.length > 0
    && exampleIndex >= 0 && exampleIndex < waterExamples.length;

  function updateEntry(key: string, update: (work: RoundWork) => RoundWork) {
    setEntries(previous => ({ ...previous, [key]: update(previous[key] ?? emptyWork) }));
  }

  function changeEntry(update: (work: RoundWork) => RoundWork) {
    updateEntry(selectedKey, update);
  }

  async function evaluateProposal(key: string, proposal: Proposal, startedAt: number) {
    if (finished || pending.current.has(key)) return;
    pending.current.add(key);
    updateEntry(key, work => ({
      ...work, submitted:true, evaluationStartedAt:startedAt, evaluationError:undefined,
    }));
    try {
      const response = await fetch('/api/evaluar', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ problemId:activity.problemId, proposal, guidance:activity.evaluationGuidance }),
      });
      const result = await response.json() as Evaluation | { error: string };
      if ('error' in result) throw new Error(result.error);
      if (!response.ok) throw new Error('La evaluación no se completó.');
      const minimumDuration = evaluationPhases[evaluationPhases.length - 1].at + 900;
      await new Promise(resolve => setTimeout(resolve, Math.max(0, startedAt + minimumDuration - Date.now())));
      updateEntry(key, work => ({ ...work, evaluation:result, evaluationStartedAt:undefined }));
    } catch (failure) {
      updateEntry(key, work => ({
        ...work, evaluationStartedAt:undefined,
        evaluationError:failure instanceof Error ? failure.message : 'Vuelve a intentar.',
      }));
    } finally {
      pending.current.delete(key);
    }
  }

  function evaluateRound() {
    const startedAt = Date.now();
    for (const key of ready) void evaluateProposal(key, entries[key].proposal, startedAt);
  }

  function addMessage(question: string, reply: string) {
    changeEntry(work => ({ ...work, messages: [...work.messages, { question, reply }] }));
  }

  return <>
    <div className="activity-top row">
      <div className="tool-row"><button type="button" className="quiet" onClick={onBack}>Volver al aula</button>
        {participant && <button type="button" className="quiet" onClick={() => setOpen(undefined)}>Volver al reto</button>}</div>
      <a className="quiet" href={`/docente/proyectar?reto=${challenge.id}&actividad=${activity.id}`} target="_blank" rel="noopener noreferrer">Proyectar</a>
    </div>
    <div className="activity-layout">
      <aside className="activity-rail">
        <h2>{activity.participants.some(item => item.members.length) ? 'Equipos' : 'Participantes'}</h2>
        <label>Ronda<select value={round} onChange={event => { setRound(Number(event.target.value)); }}>
          {Array.from({ length: activity.rounds }, (_, index) => <option key={index} value={index + 1}>{index + 1} de {activity.rounds}</option>)}
        </select></label>
        <p className="eyebrow">{submitted} de {activity.participants.length} propuestas entregadas</p>
        <progress aria-label="Propuestas entregadas" value={submitted} max={activity.participants.length} />
        <div className="stack section">{activity.participants.map(item => {
          const delivered = entries[`${round}-${item.id}`]?.submitted;
          return <article className={open === item.id ? 'team-card current' : 'team-card'} key={item.id}>
            <div className="row"><h3>{item.name}</h3><span className={delivered ? 'status delivered' : 'status'}>{delivered ? 'Entregada' : 'Preparando'}</span></div>
            {item.members.length > 0 && <p>{item.members.join(' · ')}</p>}
            <button className="quiet" aria-current={open === item.id ? 'true' : undefined} onClick={() => { setOpen(item.id); }}>
              {delivered ? 'Ver propuesta' : 'Abrir espacio'}<span className="sr-only"> de {item.name}</span>
            </button>
          </article>;
        })}</div>
      </aside>
      <section>
        <p className="eyebrow">{activity.group} · {activity.time} · Ronda {round}</p>
        <h1>{participant?.name ?? challenge.title}</h1>
        <details className="challenge-disclosure section" open={!participant}>
          <summary>{participant ? challenge.title : 'Enunciado del reto'}</summary><p>{challenge.prompt}</p>
          {activity.instructions && <p>{activity.instructions}</p>}
        </details>
        {!participant ? <>
          <div className="tool-row section">
            {!finished && <button className="action" disabled={!ready.length || running} onClick={evaluateRound}>
              {running ? 'Evaluando propuestas…' : 'Evaluar propuestas con IA'}
            </button>}
            {!finished && <button className="action" disabled={!allScored} onClick={() => setFinished(true)}>Finalizar actividad</button>}
          </div>
          {!finished && !allScored && <p className="section">
            {running ? 'Cada propuesta se evalúa por separado.' : 'Captura y confirma las propuestas en el espacio de cada equipo. Después vuelve aquí para evaluarlas.'}
          </p>}
          {finished && <p className="callout section" role="status">Actividad finalizada. Las recomendaciones de cada equipo están en la proyección.</p>}
          <Comparison snapshot={snapshot} />
        </> :
          <div className={activity.aid === 'none' ? 'section' : 'proposal-layout section'} key={selectedKey}>
            <div className="stack">{!entry.submitted ? <section className="card form">
              <div className="row"><h2>Propuesta</h2>
                {canLoadExample && <button className="quiet" onClick={() => {
                  if (Object.values(entry.proposal).some(value => value.trim()) &&
                    !window.confirm('¿Reemplazar el borrador de este equipo con datos de demo?')) return;
                  changeEntry(work => ({ ...work, proposal:waterExamples[exampleIndex], confirmed:false }));
                }}>Cargar datos para demo</button>}
              </div>
              {proposalFields.map(field => <label key={field.key}>{field.label}
                <textarea rows={3} maxLength={1500} placeholder={field.placeholder} value={entry.proposal[field.key]} readOnly={entry.submitted}
                  onChange={event => {
                    const value = event.target.value;
                    changeEntry(work => ({ ...work, confirmed:false, proposal: { ...work.proposal, [field.key]: value } }));
                  }} />
              </label>)}
              {!entry.confirmed && <button className="action" disabled={!Object.values(entry.proposal).some(value => value.trim())}
                onClick={() => changeEntry(work => ({ ...work, confirmed:true }))}>Confirmar datos cargados</button>}
              {entry.confirmed && <>
                <PromptPreview challenge={challenge.prompt} proposal={entry.proposal} guidance={activity.evaluationGuidance} />
                <p>Datos confirmados. Vuelve al reto para evaluar esta propuesta.</p>
              </>}
            </section> : <section className="card" aria-label="Propuesta entregada">
              <EvaluationConversation proposal={entry.proposal} startedAt={entry.evaluationStartedAt} evaluation={entry.evaluation} />
            </section>}
            {entry.evaluationError && <div className="card" role="alert">
              <p>{entry.evaluationError}</p>
              <div className="tool-row section">
                <button className="quiet" onClick={() => void evaluateProposal(selectedKey, entry.proposal, Date.now())}>Reintentar evaluación</button>
                <button className="quiet" onClick={() => changeEntry(work => ({ ...work, submitted:false, confirmed:false, evaluationError:undefined }))}>Editar propuesta</button>
              </div>
            </div>}
            </div>
            {activity.aid !== 'none' && <aside className="card assistant">
              <h2>Asistente</h2><p>Pistas simuladas para orientar al equipo.</p>
              {entry.messages.length > 0 && <div className="stack section" aria-live="polite">{entry.messages.map((message, index) =>
                <div className="callout" key={index}><strong>{message.question}</strong><p>{message.reply}</p></div>
              )}</div>}
              {!entry.submitted && <>
                <form className="form section" onSubmit={event => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const question = String(new FormData(form).get('question') ?? '').trim();
                  if (!question) return;
                  addMessage(question, hintFor(entry.proposal));
                  form.reset();
                }}>
                  <label>Pide una pista<input name="question" required maxLength={500} placeholder="¿Qué deberíamos revisar?" /></label>
                  <button className="action">Consultar</button>
                </form>
                {activity.aid === 'calculator' && <form className="form section" onSubmit={event => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const expression = String(new FormData(form).get('expression') ?? '').trim();
                  if (!expression) return;
                  let reply: string;
                  try { reply = `Resultado: ${calculate(expression)}`; }
                  catch { reply = 'Revisa la operación. Usa números, paréntesis y los signos +, −, × o ÷.'; }
                  addMessage(expression, reply);
                  form.reset();
                }}>
                  <label>Operación que quieres comprobar<input name="expression" required maxLength={120} placeholder="(3 × 6) + 10" /></label>
                  <button className="quiet">Calcular</button>
                </form>}
              </>}
            </aside>}
          </div>}
      </section>
    </div>
  </>;
}
