import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Aula de Retos', template: '%s · Aula de Retos' },
  description: 'Portales escolares de Aula de Retos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
