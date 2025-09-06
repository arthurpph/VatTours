import { Loader2 } from 'lucide-react';

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
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
   }[size];

   const content = (
      <div
         className={`flex flex-col items-center justify-center gap-4 ${className}`}
      >
         <Loader2 className={`${sizeClass} animate-spin text-[#7d8590]`} />
         {text && <p className="text-sm font-medium text-[#7d8590]">{text}</p>}
      </div>
   );

   if (fullScreen) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]">
            <div className="relative">{content}</div>
         </div>
      );
   }

   return content;
}
