import '@testing-library/jest-dom';
import {
   render,
   screen,
   fireEvent,
   waitFor,
   act,
} from '@testing-library/react';
import TourPirepClientSide from './tour-pirep-csr';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
   useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const leg = {
   id: 1,
   tourId: 123,
   departureIcao: 'SBGR',
   arrivalIcao: 'OMDB',
   description: 'Test leg',
   order: 1,
} as const;

beforeEach(() => {
   jest.clearAllMocks();
   global.fetch = jest.fn();
});

describe('TourPirepClientSide', () => {
   it('renders form fields and leg info', () => {
      render(<TourPirepClientSide leg={leg} />);
      expect(screen.getByText('PIREP')).toBeInTheDocument();
      expect(screen.getByText(leg.departureIcao)).toBeInTheDocument();
      expect(screen.getByText(leg.arrivalIcao)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: UAE406')).toBeInTheDocument();
      expect(screen.getByText(/Comentário \(opcional\)/i)).toBeInTheDocument();
      expect(
         screen.getByRole('button', { name: /Enviar PIREP/i }),
      ).toBeInTheDocument();
   });

   it('shows error if callsign exceeds 7 characters', () => {
      render(<TourPirepClientSide leg={leg} />);
      const input = screen.getByPlaceholderText('Ex: UAE406');
      fireEvent.change(input, { target: { value: 'ABCDEFGH' } });
      expect(
         screen.getByText(/não pode exceder 7 caracteres/i),
      ).toBeInTheDocument();
   });

   it('shows error if comment exceeds 100 characters', () => {
      render(<TourPirepClientSide leg={leg} />);
      const textareas = screen.getAllByRole('textbox');
      const textarea = textareas[1];
      fireEvent.change(textarea, { target: { value: 'a'.repeat(101) } });
      expect(
         screen.getByText(/não pode exceder 100 caracteres/i),
      ).toBeInTheDocument();
   });

   it('submits form and redirects on success', async () => {
      // @ts-expect-error - Mocking global fetch for testing
      global.fetch.mockResolvedValue({ ok: true });
      render(<TourPirepClientSide leg={leg} />);

      act(() => {
         fireEvent.change(screen.getByPlaceholderText('Ex: UAE406'), {
            target: { value: 'UAE406' },
         });
         const textareas = screen.getAllByRole('textbox');
         const textarea = textareas[1];
         fireEvent.change(textarea, { target: { value: 'Test comment' } });
      });

      await act(async () => {
         fireEvent.click(screen.getByRole('button', { name: /Enviar PIREP/i }));
      });

      await waitFor(() => {
         expect(
            screen.getByText(/PIREP enviado com sucesso/i),
         ).toBeInTheDocument();
         expect(mockPush).toHaveBeenCalledWith(
            `/tours/${leg.tourId}?action=status`,
         );
      });
   });

   it('shows error on failed submission', async () => {
      // @ts-expect-error - Mocking global fetch for testing
      global.fetch.mockResolvedValue({ ok: false });
      render(<TourPirepClientSide leg={leg} />);

      act(() => {
         fireEvent.change(screen.getByPlaceholderText('Ex: UAE406'), {
            target: { value: 'UAE406' },
         });
      });

      await act(async () => {
         fireEvent.click(screen.getByRole('button', { name: /Enviar PIREP/i }));
      });

      await waitFor(() => {
         expect(screen.getByText(/Erro ao enviar PIREP/i)).toBeInTheDocument();
      });
   });

   it('disables button while submitting', async () => {
      let resolveFetch: ((value: unknown) => void) | undefined;
      // @ts-expect-error - Mocking global fetch
      global.fetch.mockImplementation(
         () =>
            new Promise((res) => {
               resolveFetch = res;
            }),
      );
      render(<TourPirepClientSide leg={leg} />);

      act(() => {
         fireEvent.change(screen.getByPlaceholderText('Ex: UAE406'), {
            target: { value: 'UAE406' },
         });
      });

      const button = screen.getByRole('button', { name: /Enviar PIREP/i });

      await act(async () => {
         fireEvent.click(button);
      });

      expect(button).toBeDisabled();

      await act(async () => {
         resolveFetch?.({ ok: true });
      });
   });
});
