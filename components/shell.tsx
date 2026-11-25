import Link from 'next/link';
import type { ReactNode } from 'react';

export const portals = [
  { name: 'Docente', href: '/docente', mark: '▤', description: 'Elige un problema y prepara una actividad para tu clase.' },
  { name: 'Alumno', href: '/alumno', mark: '✦', description: 'Resuelve retos, practica por materia y mira tu avance.' },
  { name: 'Dirección', href: '/director', mark: '▥', description: 'Compara grupos y decide qué habilidades reforzar.' },
] as const;

export function Shell({ children, role }: { children: ReactNode; role?: typeof portals[number]['name'] }) {
  return <div className={role === 'Alumno' ? 'student shell' : 'shell'}>
    <a className="skip" href="#contenido">Saltar al contenido</a>
    <header className="header"><div className="wrap header-inner">
      <Link href="/" className="brand"><span aria-hidden="true">✦</span> Aula de Retos</Link>
      {role && <nav className="role-nav" aria-label="Portales">
        {portals.map(portal => <Link key={portal.href} href={portal.href} aria-current={role === portal.name ? 'page' : undefined}>{portal.name}</Link>)}
      </nav>}
    </div></header>
    <main id="contenido" className="wrap main">{children}</main>
  </div>;
}
