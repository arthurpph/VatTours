'use client';

import AirportSelector from '@/components/Selector/airport-selector';
import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { isValidUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Compass, Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
         alert('Erro inesperado ao carregar tours.');
      } finally {
         setLoading(false);
      }
   };

   const addLeg = () => {
      setLegs([
         ...legs,
         { description: '', departureIcao: '', arrivalIcao: '' },
      ]);
   };

   const removeLeg = (index: number) => {
      if (legs.length > 1) {
         setLegs(legs.filter((_, i) => i !== index));
      }
   };

   const updateLeg = (index: number, field: keyof LegInput, value: string) => {
      const updatedLegs = legs.map((leg, i) =>
         i === index ? { ...leg, [field]: value } : leg,
      );
      setLegs(updatedLegs);
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
      setDescription(tour.description);
      setImage(tour.image);
      setLegs(tour.legs);
      setEditingTour(tour);
      setIsEditing(true);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !description.trim()) {
         alert('Título e descrição são obrigatórios.');
         return;
      }

      if (
         legs.some(
            (leg) =>
               !leg.description.trim() ||
               !leg.departureIcao ||
               !leg.arrivalIcao,
         )
      ) {
         alert('Todos os campos dos legs são obrigatórios.');
         return;
      }

      if (image && !isValidUrl(image)) {
         alert('A URL da imagem não é válida.');
         return;
      }

      setLoading(true);

      try {
         const tourData = { title, description, image, legs };
         const url = isEditing
            ? `${ADMIN_API_ROUTES.tours}/${editingTour?.id}`
            : ADMIN_API_ROUTES.tours;
         const method = isEditing ? 'PUT' : 'POST';

         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tourData),
         });

         if (res.ok) {
            alert(
               isEditing
                  ? 'Tour atualizado com sucesso!'
                  : 'Tour criado com sucesso!',
            );
            resetForm();
            fetchTours();
         } else {
            const errorData = await res.json();
            alert(`Erro: ${errorData.message}`);
         }
      } catch {
         alert('Erro inesperado ao salvar tour.');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir este tour?')) return;

      setLoading(true);
      try {
         const res = await fetch(`${ADMIN_API_ROUTES.tours}/${id}`, {
            method: 'DELETE',
         });

         if (res.ok) {
            alert('Tour excluído com sucesso!');
            fetchTours();
         } else {
            const errorData = await res.json();
            alert(`Erro: ${errorData.message}`);
         }
      } catch {
         alert('Erro inesperado ao excluir tour.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#0d1117]">
         {/* GitHub-style header */}
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-4">
               <div className="flex items-center gap-3">
                  <Link
                     href="/admin"
                     className="flex h-8 w-8 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#f0f6fc]"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2f81f7]/20">
                     <Compass className="h-5 w-5 text-[#2f81f7]" />
                  </div>
                  <div>
                     <h1 className="text-xl font-semibold text-[#f0f6fc]">
                        Gerenciar Tours
                     </h1>
                  </div>
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Form Section */}
            <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#238636]/20">
                     {isEditing ? (
                        <Edit2 className="h-5 w-5 text-[#238636]" />
                     ) : (
                        <Plus className="h-5 w-5 text-[#238636]" />
                     )}
                  </div>
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">
                     {isEditing ? 'Editar Tour' : 'Criar Novo Tour'}
                  </h2>
                  {isEditing && (
                     <button
                        onClick={resetForm}
                        className="ml-auto flex items-center gap-2 rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-1 text-sm text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#f0f6fc]"
                     >
                        <X className="h-4 w-4" />
                        Cancelar
                     </button>
                  )}
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           Título
                        </label>
                        <input
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           placeholder="Nome do tour"
                           className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] focus:outline-none"
                           required
                        />
                     </div>

                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           URL da Imagem
                        </label>
                        <input
                           type="url"
                           value={image}
                           onChange={(e) => setImage(e.target.value)}
                           placeholder="https://exemplo.com/imagem.jpg"
                           className={`w-full rounded-md border px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:ring-1 focus:outline-none ${
                              image && !isValidUrl(image)
                                 ? 'border-[#da3633] bg-[#da3633]/10 focus:border-[#da3633] focus:ring-[#da3633]'
                                 : 'border-[#21262d] bg-[#0d1117] focus:border-[#2f81f7] focus:ring-[#2f81f7]'
                           }`}
                        />
                        {image && !isValidUrl(image) && (
                           <p className="mt-1 text-sm text-[#da3633]">
                              URL inválida
                           </p>
                        )}
                     </div>
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                        Descrição
                     </label>
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o tour"
                        rows={3}
                        className="w-full resize-none rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] focus:outline-none"
                        required
                     />
                  </div>

                  {/* Legs Section */}
                  <div>
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#f0f6fc]">
                           Etapas do Tour
                        </h3>
                        <button
                           type="button"
                           onClick={addLeg}
                           className="flex items-center gap-2 rounded-md bg-[#238636] px-3 py-1 text-sm text-white transition-colors hover:bg-[#2ea043]"
                        >
                           <Plus className="h-4 w-4" />
                           Adicionar Etapa
                        </button>
                     </div>

                     <div className="space-y-4">
                        {legs.map((leg, index) => (
                           <div
                              key={index}
                              className="rounded-md border border-[#21262d] bg-[#0d1117] p-4"
                           >
                              <div className="mb-3 flex items-center justify-between">
                                 <h4 className="text-sm font-medium text-[#f0f6fc]">
                                    Etapa {index + 1}
                                 </h4>
                                 {legs.length > 1 && (
                                    <button
                                       type="button"
                                       onClick={() => removeLeg(index)}
                                       className="flex h-6 w-6 items-center justify-center rounded text-[#da3633] hover:bg-[#da3633]/10"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </button>
                                 )}
                              </div>

                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                 <div>
                                    <label className="mb-1 block text-xs text-[#7d8590]">
                                       Descrição
                                    </label>
                                    <input
                                       type="text"
                                       value={leg.description}
                                       onChange={(e) =>
                                          updateLeg(
                                             index,
                                             'description',
                                             e.target.value,
                                          )
                                       }
                                       placeholder="Ex: Decolagem de São Paulo"
                                       className="w-full rounded-md border border-[#21262d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] focus:outline-none"
                                       required
                                    />
                                 </div>

                                 <div>
                                    <label className="mb-1 block text-xs text-[#7d8590]">
                                       Aeroporto de Origem
                                    </label>
                                    <AirportSelector
                                       airport={leg.departureIcao}
                                       setAirport={(icao: string) =>
                                          updateLeg(
                                             index,
                                             'departureIcao',
                                             icao,
                                          )
                                       }
                                    />
                                 </div>

                                 <div>
                                    <label className="mb-1 block text-xs text-[#7d8590]">
                                       Aeroporto de Destino
                                    </label>
                                    <AirportSelector
                                       airport={leg.arrivalIcao}
                                       setAirport={(icao: string) =>
                                          updateLeg(index, 'arrivalIcao', icao)
                                       }
                                    />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-white transition-colors hover:bg-[#2ea043] disabled:opacity-50"
                     >
                        <Save className="h-4 w-4" />
                        {loading
                           ? 'Salvando...'
                           : isEditing
                             ? 'Atualizar Tour'
                             : 'Criar Tour'}
                     </button>
                     {isEditing && (
                        <button
                           type="button"
                           onClick={resetForm}
                           className="rounded-md border border-[#21262d] bg-[#0d1117] px-4 py-2 text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
                        >
                           Cancelar
                        </button>
                     )}
                  </div>
               </form>
            </div>

            {/* Tours List */}
            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <h2 className="mb-6 text-lg font-semibold text-[#f0f6fc]">
                  Tours Existentes
               </h2>

               {loading ? (
                  <div className="py-12 text-center">
                     <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#2f81f7]"></div>
                     <p className="mt-4 text-[#7d8590]">Carregando tours...</p>
                  </div>
               ) : tours.length === 0 ? (
                  <div className="py-12 text-center">
                     <Compass className="mx-auto h-12 w-12 text-[#21262d]" />
                     <p className="mt-4 text-lg text-[#7d8590]">
                        Nenhum tour encontrado.
                     </p>
                     <p className="text-sm text-[#7d8590]">
                        Crie seu primeiro tour acima!
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {tours.map((tour) => (
                        <div
                           key={tour.id}
                           className="rounded-md border border-[#21262d] bg-[#0d1117] p-4"
                        >
                           {tour.image && (
                              <div className="mb-4 aspect-video overflow-hidden rounded-md bg-[#21262d]">
                                 <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    width={300}
                                    height={169}
                                    className="h-full w-full object-cover"
                                 />
                              </div>
                           )}

                           <h3 className="mb-2 font-semibold text-[#f0f6fc]">
                              {tour.title}
                           </h3>
                           <p className="mb-4 line-clamp-2 text-sm text-[#7d8590]">
                              {tour.description}
                           </p>

                           <div className="mb-4">
                              <p className="text-xs text-[#7d8590]">
                                 {tour.legs.length} etapa
                                 {tour.legs.length !== 1 ? 's' : ''}
                              </p>
                           </div>

                           <div className="flex gap-2">
                              <button
                                 onClick={() => handleEdit(tour)}
                                 className="flex items-center gap-1 rounded-md bg-[#2f81f7] px-3 py-1 text-sm text-white transition-colors hover:bg-[#1f6feb]"
                              >
                                 <Edit2 className="h-3 w-3" />
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDelete(tour.id)}
                                 className="flex items-center gap-1 rounded-md bg-[#da3633] px-3 py-1 text-sm text-white transition-colors hover:bg-[#b91c1c]"
                              >
                                 <Trash2 className="h-3 w-3" />
                                 Excluir
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
