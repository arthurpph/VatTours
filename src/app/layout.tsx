import './globals.css';
import { Providers } from '@/components/providers';
import 'flag-icons/css/flag-icons.min.css';

export default function RootLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <html>
         <body>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
