export default function LoadingToursPage() {
   return (
      <main className="min-h-screen bg-gray-900 px-6 py-12">
         <div className="mx-auto mb-14 max-w-5xl px-4 text-center">
            <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded-lg bg-gray-700" />
            <div className="mx-auto h-5 w-96 animate-pulse rounded bg-gray-700" />
         </div>

         <section className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
               <div
                  key={i}
                  className="flex animate-pulse flex-col overflow-hidden rounded-3xl bg-gray-800 shadow-lg"
               >
                  <div className="h-64 w-full bg-gray-700" />
                  <div className="flex flex-grow flex-col space-y-3 p-6">
                     <div className="h-6 w-3/4 rounded bg-gray-600" />
                     <div className="h-4 w-full rounded bg-gray-700" />
                     <div className="h-4 w-5/6 rounded bg-gray-700" />
                     <div className="h-4 w-2/3 rounded bg-gray-700" />
                  </div>
               </div>
            ))}
         </section>
      </main>
   );
}
