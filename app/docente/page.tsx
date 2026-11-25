import type { Metadata } from 'next';
import { DemoAccess } from '@/components/acceso-demo';
import { Shell } from '@/components/shell';
import { Teacher } from '@/components/docente';

export const metadata: Metadata = { title: 'Docente' };

export default function Page() {
  return <Shell role="Docente"><DemoAccess role="Docente"><Teacher /></DemoAccess></Shell>;
}
