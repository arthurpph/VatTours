import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
   it('should render children content', () => {
      render(
         <Card>
            <p>Test content</p>
         </Card>,
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
   });

   it('should render with correct structure', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Content');
   });

   it('should handle onClick when provided', () => {
      const mockClick = jest.fn();
      const { container } = render(
         <Card onClick={mockClick}>Clickable content</Card>,
      );

      const card = container.firstChild as Element;
      fireEvent.click(card);

      expect(mockClick).toHaveBeenCalledTimes(1);
   });

   it('should not throw when clicked without onClick', () => {
      render(<Card>Non-clickable content</Card>);

      const card = screen.getByText('Non-clickable content').parentElement;
      expect(() => fireEvent.click(card!)).not.toThrow();
   });

   it('should render with different glass effects', () => {
      const { rerender } = render(<Card glassEffect="normal">Normal</Card>);
      expect(screen.getByText('Normal')).toBeInTheDocument();

      rerender(<Card glassEffect="strong">Strong</Card>);
      expect(screen.getByText('Strong')).toBeInTheDocument();
   });

   it('should render with hoverable prop', () => {
      render(<Card hoverable>Hoverable</Card>);
      expect(screen.getByText('Hoverable')).toBeInTheDocument();
   });

   it('should render with custom className', () => {
      render(<Card className="custom-class">Custom</Card>);
      expect(screen.getByText('Custom')).toBeInTheDocument();
   });

   it('should render with custom styles', () => {
      const customStyle = { backgroundColor: 'red', margin: '10px' };
      render(<Card style={customStyle}>Styled</Card>);
      expect(screen.getByText('Styled')).toBeInTheDocument();
   });
});
