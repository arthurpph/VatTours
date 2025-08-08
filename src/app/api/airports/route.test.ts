jest.mock('next/server', () => ({
   NextResponse: {
      json: jest.fn((data, options) => ({
         json: async () => data,
         status: options?.status || 200,
      })),
   },
}));

jest.mock('@/lib/db/queries', () => ({
   getAirports: jest.fn(),
}));

jest.mock('@/lib/validation/api-validator', () => ({
   validateQuery: jest.fn(),
   handleApiError: jest.fn(() => ({
      json: async () => ({ message: 'Erro interno do servidor' }),
      status: 500,
   })),
}));

jest.mock('@/lib/validation/api-schemas', () => ({
   getAirportsSchema: {},
}));

global.Request = class MockRequest {
   url: string;
   constructor(url: string) {
      this.url = url;
   }
} as unknown as typeof Request;

import { GET } from './route';
import { getAirports } from '@/lib/db/queries';
import { validateQuery } from '@/lib/validation/api-validator';

const mockGetAirports = getAirports as jest.MockedFunction<typeof getAirports>;
const mockValidateQuery = validateQuery as jest.MockedFunction<
   typeof validateQuery
>;

describe('GET /api/airports', () => {
   const mockAirports = [
      { id: 1, icao: 'SBGR', name: 'Guarulhos', country: 'BR' as const },
      { id: 2, icao: 'OMDB', name: 'Dubai', country: 'AE' as const },
   ];

   beforeEach(() => {
      jest.clearAllMocks();
      mockValidateQuery.mockReturnValue({});
   });

   it('should return a list of airports', async () => {
      mockGetAirports.mockResolvedValue(mockAirports);

      const mockRequest = new Request('http://localhost:3000/api/airports');
      const response = await GET(
         mockRequest as unknown as import('next/server').NextRequest,
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toEqual(mockAirports);
      expect(mockGetAirports).toHaveBeenCalled();
   });

   it('should handle database errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetAirports.mockRejectedValue(new Error('Database error'));

      const mockRequest = new Request('http://localhost:3000/api/airports');
      const response = await GET(
         mockRequest as unknown as import('next/server').NextRequest,
      );

      expect(response.status).toBe(500);

      consoleSpy.mockRestore();
   });

   it('should return empty array when no airports found', async () => {
      mockGetAirports.mockResolvedValue([]);

      const mockRequest = new Request('http://localhost:3000/api/airports');
      const response = await GET(
         mockRequest as unknown as import('next/server').NextRequest,
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
   });
});
