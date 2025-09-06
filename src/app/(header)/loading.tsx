export default function LoadingToursPage() {
   return (
      <div className="min-h-screen bg-[#0d1117]">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-6 py-4">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-[#21262d]" />
                  <div className="h-6 w-32 animate-pulse rounded bg-[#21262d]" />
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="space-y-8 text-center">
               <div className="mx-auto h-10 w-96 animate-pulse rounded bg-[#21262d]" />
               <div className="mx-auto h-6 w-[500px] animate-pulse rounded bg-[#21262d]" />

               <div className="flex justify-center gap-4">
                  <div className="h-10 w-32 animate-pulse rounded-md border border-[#21262d] bg-[#161b22]" />
                  <div className="h-10 w-24 animate-pulse rounded-md border border-[#21262d] bg-[#161b22]" />
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-6 pb-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div
                     key={i}
                     className="rounded-md border border-[#21262d] bg-[#161b22] p-6"
                  >
                     <div className="mb-4 h-48 w-full animate-pulse rounded-md bg-[#21262d]" />

                     <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-[#21262d]" />

                     <div className="mb-4 space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-[#21262d]" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-[#21262d]" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-[#21262d]" />
                     </div>

                     <div className="flex items-center justify-between border-t border-[#21262d] pt-4">
                        <div className="h-5 w-20 animate-pulse rounded bg-[#21262d]" />
                        <div className="h-5 w-16 animate-pulse rounded bg-[#21262d]" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
