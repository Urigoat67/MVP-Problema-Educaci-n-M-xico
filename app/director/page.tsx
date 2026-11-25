import type { Metadata } from 'next';
import { DemoAccess } from '@/components/acceso-demo';
import { Shell } from '@/components/shell';
import { Director } from '@/components/director';

export const metadata: Metadata = { title: 'Dirección' };

export default function Page() {
  return <Shell role="Dirección"><DemoAccess role="Dirección"><Director /></DemoAccess></Shell>;
}
