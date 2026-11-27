import Link from 'next/link';
import { portals, Shell } from '@/components/shell';

export default function Home() {
  return <Shell>
    <section className="hero"><p className="eyebrow">Escuela Horizonte</p><h1>Tres portales, una escuela</h1><p>Prepara actividades, resuelve retos y acompaña el aprendizaje.</p></section>
    <section className="grid three section" aria-label="Elige un portal">
      {portals.map(portal => <Link className="card portal" href={portal.href} key={portal.href}>
        <span className="symbol" aria-hidden="true">{portal.mark}</span>
        <h2>{portal.name}</h2><p>{portal.description}</p><strong>Entrar a {portal.name}</strong>
      </Link>)}
    </section>
    <section className="section">
      <Link className="card portal" href="/reels">
        <span className="symbol" aria-hidden="true">🎬</span>
        <h2>Reels de aprendizaje</h2>
        <p>Ghopper te genera videos cortos animados para aprender un tema en 15 segundos.</p>
        <strong>Crear un video</strong>
      </Link>
    </section>
  </Shell>;
}
