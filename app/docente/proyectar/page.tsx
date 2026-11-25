import { LiveProjection } from '@/components/proyeccion-en-vivo';
import Link from 'next/link';
import { problems } from '@/lib/sample-data';

export default async function Projection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const problem = problems.find(item => item.id === query.reto);
  const round = typeof query.ronda === 'string' && /^[1-3]$/.test(query.ronda) ? query.ronda : '1';

  const id = typeof query.actividad === 'string' && /^[a-f0-9-]{36}$/.test(query.actividad) ? query.actividad : null;

  return <main className="projection">
    <Link className="projection-back" href="/docente">Portal docente</Link>
    {problem ? <section className="projection-body">
      <p className="eyebrow">{problem.subjects.join(' + ')}{!id && ` · Ronda ${round}`}</p>
      <h1>{problem.title}</h1><p>{problem.prompt}</p>
      {id && <LiveProjection id={id} />}
    </section> : <section className="projection-body">
      <h1>Elige un reto en Docente</h1><p>Abre una actividad y selecciona «Proyectar».</p>
    </section>}
  </main>;
}
