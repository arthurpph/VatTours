import { render, screen } from '@testing-library/react';
import TourInfo from './tour-info';

jest.mock('@/lib/db', () => ({
   db: {
      query: {
         toursTable: {
            findFirst: jest.fn(),
         },
      },
   },
}));

jest.mock('next/image', () => {
   return function MockImage({
      src,
      alt,
      ...props
   }: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      style?: React.CSSProperties;
      className?: string;
   }) {
      const { width, height, style, className } = props;
      return (
         <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={style}
            className={className}
         />
      );
   };
});

import { db } from '@/lib/db';
const mockDb = db as jest.Mocked<typeof db>;

describe('TourInfo Component', () => {
   const mockTour = {
      id: 1,
      title: 'Tour Test',
      description: 'Uma descrição de teste',
      image: 'https://example.com/image.jpg',
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('should render tour information correctly', async () => {
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(
         mockTour,
      );

      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Tour Test')).toBeInTheDocument();
      expect(screen.getByText('Uma descrição de teste')).toBeInTheDocument();
      expect(screen.getAllByText('Tour Ativo')).toHaveLength(2); // Aparece no status e no card
   });

   it('should render not found message when tour does not exist', async () => {
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(null);

      const TourInfoComponent = await TourInfo({ tourId: '999' });
      render(TourInfoComponent);

      expect(screen.getByText('Tour não encontrado')).toBeInTheDocument();
      expect(
         screen.getByText(
            'O tour que você está procurando não existe ou foi removido.',
         ),
      ).toBeInTheDocument();
   });

   it('should render image when valid URL is provided', async () => {
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(
         mockTour,
      );

      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      const image = screen.getByAltText('Tour Test');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
   });

   it('should render placeholder when invalid image URL', async () => {
      const tourWithInvalidImage = { ...mockTour, image: 'invalid-url' };
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(
         tourWithInvalidImage,
      );

      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Imagem não disponível')).toBeInTheDocument();
   });

   it('should render tour features', async () => {
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(
         mockTour,
      );

      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Recursos Inclusos')).toBeInTheDocument();
      expect(screen.getByText('Rotas detalhadas')).toBeInTheDocument();
      expect(screen.getByText('Pontos de interesse')).toBeInTheDocument();
      expect(screen.getByText('Informações técnicas')).toBeInTheDocument();
      expect(screen.getByText('Suporte completo')).toBeInTheDocument();
   });

   it('should render tour status cards', async () => {
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(
         mockTour,
      );

      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Duração')).toBeInTheDocument();
      expect(screen.getByText('Tipo')).toBeInTheDocument();
      expect(screen.getByText('Flexível')).toBeInTheDocument();
      expect(screen.getByText('Tour Guiado')).toBeInTheDocument();
   });
});
