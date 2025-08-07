import './globals.css';
import { Providers } from '@/components/providers';
import 'flag-icons/css/flag-icons.min.css';

export const metadata = {
   title: 'VatTours',
   description: 'Fly tours on VATSIM!',
};

export const viewport = {
   width: 'device-width',
   initialScale: 1,
};

export default function RootLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <html>
         <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="shortcut icon" href="/favicon.ico" />
         </head>
         <body>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
