'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export default function TourMenu() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const currentAction = searchParams.get('action');
   const [isPending, startTransition] = useTransition();

   const navItems = [
      { label: 'Info', action: undefined },
      { label: 'Pernas', action: 'legs' },
      { label: 'Status', action: 'status' },
      { label: 'PIREP', action: 'pirep' },
   ];

   const handleClick = useCallback(
      (action: string | undefined) => {
         startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (action) {
               params.set('action', action);
            } else {
               params.delete('action');
            }

            const newUrl = `${pathname}?${params.toString()}`;
            router.push(newUrl);
         });
      },
      [router, pathname, searchParams],
   );

   return (
      <div className="relative mx-auto mb-12 w-full max-w-2xl px-4">
         <div className="glass rounded-2xl border border-gray-800/50 bg-black/40 p-2">
            <nav
               className="flex flex-wrap justify-center gap-2"
               role="tablist"
               aria-label="Menu de navegação do tour"
            >
               {navItems.map((item) => {
                  const isActive =
                     (!currentAction && !item.action) ||
                     currentAction === item.action;

                  return (
                     <button
                        key={item.label}
                        onClick={() => handleClick(item.action)}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${item.action || 'info'}`}
                        className={`group relative min-w-[80px] flex-1 cursor-pointer rounded-xl px-4 py-3 text-center text-sm font-medium tracking-wide transition-all duration-300 select-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none sm:min-w-[120px] sm:flex-auto sm:px-6 sm:py-3 sm:text-base ${
                           isActive
                              ? 'scale-105 bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-lg shadow-blue-500/25'
                              : 'text-gray-300 hover:scale-105 hover:bg-gray-900/50 hover:text-white'
                        }`}
                        disabled={isPending}
                     >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           {item.label === 'Info' && (
                              <svg
                                 className="h-4 w-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                 />
                              </svg>
                           )}
                           {item.label === 'Pernas' && (
                              <svg
                                 className="h-4 w-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                 />
                              </svg>
                           )}
                           {item.label === 'Status' && (
                              <svg
                                 className="h-4 w-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                 />
                              </svg>
                           )}
                           {item.label === 'PIREP' && (
                              <svg
                                 className="h-4 w-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                 />
                              </svg>
                           )}
                           <span className="hidden sm:inline">
                              {item.label}
                           </span>
                           <span className="sm:hidden">{item.label}</span>
                        </span>

                        {!isActive && (
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-800/20 to-purple-800/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        )}

                        {isActive && (
                           <div className="animate-glow absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700"></div>
                        )}
                     </button>
                  );
               })}
            </nav>

            {isPending && (
               <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-3 text-blue-400">
                     <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                     >
                        <circle
                           className="opacity-25"
                           cx="12"
                           cy="12"
                           r="10"
                           stroke="currentColor"
                           strokeWidth="4"
                        />
                        <path
                           className="opacity-75"
                           fill="currentColor"
                           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                     </svg>
                     <span className="text-sm font-medium">Carregando...</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
