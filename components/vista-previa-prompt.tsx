import { evaluationPrompt } from '@/lib/evaluation-prompt';
import type { Proposal } from '@/lib/classroom';

export function PromptPreview({ challenge, proposal, guidance, individual = false }: {
  challenge: string;
  proposal: Proposal;
  guidance: string;
  individual?: boolean;
}) {
  const sections = evaluationPrompt(challenge, proposal, guidance, individual);
  return <section className="prompt-preview" aria-label="Vista previa del prompt">
    <h3>Vista previa del prompt</h3>
    <p>Un buen prompt explica el objetivo, aporta contexto, muestra tu razonamiento y pide una respuesta concreta.</p>
    <div className="prompt-preview-body">
      {sections.map(({ title, text }) => <div key={title}>
        <h4>{title}</h4><p>{text}</p>
      </div>)}
    </div>
  </section>;
}
