'use client';

import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { useEffect, useState } from 'react';
import { PlaneTakeoff, ArrowLeft, Check, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type Pirep = {
   id: number;
   userId: string;
   userName: string;
   legId: number;
   tourTitle: string;
   departureIcao: string;
   arrivalIcao: string;
   callsign: string;
   comment: string | null;
   status: string;
};

export default function TourLegApprovalPage() {
   const [pireps, setPireps] = useState<Pirep[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [updatingId, setUpdatingId] = useState<number | null>(null);
   const [reviewComments, setReviewComments] = useState<Record<number, string>>(
      {},
   );

   useEffect(() => {
      fetchPireps();
   }, []);

   async function fetchPireps() {
      setLoading(true);
      setError(null);

      try {
         const res = await fetch(`${PUBLIC_API_ROUTES.pireps}?status=pending`);
         if (!res.ok) throw new Error((await res.json()).message);
         const data = await res.json();
         setPireps(data);
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message);
         } else {
            setError('Erro inesperado');
         }
      } finally {
         setLoading(false);
      }
   }

   async function updateStatus(
      pirepId: number,
      status: 'approved' | 'rejected',
   ) {
      setUpdatingId(pirepId);

      try {
         const res = await fetch(`${ADMIN_API_ROUTES.pireps}/${pirepId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               status,
               reviewComment: reviewComments[pirepId] || null,
            }),
         });

         if (!res.ok) throw new Error((await res.json()).message);

         alert(
            `PIREP ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`,
         );
         fetchPireps();
         setReviewComments((prev) => {
            const updated = { ...prev };
            delete updated[pirepId];
            return updated;
         });
      } catch (err: unknown) {
         if (err instanceof Error) {
            alert('Erro: ' + err.message);
         } else {
            alert('Erro inesperado');
         }
      } finally {
         setUpdatingId(null);
      }
   }

   return (
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-4">
               <div className="flex items-center gap-3">
                  <Link
                     href="/admin"
                     className="flex h-8 w-8 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#f0f6fc]"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#a5b4fc]/15">
                     <PlaneTakeoff className="h-5 w-5 text-[#a5b4fc]" />
                  </div>
                  <div>
                     <h1 className="text-xl font-semibold text-[#f0f6fc]">
                        Gerenciar PIREPs
                     </h1>
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            {loading && (
               <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#a5b4fc]/15">
                     <RefreshCw className="h-6 w-6 animate-spin text-[#a5b4fc]" />
                  </div>
                  <p className="text-lg font-medium text-[#f0f6fc]">
                     Carregando PIREPs pendentes...
                  </p>
                  <p className="text-sm text-[#7d8590]">
                     Aguarde enquanto buscamos os relatórios para aprovação
                  </p>
               </div>
            )}

            {error && (
               <div className="mb-8 rounded-md border border-[#f85149]/30 bg-[#161b22] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#f85149]/15">
                     <X className="h-6 w-6 text-[#f85149]" />
                  </div>
                  <p className="text-lg font-medium text-[#f0f6fc]">
                     Erro ao carregar
                  </p>
                  <p className="text-sm text-[#f85149]">{error}</p>
               </div>
            )}

            {!loading && pireps.length === 0 && (
               <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#8cc8ff]/15">
                     <PlaneTakeoff className="h-6 w-6 text-[#8cc8ff]" />
                  </div>
                  <p className="text-lg font-medium text-[#f0f6fc]">
                     Nenhum PIREP pendente
                  </p>
                  <p className="text-sm text-[#7d8590]">
                     Todos os relatórios de voo foram processados
                  </p>
               </div>
            )}

            {!loading && pireps.length > 0 && (
               <div className="space-y-6">
                  {pireps.map((pirep) => (
                     <div
                        key={pirep.id}
                        className="rounded-md border border-[#21262d] bg-[#161b22] p-6 transition-colors hover:bg-[#21262d]"
                     >
                        <div className="mb-6 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#a5b4fc]/15">
                                 <PlaneTakeoff className="h-6 w-6 text-[#a5b4fc]" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-semibold text-[#f0f6fc]">
                                    {pirep.tourTitle}
                                 </h3>
                                 <p className="text-sm text-[#7d8590]">
                                    Por {pirep.userName} • {pirep.callsign}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/15 px-3 py-1">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-[#ffd700]"></div>
                              <span className="text-sm font-medium text-[#ffd700]">
                                 Pendente
                              </span>
                           </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                           <div className="rounded-md border border-[#21262d] bg-[#0d1117] p-4">
                              <h4 className="mb-3 text-sm font-medium text-[#f0f6fc]">
                                 Detalhes do Voo
                              </h4>
                              <div className="space-y-2">
                                 <div className="flex justify-between">
                                    <span className="text-sm text-[#7d8590]">
                                       Partida:
                                    </span>
                                    <span className="text-sm text-[#f0f6fc]">
                                       {pirep.departureIcao}
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-sm text-[#7d8590]">
                                       Chegada:
                                    </span>
                                    <span className="text-sm text-[#f0f6fc]">
                                       {pirep.arrivalIcao}
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-sm text-[#7d8590]">
                                       Callsign:
                                    </span>
                                    <span className="text-sm text-[#f0f6fc]">
                                       {pirep.callsign}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {pirep.comment && (
                              <div className="rounded-md border border-[#21262d] bg-[#0d1117] p-4">
                                 <h4 className="mb-3 text-sm font-medium text-[#f0f6fc]">
                                    Comentários
                                 </h4>
                                 <p className="text-sm break-words whitespace-pre-wrap text-[#7d8590]">
                                    {pirep.comment}
                                 </p>
                              </div>
                           )}
                        </div>

                        <div className="space-y-3">
                           <div>
                              <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                                 Comentário da Revisão
                              </label>
                              <textarea
                                 value={reviewComments[pirep.id] || ''}
                                 onChange={(e) =>
                                    setReviewComments((prev) => ({
                                       ...prev,
                                       [pirep.id]: e.target.value,
                                    }))
                                 }
                                 placeholder="Adicione comentários sobre a revisão (opcional)"
                                 rows={3}
                                 className="w-full resize-none rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#a5b4fc] focus:ring-1 focus:ring-[#a5b4fc] focus:outline-none"
                              />
                           </div>

                           <div className="flex gap-3">
                              <button
                                 disabled={updatingId === pirep.id}
                                 onClick={() =>
                                    updateStatus(pirep.id, 'approved')
                                 }
                                 className="flex cursor-pointer items-center gap-2 rounded-md bg-[#8cc8ff] px-4 py-2 font-medium text-[#0d1117] transition-colors hover:bg-[#a5b4fc] disabled:opacity-50"
                              >
                                 {updatingId === pirep.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                 ) : (
                                    <Check className="h-4 w-4" />
                                 )}
                                 Aprovar
                              </button>
                              <button
                                 disabled={updatingId === pirep.id}
                                 onClick={() =>
                                    updateStatus(pirep.id, 'rejected')
                                 }
                                 className="flex cursor-pointer items-center gap-2 rounded-md bg-[#f85149] px-4 py-2 font-medium text-white transition-colors hover:bg-[#da3633] disabled:opacity-50"
                              >
                                 {updatingId === pirep.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                 ) : (
                                    <X className="h-4 w-4" />
                                 )}
                                 Rejeitar
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
