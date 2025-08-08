import { z } from 'zod';

// Schema for validating route parameters with ID
export const IdParamsSchema = z.object({
   id: z
      .string()
      .min(1)
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform((val) => parseInt(val, 10)),
});

// Schema for validating pagination query parameters
export const PaginationQuerySchema = z.object({
   page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
});

// Schema for validating tours query parameters
export const getToursSchema = z.object({
   status: z.enum(['active', 'completed', 'archived']).optional(),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 50)),
});

// Schema for validating airports query parameters
export const getAirportsSchema = z.object({
   search: z.string().optional(),
   country: z.string().optional(),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 100)),
});

// Schema for validating pireps query parameters
export const getPirepsSchema = z.object({
   status: z.enum(['pending', 'approved', 'rejected', 'all']).optional(),
   tourId: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 50)),
});

// Schema for creating a new tour
export const createTourSchema = z.object({
   title: z.string().min(1).max(200),
   description: z.string().min(1).max(1000),
   image: z.string().url().optional(),
   status: z.enum(['active', 'completed', 'archived']).default('active'),
});

// Schema for creating a new pirep
export const createPirepSchema = z.object({
   legId: z.number().int().positive(),
   tourId: z.number().int().positive(),
   callsign: z.string().min(1).max(12),
   comment: z.string().optional().nullable(),
   aircraftType: z.string().min(1).max(50),
   flightTime: z.number().int().positive(),
   route: z.string().min(1).max(500),
   remarks: z.string().max(1000).optional(),
});

// Type exports
export type IdParams = z.infer<typeof IdParamsSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type GetToursQuery = z.infer<typeof getToursSchema>;
export type GetAirportsQuery = z.infer<typeof getAirportsSchema>;
export type GetPirepsQuery = z.infer<typeof getPirepsSchema>;
export type CreateTourData = z.infer<typeof createTourSchema>;
export type CreatePirepData = z.infer<typeof createPirepSchema>;
