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
         if (!res.ok) throw new Error('Falha ao carregar dados');
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

         if (!res.ok) throw new Error('Falha ao atualizar status');
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
      <div className="min-w-screen min-h-screen max-w-4xl mx-auto p-6 bg-gray-900 text-white">
         <h2 className="text-3xl font-bold mb-6 text-center">
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
                  className="border border-gray-700 rounded-xl p-6 bg-gray-800 shadow-lg space-y-4"
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
                     className="w-full mt-4 p-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
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

                  <div className="flex gap-4 mt-4">
                     <button
                        disabled={updatingId === pirep.id}
                        onClick={() => updateStatus(pirep.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded disabled:opacity-50 transition"
                     >
                        ✅ Aprovar
                     </button>
                     <button
                        disabled={updatingId === pirep.id}
                        onClick={() => updateStatus(pirep.id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded disabled:opacity-50 transition"
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
