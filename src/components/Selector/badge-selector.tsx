'use client';

import { useState, useEffect } from 'react';
import { ADMIN_API_ROUTES } from '@/config/api-routes';
import { Award, Check } from 'lucide-react';

type Badge = {
   id: number;
   name: string;
   description: string | null;
   icon: string;
};

type BadgeSelectorProps = {
   selectedBadges: number[];
   onSelectionChange: (badgeIds: number[]) => void;
};

export default function BadgeSelector({
   selectedBadges,
   onSelectionChange,
}: BadgeSelectorProps) {
   const [badges, setBadges] = useState<Badge[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchBadges();
   }, []);

   const fetchBadges = async () => {
      try {
         const res = await fetch(ADMIN_API_ROUTES.badges);
         if (res.ok) {
            const data = await res.json();
            setBadges(data);
         }
      } catch (error) {
         console.error('Error fetching badges:', error);
      } finally {
         setLoading(false);
      }
   };

   const toggleBadge = (badgeId: number) => {
      const newSelection = selectedBadges.includes(badgeId)
         ? selectedBadges.filter((id) => id !== badgeId)
         : [...selectedBadges, badgeId];

      onSelectionChange(newSelection);
   };

   if (loading) {
      return (
         <div className="py-4 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-[#8cc8ff]"></div>
            <p className="mt-2 text-sm text-[#7d8590]">Carregando badges...</p>
         </div>
      );
   }

   if (badges.length === 0) {
      return (
         <div className="py-4 text-center">
            <Award className="mx-auto h-8 w-8 text-[#21262d]" />
            <p className="mt-2 text-sm text-[#7d8590]">
               Nenhum badge disponível.
            </p>
            <p className="text-xs text-[#7d8590]">
               Crie badges primeiro na página de gerenciamento.
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-3">
         <p className="text-sm text-[#7d8590]">
            Selecione os badges que os usuários ganharão ao completar este tour:
         </p>
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => {
               const isSelected = selectedBadges.includes(badge.id);
               return (
                  <div
                     key={badge.id}
                     onClick={() => toggleBadge(badge.id)}
                     className={`cursor-pointer rounded-md border p-3 transition-all ${
                        isSelected
                           ? 'border-[#8cc8ff] bg-[#8cc8ff]/10'
                           : 'border-[#21262d] bg-[#0d1117] hover:bg-[#161b22]'
                     }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22]">
                           <img
                              src={badge.icon}
                              alt={badge.name}
                              className="h-5 w-5 object-contain"
                           />
                           {isSelected && (
                              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8cc8ff]">
                                 <Check className="h-3 w-3 text-[#0d1117]" />
                              </div>
                           )}
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-medium text-[#f0f6fc]">
                              {badge.name}
                           </h4>
                           {badge.description && (
                              <p className="line-clamp-1 text-xs text-[#7d8590]">
                                 {badge.description}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
         {selectedBadges.length > 0 && (
            <p className="text-sm text-[#8cc8ff]">
               {selectedBadges.length} badge
               {selectedBadges.length !== 1 ? 's' : ''} selecionado
               {selectedBadges.length !== 1 ? 's' : ''}
            </p>
         )}
      </div>
   );
}
