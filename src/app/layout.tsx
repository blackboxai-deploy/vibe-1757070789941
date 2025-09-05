import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Everyday Planner',
  description: 'A modern, intuitive daily and weekly planner to organize your tasks and achieve your goals.',
  keywords: ['planner', 'productivity', 'tasks', 'goals', 'calendar', 'organization'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <Navigation />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}