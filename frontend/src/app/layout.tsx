import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import PublicNavbar from '@/components/nav/PublicNavbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import PageTransition from '@/components/PageTransition';
import CursorGlow from '@/components/CursorGlow';
import NeuralAtmosphere from '@/components/NeuralAtmosphere';
import { BRAND } from '@/lib/brand';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col bg-[#050816] text-slate-100 antialiased">
        <Providers>
          <NeuralAtmosphere />
          <CursorGlow />
          <PublicNavbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
