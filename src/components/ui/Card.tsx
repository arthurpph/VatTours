import { ReactNode, CSSProperties } from 'react';

interface CardProps {
   children: ReactNode;
   hoverable?: boolean;
   glassEffect?: 'normal' | 'strong';
   className?: string;
   style?: CSSProperties;
   onClick?: () => void;
}

export default function Card({
   children,
   hoverable = false,
   glassEffect = 'normal',
   className = '',
   style,
   onClick,
}: CardProps) {
   const baseClasses = 'card';
   const hoverClasses = hoverable ? 'card-hover cursor-pointer' : '';
   const glassClasses = glassEffect === 'strong' ? 'glass-strong' : 'glass';

   const classes = `${baseClasses} ${hoverClasses} ${glassClasses} ${className}`;

   return (
      <div className={classes} style={style} onClick={onClick}>
         {children}
      </div>
   );
}
