import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { isValidUrl } from '@/lib/utils';
import { authOptions } from '../api/auth/[...nextauth]/auth';
import { getTours } from '@/lib/queries';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (!session) {
      return <></>;
   }

   const tours = await getTours();

   return (
      <div className="bg-gray-900 min-h-screen text-white px-6 py-10 space-y-16">
         <section className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
               Bem-vindo de volta, {session.user?.name}!
            </h1>
            <p className="text-gray-400">
               Descubra novos destinos e aventuras incríveis pelo mundo.
            </p>
         </section>

         <section className="text-center">
            <h2 className="text-2xl font-semibold mb-6">🌍 Novos Tours</h2>
            <div className="flex flex-wrap justify-center ">
               {tours.slice(0, 4).map((tour, index) => (
                  <Link
                     href={`/tours/${tour.id}`}
                     className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                     key={index}
                  >
                     <div className="bg-gray-800 rounded-t-2xl rounded-b-md shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-105">
                        {isValidUrl(tour.image) ? (
                           <Image
                              src={`${tour.image}`}
                              alt={tour.title}
                              width={1000}
                              height={1000}
                              className="w-full h-70 object-cover hover:scale-105 transition-transform duration-300"
                           />
                        ) : (
                           <div className="w-full h-70 bg-gray-700 flex items-center justify-center">
                              <p className="text-gray-400">Imagem inválida</p>
                           </div>
                        )}
                        <div className="p-4">
                           <h3 className="text-xl font-bold">{tour.title}</h3>
                           <p className="text-gray-400 text-sm mt-1">
                              {tour.description}
                           </p>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </section>
         <section className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">
               ✈️ Pronto para seu próximo voo?
            </h2>
            <p className="text-gray-400">
               Escolha um tour e comece agora mesmo a sua jornada.
            </p>
            <Link href="/tours">
               <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer">
                  Explorar Tours
               </button>
            </Link>
         </section>
      </div>
   );
}
