import './globals.css';
import { Providers } from '@/components/providers';
import 'flag-icons/css/flag-icons.min.css';

export const metadata = {
   title: 'VatTours - Explore os Céus',
   description:
      'Descubra destinos incríveis e viva aventuras únicas nos céus através dos nossos tours exclusivos no VATSIM.',
   keywords: 'VATSIM, tours, voo, simulação, aviação, turismo aéreo',
   authors: [{ name: 'VatTours Team' }],
   creator: 'VatTours',
   publisher: 'VatTours',
   openGraph: {
      title: 'VatTours - Explore os Céus',
      description:
         'Descubra destinos incríveis e viva aventuras únicas nos céus através dos nossos tours exclusivos no VATSIM.',
      type: 'website',
      locale: 'pt_BR',
   },
   twitter: {
      card: 'summary_large_image',
      title: 'VatTours - Explore os Céus',
      description:
         'Descubra destinos incríveis e viva aventuras únicas nos céus através dos nossos tours exclusivos no VATSIM.',
   },
};

export const viewport = {
   width: 'device-width',
   initialScale: 1,
   themeColor: '#3b82f6',
};

export default function RootLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="pt-BR" className="scroll-smooth">
         <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
               rel="preconnect"
               href="https://fonts.gstatic.com"
               crossOrigin="anonymous"
            />
         </head>
         <body className="font-inter antialiased">
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
