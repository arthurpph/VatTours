'use client';

import CountrySelector from '@/components/Selector/country-selector';
import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { CountryCode } from '@/models/types';
import { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';

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
         alert('Por favor, selecione um país.');
         return;
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
         alert('Aeroporto criado com sucesso!');
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
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-4">
               <div className="flex items-center gap-3">
                  <Link
                     href="/admin"
                     className="flex h-8 w-8 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#f0f6fc]"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#94a3b8]/15">
                     <MapPin className="h-5 w-5 text-[#94a3b8]" />
                  </div>
                  <div>
                     <h1 className="text-xl font-semibold text-[#f0f6fc]">
                        Gerenciar Aeroportos
                     </h1>
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#94a3b8]/15">
                     <Plus className="h-5 w-5 text-[#94a3b8]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">
                     Adicionar Novo Aeroporto
                  </h2>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           Código ICAO
                        </label>
                        <input
                           type="text"
                           value={icao}
                           onChange={(e) =>
                              setIcao(e.target.value.toUpperCase())
                           }
                           placeholder="Ex: SBSP"
                           maxLength={4}
                           className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#94a3b8] focus:ring-1 focus:ring-[#94a3b8] focus:outline-none"
                           required
                        />
                     </div>

                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           Nome do Aeroporto
                        </label>
                        <input
                           type="text"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Ex: Congonhas Airport"
                           className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#94a3b8] focus:ring-1 focus:ring-[#94a3b8] focus:outline-none"
                           required
                        />
                     </div>

                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           País
                        </label>
                        <CountrySelector
                           country={country}
                           setCountry={setCountry}
                        />
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#94a3b8] px-4 py-2 font-medium text-[#0d1117] transition-colors hover:bg-[#cbd5e1] disabled:opacity-50"
                     >
                        {loading ? (
                           <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                           <Save className="h-4 w-4" />
                        )}
                        {loading ? 'Salvando...' : 'Adicionar Aeroporto'}
                     </button>
                  </div>
               </form>
            </div>

            {loading && (
               <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#94a3b8]/15">
                     <RefreshCw className="h-6 w-6 animate-spin text-[#94a3b8]" />
                  </div>
                  <p className="text-lg font-medium text-[#f0f6fc]">
                     Carregando aeroportos...
                  </p>
               </div>
            )}

            {!loading && airports.length === 0 ? (
               <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[#94a3b8]/15">
                     <MapPin className="h-6 w-6 text-[#94a3b8]" />
                  </div>
                  <p className="text-lg font-medium text-[#f0f6fc]">
                     Nenhum aeroporto encontrado
                  </p>
                  <p className="text-sm text-[#7d8590]">
                     Adicione o primeiro aeroporto usando o formulário acima
                  </p>
               </div>
            ) : (
               !loading && (
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-[#f0f6fc]">
                        Aeroportos Cadastrados ({airports.length})
                     </h3>
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {airports.map((airport) => (
                           <div
                              key={airport.icao}
                              className="rounded-md border border-[#21262d] bg-[#161b22] p-4 transition-colors hover:bg-[#21262d]"
                           >
                              <div className="mb-3 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#94a3b8]/15">
                                       <MapPin className="h-5 w-5 text-[#94a3b8]" />
                                    </div>
                                    <div>
                                       <h4 className="font-semibold text-[#f0f6fc]">
                                          {airport.icao}
                                       </h4>
                                       <span className="text-xs text-[#7d8590]">
                                          {airport.country}
                                       </span>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => handleDelete(airport.icao)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#f85149] transition-colors hover:bg-[#f85149]/10"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </button>
                              </div>
                              <p className="text-sm text-[#7d8590]">
                                 {airport.name}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>
               )
            )}
         </div>
      </div>
   );
}
