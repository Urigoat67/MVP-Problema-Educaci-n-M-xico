import { type ProjectionSnapshot } from '@/lib/classroom';
import { EvaluationConversation } from './evaluacion-propuesta';

export function Comparison({ snapshot }: { snapshot: ProjectionSnapshot }) {
  return <section className="section">
    <h2>{snapshot.finished ? 'Resultados finales' : 'Comparación de propuestas'}</h2>
    <p>Ronda {snapshot.round} · Puntos sobre 10</p>
    <div className="comparison-grid section">
      {snapshot.teams.map((team, index) => <article className="card comparison-card" key={index}>
        <header className="row"><h3>{team.name}</h3></header>
        {team.proposal ? <EvaluationConversation proposal={team.proposal}
          startedAt={team.evaluationStartedAt} evaluation={team.evaluation} /> : <p>Pendiente de entrega.</p>}
        {team.evaluationFailed && <p role="status">Evaluación pendiente. El docente puede volver a intentarlo.</p>}
      </article>)}
    </div>
  </section>;
}
