'use client';

import { useState, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const AGREEMENT_VERSION = 'v1.2.3';

export default function SettingsPage() {
   const { data: session, status } = useSession();
   const [showPolicy, setShowPolicy] = useState(false);

   if (status === 'loading') {
      return (
         <main className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white">
            <p className="animate-pulse text-xl font-semibold">Carregando...</p>
         </main>
      );
   }

   if (!session || !session.user) {
      return <></>;
   }

   return (
      <>
         <main
            className={`min-h-screen bg-gray-900 px-6 py-12 transition-all duration-300 ${
               showPolicy ? 'pointer-events-none select-none' : ''
            }`}
            aria-hidden={showPolicy}
         >
            <div className="mx-auto mb-14 max-w-5xl px-4 text-center">
               <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  Configurações
               </h1>
               <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-400">
                  Abaixo você pode acessar nossa política de privacidade.
               </p>

               <div className="mb-12 flex items-center justify-center gap-6">
                  <button
                     onClick={() => setShowPolicy(true)}
                     className="flex transform items-center gap-3 rounded-full bg-indigo-600 px-10 py-4 font-semibold text-white shadow-[0_10px_20px_rgba(99,102,241,0.6)] transition duration-300 hover:bg-indigo-700 hover:shadow-[0_12px_28px_rgba(99,102,241,0.8)] active:scale-[0.97] active:bg-indigo-800"
                     type="button"
                  >
                     Mostrar Política de Privacidade
                     <ChevronDownIcon className="animate-fadeIn h-6 w-6 text-white" />
                  </button>
                  <span className="font-mono tracking-wider text-gray-400 select-none">
                     Versão:{' '}
                     <span className="text-indigo-400">
                        {AGREEMENT_VERSION}
                     </span>
                  </span>
               </div>
            </div>
         </main>

         <Transition
            as={Fragment}
            show={showPolicy}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
         >
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
               role="dialog"
               aria-modal="true"
               aria-labelledby="modal-title"
               onClick={() => setShowPolicy(false)}
            >
               <Transition.Child
                  as={Fragment}
                  enter="transition ease-out duration-300 transform"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-200 transform"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
               >
                  <div className="relative w-full max-w-3xl">
                     <button
                        onClick={() => setShowPolicy(false)}
                        aria-label="Fechar política de privacidade"
                        className="bg-opacity-80 absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition select-none hover:bg-indigo-700"
                        type="button"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="pointer-events-none h-6 w-6"
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
                        className="scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-thumb-rounded-md scrollbar-track-gray-900 scrollbar-track-rounded-md max-h-[80vh] overflow-y-auto rounded-4xl bg-gradient-to-tr from-indigo-900/40 via-indigo-800/30 to-indigo-900/40 p-10 text-gray-200 shadow-xl backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <h2
                           id="modal-title"
                           className="mb-8 text-4xl font-extrabold drop-shadow-md"
                        >
                           Política de Privacidade
                        </h2>

                        <p className="mx-auto mb-10 max-w-prose text-lg leading-relaxed">
                           Respeitamos sua privacidade e estamos comprometidos
                           em proteger seus dados pessoais. Todas as informações
                           fornecidas são usadas exclusivamente para fins de
                           autenticação, personalização da experiência e para
                           garantir a segurança da plataforma.
                        </p>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Coleta de Dados
                        </h3>
                        <ul className="mx-auto mb-10 max-w-prose list-inside list-disc space-y-3 text-lg text-indigo-200">
                           <li>Nome e identificador da conta VATSIM</li>
                           <li>Imagem de perfil (se fornecida pela VATSIM)</li>
                           <li>
                              Atividades dentro da plataforma (tours
                              completados, progresso etc.)
                           </li>
                        </ul>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Uso de Dados
                        </h3>
                        <ul className="mx-auto mb-10 max-w-prose list-inside list-disc space-y-3 text-lg text-indigo-200">
                           <li>Melhorar sua experiência como usuário</li>
                           <li>
                              Gerenciar seu progresso e participação nos tours
                           </li>
                           <li>
                              Garantir segurança e integridade da plataforma
                           </li>
                        </ul>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Armazenamento e Segurança
                        </h3>
                        <p className="mx-auto mb-10 max-w-prose text-lg leading-relaxed text-indigo-200">
                           Os dados são armazenados em servidores seguros e
                           acessíveis apenas por administradores autorizados.
                           Implementamos medidas técnicas e organizacionais para
                           proteger suas informações contra acessos não
                           autorizados, perda ou divulgação indevida.
                        </p>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Cookies
                        </h3>
                        <p className="mx-auto mb-10 max-w-prose text-lg leading-relaxed text-indigo-200">
                           Utilizamos cookies essenciais para garantir o
                           funcionamento da plataforma. Não utilizamos cookies
                           para rastreamento ou publicidade de terceiros.
                        </p>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Compartilhamento
                        </h3>
                        <p className="mx-auto mb-10 max-w-prose text-lg leading-relaxed text-indigo-200">
                           Não compartilhamos seus dados com terceiros.
                        </p>

                        <h3 className="mb-6 text-3xl font-semibold text-indigo-400">
                           Seus Direitos
                        </h3>
                        <p className="mx-auto mb-6 max-w-prose text-lg leading-relaxed text-indigo-200">
                           Você pode solicitar a exclusão de seus dados a
                           qualquer momento entrando em contato com a
                           administração da plataforma. Também pode visualizar
                           ou exportar os dados disponíveis no seu perfil.
                        </p>

                        <p className="mx-auto max-w-prose border-t border-indigo-600 pt-6 text-sm text-indigo-400">
                           Última atualização: Agosto de 2025
                        </p>
                     </section>
                  </div>
               </Transition.Child>
            </div>
         </Transition>
      </>
   );
}
