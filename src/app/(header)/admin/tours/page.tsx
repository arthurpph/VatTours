'use client';

import AirportSelector from '@/components/Selector/airport-selector';
import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type LegInput = {
   description: string;
   departureIcao: string;
   arrivalIcao: string;
};

type Tour = {
   id: number;
   title: string;
   description: string;
   image: string;
   legs: LegInput[];
};

export default function TourManagePage() {
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [image, setImage] = useState('');
   const [legs, setLegs] = useState<LegInput[]>([
      { description: '', departureIcao: '', arrivalIcao: '' },
   ]);

   const [tours, setTours] = useState<Tour[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      fetchTours();
   }, []);

   const fetchTours = async () => {
      setLoading(true);
      try {
         const res = await fetch(PUBLIC_API_ROUTES.tours);
         if (res.ok) {
            const data = await res.json();
            setTours(data);
         } else {
            alert('Erro ao carregar tours. ' + (await res.json()).message);
         }
      } catch {
         alert('Erro na requisição');
      } finally {
         setLoading(false);
      }
   };

   const handleAddLeg = () => {
      setLegs([
         ...legs,
         { description: '', departureIcao: '', arrivalIcao: '' },
      ]);
   };

   const handleRemoveLeg = (index: number) => {
      const newLegs = [...legs];
      newLegs.splice(index, 1);
      setLegs(newLegs);
   };

   const handleLegChange = (
      index: number,
      field: keyof LegInput,
      value: string,
   ) => {
      const newLegs = [...legs];
      newLegs[index][field] = value;
      setLegs(newLegs);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch(ADMIN_API_ROUTES.tours, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title, description, image, legs }),
      });

      if (res.ok) {
         alert('Tour criado com sucesso!');
         fetchTours();
         setTitle('');
         setDescription('');
         setImage('');
         setLegs([{ description: '', departureIcao: '', arrivalIcao: '' }]);
      } else {
         alert('Erro ao criar tour. ' + (await res.json()).message);
      }
   };

   const handleDelete = async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir este tour?')) return;

      const res = await fetch(`${ADMIN_API_ROUTES.tours}/${id}`, {
         method: 'DELETE',
      });

      if (res.ok) {
         alert('Tour excluído com sucesso!');
         fetchTours();
      } else {
         alert('Erro ao excluir tour. ' + (await res.json()).message);
      }
   };

   return (
      <div className="mx-auto max-w-4xl min-w-screen bg-gray-900 p-6 text-gray-100">
         <h1 className="mb-6 text-3xl font-bold">Criar Novo Tour</h1>
         <form onSubmit={handleSubmit} className="mb-10 space-y-6">
            <div>
               <label className="mb-1 block font-medium">Título</label>
               <input
                  type="text"
                  className="w-full max-w-lg rounded border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
               />
            </div>

            <div>
               <label className="mb-1 block font-medium">Descrição</label>
               <textarea
                  className="w-full max-w-lg rounded border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
               />
            </div>

            <div>
               <label className="mb-1 block font-medium">Imagem (URL)</label>
               <input
                  type="text"
                  className="w-full max-w-lg rounded border border-gray-700 bg-gray-800 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
               />
            </div>

            <div>
               <h2 className="mb-4 text-xl font-semibold">Legs</h2>
               {legs.map((leg, index) => (
                  <div
                     key={index}
                     className="mb-6 space-y-4 rounded border border-gray-700 bg-gray-800 p-4"
                  >
                     <div>
                        <label className="mb-1 block font-medium">
                           Descrição
                        </label>
                        <textarea
                           className="w-full max-w-lg rounded border border-gray-700 bg-gray-700 p-2 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           value={leg.description}
                           onChange={(e) =>
                              handleLegChange(
                                 index,
                                 'description',
                                 e.target.value,
                              )
                           }
                           rows={3}
                        />
                     </div>
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                           <label className="mb-1 block font-medium">
                              Departure ICAO
                           </label>
                           <AirportSelector
                              airport={leg.departureIcao}
                              setAirport={(value) =>
                                 handleLegChange(index, 'departureIcao', value)
                              }
                           />
                        </div>
                        <div>
                           <label className="mb-1 block font-medium">
                              Arrival ICAO
                           </label>
                           <AirportSelector
                              airport={leg.arrivalIcao}
                              setAirport={(value) =>
                                 handleLegChange(index, 'arrivalIcao', value)
                              }
                           />
                        </div>
                     </div>

                     {legs.length > 1 && (
                        <button
                           type="button"
                           onClick={() => handleRemoveLeg(index)}
                           className="mt-2 text-sm text-red-500 transition-colors hover:text-red-400"
                        >
                           Remover Leg
                        </button>
                     )}
                  </div>
               ))}
               <button
                  type="button"
                  onClick={handleAddLeg}
                  className="rounded bg-indigo-600 px-5 py-2 text-white transition-colors hover:bg-indigo-500"
               >
                  Adicionar Leg
               </button>
            </div>

            <button
               type="submit"
               className="mt-6 rounded bg-green-600 px-8 py-3 text-white transition-colors hover:bg-green-500"
            >
               Criar Tour
            </button>
         </form>

         <hr className="my-8 border-gray-700" />

         <h2 className="mb-4 text-2xl font-semibold">Tours Existentes</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : tours.length === 0 ? (
            <p>Nenhum tour encontrado.</p>
         ) : (
            <ul className="space-y-6">
               {tours.map((tour) => (
                  <li
                     key={tour.id}
                     className="flex flex-col gap-4 rounded border border-gray-700 bg-gray-800 p-4 md:flex-row md:items-center md:justify-between"
                  >
                     <div className="flex items-center gap-4">
                        {tour.image && (
                           <Image
                              src={`${tour.image}`}
                              alt={tour.title}
                              width={1000}
                              height={1000}
                              className="h-16 w-24 rounded object-cover"
                           />
                        )}
                        <div>
                           <h3 className="text-xl font-bold">{tour.title}</h3>
                           <p>{tour.description}</p>
                           <p className="mt-1 text-sm">
                              Legs: {tour.legs.length}
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => handleDelete(tour.id)}
                        className="self-start rounded bg-red-600 px-5 py-2 text-white transition-colors hover:bg-red-500 md:self-auto"
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
