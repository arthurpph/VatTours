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
         <main className="flex min-h-screen items-center justify-center bg-gray-900 px-6 py-12">
            <div className="text-center">
               <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
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
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
         </div>

         <div className="relative px-6 py-12">
            <div className="mx-auto mb-16 max-w-5xl px-4 text-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 rounded-full border border-blue-800/40 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-6 py-3 backdrop-blur-sm">
                     <svg
                        className="h-5 w-5 text-blue-400"
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
                     <span className="text-sm font-medium text-blue-300">
                        Catálogo de Tours
                     </span>
                  </div>

                  <h1 className="animate-float text-5xl leading-tight font-extrabold text-white">
                     Olá,{' '}
                     <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        {session?.user?.name}
                     </span>
                  </h1>

                  <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400">
                     Explore nossa coleção completa de tours de voo. Cada
                     jornada foi cuidadosamente planejada para oferecer uma
                     experiência única e inesquecível pelos céus do mundo.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                     <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/80 px-4 py-2">
                        <span className="text-2xl font-bold text-blue-400">
                           {tours.length}
                        </span>
                        <span className="text-sm text-gray-300">
                           {tours.length === 1
                              ? 'Tour Disponível'
                              : 'Tours Disponíveis'}
                        </span>
                     </div>
                     <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/80 px-4 py-2 transition-all duration-300 hover:bg-gray-900/80 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        <svg
                           className={`h-4 w-4 text-blue-400 ${loading ? 'animate-spin' : ''}`}
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
                        <span className="text-sm text-gray-300">
                           {loading ? 'Atualizando...' : 'Atualizar'}
                        </span>
                     </button>
                  </div>
               </div>
            </div>

            <section
               className={`mx-auto max-w-7xl px-4 ${
                  tours.length === 0
                     ? 'flex justify-center'
                     : tours.length === 1
                       ? 'grid grid-cols-1 place-items-center gap-10'
                       : 'grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8'
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
                     <div className="max-w-lg space-y-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-200">
                           Nenhum tour disponível
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-400">
                           Atualmente não há tours disponíveis. Nossa equipe
                           está trabalhando para trazer novas aventuras e
                           destinos incríveis para você explorar!
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
                                 className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-gray-600 hover:to-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                                 {loading
                                    ? 'Atualizando...'
                                    : 'Atualizar página'}
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
                        className="group hover-lift mx-auto w-full max-w-md transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                     >
                        <article className="glass flex h-full flex-col overflow-hidden rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-950 to-black shadow-xl">
                           <div className="group relative h-64 w-full overflow-hidden rounded-t-3xl">
                              {isValidUrl(tour.image) ? (
                                 <div className="relative h-full">
                                    <Image
                                       src={tour.image}
                                       alt={tour.title}
                                       fill
                                       sizes="(max-width: 640px) 100vw, 320px"
                                       className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    <div className="absolute top-3 right-3 translate-x-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                       <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                                          <svg
                                             className="h-5 w-5 text-white"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                             />
                                          </svg>
                                       </div>
                                    </div>

                                    <div className="absolute bottom-3 left-3 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                       <div className="rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 backdrop-blur-sm">
                                          <div className="flex items-center gap-2">
                                             <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                                             <span className="text-xs font-medium text-green-300">
                                                Ativo
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <div className="animate-pulse-slow text-center">
                                       <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                                          <svg
                                             className="h-8 w-8 text-gray-500"
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
                                       <p className="text-sm font-medium text-gray-400">
                                          Imagem indisponível
                                       </p>
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-grow flex-col p-6">
                              <div className="mb-3 flex items-start justify-between">
                                 <h2 className="line-clamp-2 flex-1 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                    {tour.title}
                                 </h2>
                                 <div className="ml-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                 </div>
                              </div>

                              <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-400">
                                 {tour.description}
                              </p>

                              <div className="flex items-center justify-between border-t border-gray-800/50 pt-2">
                                 <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                                    Disponível
                                 </span>
                                 <span className="flex items-center gap-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-blue-400">
                                    Explorar
                                    <svg
                                       className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-1"
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                                       />
                                    </svg>
                                 </span>
                              </div>
                           </div>
                        </article>
                     </Link>
                  ))
               )}
            </section>
         </div>
      </main>
   );
}
