import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
   size?: 'sm' | 'md' | 'lg';
   loading?: boolean;
   icon?: ReactNode;
   children: ReactNode;
}

export default function Button({
   variant = 'primary',
   size = 'md',
   loading = false,
   icon,
   children,
   disabled,
   className = '',
   ...props
}: ButtonProps) {
   const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

   const variantClasses = {
      primary:
         'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-400',
      secondary:
         'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:scale-105 hover:from-gray-600 hover:to-gray-500 focus:ring-gray-400',
      ghost: 'border border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white hover:border-gray-500 focus:ring-gray-400',
      danger:
         'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-400',
   };

   const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
   };

   const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

   return (
      <button className={classes} disabled={disabled || loading} {...props}>
         {loading ? (
            <>
               <div className="spinner-sm" />
               <span>Carregando...</span>
            </>
         ) : (
            <>
               {icon && <span>{icon}</span>}
               <span>{children}</span>
            </>
         )}
      </button>
   );
}
