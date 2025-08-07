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
      id: 'user1',
      name: 'Alice',
      email: 'alice@email.com',
      image: null,
      role: 'user',
    },
    {
      id: 'user2',
      name: 'Bob',
      email: 'bob@email.com',
      image: null,
      role: 'admin',
    },
  ]);

  await db.insert(airportsTable).values([
    { icao: 'SBGR', name: 'Guarulhos Intl', country: 'BR' },
    { icao: 'SBSP', name: 'Congonhas', country: 'BR' },
    { icao: 'SBRJ', name: 'Santos Dumont', country: 'BR' },
  ]);

  const tourResult = await db.insert(toursTable).values([
    {
      title: 'Tour Brasil',
      description: 'Conheça os principais aeroportos do Brasil.',
      image: 'tour-brasil.png',
    },
  ]).returning({ id: toursTable.id });
  const tourId = tourResult[0].id;

  const legsResult = await db.insert(legsTable).values([
    {
      tourId,
      departureIcao: 'SBGR',
      arrivalIcao: 'SBSP',
      description: 'De Guarulhos para Congonhas',
      order: 1,
    },
    {
      tourId,
      departureIcao: 'SBSP',
      arrivalIcao: 'SBRJ',
      description: 'De Congonhas para Santos Dumont',
      order: 2,
    },
  ]).returning({ id: legsTable.id });

  const badgeResult = await db.insert(badgesTable).values([
    {
      name: 'Primeiro Voo',
      description: 'Complete seu primeiro voo.',
      icon: 'first-flight.png',
    },
  ]).returning({ id: badgesTable.id });
  const badgeId = badgeResult[0].id;

  await db.insert(userBadgesTable).values([
    {
      userId: 'user1',
      badgeId,
      earnedAt: new Date(),
    },
  ]);

  await db.insert(userToursTable).values([
    {
      userId: 'user1',
      tourId,
      completedAt: new Date(),
    },
  ]);

  console.log('Dados de seed inseridos com sucesso!');
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
