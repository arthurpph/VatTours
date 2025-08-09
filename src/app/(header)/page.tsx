import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { isValidUrl } from '@/lib/utils';
import { authOptions } from '../api/auth/[...nextauth]/auth';
import { getTours } from '@/lib/db/queries';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Status from '@/components/ui/Status';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (!session) {
      return <></>;
   }

   const tours = await getTours();

   return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6 py-10 text-white">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-float-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div
               className="animate-float-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl"
               style={{ animationDelay: '2s' }}
            ></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <section className="relative mb-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="animate-fade-in-up relative space-y-8">
               <h1 className="animate-float bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text py-2 text-5xl leading-tight font-bold text-transparent md:text-6xl">
                  Bem-vindo de volta, {session.user?.name}!
               </h1>

               <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
                  Descubra novos destinos e aventuras incríveis pelo mundo
                  através dos nossos tours exclusivos. Sua próxima jornada pelos
                  céus te espera.
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
                           <Button variant="secondary" size="lg">
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
                           </Button>
                        </Link>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tours.slice(0, 4).map((tour, index) => (
                     <Link
                        href={`/tours/${tour.id}`}
                        className="block h-full w-full max-w-sm"
                        key={index}
                     >
                        <Card
                           hoverable
                           className="group animate-fade-in-up hover-lift-lg flex h-full flex-col overflow-hidden"
                           style={{ animationDelay: `${index * 0.1}s` }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                           <div className="relative overflow-hidden rounded-xl">
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

                           <div className="relative flex flex-1 flex-col p-6">
                              <div className="mb-3 flex items-start justify-between">
                                 <h3 className="line-clamp-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                    {tour.title}
                                 </h3>
                                 <Status type="online" label="" />
                              </div>

                              <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
                                 {tour.description}
                              </p>

                              <div className="mt-auto flex items-center justify-between border-t border-gray-800/30 pt-3">
                                 <Status type="online" label="Disponível" />
                                 <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-blue-400">
                                    Ver detalhes →
                                 </span>
                              </div>
                           </div>
                        </Card>
                     </Link>
                  ))}
               </div>
            )}
         </section>
         <section className="relative text-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl"></div>
            <Card className="animate-scale-in relative space-y-8 text-center">
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
                  <Button variant="primary" size="lg">
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
                  </Button>
               </Link>
            </Card>
         </section>
      </div>
   );
}
