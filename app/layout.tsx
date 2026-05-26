import type { Metadata } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/nav/Sidebar';
import ThemeProvider from '@/components/ui/ThemeProvider';
import Providers from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Down the Rabbit Hole with AI',
    template: '%s | Down the Rabbit Hole with AI',
  },
  description:
    'A curiosity-driven AI podcast platform. Explore any topic through Sparks, Episodes, and Dive conversations with an AI that never runs out of rabbit holes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Down the Rabbit Hole with AI',
    description: 'Start with any question. End somewhere completely unexpected.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Down the Rabbit Hole with AI',
    description: 'Start with any question. End somewhere completely unexpected.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,          // prevent double-tap zoom on feed
    viewportFit: 'cover',     // let content go under notch (we handle safe areas ourselves)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}
      data-theme="dark"
    >
      <body
        className="antialiased overflow-hidden"
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <Providers>
          <ThemeProvider>
            <Sidebar />
            {/* overflow:auto lets inner pages scroll while feed is self-contained */}
            <main className="h-[100svh] overflow-y-auto">{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
