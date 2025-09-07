import {
   IcaoSchema,
   UserSchema,
   TourSchema,
   LegSchema,
   AirportSchema,
   PirepSchema,
} from './validation';

describe('Validation Schemas', () => {
   describe('IcaoSchema', () => {
      it('should validate correct ICAO codes', () => {
         expect(IcaoSchema.safeParse('SBGR').success).toBe(true);
         expect(IcaoSchema.safeParse('OMDB').success).toBe(true);
         expect(IcaoSchema.safeParse('KJFK').success).toBe(true);
         expect(IcaoSchema.safeParse('EGLL').success).toBe(true);
         expect(IcaoSchema.safeParse('1234').success).toBe(true);
      });

      it('should reject invalid ICAO codes', () => {
         expect(IcaoSchema.safeParse('ABC').success).toBe(false); // too short
         expect(IcaoSchema.safeParse('ABCDE').success).toBe(false); // too long
         expect(IcaoSchema.safeParse('ab12').success).toBe(false); // lowercase
         expect(IcaoSchema.safeParse('AB-2').success).toBe(false); // special chars
         expect(IcaoSchema.safeParse('').success).toBe(false); // empty
      });
   });

   describe('UserSchema', () => {
      const validUser = {
         id: 'user123',
         name: 'John Doe',
         email: 'john@example.com',
         image: 'https://example.com/avatar.jpg',
         role: 'user' as const,
      };

      it('should validate valid user object', () => {
         expect(UserSchema.safeParse(validUser).success).toBe(true);
      });

      it('should validate user without optional image', () => {
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { image, ...userWithoutImage } = validUser;
         expect(UserSchema.safeParse(userWithoutImage).success).toBe(true);
      });

      it('should reject invalid email', () => {
         const invalidUser = { ...validUser, email: 'invalid-email' };
         expect(UserSchema.safeParse(invalidUser).success).toBe(false);
      });

      it('should reject empty name', () => {
         const invalidUser = { ...validUser, name: '' };
         expect(UserSchema.safeParse(invalidUser).success).toBe(false);
      });

      it('should reject invalid role', () => {
         const invalidUser = { ...validUser, role: 'invalid' as never };
         expect(UserSchema.safeParse(invalidUser).success).toBe(false);
      });

      it('should reject invalid image URL', () => {
         const invalidUser = { ...validUser, image: 'not-a-url' };
         expect(UserSchema.safeParse(invalidUser).success).toBe(false);
      });
   });

   describe('TourSchema', () => {
      const validTour = {
         id: 1,
         title: 'Amazing Tour',
         description: 'A great tour experience',
         image: 'base64encodedimagedata',
         createdAt: new Date(),
      };

      it('should validate valid tour object', () => {
         expect(TourSchema.safeParse(validTour).success).toBe(true);
      });

      it('should validate tour without optional fields', () => {
         const minimalTour = {
            title: 'Basic Tour',
         };
         expect(TourSchema.safeParse(minimalTour).success).toBe(true);
      });

      it('should reject empty title', () => {
         const invalidTour = { ...validTour, title: '' };
         expect(TourSchema.safeParse(invalidTour).success).toBe(false);
      });

      it('should accept any string as image', () => {
         const tourWithBase64 = { ...validTour, image: 'base64data' };
         expect(TourSchema.safeParse(tourWithBase64).success).toBe(true);
      });

      it('should reject negative ID', () => {
         const invalidTour = { ...validTour, id: -1 };
         expect(TourSchema.safeParse(invalidTour).success).toBe(false);
      });
   });

   describe('LegSchema', () => {
      const validLeg = {
         id: 1,
         tourId: 1,
         departureIcao: 'SBGR',
         arrivalIcao: 'OMDB',
         description: 'Flight from São Paulo to Dubai',
         order: 0,
      };

      it('should validate valid leg object', () => {
         expect(LegSchema.safeParse(validLeg).success).toBe(true);
      });

      it('should reject invalid ICAO codes', () => {
         const invalidLeg = { ...validLeg, departureIcao: 'ABC' };
         expect(LegSchema.safeParse(invalidLeg).success).toBe(false);
      });

      it('should reject negative tourId', () => {
         const invalidLeg = { ...validLeg, tourId: -1 };
         expect(LegSchema.safeParse(invalidLeg).success).toBe(false);
      });

      it('should reject negative order', () => {
         const invalidLeg = { ...validLeg, order: -1 };
         expect(LegSchema.safeParse(invalidLeg).success).toBe(false);
      });
   });

   describe('AirportSchema', () => {
      const validAirport = {
         icao: 'SBGR',
         name: 'São Paulo/Guarulhos International Airport',
         country: 'BR' as const,
      };

      it('should validate valid airport object', () => {
         expect(AirportSchema.safeParse(validAirport).success).toBe(true);
      });

      it('should reject invalid ICAO', () => {
         const invalidAirport = { ...validAirport, icao: 'ABC' };
         expect(AirportSchema.safeParse(invalidAirport).success).toBe(false);
      });

      it('should reject empty name', () => {
         const invalidAirport = { ...validAirport, name: '' };
         expect(AirportSchema.safeParse(invalidAirport).success).toBe(false);
      });

      it('should reject invalid country code', () => {
         const invalidAirport = {
            ...validAirport,
            country: 'INVALID' as never,
         };
         expect(AirportSchema.safeParse(invalidAirport).success).toBe(false);
      });
   });

   describe('PirepSchema', () => {
      const validPirep = {
         id: 1,
         userId: 'user123',
         legId: 1,
         submittedAt: new Date(),
         status: 'pending' as const,
         callsign: 'UAE406',
         comment: 'Great flight!',
         reviewerId: 'reviewer123',
         reviewedAt: new Date(),
         reviewNote: 'Approved',
         logbookUrl: 'https://example.com/logbook',
      };

      it('should validate valid PIREP object', () => {
         expect(PirepSchema.safeParse(validPirep).success).toBe(true);
      });

      it('should validate minimal PIREP', () => {
         const minimalPirep = {
            userId: 'user123',
            legId: 1,
            callsign: 'UAE406',
         };
         expect(PirepSchema.safeParse(minimalPirep).success).toBe(true);
      });

      it('should reject empty callsign', () => {
         const invalidPirep = { ...validPirep, callsign: '' };
         expect(PirepSchema.safeParse(invalidPirep).success).toBe(false);
      });

      it('should reject callsign longer than 12 characters', () => {
         const invalidPirep = {
            ...validPirep,
            callsign: 'VERYLONGCALLSIGN123',
         };
         expect(PirepSchema.safeParse(invalidPirep).success).toBe(false);
      });

      it('should reject invalid status', () => {
         const invalidPirep = { ...validPirep, status: 'invalid' as never };
         expect(PirepSchema.safeParse(invalidPirep).success).toBe(false);
      });

      it('should reject invalid logbook URL', () => {
         const invalidPirep = { ...validPirep, logbookUrl: 'not-a-url' };
         expect(PirepSchema.safeParse(invalidPirep).success).toBe(false);
      });

      it('should allow null comment', () => {
         const pirepWithNullComment = { ...validPirep, comment: null };
         expect(PirepSchema.safeParse(pirepWithNullComment).success).toBe(true);
      });
   });
});
