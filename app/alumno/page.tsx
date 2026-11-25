import type { Metadata } from 'next';
import { DemoAccess } from '@/components/acceso-demo';
import { Shell } from '@/components/shell';
import { Student } from '@/components/alumno';

export const metadata: Metadata = { title: 'Alumno' };

export default function Page() {
  return <Shell role="Alumno"><DemoAccess role="Alumno"><Student /></DemoAccess></Shell>;
}
