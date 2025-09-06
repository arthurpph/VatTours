'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, User, ChevronRight, X } from 'lucide-react';
import Loading from '@/components/ui/Loading';

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
            className={`min-h-screen bg-[#0d1117] ${showPolicy ? 'pointer-events-none' : ''}`}
         >
            {/* GitHub-style header */}
            <div className="border-b border-[#21262d] bg-[#010409]">
               <div className="mx-auto max-w-7xl px-4 py-6">
                  <h1 className="text-2xl font-semibold text-[#f0f6fc]">
                     Configurações
                  </h1>
                  <p className="mt-2 text-[#7d8590]">
                     Gerencie suas preferências e acesse nossa política de
                     privacidade
                  </p>
               </div>
            </div>

            {/* Main content */}
            <div className="mx-auto max-w-7xl px-4 py-8">
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Privacy Policy Card */}
                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6 transition-colors hover:bg-[#21262d]">
                     <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">
                           <Shield className="h-6 w-6 text-[#7d8590]" />
                        </div>
                     </div>

                     <div className="mb-6 text-center">
                        <h3 className="mb-2 text-xl font-semibold text-[#f0f6fc]">
                           Política de Privacidade
                        </h3>
                        <p className="text-[#7d8590]">
                           Entenda como coletamos, usamos e protegemos suas
                           informações pessoais
                        </p>
                     </div>

                     <button
                        onClick={() => setShowPolicy(true)}
                        className="flex w-full items-center justify-between rounded-md border border-[#21262d] bg-[#0d1117] px-4 py-3 text-left transition-colors hover:bg-[#21262d]"
                     >
                        <span className="text-[#f0f6fc]">
                           Visualizar Política
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#7d8590]" />
                     </button>

                     <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#21262d] bg-[#161b22] px-3 py-1 text-xs text-[#7d8590]">
                           <div className="h-2 w-2 rounded-full bg-[#7d8590]"></div>
                           Versão {AGREEMENT_VERSION}
                        </span>
                     </div>
                  </div>

                  {/* Account Information Card */}
                  <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
                     <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">
                           <User className="h-6 w-6 text-[#7d8590]" />
                        </div>
                     </div>

                     <div className="mb-6 text-center">
                        <h3 className="mb-2 text-xl font-semibold text-[#f0f6fc]">
                           Informações da Conta
                        </h3>
                        <p className="text-[#7d8590]">
                           Seus dados de perfil e estatísticas da plataforma
                        </p>
                     </div>

                     <div className="rounded-md border border-[#21262d] bg-[#0d1117] p-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[#7d8590]">Nome:</span>
                           <span className="font-medium text-[#f0f6fc]">
                              {session.user.name}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* Privacy Policy Modal */}
         {showPolicy && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
               onClick={() => setShowPolicy(false)}
            >
               <div className="relative w-full max-w-4xl">
                  <button
                     onClick={() => setShowPolicy(false)}
                     className="absolute -top-4 -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#21262d] text-[#f0f6fc] shadow-xl transition-colors hover:bg-[#7d8590]"
                  >
                     <X className="h-5 w-5" />
                  </button>

                  <div
                     className="max-h-[85vh] overflow-y-auto rounded-md border border-[#21262d] bg-[#161b22] p-8 text-[#f0f6fc] shadow-2xl"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#21262d]">
                           <Shield className="h-8 w-8 text-[#7d8590]" />
                        </div>
                        <h2 className="mb-2 text-3xl font-semibold text-[#f0f6fc]">
                           Política de Privacidade
                        </h2>
                        <div className="mx-auto h-0.5 w-16 rounded-full bg-[#7d8590]"></div>
                     </div>

                     <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6">
                        <p className="text-[#f0f6fc]">
                           Respeitamos sua privacidade e estamos comprometidos
                           em proteger seus dados pessoais. Todas as informações
                           fornecidas são usadas exclusivamente para fins de
                           autenticação, personalização da experiência e para
                           garantir a segurança da plataforma.
                        </p>
                     </div>

                     <div className="space-y-8">
                        <div>
                           <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#f0f6fc]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#7d8590]"></div>
                              Coleta de Dados
                           </h3>
                           <ul className="space-y-2 text-[#7d8590]">
                              <li>• Nome e identificador da conta VATSIM</li>
                              <li>
                                 • Imagem de perfil (se fornecida pela VATSIM)
                              </li>
                              <li>
                                 • Atividades dentro da plataforma (tours
                                 completados, progresso etc.)
                              </li>
                           </ul>
                        </div>

                        <div>
                           <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#f0f6fc]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#7d8590]"></div>
                              Uso de Dados
                           </h3>
                           <ul className="space-y-2 text-[#7d8590]">
                              <li>• Melhorar sua experiência como usuário</li>
                              <li>
                                 • Gerenciar seu progresso e participação nos
                                 tours
                              </li>
                              <li>
                                 • Garantir segurança e integridade da
                                 plataforma
                              </li>
                           </ul>
                        </div>

                        <div>
                           <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#f0f6fc]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#7d8590]"></div>
                              Armazenamento e Segurança
                           </h3>
                           <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                              <p className="text-[#f0f6fc]">
                                 Os dados são armazenados em servidores seguros
                                 e acessíveis apenas por administradores
                                 autorizados. Implementamos medidas técnicas e
                                 organizacionais para proteger suas informações
                                 contra acessos não autorizados, perda ou
                                 divulgação indevida.
                              </p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                           <div>
                              <h3 className="mb-4 text-lg font-semibold text-[#f0f6fc]">
                                 Cookies
                              </h3>
                              <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                                 <p className="text-[#7d8590]">
                                    Utilizamos cookies essenciais para garantir
                                    o funcionamento da plataforma. Não
                                    utilizamos cookies para rastreamento ou
                                    publicidade de terceiros.
                                 </p>
                              </div>
                           </div>

                           <div>
                              <h3 className="mb-4 text-lg font-semibold text-[#f0f6fc]">
                                 Compartilhamento
                              </h3>
                              <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                                 <p className="text-[#7d8590]">
                                    Não compartilhamos seus dados com terceiros.
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div>
                           <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#f0f6fc]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#7d8590]"></div>
                              Seus Direitos
                           </h3>
                           <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                              <p className="text-[#f0f6fc]">
                                 Você pode solicitar a exclusão de seus dados a
                                 qualquer momento entrando em contato com a
                                 administração da plataforma. Também pode
                                 visualizar ou exportar os dados disponíveis no
                                 seu perfil.
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 border-t border-[#21262d] pt-6 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#21262d] px-4 py-2 text-sm text-[#7d8590]">
                           <div className="h-2 w-2 rounded-full bg-[#7d8590]"></div>
                           Última atualização: Agosto de 2025 • Versão{' '}
                           {AGREEMENT_VERSION}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
