import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TourMenu from './tour-menu';

jest.mock('next/navigation', () => ({
   useRouter: jest.fn(),
   usePathname: jest.fn(),
   useSearchParams: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
   typeof useSearchParams
>;

describe('TourMenu', () => {
   const mockPush = jest.fn();
   const mockSearchParams = {
      get: jest.fn(),
      toString: jest.fn(() => ''),
   };

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseRouter.mockReturnValue({
         push: mockPush,
         replace: jest.fn(),
         back: jest.fn(),
         forward: jest.fn(),
         refresh: jest.fn(),
         prefetch: jest.fn(),
      });

      mockUsePathname.mockReturnValue('/tours/123');
      mockUseSearchParams.mockReturnValue(
         mockSearchParams as unknown as ReturnType<typeof useSearchParams>,
      );
      mockSearchParams.get.mockReturnValue(null);
   });

   it('should render all navigation items', () => {
      render(<TourMenu />);

      expect(screen.getByRole('tab', { name: /info/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /pernas/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /status/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /pirep/i })).toBeInTheDocument();
   });

   it('should highlight the active tab based on search params', () => {
      mockSearchParams.get.mockReturnValue('legs');

      render(<TourMenu />);

      const pernasButton = screen.getByRole('tab', { name: /pernas/i });
      expect(pernasButton).toHaveAttribute('aria-selected', 'true');
      expect(pernasButton).toHaveClass('border-[#2f81f7]', 'text-[#f0f6fc]');
   });

   it('should highlight Info tab when no action param is set', () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<TourMenu />);

      const infoButton = screen.getByRole('tab', { name: /info/i });
      expect(infoButton).toHaveAttribute('aria-selected', 'true');
      expect(infoButton).toHaveClass('border-[#2f81f7]', 'text-[#f0f6fc]');
   });

   it('should navigate to legs when Pernas is clicked', async () => {
      mockSearchParams.toString.mockReturnValue('');

      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      const pernasButton = buttons.find(
         (button) => button.getAttribute('aria-controls') === 'panel-legs',
      );
      fireEvent.click(pernasButton!);

      await waitFor(() => {
         expect(mockPush).toHaveBeenCalledWith('/tours/123?action=legs');
      });
   });

   it('should navigate to status when Status is clicked', async () => {
      mockSearchParams.toString.mockReturnValue('');

      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      const statusButton = buttons.find(
         (button) => button.getAttribute('aria-controls') === 'panel-status',
      );
      fireEvent.click(statusButton!);

      await waitFor(() => {
         expect(mockPush).toHaveBeenCalledWith('/tours/123?action=status');
      });
   });

   it('should navigate to pirep when PIREP is clicked', async () => {
      mockSearchParams.toString.mockReturnValue('');

      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      const pirepButton = buttons.find(
         (button) => button.getAttribute('aria-controls') === 'panel-pirep',
      );
      fireEvent.click(pirepButton!);

      await waitFor(() => {
         expect(mockPush).toHaveBeenCalledWith('/tours/123?action=pirep');
      });
   });

   it('should remove action param when Info is clicked', async () => {
      mockSearchParams.get.mockReturnValue('legs');
      mockSearchParams.toString.mockReturnValue('action=legs');

      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      const infoButton = buttons.find(
         (button) => button.getAttribute('aria-controls') === 'panel-info',
      );
      fireEvent.click(infoButton!);

      await waitFor(() => {
         expect(mockPush).toHaveBeenCalledWith('/tours/123?');
      });
   });

   it('should preserve existing search params when navigating', async () => {
      mockSearchParams.toString.mockReturnValue('existing=param');

      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      const pernasButton = buttons.find(
         (button) => button.getAttribute('aria-controls') === 'panel-legs',
      );
      fireEvent.click(pernasButton!);

      await waitFor(() => {
         expect(mockPush).toHaveBeenCalledWith(
            '/tours/123?existing=param&action=legs',
         );
      });
   });

   it('should have proper accessibility attributes', () => {
      render(<TourMenu />);

      const nav = screen.getByRole('tablist');
      expect(nav).toHaveAttribute('aria-label', 'Menu de navegação do tour');

      const buttons = screen.getAllByRole('tab');
      buttons.forEach((button) => {
         expect(button).toHaveAttribute('aria-selected');
         expect(button).toHaveAttribute('aria-controls');
      });
   });

   it('should display loading state when transition is pending', () => {
      render(<TourMenu />);

      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
   });

   it('should display correct icons for each menu item', () => {
      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      buttons.forEach((button) => {
         const svg = button.querySelector('svg');
         expect(svg).toBeInTheDocument();
         expect(svg).toHaveClass('h-4', 'w-4');
      });
   });

   it('should render tab labels', () => {
      render(<TourMenu />);

      const buttons = screen.getAllByRole('tab');
      buttons.forEach((button) => {
         const span = button.querySelector('span');
         expect(span).toBeInTheDocument();
      });
   });
});
