'use client';

import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { useEffect, useState } from 'react';

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
      newStatus: 'approved' | 'rejected',
   ) {
      setUpdatingId(pirepId);
      setError(null);

      try {
         const res = await fetch(`${ADMIN_API_ROUTES.pireps}/${pirepId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               status: newStatus,
               review_note: reviewComments[pirepId] || null,
            }),
         });

         if (!res.ok) throw new Error((await res.json()).message);
         setPireps((prev) => prev.filter((p) => p.id !== pirepId));
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message);
         } else {
            setError('Erro inesperado');
         }
      } finally {
         setUpdatingId(null);
      }
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 px-6 py-10">
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-600/10 to-indigo-600/10 blur-3xl"></div>
            <div className="absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-3xl"></div>
         </div>

         <div className="relative mx-auto max-w-6xl">
            <div className="mb-16 space-y-8 text-center">
               <div className="space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                     <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                     </svg>
                  </div>

                  <h1 className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-6xl font-bold text-transparent">
                     Aprovação de PIREPs
                  </h1>
                  <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
               </div>

               <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                  Revise e aprove os relatórios de voo submetidos pelos pilotos
               </p>
            </div>

            {loading && (
               <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                     <svg
                        className="h-8 w-8 animate-spin text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                     </svg>
                  </div>
                  <p className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-xl font-semibold text-transparent">
                     Carregando PIREPs pendentes...
                  </p>
               </div>
            )}

            {error && (
               <div className="mb-8 rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-600/10 to-pink-600/10 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                     <svg
                        className="h-6 w-6 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                     </svg>
                  </div>
                  <p className="font-medium text-red-400">{error}</p>
               </div>
            )}

            {!loading && pireps.length === 0 && (
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
                     Nenhum PIREP pendente
                  </h3>
                  <p className="text-gray-400">
                     Todos os relatórios de voo foram processados.
                  </p>
               </div>
            )}

            {!loading && pireps.length > 0 && (
               <div className="space-y-8">
                  {pireps.map((pirep) => (
                     <div
                        key={pirep.id}
                        className="group relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                        <div className="relative p-8">
                           <div className="mb-8 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
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
                                 <div>
                                    <h3 className="text-2xl font-bold text-white">
                                       {pirep.userName}
                                    </h3>
                                    <p className="text-gray-400">
                                       ID: {pirep.userId}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-500/20 px-4 py-2">
                                 <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400"></div>
                                 <span className="font-medium text-yellow-400">
                                    Pendente
                                 </span>
                              </div>
                           </div>

                           <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                              <div className="space-y-4">
                                 <div className="rounded-2xl border border-blue-500/20 bg-blue-600/10 p-6">
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-400">
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
                                             d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                          />
                                       </svg>
                                       Tour
                                    </h4>
                                    <p className="font-medium text-gray-300">
                                       {pirep.tourTitle}
                                    </p>
                                 </div>

                                 <div className="rounded-2xl border border-purple-500/20 bg-purple-600/10 p-6">
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-purple-400">
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
                                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                          />
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                       </svg>
                                       Rota
                                    </h4>
                                    <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                                       <span className="text-white">
                                          {pirep.departureIcao}
                                       </span>
                                       <div className="flex items-center gap-2">
                                          <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
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
                                          <div className="h-px w-8 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                                       </div>
                                       <span className="text-white">
                                          {pirep.arrivalIcao}
                                       </span>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="rounded-2xl border border-indigo-500/20 bg-indigo-600/10 p-6">
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-indigo-400">
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
                                             d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14a1 1 0 001 1h12a1 1 0 001-1L17 4M9 9v6m4-6v6"
                                          />
                                       </svg>
                                       Callsign
                                    </h4>
                                    <p className="text-2xl font-bold text-white">
                                       {pirep.callsign}
                                    </p>
                                 </div>

                                 {pirep.comment && (
                                    <div className="rounded-2xl border border-gray-600/30 bg-gray-700/30 p-6">
                                       <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-300">
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
                                       </h4>
                                       <p className="leading-relaxed text-gray-300 italic">
                                          {pirep.comment}
                                       </p>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="rounded-2xl border border-gray-700/30 bg-gray-800/50 p-6">
                                 <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-300">
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
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                       />
                                    </svg>
                                    Comentário de Revisão (Opcional)
                                 </h4>
                                 <textarea
                                    className="w-full resize-none rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                                    rows={3}
                                    placeholder="Adicione comentários sobre a revisão..."
                                    value={reviewComments[pirep.id] || ''}
                                    onChange={(e) =>
                                       setReviewComments((prev) => ({
                                          ...prev,
                                          [pirep.id]: e.target.value,
                                       }))
                                    }
                                 />
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <button
                                    disabled={updatingId === pirep.id}
                                    onClick={() =>
                                       updateStatus(pirep.id, 'approved')
                                    }
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                 >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                       {updatingId === pirep.id ? (
                                          <svg
                                             className="h-5 w-5 animate-spin"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                             />
                                          </svg>
                                       ) : (
                                          <svg
                                             className="h-5 w-5"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                             />
                                          </svg>
                                       )}
                                       Aprovar PIREP
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                 </button>

                                 <button
                                    disabled={updatingId === pirep.id}
                                    onClick={() =>
                                       updateStatus(pirep.id, 'rejected')
                                    }
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:hover:scale-100"
                                 >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                       {updatingId === pirep.id ? (
                                          <svg
                                             className="h-5 w-5 animate-spin"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                             />
                                          </svg>
                                       ) : (
                                          <svg
                                             className="h-5 w-5"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                             />
                                          </svg>
                                       )}
                                       Reprovar PIREP
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                 </button>
                              </div>
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
