import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
   usersTable,
   airportsTable,
   toursTable,
   legsTable,
   badgesTable,
   userBadgesTable,
   userToursTable,
   pirepsTable,
} from '@/lib/db/schema';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
   throw new Error('DATABASE_URL cannot be undefined.');
}

const client = postgres(databaseUrl);
const db = drizzle(client);

async function seedBadges() {
   const badges = [
      {
         name: 'Primeiro Voo',
         description: 'Complete seu primeiro tour no VatTours',
         icon: '/badges/first-flight.svg',
      },
      {
         name: 'Explorador',
         description: 'Complete 5 tours diferentes',
         icon: '/badges/explorer.svg',
      },
      {
         name: 'Aventureiro',
         description: 'Complete 10 tours diferentes',
         icon: '/badges/adventurer.svg',
      },
      {
         name: 'Piloto Veterano',
         description: 'Complete 25 tours diferentes',
         icon: '/badges/veteran-pilot.svg',
      },
      {
         name: 'Ace do Céu',
         description: 'Complete 50 tours diferentes',
         icon: '/badges/sky-ace.svg',
      },
      {
         name: 'Lenda dos Céus',
         description: 'Complete 100 tours diferentes',
         icon: '/badges/sky-legend.svg',
      },
      {
         name: 'Madrugador',
         description: 'Complete um voo antes das 6h da manhã',
         icon: '/badges/early-bird.svg',
      },
      {
         name: 'Coruja Noturna',
         description: 'Complete um voo depois das 22h',
         icon: '/badges/night-owl.svg',
      },
      {
         name: 'Volta ao Mundo',
         description: 'Visite todos os continentes',
         icon: '/badges/around-world.svg',
      },
      {
         name: 'Pontualidade',
         description: 'Complete 10 voos consecutivos no horário',
         icon: '/badges/punctuality.svg',
      },
      {
         name: 'Comunicador',
         description: 'Faça contato com ATC em 20 voos',
         icon: '/badges/communicator.svg',
      },
      {
         name: 'Instrutor',
         description: 'Ajude 5 novos pilotos em seus primeiros voos',
         icon: '/badges/instructor.svg',
      },
   ];

   try {
      const insertedBadges = await db
         .insert(badgesTable)
         .values(badges)
         .returning();
      console.log('Badges inseridas com sucesso:', insertedBadges.length);
      return insertedBadges;
   } catch (error) {
      console.error('Erro ao inserir badges:', error);
      throw error;
   }
}

async function clearData() {
   console.log('Limpando dados existentes...');

   await db.delete(pirepsTable);
   await db.delete(userBadgesTable);
   await db.delete(userToursTable);
   await db.delete(legsTable);
   await db.delete(toursTable);
   await db.delete(badgesTable);
   await db.delete(airportsTable);
   await db.delete(usersTable);

   console.log('Dados limpos com sucesso!');
}

