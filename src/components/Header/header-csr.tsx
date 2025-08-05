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
      <header className="relative z-10 flex h-[70px] items-center justify-between bg-gray-900 px-6 text-white shadow-lg md:px-12">
         <div className="text-2xl font-extrabold tracking-tight">
            <Link href="/" className="transition-colors hover:text-blue-400">
               VatTours
            </Link>
         </div>

         <nav className="hidden gap-8 text-sm font-medium md:flex">
            <Link href="/" className="transition-colors hover:text-blue-400">
               Home
            </Link>
            <Link
               href="/tours"
               className="transition-colors hover:text-blue-400"
            >
               Tours
            </Link>
            <Link
               href="/settings"
               className="transition-colors hover:text-blue-400"
            >
               Configurações
            </Link>
         </nav>

         <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white md:hidden"
         >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         <div ref={userMenuRef} className="relative ml-4">
            <button
               onClick={() => setUserMenuOpen(!userMenuOpen)}
               className="cursor-pointer rounded-xl bg-gray-800 px-3 py-1 text-sm font-semibold hover:scale-115"
            >
               {session.user?.name}
            </button>

            {userMenuOpen && (
               <ul className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-gray-700 bg-gray-800 py-2 text-white shadow-lg">
                  {role.isAtLeast('admin') && (
                     <li>
                        <Link
                           href="/admin"
                           className="block px-4 py-2 transition-colors hover:bg-gray-700"
                           onClick={closeUserMenu}
                        >
                           Admin
                        </Link>
                     </li>
                  )}
                  <li>
                     <button
                        onClick={() => {
                           closeUserMenu();
                           signOut();
                        }}
                        className="w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-700"
                     >
                        Sair
                     </button>
                  </li>
               </ul>
            )}
         </div>

         {menuOpen && (
            <div
               ref={menuRef}
               className="absolute top-[70px] left-0 z-20 flex w-full flex-col gap-4 bg-gray-900 p-4 text-white md:hidden"
            >
               <Link
                  href="/"
                  className="hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
               >
                  Home
               </Link>
               <Link
                  href="/tours"
                  className="hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
               >
                  Tours
               </Link>
               <Link
                  href="/settings"
                  className="hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
               >
                  Configurações
               </Link>
            </div>
         )}
      </header>
   );
}
