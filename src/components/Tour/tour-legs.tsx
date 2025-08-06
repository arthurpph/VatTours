import LegItem from '@/components/Tour/leg-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getLegsWithAirports, getPirepsByUserAndLegs } from '@/lib/db/queries';

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
      <section className="w-full">
         <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
               <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl font-bold text-transparent">
                  Pernas do Tour
               </h2>
               <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
               <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
                  Complete cada etapa da sua jornada e explore destinos
                  incríveis pelo mundo
               </p>
            </div>

            {legs.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800">
                     <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                     </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-300">
                     Nenhuma perna encontrada
                  </h3>
                  <p className="text-gray-400">
                     Este tour ainda não possui pernas configuradas.
                  </p>
               </div>
            ) : (
               <div className="relative">
                  <div className="absolute top-0 bottom-0 left-8 hidden w-0.5 bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-indigo-500/30 lg:block"></div>

                  <ul className="space-y-8">
                     {legs.map((leg, index) => (
                        <LegItem
                           key={leg.id}
                           leg={leg}
                           index={index}
                           highlight={leg.id === nextLegId}
                        />
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </section>
   );
}
