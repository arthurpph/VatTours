'use client';

import { PUBLIC_API_ROUTES } from '@/config/api-routes';
import { Leg } from '@/models/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
   userId: string;
   leg: Leg;
};

export default function TourPirepClientSide({ userId, leg }: Props) {
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
            userId,
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
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8 text-gray-100">
         <div className="max-w-3xl mx-auto space-y-6">
            {/* Título fora do quadrado */}
            <h2 className="text-3xl font-bold text-center">PIREP</h2>

            {/* Info ICAO fora do quadrado */}
            <div className="text-center text-lg font-medium">
               <span className="text-white">{leg.departureIcao}</span>
               <span className="mx-2 text-gray-400">→</span>
               <span className="text-white">{leg.arrivalIcao}</span>
            </div>

            {/* Quadrado somente para inputs */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 sm:p-8 space-y-5">
               <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">
                     Indicativo de chamada
                  </label>
                  <input
                     type="text"
                     placeholder="Ex: UAE406"
                     value={callsign}
                     onChange={(e) => setCallsign(e.target.value)}
                     className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">
                     Comentário (opcional)
                  </label>
                  <textarea
                     value={comment}
                     onChange={handleCommentChange}
                     className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                     rows={4}
                  />
               </div>

               {success && (
                  <p className="text-green-400 text-center text-sm font-medium">
                     ✅ PIREP enviado com sucesso!
                  </p>
               )}
               {error && (
                  <p className="text-red-400 text-center text-sm font-medium">
                     ⚠️ {error}
                  </p>
               )}

               <div className="pt-4 flex justify-center">
                  <button
                     disabled={isSubmitting || !callsign.trim()}
                     onClick={handleSubmit}
                     className={`bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 px-6 py-2 rounded-lg font-semibold shadow hover:shadow-lg disabled:opacity-50 ${
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
