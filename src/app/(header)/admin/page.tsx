import Link from 'next/link';
import { Compass, PlaneTakeoff, MapPin, Users } from 'lucide-react';

export default function AdminHomePage() {
   const adminLinks = [
      {
         href: '/admin/tours',
         title: 'Gerenciar Tours',
         description: 'Criar, editar e gerenciar tours de voo',
         icon: <Compass className="h-8 w-8" />,
         color: 'from-blue-500 to-cyan-500',
         bgColor: 'from-blue-600/10 to-cyan-600/10',
         borderColor: 'border-blue-500/30',
      },
      {
         href: '/admin/pireps',
         title: 'Gerenciar PIREPs',
         description: 'Revisar e aprovar relatórios de voo',
         icon: <PlaneTakeoff className="h-8 w-8" />,
         color: 'from-purple-500 to-indigo-500',
         bgColor: 'from-purple-600/10 to-indigo-600/10',
         borderColor: 'border-purple-500/30',
      },
      {
         href: '/admin/airports',
         title: 'Gerenciar Aeroportos',
         description: 'Administrar base de dados de aeroportos',
         icon: <MapPin className="h-8 w-8" />,
         color: 'from-emerald-500 to-teal-500',
         bgColor: 'from-emerald-600/10 to-teal-600/10',
         borderColor: 'border-emerald-500/30',
      },
      {
         href: '/admin/users',
         title: 'Gerenciar Usuários',
         description: 'Controlar acesso e permissões de usuários',
         icon: <Users className="h-8 w-8" />,
         color: 'from-orange-500 to-red-500',
         bgColor: 'from-orange-600/10 to-red-600/10',
         borderColor: 'border-orange-500/30',
      },
   ];

   return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6 py-10 text-white">
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 blur-3xl"></div>
            <div className="absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/10 to-indigo-900/10 blur-3xl"></div>
         </div>

         <div className="relative mx-auto max-w-6xl">
            <div className="mb-16 space-y-8 text-center">
               <div className="space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                     <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                     </svg>
                  </div>

                  <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
                     Painel de Administração
                  </h1>
                  <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
               </div>

               <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                  Gerencie todos os aspectos da plataforma VatTours através
                  desta central de controle administrativa
               </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
               {adminLinks.map((link, index) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className={`group relative overflow-hidden rounded-3xl border ${link.borderColor} bg-gradient-to-br ${link.bgColor} p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20`}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                     <div className="relative flex items-start gap-6">
                        <div
                           className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${link.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                        >
                           {link.icon}
                        </div>

                        <div className="flex-1 space-y-3">
                           <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                              {link.title}
                           </h3>
                           <p className="leading-relaxed text-gray-400">
                              {link.description}
                           </p>

                           <div className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-blue-400">
                              <span>Acessar painel</span>
                              <svg
                                 className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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

                     <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-20">
                        <span className="text-6xl font-bold text-white">
                           {String(index + 1).padStart(2, '0')}
                        </span>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}
