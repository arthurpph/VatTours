import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('Loading Component', () => {
   it('should render with default props', () => {
      render(<Loading />);

      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(document.querySelector('.spinner')).toBeInTheDocument();
   });

   it('should render with custom text', () => {
      render(<Loading text="Enviando dados..." />);

      expect(screen.getByText('Enviando dados...')).toBeInTheDocument();
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
   });

   it('should render without text when text is empty', () => {
      render(<Loading text="" />);

      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      expect(document.querySelector('.spinner')).toBeInTheDocument();
   });

   it('should render different sizes', () => {
      const { rerender } = render(<Loading size="sm" />);
      expect(document.querySelector('.spinner-sm')).toBeInTheDocument();

      rerender(<Loading size="md" />);
      expect(document.querySelector('.spinner')).toBeInTheDocument();

      rerender(<Loading size="lg" />);
      expect(document.querySelector('.spinner-lg')).toBeInTheDocument();
   });

   it('should render with custom className', () => {
      render(<Loading className="custom-class" />);

      const container = screen.getByText('Carregando...').parentElement;
      expect(container).toHaveClass('custom-class');
   });

   it('should render in fullScreen mode', () => {
      render(<Loading fullScreen />);

      const fullScreenContainer = document.querySelector('.fixed.inset-0.z-50');
      expect(fullScreenContainer).toBeInTheDocument();
      expect(fullScreenContainer).toHaveClass(
         'bg-gradient-to-br',
         'from-black',
         'via-gray-950',
         'to-gray-900',
      );
   });

   it('should render background effects in fullScreen mode', () => {
      render(<Loading fullScreen />);

      const backgroundEffects = document.querySelectorAll(
         '.pointer-events-none .absolute',
      );
      expect(backgroundEffects.length).toBeGreaterThan(0);
   });

   it('should not render fullScreen container when fullScreen is false', () => {
      render(<Loading fullScreen={false} />);

      const fullScreenContainer = document.querySelector('.fixed.inset-0.z-50');
      expect(fullScreenContainer).not.toBeInTheDocument();
   });
});
