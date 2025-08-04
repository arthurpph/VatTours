'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function TourMenu() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const currentAction = searchParams.get('action');

   const navItems = [
      { label: 'Info', action: undefined },
      { label: 'Pernas', action: 'legs' },
      { label: 'Status', action: 'status' },
      { label: 'PIREP', action: 'pirep' },
   ];

   const handleClick = useCallback(
      (action: string | undefined) => {
         const params = new URLSearchParams(searchParams.toString());

         if (action) {
            params.set('action', action);
         } else {
            params.delete('action');
         }

         const newUrl = `${pathname}?${params.toString()}`;
         router.push(newUrl);
      },
      [router, pathname, searchParams],
   );

   return (
      <div className="flex justify-center mb-10 bg-gray-900 bg-opacity-85 p-3 rounded-lg shadow-md max-w-md mx-auto">
         <nav className="flex gap-6">
            {navItems.map((item) => {
               const isActive =
                  (!currentAction && !item.action) ||
                  currentAction === item.action;

               return (
                  <button
                     key={item.label}
                     onClick={() => handleClick(item.action)}
                     className={`
                        relative px-5 py-2 font-mono font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer select-none
                        ${
                           isActive
                              ? 'text-cyan-300 border-b-4 border-cyan-300 shadow-[0_0_8px_cyan]'
                              : 'text-gray-300 border-b-4 border-transparent hover:text-cyan-300 hover:border-cyan-300'
                        }
                     `}
                     aria-current={isActive ? 'page' : undefined}
                  >
                     {item.label}
                     {!isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-300 scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100"></span>
                     )}
                  </button>
               );
            })}
         </nav>
      </div>
   );
}
