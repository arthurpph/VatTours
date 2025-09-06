'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Trophy, Star, User, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PUBLIC_API_ROUTES } from '@/config/api-routes';

type UserProfile = {
   id: string;
   name: string;
   email: string;
   image: string | null;
   role: string;
};

type Badge = {
   id: number;
   name: string;
   description: string | null;
   icon: string;
   earnedAt: Date | null;
};

type SearchResult = {
   id: string;
   name: string;
   email: string;
   image: string | null;
   role: string;
};

type Props = {
   profileUser: UserProfile;
   badges: Badge[];
   searchQuery?: string;
   searchResults: SearchResult[];
   isOwnProfile: boolean;
};

export default function ProfilePage({
   profileUser,
   badges,
   searchQuery,
   searchResults: initialSearchResults,
   isOwnProfile,
}: Props) {
   const [search, setSearch] = useState(searchQuery || '');
   const [searchResults, setSearchResults] =
      useState<SearchResult[]>(initialSearchResults);
   const [isSearching, setIsSearching] = useState(false);
   const [showResults, setShowResults] = useState(!!searchQuery);
   const searchTimeout = useRef<NodeJS.Timeout | null>(null);
   const searchRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (searchTimeout.current) {
         clearTimeout(searchTimeout.current);
      }

      if (search.trim().length < 2) {
         setSearchResults([]);
         setShowResults(false);
         return;
      }

      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
         try {
            const response = await fetch(
               `${PUBLIC_API_ROUTES.users}/search?q=${encodeURIComponent(search.trim())}`,
            );
            if (response.ok) {
               const results = await response.json();
               setSearchResults(results);
               setShowResults(true);
            }
         } catch (error) {
            console.error('Erro na busca:', error);
         } finally {
            setIsSearching(false);
         }
      }, 300);

      return () => {
         if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
         }
      };
   }, [search]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
         ) {
            setShowResults(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (search.trim()) {
         window.location.href = `/profile?q=${encodeURIComponent(search.trim())}`;
      }
   };

   const clearSearch = () => {
      setSearch('');
      setSearchResults([]);
      setShowResults(false);
      window.location.href = '/profile';
   };

   const getRoleColor = (role: string) => {
      switch (role) {
         case 'owner':
            return 'text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/20';
         case 'admin':
            return 'text-[#d29922] bg-[#d29922]/10 border border-[#d29922]/20';
         case 'moderator':
            return 'text-[#a5a5a5] bg-[#a5a5a5]/10 border border-[#a5a5a5]/20';
         default:
            return 'text-[#7d8590] bg-[#7d8590]/10 border border-[#7d8590]/20';
      }
   };

   const formatRole = (role: string) => {
      switch (role) {
         case 'owner':
            return 'Proprietário';
         case 'admin':
            return 'Administrador';
         case 'moderator':
            return 'Moderador';
         default:
            return 'Usuário';
      }
   };

   return (
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-6">
               <div className="mb-4" ref={searchRef}>
                  <form
                     onSubmit={handleSearchSubmit}
                     className="mx-auto max-w-md"
                  >
                     <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#7d8590]" />
                        <input
                           type="text"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           onFocus={() =>
                              search.length >= 2 && setShowResults(true)
                           }
                           placeholder="Pesquisar usuários..."
                           className="w-full rounded-md border border-[#21262d] bg-[#0d1117] py-2 pr-10 pl-10 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
                        />
                        {search && (
                           <button
                              type="button"
                              onClick={clearSearch}
                              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#7d8590] hover:text-[#f0f6fc]"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        )}

                        {showResults && (
                           <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-80 overflow-y-auto rounded-md border border-[#21262d] bg-[#161b22] shadow-xl">
                              {isSearching ? (
                                 <div className="p-4 text-center">
                                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-b-2 border-[#58a6ff]"></div>
                                    <p className="mt-2 text-sm text-[#7d8590]">
                                       Procurando...
                                    </p>
                                 </div>
                              ) : searchResults.length > 0 ? (
                                 <div className="p-2">
                                    {searchResults.map((user) => (
                                       <Link
                                          key={user.id}
                                          href={`/profile?user=${user.id}`}
                                          className="block rounded-md p-3 transition-colors hover:bg-[#21262d]"
                                          onClick={() => setShowResults(false)}
                                       >
                                          <div className="flex items-center gap-3">
                                             <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#21262d]">
                                                {user.image ? (
                                                   <Image
                                                      src={user.image}
                                                      alt={user.name}
                                                      width={32}
                                                      height={32}
                                                      className="h-full w-full object-cover"
                                                   />
                                                ) : (
                                                   <User className="h-4 w-4 text-[#7d8590]" />
                                                )}
                                             </div>
                                             <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                   <span className="text-sm font-medium text-[#f0f6fc]">
                                                      {user.name}
                                                   </span>
                                                   <span
                                                      className={`rounded-full px-2 py-0.5 text-xs ${getRoleColor(user.role)}`}
                                                   >
                                                      {formatRole(user.role)}
                                                   </span>
                                                </div>
                                                <p className="text-xs text-[#7d8590]">
                                                   ID: {user.id}
                                                </p>
                                             </div>
                                          </div>
                                       </Link>
                                    ))}
                                 </div>
                              ) : search.length >= 2 ? (
                                 <div className="p-4 text-center">
                                    <p className="text-sm text-[#7d8590]">
                                       Nenhum usuário encontrado.
                                    </p>
                                 </div>
                              ) : null}
                           </div>
                        )}
                     </div>
                  </form>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#21262d]">
                     {profileUser.image ? (
                        <Image
                           src={profileUser.image}
                           alt={profileUser.name}
                           width={80}
                           height={80}
                           className="h-full w-full object-cover"
                        />
                     ) : (
                        <User className="h-10 w-10 text-[#7d8590]" />
                     )}
                  </div>

                  <div className="flex-1">
                     <h1 className="mb-2 text-2xl font-semibold text-[#f0f6fc]">
                        {profileUser.name}
                     </h1>
                     <p className="mb-3 text-[#7d8590]">ID: {profileUser.id}</p>
                     <div className="flex flex-wrap items-center gap-3">
                        <span
                           className={`rounded-full px-3 py-1 text-sm font-medium ${getRoleColor(profileUser.role)}`}
                        >
                           {formatRole(profileUser.role)}
                        </span>
                        {isOwnProfile && (
                           <Link
                              href="/settings"
                              className="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm font-medium text-[#f0f6fc] transition-colors hover:border-[#484f58] hover:bg-[#30363d]"
                           >
                              Editar Perfil
                           </Link>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-2 flex items-center gap-2">
                     <Trophy className="h-5 w-5 text-[#d29922]" />
                     <h3 className="font-medium text-[#f0f6fc]">Badges</h3>
                  </div>
                  <p className="text-2xl font-semibold text-[#d29922]">
                     {badges.length}
                  </p>
                  <p className="text-sm text-[#7d8590]">
                     Conquistas desbloqueadas
                  </p>
               </div>

               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-2 flex items-center gap-2">
                     <MapPin className="h-5 w-5 text-[#58a6ff]" />
                     <h3 className="font-medium text-[#f0f6fc]">Tours</h3>
                  </div>
                  <p className="text-2xl font-semibold text-[#58a6ff]">0</p>
                  <p className="text-sm text-[#7d8590]">Tours completados</p>
               </div>

               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-2 flex items-center gap-2">
                     <Star className="h-5 w-5 text-[#a5a5a5]" />
                     <h3 className="font-medium text-[#f0f6fc]">Ranking</h3>
                  </div>
                  <p className="text-2xl font-semibold text-[#a5a5a5]">-</p>
                  <p className="text-sm text-[#7d8590]">Posição global</p>
               </div>
            </div>

            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#f0f6fc]">
                  <Trophy className="h-5 w-5 text-[#d29922]" />
                  Badges e Conquistas
               </h2>

               {badges.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {badges.map((badge) => (
                        <div
                           key={badge.id}
                           className="rounded-md border border-[#21262d] bg-[#0d1117] p-4 transition-colors hover:bg-[#21262d]"
                        >
                           <div className="mb-3 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d29922]/30 bg-[#d29922]/20">
                                 <Image
                                    src={badge.icon}
                                    alt={badge.name}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                 />
                              </div>
                              <div>
                                 <h3 className="font-medium text-[#f0f6fc]">
                                    {badge.name}
                                 </h3>
                                 <p className="text-xs text-[#7d8590]">
                                    <Calendar className="mr-1 inline h-3 w-3" />
                                    {badge.earnedAt
                                       ? new Date(
                                            badge.earnedAt,
                                         ).toLocaleDateString('pt-BR')
                                       : 'Data não disponível'}
                                 </p>
                              </div>
                           </div>
                           {badge.description && (
                              <p className="text-sm text-[#7d8590]">
                                 {badge.description}
                              </p>
                           )}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-12 text-center">
                     <Trophy className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                     <p className="text-lg text-[#7d8590]">
                        {isOwnProfile
                           ? 'Você ainda não possui badges.'
                           : 'Este usuário ainda não possui badges.'}
                     </p>
                     <p className="mt-2 text-sm text-[#7d8590]">
                        Complete tours e desafios para ganhar badges!
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
