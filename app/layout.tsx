import type { Metadata } from 'next';
import { Playfair_Display, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/nav/Sidebar';
import BottomNav from '@/components/nav/BottomNav';
import ThemeProvider from '@/components/ui/ThemeProvider';
import RouteTracker from '@/components/nav/RouteTracker';
import Providers from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
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
    maximumScale: 1,
    viewportFit: 'cover',
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
      className={`${playfair.variable} ${interTight.variable} ${jetbrains.variable}`}
      data-theme="dark"
    >
      <head>
        {/* Prevent dark→light flash for users with saved light theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{var s=JSON.parse(localStorage.getItem('rh-ui')||'{}');if(s&&s.state&&s.state.theme)document.documentElement.setAttribute('data-theme',s.state.theme);}catch(e){}` }} />
      </head>
      <body className="antialiased overflow-hidden">
        <Providers>
          <ThemeProvider>
            <RouteTracker />
            <Sidebar />
            <BottomNav />
            <main className="h-[100svh] overflow-y-auto">{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
