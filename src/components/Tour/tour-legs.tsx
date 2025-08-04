import { db } from '@/db';
import { airportsTable, legsTable, pirepsTable } from '@/db/schema';
import { eq, asc, and, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import LegItem from '@/components/Tour/leg-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type Props = {
   tourId: string;
};

export default async function TourLegs({ tourId }: Props) {
   const session = await getServerSession(authOptions);
   const depAirport = alias(airportsTable, 'depAirport');
   const arrAirport = alias(airportsTable, 'arrAirport');

   if (!session) {
      return <></>;
   }

   const legs = await db
      .select({
         id: legsTable.id,
         departureCountry: depAirport.country,
         departureIcao: legsTable.departureIcao,
         arrivalCountry: arrAirport.country,
         arrivalIcao: legsTable.arrivalIcao,
         description: legsTable.description,
         order: legsTable.order,
      })
      .from(legsTable)
      .innerJoin(depAirport, eq(legsTable.departureIcao, depAirport.icao))
      .innerJoin(arrAirport, eq(legsTable.arrivalIcao, arrAirport.icao))
      .where(eq(legsTable.tourId, parseInt(tourId)))
      .orderBy(asc(legsTable.order));

   const legIds = legs.map((leg) => leg.id);

   const pireps = await db
      .select({ legId: pirepsTable.legId, status: pirepsTable.status })
      .from(pirepsTable)
      .where(
         and(
            eq(pirepsTable.userId, session.id),
            inArray(pirepsTable.legId, legIds),
         ),
      );

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
