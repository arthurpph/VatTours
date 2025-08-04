import { AuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { redirect } from 'next/navigation';
import { getUserById, insertUser } from '@/lib/queries';

export const authOptions: AuthOptions = {
   providers: [
      {
         id: 'vatsim',
         name: 'VATSIM',
         type: 'oauth',
         clientId: process.env.VATSIM_CLIENT_ID,
         clientSecret: process.env.VATSIM_CLIENT_SECRET,
         authorization: {
            url: 'https://auth-dev.vatsim.net/oauth/authorize',
            params: {
               scope: 'full_name email vatsim_details country',
            },
         },
         token: 'https://auth-dev.vatsim.net/oauth/token',
         userinfo: 'https://auth-dev.vatsim.net/api/user',
         checks: ['pkce', 'state'],
         profile(profile) {
            return {
               id: profile.data.cid,
               name: profile.data.personal.name_full,
               email: profile.data.personal.email,
               country: profile.data.personal.country.name,
            };
         },
      },
   ],
   callbacks: {
      async jwt({ token, user }: { token: JWT; user: User }) {
         if (!user) {
            return token;
         }

         const existingUser = await getUserById(user.id);

         if (!existingUser) {
            await insertUser({
               id: user.id,
               name: user.name,
               email: user.email,
            });
            token.role = 'user';
         } else {
            token.role = existingUser.role;
         }
         token.id = user.id;
         token.country = user.country;
         return token;
      },
      async session({ session, token }: { session: Session; token: JWT }) {
         session.id = token.id;
         session.country = token.country;
         session.role = token.role;

         const user = await getUserById(token.id);

         if (!user) {
            return redirect('/auth/signout');
         }

         if (user.role != session.role) {
            token.role = user.role;
            session.role = token.role;
         }

         return session;
      },
   },
   pages: {
      signIn: '/auth/signin',
   },
};
