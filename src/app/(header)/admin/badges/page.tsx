'use client';

import { ADMIN_API_ROUTES } from '@/config/api-routes';
import { useState, useEffect } from 'react';
import {
   Award,
   Plus,
   Edit2,
   Trash2,
   Save,
   X,
   ArrowLeft,
   Upload,
} from 'lucide-react';
import Link from 'next/link';

type Badge = {
   id: number;
   name: string;
   description: string | null;
   image: string;
};

export default function BadgeManagePage() {
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [icon, setIcon] = useState<File | null>(null);
   const [iconPreview, setIconPreview] = useState<string | null>(null);

   const [badges, setBadges] = useState<Badge[]>([]);
   const [loading, setLoading] = useState(false);
   const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
   const [isEditing, setIsEditing] = useState(false);

   useEffect(() => {
      fetchBadges();
   }, []);

   const fetchBadges = async () => {
      setLoading(true);
      try {
         const res = await fetch(ADMIN_API_ROUTES.badges);
         if (res.ok) {
            const data = await res.json();
            setBadges(data);
         } else {
            alert('Erro ao carregar badges.');
         }
      } catch {
         alert('Erro inesperado ao carregar badges.');
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setName('');
      setDescription('');
      setIcon(null);
      setIconPreview(null);
      setEditingBadge(null);
      setIsEditing(false);
   };

   const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         if (file.size > 1024 * 1024) {
            alert('O arquivo deve ter no máximo 1MB.');
            return;
         }

         if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
         }

         setIcon(file);
         const reader = new FileReader();
         reader.onload = (e) => {
            setIconPreview(e.target?.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleEdit = (badge: Badge) => {
      setName(badge.name);
      setDescription(badge.description || '');
      setIcon(null);
      setIconPreview(badge.image);
      setEditingBadge(badge);
      setIsEditing(true);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
         alert('Nome é obrigatório.');
         return;
      }

      if (!isEditing && !icon) {
         alert('Imagem é obrigatória.');
         return;
      }

      setLoading(true);

      try {
         const formData = new FormData();
         formData.append('name', name);
         formData.append('description', description);

         if (icon) {
            formData.append('image', icon);
         }

         const url = isEditing
            ? `${ADMIN_API_ROUTES.badges}/${editingBadge?.id}`
            : ADMIN_API_ROUTES.badges;
         const method = isEditing ? 'PUT' : 'POST';

         const res = await fetch(url, {
            method,
            body: formData,
         });

         if (res.ok) {
            alert(
               isEditing
                  ? 'Badge atualizado com sucesso!'
                  : 'Badge criado com sucesso!',
            );
            resetForm();
            fetchBadges();
         } else {
            const errorData = await res.json();
            alert(`Erro: ${errorData.message}`);
         }
      } catch {
         alert('Erro inesperado ao salvar badge.');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir este badge?')) return;

      setLoading(true);
      try {
         const res = await fetch(`${ADMIN_API_ROUTES.badges}/${id}`, {
            method: 'DELETE',
         });

         if (res.ok) {
            alert('Badge excluído com sucesso!');
            fetchBadges();
         } else {
            const errorData = await res.json();
            alert(`Erro: ${errorData.message}`);
         }
      } catch {
         alert('Erro inesperado ao excluir badge.');
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
                     <Award className="h-5 w-5 text-[#8cc8ff]" />
                  </div>
                  <div>
                     <h1 className="text-xl font-semibold text-[#f0f6fc]">
                        Gerenciar Badges
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
                     {isEditing ? 'Editar Badge' : 'Criar Novo Badge'}
                  </h2>
                  {isEditing && (
                     <button
                        onClick={resetForm}
                        className="ml-auto flex items-center gap-2 rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-1 text-sm text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
                     >
                        <X className="h-4 w-4" />
                        Cancelar
                     </button>
                  )}
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                        Nome do Badge
                     </label>
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Primeiro Voo"
                        className="w-full rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
                        required
                     />
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                        Descrição
                     </label>
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição do badge (opcional)"
                        rows={3}
                        className="w-full resize-none rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-[#f0f6fc] placeholder-[#7d8590] focus:border-[#8cc8ff] focus:ring-1 focus:ring-[#8cc8ff] focus:outline-none"
                     />
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                        Ícone do Badge
                     </label>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleIconChange}
                              className="hidden"
                              id="icon-upload"
                           />
                           <label
                              htmlFor="icon-upload"
                              className="flex cursor-pointer items-center gap-2 rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
                           >
                              <Upload className="h-4 w-4" />
                              Escolher arquivo
                           </label>
                        </div>
                        {iconPreview && (
                           <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#21262d] bg-[#0d1117]">
                              <img
                                 src={iconPreview}
                                 alt="Preview"
                                 className="h-8 w-8 object-contain"
                              />
                           </div>
                        )}
                     </div>
                     <p className="mt-1 text-xs text-[#7d8590]">
                        Formato recomendado: SVG, PNG ou JPG (máx. 1MB)
                     </p>
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
                             ? 'Atualizar Badge'
                             : 'Criar Badge'}
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

            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <h2 className="mb-6 text-lg font-semibold text-[#f0f6fc]">
                  Badges Existentes
               </h2>

               {loading ? (
                  <div className="py-12 text-center">
                     <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#2f81f7]"></div>
                     <p className="mt-4 text-[#7d8590]">Carregando badges...</p>
                  </div>
               ) : badges.length === 0 ? (
                  <div className="py-12 text-center">
                     <Award className="mx-auto h-12 w-12 text-[#21262d]" />
                     <p className="mt-4 text-lg text-[#7d8590]">
                        Nenhum badge encontrado.
                     </p>
                     <p className="text-sm text-[#7d8590]">
                        Crie o primeiro badge para começar.
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {badges.map((badge) => (
                        <div
                           key={badge.id}
                           className="rounded-md border border-[#21262d] bg-[#0d1117] p-4 transition-colors hover:bg-[#161b22]"
                        >
                           <div className="mb-3 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#21262d] bg-[#161b22]">
                                 <img
                                    src={badge.image}
                                    alt={badge.name}
                                    className="h-6 w-6 object-contain"
                                 />
                              </div>
                              <h3 className="font-medium text-[#f0f6fc]">
                                 {badge.name}
                              </h3>
                           </div>
                           {badge.description && (
                              <p className="mb-4 line-clamp-2 text-sm text-[#7d8590]">
                                 {badge.description}
                              </p>
                           )}

                           <div className="flex gap-2">
                              <button
                                 onClick={() => handleEdit(badge)}
                                 className="flex cursor-pointer items-center gap-1 rounded-md bg-[#2f81f7] px-3 py-1 text-sm text-white transition-colors hover:bg-[#1f6feb]"
                              >
                                 <Edit2 className="h-3 w-3" />
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDelete(badge.id)}
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
