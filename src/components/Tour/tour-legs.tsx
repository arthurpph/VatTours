import LegItem from '@/components/Tour/leg-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getLegsWithAirports, getPirepsByUserAndLegs } from '@/lib/queries';

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
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8 text-gray-100">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
               Pernas
            </h2>

            {legs.length === 0 ? (
               <p className="text-gray-400 text-center text-lg">
                  Nenhuma perna encontrada.
               </p>
            ) : (
               <ul className="space-y-6 sm:space-y-8 overflow-x-auto">
                  {legs.map((leg, index) => (
                     <LegItem
                        key={leg.id}
                        leg={leg}
                        index={index}
                        highlight={leg.id === nextLegId}
                     />
                  ))}
               </ul>
            )}
         </div>
      </section>
   );
}
