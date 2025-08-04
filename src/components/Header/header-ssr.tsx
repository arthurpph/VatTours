import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import HeaderClient from './header-csr';

export default async function HeaderServer() {
   const session = await getServerSession(authOptions);
   if (!session) return null;

   return <HeaderClient session={session} />;
}
