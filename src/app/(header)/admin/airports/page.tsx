'use client';

import CountrySelector from '@/components/Selector/country-selector';
import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { CountryCode } from '@/models/types';
import { useEffect, useState } from 'react';

type Airport = {
   icao: string;
   name: string;
   country: string;
};

export default function CreateAirportPage() {
   const [icao, setIcao] = useState<string>('');
   const [name, setName] = useState<string>('');
   const [country, setCountry] = useState<CountryCode | ''>('');
   const [airports, setAirports] = useState<Airport[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      fetchAirports();
   }, []);

   const fetchAirports = async () => {
      setLoading(true);
      try {
         const res = await fetch(PUBLIC_API_ROUTES.airports);
         if (res.status === 404) {
            setAirports([]);
            return;
         }

         if (res.ok) {
            const data = await res.json();
            setAirports(data);
         } else {
            alert('Erro ao carregar aeroportos. ' + (await res.json()).message);
         }
      } catch {
         alert('Erro na requisição.');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (country === '') {
      }

      const res = await fetch(ADMIN_API_ROUTES.airports, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ icao, name, country }),
      });

      if (res.ok) {
         fetchAirports();
         setIcao('');
         setName('');
         setCountry('');
      } else {
         alert('Erro ao criar aeroporto. ' + (await res.json()).message);
      }
   };

   const handleDelete = async (icao: string) => {
      if (!confirm('Tem certeza que deseja excluir este aeroporto?')) return;

      const res = await fetch(`${ADMIN_API_ROUTES.airports}/${icao}`, {
         method: 'DELETE',
      });

      if (res.ok) {
         alert('Aeroporto excluído com sucesso!');
         fetchAirports();
      } else {
         alert('Erro ao excluir aeroporto. ' + (await res.json()).message);
      }
   };

   return (
      <div className="min-w-screen min-h-screen max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100">
         <h1 className="text-3xl font-bold mb-6">Criar Novo Aeroporto</h1>
         <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div>
               <label className="block font-medium mb-1">ICAO</label>
               <input
                  type="text"
                  className="w-full max-w-lg border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={icao}
                  onChange={(e) => setIcao(e.target.value)}
                  required
               />
            </div>

            <div>
               <label className="block font-medium mb-1">Name</label>
               <textarea
                  className="w-full max-w-lg border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  rows={3}
               />
            </div>

            <div>
               <label className="block font-medium mb-1">País</label>
               <div className="max-w-lg">
                  <CountrySelector country={country} setCountry={setCountry} />
               </div>
            </div>

            <button
               type="submit"
               className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded mt-4 transition-colors"
            >
               Criar Aeroporto
            </button>
         </form>

         {loading ? (
            <p>Carregando...</p>
         ) : airports.length === 0 ? (
            <p>Nenhum aeroporto encontrado.</p>
         ) : (
            <ul className="space-y-6">
               {airports.map((airport, index) => (
                  <li
                     key={index}
                     className="border border-gray-700 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-800"
                  >
                     <div className="flex items-center gap-4">
                        <div>
                           <h3 className="text-xl font-bold">{airport.icao}</h3>
                           <p>{airport.name}</p>
                           <p>{airport.country}</p>
                        </div>
                     </div>
                     <button
                        onClick={() => handleDelete(airport.icao)}
                        className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded self-start md:self-auto transition-colors"
                     >
                        Excluir
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
