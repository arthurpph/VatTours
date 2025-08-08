import { db } from '@/lib/db';
import { toursTable } from '@/lib/db/schema';
import { isValidUrl } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Status from '@/components/ui/Status';

type Props = {
   tourId: string;
};

export default async function TourInfo({ tourId }: Props) {
   const tour = await db.query.toursTable.findFirst({
      where: eq(toursTable.id, Number(tourId)),
   });

   if (!tour) {
      return (
         <div className="flex min-h-screen items-center justify-center px-4">
            <div className="space-y-6 text-center">
               <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500">
                  <svg
                     className="h-12 w-12 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                     />
                  </svg>
               </div>
               <h2 className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
                  Tour não encontrado
               </h2>
               <p className="max-w-md text-gray-400">
                  O tour que você está procurando não existe ou foi removido.
               </p>
            </div>
         </div>
      );
   }

   return (
      <section className="relative w-full">
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gradient-to-br from-purple-600/10 to-indigo-600/10 blur-3xl"></div>
         </div>

         <div className="relative mx-auto max-w-7xl px-4 py-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
               <div className="group relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="relative overflow-hidden rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-950/80 to-black/80 backdrop-blur-sm">
                     {isValidUrl(tour.image) ? (
                        <Image
                           src={tour.image}
                           alt={tour.title}
                           width={1000}
                           height={1000}
                           className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                           style={{ maxHeight: '600px', height: '100%' }}
                           priority
                        />
                     ) : (
                        <div className="flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black sm:h-[400px] lg:h-[600px]">
                           <div className="space-y-4 text-center">
                              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
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
                              <p className="font-medium text-gray-500">
                                 Imagem não disponível
                              </p>
                           </div>
                        </div>
                     )}

                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
               </div>

               <div className="flex flex-col justify-center space-y-10">
                  <div className="space-y-6">
                     <h1 className="animate-float bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl leading-tight font-bold text-transparent sm:text-6xl lg:text-7xl">
                        {tour.title}
                     </h1>

                     <div className="flex items-center gap-4">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <Status type="online" label="Tour Ativo" pulse />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <p className="text-xl leading-relaxed font-light text-gray-300 sm:text-2xl lg:text-3xl">
                        {tour.description}
                     </p>

                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="group hover-lift border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-blue-700/10 p-4">
                           <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
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
                              </div>
                              <span className="font-semibold text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                                 Status
                              </span>
                           </div>
                           <p className="font-medium text-gray-300">
                              Tour Ativo
                           </p>
                           <p className="mt-1 text-sm text-gray-400">
                              Pronto para participar
                           </p>
                        </Card>

                        <Card className="group hover-lift border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-purple-700/10 p-4">
                           <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                                 <svg
                                    className="h-5 w-5 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                 </svg>
                              </div>
                              <span className="font-semibold text-purple-400 transition-colors duration-300 group-hover:text-purple-300">
                                 Duração
                              </span>
                           </div>
                           <p className="font-medium text-gray-300">Flexível</p>
                           <p className="mt-1 text-sm text-gray-400">
                              Voe no seu ritmo
                           </p>
                        </Card>

                        <Card className="group hover-lift border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-emerald-700/10 p-4 sm:col-span-2 lg:col-span-1">
                           <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                 <svg
                                    className="h-5 w-5 text-emerald-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                 </svg>
                              </div>
                              <span className="font-semibold text-emerald-400 transition-colors duration-300 group-hover:text-emerald-300">
                                 Tipo
                              </span>
                           </div>
                           <p className="font-medium text-gray-300">
                              Tour Guiado
                           </p>
                           <p className="mt-1 text-sm text-gray-400">
                              Experiência completa
                           </p>
                        </Card>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-200">
                           Recursos Inclusos
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                           {[
                              {
                                 icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                                 text: 'Rotas detalhadas',
                              },
                              {
                                 icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                                 text: 'Pontos de interesse',
                              },
                              {
                                 icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                 text: 'Informações técnicas',
                              },
                              {
                                 icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364',
                                 text: 'Suporte completo',
                              },
                           ].map((item, index) => (
                              <div
                                 key={index}
                                 className="flex items-center gap-3 rounded-lg border border-gray-800/30 bg-gray-950/50 p-3 transition-all duration-300 hover:border-blue-500/30 hover:bg-gray-900/50"
                              >
                                 <svg
                                    className="h-5 w-5 flex-shrink-0 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d={item.icon}
                                    />
                                 </svg>
                                 <span className="text-gray-300">
                                    {item.text}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
