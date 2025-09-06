export default function LoadingToursPage() {
   return (
      <div className="min-h-screen bg-[#0d1117] px-6 py-12">
         <div className="border-b border-[#21262d] bg-[#010409]">
            <div className="mx-auto max-w-7xl px-4 py-6">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#21262d]">
                     <div className="h-5 w-5 animate-pulse rounded-full bg-[#21262d]" />
                  </div>
                  <div className="h-6 w-32 animate-pulse rounded bg-[#21262d]" />
               </div>
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6 h-10 w-48 animate-pulse rounded bg-[#21262d]" />
            <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
               <div className="space-y-4">
                  <div className="h-6 w-1/2 animate-pulse rounded bg-[#21262d]" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#21262d]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#21262d]" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-[#21262d]" />
               </div>
            </div>
         </div>
      </div>
   );
}
