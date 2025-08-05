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
      <div className="min-h-screen space-y-16 bg-gray-900 px-6 py-10 text-white">
         <section className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">
               Bem-vindo de volta, {session.user?.name}!
            </h1>
            <p className="text-gray-400">
               Descubra novos destinos e aventuras incríveis pelo mundo.
            </p>
         </section>

         <section className="text-center">
            <h2 className="mb-6 text-2xl font-semibold">🌍 Novos Tours</h2>
            <div className="flex flex-wrap justify-center">
               {tours.slice(0, 4).map((tour, index) => (
                  <Link
                     href={`/tours/${tour.id}`}
                     className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4"
                     key={index}
                  >
                     <div className="transform overflow-hidden rounded-t-2xl rounded-b-md bg-gray-800 shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl">
                        {isValidUrl(tour.image) ? (
                           <Image
                              src={`${tour.image}`}
                              alt={tour.title}
                              width={1000}
                              height={1000}
                              className="h-70 w-full object-cover transition-transform duration-300 hover:scale-105"
                           />
                        ) : (
                           <div className="flex h-70 w-full items-center justify-center bg-gray-700">
                              <p className="text-gray-400">Imagem inválida</p>
                           </div>
                        )}
                        <div className="p-4">
                           <h3 className="text-xl font-bold">{tour.title}</h3>
                           <p className="mt-1 text-sm text-gray-400">
                              {tour.description}
                           </p>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </section>
         <section className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">
               ✈️ Pronto para seu próximo voo?
            </h2>
            <p className="text-gray-400">
               Escolha um tour e comece agora mesmo a sua jornada.
            </p>
            <Link href="/tours">
               <button className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500">
                  Explorar Tours
               </button>
            </Link>
         </section>
      </div>
   );
}
