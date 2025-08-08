'use client';

import { useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Loading from '@/components/ui/loading';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Status from '@/components/ui/status';

const AGREEMENT_VERSION = 'v1.2.3';

export default function SettingsPage() {
   const { data: session, status } = useSession();
   const [showPolicy, setShowPolicy] = useState(false);

   if (status === 'loading') {
      return <Loading fullScreen text="Carregando configurações..." />;
   }

   if (!session || !session.user) {
      return <></>;
   }

   return (
      <>
         <main
            className={`min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6 py-12 transition-all duration-300 ${
               showPolicy ? 'pointer-events-none select-none' : ''
            }`}
            aria-hidden={showPolicy}
         >
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
               <div className="animate-float-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
               <div
                  className="animate-float-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl"
                  style={{ animationDelay: '2s' }}
               ></div>
               <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
            </div>

            <div className="relative mx-auto mb-14 max-w-5xl px-4 text-center">
               <div className="animate-fade-in-up mb-16 space-y-8">
                  <div className="space-y-6">
                     <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
                        Configurações
                     </h1>
                     <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                  <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                     Gerencie suas preferências e acesse nossa política de
                     privacidade para entender como protegemos seus dados.
                  </p>
               </div>

               <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <Card
                     hoverable
                     className="group animate-scale-in hover-lift-lg relative overflow-hidden"
                     style={{ animationDelay: '0.1s' }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                     <div className="relative space-y-6">
                        <div className="animate-glow-pulse mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                           <svg
                              className="h-8 w-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                           </svg>
                        </div>

                        <div className="space-y-3">
                           <h3 className="text-2xl font-bold text-white">
                              Política de Privacidade
                           </h3>
                           <p className="text-gray-400">
                              Entenda como coletamos, usamos e protegemos suas
                              informações pessoais
                           </p>
                        </div>

                        <Button
                           variant="primary"
                           size="lg"
                           onClick={() => setShowPolicy(true)}
                           className="w-full"
                        >
                           Visualizar Política
                           <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                           <Status
                              type="online"
                              label={`Versão ${AGREEMENT_VERSION}`}
                           />
                        </div>
                     </div>
                  </Card>

                  <Card
                     hoverable
                     className="group animate-scale-in hover-lift-lg relative overflow-hidden"
                     style={{ animationDelay: '0.2s' }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                     <div className="relative space-y-6">
                        <div className="animate-glow-pulse mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                           <svg
                              className="h-8 w-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                           </svg>
                        </div>

                        <div className="space-y-3">
                           <h3 className="text-2xl font-bold text-white">
                              Informações da Conta
                           </h3>
                           <p className="text-gray-400">
                              Seus dados de perfil e estatísticas da plataforma
                           </p>
                        </div>

                        <Card className="space-y-4 bg-gray-800/50">
                           <div className="flex items-center justify-between">
                              <span className="text-gray-400">Nome:</span>
                              <span className="font-medium text-white">
                                 {session.user.name}
                              </span>
                           </div>
                        </Card>
                     </div>
                  </Card>
               </div>
            </div>
         </main>

         <Transition
            as={Fragment}
            show={showPolicy}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
         >
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
               role="dialog"
               aria-modal="true"
               aria-labelledby="modal-title"
               onClick={() => setShowPolicy(false)}
            >
               <Transition.Child
                  as={Fragment}
                  enter="transition ease-out duration-500 transform"
                  enterFrom="opacity-0 scale-90 translate-y-8"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-300 transform"
                  leaveFrom="opacity-100 scale-100 translate-y-0"
                  leaveTo="opacity-0 scale-90 translate-y-8"
               >
                  <div className="relative w-full max-w-4xl">
                     <button
                        onClick={() => setShowPolicy(false)}
                        aria-label="Fechar política de privacidade"
                        className="absolute -top-4 -right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/25"
                        type="button"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-6 w-6"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                           strokeWidth={2}
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                           />
                        </svg>
                     </button>

                     <section
                        className="max-h-[85vh] overflow-y-auto rounded-3xl border border-gray-600/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-12 text-gray-100 shadow-2xl backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                           scrollbarWidth: 'thin',
                           scrollbarColor: '#6366f1 #1f2937',
                        }}
                     >
                        <div className="mb-12 space-y-6 text-center">
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
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                 />
                              </svg>
                           </div>
                           <h2
                              id="modal-title"
                              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent"
                           >
                              Política de Privacidade
                           </h2>
                           <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </div>

                        <div className="mb-12 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8">
                           <p className="text-lg leading-relaxed text-gray-200">
                              Respeitamos sua privacidade e estamos
                              comprometidos em proteger seus dados pessoais.
                              Todas as informações fornecidas são usadas
                              exclusivamente para fins de autenticação,
                              personalização da experiência e para garantir a
                              segurança da plataforma.
                           </p>
                        </div>

                        <div className="space-y-10">
                           <div className="space-y-6">
                              <h3 className="flex items-center gap-3 text-3xl font-bold text-blue-400">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                                    <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                                 </div>
                                 Coleta de Dados
                              </h3>
                              <ul className="space-y-4 text-lg">
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <span className="text-gray-300">
                                       Nome e identificador da conta VATSIM
                                    </span>
                                 </li>
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <span className="text-gray-300">
                                       Imagem de perfil (se fornecida pela
                                       VATSIM)
                                    </span>
                                 </li>
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <span className="text-gray-300">
                                       Atividades dentro da plataforma (tours
                                       completados, progresso etc.)
                                    </span>
                                 </li>
                              </ul>
                           </div>

                           <div className="space-y-6">
                              <h3 className="flex items-center gap-3 text-3xl font-bold text-purple-400">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                                    <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                                 </div>
                                 Uso de Dados
                              </h3>
                              <ul className="space-y-4 text-lg">
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                                    <span className="text-gray-300">
                                       Melhorar sua experiência como usuário
                                    </span>
                                 </li>
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                                    <span className="text-gray-300">
                                       Gerenciar seu progresso e participação
                                       nos tours
                                    </span>
                                 </li>
                                 <li className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                                    <span className="text-gray-300">
                                       Garantir segurança e integridade da
                                       plataforma
                                    </span>
                                 </li>
                              </ul>
                           </div>

                           <div className="space-y-6">
                              <h3 className="flex items-center gap-3 text-3xl font-bold text-indigo-400">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                                    <div className="h-3 w-3 rounded-full bg-indigo-400"></div>
                                 </div>
                                 Armazenamento e Segurança
                              </h3>
                              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-600/10 p-6">
                                 <p className="text-lg leading-relaxed text-gray-300">
                                    Os dados são armazenados em servidores
                                    seguros e acessíveis apenas por
                                    administradores autorizados. Implementamos
                                    medidas técnicas e organizacionais para
                                    proteger suas informações contra acessos não
                                    autorizados, perda ou divulgação indevida.
                                 </p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                              <div className="space-y-4">
                                 <h3 className="text-2xl font-bold text-green-400">
                                    Cookies
                                 </h3>
                                 <div className="rounded-2xl border border-green-500/20 bg-green-600/10 p-6">
                                    <p className="leading-relaxed text-gray-300">
                                       Utilizamos cookies essenciais para
                                       garantir o funcionamento da plataforma.
                                       Não utilizamos cookies para rastreamento
                                       ou publicidade de terceiros.
                                    </p>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <h3 className="text-2xl font-bold text-yellow-400">
                                    Compartilhamento
                                 </h3>
                                 <div className="rounded-2xl border border-yellow-500/20 bg-yellow-600/10 p-6">
                                    <p className="leading-relaxed text-gray-300">
                                       Não compartilhamos seus dados com
                                       terceiros.
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h3 className="flex items-center gap-3 text-3xl font-bold text-cyan-400">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20">
                                    <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
                                 </div>
                                 Seus Direitos
                              </h3>
                              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-600/10 p-6">
                                 <p className="text-lg leading-relaxed text-gray-300">
                                    Você pode solicitar a exclusão de seus dados
                                    a qualquer momento entrando em contato com a
                                    administração da plataforma. Também pode
                                    visualizar ou exportar os dados disponíveis
                                    no seu perfil.
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="mt-12 border-t border-gray-600/50 pt-8 text-center">
                           <div className="inline-flex items-center gap-2 rounded-full bg-gray-700/50 px-6 py-3">
                              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                              <span className="text-sm text-gray-400">
                                 Última atualização: Agosto de 2025 • Versão{' '}
                                 {AGREEMENT_VERSION}
                              </span>
                           </div>
                        </div>
                     </section>
                  </div>
               </Transition.Child>
            </div>
         </Transition>
      </>
   );
}
