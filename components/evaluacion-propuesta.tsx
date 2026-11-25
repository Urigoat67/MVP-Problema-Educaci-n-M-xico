'use client';

import { useEffect, useState } from 'react';
import { proposalFields, rubric, type Evaluation, type Proposal } from '@/lib/classroom';

function EvaluationPanel({ evaluation, individual = false }: { evaluation: Evaluation; individual?: boolean }) {
  const points = rubric.reduce((total, {key}) => total + evaluation.scores[key], 0);
  return <div className="evaluation-result">
    <div className="row evaluation-summary" role="status">
      <p>{evaluation.source === 'openai' ? 'Evaluación con IA' : 'Evaluación de ejemplo'}</p>
      <strong className="evaluation-score" aria-label={`${points} de 10 puntos`}>{points} / 10</strong>
    </div>
    <div className="evaluation-part"><strong>{individual ? 'Lo que hiciste bien' : 'Lo que hicieron bien'}</strong><p>{evaluation.strength}</p></div>
    <div className="evaluation-part evaluation-next"><strong>{individual ? 'Tu siguiente paso' : 'Su siguiente paso'}</strong><p>{evaluation.recommendation}</p></div>
    <details className="rubric-detail">
      <summary>Ver rúbrica por criterio</summary>
      <dl className="rubric-results">
        {rubric.map(({key, label, max}) => <div key={key}>
          <dt className="row"><span>{label}</span><span>{evaluation.scores[key]} / {max}</span></dt>
          <dd>{evaluation.observations[key]}</dd>
        </div>)}
      </dl>
    </details>
  </div>;
}

export const evaluationPhases = [
  { at:0, label:'Pensando…' },
  { at:1100, label:'Analizando la propuesta…' },
  { at:2300, label:'Preparando la retroalimentación…' },
];

function EvaluatingProposal({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    const timers = evaluationPhases.map(({at}) =>
      window.setTimeout(() => setNow(Date.now()), Math.max(0, startedAt + at - Date.now())));
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, [startedAt]);

  const phase = evaluationPhases.findLast(({at}) => now - startedAt >= at) ?? evaluationPhases[0];
  return <p className="evaluating" role="status"><span aria-hidden="true" /> {phase.label}</p>;
}

export function EvaluationConversation({
  proposal, question, startedAt, evaluation, individual = false,
}: {
  proposal: Proposal;
  question?: string;
  startedAt?: number | null;
  evaluation?: Evaluation | null;
  individual?: boolean;
}) {
  const filled = proposalFields.filter(field => proposal[field.key].trim());
  const preview = filled.find(field => field.key === 'plan') ?? filled[0];
  const excerpt = preview ? proposal[preview.key].trim() : '';
  const showDetails = !preview || filled.length > 1 || excerpt.length > 220;

  return <div className="evaluation-thread" aria-label="Conversación de evaluación">
    <div className="evaluation-turn user-turn">
      <p className="turn-label">{individual ? 'Tú' : 'Equipo'}</p>
      <div className="prompt-content">
        {question?.trim() && <p><strong>Pregunta para el asistente</strong><br />{question}</p>}
        {preview && <p><strong>{preview.label}</strong><br />{excerpt.length > 220 ? `${excerpt.slice(0, 220)}…` : excerpt}</p>}
        {showDetails && <details className="prompt-detail">
          <summary>Ver propuesta completa</summary>
          <dl>{proposalFields.map(field => <div key={field.key}>
            <dt>{field.label}</dt><dd>{proposal[field.key].trim() || '—'}</dd>
          </div>)}</dl>
        </details>}
      </div>
    </div>
    {(startedAt || evaluation) && <div className="evaluation-turn assistant-turn">
      <span className="assistant-symbol" aria-hidden="true">✦</span>
      <div className="assistant-content">
        <p className="turn-label">Asistente de Aula de Retos</p>
        {evaluation ? <EvaluationPanel evaluation={evaluation} individual={individual} /> : startedAt &&
          <EvaluatingProposal key={startedAt} startedAt={startedAt} />}
      </div>
    </div>}
  </div>;
}
