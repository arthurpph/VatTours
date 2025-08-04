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
         <main className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center text-white">
            <p className="text-xl font-semibold animate-pulse">Carregando...</p>
         </main>
      );
   }

   if (!session || !session.user) {
      return <></>;
   }

   return (
      <>
         <main
            className={`bg-gray-900 min-h-screen px-6 py-12 transition-all duration-300 ${
               showPolicy ? 'pointer-events-none select-none' : ''
            }`}
            aria-hidden={showPolicy}
         >
            <div className="max-w-5xl mx-auto mb-14 text-center px-4">
               <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  Configurações
               </h1>
               <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-12">
                  Abaixo você pode acessar nossa política de privacidade.
               </p>

               <div className="flex items-center justify-center gap-6 mb-12">
                  <button
                     onClick={() => setShowPolicy(true)}
                     className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-full font-semibold text-white shadow-[0_10px_20px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_28px_rgba(99,102,241,0.8)] transition duration-300 transform active:scale-[0.97]"
                     type="button"
                  >
                     Mostrar Política de Privacidade
                     <ChevronDownIcon className="w-6 h-6 text-white animate-fadeIn" />
                  </button>
                  <span className="text-gray-400 select-none font-mono tracking-wider">
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
               className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
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
                  <div className="relative max-w-3xl w-full">
                     <button
                        onClick={() => setShowPolicy(false)}
                        aria-label="Fechar política de privacidade"
                        className="
          absolute top-4 right-4 
          w-10 h-10 flex items-center justify-center rounded-full
          bg-indigo-600 bg-opacity-80 hover:bg-indigo-700 transition 
          text-white select-none
          shadow-lg
          cursor-pointer
          z-10
        "
                        type="button"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-6 h-6 pointer-events-none"
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
                        className="
          bg-gradient-to-tr from-indigo-900/40 via-indigo-800/30 to-indigo-900/40
          backdrop-blur-xl rounded-4xl shadow-xl p-10 max-h-[80vh]
          overflow-y-auto scrollbar-thin
          scrollbar-thumb-indigo-400 scrollbar-thumb-rounded-md
          scrollbar-track-gray-900 scrollbar-track-rounded-md
          text-gray-200
        "
                        onClick={(e) => e.stopPropagation()}
                     >
                        <h2
                           id="modal-title"
                           className="text-4xl font-extrabold drop-shadow-md mb-8"
                        >
                           Política de Privacidade
                        </h2>

                        <p className="leading-relaxed text-lg max-w-prose mx-auto mb-10">
                           Respeitamos sua privacidade e estamos comprometidos
                           em proteger seus dados pessoais. Todas as informações
                           fornecidas são usadas exclusivamente para fins de
                           autenticação, personalização da experiência e para
                           garantir a segurança da plataforma.
                        </p>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Coleta de Dados
                        </h3>
                        <ul className="list-disc list-inside space-y-3 max-w-prose mx-auto mb-10 text-indigo-200 text-lg">
                           <li>Nome e identificador da conta VATSIM</li>
                           <li>Imagem de perfil (se fornecida pela VATSIM)</li>
                           <li>
                              Atividades dentro da plataforma (tours
                              completados, progresso etc.)
                           </li>
                        </ul>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Uso de Dados
                        </h3>
                        <ul className="list-disc list-inside space-y-3 max-w-prose mx-auto mb-10 text-indigo-200 text-lg">
                           <li>Melhorar sua experiência como usuário</li>
                           <li>
                              Gerenciar seu progresso e participação nos tours
                           </li>
                           <li>
                              Garantir segurança e integridade da plataforma
                           </li>
                        </ul>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Armazenamento e Segurança
                        </h3>
                        <p className="max-w-prose mx-auto mb-10 text-indigo-200 text-lg leading-relaxed">
                           Os dados são armazenados em servidores seguros e
                           acessíveis apenas por administradores autorizados.
                           Implementamos medidas técnicas e organizacionais para
                           proteger suas informações contra acessos não
                           autorizados, perda ou divulgação indevida.
                        </p>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Cookies
                        </h3>
                        <p className="max-w-prose mx-auto mb-10 text-indigo-200 text-lg leading-relaxed">
                           Utilizamos cookies essenciais para garantir o
                           funcionamento da plataforma. Não utilizamos cookies
                           para rastreamento ou publicidade de terceiros.
                        </p>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Compartilhamento
                        </h3>
                        <p className="max-w-prose mx-auto mb-10 text-indigo-200 text-lg leading-relaxed">
                           Não compartilhamos seus dados com terceiros.
                        </p>

                        <h3 className="text-3xl font-semibold text-indigo-400 mb-6">
                           Seus Direitos
                        </h3>
                        <p className="max-w-prose mx-auto mb-6 text-indigo-200 text-lg leading-relaxed">
                           Você pode solicitar a exclusão de seus dados a
                           qualquer momento entrando em contato com a
                           administração da plataforma. Também pode visualizar
                           ou exportar os dados disponíveis no seu perfil.
                        </p>

                        <p className="text-indigo-400 text-sm pt-6 border-t border-indigo-600 max-w-prose mx-auto">
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
