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
            return 'text-red-400 bg-red-400/10';
         case 'admin':
            return 'text-orange-400 bg-orange-400/10';
         case 'moderator':
            return 'text-purple-400 bg-purple-400/10';
         default:
            return 'text-blue-400 bg-blue-400/10';
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-float-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div
               className="animate-float-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl"
               style={{ animationDelay: '2s' }}
            ></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="mb-8" ref={searchRef}>
               <form
                  onSubmit={handleSearchSubmit}
                  className="mx-auto max-w-2xl"
               >
                  <div className="relative">
                     <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                     <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() =>
                           search.length >= 2 && setShowResults(true)
                        }
                        placeholder="Pesquisar usuários por nome ou ID..."
                        className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pr-12 pl-10 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                     />
                     {search && (
                        <button
                           type="button"
                           onClick={clearSearch}
                           className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
                        >
                           <X className="h-5 w-5" />
                        </button>
                     )}
                  </div>
               </form>

               {showResults && (
                  <div className="relative mx-auto max-w-2xl">
                     <div className="absolute top-2 right-0 left-0 z-10 max-h-80 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800/95 shadow-xl backdrop-blur-sm">
                        {isSearching ? (
                           <div className="p-4 text-center">
                              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                              <p className="mt-2 text-gray-400">
                                 Procurando...
                              </p>
                           </div>
                        ) : searchResults.length > 0 ? (
                           <div className="p-2">
                              <div className="mb-2 px-2 py-1 text-sm text-gray-400">
                                 {searchResults.length} resultado(s)
                                 encontrado(s)
                              </div>
                              {searchResults.map((user) => (
                                 <Link
                                    key={user.id}
                                    href={`/profile?user=${user.id}`}
                                    className="block rounded-lg p-3 transition-colors hover:bg-gray-700/50"
                                    onClick={() => setShowResults(false)}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                                          {user.image ? (
                                             <Image
                                                src={user.image}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                                className="h-full w-full object-cover"
                                             />
                                          ) : (
                                             <User className="h-5 w-5 text-gray-400" />
                                          )}
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                             <span className="font-medium">
                                                {user.name}
                                             </span>
                                             <span
                                                className={`rounded-full px-2 py-1 text-xs ${getRoleColor(user.role)}`}
                                             >
                                                {formatRole(user.role)}
                                             </span>
                                          </div>
                                          <p className="text-sm text-gray-400">
                                             ID: {user.id}
                                          </p>
                                       </div>
                                    </div>
                                 </Link>
                              ))}
                           </div>
                        ) : search.length >= 2 ? (
                           <div className="p-4 text-center">
                              <p className="text-gray-400">
                                 Nenhum usuário encontrado.
                              </p>
                           </div>
                        ) : null}
                     </div>
                  </div>
               )}
            </div>

            <div className="mx-auto max-w-4xl">
               <div className="mb-8 rounded-xl border border-gray-700 bg-gray-800/30 p-8 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                     <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500 bg-gray-700">
                        {profileUser.image ? (
                           <Image
                              src={profileUser.image}
                              alt={profileUser.name}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                           />
                        ) : (
                           <User className="h-12 w-12 text-gray-400" />
                        )}
                     </div>

                     <div className="flex-1 text-center md:text-left">
                        <h1 className="mb-2 text-3xl font-bold">
                           {profileUser.name}
                        </h1>
                        <p className="mb-3 text-gray-400">
                           ID: {profileUser.id}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                           <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${getRoleColor(profileUser.role)}`}
                           >
                              {formatRole(profileUser.role)}
                           </span>
                           {isOwnProfile && (
                              <Link
                                 href="/settings"
                                 className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium transition-colors hover:bg-blue-700"
                              >
                                 Editar Perfil
                              </Link>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
                     <div className="mb-2 flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-lg font-semibold">Badges</h3>
                     </div>
                     <p className="text-3xl font-bold text-yellow-400">
                        {badges.length}
                     </p>
                     <p className="text-sm text-gray-400">
                        Conquistas desbloqueadas
                     </p>
                  </div>

                  <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
                     <div className="mb-2 flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-semibold">Tours</h3>
                     </div>
                     <p className="text-3xl font-bold text-green-400">0</p>
                     <p className="text-sm text-gray-400">Tours completados</p>
                  </div>

                  <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
                     <div className="mb-2 flex items-center gap-3">
                        <Star className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-semibold">Ranking</h3>
                     </div>
                     <p className="text-3xl font-bold text-purple-400">-</p>
                     <p className="text-sm text-gray-400">Posição global</p>
                  </div>
               </div>

               <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-8 backdrop-blur-sm">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                     <Trophy className="h-6 w-6 text-yellow-400" />
                     Badges e Conquistas
                  </h2>

                  {badges.length > 0 ? (
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {badges.map((badge) => (
                           <div
                              key={badge.id}
                              className="rounded-lg border border-gray-600 bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/50"
                           >
                              <div className="mb-2 flex items-center gap-3">
                                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
                                    <span className="text-2xl">
                                       {badge.icon}
                                    </span>
                                 </div>
                                 <div>
                                    <h3 className="font-semibold">
                                       {badge.name}
                                    </h3>
                                    <p className="text-xs text-gray-400">
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
                                 <p className="text-sm text-gray-300">
                                    {badge.description}
                                 </p>
                              )}
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="py-12 text-center">
                        <Trophy className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                        <p className="text-lg text-gray-400">
                           {isOwnProfile
                              ? 'Você ainda não possui badges.'
                              : 'Este usuário ainda não possui badges.'}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                           Complete tours e desafios para ganhar badges!
                        </p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
