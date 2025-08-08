import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { isValidUrl } from '@/lib/utils';
import { authOptions } from '../api/auth/[...nextauth]/auth';
import { getTours } from '@/lib/db/queries';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (!session) {
      return <></>;
   }

   const tours = await getTours();

   return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6 py-10 text-white">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <section className="relative mb-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative space-y-8">
               <div className="inline-flex items-center gap-3 rounded-full border border-blue-800/40 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-6 py-3 backdrop-blur-sm">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium text-blue-300">
                     Sistema Online
                  </span>
               </div>

               <h1 className="animate-float bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                  Bem-vindo de volta, {session.user?.name}!
               </h1>

               <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
                  Descubra novos destinos e aventuras incríveis pelo mundo
                  através dos nossos tours exclusivos. Sua próxima jornada pelos
                  céus te espera.
               </p>

               <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/80 px-4 py-2">
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
                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                     </svg>
                     <span className="text-sm text-gray-300">
                        Conectado ao VATSIM
                     </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-800/50 bg-gray-950/80 px-4 py-2">
                     <svg
                        className="h-5 w-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                     </svg>
                     <span className="text-sm text-gray-300">Tours Ativos</span>
                  </div>
               </div>
            </div>
         </section>

         <section className="mb-20">
            <div className="mb-12 text-center">
               <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                  Novos Tours
               </h2>
               <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>

            {tours.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl"></div>
                     <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-600 bg-gray-800/50">
                        <svg
                           className="h-16 w-16 text-gray-500"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                           />
                        </svg>
                     </div>
                  </div>
                  <div className="max-w-md space-y-4 text-center">
                     <h3 className="text-2xl font-bold text-gray-300">
                        Nenhum tour disponível
                     </h3>
                     <p className="leading-relaxed text-gray-400">
                        No momento não há tours disponíveis. Novos destinos e
                        aventuras serão adicionados em breve!
                     </p>
                     <div className="pt-4">
                        <Link href="/tours">
                           <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-gray-600 hover:to-gray-500">
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                 />
                              </svg>
                              Verificar novamente
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-wrap justify-center gap-8">
                  {tours.slice(0, 4).map((tour, index) => (
                     <Link
                        href={`/tours/${tour.id}`}
                        className="group hover-lift block w-full max-w-sm"
                        key={index}
                     >
                        <div className="glass relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-950 to-black shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                           <div className="relative overflow-hidden">
                              {isValidUrl(tour.image) ? (
                                 <div className="relative">
                                    <Image
                                       src={`${tour.image}`}
                                       alt={tour.title}
                                       width={1000}
                                       height={1000}
                                       className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    <div className="absolute top-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
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
                                 </div>
                              ) : (
                                 <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <div className="animate-pulse-slow text-center">
                                       <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                                          <svg
                                             className="h-6 w-6 text-gray-500"
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
                                       <p className="text-sm text-gray-400">
                                          Imagem inválida
                                       </p>
                                    </div>
                                 </div>
                              )}
                           </div>

                           <div className="relative p-6">
                              <div className="mb-3 flex items-start justify-between">
                                 <h3 className="line-clamp-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                    {tour.title}
                                 </h3>
                                 <div className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                                 </div>
                              </div>

                              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
                                 {tour.description}
                              </p>

                              <div className="flex items-center justify-between">
                                 <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400">
                                    Disponível
                                 </span>
                                 <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-blue-400">
                                    Ver detalhes →
                                 </span>
                              </div>
                           </div>

                           <div className="absolute inset-0 -z-10 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                     </Link>
                  ))}
               </div>
            )}
         </section>
         <section className="relative text-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl"></div>
            <div className="relative space-y-8 rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm">
               <div className="space-y-4">
                  <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                     Pronto para seu próximo voo?
                  </h2>
                  <p className="mx-auto max-w-lg text-gray-300">
                     Escolha um tour e comece agora mesmo a sua jornada pelos
                     céus e descubra destinos incríveis.
                  </p>
               </div>
               <Link href="/tours">
                  <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                     <span className="relative z-10 flex items-center justify-center gap-2">
                        Explorar Tours
                        <svg
                           className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
               </Link>
            </div>
         </section>
      </div>
   );
}
