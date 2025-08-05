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
      <div className="mx-auto min-h-screen max-w-4xl min-w-screen bg-gray-900 p-6 text-white">
         <h2 className="mb-6 text-center text-3xl font-bold">
            ✈️ Aprovação de Pernas
         </h2>

         {loading && (
            <p className="text-center text-gray-400">
               Carregando PIREPs pendentes...
            </p>
         )}
         {error && <p className="text-center text-red-500">{error}</p>}

         {!loading && pireps.length === 0 && (
            <p className="text-center text-gray-400">
               Nenhum PIREP pendente no momento.
            </p>
         )}

         <ul className="space-y-6">
            {pireps.map((pirep) => (
               <li
                  key={pirep.id}
                  className="space-y-4 rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg"
               >
                  <div className="space-y-1">
                     <p>
                        👤 <strong>Usuário:</strong> {pirep.userName} (
                        {pirep.userId})
                     </p>
                     <p>
                        📘 <strong>Tour:</strong> {pirep.tourTitle}
                     </p>
                     <p>
                        🛫 <strong>Perna:</strong> {pirep.departureIcao} →{' '}
                        {pirep.arrivalIcao}
                     </p>
                     <p>
                        📡 <strong>Callsign:</strong> {pirep.callsign}
                     </p>
                     {pirep.comment && (
                        <p>
                           💬 <strong>Comentário do piloto:</strong>{' '}
                           {pirep.comment}
                        </p>
                     )}
                  </div>

                  <textarea
                     className="mt-4 w-full rounded border border-gray-600 bg-gray-700 p-2 text-sm text-white"
                     rows={2}
                     placeholder="Comentário (opcional)"
                     value={reviewComments[pirep.id] || ''}
                     onChange={(e) =>
                        setReviewComments((prev) => ({
                           ...prev,
                           [pirep.id]: e.target.value,
                        }))
                     }
                  />

                  <div className="mt-4 flex gap-4">
                     <button
                        disabled={updatingId === pirep.id}
                        onClick={() => updateStatus(pirep.id, 'approved')}
                        className="flex-1 rounded bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                     >
                        ✅ Aprovar
                     </button>
                     <button
                        disabled={updatingId === pirep.id}
                        onClick={() => updateStatus(pirep.id, 'rejected')}
                        className="flex-1 rounded bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                     >
                        ❌ Reprovar
                     </button>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
}
