import { RoleName } from '@/models/role';

declare module 'next-auth' {
   interface User {
      id: string;
      name: string;
      email: string;
      country: string;
   }

   interface Session {
      id: string;
      country: string;
      role: RoleName;
   }
}

declare module 'next-auth/jwt' {
   interface JWT extends DefaultJWT {
      id: string;
      country: string;
      role: RoleName;
   }
}
