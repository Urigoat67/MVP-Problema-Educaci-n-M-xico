'use client';

import { useRef, useState } from 'react';
import { emptyWork, proposalFields, type Evaluation } from '@/lib/classroom';
import { readingChallenge, readingExample, readingExampleQuestion } from '@/lib/student-reading';
import { PromptPreview } from './vista-previa-prompt';
import { EvaluationConversation, evaluationPhases } from './evaluacion-propuesta';

export function ReadingChallenge({ onComplete }: { onComplete: () => void }) {
  const [proposal, setProposal] = useState(emptyWork.proposal);
  const [question, setQuestion] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [startedAt, setStartedAt] = useState<number>();
  const [result, setResult] = useState<Evaluation>();
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ proposal: typeof proposal; question: string }>();
  const pending = useRef(false);
  const hasResponse = Object.values(proposal).some(value => value.trim());

  async function evaluate() {
    if (pending.current || !confirmed || !hasResponse) return;
    pending.current = true;
    const start = Date.now();
    setStartedAt(start);
    setSent({ proposal, question });
    setResult(undefined);
    setError('');
    try {
      const response = await fetch('/api/evaluar', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ problemId:readingChallenge.id, proposal, guidance:question }),
      });
      const evaluation = await response.json() as Evaluation | {error: string};
      if ('error' in evaluation) throw new Error(evaluation.error);
      if (!response.ok) throw new Error('La evaluación no se completó.');
      const finishAfter = start + evaluationPhases[evaluationPhases.length - 1].at + 900;
      await new Promise(resolve => setTimeout(resolve, Math.max(0, finishAfter - Date.now())));
      setResult(evaluation);
      onComplete();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Vuelve a intentar.');
    } finally {
      pending.current = false;
      setStartedAt(undefined);
    }
  }

  return <>
    <section className="card section exercise">
      <p className="eyebrow">{readingChallenge.subjects.join(' + ')}</p>
      <h1>{readingChallenge.title}</h1>
      <h2 className="section">Lean la historia</h2><p>{readingChallenge.reading}</p>
      <h2 className="section">El reto</h2><p>{readingChallenge.question}</p>
      <aside className="callout section"><strong>Para ti y tu tutor</strong><p>Lean juntos. Pide a tu tutor que te pregunte qué datos encontraste y cómo comprobarías tu idea. Escribe la respuesta con tus palabras.</p></aside>
    </section>
    <div className="proposal-layout section">
      <form className="card form" onSubmit={event => { event.preventDefault(); void evaluate(); }}>
        <div className="row"><h2>Tu propuesta</h2><button className="quiet" type="button" disabled={Boolean(startedAt)} onClick={() => {
          if ((hasResponse || question.trim()) && !window.confirm('¿Reemplazar lo que escribiste con los datos de la demo?')) return;
          setProposal(readingExample);
          setConfirmed(false);
          setQuestion(readingExampleQuestion);
          setResult(undefined);
          setSent(undefined);
          setError('');
        }}>Ingresar datos para demo</button></div>
        {proposalFields.map(field => <label key={field.key}>{field.label}
          <textarea rows={3} maxLength={1500} value={proposal[field.key]} placeholder={field.placeholder} readOnly={Boolean(startedAt)}
            onChange={event => {
              setConfirmed(false);
              setProposal({ ...proposal, [field.key]:event.target.value });
              setResult(undefined);
              setSent(undefined);
              setError('');
            }} />
        </label>)}
        <label>¿Qué quieres preguntarle a la IA? <span className="eyebrow">Opcional</span>
          <textarea rows={2} maxLength={600} value={question} readOnly={Boolean(startedAt)}
            placeholder="Por ejemplo: ¿qué paso me falta explicar?"
            onChange={event => { setQuestion(event.target.value); setConfirmed(false); setResult(undefined); setSent(undefined); setError(''); }} />
        </label>
        {!confirmed && <button className="quiet" type="button" disabled={!hasResponse}
          onClick={() => setConfirmed(true)}>Confirmar datos cargados</button>}
        <button className="action" disabled={Boolean(startedAt) || !confirmed}>Evaluar respuesta</button>
      </form>
      <section className="card" aria-label="Revisión de la respuesta">
        <h2>Asistente de aprendizaje</h2>
        {sent && <EvaluationConversation proposal={sent.proposal} question={sent.question}
          startedAt={startedAt} evaluation={result} individual />}
        {error && <p className="callout section" role="alert">{error}</p>}
        {confirmed && !sent && <PromptPreview challenge={readingChallenge.prompt} proposal={proposal} guidance={question} individual />}
        {!confirmed && <p>Confirma tus datos para ver cómo se arma el prompt con tu propuesta.</p>}
      </section>
    </div>
  </>;
}
