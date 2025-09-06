import TourInfo from '@/components/Tour/tour-info';
import TourLegs from '@/components/Tour/tour-legs';
import TourMenu from '@/components/Tour/tour-menu';
import TourPirep from '@/components/Tour/tour-pirep-ssr';
import TourStatus from '@/components/Tour/tour-status';

type Props = {
   params: Promise<{ tourId: string }>;
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TourPage({ params, searchParams }: Props) {
   const { tourId } = await params;
   const { action } = await searchParams;

   if (action !== undefined && !(typeof action === 'string')) {
      return <></>;
   }

   const actionComponents: Record<string, React.ReactNode> = {
      legs: <TourLegs tourId={tourId} />,
      pirep: <TourPirep tourId={tourId} />,
      status: <TourStatus tourId={tourId} />,
   };

   return (
      <div className="min-h-screen bg-[#0d1117]">
         {/* GitHub-style header */}
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-6">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21262d]">
                     <svg
                        className="h-5 w-5 text-[#7d8590]"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                     >
                        <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z" />
                     </svg>
                  </div>
                  <h1 className="text-xl font-semibold text-[#f0f6fc]">
                     Detalhes do Tour
                  </h1>
               </div>
            </div>
         </div>

         {/* Conteúdo principal */}
         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6">
               <TourMenu />
            </div>
            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               {actionComponents[action ?? ''] ?? <TourInfo tourId={tourId} />}
            </div>
         </div>
      </div>
   );
}
