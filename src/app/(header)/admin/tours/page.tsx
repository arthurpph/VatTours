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
   const [editingTour, setEditingTour] = useState<Tour | null>(null);
   const [isEditing, setIsEditing] = useState(false);

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
      
      const url = isEditing && editingTour 
         ? `${ADMIN_API_ROUTES.tours}/${editingTour.id}`
         : ADMIN_API_ROUTES.tours;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
         method,
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title, description, image, legs }),
      });

      if (res.ok) {
         alert(isEditing ? 'Tour atualizado com sucesso!' : 'Tour criado com sucesso!');
         fetchTours();
         resetForm();
      } else {
         alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} tour. ` + (await res.json()).message);
      }
   };

   const resetForm = () => {
      setTitle('');
      setDescription('');
      setImage('');
      setLegs([{ description: '', departureIcao: '', arrivalIcao: '' }]);
      setEditingTour(null);
      setIsEditing(false);
   };

   const handleEdit = (tour: Tour) => {
      setTitle(tour.title);
      setDescription(tour.description || '');
      setImage(tour.image);
      setLegs(tour.legs.length > 0 ? tour.legs : [{ description: '', departureIcao: '', arrivalIcao: '' }]);
      setEditingTour(tour);
      setIsEditing(true);
   };

   const handleMoveLegUp = (index: number) => {
      if (index > 0) {
         const newLegs = [...legs];
         [newLegs[index - 1], newLegs[index]] = [newLegs[index], newLegs[index - 1]];
         setLegs(newLegs);
      }
   };

   const handleMoveLegDown = (index: number) => {
      if (index < legs.length - 1) {
         const newLegs = [...legs];
         [newLegs[index], newLegs[index + 1]] = [newLegs[index + 1], newLegs[index]];
         setLegs(newLegs);
      }
   };

   const handleCancelEdit = () => {
      resetForm();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 px-6 py-10">
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-600/10 blur-3xl"></div>
            <div className="absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-600/10 to-blue-600/10 blur-3xl"></div>
         </div>

         <div className="relative mx-auto max-w-7xl">
            <div className="mb-16 space-y-8 text-center">
               <div className="space-y-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
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
                           d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                     </svg>
                  </div>

                  <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-6xl font-bold text-transparent">
                     Gerenciar Tours
                  </h1>
                  <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
               </div>

               <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
                  Crie e gerencie tours de voo para a comunidade de pilotos
                  virtuais
               </p>
            </div>

            <div className="mb-16 rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm">
               {isEditing && editingTour && (
                  <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4">
                     <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                           <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                           </svg>
                        </div>
                        <div>
                           <h3 className="font-semibold text-blue-400">Editando Tour</h3>
                           <p className="text-sm text-blue-300">Modificando: {editingTour.title}</p>
                        </div>
                     </div>
                  </div>
               )}
               <div className="mb-8 flex items-center gap-4">
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
                           d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                     </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                     {isEditing ? 'Editar Tour' : 'Criar Novo Tour'}
                  </h2>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                     <div className="space-y-2">
                        <label className="block font-medium text-gray-300">
                           Título do Tour
                        </label>
                        <input
                           type="text"
                           className="w-full rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                           placeholder="Ex: Tour Europa Central"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="block font-medium text-gray-300">
                           URL da Imagem
                        </label>
                        <input
                           type="text"
                           className="w-full rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                           placeholder="https://exemplo.com/imagem.jpg"
                           value={image}
                           onChange={(e) => setImage(e.target.value)}
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="block font-medium text-gray-300">
                        Descrição
                     </label>
                     <textarea
                        className="w-full resize-none rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="Descreva o tour, destinos e características especiais..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                     />
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-teal-500">
                              <span className="text-sm font-bold text-white">
                                 {legs.length}
                              </span>
                           </div>
                           Pernas do Tour
                        </h3>
                        <button
                           type="button"
                           onClick={handleAddLeg}
                           className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
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
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                 />
                              </svg>
                              Adicionar Perna
                           </span>
                           <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                     </div>

                     <div className="space-y-6">
                        {legs.map((leg, index) => (
                           <div
                              key={index}
                              className="group relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                              <div className="relative space-y-6">
                                 <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-3 text-xl font-bold text-white">
                                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                                          <span className="text-sm font-bold text-white">
                                             {index + 1}
                                          </span>
                                       </div>
                                       Perna {index + 1}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                       {legs.length > 1 && (
                                          <div className="flex gap-1">
                                             <button
                                                type="button"
                                                onClick={() => handleMoveLegUp(index)}
                                                disabled={index === 0}
                                                className="rounded-full p-2 text-blue-400 transition-colors hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Mover para cima"
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
                                                      d="M5 15l7-7 7 7"
                                                   />
                                                </svg>
                                             </button>
                                             <button
                                                type="button"
                                                onClick={() => handleMoveLegDown(index)}
                                                disabled={index === legs.length - 1}
                                                className="rounded-full p-2 text-blue-400 transition-colors hover:bg-blue-500/10 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Mover para baixo"
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
                                                      d="M19 9l-7 7-7-7"
                                                   />
                                                </svg>
                                             </button>
                                          </div>
                                       )}
                                       {legs.length > 1 && (
                                          <button
                                             type="button"
                                             onClick={() => handleRemoveLeg(index)}
                                             className="rounded-full p-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                             title="Remover perna"
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
                                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                             </svg>
                                          </button>
                                       )}
                                    </div>
                                 </div>

                                 <div className="space-y-4">
                                    <div className="space-y-2">
                                       <label className="block font-medium text-gray-300">
                                          Descrição da Perna
                                       </label>
                                       <textarea
                                          className="w-full resize-none rounded-2xl border border-gray-600/50 bg-gray-800/50 p-4 text-gray-100 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                          placeholder="Descreva esta etapa do tour..."
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
                                       <div className="space-y-2">
                                          <label className="block font-medium text-gray-300">
                                             Aeroporto de Partida
                                          </label>
                                          <AirportSelector
                                             airport={leg.departureIcao}
                                             setAirport={(value) =>
                                                handleLegChange(
                                                   index,
                                                   'departureIcao',
                                                   value,
                                                )
                                             }
                                          />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="block font-medium text-gray-300">
                                             Aeroporto de Chegada
                                          </label>
                                          <AirportSelector
                                             airport={leg.arrivalIcao}
                                             setAirport={(value) =>
                                                handleLegChange(
                                                   index,
                                                   'arrivalIcao',
                                                   value,
                                                )
                                             }
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button
                        type="submit"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
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
                                 d="M5 13l4 4L19 7"
                              />
                           </svg>
                           {isEditing ? 'Atualizar Tour' : 'Criar Tour'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     </button>
                     
                     {isEditing && (
                        <button
                           type="button"
                           onClick={handleCancelEdit}
                           className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
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
                                    d="M6 18L18 6M6 6l12 12"
                                 />
                              </svg>
                              Cancelar
                           </span>
                           <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                     )}
                  </div>
               </form>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500">
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
                     Tours Existentes
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
                        Carregando tours...
                     </p>
                  </div>
               ) : tours.length === 0 ? (
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
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                           />
                        </svg>
                     </div>
                     <h3 className="mb-2 text-2xl font-bold text-gray-300">
                        Nenhum tour encontrado
                     </h3>
                     <p className="text-gray-400">
                        Crie o primeiro tour usando o formulário acima.
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-6">
                     {tours.map((tour) => (
                        <div
                           key={tour.id}
                           className="group relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                           <div className="relative flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
                              <div className="flex flex-1 flex-col items-start gap-6 sm:flex-row sm:items-center">
                                 {tour.image && (
                                    <div className="relative overflow-hidden rounded-2xl border border-gray-600/50">
                                       <Image
                                          src={tour.image}
                                          alt={tour.title}
                                          width={1000}
                                          height={1000}
                                          className="h-20 w-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                       />
                                    </div>
                                 )}

                                 <div className="flex-1 space-y-3">
                                    <div className="space-y-2">
                                       <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                                          {tour.title}
                                       </h3>
                                       <p className="leading-relaxed text-gray-300">
                                          {tour.description}
                                       </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                       <div className="rounded-full border border-blue-500/30 bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
                                          {tour.legs.length} pernas
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex gap-3">
                                 <button
                                    onClick={() => handleEdit(tour)}
                                    className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
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
                                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                       </svg>
                                       Editar
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                                 </button>

                                 <button
                                    onClick={() => handleDelete(tour.id)}
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
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
