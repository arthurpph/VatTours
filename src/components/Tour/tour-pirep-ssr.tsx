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
         <div className="mx-auto mt-10 max-w-4xl rounded-xl bg-gray-800 p-6 text-white shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold">PIREP</h2>
            <p className="text-center">
               Não é possível reportar um novo PIREP no momento.
            </p>
            <br />
            <p className="text-center">Verifique se você possui um pendente.</p>
         </div>
      );
   }

   return <TourPirepClientSide leg={nextLegPirepResult} />;
}
