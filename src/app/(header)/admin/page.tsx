import Link from 'next/link';
import { Compass, PlaneTakeoff, MapPin, Users } from 'lucide-react';

export default function AdminHomePage() {
   const adminLinks = [
      {
         href: '/admin/tours',
         title: 'Gerenciar Tours',
         icon: <Compass className="h-6 w-6 text-blue-400" />,
      },
      {
         href: '/admin/pireps',
         title: 'Gerenciar PIREPs',
         icon: <PlaneTakeoff className="h-6 w-6 text-blue-400" />,
      },
      {
         href: '/admin/airports',
         title: 'Gerenciar Aeroportos',
         icon: <MapPin className="h-6 w-6 text-blue-400" />,
      },
      {
         href: '/admin/users',
         title: 'Gerenciar Usuários',
         icon: <Users className="h-6 w-6 text-blue-400" />,
      },
   ];

   return (
      <div className="min-h-screen bg-gray-900 px-6 py-10 text-white">
         <div className="mx-auto max-w-5xl">
            <h1 className="mb-10 text-center text-4xl font-bold text-white">
               Painel de Administração
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
               {adminLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className="flex items-center gap-4 rounded-2xl border border-gray-700 bg-gray-800 p-5 shadow-md transition hover:border-gray-600 hover:bg-gray-700 hover:shadow-lg"
                  >
                     <div>{link.icon}</div>
                     <span className="text-lg font-medium text-gray-200">
                        {link.title}
                     </span>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}
