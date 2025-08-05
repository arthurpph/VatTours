'use client';

import { PUBLIC_API_ROUTES } from '@/config/api-routes';
import { Leg } from '@/models/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
   leg: Leg;
};

export default function TourPirepClientSide({ leg }: Props) {
   const router = useRouter();

   const [callsign, setCallsign] = useState('');
   const [comment, setComment] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const limit = 100;
      if (e.target.value.length > limit) {
         setError(`O comentário não pode exceder ${limit} caracteres.`);
         return;
      }
      setComment(e.target.value);
   };

   const handleSubmit = async () => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      if (!callsign.trim()) {
         setError('Você precisa informar o indicativo de chamada.');
         setIsSubmitting(false);
         return;
      }

      const res = await fetch(PUBLIC_API_ROUTES.pireps, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            tourId: leg.tourId,
            callsign,
            comment,
         }),
      });

      if (res.ok) {
         setSuccess(true);
         setCallsign('');
         setComment('');
         router.push(`/tours/${leg.tourId}?action=status`);
      } else {
         setError('Erro ao enviar PIREP.');
      }

      setIsSubmitting(false);
   };

   return (
      <section className="w-full px-4 py-8 text-gray-100 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-3xl space-y-6">
            {/* Título fora do quadrado */}
            <h2 className="text-center text-3xl font-bold">PIREP</h2>

            {/* Info ICAO fora do quadrado */}
            <div className="text-center text-lg font-medium">
               <span className="text-white">{leg.departureIcao}</span>
               <span className="mx-2 text-gray-400">→</span>
               <span className="text-white">{leg.arrivalIcao}</span>
            </div>

            {/* Quadrado somente para inputs */}
            <div className="space-y-5 rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-xl sm:p-8">
               <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-300">
                     Indicativo de chamada
                  </label>
                  <input
                     type="text"
                     placeholder="Ex: UAE406"
                     value={callsign}
                     onChange={(e) => setCallsign(e.target.value)}
                     className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
               </div>

               <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-300">
                     Comentário (opcional)
                  </label>
                  <textarea
                     value={comment}
                     onChange={handleCommentChange}
                     className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                     rows={4}
                  />
               </div>

               {success && (
                  <p className="text-center text-sm font-medium text-green-400">
                     ✅ PIREP enviado com sucesso!
                  </p>
               )}
               {error && (
                  <p className="text-center text-sm font-medium text-red-400">
                     ⚠️ {error}
                  </p>
               )}

               <div className="flex justify-center pt-4">
                  <button
                     disabled={isSubmitting || !callsign.trim()}
                     onClick={handleSubmit}
                     className={`rounded-lg bg-indigo-600 px-6 py-2 font-semibold shadow transition-colors duration-300 hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 ${
                        !isSubmitting && 'cursor-pointer'
                     }`}
                  >
                     {isSubmitting ? 'Enviando...' : 'Enviar PIREP'}
                  </button>
               </div>
            </div>
         </div>
      </section>
   );
}
