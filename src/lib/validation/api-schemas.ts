import { z } from 'zod';

export const IdParamsSchema = z.object({
   id: z
      .string()
      .min(1)
      .regex(/^\d+$/, 'ID deve ser um número')
      .transform((val) => parseInt(val, 10)),
});

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

export const getToursSchema = z.object({
   status: z.enum(['active', 'completed', 'archived']).optional(),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 50)),
});

export const getAirportsSchema = z.object({
   search: z.string().optional(),
   country: z.string().optional(),
   limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 100)),
});

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

export const createTourSchema = z.object({
   title: z.string().min(1).max(200),
   description: z.string().min(1).max(1000),
   image: z.string().optional(),
   status: z.enum(['active', 'completed', 'archived']).default('active'),
});

export const createPirepSchema = z.object({
   tourId: z.number().int().positive(),
   callsign: z.string().min(1).max(12),
   comment: z.string().max(100).optional().nullable(),
});

export const createBadgeSchema = z.object({
   name: z.string().min(1).max(100),
   description: z.string().min(1).max(500).optional().nullable(),
   image: z.string().optional(),
});

export type IdParams = z.infer<typeof IdParamsSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type GetToursQuery = z.infer<typeof getToursSchema>;
export type GetAirportsQuery = z.infer<typeof getAirportsSchema>;
export type GetPirepsQuery = z.infer<typeof getPirepsSchema>;
export type CreateTourData = z.infer<typeof createTourSchema>;
export type CreatePirepData = z.infer<typeof createPirepSchema>;
export type CreateBadgeData = z.infer<typeof createBadgeSchema>;
