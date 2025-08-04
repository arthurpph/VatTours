import { db } from '@/db';
import { airportsTable, legsTable, pirepsTable, usersTable } from '@/db/schema';
import { PirepStatus } from '@/models/types';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

type PirepWithUserAndLeg = {
   id: number;
   callsign: string;
   comment: string | null;
   reviewerNote: string | null;
   status: PirepStatus;
   submittedAt: Date | null;
   departureCountry: string;
   departureName: string;
   departureIcao: string;
   arrivalCountry: string;
   arrivalName: string;
   arrivalIcao: string;
   userId: string;
   userName: string;
   userEmail: string | null;
};

type GroupedByUser = {
   userId: string;
   name: string;
   email: string | null;
   pireps: PirepWithUserAndLeg[];
};

type Props = {
   tourId: string;
};

export default async function TourStatus({ tourId }: Props) {
   const depAirports = alias(airportsTable, 'dep_airport');
   const arrAirports = alias(airportsTable, 'arr_airport');

   const pireps = await db
      .select({
         id: pirepsTable.id,
         callsign: pirepsTable.callsign,
         comment: pirepsTable.comment,
         reviewerNote: pirepsTable.reviewNote,
         status: pirepsTable.status,
         submittedAt: pirepsTable.submittedAt,
         departureCountry: depAirports.country,
         departureName: depAirports.name,
         departureIcao: legsTable.departureIcao,
         arrivalCountry: arrAirports.country,
         arrivalName: arrAirports.name,
         arrivalIcao: legsTable.arrivalIcao,
         userId: usersTable.id,
         userName: usersTable.name,
         userEmail: usersTable.email,
      })
      .from(pirepsTable)
      .innerJoin(legsTable, eq(pirepsTable.legId, legsTable.id))
      .innerJoin(usersTable, eq(pirepsTable.userId, usersTable.id))
      .innerJoin(depAirports, eq(legsTable.departureIcao, depAirports.icao))
      .innerJoin(arrAirports, eq(legsTable.arrivalIcao, arrAirports.icao))
      .where(eq(legsTable.tourId, Number(tourId)));

   const grouped: Record<string, GroupedByUser> = {};

   for (const pirep of pireps) {
      if (!grouped[pirep.userId]) {
         grouped[pirep.userId] = {
            userId: pirep.userId,
            name: pirep.userName,
            email: pirep.userEmail,
            pireps: [],
         };
      }
      grouped[pirep.userId].pireps.push(pirep);
   }

   const groupedPireps = Object.values(grouped);

   const StatusIcon = ({ status }: { status: PirepStatus }) => {
      switch (status) {
         case 'approved':
            return (
               <CheckCircle className="text-green-500 w-4 h-4 inline-block" />
            );
         case 'pending':
            return <Clock className="text-yellow-400 w-4 h-4 inline-block" />;
         case 'rejected':
            return <XCircle className="text-red-500 w-4 h-4 inline-block" />;
      }
   };

   return (
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8 text-gray-100">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
               Status
            </h2>

            {groupedPireps.length === 0 ? (
               <p className="text-gray-400 text-center text-lg">
                  Nenhum PIREP encontrado.
               </p>
            ) : (
               <ul className="space-y-8">
                  {groupedPireps.map((user, index) => (
                     <li
                        key={index}
                        className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-xl shadow"
                     >
                        <div className="mb-4">
                           <h3 className="text-2xl font-semibold text-white">
                              {user.name}
                           </h3>
                        </div>

                        <ul className="space-y-4">
                           {user.pireps.map((pirep, index) => (
                              <li
                                 key={index}
                                 className="bg-gray-900 p-4 rounded-lg flex flex-col gap-3 border border-gray-700"
                              >
                                 <div className="text-sm">
                                    <p className="font-medium text-gray-100 mb-1">
                                       <span
                                          className={`fi fi-${pirep.departureCountry.toLowerCase()} mr-1`}
                                       ></span>
                                       {pirep.departureIcao}
                                       <span className="mx-2 text-gray-500">
                                          →
                                       </span>
                                       <span
                                          className={`fi fi-${pirep.arrivalCountry.toLowerCase()} mr-1`}
                                       ></span>
                                       {pirep.arrivalIcao}
                                    </p>

                                    <p className="text-gray-300">
                                       <span className="text-white font-semibold">
                                          {pirep.callsign}
                                       </span>{' '}
                                       - <StatusIcon status={pirep.status} />{' '}
                                       <span
                                          className={
                                             pirep.status === 'approved'
                                                ? 'text-green-500'
                                                : pirep.status === 'pending'
                                                  ? 'text-yellow-400'
                                                  : 'text-red-500'
                                          }
                                       >
                                          {pirep.status}
                                       </span>
                                    </p>

                                    {pirep.comment && (
                                       <p className="text-gray-400 mt-1 italic">
                                          {pirep.comment}
                                       </p>
                                    )}

                                    {pirep.reviewerNote && (
                                       <div className="mt-3 border-l-4 border-blue-500 pl-3 text-blue-300 text-sm bg-blue-950/30 rounded-md py-2">
                                          <p className="font-medium">
                                             Comentário do revisor:
                                          </p>
                                          <p className="italic">
                                             {pirep.reviewerNote}
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </section>
   );
}
