import { type } from 'arktype';

export const HomeStatusSchema = type({
  appName: 'string',
  version: 'string',
  status: "'healthy' | 'maintenance'",
});

export type HomeStatus = typeof HomeStatusSchema.infer;
