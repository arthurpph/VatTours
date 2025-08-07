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
      <section className="w-full px-4 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center sm:mb-12 lg:mb-16">
               <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
                  Pernas do Tour
               </h2>
               <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 sm:w-28 lg:w-32"></div>
               <p className="mx-auto mt-4 max-w-2xl px-4 text-sm text-gray-300 sm:mt-6 sm:text-base lg:text-lg">
                  Complete cada etapa da sua jornada e explore destinos
                  incríveis pelo mundo
               </p>
            </div>

            {legs.length === 0 ? (
               <div className="py-12 text-center sm:py-16 lg:py-20">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800 sm:mb-6 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                     <svg
                        className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
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
                  <h3 className="mb-2 text-xl font-bold text-gray-300 sm:text-2xl">
                     Nenhuma perna encontrada
                  </h3>
                  <p className="px-4 text-sm text-gray-400 sm:text-base">
                     Este tour ainda não possui pernas configuradas.
                  </p>
               </div>
            ) : (
               <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 hidden w-0.5 bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-indigo-500/30 sm:left-6 md:block lg:left-8"></div>

                  <ul className="space-y-4 sm:space-y-6 lg:space-y-8">
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
