import { CountryCode, countryCodes } from '@/models/types';

export default function CountrySelector({
   country,
   setCountry,
}: {
   country: CountryCode | '';
   setCountry: (value: CountryCode) => void;
}) {
   return (
      <select
         className="bg-gray-800 text-gray-100 w-full border p-2 rounded"
         value={country}
         onChange={(e) => setCountry(e.target.value as CountryCode)}
         required
      >
         <option value="">Selecione um país</option>
         {countryCodes.map((code) => (
            <option key={code} value={code}>
               {code}
            </option>
         ))}
      </select>
   );
}
