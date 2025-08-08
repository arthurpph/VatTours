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
      <main className="min-h-screen w-full bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
         <div className="relative">
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
               <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl"></div>
            </div>

            <div className="relative flex min-h-screen w-full flex-col items-center gap-12 py-8">
               <div className="w-full">
                  <TourMenu />
               </div>

               <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  {actionComponents[action ?? ''] ?? (
                     <TourInfo tourId={tourId} />
                  )}
               </div>
            </div>
         </div>
      </main>
   );
}
