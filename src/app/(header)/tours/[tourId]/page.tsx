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
      <main className="flex min-h-screen w-full flex-col items-center gap-20 bg-gradient-to-b from-gray-950 to-gray-900 py-8 text-white">
         <TourMenu />
         {actionComponents[action ?? ''] ?? <TourInfo tourId={tourId} />}
      </main>
   );
}
