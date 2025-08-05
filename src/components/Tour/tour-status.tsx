import { getPirepsByTour } from '@/lib/db/queries';
import { PirepStatus } from '@/models/types';
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
   const pireps = await getPirepsByTour(Number(tourId));
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
               <CheckCircle className="inline-block h-4 w-4 text-green-500" />
            );
         case 'pending':
            return <Clock className="inline-block h-4 w-4 text-yellow-400" />;
         case 'rejected':
            return <XCircle className="inline-block h-4 w-4 text-red-500" />;
      }
   };

   return (
      <section className="w-full px-4 py-8 text-gray-100 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight">
               Status
            </h2>

            {groupedPireps.length === 0 ? (
               <p className="text-center text-lg text-gray-400">
                  Nenhum PIREP encontrado.
               </p>
            ) : (
               <ul className="space-y-8">
                  {groupedPireps.map((user, index) => (
                     <li
                        key={index}
                        className="rounded-xl border border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-6 shadow"
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
                                 className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4"
                              >
                                 <div className="text-sm">
                                    <p className="mb-1 font-medium text-gray-100">
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
                                       <span className="font-semibold text-white">
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
                                       <p className="mt-1 text-gray-400 italic">
                                          {pirep.comment}
                                       </p>
                                    )}

                                    {pirep.reviewerNote && (
                                       <div className="mt-3 rounded-md border-l-4 border-blue-500 bg-blue-950/30 py-2 pl-3 text-sm text-blue-300">
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
