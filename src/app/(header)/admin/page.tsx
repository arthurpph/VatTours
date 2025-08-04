import Link from 'next/link';
import { Compass, PlaneTakeoff, MapPin, Users } from 'lucide-react';

export default function AdminHomePage() {
   const adminLinks = [
      {
         href: '/admin/tours',
         title: 'Gerenciar Tours',
         icon: <Compass className="w-6 h-6 text-blue-400" />,
      },
      {
         href: '/admin/pireps',
         title: 'Gerenciar PIREPs',
         icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" />,
      },
      {
         href: '/admin/airports',
         title: 'Gerenciar Aeroportos',
         icon: <MapPin className="w-6 h-6 text-blue-400" />,
      },
      {
         href: '/admin/users',
         title: 'Gerenciar Usuários',
         icon: <Users className="w-6 h-6 text-blue-400" />,
      },
   ];

   return (
      <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
         <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center text-white">
               Painel de Administração
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {adminLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className="flex items-center gap-4 p-5 rounded-2xl shadow-md hover:shadow-lg border border-gray-700 hover:border-gray-600 transition bg-gray-800 hover:bg-gray-700"
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
