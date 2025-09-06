'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Info, Route, BarChart3, FileText } from 'lucide-react';

export default function TourMenu() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const currentAction = searchParams.get('action');
   const [isPending, startTransition] = useTransition();

   const navItems = [
      { label: 'Info', action: undefined, icon: Info },
      { label: 'Pernas', action: 'legs', icon: Route },
      { label: 'Status', action: 'status', icon: BarChart3 },
      { label: 'PIREP', action: 'pirep', icon: FileText },
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
      <div className="border-b border-[#21262d]">
         <nav
            className="flex gap-1"
            role="tablist"
            aria-label="Menu de navegação do tour"
         >
            {navItems.map((item) => {
               const isActive =
                  (!currentAction && !item.action) ||
                  currentAction === item.action;

               const Icon = item.icon;

               return (
                  <button
                     key={item.label}
                     onClick={() => handleClick(item.action)}
                     role="tab"
                     aria-selected={isActive}
                     aria-controls={`panel-${item.action || 'info'}`}
                     className={`group flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                        isActive
                           ? 'border-[#2f81f7] text-[#f0f6fc]'
                           : 'border-transparent text-[#7d8590] hover:border-[#21262d] hover:text-[#f0f6fc]'
                     }`}
                     disabled={isPending}
                  >
                     <Icon className="h-4 w-4" />
                     <span>{item.label}</span>
                  </button>
               );
            })}
         </nav>

         {isPending && (
            <div className="flex items-center justify-center py-3">
               <div className="flex items-center gap-2 text-[#7d8590]">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#2f81f7]"></div>
                  <span className="text-sm">Carregando...</span>
               </div>
            </div>
         )}
      </div>
   );
}
