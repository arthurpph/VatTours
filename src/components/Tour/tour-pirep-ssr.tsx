import { getServerSession } from 'next-auth';
import TourPirepClientSide from './tour-pirep-csr';
import { getNextLegForUser } from '@/lib/db/queries';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { FileText, AlertCircle } from 'lucide-react';

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
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#da3633]/20">
                  <AlertCircle className="h-5 w-5 text-[#da3633]" />
               </div>
               <div>
                  <h2 className="text-xl font-semibold text-[#f0f6fc]">
                     PIREP
                  </h2>
                  <p className="text-sm text-[#7d8590]">
                     Envio de relatório de voo
                  </p>
               </div>
            </div>

            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#da3633]/20">
                     <FileText className="h-6 w-6 text-[#da3633]" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#f0f6fc]">
                     PIREP indisponível
                  </h3>
                  <p className="mb-2 text-sm text-[#7d8590]">
                     Não é possível reportar um novo PIREP no momento.
                  </p>
                  <p className="text-sm text-[#7d8590]">
                     Verifique se você possui um pendente.
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return <TourPirepClientSide leg={nextLegPirepResult} />;
}
