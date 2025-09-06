import LegItem from '@/components/Tour/leg-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getLegsWithAirports, getPirepsByUserAndLegs } from '@/lib/db/queries';
import { Route, MapPin } from 'lucide-react';

type Props = {
   tourId: string;
};

export default async function TourLegs({ tourId }: Props) {
   const session = await getServerSession(authOptions);

   if (!session) {
      return <></>;
   }

   const legs = await getLegsWithAirports(parseInt(tourId));

   const legIds = legs.map((leg) => leg.id);

   const pireps = await getPirepsByUserAndLegs(session.id, legIds);

   const pirepMap = new Map<number, string>();
   pireps.forEach((p) => {
      pirepMap.set(p.legId, p.status);
   });

   let nextLegId: number | null = null;
   for (const leg of legs) {
      const status = pirepMap.get(leg.id);
      if (!status || status === 'pending' || status === 'rejected') {
         nextLegId = leg.id;
         break;
      }
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#21262d]">
               <Route className="h-5 w-5 text-[#7d8590]" />
            </div>
            <div>
               <h2 className="text-xl font-semibold text-[#f0f6fc]">
                  Pernas do Tour
               </h2>
               <p className="text-sm text-[#7d8590]">
                  Complete cada etapa da sua jornada e explore destinos
                  incríveis
               </p>
            </div>
         </div>

         {legs.length === 0 ? (
            <div className="py-12 text-center">
               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">
                  <MapPin className="h-6 w-6 text-[#7d8590]" />
               </div>
               <h3 className="mb-2 text-lg font-medium text-[#f0f6fc]">
                  Nenhuma perna encontrada
               </h3>
               <p className="text-sm text-[#7d8590]">
                  Este tour ainda não possui pernas configuradas.
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {legs.map((leg, index) => (
                  <LegItem
                     key={leg.id}
                     leg={leg}
                     index={index}
                     highlight={leg.id === nextLegId}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
