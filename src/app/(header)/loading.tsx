export default function LoadingToursPage() {
   return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <div className="relative px-6 py-12">
            <div className="mx-auto mb-16 max-w-5xl px-4 text-center">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 rounded-full border border-blue-800/40 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-6 py-3 backdrop-blur-sm">
                     <div className="h-4 w-4 animate-pulse rounded-full bg-blue-400"></div>
                     <div className="h-3 w-24 animate-pulse rounded bg-gray-600"></div>
                  </div>

                  <div className="skeleton mx-auto h-12 w-80 animate-pulse rounded-lg bg-gradient-to-r from-gray-700 to-gray-600"></div>
                  <div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-700"></div>

                  <div className="flex flex-wrap justify-center gap-4">
                     <div className="h-10 w-32 animate-pulse rounded-lg border border-gray-800/50 bg-gray-950/80"></div>
                     <div className="h-10 w-24 animate-pulse rounded-lg border border-gray-800/50 bg-gray-950/80"></div>
                  </div>
               </div>
            </div>

            <section className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 px-4">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div
                     key={i}
                     className="group glass flex animate-pulse flex-col overflow-hidden rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-950 to-black shadow-xl"
                  >
                     <div className="skeleton relative h-64 w-full bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-700"></div>
                        <div className="absolute bottom-3 left-3 h-6 w-16 rounded-full bg-gray-700"></div>
                     </div>

                     <div className="flex flex-grow flex-col space-y-4 p-6">
                        <div className="flex items-start justify-between">
                           <div className="skeleton h-6 w-3/4 rounded bg-gray-700"></div>
                           <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                        </div>

                        <div className="space-y-2">
                           <div className="skeleton h-4 w-full rounded bg-gray-800"></div>
                           <div className="skeleton h-4 w-5/6 rounded bg-gray-800"></div>
                           <div className="skeleton h-4 w-2/3 rounded bg-gray-800"></div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-800/50 pt-2">
                           <div className="skeleton h-6 w-20 rounded-full bg-gray-700"></div>
                           <div className="skeleton h-4 w-16 rounded bg-gray-700"></div>
                        </div>
                     </div>
                  </div>
               ))}
            </section>
         </div>
      </main>
   );
}
