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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 px-6 py-10">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <div className="relative mx-auto max-w-6xl">
            <div className="mb-16 space-y-8 text-center">
               <div className="space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                     <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                     </svg>
                  </div>

                  <h1 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-6xl font-bold text-transparent">
                     Gerenciar Aeroportos
                  </h1>
                  <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
               </div>

               <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                  Adicione e gerencie aeroportos da base de dados para uso nos
                  tours
               </p>
            </div>

            <div className="mb-16 rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm">
               <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500">
                     <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                     </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                     Criar Novo Aeroporto
                  </h2>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                     <div className="space-y-2">
                        <label className="block font-medium text-gray-300">
                           Código ICAO
                        </label>
                        <input
                           type="text"
                           className="w-full rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                           placeholder="Ex: SBGR, KJFK, EGLL"
                           value={icao}
                           onChange={(e) =>
                              setIcao(e.target.value.toUpperCase())
                           }
                           maxLength={4}
                           required
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="block font-medium text-gray-300">
                           País
                        </label>
                        <div className="w-full">
                           <CountrySelector
                              country={country}
                              setCountry={setCountry}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="block font-medium text-gray-300">
                        Nome do Aeroporto
                     </label>
                     <textarea
                        className="w-full resize-none rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                        placeholder="Ex: Aeroporto Internacional de São Paulo/Guarulhos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        rows={3}
                     />
                  </div>

                  <button
                     type="submit"
                     className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                     <span className="relative z-10 flex items-center justify-center gap-2">
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                           />
                        </svg>
                        Criar Aeroporto
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
               </form>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500">
                     <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                     </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                     Aeroportos Cadastrados
                  </h2>
               </div>

               {loading ? (
                  <div className="py-20 text-center">
                     <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                        <svg
                           className="h-8 w-8 animate-spin text-white"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                           />
                        </svg>
                     </div>
                     <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-semibold text-transparent">
                        Carregando aeroportos...
                     </p>
                  </div>
               ) : airports.length === 0 ? (
                  <div className="py-20 text-center">
                     <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-800">
                        <svg
                           className="h-12 w-12 text-gray-400"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                           />
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                           />
                        </svg>
                     </div>
                     <h3 className="mb-2 text-2xl font-bold text-gray-300">
                        Nenhum aeroporto encontrado
                     </h3>
                     <p className="text-gray-400">
                        Adicione o primeiro aeroporto usando o formulário acima.
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-6">
                     {airports.map((airport, index) => (
                        <div
                           key={index}
                           className="group relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                           <div className="relative flex items-center justify-between p-8">
                              <div className="flex items-center gap-6">
                                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500">
                                    <span
                                       className={`fi fi-${airport.country.toLowerCase()} text-2xl`}
                                    ></span>
                                 </div>

                                 <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                       <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                          {airport.icao}
                                       </h3>
                                       <span className="rounded-full border border-blue-500/30 bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
                                          {airport.country}
                                       </span>
                                    </div>
                                    <p className="max-w-2xl leading-relaxed text-gray-300">
                                       {airport.name}
                                    </p>
                                 </div>
                              </div>

                              <button
                                 onClick={() => handleDelete(airport.icao)}
                                 className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                              >
                                 <span className="relative z-10 flex items-center gap-2">
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
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                       />
                                    </svg>
                                    Excluir
                                 </span>
                                 <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
