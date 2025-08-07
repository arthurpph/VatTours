'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { isValidUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';

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
      return (
         <main className="min-h-screen bg-gray-900 px-6 py-12 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
               <p className="text-gray-400">Carregando tours...</p>
            </div>
         </main>
      );
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
      <main className="min-h-screen bg-gray-900 px-6 py-12">
         <div className="mx-auto mb-14 max-w-5xl px-4 text-center">
            <h1 className="mb-3 text-5xl leading-tight font-extrabold text-white">
               Olá, {session?.user?.name}
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-400">
               Segue abaixo todos os nossos tours disponíveis para você explorar
               e aproveitar ao máximo sua experiência de voo.
            </p>
         </div>

         <section
            className={`mx-auto max-w-7xl px-4 ${
               tours.length === 0 
                  ? 'flex justify-center' 
                  : tours.length === 1
                  ? 'grid grid-cols-1 place-items-center gap-10'
                  : 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10'
            }`}
         >
            {tours.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative mb-12">
                     <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
                     <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-gray-600 bg-gray-800/50">
                        <svg
                           className="h-20 w-20 text-gray-500"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                           />
                        </svg>
                     </div>
                  </div>
                  <div className="text-center space-y-6 max-w-lg">
                     <h2 className="text-3xl font-bold text-gray-200">
                        Nenhum tour disponível
                     </h2>
                     <p className="text-gray-400 leading-relaxed text-lg">
                        Atualmente não há tours disponíveis. Nossa equipe está trabalhando para trazer novas aventuras e destinos incríveis para você explorar!
                     </p>
                     <div className="space-y-4 pt-6">
                        <Link href="/">
                           <button className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                 />
                              </svg>
                              Voltar ao início
                           </button>
                        </Link>
                        <div>
                           <button 
                              onClick={handleRefresh}
                              disabled={loading}
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-gray-600 hover:to-gray-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <svg
                                 className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
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
                              {loading ? 'Atualizando...' : 'Atualizar página'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               tours.map((tour, index) => (
                  <Link
                     key={index}
                     href={`/tours/${tour.id}`}
                     className="group mx-auto w-full max-w-md transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl"
                  >
                     <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-gray-800 shadow-lg">
                        <div className="group relative h-64 w-full overflow-hidden rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                           {isValidUrl(tour.image) ? (
                              <Image
                                 src={tour.image}
                                 alt={tour.title}
                                 fill
                                 sizes="(max-width: 640px) 100vw, 280px"
                                 className="h-full w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                              />
                           ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-700">
                                 <p className="text-gray-400 select-none">
                                    Imagem inválida
                                 </p>
                              </div>
                           )}
                        </div>
                        <div className="flex flex-grow flex-col p-6">
                           <h2 className="mb-2 truncate text-2xl font-bold text-white">
                              {tour.title}
                           </h2>
                           <p className="flex-grow text-sm leading-relaxed text-gray-400">
                              {tour.description}
                           </p>
                        </div>
                     </article>
                  </Link>
               ))
            )}
         </section>
      </main>
   );
}