async function seedData() {
   console.log('Inserindo dados de seed...');

   await db.insert(usersTable).values([
      {
         id: '1000001',
         name: 'João Silva',
         email: 'joao.silva@email.com',
         image: null,
         role: 'user',
      },
      {
         id: '1000002',
         name: 'Maria Santos',
         email: 'maria.santos@email.com',
         image: null,
         role: 'moderator',
      },
      {
         id: '1000003',
         name: 'Pedro Admin',
         email: 'pedro.admin@email.com',
         image: null,
         role: 'admin',
      },
      {
         id: '1000004',
         name: 'Ana Owner',
         email: 'ana.owner@email.com',
         image: null,
         role: 'owner',
      },
      {
         id: '1000005',
         name: 'Carlos Piloto',
         email: 'carlos.piloto@email.com',
         image: null,
         role: 'user',
      },
   ]);

   await db.insert(airportsTable).values([
      { icao: 'SBGR', name: 'São Paulo/Guarulhos Intl', country: 'BR' },
      { icao: 'SBSP', name: 'São Paulo/Congonhas', country: 'BR' },
      { icao: 'SBRJ', name: 'Rio de Janeiro/Santos Dumont', country: 'BR' },
      { icao: 'SBGL', name: 'Rio de Janeiro/Galeão Intl', country: 'BR' },
      { icao: 'SBCF', name: 'Belo Horizonte/Confins Intl', country: 'BR' },
      { icao: 'SBRF', name: 'Recife/Guararapes Intl', country: 'BR' },
      {
         icao: 'SBSV',
         name: 'Salvador/Deputado Luís Eduardo Magalhães Intl',
         country: 'BR',
      },
      { icao: 'SBPA', name: 'Porto Alegre/Salgado Filho Intl', country: 'BR' },
      { icao: 'SBCT', name: 'Curitiba/Afonso Pena Intl', country: 'BR' },
      { icao: 'SBFZ', name: 'Fortaleza/Pinto Martins Intl', country: 'BR' },

      { icao: 'KLAX', name: 'Los Angeles Intl', country: 'US' },
      { icao: 'KJFK', name: 'John F Kennedy Intl', country: 'US' },
      { icao: 'EGLL', name: 'London Heathrow', country: 'GB' },
      { icao: 'LFPG', name: 'Paris Charles de Gaulle', country: 'FR' },
      { icao: 'EDDF', name: 'Frankfurt am Main', country: 'DE' },
      { icao: 'SAEZ', name: 'Buenos Aires/Ezeiza Intl', country: 'AR' },
      { icao: 'SPIM', name: 'Lima/Jorge Chávez Intl', country: 'PE' },
   ]);

   const tourResults = await db
      .insert(toursTable)
      .values([
         {
            title: 'Tour Brasil Sudeste',
            description:
               'Explore os principais aeroportos do Sudeste brasileiro.',
            image: 'tour-brasil-sudeste.png',
         },
         {
            title: 'Costa Brasileira',
            description: 'Voe ao longo da bela costa brasileira.',
            image: 'tour-costa-brasil.png',
         },
         {
            title: 'Capitais do Brasil',
            description: 'Visite as principais capitais do país.',
            image: 'tour-capitais-brasil.png',
         },
         {
            title: 'América do Sul Express',
            description: 'Tour pelos principais aeroportos da América do Sul.',
            image: 'tour-america-sul.png',
         },
         {
            title: 'Transatlântico',
            description: 'Voo intercontinental Brasil-Europa.',
            image: 'tour-transatlantico.png',
         },
         {
            title: 'Sul do Brasil',
            description: 'Descubra a região Sul do Brasil e suas belezas.',
            image: 'tour-sul-brasil.png',
         },
         {
            title: 'Nordeste Brasileiro',
            description: 'Explore as praias e cultura do Nordeste.',
            image: 'tour-nordeste.png',
         },
         {
            title: 'Rota do Pacífico',
            description: 'Voo pela costa oeste das Américas.',
            image: 'tour-pacifico.png',
         },
         {
            title: 'Europa Central',
            description: 'Tour pelos principais aeroportos da Europa Central.',
            image: 'tour-europa-central.png',
         },
         {
            title: 'Grandes Metrópoles',
            description: 'Conecte as maiores cidades do mundo.',
            image: 'tour-metropoles.png',
         },
      ])
      .returning({ id: toursTable.id });

   await db.insert(legsTable).values([
      {
         tourId: tourResults[0].id,
         departureIcao: 'SBGR',
         arrivalIcao: 'SBSP',
         description: 'Guarulhos para Congonhas',
         order: 1,
      },
      {
         tourId: tourResults[0].id,
         departureIcao: 'SBSP',
         arrivalIcao: 'SBRJ',
         description: 'Congonhas para Santos Dumont',
         order: 2,
      },
      {
         tourId: tourResults[0].id,
         departureIcao: 'SBRJ',
         arrivalIcao: 'SBCF',
         description: 'Santos Dumont para Confins',
         order: 3,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[1].id,
         departureIcao: 'SBRF',
         arrivalIcao: 'SBSV',
         description: 'Recife para Salvador',
         order: 1,
      },
      {
         tourId: tourResults[1].id,
         departureIcao: 'SBSV',
         arrivalIcao: 'SBGL',
         description: 'Salvador para Galeão',
         order: 2,
      },
      {
         tourId: tourResults[1].id,
         departureIcao: 'SBGL',
         arrivalIcao: 'SBGR',
         description: 'Galeão para Guarulhos',
         order: 3,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[2].id,
         departureIcao: 'SBGR',
         arrivalIcao: 'SBGL',
         description: 'São Paulo para Rio de Janeiro',
         order: 1,
      },
      {
         tourId: tourResults[2].id,
         departureIcao: 'SBGL',
         arrivalIcao: 'SBCF',
         description: 'Rio para Belo Horizonte',
         order: 2,
      },
      {
         tourId: tourResults[2].id,
         departureIcao: 'SBCF',
         arrivalIcao: 'SBSV',
         description: 'Belo Horizonte para Salvador',
         order: 3,
      },
      {
         tourId: tourResults[2].id,
         departureIcao: 'SBSV',
         arrivalIcao: 'SBFZ',
         description: 'Salvador para Fortaleza',
         order: 4,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[3].id,
         departureIcao: 'SBGR',
         arrivalIcao: 'SAEZ',
         description: 'São Paulo para Buenos Aires',
         order: 1,
      },
      {
         tourId: tourResults[3].id,
         departureIcao: 'SAEZ',
         arrivalIcao: 'SPIM',
         description: 'Buenos Aires para Lima',
         order: 2,
      },
      {
         tourId: tourResults[3].id,
         departureIcao: 'SPIM',
         arrivalIcao: 'SBGR',
         description: 'Lima para São Paulo',
         order: 3,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[4].id,
         departureIcao: 'SBGR',
         arrivalIcao: 'LFPG',
         description: 'São Paulo para Paris',
         order: 1,
      },
      {
         tourId: tourResults[4].id,
         departureIcao: 'LFPG',
         arrivalIcao: 'EDDF',
         description: 'Paris para Frankfurt',
         order: 2,
      },
      {
         tourId: tourResults[4].id,
         departureIcao: 'EDDF',
         arrivalIcao: 'EGLL',
         description: 'Frankfurt para Londres',
         order: 3,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[5].id,
         departureIcao: 'SBGR',
         arrivalIcao: 'SBCT',
         description: 'São Paulo para Curitiba',
         order: 1,
      },
      {
         tourId: tourResults[5].id,
         departureIcao: 'SBCT',
         arrivalIcao: 'SBPA',
         description: 'Curitiba para Porto Alegre',
         order: 2,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[6].id,
         departureIcao: 'SBFZ',
         arrivalIcao: 'SBRF',
         description: 'Fortaleza para Recife',
         order: 1,
      },
      {
         tourId: tourResults[6].id,
         departureIcao: 'SBRF',
         arrivalIcao: 'SBSV',
         description: 'Recife para Salvador',
         order: 2,
      },
      {
         tourId: tourResults[6].id,
         departureIcao: 'SBSV',
         arrivalIcao: 'SBGL',
         description: 'Salvador para Rio de Janeiro',
         order: 3,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[7].id,
         departureIcao: 'SPIM',
         arrivalIcao: 'KLAX',
         description: 'Lima para Los Angeles',
         order: 1,
      },
      {
         tourId: tourResults[7].id,
         departureIcao: 'KLAX',
         arrivalIcao: 'KJFK',
         description: 'Los Angeles para Nova York',
         order: 2,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[8].id,
         departureIcao: 'LFPG',
         arrivalIcao: 'EDDF',
         description: 'Paris para Frankfurt',
         order: 1,
      },
      {
         tourId: tourResults[8].id,
         departureIcao: 'EDDF',
         arrivalIcao: 'EGLL',
         description: 'Frankfurt para Londres',
         order: 2,
      },
   ]);

   await db.insert(legsTable).values([
      {
         tourId: tourResults[9].id,
         departureIcao: 'KJFK',
         arrivalIcao: 'EGLL',
         description: 'Nova York para Londres',
         order: 1,
      },
      {
         tourId: tourResults[9].id,
         departureIcao: 'EGLL',
         arrivalIcao: 'LFPG',
         description: 'Londres para Paris',
         order: 2,
      },
      {
         tourId: tourResults[9].id,
         departureIcao: 'LFPG',
         arrivalIcao: 'SBGR',
         description: 'Paris para São Paulo',
         order: 3,
      },
   ]);

   const badgeResults = await seedBadges();

   await db.insert(userBadgesTable).values([
      {
         userId: '1000001',
         badgeId: badgeResults[0].id,
         earnedAt: new Date('2024-01-15'),
      },
      {
         userId: '1000001',
         badgeId: badgeResults[1].id,
         earnedAt: new Date('2024-02-20'),
      },
      {
         userId: '1000001',
         badgeId: badgeResults[6].id,
         earnedAt: new Date('2024-03-10'),
      },

      {
         userId: '1000002',
         badgeId: badgeResults[0].id,
         earnedAt: new Date('2023-05-10'),
      },
      {
         userId: '1000002',
         badgeId: badgeResults[1].id,
         earnedAt: new Date('2023-06-15'),
      },
      {
         userId: '1000002',
         badgeId: badgeResults[2].id,
         earnedAt: new Date('2023-08-20'),
      },
      {
         userId: '1000002',
         badgeId: badgeResults[3].id,
         earnedAt: new Date('2023-12-25'),
      },
      {
         userId: '1000002',
         badgeId: badgeResults[7].id,
         earnedAt: new Date('2023-09-30'),
      },
      {
         userId: '1000002',
         badgeId: badgeResults[9].id,
         earnedAt: new Date('2024-01-05'),
      },

      {
         userId: '1000005',
         badgeId: badgeResults[0].id,
         earnedAt: new Date('2023-01-01'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[1].id,
         earnedAt: new Date('2023-02-01'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[2].id,
         earnedAt: new Date('2023-04-01'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[3].id,
         earnedAt: new Date('2023-08-01'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[4].id,
         earnedAt: new Date('2024-01-01'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[6].id,
         earnedAt: new Date('2023-03-15'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[7].id,
         earnedAt: new Date('2023-07-20'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[8].id,
         earnedAt: new Date('2023-11-10'),
      },
      {
         userId: '1000005',
         badgeId: badgeResults[10].id,
         earnedAt: new Date('2023-12-15'),
      },
   ]);

   await db.insert(userToursTable).values([
      {
         userId: '1000001',
         tourId: tourResults[0].id,
         completedAt: new Date('2024-02-15'),
      },
      {
         userId: '1000002',
         tourId: tourResults[0].id,
         completedAt: new Date('2023-07-10'),
      },
      {
         userId: '1000002',
         tourId: tourResults[1].id,
         completedAt: new Date('2023-09-15'),
      },
      {
         userId: '1000002',
         tourId: tourResults[2].id,
         completedAt: new Date('2023-12-20'),
      },
      {
         userId: '1000002',
         tourId: tourResults[5].id,
         completedAt: new Date('2024-01-10'),
      },
      {
         userId: '1000002',
         tourId: tourResults[6].id,
         completedAt: new Date('2024-03-05'),
      },
      {
         userId: '1000005',
         tourId: tourResults[0].id,
         completedAt: new Date('2023-02-28'),
      },
      {
         userId: '1000005',
         tourId: tourResults[1].id,
         completedAt: new Date('2023-04-15'),
      },
      {
         userId: '1000005',
         tourId: tourResults[2].id,
         completedAt: new Date('2023-08-10'),
      },
      {
         userId: '1000005',
         tourId: tourResults[3].id,
         completedAt: new Date('2023-11-05'),
      },
      {
         userId: '1000005',
         tourId: tourResults[4].id,
         completedAt: new Date('2024-01-20'),
      },
      {
         userId: '1000005',
         tourId: tourResults[5].id,
         completedAt: new Date('2024-02-10'),
      },
      {
         userId: '1000005',
         tourId: tourResults[7].id,
         completedAt: new Date('2024-03-15'),
      },
      {
         userId: '1000005',
         tourId: tourResults[8].id,
         completedAt: new Date('2024-04-01'),
      },
   ]);

   const allLegs = await db
      .select({ id: legsTable.id, tourId: legsTable.tourId })
      .from(legsTable);

   const pirepData = [];

   const joaoLegs = allLegs.filter((leg) => leg.tourId === tourResults[0].id);
   joaoLegs.forEach((leg, index) => {
      pirepData.push({
         userId: '1000001',
         legId: leg.id,
         submittedAt: new Date('2024-02-15'),
         status: 'approved' as const,
         callsign: `TAM${3000 + index}`,
         comment: `Voo realizado com sucesso. Leg ${index + 1} do tour.`,
         reviewerId: '1000002',
         reviewedAt: new Date('2024-02-16'),
         reviewNote: 'PIREP aprovado. Bom voo!',
         logbookUrl: null,
      });
   });

   const mariaLegs = allLegs.filter(
      (leg) =>
         leg.tourId === tourResults[0].id ||
         leg.tourId === tourResults[1].id ||
         leg.tourId === tourResults[2].id,
   );
   mariaLegs.slice(0, 8).forEach((leg, index) => {
      pirepData.push({
         userId: '1000002',
         legId: leg.id,
         submittedAt: new Date(2023, 5 + Math.floor(index / 3), 15),
         status: 'approved' as const,
         callsign: `GOL${4000 + index}`,
         comment: `Excelente voo realizado conforme planejado.`,
         reviewerId: '1000003',
         reviewedAt: new Date(2023, 5 + Math.floor(index / 3), 16),
         reviewNote: 'PIREP aprovado.',
         logbookUrl: null,
      });
   });

   const carlosLegs = allLegs.slice(0, 15);
   carlosLegs.forEach((leg, index) => {
      let status: 'pending' | 'approved' | 'rejected' = 'approved';
      let reviewerId: string | null = '1000002';
      let reviewedAt: Date | null = new Date(
         2023,
         1 + Math.floor(index / 3),
         20,
      );
      let reviewNote: string | null = 'PIREP aprovado.';

      if (index === 12) {
         status = 'pending';
         reviewerId = null;
         reviewedAt = null;
         reviewNote = null;
      } else if (index === 8) {
         status = 'rejected';
         reviewNote = 'Callsign incorreto. Favor reenviar.';
      }

      pirepData.push({
         userId: '1000005',
         legId: leg.id,
         submittedAt: new Date(2023, 1 + Math.floor(index / 3), 18),
         status,
         callsign: `AZU${5000 + index}`,
         comment: `Voo ${index + 1} realizado. Tudo conforme o planejado.`,
         reviewerId,
         reviewedAt,
         reviewNote,
         logbookUrl: null,
      });
   });

   pirepData.push(
      {
         userId: '1000001',
         legId: allLegs[10].id,
         submittedAt: new Date(),
         status: 'pending' as const,
         callsign: 'TAM8888',
         comment: 'Voo recente aguardando aprovação.',
         reviewerId: null,
         reviewedAt: null,
         reviewNote: null,
         logbookUrl: null,
      },
      {
         userId: '1000002',
         legId: allLegs[11].id,
         submittedAt: new Date(Date.now() - 86400000),
         status: 'pending' as const,
         callsign: 'GOL9999',
         comment: 'Aguardando revisão.',
         reviewerId: null,
         reviewedAt: null,
         reviewNote: null,
         logbookUrl: null,
      },
   );

   await db.insert(pirepsTable).values(pirepData);

   console.log('Dados de seed inseridos com sucesso!');
   console.log(`- ${5} usuários criados`);
   console.log(`- ${17} aeroportos inseridos`);
   console.log(`- ${10} tours criados`);
   console.log(`- ${badgeResults.length} badges inseridas`);
   console.log(`- ${pirepData.length} PIREPs criados`);
}

async function seed() {
   try {
      await clearData();
      await seedData();
      console.log('Seed executado com sucesso!');
   } catch (error) {
      console.error('Erro durante o seed:', error);
   } finally {
      await client.end();
   }
}

seed();
