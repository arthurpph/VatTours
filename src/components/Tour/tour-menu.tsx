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
      <div className="relative mx-auto mb-10 w-full max-w-md px-4 sm:max-w-xl">
         <div>
            <nav className="flex flex-wrap justify-center gap-3">
               {navItems.map((item) => {
                  const isActive =
                     (!currentAction && !item.action) ||
                     currentAction === item.action;

                  return (
                     <button
                        key={item.label}
                        onClick={() => handleClick(item.action)}
                        className={`min-w-[70px] flex-1 cursor-pointer rounded px-3 py-2 text-center font-mono text-sm font-semibold tracking-wide transition-all duration-300 select-none sm:min-w-[100px] sm:flex-auto sm:px-5 sm:py-2 ${
                           isActive
                              ? 'border-b-4 border-cyan-300 text-cyan-300 shadow-[0_0_8px_cyan]'
                              : 'border-b-4 border-transparent text-gray-300 hover:border-cyan-300 hover:text-cyan-300'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                     >
                        {item.label}
                     </button>
                  );
               })}
            </nav>

            {isPending && (
               <div className="mt-4 flex justify-center text-cyan-300">
                  <svg
                     className="h-6 w-6 animate-spin text-cyan-300"
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
               </div>
            )}
         </div>
      </div>
   );
}
