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
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-8">
               <div className="text-center">
                  <h1 className="mb-4 text-3xl font-semibold text-[#f0f6fc]">
                     Bem-vindo de volta, {session.user?.name}!
                  </h1>
                  <p className="mx-auto max-w-2xl text-lg text-[#7d8590]">
                     Descubra novos destinos e aventuras incríveis pelo mundo
                     através dos nossos tours exclusivos. Sua próxima jornada
                     pelos céus te espera.
                  </p>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8">
               <h2 className="mb-2 text-xl font-semibold text-[#f0f6fc]">
                  Tours Recentes
               </h2>
               <p className="text-[#7d8590]">
                  Explore nossa coleção de tours disponíveis
               </p>
            </div>

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
                           d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                     </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-[#f0f6fc]">
                     Nenhum tour disponível ainda
                  </h3>
                  <p className="mb-6 text-[#7d8590]">
                     No momento não há tours disponíveis. Novos destinos e
                     aventuras serão adicionados em breve!
                  </p>
                  <Link
                     href="/tours"
                     className="inline-flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea043]"
                  >
                     <svg
                        className="h-4 w-4"
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
                  </Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tours.slice(0, 8).map((tour) => (
                     <div
                        key={tour.id}
                        className="rounded-md border border-[#21262d] bg-[#0d1117] p-4 transition-colors hover:bg-[#161b22]"
                     >
                        <Link href={`/tours/${tour.id}`} className="block">
                           <div className="mb-3">
                              {isValidUrl(tour.image) ? (
                                 <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    width={300}
                                    height={200}
                                    className="h-32 w-full rounded-md object-cover"
                                 />
                              ) : (
                                 <div className="flex h-32 w-full items-center justify-center rounded-md bg-[#21262d]">
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

                           <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-[#2f81f7] hover:underline">
                                 {tour.title}
                              </h3>
                              <p className="line-clamp-2 text-sm text-[#7d8590]">
                                 {tour.description}
                              </p>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            )}

            {tours.length > 0 && (
               <div className="mt-8 text-center">
                  <Link
                     href="/tours"
                     className="inline-flex items-center gap-2 rounded-md border border-[#21262d] bg-[#21262d] px-4 py-2 text-sm text-[#f0f6fc] transition-colors hover:bg-[#30363d]"
                  >
                     Ver todos os tours
                     <svg
                        className="h-4 w-4"
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
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
}
