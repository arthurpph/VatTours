import Link from 'next/link';
import {
   Settings,
   Compass,
   PlaneTakeoff,
   MapPin,
   Users,
   ArrowRight,
} from 'lucide-react';

export default function AdminHomePage() {
   const adminLinks = [
      {
         href: '/admin/tours',
         title: 'Gerenciar Tours',
         description: 'Criar, editar e gerenciar tours de voo',
         icon: <Compass className="h-6 w-6" />,
         color: 'text-[#8cc8ff]',
         bgColor: 'bg-[#8cc8ff]/15',
      },
      {
         href: '/admin/pireps',
         title: 'Gerenciar PIREPs',
         description: 'Revisar e aprovar relatórios de voo',
         icon: <PlaneTakeoff className="h-6 w-6" />,
         color: 'text-[#a5b4fc]',
         bgColor: 'bg-[#a5b4fc]/15',
      },
      {
         href: '/admin/airports',
         title: 'Gerenciar Aeroportos',
         description: 'Administrar base de dados de aeroportos',
         icon: <MapPin className="h-6 w-6" />,
         color: 'text-[#94a3b8]',
         bgColor: 'bg-[#94a3b8]/15',
      },
      {
         href: '/admin/users',
         title: 'Gerenciar Usuários',
         description: 'Controlar acesso e permissões de usuários',
         icon: <Users className="h-6 w-6" />,
         color: 'text-[#cbd5e1]',
         bgColor: 'bg-[#cbd5e1]/15',
      },
   ];

   return (
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-6">
               <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8cc8ff]/15">
                     <Settings className="h-5 w-5 text-[#8cc8ff]" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-semibold text-[#f0f6fc]">
                        Painel de Administração
                     </h1>
                     <p className="text-[#7d8590]">
                        Gerencie todos os aspectos da plataforma VatTours
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
               {adminLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className="group rounded-md border border-[#21262d] bg-[#161b22] p-6 transition-colors hover:bg-[#21262d]"
                  >
                     <div className="flex items-start gap-4">
                        <div
                           className={`flex h-12 w-12 items-center justify-center rounded-md ${link.bgColor}`}
                        >
                           <div className={link.color}>{link.icon}</div>
                        </div>

                        <div className="flex-1">
                           <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-[#f0f6fc] group-hover:text-[#8cc8ff]">
                                 {link.title}
                              </h3>
                              <ArrowRight className="h-4 w-4 text-[#7d8590] transition-transform group-hover:translate-x-1 group-hover:text-[#8cc8ff]" />
                           </div>
                           <p className="mt-2 text-[#7d8590]">
                              {link.description}
                           </p>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            <div className="mt-8">
               <h2 className="mb-4 text-lg font-semibold text-[#f0f6fc]">
                  Estatísticas Rápidas
               </h2>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                     <div className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-[#8cc8ff]" />
                        <h3 className="font-medium text-[#f0f6fc]">
                           Tours Ativos
                        </h3>
                     </div>
                     <p className="mt-2 text-2xl font-semibold text-[#8cc8ff]">
                        12
                     </p>
                     <p className="text-sm text-[#7d8590]">Em andamento</p>
                  </div>

                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                     <div className="flex items-center gap-2">
                        <PlaneTakeoff className="h-5 w-5 text-[#a5b4fc]" />
                        <h3 className="font-medium text-[#f0f6fc]">PIREPs</h3>
                     </div>
                     <p className="mt-2 text-2xl font-semibold text-[#a5b4fc]">
                        48
                     </p>
                     <p className="text-sm text-[#7d8590]">Pendentes</p>
                  </div>

                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                     <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#94a3b8]" />
                        <h3 className="font-medium text-[#f0f6fc]">
                           Aeroportos
                        </h3>
                     </div>
                     <p className="mt-2 text-2xl font-semibold text-[#94a3b8]">
                        156
                     </p>
                     <p className="text-sm text-[#7d8590]">Cadastrados</p>
                  </div>

                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                     <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#cbd5e1]" />
                        <h3 className="font-medium text-[#f0f6fc]">Usuários</h3>
                     </div>
                     <p className="mt-2 text-2xl font-semibold text-[#cbd5e1]">
                        1,234
                     </p>
                     <p className="text-sm text-[#7d8590]">Registrados</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
