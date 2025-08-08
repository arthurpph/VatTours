'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Role } from '@/models/role';
import { Menu, X } from 'lucide-react';
import { Session } from 'next-auth';

type Props = {
   session: Session;
};

export default function HeaderClient({ session }: Props) {
   const [menuOpen, setMenuOpen] = useState(false);
   const [userMenuOpen, setUserMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);
   const userMenuRef = useRef<HTMLDivElement>(null);

   const role = new Role(session.role);

   const closeUserMenu = () => setUserMenuOpen(false);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setMenuOpen(false);
         }
         if (
            userMenuRef.current &&
            !userMenuRef.current.contains(event.target as Node)
         ) {
            setUserMenuOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <header className="relative z-50 flex h-[70px] items-center justify-between border-b border-gray-800/50 bg-black/95 px-6 text-white shadow-xl backdrop-blur-sm md:px-12">
         <div className="text-2xl font-extrabold tracking-tight">
            <Link
               href="/"
               className="rounded-lg px-2 py-1 transition-all duration-300 hover:scale-105 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
               aria-label="Voltar ao início"
            >
               VatTours
            </Link>
         </div>

         <nav
            className="hidden gap-8 text-sm font-medium md:flex"
            role="navigation"
            aria-label="Navegação principal"
         >
            <Link
               href="/"
               className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
               <span className="relative z-10">Home</span>
               <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
               href="/tours"
               className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
               <span className="relative z-10">Tours</span>
               <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
               href="/settings"
               className="group relative rounded-lg px-3 py-2 transition-all duration-300 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
               <span className="relative z-10">Configurações</span>
               <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
         </nav>

         <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white transition-all duration-300 hover:scale-110 hover:bg-gray-900 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none md:hidden"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
         >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         <div ref={userMenuRef} className="relative ml-4">
            <button
               onClick={() => setUserMenuOpen(!userMenuOpen)}
               className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
               aria-label={`Menu do usuário: ${session.user?.name}`}
               aria-expanded={userMenuOpen}
               aria-haspopup="true"
            >
               <span className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-xs font-bold text-white">
                     {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {session.user?.name}
                  <svg
                     className={`h-4 w-4 transition-transform duration-300 ${
                        userMenuOpen ? 'rotate-180' : ''
                     }`}
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                     />
                  </svg>
               </span>
            </button>

            {userMenuOpen && (
               <ul
                  className="absolute right-0 z-50 mt-3 w-48 rounded-xl border border-gray-800 bg-black/95 py-2 text-white shadow-2xl backdrop-blur-sm"
                  role="menu"
                  aria-labelledby="user-menu-button"
               >
                  {role.isAtLeast('admin') && (
                     <li role="none">
                        <Link
                           href="/admin"
                           className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-gray-900 hover:text-blue-400 focus:bg-gray-900 focus:text-blue-400 focus:outline-none"
                           onClick={closeUserMenu}
                           role="menuitem"
                        >
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
                                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                           </svg>
                           Admin
                        </Link>
                     </li>
                  )}
                  <li role="none">
                     <button
                        onClick={() => {
                           closeUserMenu();
                           signOut();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-red-600/20 hover:text-red-400 focus:bg-red-600/20 focus:text-red-400 focus:outline-none"
                        role="menuitem"
                     >
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                           />
                        </svg>
                        Sair
                     </button>
                  </li>
               </ul>
            )}
         </div>

         {menuOpen && (
            <div
               ref={menuRef}
               id="mobile-menu"
               className="absolute top-[70px] left-0 z-20 w-full border-t border-gray-800 bg-black/95 p-6 text-white shadow-2xl backdrop-blur-sm md:hidden"
               role="navigation"
               aria-label="Menu móvel"
            >
               <div className="flex flex-col gap-4">
                  <Link
                     href="/"
                     className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 hover:bg-gray-900 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                     onClick={() => setMenuOpen(false)}
                  >
                     <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                     </svg>
                     Home
                  </Link>
                  <Link
                     href="/tours"
                     className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 hover:bg-gray-900 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                     onClick={() => setMenuOpen(false)}
                  >
                     <svg
                        className="h-5 w-5"
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
                     Tours
                  </Link>
                  <Link
                     href="/settings"
                     className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 hover:bg-gray-900 hover:text-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                     onClick={() => setMenuOpen(false)}
                  >
                     <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                     </svg>
                     Configurações
                  </Link>
               </div>
            </div>
         )}
      </header>
   );
}
