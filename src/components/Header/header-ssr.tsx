import { getServerSession } from 'next-auth';
import HeaderClient from './header-csr';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export default async function HeaderServer() {
   const session = await getServerSession(authOptions);
   if (!session) {
      return <></>;
   }

   return <HeaderClient session={session} />;
}
