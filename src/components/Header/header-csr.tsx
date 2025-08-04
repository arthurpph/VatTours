'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Role } from '@/models/role';
import { Menu, X } from 'lucide-react';

type Props = {
   session: any;
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
      <header className="bg-gray-900 text-white shadow-lg h-[70px] px-6 md:px-12 flex items-center justify-between relative z-10">
         <div className="text-2xl font-extrabold tracking-tight">
            <Link href="/" className="hover:text-blue-400 transition-colors">
               VAT Tours
            </Link>
         </div>

         <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">
               Home
            </Link>
            <Link
               href="/tours"
               className="hover:text-blue-400 transition-colors"
            >
               Tours
            </Link>
            <Link
               href="/settings"
               className="hover:text-blue-400 transition-colors"
            >
               Configurações
            </Link>
         </nav>

         <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
         >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         <div ref={userMenuRef} className="relative ml-4">
            <button
               onClick={() => setUserMenuOpen(!userMenuOpen)}
               className="bg-gray-800 px-3 py-1 rounded-xl text-sm font-semibold cursor-pointer hover:scale-115"
            >
               {session.user?.name}
            </button>

            {userMenuOpen && (
               <ul className="absolute right-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg w-40 py-2 z-50 border border-gray-700">
                  {role.isAtLeast('admin') && (
                     <li>
                        <Link
                           href="/admin"
                           className="block px-4 py-2 hover:bg-gray-700 transition-colors"
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
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
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
               className="absolute top-[70px] left-0 w-full bg-gray-900 text-white flex flex-col gap-4 p-4 md:hidden z-20"
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
