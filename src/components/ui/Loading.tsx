interface LoadingProps {
   size?: 'sm' | 'md' | 'lg';
   text?: string;
   fullScreen?: boolean;
   className?: string;
}

export default function Loading({
   size = 'md',
   text = 'Carregando...',
   fullScreen = false,
   className = '',
}: LoadingProps) {
   const sizeClass = {
      sm: 'spinner-sm',
      md: 'spinner',
      lg: 'spinner-lg',
   }[size];

   const content = (
      <div
         className={`flex flex-col items-center justify-center gap-4 ${className}`}
      >
         <div className={`${sizeClass} spinner`} />
         {text && (
            <p className="animate-pulse-slow bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-medium text-transparent">
               {text}
            </p>
         )}
      </div>
   );

   if (fullScreen) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
               <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
               <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            </div>
            <div className="relative">{content}</div>
         </div>
      );
   }

   return content;
}
