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
      <main className="bg-gray-900 min-h-screen px-6 py-12">
         <div className="max-w-5xl mx-auto mb-14 text-center px-4">
            <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight">
               Olá, {session.user?.name}
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
               Segue abaixo todos os nossos tours disponíveis para você explorar
               e aproveitar ao máximo sua experiência de voo.
            </p>
         </div>

         <section
            className={`max-w-7xl mx-auto grid gap-10 px-4 ${
               tours.length === 1
                  ? 'grid-cols-1 place-items-center'
                  : 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
            }`}
         >
            {tours.length === 0 ? (
               <p className="text-gray-400 text-center mt-12 text-lg">
                  Nenhum tour disponível no momento.
               </p>
            ) : (
               tours.map((tour, index) => (
                  <Link
                     key={index}
                     href={`/tours/${tour.id}`}
                     className="group transform transition-transform hover:scale-[1.03] hover:shadow-2xl duration-300 max-w-md w-full mx-auto"
                  >
                     <article className="bg-gray-800 rounded-3xl shadow-lg flex flex-col overflow-hidden h-full">
                        <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-lg group transition-transform duration-300 group-hover:scale-[1.02]">
                           {isValidUrl(tour.image) ? (
                              <Image
                                 src={tour.image}
                                 alt={tour.title}
                                 fill
                                 sizes="(max-width: 640px) 100vw, 280px"
                                 className="object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                              />
                           ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                 <p className="text-gray-400 select-none">
                                    Imagem inválida
                                 </p>
                              </div>
                           )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                           <h2 className="text-2xl font-bold text-white mb-2 truncate">
                              {tour.title}
                           </h2>
                           <p className="text-gray-400 text-sm flex-grow leading-relaxed">
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
