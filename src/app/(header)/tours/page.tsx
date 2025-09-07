'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loading from '@/components/ui/Loading';
import { isValidBase64Image } from '@/lib/utils';

interface Tour {
   id: string;
   title: string;
   description: string;
   image: string;
}

export default function ToursPage() {
   const { data: session, status } = useSession();
   const [tours, setTours] = useState<Tour[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchTours = async () => {
         try {
            const response = await fetch('/api/tours');
            const data = await response.json();
            setTours(data);
         } catch (error) {
            console.error('Error fetching tours:', error);
         } finally {
            setLoading(false);
         }
      };

      if (status === 'authenticated') {
         fetchTours();
      }
   }, [status]);

   if (status === 'loading' || loading) {
      return <Loading fullScreen text="Carregando tours..." />;
   }

   if (status === 'unauthenticated') {
      return <></>;
   }

   const handleRefresh = () => {
      setLoading(true);
      const fetchTours = async () => {
         try {
            const response = await fetch('/api/tours');
            const data = await response.json();
            setTours(data);
         } catch (error) {
            console.error('Error fetching tours:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchTours();
   };

   return (
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-6">
               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21262d]">
                        <svg
                           className="h-5 w-5 text-[#7d8590]"
                           fill="currentColor"
                           viewBox="0 0 16 16"
                        >
                           <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z" />
                        </svg>
                     </div>
                     <div>
                        <h1 className="text-xl font-semibold text-[#f0f6fc]">
                           Tours
                        </h1>
                        <p className="text-sm text-[#7d8590]">
                           Bem-vindo, {session?.user?.name}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 rounded-md border border-[#21262d] bg-[#21262d] px-3 py-1.5 text-sm">
                        <span className="font-semibold text-[#f0f6fc]">
                           {tours.length}
                        </span>
                        <span className="text-[#7d8590]">
                           {tours.length === 1 ? 'tour' : 'tours'}
                        </span>
                     </div>
                     <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-[#21262d] bg-[#21262d] px-3 py-1.5 text-sm text-[#f0f6fc] transition-colors hover:bg-[#30363d] disabled:opacity-50"
                     >
                        <svg
                           className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
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
                        Atualizar
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            {tours.length === 0 ? (
               <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#21262d]">
                     <svg
                        className="h-6 w-6 text-[#7d8590]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                     </svg>
                  </div>
                  <h2 className="mb-3 text-xl font-semibold text-[#f0f6fc]">
                     Nenhum tour disponível ainda
                  </h2>
                  <p className="mb-6 text-[#7d8590]">
                     Não há tours disponíveis no momento. Verifique novamente
                     mais tarde.
                  </p>
                  <div className="flex justify-center gap-3">
                     <Link
                        href="/"
                        className="rounded-md border border-[#21262d] bg-[#21262d] px-3 py-1.5 text-sm text-[#f0f6fc] transition-colors hover:bg-[#30363d]"
                     >
                        Voltar ao início
                     </Link>
                     <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="rounded-md bg-[#238636] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2ea043] disabled:opacity-50"
                     >
                        Atualizar
                     </button>
                  </div>
               </div>
            ) : (
               <div className="space-y-4">
                  {tours.map((tour) => (
                     <div
                        key={tour.id}
                        className="rounded-md border border-[#21262d] bg-[#0d1117] p-4 transition-colors hover:bg-[#161b22]"
                     >
                        <Link href={`/tours/${tour.id}`} className="block">
                           <div className="flex items-start gap-4">
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#21262d]">
                                 {tour.image &&
                                 isValidBase64Image(tour.image) ? (
                                    <Image
                                       src={`data:image/jpeg;base64,${tour.image}`}
                                       alt={tour.title}
                                       fill
                                       className="object-cover"
                                    />
                                 ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-[#21262d]">
                                       <svg
                                          className="h-8 w-8 text-[#7d8590]"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                       >
                                          <path
                                             fillRule="evenodd"
                                             d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                    </div>
                                 )}
                              </div>

                              <div className="min-w-0 flex-1">
                                 <h3 className="text-lg font-semibold text-[#2f81f7] hover:underline">
                                    {tour.title}
                                 </h3>

                                 <p className="mt-1 line-clamp-2 text-sm text-[#7d8590]">
                                    {tour.description}
                                 </p>
                              </div>

                              <div className="flex-shrink-0">
                                 <svg
                                    className="h-4 w-4 text-[#7d8590]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M9 5l7 7-7 7"
                                    />
                                 </svg>
                              </div>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
