import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Odisha Aspirants - Government Recruitment & CBT Mock Test Portal',
  description: 'Explore latest Odisha government job vacancies (OSSSC, OPSC, OSSC, RRB), download admit cards, answer keys, results, previous year question papers, and practice online CBT tests.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main style={{ minHeight: 'calc(100vh - 380px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
