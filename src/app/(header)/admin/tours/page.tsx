'use client';

import AirportSelector from '@/components/Selector/airport-selector';
import BadgeSelector from '@/components/Selector/badge-selector';
import { ADMIN_API_ROUTES, PUBLIC_API_ROUTES } from '@/config/api-routes';
import { useState, useEffect } from 'react';
import {
   Compass,
   Plus,
   Edit2,
   Trash2,
   Save,
   X,
   ArrowLeft,
   Award,
} from 'lucide-react';
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
   const [image, setImage] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [legs, setLegs] = useState<LegInput[]>([
      { description: '', departureIcao: '', arrivalIcao: '' },
   ]);
   const [selectedBadges, setSelectedBadges] = useState<number[]>([]);

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

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (!file.type.startsWith('image/')) {
            alert('Apenas arquivos de imagem são permitidos.');
            return;
         }

         if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo muito grande. Máximo 5MB.');
            return;
         }

         setImage(file);
         const reader = new FileReader();
         reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const resetForm = () => {
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setLegs([{ description: '', departureIcao: '', arrivalIcao: '' }]);
      setSelectedBadges([]);
      setEditingTour(null);
      setIsEditing(false);
   };

   const handleEdit = async (tour: Tour) => {
      setTitle(tour.title);
      setDescription(tour.description);
      setImage(null);
      setImagePreview(
         tour.image ? `data:image/jpeg;base64,${tour.image}` : null,
      );
      setLegs(tour.legs);
      setEditingTour(tour);
      setIsEditing(true);

      try {
         const res = await fetch(`${ADMIN_API_ROUTES.tours}/${tour.id}/badges`);
         if (res.ok) {
            const badges = await res.json();
            setSelectedBadges(badges.map((badge: { id: number }) => badge.id));
         }
      } catch (error) {
         console.error('Error loading tour badges:', error);
      }
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

      setLoading(true);

      try {
         const formData = new FormData();
         formData.append('title', title);
         formData.append('description', description);
         formData.append('legs', JSON.stringify(legs));

         if (image) {
            formData.append('image', image);
         }

         const url = isEditing
            ? `${ADMIN_API_ROUTES.tours}/${editingTour?.id}`
            : ADMIN_API_ROUTES.tours;
         const method = isEditing ? 'PUT' : 'POST';

         const res = await fetch(url, {
            method,
            body: formData,
         });

         if (res.ok) {
            const savedTour = await res.json();
            const tourId = isEditing ? editingTour?.id : savedTour.id;

            if (tourId) {
               try {
                  await fetch(`${ADMIN_API_ROUTES.tours}/${tourId}/badges`, {
                     method: 'PUT',
                     headers: {
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                        badgeIds: selectedBadges,
                     }),
                  });
               } catch (error) {
                  console.error('Error saving tour badges:', error);
                  alert('Tour salvo, mas houve erro ao salvar os badges.');
               }
            }

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
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-4">
               <div className="flex items-center gap-3">
                  <Link
                     href="/admin"
                     className="flex h-8 w-8 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#f0f6fc]"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#8cc8ff]/15">
                     <Compass className="h-5 w-5 text-[#8cc8ff]" />
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
            <div className="mb-8 rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#8cc8ff]/15">
                     {isEditing ? (
                        <Edit2 className="h-5 w-5 text-[#8cc8ff]" />
                     ) : (
                        <Plus className="h-5 w-5 text-[#8cc8ff]" />
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
                           className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
                           required
                        />
                     </div>

                     <div>
                        <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                           Imagem do Tour
                        </label>
                        <div className="space-y-3">
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="w-full cursor-pointer rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#8cc8ff] file:px-3 file:py-1 file:text-[#0d1117] hover:file:bg-[#a5b4fc] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
                           />
                           {imagePreview && (
                              <div className="relative">
                                 <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-32 w-full rounded-md object-cover"
                                 />
                                 <button
                                    type="button"
                                    onClick={() => {
                                       setImage(null);
                                       setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#f85149] text-white hover:bg-[#da3633]"
                                 >
                                    <X className="h-4 w-4" />
                                 </button>
                              </div>
                           )}
                        </div>
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
                        className="w-full resize-none rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
                        required
                     />
                  </div>

                  <div>
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#f0f6fc]">
                           Etapas do Tour
                        </h3>
                        <button
                           type="button"
                           onClick={addLeg}
                           className="flex cursor-pointer items-center gap-2 rounded-md bg-[#8cc8ff] px-3 py-1 text-sm text-[#0d1117] transition-colors hover:bg-[#a5b4fc]"
                        >
                           <Plus className="h-4 w-4" />
                           Adicionar Leg
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
                                    Leg {index + 1}
                                 </h4>
                                 {legs.length > 1 && (
                                    <button
                                       type="button"
                                       onClick={() => removeLeg(index)}
                                       className="flex h-6 w-6 items-center justify-center rounded text-[#f85149] hover:bg-[#f85149]/10"
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
                                       className="w-full rounded-md border border-[#21262d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
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

                  <div>
                     <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fbbf24]/15">
                           <Award className="h-5 w-5 text-[#fbbf24]" />
                        </div>
                        <h3 className="text-sm font-medium text-[#f0f6fc]">
                           Badges de Conquista
                        </h3>
                     </div>
                     <div className="rounded-md border border-[#21262d] bg-[#0d1117] p-4">
                        <BadgeSelector
                           selectedBadges={selectedBadges}
                           onSelectionChange={setSelectedBadges}
                        />
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#8cc8ff] px-4 py-2 text-[#0d1117] transition-colors hover:bg-[#a5b4fc] disabled:opacity-50"
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
                           className="cursor-pointer rounded-md border border-[#21262d] bg-[#0d1117] px-4 py-2 text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
                        >
                           Cancelar
                        </button>
                     )}
                  </div>
               </form>
            </div>

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
                                    src={`data:image/jpeg;base64,${tour.image}`}
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
                                 className="flex cursor-pointer items-center gap-1 rounded-md bg-[#2f81f7] px-3 py-1 text-sm text-white transition-colors hover:bg-[#1f6feb]"
                              >
                                 <Edit2 className="h-3 w-3" />
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDelete(tour.id)}
                                 className="flex cursor-pointer items-center gap-1 rounded-md bg-[#f85149] px-3 py-1 text-sm text-white transition-colors hover:bg-[#da3633]"
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
