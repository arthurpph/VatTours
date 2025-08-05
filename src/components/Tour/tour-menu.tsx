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
      <div className="bg-opacity-85 relative mx-auto mb-10 flex max-w-md justify-center rounded-lg bg-gray-900 p-3 shadow-md">
         <nav className="flex gap-6">
            {navItems.map((item) => {
               const isActive =
                  (!currentAction && !item.action) ||
                  currentAction === item.action;

               return (
                  <button
                     key={item.label}
                     onClick={() => handleClick(item.action)}
                     className={`relative cursor-pointer px-5 py-2 font-mono text-sm font-semibold tracking-wide transition-all duration-300 select-none ${
                        isActive
                           ? 'border-b-4 border-cyan-300 text-cyan-300 shadow-[0_0_8px_cyan]'
                           : 'border-b-4 border-transparent text-gray-300 hover:border-cyan-300 hover:text-cyan-300'
                     } `}
                     aria-current={isActive ? 'page' : undefined}
                  >
                     {item.label}
                     {!isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-cyan-300 transition-transform duration-300 hover:scale-x-100"></span>
                     )}
                  </button>
               );
            })}
         </nav>

         {isPending && (
            <div className="absolute top-full mt-2 flex w-full justify-center text-cyan-300">
               <svg
                  className="h-6 w-6 animate-spin"
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
                  ></circle>
                  <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
               </svg>
            </div>
         )}
      </div>
   );
}
