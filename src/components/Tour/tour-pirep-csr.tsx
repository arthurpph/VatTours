'use client';

import { PUBLIC_API_ROUTES } from '@/config/api-routes';
import { Leg } from '@/models/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

   const handleCallsignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const limit = 7;
      if (e.target.value.length > limit) {
         setError(
            `O indicativo de chamada não pode exceder ${limit} caracteres.`,
         );
         return;
      }
      setCallsign(e.target.value);
      setError(null);
   };

   const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const limit = 100;
      if (e.target.value.length > limit) {
         setError(`O comentário não pode exceder ${limit} caracteres.`);
         return;
      }
      setComment(e.target.value);
      setError(null);
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
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2f81f7]/20">
               <FileText className="h-5 w-5 text-[#2f81f7]" />
            </div>
            <div>
               <h2 className="text-xl font-semibold text-[#f0f6fc]">PIREP</h2>
               <p className="text-sm text-[#7d8590]">
                  Envie seu relatório de voo
               </p>
            </div>
         </div>

         <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
            <div className="flex items-center justify-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-[#f0f6fc]">
                     {leg.departureIcao}
                  </span>
               </div>

               <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-[#2a3038]"></div>
               </div>

               <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-[#f0f6fc]">
                     {leg.arrivalIcao}
                  </span>
               </div>
            </div>
         </div>

         <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
            <div className="space-y-4">
               <div>
                  <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                     Indicativo de chamada
                  </label>
                  <input
                     type="text"
                     placeholder="Ex: UAE406"
                     value={callsign}
                     onChange={handleCallsignChange}
                     className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-[#7d8590]">
                     Máximo 7 caracteres
                  </p>
               </div>

               <div>
                  <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                     Comentário (opcional)
                  </label>
                  <textarea
                     value={comment}
                     onChange={handleCommentChange}
                     rows={4}
                     placeholder="Adicione observações sobre o voo..."
                     className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-[#7d8590]">
                     {comment.length}/100 caracteres
                  </p>
               </div>

               {success && (
                  <div className="flex items-center gap-2 rounded-md border border-[#238636]/30 bg-[#238636]/20 p-3">
                     <CheckCircle className="h-4 w-4 text-[#238636]" />
                     <p className="text-sm font-medium text-[#238636]">
                        PIREP enviado com sucesso!
                     </p>
                  </div>
               )}

               {error && (
                  <div className="flex items-center gap-2 rounded-md border border-[#da3633]/30 bg-[#da3633]/20 p-3">
                     <AlertCircle className="h-4 w-4 text-[#da3633]" />
                     <p className="text-sm font-medium text-[#da3633]">
                        {error}
                     </p>
                  </div>
               )}

               <div className="pt-4">
                  <button
                     disabled={isSubmitting || !callsign.trim()}
                     onClick={handleSubmit}
                     className="flex w-full items-center justify-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea043] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin" />
                           Enviando...
                        </>
                     ) : (
                        <>
                           <FileText className="h-4 w-4" />
                           Enviar PIREP
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
