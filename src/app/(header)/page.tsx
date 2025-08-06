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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 px-6 py-10 text-white">
         <section className="relative mb-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative space-y-6">
               <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                  Bem-vindo de volta, {session.user?.name}!
               </h1>
               <p className="mx-auto max-w-2xl text-lg text-gray-300">
                  Descubra novos destinos e aventuras incríveis pelo mundo
                  através dos nossos tours exclusivos.
               </p>
            </div>
         </section>

         <section className="mb-20">
            <div className="mb-12 text-center">
               <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                  Novos Tours
               </h2>
               <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
               {tours.slice(0, 4).map((tour, index) => (
                  <Link
                     href={`/tours/${tour.id}`}
                     className="group block w-full max-w-sm"
                     key={index}
                  >
                     <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                        <div className="relative overflow-hidden">
                           {isValidUrl(tour.image) ? (
                              <Image
                                 src={`${tour.image}`}
                                 alt={tour.title}
                                 width={1000}
                                 height={1000}
                                 className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                           ) : (
                              <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                                 <div className="text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600">
                                       <svg
                                          className="h-6 w-6 text-gray-400"
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
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>

                        <div className="p-6">
                           <h3 className="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                              {tour.title}
                           </h3>
                           <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                              {tour.description}
                           </p>
                        </div>

                        <div className="absolute inset-0 -z-10 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     </div>
                  </Link>
               ))}
            </div>
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
