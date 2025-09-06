import { render, screen } from '@testing-library/react';
import TourInfo from './tour-info';

jest.mock('@/lib/db', () => ({
   db: {
      query: {
         toursTable: {
            findFirst: jest.fn(),
         },
         legsTable: {
            findMany: jest.fn(),
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

   const mockLegs = [
      {
         id: 1,
         tourId: 1,
         departureIcao: 'KJFK',
         arrivalIcao: 'KLAX',
         description: 'New York to Los Angeles',
         order: 1,
      },
      {
         id: 2,
         tourId: 1,
         departureIcao: 'KLAX',
         arrivalIcao: 'KSFO',
         description: 'Los Angeles to San Francisco',
         order: 2,
      },
   ];

   beforeEach(() => {
      jest.clearAllMocks();
      // Setup default mocks
      (mockDb.query.toursTable.findFirst as jest.Mock).mockResolvedValue(mockTour);
      (mockDb.query.legsTable.findMany as jest.Mock).mockResolvedValue(mockLegs);
   });

   it('should render tour information correctly', async () => {
      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Tour Test')).toBeInTheDocument();
      expect(screen.getByText('Uma descrição de teste')).toBeInTheDocument();
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
      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Estatísticas')).toBeInTheDocument();
      expect(screen.getByText('Progresso')).toBeInTheDocument();
      expect(screen.getByText('Badges Disponíveis')).toBeInTheDocument();
      expect(screen.getByText('Explorador')).toBeInTheDocument();
      expect(screen.getByText('Aventureiro')).toBeInTheDocument();
   });

   it('should render tour status cards', async () => {
      const TourInfoComponent = await TourInfo({ tourId: '1' });
      render(TourInfoComponent);

      expect(screen.getByText('Etapas:')).toBeInTheDocument();
      expect(screen.getByText('Dificuldade:')).toBeInTheDocument();
      expect(screen.getByText('Concluído:')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Intermediário')).toBeInTheDocument();
   });
});
