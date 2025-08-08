interface StatusProps {
   type: 'online' | 'offline' | 'warning';
   label: string;
   pulse?: boolean;
}

export default function Status({ type, label, pulse = false }: StatusProps) {
   const baseClasses = `status-${type}`;
   const dotClasses = pulse ? 'animate-pulse' : '';

   return (
      <div className={baseClasses}>
         <div
            className={`h-2 w-2 rounded-full ${dotClasses} ${
               type === 'online'
                  ? 'bg-gray-400'
                  : type === 'offline'
                    ? 'bg-red-400'
                    : 'bg-yellow-400'
            }`}
         ></div>
         <span className="text-sm font-medium">{label}</span>
      </div>
   );
}
