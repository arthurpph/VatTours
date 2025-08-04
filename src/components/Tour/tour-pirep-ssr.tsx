import { getServerSession } from 'next-auth';
import TourPirepClientSide from './tour-pirep-csr';
import { getNextLegForUser } from '@/lib/db/queries';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export default async function TourPirep({ tourId }: { tourId: string }) {
   const session = await getServerSession(authOptions);
   const tourIdNumber = Number(tourId);
   const userId = session?.id;

   if (isNaN(tourIdNumber) || !userId) {
      return null;
   }

   const nextLegPirepResult = await getNextLegForUser(userId, tourIdNumber);

   if (!nextLegPirepResult) {
      return (
         <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">PIREP</h2>
            <p className="text-center">
               Não é possível reportar um novo PIREP no momento.
            </p>
            <br />
            <p className="text-center">Verifique se você possui um pendente.</p>
         </div>
      );
   }

   return <TourPirepClientSide userId={userId} leg={nextLegPirepResult} />;
}
