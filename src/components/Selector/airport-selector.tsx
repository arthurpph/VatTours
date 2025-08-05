import { PUBLIC_API_ROUTES } from '@/config/api-routes';
import { useEffect, useState } from 'react';

type Props = {
   airport: string;
   setAirport: (value: string) => void;
};

export default function AirportSelector({ airport, setAirport }: Props) {
   const [airports, setAirports] = useState<string[]>([]);

   const fetchAirports = async () => {
      try {
         const res = await fetch(PUBLIC_API_ROUTES.airports);
         if (res.ok) {
            const data = await res.json();
            setAirports(data.map((a: { icao: string }) => a.icao));
         } else {
            console.error('Erro ao carregar aeroportos');
         }
      } catch (error) {
         console.error('Erro na requisição:', error);
      }
   };

   useEffect(() => {
      fetchAirports();
   }, []);

   return (
      <select
         className="w-full rounded border bg-gray-800 p-2 text-gray-100"
         value={airport}
         onChange={(e) => setAirport(e.target.value)}
         required
      >
         <option value="">Selecione um aeroporto</option>
         {airports.map((code) => (
            <option key={code} value={code}>
               {code}
            </option>
         ))}
      </select>
   );
}
