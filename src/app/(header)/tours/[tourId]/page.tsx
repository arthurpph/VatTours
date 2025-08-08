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
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
               <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
               <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
               <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
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
