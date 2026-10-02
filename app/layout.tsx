import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hearth & Grain — Everyday goods, made well',
  description: 'Considered objects for slow mornings, warm rooms, and everyday rituals.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
