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
      <div className="min-w-screen max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100">
         <h1 className="text-3xl font-bold mb-6">Criar Novo Tour</h1>
         <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div>
               <label className="block font-medium mb-1">Título</label>
               <input
                  type="text"
                  className="w-full max-w-lg border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
               />
            </div>

            <div>
               <label className="block font-medium mb-1">Descrição</label>
               <textarea
                  className="w-full max-w-lg border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
               />
            </div>

            <div>
               <label className="block font-medium mb-1">Imagem (URL)</label>
               <input
                  type="text"
                  className="w-full max-w-lg border border-gray-700 bg-gray-800 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
               />
            </div>

            <div>
               <h2 className="text-xl font-semibold mb-4">Legs</h2>
               {legs.map((leg, index) => (
                  <div
                     key={index}
                     className="border border-gray-700 p-4 mb-6 rounded space-y-4 bg-gray-800"
                  >
                     <div>
                        <label className="block font-medium mb-1">
                           Descrição
                        </label>
                        <textarea
                           className="w-full max-w-lg border border-gray-700 bg-gray-700 p-2 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block font-medium mb-1">
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
                           <label className="block font-medium mb-1">
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
                           className="text-red-500 text-sm mt-2 hover:text-red-400 transition-colors"
                        >
                           Remover Leg
                        </button>
                     )}
                  </div>
               ))}
               <button
                  type="button"
                  onClick={handleAddLeg}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded transition-colors"
               >
                  Adicionar Leg
               </button>
            </div>

            <button
               type="submit"
               className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded mt-6 transition-colors"
            >
               Criar Tour
            </button>
         </form>

         <hr className="my-8 border-gray-700" />

         <h2 className="text-2xl font-semibold mb-4">Tours Existentes</h2>

         {loading ? (
            <p>Carregando...</p>
         ) : tours.length === 0 ? (
            <p>Nenhum tour encontrado.</p>
         ) : (
            <ul className="space-y-6">
               {tours.map((tour) => (
                  <li
                     key={tour.id}
                     className="border border-gray-700 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-800"
                  >
                     <div className="flex items-center gap-4">
                        {tour.image && (
                           <Image
                              src={`${tour.image}`}
                              alt={tour.title}
                              width={1000}
                              height={1000}
                              className="w-24 h-16 object-cover rounded"
                           />
                        )}
                        <div>
                           <h3 className="text-xl font-bold">{tour.title}</h3>
                           <p>{tour.description}</p>
                           <p className="text-sm mt-1">
                              Legs: {tour.legs.length}
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => handleDelete(tour.id)}
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
