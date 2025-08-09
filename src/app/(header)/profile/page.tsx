import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getUserProfile, getUserBadges, searchUsers } from '@/lib/db/queries';
import ProfilePage from '@/components/Profile/profile-page';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
   title: 'Perfil - VatTours',
   description: 'Visualize seu perfil, badges e conquistas no VatTours',
};

type SearchParams = {
   q?: string;
   user?: string;
};

export default async function Profile({
   searchParams,
}: {
   searchParams: Promise<SearchParams>;
}) {
   const session = await getServerSession(authOptions);

   if (!session?.user) {
      redirect('/auth/signin');
   }

   const { q, user } = await searchParams;
   const targetUserId = user || session.id;
   const userProfile = await getUserProfile(targetUserId);

   if (!userProfile) {
      if (user) {
         redirect('/profile');
      } else {
         redirect('/auth/signin');
      }
   }

   const userBadges = await getUserBadges(targetUserId);

   const searchResults = q ? await searchUsers(q) : [];

   return (
      <ProfilePage
         profileUser={userProfile}
         badges={userBadges}
         searchQuery={q}
         searchResults={searchResults}
         isOwnProfile={targetUserId === session.id}
      />
   );
}
