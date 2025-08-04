import { Role } from './models/role';
import withAuth from 'next-auth/middleware';

export default withAuth({
   pages: {
      signIn: '/auth/signin',
   },
   callbacks: {
      authorized: ({ token, req }) => {
         if (!token) {
            return false;
         }

         const path = req.nextUrl.pathname;
         const adminPaths = ['/admin', '/api/admin'];

         if (adminPaths.some((p) => path.startsWith(p))) {
            const userRole = new Role(token.role);
            if (userRole.isLessThan('admin')) {
               return false;
            }
         }

         return true;
      },
   },
});
