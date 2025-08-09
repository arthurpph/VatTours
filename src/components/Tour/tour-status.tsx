import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getPirepsByUserAndTour } from '@/lib/db/queries';
import { PirepStatus } from '@/models/types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { getServerSession } from 'next-auth';

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
   const session = await getServerSession(authOptions);

   if (!session) {
      return <></>;
   }

   const pireps = await getPirepsByUserAndTour(session.id, Number(tourId));
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
               <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-400/30 bg-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
               </div>
            );
         case 'pending':
            return (
               <div className="flex h-6 w-6 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-500/20">
                  <Clock className="h-4 w-4 text-yellow-400" />
               </div>
            );
         case 'rejected':
            return (
               <div className="flex h-6 w-6 items-center justify-center rounded-full border border-red-400/30 bg-red-500/20">
                  <XCircle className="h-4 w-4 text-red-400" />
               </div>
            );
      }
   };

   return (
      <section className="w-full">
         <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
               <h2 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl font-bold text-transparent">
                  Status dos PIREPs
               </h2>
               <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
               <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
                  Acompanhe o progresso dos participantes e o status de
                  aprovação dos voos
               </p>
            </div>

            {groupedPireps.length === 0 ? (
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
                           d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                     </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-300">
                     Nenhum PIREP encontrado
                  </h3>
                  <p className="text-gray-400">
                     Ainda não há relatórios de voo submetidos para este tour.
                  </p>
               </div>
            ) : (
               <div className="space-y-8">
                  {groupedPireps.map((user, index) => (
                     <div
                        key={index}
                        className="group relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                        <div className="relative p-8">
                           <div className="mb-8 flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                 <svg
                                    className="h-7 w-7 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                 </svg>
                              </div>
                              <div className="flex-1">
                                 <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                    {user.name}
                                 </h3>
                                 <div className="mt-1 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                    <span className="text-sm text-gray-400">
                                       {user.pireps.length} PIREPs submetidos
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div className="grid gap-6">
                              {user.pireps.map((pirep, pirepIndex) => (
                                 <div
                                    key={pirepIndex}
                                    className="group/pirep relative overflow-hidden rounded-2xl border border-gray-700/30 bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 transition-all duration-300 hover:border-gray-600/50"
                                 >
                                    <div className="mb-4 flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-3 text-lg font-semibold">
                                             <div className="flex items-center gap-2">
                                                <span
                                                   className={`fi fi-${pirep.departureCountry.toLowerCase()} h-5 w-7 rounded border border-gray-600 shadow-sm`}
                                                ></span>
                                                <span className="text-white">
                                                   {pirep.departureIcao}
                                                </span>
                                             </div>

                                             <div className="flex items-center gap-2">
                                                <div className="h-px w-6 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                                <svg
                                                   className="h-4 w-4 text-gray-400"
                                                   fill="currentColor"
                                                   viewBox="0 0 20 20"
                                                >
                                                   <path
                                                      fillRule="evenodd"
                                                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                      clipRule="evenodd"
                                                   />
                                                </svg>
                                                <div className="h-px w-6 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                             </div>

                                             <div className="flex items-center gap-2">
                                                <span className="text-white">
                                                   {pirep.arrivalIcao}
                                                </span>
                                                <span
                                                   className={`fi fi-${pirep.arrivalCountry.toLowerCase()} h-5 w-7 rounded border border-gray-600 shadow-sm`}
                                                ></span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-3">
                                          <StatusIcon status={pirep.status} />
                                          <span
                                             className={`rounded-full border px-3 py-1 text-sm font-medium ${
                                                pirep.status === 'approved'
                                                   ? 'border-green-400/20 bg-green-500/10 text-green-400'
                                                   : pirep.status === 'pending'
                                                     ? 'border-yellow-400/20 bg-yellow-500/10 text-yellow-400'
                                                     : 'border-red-400/20 bg-red-500/10 text-red-400'
                                             }`}
                                          >
                                             {pirep.status}
                                          </span>
                                       </div>
                                    </div>

                                    <div className="mb-4">
                                       <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-sm">
                                          <svg
                                             className="h-4 w-4 text-blue-400"
                                             fill="currentColor"
                                             viewBox="0 0 20 20"
                                          >
                                             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                             <path
                                                fillRule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                          <span className="font-semibold text-blue-400">
                                             {pirep.callsign}
                                          </span>
                                       </div>
                                    </div>

                                    {pirep.comment && (
                                       <div className="mb-4 rounded-2xl border border-gray-600/30 bg-gray-700/30 p-4">
                                          <h5 className="mb-2 flex items-center gap-2 font-medium text-gray-300">
                                             <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                             >
                                                <path
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                   strokeWidth={2}
                                                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                             </svg>
                                             Comentário do Piloto
                                          </h5>
                                          <p className="leading-relaxed text-gray-400 italic">
                                             {pirep.comment}
                                          </p>
                                       </div>
                                    )}

                                    {pirep.reviewerNote && (
                                       <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4">
                                          <h5 className="mb-2 flex items-center gap-2 font-medium text-blue-400">
                                             <svg
                                                className="h-4 w-4"
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
                                             Comentário do Revisor
                                          </h5>
                                          <p className="leading-relaxed text-gray-300 italic">
                                             {pirep.reviewerNote}
                                          </p>
                                       </div>
                                    )}

                                    {pirep.submittedAt && (
                                       <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                                          <svg
                                             className="h-3 w-3"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                             />
                                          </svg>
                                          Submetido em{' '}
                                          {pirep.submittedAt.toLocaleDateString(
                                             'pt-BR',
                                          )}
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </section>
   );
}
