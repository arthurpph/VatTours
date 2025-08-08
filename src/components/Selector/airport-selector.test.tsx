import {
   render,
   screen,
   fireEvent,
   waitFor,
   act,
} from '@testing-library/react';
import AirportSelector from './airport-selector';

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('AirportSelector Component', () => {
   const mockSetAirport = jest.fn();
   const mockAirports = [
      { icao: 'SBGR' },
      { icao: 'OMDB' },
      { icao: 'KJFK' },
      { icao: 'EGLL' },
   ];

   beforeEach(() => {
      jest.clearAllMocks();
      mockFetch.mockResolvedValue({
         ok: true,
         json: async () => mockAirports,
      } as Response);
   });

   it('should render airport selector with placeholder', async () => {
      await act(async () => {
         render(<AirportSelector airport="" setAirport={mockSetAirport} />);
      });

      expect(screen.getByText('Selecione um aeroporto')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
   });

   it('should fetch airports on mount', async () => {
      await act(async () => {
         render(<AirportSelector airport="" setAirport={mockSetAirport} />);
      });

      await waitFor(() => {
         expect(mockFetch).toHaveBeenCalledWith('/api/airports');
      });
   });

   it('should display selected airport value', async () => {
      await act(async () => {
         render(<AirportSelector airport="SBGR" setAirport={mockSetAirport} />);
      });

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('SBGR');
   });

   it('should call setAirport when selection changes', async () => {
      await act(async () => {
         render(<AirportSelector airport="" setAirport={mockSetAirport} />);
      });

      await waitFor(() => {
         expect(mockFetch).toHaveBeenCalled();
      });

      const select = screen.getByRole('combobox');

      await act(async () => {
         fireEvent.change(select, { target: { value: 'OMDB' } });
      });

      expect(mockSetAirport).toHaveBeenCalledWith('OMDB');
   });

   it('should handle API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockResolvedValue({
         ok: false,
      } as Response);

      await act(async () => {
         render(<AirportSelector airport="" setAirport={mockSetAirport} />);
      });

      await waitFor(() => {
         expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar aeroportos');
      });

      consoleSpy.mockRestore();
   });
});
