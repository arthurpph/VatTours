'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
   const { status } = useSession();

   useEffect(() => {
      if (status === 'authenticated') {
         signOut({ callbackUrl: '/auth/signin' });
      }
   }, [status]);

   return <p>Redirecting to login...</p>;
}
