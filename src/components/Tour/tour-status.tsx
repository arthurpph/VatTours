import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getPirepsByUserAndTour } from '@/lib/db/queries';
import { PirepStatus } from '@/models/types';
import { CheckCircle, Clock, XCircle, BarChart3, User } from 'lucide-react';
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

   const users = Object.values(grouped);

   const getStatusIcon = (status: PirepStatus) => {
      switch (status) {
         case 'approved':
            return <CheckCircle className="h-4 w-4 text-[#238636]" />;
         case 'pending':
            return <Clock className="h-4 w-4 text-[#fb8500]" />;
         case 'rejected':
            return <XCircle className="h-4 w-4 text-[#da3633]" />;
         default:
            return <Clock className="h-4 w-4 text-[#7d8590]" />;
      }
   };

   const getStatusColor = (status: PirepStatus) => {
      switch (status) {
         case 'approved':
            return 'text-[#238636] bg-[#238636]/10';
         case 'pending':
            return 'text-[#fb8500] bg-[#fb8500]/10';
         case 'rejected':
            return 'text-[#da3633] bg-[#da3633]/10';
         default:
            return 'text-[#7d8590] bg-[#7d8590]/10';
      }
   };

   const getStatusText = (status: PirepStatus) => {
      switch (status) {
         case 'approved':
            return 'Aprovado';
         case 'pending':
            return 'Pendente';
         case 'rejected':
            return 'Rejeitado';
         default:
            return 'Desconhecido';
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8b5cf6]/20">
               <BarChart3 className="h-5 w-5 text-[#8b5cf6]" />
            </div>
            <div>
               <h2 className="text-xl font-semibold text-[#f0f6fc]">
                  Status do Tour
               </h2>
               <p className="text-sm text-[#7d8590]">Acompanhe seu progresso</p>
            </div>
         </div>

         {users.length === 0 ? (
            <div className="py-12 text-center">
               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">
                  <BarChart3 className="h-6 w-6 text-[#7d8590]" />
               </div>
               <h3 className="mb-2 text-lg font-medium text-[#f0f6fc]">
                  Nenhum progresso encontrado
               </h3>
               <p className="text-sm text-[#7d8590]">
                  Seja o primeiro a começar este tour!
               </p>
            </div>
         ) : (
            <div className="space-y-4">
               {users.map((user) => (
                  <div
                     key={user.userId}
                     className="rounded-md border border-[#21262d] bg-[#161b22] p-6"
                  >
                     <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21262d]">
                           <User className="h-5 w-5 text-[#f0f6fc]" />
                        </div>
                        <div>
                           <h3 className="font-medium text-[#f0f6fc]">
                              {user.name}
                           </h3>
                           <p className="text-sm text-[#7d8590]">
                              {user.pireps.length} PIREP
                              {user.pireps.length !== 1 ? 's' : ''}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {user.pireps.map((pirep) => (
                           <div
                              key={pirep.id}
                              className="rounded-md border border-[#21262d] bg-[#0d1117] p-4"
                           >
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span
                                       className={`fi fi-${pirep.departureCountry.toLowerCase()} h-4 w-6 rounded border border-[#21262d]`}
                                    ></span>
                                    <span className="font-mono text-sm font-medium text-[#f0f6fc]">
                                       {pirep.departureIcao}
                                    </span>
                                    <span className="text-[#7d8590]">→</span>
                                    <span className="font-mono text-sm font-medium text-[#f0f6fc]">
                                       {pirep.arrivalIcao}
                                    </span>
                                    <span
                                       className={`fi fi-${pirep.arrivalCountry.toLowerCase()} h-4 w-6 rounded border border-[#21262d]`}
                                    ></span>
                                 </div>

                                 <div className="flex items-center gap-2">
                                    <span
                                       className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(pirep.status)}`}
                                    >
                                       {getStatusIcon(pirep.status)}
                                       {getStatusText(pirep.status)}
                                    </span>
                                 </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <div>
                                    <h4 className="mb-2 text-sm font-medium text-[#f0f6fc]">
                                       Detalhes do Voo
                                    </h4>
                                    <div className="space-y-1 text-sm text-[#7d8590]">
                                       <p>
                                          <span className="font-medium">
                                             Callsign:
                                          </span>{' '}
                                          {pirep.callsign}
                                       </p>
                                       {pirep.submittedAt && (
                                          <p>
                                             <span className="font-medium">
                                                Enviado:
                                             </span>{' '}
                                             {new Date(
                                                pirep.submittedAt,
                                             ).toLocaleDateString('pt-BR')}
                                          </p>
                                       )}
                                    </div>
                                 </div>

                                 {pirep.comment && (
                                    <div>
                                       <h4 className="mb-2 text-sm font-medium text-[#f0f6fc]">
                                          Comentário
                                       </h4>
                                       <p className="text-sm break-words whitespace-pre-wrap text-[#7d8590]">
                                          {pirep.comment}
                                       </p>
                                    </div>
                                 )}

                                 {pirep.reviewerNote && (
                                    <div className="md:col-span-2">
                                       <h4 className="mb-2 text-sm font-medium text-[#f0f6fc]">
                                          Nota do Revisor
                                       </h4>
                                       <div className="rounded-md border border-[#21262d] bg-[#161b22] p-3">
                                          <p className="text-sm text-[#7d8590]">
                                             {pirep.reviewerNote}
                                          </p>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
