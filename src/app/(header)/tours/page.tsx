import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { isValidUrl } from '@/lib/utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getTours } from '@/lib/db/queries';

export default async function ToursPage() {
   const session = await getServerSession(authOptions);
   const tours = await getTours();

   if (!session) {
      return <></>;
   }

   return (
      <main className="min-h-screen bg-gray-900 px-6 py-12">
         <div className="mx-auto mb-14 max-w-5xl px-4 text-center">
            <h1 className="mb-3 text-5xl leading-tight font-extrabold text-white">
               Olá, {session.user?.name}
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-400">
               Segue abaixo todos os nossos tours disponíveis para você explorar
               e aproveitar ao máximo sua experiência de voo.
            </p>
         </div>

         <section
            className={`mx-auto grid max-w-7xl gap-10 px-4 ${
               tours.length === 1
                  ? 'grid-cols-1 place-items-center'
                  : 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
            }`}
         >
            {tours.length === 0 ? (
               <p className="mt-12 text-center text-lg text-gray-400">
                  Nenhum tour disponível no momento.
               </p>
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
