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
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#21262d] bg-[#010409] px-6">
         <div className="flex items-center gap-4">
            <Link
               href="/"
               className="flex items-center gap-2 text-[#f0f6fc] hover:text-[#2f81f7] focus:outline-none"
               aria-label="Voltar ao início"
            >
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d]">
                  <svg
                     className="h-4 w-4"
                     fill="currentColor"
                     viewBox="0 0 16 16"
                  >
                     <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z" />
                  </svg>
               </div>
               <span className="text-lg font-semibold">VatTours</span>
            </Link>
         </div>

         <nav
            className="hidden gap-6 text-sm md:flex"
            role="navigation"
            aria-label="Navegação principal"
         >
            {[
               {
                  href: '/',
                  label: 'Home',
                  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
               },
               {
                  href: '/tours',
                  label: 'Tours',
                  icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
               },
               {
                  href: '/settings',
                  label: 'Configurações',
                  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
               },
            ].map((item) => (
               <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-[#f0f6fc] hover:text-[#2f81f7] focus:outline-none"
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
                        d={item.icon}
                     />
                  </svg>
                  <span>{item.label}</span>
               </Link>
            ))}
         </nav>

         <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-[#f0f6fc] hover:bg-[#21262d] focus:outline-none md:hidden"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
         >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>

         <div ref={userMenuRef} className="relative">
            <button
               onClick={() => setUserMenuOpen(!userMenuOpen)}
               className="flex items-center gap-2 rounded-md border border-[#21262d] bg-[#21262d] px-3 py-1.5 text-sm text-[#f0f6fc] hover:bg-[#30363d] focus:outline-none"
               aria-label={`Menu do usuário: ${session.user?.name}`}
               aria-expanded={userMenuOpen}
               aria-haspopup="true"
            >
               <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f81f7] text-xs font-medium text-white">
                  {session.user?.name?.charAt(0).toUpperCase()}
               </div>
               <span className="hidden sm:inline">{session.user?.name}</span>
               <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
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
            </button>

            {userMenuOpen && (
               <ul
                  className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-[#21262d] bg-[#161b22] py-1 shadow-lg"
                  role="menu"
                  aria-labelledby="user-menu-button"
               >
                  {role.isAtLeast('admin') && (
                     <li role="none">
                        <Link
                           href="/admin"
                           className="flex items-center gap-3 px-3 py-2 text-sm text-[#f0f6fc] hover:bg-[#21262d] focus:bg-[#21262d] focus:outline-none"
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
                     <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#f0f6fc] hover:bg-[#21262d] focus:bg-[#21262d] focus:outline-none"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                           />
                        </svg>
                        Perfil
                     </Link>
                  </li>
                  <li role="none">
                     <button
                        onClick={() => {
                           closeUserMenu();
                           signOut();
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[#f0f6fc] hover:bg-[#da3633]/10 hover:text-[#da3633] focus:bg-[#da3633]/10 focus:text-[#da3633] focus:outline-none"
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
               className="absolute top-16 left-0 z-20 w-full border-t border-[#21262d] bg-[#010409] p-4 shadow-lg md:hidden"
               role="navigation"
               aria-label="Menu móvel"
            >
               <div className="flex flex-col gap-2">
                  <Link
                     href="/"
                     className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#f0f6fc] hover:bg-[#21262d] focus:outline-none"
                     onClick={() => setMenuOpen(false)}
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
                           d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                     </svg>
                     Home
                  </Link>
                  <Link
                     href="/tours"
                     className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#f0f6fc] hover:bg-[#21262d] focus:outline-none"
                     onClick={() => setMenuOpen(false)}
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
                           d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                     </svg>
                     Tours
                  </Link>
                  <Link
                     href="/settings"
                     className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#f0f6fc] hover:bg-[#21262d] focus:outline-none"
                     onClick={() => setMenuOpen(false)}
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
                     Configurações
                  </Link>
               </div>
            </div>
         )}
      </header>
   );
}
