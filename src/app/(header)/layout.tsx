import Header from '@/components/Header/header-ssr';

export default function HeaderLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <>
         <Header />
         {children}
      </>
   );
}
